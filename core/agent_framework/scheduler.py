import asyncio
import logging
from typing import Callable, Coroutine, List, Dict
import time

logger = logging.getLogger(__name__)

class HeartbeatScheduler:
    """
    Always-On Heartbeat Scheduler.
    Provides proactive background task execution and autonomous 
    multi-step workflow automation for NAVACLAW-AI.
    """
    def __init__(self, heartbeat_interval_seconds: int = 60):
        self.interval = heartbeat_interval_seconds
        self.is_running = False
        self.tasks: List[Dict] = []
        self._loop_task: Optional[asyncio.Task] = None

    def register_background_task(self, name: str, callback: Callable[[], Coroutine], freq_seconds: int = 300):
        """
        Register a task to be repeatedly executed.
        freq_seconds: How often to run the task (minimum = heartbeat_interval).
        """
        self.tasks.append({
            "name": name,
            "callback": callback,
            "freq_seconds": freq_seconds,
            "last_run": 0
        })
        logger.info(f"Registered background task: {name} (Freq: {freq_seconds}s)")

    async def _heartbeat_loop(self):
        """Core loop handling task execution continuously."""
        logger.info("Heartbeat Scheduler started.")
        while self.is_running:
            now = time.time()
            for task in self.tasks:
                if (now - task["last_run"]) >= task["freq_seconds"]:
                    logger.debug(f"[Heartbeat] Executing scheduled task: {task['name']}")
                    try:
                        # Schedule task asynchronously to prevent blocking the heartbeat
                        asyncio.create_task(task["callback"]())
                        task["last_run"] = now
                    except Exception as e:
                        logger.error(f"[Heartbeat] Error in task {task['name']}: {e}")
            
            await asyncio.sleep(self.interval)

    def start(self):
        """Start the heartbeat background loop."""
        if not self.is_running:
            self.is_running = True
            self._loop_task = asyncio.create_task(self._heartbeat_loop())

    def stop(self):
        """Stop the heartbeat background loop."""
        self.is_running = False
        if self._loop_task:
            self._loop_task.cancel()
        logger.info("Heartbeat Scheduler stopped.")
