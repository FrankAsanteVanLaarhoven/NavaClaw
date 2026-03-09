"""
NAVACLAW-AI — Tool Base Class
Ported from Agent Zero's tool abstraction.
Author: Frank Van Laarhoven

Provides the base class for all agent tools.
Tools are the primary way agents interact with the outside world.
"""

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, Optional

logger = logging.getLogger("navaclaw.tool")


@dataclass
class ToolResponse:
    """Standardized tool execution response."""
    success: bool
    result: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    def __str__(self) -> str:
        if self.success:
            return self.result
        return f"Error: {self.error or self.result}"


class Tool(ABC):
    """
    Abstract base class for all agent tools.
    
    Every tool must implement:
    - name: unique identifier
    - description: what the tool does (shown to LLM)
    - execute: the actual tool logic
    """
    
    def __init__(self, agent: Any = None):
        self.agent = agent
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Unique tool name."""
        ...
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Description shown to the LLM in the system prompt."""
        ...
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResponse:
        """Execute the tool with given arguments."""
        ...
    
    def get_schema(self) -> dict:
        """Return JSON schema for tool parameters (for LLM tool calling)."""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {},
        }


# ─── Built-in Tool Implementations ───────────────────────────────

class ResponseTool(Tool):
    """Final response tool — signals end of agent's reasoning loop."""
    
    @property
    def name(self) -> str:
        return "response"
    
    @property
    def description(self) -> str:
        return "Send a final response to the user. Use this when you have completed the task."
    
    async def execute(self, message: str = "", **kwargs) -> ToolResponse:
        return ToolResponse(success=True, result=message)


class MemorySaveTool(Tool):
    """Save information to persistent memory."""
    
    @property
    def name(self) -> str:
        return "memory_save"
    
    @property
    def description(self) -> str:
        return "Save important information to persistent memory for future recall."
    
    async def execute(self, content: str = "", metadata: str = "", **kwargs) -> ToolResponse:
        try:
            from .memory import MemoryStore
            store = await MemoryStore.get()
            doc_id = await store.save(content, metadata={"note": metadata} if metadata else {})
            return ToolResponse(success=True, result=f"Saved to memory (ID: {doc_id})")
        except Exception as e:
            return ToolResponse(success=False, result="", error=str(e))


class MemoryLoadTool(Tool):
    """Search and recall information from memory."""
    
    @property
    def name(self) -> str:
        return "memory_load"
    
    @property
    def description(self) -> str:
        return "Search persistent memory for information related to a query."
    
    async def execute(self, query: str = "", limit: int = 5, **kwargs) -> ToolResponse:
        try:
            from .memory import MemoryStore
            store = await MemoryStore.get()
            results = await store.search(query, limit=limit)
            if not results:
                return ToolResponse(success=True, result="No relevant memories found.")
            
            output = []
            for r in results:
                output.append(f"[score={r.score:.2f}] {r.document.content}")
            return ToolResponse(success=True, result="\n\n".join(output))
        except Exception as e:
            return ToolResponse(success=False, result="", error=str(e))


class MemoryDeleteTool(Tool):
    """Delete memories matching a query."""
    
    @property
    def name(self) -> str:
        return "memory_delete"
    
    @property
    def description(self) -> str:
        return "Delete memories similar to the given query."
    
    async def execute(self, query: str = "", **kwargs) -> ToolResponse:
        try:
            from .memory import MemoryStore
            store = await MemoryStore.get()
            count = await store.forget(query)
            return ToolResponse(success=True, result=f"Deleted {count} memories.")
        except Exception as e:
            return ToolResponse(success=False, result="", error=str(e))


class CallSubordinateTool(Tool):
    """Spawn a subordinate agent for a specific task."""
    
    @property
    def name(self) -> str:
        return "call_subordinate"
    
    @property
    def description(self) -> str:
        return "Delegate a specific task to a subordinate agent with isolated context."
    
    async def execute(self, task: str = "", **kwargs) -> ToolResponse:
        if not self.agent:
            return ToolResponse(success=False, result="", error="No agent context available")
        
        try:
            sub = self.agent.spawn_subordinate(task)
            result = await sub.monologue()
            return ToolResponse(success=True, result=result or "Subordinate completed without response.")
        except Exception as e:
            return ToolResponse(success=False, result="", error=str(e))


class CodeExecutionTool(Tool):
    """Execute Python, Node.js, or shell commands."""
    
    @property
    def name(self) -> str:
        return "code_execution"
    
    @property
    def description(self) -> str:
        return "Execute code in Python, Node.js, or shell. Specify language and code."
    
    async def execute(
        self,
        language: str = "python",
        code: str = "",
        **kwargs,
    ) -> ToolResponse:
        import subprocess
        import tempfile
        
        if not code.strip():
            return ToolResponse(success=False, result="", error="No code provided")
        
        interpreters = {
            "python": ["python3", "-c"],
            "node": ["node", "-e"],
            "nodejs": ["node", "-e"],
            "shell": ["bash", "-c"],
            "bash": ["bash", "-c"],
            "sh": ["sh", "-c"],
        }
        
        lang = language.lower().strip()
        cmd = interpreters.get(lang)
        if not cmd:
            return ToolResponse(success=False, result="", error=f"Unsupported language: {language}")
        
        try:
            result = subprocess.run(
                [*cmd, code],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=tempfile.gettempdir(),
            )
            
            output = result.stdout
            if result.stderr:
                output += f"\n[STDERR]\n{result.stderr}"
            
            return ToolResponse(
                success=result.returncode == 0,
                result=output.strip() or "(no output)",
                error=f"Exit code: {result.returncode}" if result.returncode != 0 else None,
            )
        except subprocess.TimeoutExpired:
            return ToolResponse(success=False, result="", error="Execution timed out (60s limit)")
        except Exception as e:
            return ToolResponse(success=False, result="", error=str(e))


# ─── Tool Registry ───────────────────────────────────────────────

def get_default_tools(agent: Any = None) -> Dict[str, Tool]:
    """Return the default set of tools available to agents."""
    tools = {
        "response": ResponseTool(agent),
        "memory_save": MemorySaveTool(agent),
        "memory_load": MemoryLoadTool(agent),
        "memory_delete": MemoryDeleteTool(agent),
        "call_subordinate": CallSubordinateTool(agent),
        "code_execution": CodeExecutionTool(agent),
    }
    return tools
