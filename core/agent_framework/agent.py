"""
NAVACLAW-AI — Core Agent System
Ported from Agent Zero's organic agent hierarchy.
Author: Frank Van Laarhoven

Production-grade hierarchical multi-agent system with:
- AgentContext: Chat/task/background context management with thread-safe registry
- AgentConfig: Multi-model routing (chat, utility, browser, embeddings)
- Agent: Superior/subordinate chain with isolated context windows
- UserMessage: User interaction with attachments and system messages
"""

import asyncio
import random
import string
import threading
import logging
from collections import OrderedDict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Awaitable, Callable, Coroutine, Dict, List, Optional
from enum import Enum

from .models import ModelConfig, LLMRouter

logger = logging.getLogger("navaclaw.agent")


# ─── Context Types ────────────────────────────────────────────────

class AgentContextType(Enum):
    """Types of agent execution contexts."""
    USER = "user"          # Interactive user chat
    TASK = "task"          # Background task execution
    BACKGROUND = "background"  # System-level background operations


# ─── User Message ─────────────────────────────────────────────────

@dataclass
class UserMessage:
    """A message from the user to the agent."""
    message: str
    attachments: List[str] = field(default_factory=list)
    system_message: List[str] = field(default_factory=list)


# ─── Agent Config ─────────────────────────────────────────────────

@dataclass
class AgentConfig:
    """
    Configuration for the agent system.
    Multi-model routing: separate models for chat, utility, browser, and embeddings.
    """
    chat_model: ModelConfig
    utility_model: ModelConfig
    embeddings_model: ModelConfig
    browser_model: ModelConfig
    mcp_servers: str = ""
    profile: str = ""
    memory_subdir: str = ""
    knowledge_subdirs: List[str] = field(default_factory=lambda: ["default", "custom"])
    
    # Code execution
    code_exec_ssh_enabled: bool = True
    code_exec_ssh_addr: str = "localhost"
    code_exec_ssh_port: int = 55022
    code_exec_ssh_user: str = "root"
    code_exec_ssh_pass: str = ""
    
    # Extension
    additional: Dict[str, Any] = field(default_factory=dict)

    @staticmethod
    def default() -> "AgentConfig":
        """Create a default config for development/testing."""
        default_model = ModelConfig(
            name="gpt-4o-mini",
            provider="openai",
            ctx_length=128000,
        )
        return AgentConfig(
            chat_model=default_model,
            utility_model=default_model,
            embeddings_model=ModelConfig(
                name="text-embedding-3-small",
                provider="openai",
            ),
            browser_model=default_model,
        )


# ─── Loop Data ────────────────────────────────────────────────────

class LoopData:
    """Data structure passed through the message loop and extensions."""
    
    def __init__(self, **kwargs):
        self.iteration: int = -1
        self.system: List[str] = []
        self.history_output: List[dict] = []
        self.extras_temporary: OrderedDict = OrderedDict()
        self.extras_persistent: OrderedDict = OrderedDict()
        self.last_response: str = ""
        self.params_temporary: dict = {}
        self.params_persistent: dict = {}
        self.current_tool: Optional[str] = None
        
        for key, value in kwargs.items():
            setattr(self, key, value)


# ─── Agent Context ────────────────────────────────────────────────

