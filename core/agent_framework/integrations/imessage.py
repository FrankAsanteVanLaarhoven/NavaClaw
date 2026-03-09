import os
import subprocess
import logging
from typing import Dict, Any, Callable, Optional
import asyncio

logger = logging.getLogger(__name__)

class iMessageAdapter:
    """
    Native iMessage Adapter for NAVACLAW-AI (macOS environments only).
    Bridges the agent framework with local iMessage via AppleScript bridging.
    """
    def __init__(self):
        self.is_macos = os.uname().sysname == 'Darwin'
        self.message_handler: Optional[Callable] = None
        
        if not self.is_macos:
            logger.warning("iMessage adapter requires macOS. It will be disabled in this environment.")
    
    def register_handler(self, handler: Callable):
        """Register the agent core's message processor."""
        self.message_handler = handler
        logger.info("iMessage handler registered.")

    async def send_message(self, target_number: str, text: str) -> bool:
        """Send an iMessage using AppleScript (osascript)."""
        if not self.is_macos:
            return False
            
        escaped_text = text.replace('"', '\\"')
        applescript = f'''
        tell application "Messages"
            set targetService to 1st service whose service type = iMessage
            set targetBuddy to buddy "{target_number}" of targetService
            send "{escaped_text}" to targetBuddy
        end tell
        '''
        
        process = await asyncio.create_subprocess_exec(
            'osascript', '-e', applescript,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            logger.error(f"iMessage Error: {stderr.decode().strip()}")
            return False
        return True

    # Note: Listening for iMessages natively typically requires reading the chat.db SQLite 
    # file in ~/Library/Messages/chat.db or setting up an AppleScript handler for the Messages app.
    # We provide the framework endpoint here which can be polled via a background service.
    async def poll_incoming_messages(self, sqlite_path: str = "~/Library/Messages/chat.db"):
        """Poll the local iMessage database for new messages."""
        if not self.is_macos:
            return
        
        # Integration logic for chat.db polling goes here.
        # This requires Full Disk Access permissions on macOS for the Terminal/Runner.
        pass
