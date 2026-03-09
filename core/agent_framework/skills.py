"""
NAVACLAW-AI — Skills Engine
Ported from Agent Zero's SKILL.md standard.
Author: Frank Van Laarhoven

Skills are modular capability packages that extend agent functionality.
Each skill folder contains a SKILL.md with YAML frontmatter (name, description)
and detailed markdown instructions, plus optional scripts/ and resources/.
"""

import logging
import os
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger("navaclaw.skills")


@dataclass
class Skill:
    """A loaded skill definition."""
    name: str
    description: str
    instructions: str
    path: str
    scripts: List[str] = field(default_factory=list)
    resources: List[str] = field(default_factory=list)
    
    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "path": self.path,
            "has_scripts": len(self.scripts) > 0,
            "has_resources": len(self.resources) > 0,
        }


class SkillsEngine:
    """
    Discovers and manages agent skills from filesystem.
    
    Skills follow the SKILL.md standard:
    ```
    ---
    name: My Skill
    description: What the skill does
    ---
    # Instructions
    Detailed instructions for the agent...
    ```
    """
    
    def __init__(self, skill_dirs: Optional[List[str]] = None):
        self.skill_dirs = skill_dirs or self._default_dirs()
        self._skills: Dict[str, Skill] = {}
        self._loaded = False
    
    @staticmethod
    def _default_dirs() -> List[str]:
        """Default directories to search for skills."""
        return [
            os.path.join(os.getcwd(), "skills"),
            os.path.join(os.getcwd(), "agents"),
            os.path.expanduser("~/.navaclaw/skills"),
        ]
    
    def load(self) -> int:
        """Load all skills from configured directories. Returns count loaded."""
        self._skills.clear()
        count = 0
        
        for skill_dir in self.skill_dirs:
            if not os.path.isdir(skill_dir):
                continue
            
            for entry in os.listdir(skill_dir):
                entry_path = os.path.join(skill_dir, entry)
                
                # Skill as a directory with SKILL.md
                if os.path.isdir(entry_path):
                    skill_file = os.path.join(entry_path, "SKILL.md")
                    if os.path.exists(skill_file):
                        skill = self._parse_skill(skill_file, entry_path)
                        if skill:
                            self._skills[skill.name] = skill
                            count += 1
                
                # Skill as a standalone .md file
                elif entry.endswith(".md") and entry != "README.md":
                    skill = self._parse_skill(entry_path, os.path.dirname(entry_path))
                    if skill:
                        self._skills[skill.name] = skill
                        count += 1
        
        self._loaded = True
        logger.info(f"Loaded {count} skills from {len(self.skill_dirs)} directories")
        return count
    
    def get(self, name: str) -> Optional[Skill]:
        """Get a skill by name."""
        if not self._loaded:
            self.load()
        return self._skills.get(name)
    
    def list_all(self) -> List[Skill]:
        """List all available skills."""
        if not self._loaded:
            self.load()
        return list(self._skills.values())
    
    def search(self, query: str) -> List[Skill]:
        """Search skills by name/description keyword matching."""
        if not self._loaded:
            self.load()
        
        query_lower = query.lower()
        results = []
        for skill in self._skills.values():
            if (query_lower in skill.name.lower() or 
                query_lower in skill.description.lower()):
                results.append(skill)
        return results
    
    def get_instructions(self, name: str) -> Optional[str]:
        """Get the full instructions for a skill."""
        skill = self.get(name)
        return skill.instructions if skill else None
    
    def get_system_prompt_fragment(self) -> str:
        """Generate a system prompt fragment listing available skills."""
        if not self._loaded:
            self.load()
        
        if not self._skills:
            return ""
        
        lines = ["## Available Skills", ""]
        for skill in self._skills.values():
            lines.append(f"- **{skill.name}**: {skill.description}")
        lines.append("")
        lines.append("Use the `skills_tool` to load and execute a skill's instructions.")
        return "\n".join(lines)
    
    # ── Private ──
    
    def _parse_skill(self, filepath: str, base_dir: str) -> Optional[Skill]:
        """Parse a SKILL.md file into a Skill object."""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Parse YAML frontmatter
            name = os.path.basename(base_dir)
            description = ""
            instructions = content
            
            frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
            if frontmatter_match:
                frontmatter = frontmatter_match.group(1)
                instructions = frontmatter_match.group(2)
                
                # Simple YAML parsing (avoid requiring pyyaml)
                for line in frontmatter.split("\n"):
                    line = line.strip()
                    if line.startswith("name:"):
                        name = line[5:].strip().strip("'\"")
                    elif line.startswith("description:"):
                        description = line[12:].strip().strip("'\"")
            
            # Discover scripts and resources
            scripts = []
            resources = []
            scripts_dir = os.path.join(base_dir, "scripts")
            resources_dir = os.path.join(base_dir, "resources")
            
            if os.path.isdir(scripts_dir):
                scripts = [f for f in os.listdir(scripts_dir) if not f.startswith(".")]
            if os.path.isdir(resources_dir):
                resources = [f for f in os.listdir(resources_dir) if not f.startswith(".")]
            
            return Skill(
                name=name,
                description=description,
                instructions=instructions.strip(),
                path=base_dir,
                scripts=scripts,
                resources=resources,
            )
            
        except Exception as e:
            logger.warning(f"Failed to parse skill at {filepath}: {e}")
            return None