class AgentContext:
    """
    Thread-safe context manager for agent execution.
    Maintains a registry of all active contexts with lifecycle management.
    """
    
    _contexts: Dict[str, "AgentContext"] = {}
    _contexts_lock = threading.RLock()
    _counter: int = 0
    
    def __init__(
        self,
        config: AgentConfig,
        id: Optional[str] = None,
        name: Optional[str] = None,
        agent0: Optional["Agent"] = None,
        paused: bool = False,
        context_type: AgentContextType = AgentContextType.USER,
        data: Optional[dict] = None,
        set_current: bool = False,
    ):
        self.id = id or AgentContext.generate_id()
        self.name = name
        self.config = config
        self.data = data or {}
        self.output_data: dict = {}
        self.paused = paused
        self.context_type = context_type
        self.streaming_agent: Optional["Agent"] = None
        self.created_at = datetime.now(timezone.utc)
        self.last_message = datetime.now(timezone.utc)
        self._task: Optional[asyncio.Task] = None
        
        # Register in global context registry
        with AgentContext._contexts_lock:
            existing = AgentContext._contexts.get(self.id)
            if existing and existing._task and not existing._task.done():
                existing._task.cancel()
            AgentContext._contexts[self.id] = self
            AgentContext._counter += 1
            self.number = AgentContext._counter
        
        if set_current:
            AgentContext._current_id = self.id
        
        # Initialize root agent last (context must be complete)
        self.agent0 = agent0 or Agent(0, self.config, self)
    
    # ── Static Registry Methods ──
    
    _current_id: str = ""
    
    @staticmethod
    def generate_id() -> str:
        """Generate a unique short ID for a context."""
        while True:
            short_id = "".join(random.choices(string.ascii_letters + string.digits, k=8))
            with AgentContext._contexts_lock:
                if short_id not in AgentContext._contexts:
                    return short_id
    
    @staticmethod
    def get(id: str) -> Optional["AgentContext"]:
        with AgentContext._contexts_lock:
            return AgentContext._contexts.get(id)
    
    @staticmethod
    def current() -> Optional["AgentContext"]:
        return AgentContext.get(AgentContext._current_id) if AgentContext._current_id else None
    
    @staticmethod
    def all() -> List["AgentContext"]:
        with AgentContext._contexts_lock:
            return list(AgentContext._contexts.values())
    
    @staticmethod
    def remove(id: str) -> Optional["AgentContext"]:
        with AgentContext._contexts_lock:
            ctx = AgentContext._contexts.pop(id, None)
        if ctx and ctx._task and not ctx._task.done():
            ctx._task.cancel()
        return ctx
    
    # ── Instance Methods ──
    
    def get_agent(self) -> "Agent":
        return self.streaming_agent or self.agent0
    
    def is_running(self) -> bool:
        return self._task is not None and not self._task.done()
    
    def get_data(self, key: str, default: Any = None) -> Any:
        return self.data.get(key, default)
    
    def set_data(self, key: str, value: Any) -> None:
        self.data[key] = value
    
    def reset(self) -> None:
        """Reset the context — kill task, clear history, reinitialize agent."""
        if self._task and not self._task.done():
            self._task.cancel()
        self.agent0 = Agent(0, self.config, self)
        self.streaming_agent = None
        self.paused = False
    
    async def communicate(self, msg: UserMessage, broadcast_level: int = 1) -> None:
        """Send a message to the agent system."""
        self.paused = False
        self.last_message = datetime.now(timezone.utc)
        current_agent = self.get_agent()
        
        if self.is_running():
            # Set intervention on running agents
            agent = current_agent
            level = broadcast_level
            while agent and level > 0:
                agent.intervention = msg
                level -= 1
                agent = agent.data.get(Agent.DATA_NAME_SUPERIOR)
        else:
            # Start new processing chain
            await self._process_chain(current_agent, msg)
    
    async def _process_chain(self, agent: "Agent", msg: UserMessage, user: bool = True) -> Optional[str]:
        """Execute the processing chain — propagates responses up the hierarchy."""
        try:
            if user:
                agent.add_user_message(msg)
            
            response = await agent.monologue()
            
            # Propagate to superior agent if exists
            superior = agent.data.get(Agent.DATA_NAME_SUPERIOR)
            if superior:
                response = await self._process_chain(superior, UserMessage(message=response or ""), False)
            
            # Call end-of-chain extensions
            await agent.call_extensions("process_chain_end")
            
            return response
        except Exception as e:
            logger.error(f"Processing chain error: {e}", exc_info=True)
            raise
    
    def to_dict(self) -> dict:
        """Serialize context state for API/WebSocket output."""
        return {
            "id": self.id,
            "name": self.name,
            "number": self.number,
            "created_at": self.created_at.isoformat(),
            "last_message": self.last_message.isoformat(),
            "type": self.context_type.value,
            "running": self.is_running(),
            "paused": self.paused,
            **self.output_data,
        }


# ─── Intervention Exception ──────────────────────────────────────

class InterventionException(Exception):
    """Raised when user intervenes during agent processing."""
    pass


class HandledException(Exception):
    """Fatal exception — ends the message loop."""
    pass


# ─── Agent ────────────────────────────────────────────────────────

