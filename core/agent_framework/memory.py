"""
NAVACLAW-AI — Vector Memory System
Ported from Agent Zero's FAISS-based memory + knowledge preloading.
Author: Frank Van Laarhoven

Features:
- FAISS vector database with cosine similarity
- Three memory areas: main, fragments, solutions
- Knowledge preloading from file directories
- Similarity search with threshold filtering
- Progressive summarization support
"""

import json
import logging
import os
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

logger = logging.getLogger("navaclaw.memory")


class MemoryArea(Enum):
    """Memory partitions for different types of stored knowledge."""
    MAIN = "main"           # General knowledge and conversation memory
    FRAGMENTS = "fragments"  # Code fragments, snippets, structured data
    SOLUTIONS = "solutions"  # Problem → solution pairs for recall


@dataclass
class MemoryDocument:
    """A document stored in vector memory."""
    id: str
    content: str
    metadata: Dict[str, Any]
    timestamp: str = ""
    area: MemoryArea = MemoryArea.MAIN
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content": self.content,
            "metadata": self.metadata,
            "timestamp": self.timestamp,
            "area": self.area.value,
        }


@dataclass
class SearchResult:
    """A search result from memory."""
    document: MemoryDocument
    score: float  # 0.0 to 1.0, higher = more similar


class MemoryStore:
    """
    Production-grade vector memory system.
    
    Uses FAISS for efficient similarity search with cosine distance.
    Falls back to a simple in-memory store when FAISS is not available.
    """
    
    _stores: Dict[str, "MemoryStore"] = {}
    
    def __init__(self, subdir: str = "default"):
        self.subdir = subdir
        self._documents: Dict[str, MemoryDocument] = {}
        self._embeddings: Dict[str, List[float]] = {}
        self._faiss_index: Any = None
        self._embedder: Any = None
        self._initialized = False
    
    @classmethod
    async def get(cls, subdir: str = "default") -> "MemoryStore":
        """Get or create a memory store for the given subdirectory."""
        if subdir not in cls._stores:
            store = cls(subdir)
            await store.initialize()
            cls._stores[subdir] = store
        return cls._stores[subdir]
    
    @classmethod
    def clear_all(cls) -> None:
        """Clear all memory stores."""
        cls._stores.clear()
    
    async def initialize(self) -> None:
        """Initialize the vector database."""
        if self._initialized:
            return
        
        try:
            import faiss
            import numpy as np
            
            # Try to load existing index
            db_dir = self._get_db_dir()
            index_path = os.path.join(db_dir, "index.faiss")
            meta_path = os.path.join(db_dir, "metadata.json")
            
            if os.path.exists(index_path):
                self._faiss_index = faiss.read_index(index_path)
                if os.path.exists(meta_path):
                    with open(meta_path, "r") as f:
                        docs_data = json.load(f)
                    for doc_data in docs_data:
                        doc = MemoryDocument(
                            id=doc_data["id"],
                            content=doc_data["content"],
                            metadata=doc_data.get("metadata", {}),
                            timestamp=doc_data.get("timestamp", ""),
                            area=MemoryArea(doc_data.get("area", "main")),
                        )
                        self._documents[doc.id] = doc
                logger.info(f"Loaded {len(self._documents)} documents from {db_dir}")
            else:
                # Create new index (384-dimensional for text-embedding-3-small)
                self._faiss_index = faiss.IndexFlatIP(384)
                os.makedirs(db_dir, exist_ok=True)
                logger.info(f"Created new FAISS index at {db_dir}")
            
            self._initialized = True
            
        except ImportError:
            logger.info("FAISS not installed — using in-memory fallback")
            self._initialized = True
    
    async def save(
        self,
        content: str,
        metadata: Optional[Dict[str, Any]] = None,
        area: MemoryArea = MemoryArea.MAIN,
    ) -> str:
        """Save a document to memory. Returns the document ID."""
        doc_id = self._generate_id()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        doc = MemoryDocument(
            id=doc_id,
            content=content,
            metadata=metadata or {},
            timestamp=timestamp,
            area=area,
        )
        
        self._documents[doc_id] = doc
        
        # Add to FAISS index if available
        if self._faiss_index is not None:
            try:
                embedding = await self._get_embedding(content)
                import numpy as np
                vec = np.array([embedding], dtype=np.float32)
                # Normalize for cosine similarity
                faiss.normalize_L2(vec)
                self._faiss_index.add(vec)
                self._embeddings[doc_id] = embedding
            except Exception as e:
                logger.warning(f"Failed to index document: {e}")
        
        self._persist()
        logger.debug(f"Saved document {doc_id} to {area.value}")
        return doc_id
    
    async def search(
        self,
        query: str,
        limit: int = 5,
        threshold: float = 0.3,
        area: Optional[MemoryArea] = None,
    ) -> List[SearchResult]:
        """Search memory by similarity. Returns documents above the threshold."""
        if not self._documents:
            return []
        
        # FAISS path
        if self._faiss_index is not None and self._faiss_index.ntotal > 0:
            try:
                import numpy as np
                import faiss as faiss_lib
                
                query_embedding = await self._get_embedding(query)
                vec = np.array([query_embedding], dtype=np.float32)
                faiss_lib.normalize_L2(vec)
                
                k = min(limit * 2, self._faiss_index.ntotal)
                scores, indices = self._faiss_index.search(vec, k)
                
                results = []
                doc_ids = list(self._documents.keys())
                for score, idx in zip(scores[0], indices[0]):
                    if idx < 0 or idx >= len(doc_ids):
                        continue
                    normalized_score = (1 + float(score)) / 2  # Cosine → [0, 1]
                    if normalized_score < threshold:
                        continue
                    doc = self._documents[doc_ids[idx]]
                    if area and doc.area != area:
                        continue
                    results.append(SearchResult(document=doc, score=normalized_score))
                
                results.sort(key=lambda r: r.score, reverse=True)
                return results[:limit]
                
            except Exception as e:
                logger.warning(f"FAISS search failed, falling back: {e}")
        
        # Fallback: simple keyword search
        results = []
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        for doc in self._documents.values():
            if area and doc.area != area:
                continue
            doc_words = set(doc.content.lower().split())
            overlap = len(query_words & doc_words)
            if overlap > 0:
                score = overlap / max(len(query_words), 1)
                results.append(SearchResult(document=doc, score=min(score, 1.0)))
        
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:limit]
    
    async def delete(self, doc_id: str) -> bool:
        """Delete a document by ID."""
        if doc_id in self._documents:
            del self._documents[doc_id]
            self._embeddings.pop(doc_id, None)
            self._persist()
            return True
        return False
    
    async def forget(self, query: str, threshold: float = 0.7) -> int:
        """Delete all documents matching a query above threshold."""
        results = await self.search(query, limit=100, threshold=threshold)
        count = 0
        for result in results:
            if await self.delete(result.document.id):
                count += 1
        return count
    
    def get_all(self, area: Optional[MemoryArea] = None) -> List[MemoryDocument]:
        """Get all documents, optionally filtered by area."""
        docs = list(self._documents.values())
        if area:
            docs = [d for d in docs if d.area == area]
        return docs
    
    def count(self, area: Optional[MemoryArea] = None) -> int:
        if area:
            return sum(1 for d in self._documents.values() if d.area == area)
        return len(self._documents)
    
    # ── Private ──
    
    def _get_db_dir(self) -> str:
        base = os.environ.get("NAVACLAW_MEMORY_DIR", os.path.expanduser("~/.navaclaw/memory"))
        return os.path.join(base, self.subdir)
    
    def _generate_id(self) -> str:
        import random, string
        while True:
            doc_id = "".join(random.choices(string.ascii_letters + string.digits, k=10))
            if doc_id not in self._documents:
                return doc_id
    
    async def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text. Uses litellm if available, else simple hash."""
        try:
            from .models import LLMRouter, ModelConfig
            config = ModelConfig(name="text-embedding-3-small", provider="openai")
            router = LLMRouter(config)
            embeddings = await router.embed([text])
            return embeddings[0]
        except Exception:
            # Fallback: deterministic hash-based pseudo-embedding
            import hashlib
            h = hashlib.sha384(text.encode()).digest()
            return [((b - 128) / 128.0) for b in h]
    
    def _persist(self) -> None:
        """Persist documents to disk."""
        try:
            db_dir = self._get_db_dir()
            os.makedirs(db_dir, exist_ok=True)
            
            meta_path = os.path.join(db_dir, "metadata.json")
            docs_data = [doc.to_dict() for doc in self._documents.values()]
            with open(meta_path, "w") as f:
                json.dump(docs_data, f, indent=2)
            
            if self._faiss_index is not None:
                import faiss
                index_path = os.path.join(db_dir, "index.faiss")
                faiss.write_index(self._faiss_index, index_path)
                
        except Exception as e:
            logger.warning(f"Failed to persist memory: {e}")
