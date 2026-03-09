import os
import json
import logging
from typing import Dict, Any, Callable, Optional
import aiohttp
import asyncio

logger = logging.getLogger(__name__)

class SlackAdapter:
    """
    Native Slack Adapter for NAVACLAW-AI.
    Bridges the agent framework with Slack workspaces.
    """
    def __init__(self, bot_token: str = None, signing_secret: str = None):
        self.bot_token = bot_token or os.environ.get("SLACK_BOT_TOKEN")
        self.signing_secret = signing_secret or os.environ.get("SLACK_SIGNING_SECRET")
        self.api_url = "https://slack.com/api"
        self.headers = {
            "Authorization": f"Bearer {self.bot_token}",
            "Content-Type": "application/json"
        }
        self.message_handler: Optional[Callable] = None
    
    def register_handler(self, handler: Callable):
        """Register the agent core's message processor."""
        self.message_handler = handler
        logger.info("Slack message handler registered.")

    async def send_message(self, channel_id: str, text: str, blocks: list = None) -> bool:
        """Send a message/response back to a Slack channel."""
        if not self.bot_token:
            logger.error("Slack bot token not configured.")
            return False
            
        payload = {"channel": channel_id, "text": text}
        if blocks:
            payload["blocks"] = blocks
            
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.api_url}/chat.postMessage", 
                                  headers=self.headers, json=payload) as response:
                result = await response.json()
                if not result.get("ok"):
                    logger.error(f"Slack API Error: {result.get('error')}")
                    return False
                return True

    async def handle_incoming_event(self, event_data: Dict[str, Any]) -> None:
        """Process incoming Slack events (e.g., from an HTTP webhook)."""
        event = event_data.get("event", {})
        if event.get("type") == "message" and not event.get("bot_id"):
            channel_id = event.get("channel")
            user_id = event.get("user")
            text = event.get("text")
            
            logger.info(f"Received Slack message from {user_id} in {channel_id}: {text[:50]}")
            
            if self.message_handler:
                # Dispatch to agent framework
                agent_response = await self.message_handler({
                    "platform": "slack",
                    "channel_id": channel_id,
                    "user_id": user_id,
                    "text": text
                })
                
                if agent_response:
                    await self.send_message(channel_id, agent_response)
