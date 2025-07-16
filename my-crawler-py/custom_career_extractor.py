#!/usr/bin/env python3
"""
Custom Career Content Extractor
Demonstrates how to extend the crawler for specific use cases
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse
import asyncio

class CareerContentExtractor:
    """Custom extractor focused on career and job-related content."""
    
    def __init__(self, output_dir: str = None):
        self.desktop_path = Path.home() / "Desktop" / "Career_Extraction_Data"
        self.desktop_path.mkdir(exist_ok=True)
        
        # Career-specific keywords and patterns
        self.career_keywords = {
            "job_search": [
                "job search", "career change", "job hunting", "employment", "hiring",
                "recruitment", "job market", "career opportunities", "job openings"
            ],
            "application": [
                "resume", "cv", "cover letter", "application", "interview", "brag doc",
                "portfolio", "references", "recommendation letter"
            ],
            "skills": [
                "skills", "competencies", "expertise", "proficiencies", "capabilities",
                "technical skills", "soft skills", "leadership", "management"
            ],
            "industries": [
                "technology", "healthcare", "finance", "education", "marketing",
                "sales", "engineering", "design", "consulting", "startup"
            ],
            "career_advancement": [
                "promotion", "career growth", "professional development", "advancement",
                "leadership", "management", "executive", "senior", "director", "vp"
            ]
        }
        
        # Salary and compensation patterns
        self.salary_patterns = [
            r'\$[\d,]+(?:-\$[\d,]+)?',
            r'[\d,]+(?:-\d+)?\s*(?:USD|EUR|GBP|CAD|AUD)',
            r'salary.*[\d,]+',
            r'compensation.*[\d,]+'
        ]
        
        # Job title patterns
        self.job_title_patterns = [
            r'(?:Senior|Junior|Lead|Principal|Staff|Senior Staff|Principal Staff)\s+\w+',
            r'(?:Software|Frontend|Backend|Full Stack|DevOps|Data|Product|UX|UI)\s+(?:Engineer|Developer|Designer|Manager)',
            r'(?:Project|Product|Engineering|Development|Technical|Engineering)\s+Manager',
            r'(?:CEO|CTO|CFO|COO|VP|Director|Head of)\s+\w+'
        ]
    
    async def extract_career_content(self, url: str, html_content: str, text_content: str) -> Dict[str, Any]:
        """Extract career-specific content from a webpage."""
        
        analysis = {
            "url": url,
            "timestamp": datetime.now().isoformat(),
            "career_analysis": {
                "content_type": self._classify_content_type(text_content),
                "career_relevance_score": self._calculate_relevance_score(text_content),
                "detected_keywords": self._extract_keywords(text_content),
                "salary_mentions": self._extract_salary_info(text_content),
                "job_titles": self._extract_job_titles(text_content),
                "skills_mentioned": self._extract_skills(text_content),
                "industries_mentioned": self._extract_industries(text_content),
                "action_items": self._extract_action_items(text_content),
                "career_advice": self._extract_career_advice(text_content)
            },
            "metadata": {
                "word_count": len(text_content.split()),
                "career_keyword_density": self._calculate_keyword_density(text_content),
                "content_quality_score": self._assess_content_quality(text_content)
            }
        }
        
        return analysis
    
    def _classify_content_type(self, text: str) -> str:
        """Classify the type of career content."""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["interview", "resume", "cv", "cover letter"]):
            return "application_advice"
        elif any(word in text_lower for word in ["salary", "compensation", "pay"]):
            return "salary_compensation"
        elif any(word in text_lower for word in ["skills", "competencies", "expertise"]):
            return "skills_development"
        elif any(word in text_lower for word in ["career change", "job search", "hiring"]):
            return "career_transition"
        elif any(word in text_lower for word in ["promotion", "advancement", "leadership"]):
            return "career_advancement"
        else:
            return "general_career"
    
    def _calculate_relevance_score(self, text: str) -> float:
        """Calculate how relevant the content is to career topics."""
        text_lower = text.lower()
        total_keywords = 0
        found_keywords = 0
        
        for category, keywords in self.career_keywords.items():
            total_keywords += len(keywords)
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    found_keywords += 1
        
        return found_keywords / total_keywords if total_keywords > 0 else 0.0
    
    def _extract_keywords(self, text: str) -> Dict[str, List[str]]:
        """Extract career-related keywords by category."""
        text_lower = text.lower()
        found_keywords = {}
        
        for category, keywords in self.career_keywords.items():
            found_keywords[category] = [
                keyword for keyword in keywords 
                if keyword.lower() in text_lower
            ]
        
        return found_keywords
    
    def _extract_salary_info(self, text: str) -> List[str]:
        """Extract salary and compensation information."""
        salary_mentions = []
        
        for pattern in self.salary_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            salary_mentions.extend(matches)
        
        return list(set(salary_mentions))  # Remove duplicates
    
    def _extract_job_titles(self, text: str) -> List[str]:
        """Extract job titles from the content."""
        job_titles = []
        
        for pattern in self.job_title_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            job_titles.extend(matches)
        
        return list(set(job_titles))
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract mentioned skills."""
        skills = []
        text_lower = text.lower()
        
        # Common technical skills
        tech_skills = [
            "python", "javascript", "java", "react", "vue", "angular", "node.js",
            "sql", "mongodb", "aws", "docker", "kubernetes", "git", "agile",
            "scrum", "machine learning", "ai", "data analysis", "ui/ux"
        ]
        
        for skill in tech_skills:
            if skill in text_lower:
                skills.append(skill)
        
        return skills
    
    def _extract_industries(self, text: str) -> List[str]:
        """Extract mentioned industries."""
        text_lower = text.lower()
        industries = []
        
        for industry in self.career_keywords["industries"]:
            if industry in text_lower:
                industries.append(industry)
        
        return industries
    
    def _extract_action_items(self, text: str) -> List[str]:
        """Extract actionable career advice."""
        action_items = []
        
        # Look for action-oriented phrases
        action_patterns = [
            r'(?:you should|try to|consider|make sure to|remember to)\s+[^.]*',
            r'(?:steps?|tips?|strategies?)\s+(?:for|to)\s+[^.]*',
            r'(?:how to|ways to|methods for)\s+[^.]*'
        ]
        
        for pattern in action_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            action_items.extend(matches)
        
        return action_items[:10]  # Limit to top 10
    
    def _extract_career_advice(self, text: str) -> List[str]:
        """Extract general career advice."""
        advice = []
        
        # Look for advice patterns
        advice_patterns = [
            r'(?:advice|tip|suggestion|recommendation).*?[.!]',
            r'(?:important|key|essential|crucial).*?[.!]',
            r'(?:always|never|should|must).*?[.!]'
        ]
        
        for pattern in advice_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            advice.extend(matches)
        
        return advice[:10]  # Limit to top 10
    
    def _calculate_keyword_density(self, text: str) -> float:
        """Calculate the density of career keywords in the text."""
        text_lower = text.lower()
        word_count = len(text.split())
        
        if word_count == 0:
            return 0.0
        
        career_word_count = 0
        for category, keywords in self.career_keywords.items():
            for keyword in keywords:
                career_word_count += text_lower.count(keyword.lower())
        
        return career_word_count / word_count
    
    def _assess_content_quality(self, text: str) -> float:
        """Assess the quality of career content."""
        score = 0.0
        
        # Length factor
        word_count = len(text.split())
        if word_count > 500:
            score += 0.3
        elif word_count > 200:
            score += 0.2
        elif word_count > 100:
            score += 0.1
        
        # Keyword density factor
        keyword_density = self._calculate_keyword_density(text)
        score += min(keyword_density * 10, 0.4)
        
        # Action items factor
        action_items = self._extract_action_items(text)
        score += min(len(action_items) * 0.05, 0.2)
        
        # Advice factor
        advice = self._extract_career_advice(text)
        score += min(len(advice) * 0.05, 0.1)
        
        return min(score, 1.0)
    
    async def save_career_analysis(self, analysis: Dict[str, Any], filename: str = None) -> str:
        """Save career analysis results."""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"career_analysis_{timestamp}.json"
        
        file_path = self.desktop_path / filename
        
        with open(file_path, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        return str(file_path)
    
    async def generate_career_report(self, analysis: Dict[str, Any]) -> str:
        """Generate a markdown report for career analysis."""
        report = f"""# Career Content Analysis Report

## URL Analyzed
{analysis['url']}

## Analysis Summary
- **Content Type**: {analysis['career_analysis']['content_type'].replace('_', ' ').title()}
- **Career Relevance Score**: {analysis['career_analysis']['career_relevance_score']:.2%}
- **Content Quality Score**: {analysis['metadata']['content_quality_score']:.2%}
- **Word Count**: {analysis['metadata']['word_count']:,}

## Key Career Keywords Found
"""
        
        for category, keywords in analysis['career_analysis']['detected_keywords'].items():
            if keywords:
                report += f"\n### {category.replace('_', ' ').title()}\n"
                for keyword in keywords:
                    report += f"- {keyword}\n"
        
        if analysis['career_analysis']['salary_mentions']:
            report += f"\n## Salary Information\n"
            for salary in analysis['career_analysis']['salary_mentions']:
                report += f"- {salary}\n"
        
        if analysis['career_analysis']['job_titles']:
            report += f"\n## Job Titles Mentioned\n"
            for title in analysis['career_analysis']['job_titles']:
                report += f"- {title}\n"
        
        if analysis['career_analysis']['skills_mentioned']:
            report += f"\n## Skills Mentioned\n"
            for skill in analysis['career_analysis']['skills_mentioned']:
                report += f"- {skill}\n"
        
        if analysis['career_analysis']['action_items']:
            report += f"\n## Action Items\n"
            for item in analysis['career_analysis']['action_items'][:5]:
                report += f"- {item}\n"
        
        if analysis['career_analysis']['career_advice']:
            report += f"\n## Career Advice\n"
            for advice in analysis['career_analysis']['career_advice'][:5]:
                report += f"- {advice}\n"
        
        report += f"\n---\n*Analysis generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*"
        
        # Save report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_filename = f"career_report_{timestamp}.md"
        report_path = self.desktop_path / report_filename
        
        with open(report_path, 'w') as f:
            f.write(report)
        
        return str(report_path)

# Example usage
async def main():
    """Example usage of the CareerContentExtractor."""
    extractor = CareerContentExtractor()
    
    # Example content from the Stylist article
    example_content = """
    Brag documents are an effective alternative to cover letters in job applications. 
    They focus on achievements and measurable results, making them useful for career 
    transitions and promotions. This structured approach to self-promotion helps 
    candidates showcase their value to potential employers.
    
    When creating a brag document, you should include specific metrics and outcomes. 
    Try to quantify your achievements with numbers and percentages. Consider including 
    testimonials from colleagues or managers. Make sure to update your brag document 
    regularly as you accomplish new things.
    
    The salary range for positions that use brag documents typically ranges from 
    $60,000 to $150,000 depending on experience and industry. Senior Software Engineers 
    and Product Managers often use this approach in technology companies.
    
    Key skills to highlight include leadership, project management, and technical 
    expertise. Industries like technology, healthcare, and finance are increasingly 
    adopting this approach.
    """
    
    analysis = await extractor.extract_career_content(
        url="https://www.stylist.co.uk/life/careers/brag-doc-cover-letter-alternative/1001039",
        html_content="<html>...</html>",
        text_content=example_content
    )
    
    # Save results
    json_path = await extractor.save_career_analysis(analysis)
    report_path = await extractor.generate_career_report(analysis)
    
    print(f"✅ Career analysis completed!")
    print(f"📁 JSON results: {json_path}")
    print(f"📁 Markdown report: {report_path}")

if __name__ == "__main__":
    asyncio.run(main()) 