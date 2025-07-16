#!/usr/bin/env python3
"""
RAG Pipeline with LangChain Integration
Provides retrieval-augmented generation for web content analysis.
"""

import asyncio
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from pathlib import Path
import json

# LangChain imports
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma, FAISS
from langchain_community.document_loaders import AsyncChromiumLoader

# Local imports
from ..providers import CrawlResponse


@dataclass
class RAGConfig:
    """Configuration for RAG pipeline."""
    # LLM Configuration
    llm_model: str = "gpt-3.5-turbo"
    llm_temperature: float = 0.1
    llm_max_tokens: int = 2000
    
    # Embedding Configuration
    embedding_model: str = "text-embedding-ada-002"
    
    # Vector Store Configuration
    vector_store_type: str = "chroma"  # "chroma" or "faiss"
    vector_store_path: str = "./vector_store"
    
    # Text Processing
    chunk_size: int = 1000
    chunk_overlap: int = 200
    max_chunks: int = 10
    
    # RAG Configuration
    similarity_threshold: float = 0.7
    max_retrieved_docs: int = 5


class RAGPipeline:
    """RAG pipeline for web content analysis."""
    
    def __init__(self, config: RAGConfig, openai_api_key: str):
        self.config = config
        self.openai_api_key = openai_api_key
        
        # Initialize components
        self.llm = ChatOpenAI(
            model=config.llm_model,
            temperature=config.llm_temperature,
            max_tokens=config.llm_max_tokens,
            openai_api_key=openai_api_key
        )
        
        self.embeddings = OpenAIEmbeddings(
            model=config.embedding_model,
            openai_api_key=openai_api_key
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=config.chunk_overlap,
            length_function=len,
        )
        
        self.vector_store = None
        self.qa_chain = None
        
        # Create vector store directory
        Path(config.vector_store_path).mkdir(parents=True, exist_ok=True)
    
    async def initialize_vector_store(self, documents: List[Document] = None):
        """Initialize or load vector store."""
        if documents is None:
            documents = []
        
        # Split documents into chunks
        if documents:
            texts = self.text_splitter.split_documents(documents)
        else:
            texts = []
        
        # Create vector store
        if self.config.vector_store_type == "chroma":
            self.vector_store = Chroma.from_documents(
                documents=texts,
                embedding=self.embeddings,
                persist_directory=self.config.vector_store_path
            )
        elif self.config.vector_store_type == "faiss":
            self.vector_store = FAISS.from_documents(
                documents=texts,
                embedding=self.embeddings
            )
            # Save FAISS index
            self.vector_store.save_local(self.config.vector_store_path)
        else:
            raise ValueError(f"Unsupported vector store type: {self.config.vector_store_type}")
        
        # Create QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(
                search_kwargs={
                    "k": self.config.max_retrieved_docs,
                    "score_threshold": self.config.similarity_threshold
                }
            ),
            return_source_documents=True
        )
    
    async def load_web_content(self, urls: List[str]) -> List[Document]:
        """Load web content using AsyncChromiumLoader."""
        try:
            loader = AsyncChromiumLoader(urls)
            documents = await loader.aload()
            return documents
        except Exception as e:
            print(f"Error loading web content: {e}")
            return []
    
    async def add_crawl_response(self, response: CrawlResponse):
        """Add a crawl response to the vector store."""
        if not response.content or response.error:
            return
        
        # Create document from crawl response
        document = Document(
            page_content=response.content,
            metadata={
                "url": response.url,
                "title": response.metadata.get("title", ""),
                "timestamp": response.timestamp.isoformat() if response.timestamp else "",
                "provider": response.provider.value if response.provider else "",
                "status_code": response.status_code,
                "source": "crawl_response"
            }
        )
        
        # Split document into chunks
        texts = self.text_splitter.split_documents([document])
        
        # Add to vector store
        if self.vector_store is None:
            await self.initialize_vector_store()
        
        if self.config.vector_store_type == "chroma":
            self.vector_store.add_documents(texts)
        elif self.config.vector_store_type == "faiss":
            self.vector_store.add_documents(texts)
            self.vector_store.save_local(self.config.vector_store_path)
    
    async def query(self, question: str, context: str = "") -> Dict[str, Any]:
        """Query the RAG pipeline."""
        if not self.qa_chain:
            raise ValueError("RAG pipeline not initialized. Call initialize_vector_store() first.")
        
        # Prepare query with context if provided
        if context:
            full_question = f"Context: {context}\n\nQuestion: {question}"
        else:
            full_question = question
        
        try:
            result = self.qa_chain({"query": full_question})
            
            return {
                "answer": result["result"],
                "source_documents": [
                    {
                        "content": doc.page_content[:500] + "..." if len(doc.page_content) > 500 else doc.page_content,
                        "metadata": doc.metadata
                    }
                    for doc in result.get("source_documents", [])
                ],
                "question": question,
                "context": context
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "source_documents": [],
                "question": question,
                "context": context,
                "error": str(e)
            }
    
    async def analyze_content(self, content: str, analysis_type: str = "general") -> Dict[str, Any]:
        """Analyze content using RAG pipeline."""
        analysis_prompts = {
            "general": "Analyze this content and provide a comprehensive summary including key topics, main points, and important insights.",
            "technical": "Analyze this content for technical information, including technologies mentioned, APIs, frameworks, and technical specifications.",
            "business": "Analyze this content for business information, including products, services, pricing, market positioning, and business model insights.",
            "security": "Analyze this content for security-related information, including vulnerabilities, security measures, compliance, and risk factors.",
            "seo": "Analyze this content for SEO information, including keywords, meta tags, content structure, and optimization opportunities."
        }
        
        prompt = analysis_prompts.get(analysis_type, analysis_prompts["general"])
        
        # Create a temporary document for analysis
        document = Document(
            page_content=content,
            metadata={"analysis_type": analysis_type, "source": "content_analysis"}
        )
        
        # Initialize vector store with this document
        await self.initialize_vector_store([document])
        
        # Query the analysis
        result = await self.query(prompt)
        
        return {
            "analysis_type": analysis_type,
            "content_preview": content[:500] + "..." if len(content) > 500 else content,
            "analysis": result["answer"],
            "sources": result["source_documents"]
        }
    
    async def extract_structured_data(self, content: str, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Extract structured data from content using RAG."""
        # Create extraction prompt based on schema
        schema_description = json.dumps(schema, indent=2)
        extraction_prompt = f"""
        Extract structured data from the following content according to this schema:
        
        Schema:
        {schema_description}
        
        Content:
        {content}
        
        Return the extracted data in JSON format matching the schema.
        """
        
        # Create a temporary document
        document = Document(
            page_content=content,
            metadata={"extraction_schema": schema, "source": "structured_extraction"}
        )
        
        # Initialize vector store with this document
        await self.initialize_vector_store([document])
        
        # Query for extraction
        result = await self.query(extraction_prompt)
        
        try:
            # Try to parse JSON from the answer
            import re
            json_match = re.search(r'\{.*\}', result["answer"], re.DOTALL)
            if json_match:
                extracted_data = json.loads(json_match.group())
            else:
                extracted_data = {"raw_answer": result["answer"]}
        except Exception as e:
            extracted_data = {"error": f"Failed to parse JSON: {str(e)}", "raw_answer": result["answer"]}
        
        return {
            "schema": schema,
            "extracted_data": extracted_data,
            "sources": result["source_documents"]
        }
    
    def get_vector_store_info(self) -> Dict[str, Any]:
        """Get information about the vector store."""
        if not self.vector_store:
            return {"status": "not_initialized"}
        
        try:
            if self.config.vector_store_type == "chroma":
                collection = self.vector_store._collection
                count = collection.count()
                return {
                    "type": "chroma",
                    "document_count": count,
                    "path": self.config.vector_store_path
                }
            elif self.config.vector_store_type == "faiss":
                return {
                    "type": "faiss",
                    "index_size": len(self.vector_store.index_to_docstore_id),
                    "path": self.config.vector_store_path
                }
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    async def clear_vector_store(self):
        """Clear the vector store."""
        if self.vector_store:
            if self.config.vector_store_type == "chroma":
                self.vector_store._collection.delete(where={})
            elif self.config.vector_store_type == "faiss":
                # For FAISS, we need to recreate the store
                self.vector_store = None
                await self.initialize_vector_store()
    
    async def save_vector_store(self):
        """Save the vector store."""
        if self.vector_store:
            if self.config.vector_store_type == "chroma":
                self.vector_store.persist()
            elif self.config.vector_store_type == "faiss":
                self.vector_store.save_local(self.config.vector_store_path) 