class Agent:
    """
    A single agent in the hierarchy.
    
    Agent₀ is the root orchestrator. It can spawn Agent₁..N as subordinates,
    each with isolated context windows. Tools, memory, and skills are
    available to all agents in the chain.
    """
    
    DATA_NAME_SUPERIOR = "_superior"
    DATA_NAME_SUBORDINATE = "_subordinate"
    DATA_NAME_CTX_WINDOW = "ctx_window"
    
    def __init__(
        self,
        number: int,
        config: AgentConfig,
        context: Optional[AgentContext] = None,
    ):
        self.number = number
        self.config = config
        self.context = context or AgentContext(config=config, agent0=self)
        self.agent_name = f"Agent-{self.number}"
        
        # State
        self.history: List[dict] = []
        self.intervention: Optional[UserMessage] = None
        self.data: Dict[str, Any] = {}
        self.loop_data: Optional[LoopData] = None
        self._extension_handlers: Dict[str, List[Callable]] = {}
        self._tools: Dict[str, Any] = {}
        
        logger.info(f"Initialized {self.agent_name} in context {self.context.id}")
    
    # ── Core Monologue Loop ──
    
    async def monologue(self) -> Optional[str]:
        """
        Main agent reasoning loop.
        The agent processes messages, calls tools, and generates responses
        until it produces a final response.
        """
        error_retries = 0
        max_retries = 3
        
        while True:
            try:
                self.loop_data = LoopData()
                await self.call_extensions("monologue_start", loop_data=self.loop_data)
                
                while True:
                    self.context.streaming_agent = self
                    self.loop_data.iteration += 1
                    self.loop_data.params_temporary = {}
                    
                    await self.call_extensions("message_loop_start", loop_data=self.loop_data)
                    await self._handle_intervention()
                    
                    try:
                        # Build prompt
                        prompt = await self._build_prompt()
                        
                        await self.call_extensions("before_main_llm_call", loop_data=self.loop_data)
                        await self._handle_intervention()
                        
                        # Call LLM
                        response = await self._call_llm(prompt)
                        await self._handle_intervention(response)
                        
                        # Process response
                        if response == self.loop_data.last_response:
                            # Repeated response — nudge the agent
                            self.history.append({
                                "role": "system",
                                "content": "Your last response was identical. Please try a different approach.",
                            })
                            logger.warning(f"{self.agent_name}: Repeated response detected")
                        else:
                            self.loop_data.last_response = response
                            self.history.append({"role": "assistant", "content": response})
                            
                            # Process tool calls
                            tool_result = await self._process_tools(response)
                            if tool_result is not None:
                                return tool_result
                        
                        error_retries = 0
                        
                    except InterventionException:
                        error_retries = 0
                    except Exception as e:
                        error_retries += 1
                        if error_retries >= max_retries:
                            raise HandledException(e)
                        logger.warning(f"Retryable error (attempt {error_retries}): {e}")
                        await asyncio.sleep(2)
                    
                    finally:
                        await self.call_extensions("message_loop_end", loop_data=self.loop_data)
                
            except InterventionException:
                error_retries = 0
            except HandledException:
                raise
            except Exception as e:
                error_retries += 1
                if error_retries >= max_retries:
                    logger.error(f"{self.agent_name}: Fatal error: {e}", exc_info=True)
                    raise
                await asyncio.sleep(2)
            finally:
                self.context.streaming_agent = None
                await self.call_extensions("monologue_end", loop_data=self.loop_data)
    
    # ── Subordinate Spawning ──
    
    def spawn_subordinate(self, task_description: str) -> "Agent":
        """Spawn a subordinate agent with isolated context."""
        sub = Agent(
            number=self.number + 1,
            config=self.config,
            context=self.context,
        )
        sub.data[Agent.DATA_NAME_SUPERIOR] = self
        self.data[Agent.DATA_NAME_SUBORDINATE] = sub
        sub.add_user_message(UserMessage(message=task_description))
        logger.info(f"{self.agent_name} spawned {sub.agent_name} for: {task_description[:80]}")
        return sub
    
    def spawn_swarm_capability(self, capability_domain: str, task_description: str) -> "Agent":
        """
        [NAVACLAW-AI Exclusive]
        Ethereally spawn a dynamic swarm agent tailored to a specific capability domain 
        (e.g., 'penetration_tester', 'asil_compiler', 'data_miner_crawler') without rigid tree structures.
        """
        # Instantiate a detached swarm agent, linked to the context but not necessarily a direct hierarchical child
        swarm_agent = Agent(
            number=self.number + random.randint(100, 900), # Swarm IDs are randomized to prevent tree assumptions
            config=self.config,
            context=self.context,
        )
        swarm_agent.agent_name = f"SwarmAgent-{capability_domain.capitalize()}-{swarm_agent.number}"
        
        # Inject dynamic system prompt based on domain expertise
        domain_prompt = f"You are an ethereal Swarm Agent specializing in {capability_domain}. " \
                        f"You operate dynamically outside the rigid Agent Zero hierarchy to fulfill specialized tasks."
        swarm_agent.history.insert(0, {"role": "system", "content": domain_prompt})
        
        # Log the dynamic instantiation
        logger.info(f"{self.agent_name} dynamically invoked Swarm Capability '{capability_domain}' -> {swarm_agent.agent_name}")
        
        # Assign the task
        swarm_agent.add_user_message(UserMessage(message=task_description))
        return swarm_agent
    
    # ── History Management ──
    
    def add_user_message(self, msg: UserMessage) -> None:
        content = msg.message
        if msg.attachments:
            content += f"\n\nAttachments: {', '.join(msg.attachments)}"
        if msg.system_message:
            for sys_msg in msg.system_message:
                self.history.append({"role": "system", "content": sys_msg})
        self.history.append({"role": "user", "content": content})
    
    def add_tool_result(self, tool_name: str, result: str) -> None:
        self.history.append({
            "role": "tool",
            "tool_name": tool_name,
            "content": result,
        })
    
    # ── Extension System ──
    
    def register_extension(self, hook: str, handler: Callable) -> None:
        """Register an extension handler for a specific hook point."""
        if hook not in self._extension_handlers:
            self._extension_handlers[hook] = []
        self._extension_handlers[hook].append(handler)
    
    async def call_extensions(self, hook: str, **kwargs) -> None:
        """Call all registered extension handlers for a hook."""
        handlers = self._extension_handlers.get(hook, [])
        for handler in handlers:
            try:
                result = handler(self, **kwargs)
                if asyncio.iscoroutine(result):
                    await result
            except Exception as e:
                logger.warning(f"Extension error in {hook}: {e}")
    
    # ── Tool Registration ──
    
    def register_tool(self, name: str, tool: Any) -> None:
        """Register a tool for this agent."""
        self._tools[name] = tool
    
    def get_tool(self, name: str) -> Optional[Any]:
        return self._tools.get(name)
    
    # ── Private Methods ──
    
    async def _build_prompt(self) -> List[dict]:
        """Build the full prompt from system + history."""
        system_parts: List[str] = []
        await self.call_extensions("system_prompt", system_prompt=system_parts)
        
        if not system_parts:
            system_parts = [
                f"You are {self.agent_name}, a production-grade AI agent in the NAVACLAW-AI system.",
                "You have access to tools for code execution, memory, web browsing, and more.",
                "Use the appropriate tool for each task. Be precise and efficient.",
            ]
        
        messages = [{"role": "system", "content": "\n\n".join(system_parts)}]
        messages.extend(self.history)
        return messages
    
    async def _call_llm(self, messages: List[dict]) -> str:
        """Call the LLM with the current prompt."""
        router = LLMRouter(self.config.chat_model)
        response = await router.chat(messages)
        return response
    
    async def _process_tools(self, response: str) -> Optional[str]:
        """
        Extract and execute tool calls from the agent's response.
        Returns the final response if the agent is done, None to continue.
        """
        # Check for response tool (signals end of message loop)
        if "```response" in response.lower() or response.startswith("FINAL:"):
            clean = response.replace("```response", "").replace("```", "").replace("FINAL:", "").strip()
            return clean
        
        # Extract tool calls (JSON code blocks)
        import json
        import re
        tool_blocks = re.findall(r'```json\s*(\{[^`]+\})\s*```', response, re.DOTALL)
        
        for block in tool_blocks:
            try:
                tool_call = json.loads(block)
                tool_name = tool_call.get("tool", "")
                tool_args = tool_call.get("args", {})
                
                tool = self.get_tool(tool_name)
                if tool:
                    await self.call_extensions("tool_execute_before", tool_name=tool_name, args=tool_args)
                    result = await tool.execute(**tool_args)
                    await self.call_extensions("tool_execute_after", tool_name=tool_name, result=result)
                    self.add_tool_result(tool_name, str(result))
                else:
                    self.add_tool_result(tool_name, f"Error: Unknown tool '{tool_name}'")
            except (json.JSONDecodeError, KeyError) as e:
                logger.warning(f"Failed to parse tool call: {e}")
        
        return None  # Continue loop
    
    async def _handle_intervention(self, current_response: str = "") -> None:
        """Check for and handle user interventions."""
        if self.intervention:
            intervention = self.intervention
            self.intervention = None
            self.add_user_message(intervention)
            raise InterventionException("User intervention received")
    
    # ── Getters/Setters ──
    
    def get_data(self, key: str, default: Any = None) -> Any:
        return self.data.get(key, default)
    
    def set_data(self, key: str, value: Any) -> None:
        self.data[key] = value
    
    def __repr__(self) -> str:
        return f"<Agent {self.agent_name} ctx={self.context.id}>"
