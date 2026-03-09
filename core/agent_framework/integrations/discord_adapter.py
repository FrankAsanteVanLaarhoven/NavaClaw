import os
import logging
from typing import Dict, Any, Callable, Optional
import aiohttp
import asyncio

logger = logging.getLogger(__name__)

class DiscordAdapter:
    """
    Native Discord Adapter for NAVACLAW-AI.
    Bridges the agent framework with Discord servers.
    """
    def __init__(self, bot_token: str = None):
        self.bot_token = bot_token or os.environ.get("DISCORD_BOT_TOKEN")
        self.api_url = "https://discord.com/api/v10"
        self.headers = {
            "Authorization": f"Bot {self.bot_token}",
            "Content-Type": "application/json"
        }
        self.message_handler: Optional[Callable] = None
    
    def register_handler(self, handler: Callable):
        """Register the agent core's message processor."""
        self.message_handler = handler
        logger.info("Discord message handler registered.")

    async def send_message(self, channel_id: str, content: str, embed: dict = None) -> bool:
        """Send a message/response back to a Discord channel."""
        if not self.bot_token:
            logger.error("Discord bot token not configured.")
            return False
            
        payload = {"content": content}
        if embed:
            payload["embeds"] = [embed]
            
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.api_url}/channels/{channel_id}/messages", 
                                  headers=self.headers, json=payload) as response:
                if response.status not in (200, 201):
                    logger.error(f"Discord API Error: {await response.text()}")
                    return False
                return True

    async def handle_incoming_message(self, message_data: Dict[str, Any]) -> None:
        """Process incoming Discord messages (e.g., from gateway or webhook)."""
        # Ignore bot messages
        if message_data.get("author", {}).get("bot"):
            return
            
        channel_id = message_data.get("channel_id")
        user_id = message_data.get("author", {}).get("id")
        content = message_data.get("content")
        
        logger.info(f"Received Discord message from {user_id} in {channel_id}: {content[:50]}")
        
        if self.message_handler:
            # Dispatch to agent framework
            agent_response = await self.message_handler({
                "platform": "discord",
                "channel_id": channel_id,
                "user_id": user_id,
                "text": content
            })
            
            if agent_response:
                await self.send_message(channel_id, agent_response)
