"""
NAVACLAW-AI — Social Scouting Agent
Autonomous trend intelligence from X/Twitter (Nitter), Reddit, and Hacker News.
Runs 2x daily via HeartbeatScheduler.
Author: Frank Van Laarhoven
"""

import asyncio
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any
import urllib.request
import urllib.error

logger = logging.getLogger(__name__)

# ─── Configuration ────────────────────────────────────────────────

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
INTEL_FILE = DATA_DIR / "trending_intel.json"
MAX_ITEMS_PER_SOURCE = 15
CATEGORIES = ["AI", "Tech", "Crypto", "Science", "Culture", "Dev", "Business"]

# Subreddits to monitor
REDDIT_SUBS = ["technology", "artificial", "MachineLearning", "programming", "singularity"]

# Nitter instances (public, no auth needed) — used as RSS fallback for X/Twitter
NITTER_INSTANCES = [
    "https://nitter.privacydev.net",
    "https://nitter.poast.org",
]

# ─── Category Classifier ─────────────────────────────────────────

CATEGORY_KEYWORDS = {
    "AI": ["ai", "artificial intelligence", "llm", "gpt", "openai", "deepmind", "model", "neural", "transformer", "machine learning", "ml", "deep learning"],
    "Crypto": ["crypto", "bitcoin", "ethereum", "blockchain", "web3", "defi", "nft", "token"],
    "Science": ["science", "research", "quantum", "physics", "biology", "space", "nasa", "cern"],
    "Dev": ["programming", "developer", "coding", "github", "rust", "python", "javascript", "typescript", "api"],
    "Business": ["startup", "funding", "ipo", "acquisition", "valuation", "revenue", "market"],
    "Tech": ["tech", "apple", "google", "microsoft", "meta", "tesla", "chip", "semiconductor", "hardware", "software"],
    "Culture": ["culture", "social", "trend", "viral", "meme"],
}


def classify_category(title: str) -> str:
    """Simple keyword-based category classifier."""
    title_lower = title.lower()
    scores: Dict[str, int] = {}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        scores[cat] = sum(1 for kw in keywords if kw in title_lower)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Tech"


# ─── Source Fetchers ──────────────────────────────────────────────

def _http_get_json(url: str, timeout: int = 15) -> Any:
    """Simple HTTP GET returning parsed JSON."""
    req = urllib.request.Request(url, headers={"User-Agent": "NAVACLAW-AI/2.0 Scout"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, json.JSONDecodeError, Exception) as e:
        logger.warning(f"HTTP fetch failed for {url}: {e}")
        return None


async def fetch_hackernews() -> List[Dict]:
    """Fetch top stories from Hacker News Firebase API."""
    items = []
    data = _http_get_json("https://hacker-news.firebaseio.com/v0/topstories.json")
    if not data:
        return items

    for story_id in data[:MAX_ITEMS_PER_SOURCE]:
        story = _http_get_json(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json")
        if story and story.get("title"):
            items.append({
                "id": f"hn-{story_id}",
                "source": "Hacker News",
                "title": story["title"],
                "url": story.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
                "score": story.get("score", 0),
                "comments": story.get("descendants", 0),
                "category": classify_category(story["title"]),
                "timestamp": datetime.fromtimestamp(story.get("time", 0), tz=timezone.utc).isoformat(),
            })
    return items


async def fetch_reddit() -> List[Dict]:
    """Fetch hot posts from monitored subreddits via Reddit JSON API."""
    items = []
    for sub in REDDIT_SUBS:
        data = _http_get_json(f"https://www.reddit.com/r/{sub}/hot.json?limit={MAX_ITEMS_PER_SOURCE}")
        if not data or "data" not in data:
            continue
        for post in data["data"].get("children", [])[:MAX_ITEMS_PER_SOURCE]:
            p = post.get("data", {})
            if not p.get("title"):
                continue
            items.append({
                "id": f"reddit-{p.get('id', '')}",
                "source": f"r/{sub}",
                "title": p["title"],
                "url": f"https://reddit.com{p.get('permalink', '')}",
                "score": p.get("score", 0),
                "comments": p.get("num_comments", 0),
                "category": classify_category(p["title"]),
                "timestamp": datetime.fromtimestamp(p.get("created_utc", 0), tz=timezone.utc).isoformat(),
            })
    return items


async def fetch_x_trending() -> List[Dict]:
    """Attempt to fetch trending from X/Twitter via Nitter RSS. Falls back gracefully."""
    items = []
    for instance in NITTER_INSTANCES:
        try:
            url = f"{instance}/search/rss?f=tweets&q=trending&since=&until=&near="
            req = urllib.request.Request(url, headers={"User-Agent": "NAVACLAW-AI/2.0 Scout"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                content = resp.read().decode()
                # Basic RSS parsing — extract <item><title>...</title></item>
                import re
                titles = re.findall(r'<title><!\[CDATA\[(.*?)\]\]></title>', content)
                for i, title in enumerate(titles[:MAX_ITEMS_PER_SOURCE]):
                    if title and title != "Nitter":
                        items.append({
                            "id": f"x-{int(time.time())}-{i}",
                            "source": "X/Twitter",
                            "title": title[:280],
                            "url": instance,
                            "score": 0,
                            "comments": 0,
                            "category": classify_category(title),
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        })
                if items:
                    break  # Got data from this instance
        except Exception as e:
            logger.debug(f"Nitter instance {instance} failed: {e}")
            continue
    return items


# ─── Main Scout ───────────────────────────────────────────────────

async def run_scout() -> Dict:
    """Execute a full scouting run across all sources."""
    logger.info("[Scout] Starting social media intelligence scan...")
    
    hn_items, reddit_items, x_items = await asyncio.gather(
        fetch_hackernews(),
        fetch_reddit(),
        fetch_x_trending(),
    )

    all_items = hn_items + reddit_items + x_items

    # Deduplicate by title similarity
    seen_titles = set()
    unique_items = []
    for item in all_items:
        key = item["title"].lower()[:60]
        if key not in seen_titles:
            seen_titles.add(key)
            unique_items.append(item)

    # Sort by score descending
    unique_items.sort(key=lambda x: x.get("score", 0), reverse=True)

    # Build the intel report
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_items": len(unique_items),
        "sources": {
            "hacker_news": len(hn_items),
            "reddit": len(reddit_items),
            "x_twitter": len(x_items),
        },
        "categories": {},
        "items": unique_items,
    }

    # Category breakdown
    for item in unique_items:
        cat = item["category"]
        report["categories"][cat] = report["categories"].get(cat, 0) + 1

    # Write to disk
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(INTEL_FILE, "w") as f:
        json.dump(report, f, indent=2, default=str)

    logger.info(f"[Scout] Scan complete. {len(unique_items)} items written to {INTEL_FILE}")
    return report


# ─── CLI entry point ──────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = asyncio.run(run_scout())
    print(f"\n✅ Scouting complete: {result['total_items']} trending items found.")
    print(f"   Sources → HN: {result['sources']['hacker_news']}, Reddit: {result['sources']['reddit']}, X: {result['sources']['x_twitter']}")
    print(f"   Categories: {result['categories']}")
    print(f"   Output: {INTEL_FILE}")
