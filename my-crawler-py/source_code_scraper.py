#!/usr/bin/env python3
"""
Source Code Scraper
Detects, clones, and analyzes repositories based on technology stack findings.
"""

import json
import re
import subprocess
import requests
import os
import shutil
from pathlib import Path
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse, urljoin
import git
from git import Repo
import tempfile
import zipfile
import tarfile
import yaml
import toml


class SourceCodeScraper:
    """Scrapes and analyzes source code based on technology stack."""
    
    def __init__(self, crawl_data_dir: str = None):
        if crawl_data_dir:
            self.crawl_data_dir = Path(crawl_data_dir)
        else:
            desktop_path = Path.home() / "Desktop"
            self.crawl_data_dir = desktop_path / "ViralStyle_Crawl_Data"
        
        self.repo_patterns = {
            "vue": {
                "package_patterns": ["vue", "vue-router", "vuex", "@vue"],
                "file_patterns": ["*.vue", "*.ts", "*.js"],
                "config_files": ["package.json", "vue.config.js", "vite.config.js"],
                "repo_indicators": ["vue", "nuxt", "quasar"]
            },
            "react": {
                "package_patterns": ["react", "react-dom", "@types/react"],
                "file_patterns": ["*.jsx", "*.tsx", "*.js", "*.ts"],
                "config_files": ["package.json", "next.config.js", "gatsby-config.js"],
                "repo_indicators": ["react", "next", "gatsby", "create-react-app"]
            },
            "angular": {
                "package_patterns": ["@angular", "angular", "rxjs"],
                "file_patterns": ["*.ts", "*.html", "*.scss"],
                "config_files": ["package.json", "angular.json", "tsconfig.json"],
                "repo_indicators": ["angular", "ng-"]
            },
            "typescript": {
                "package_patterns": ["typescript", "@types"],
                "file_patterns": ["*.ts", "*.tsx", "tsconfig.json"],
                "config_files": ["tsconfig.json", "package.json"],
                "repo_indicators": ["typescript", "ts-"]
            },
            "webpack": {
                "package_patterns": ["webpack", "webpack-cli", "webpack-dev-server"],
                "file_patterns": ["webpack.config.js", "*.js"],
                "config_files": ["webpack.config.js", "package.json"],
                "repo_indicators": ["webpack", "bundler"]
            },
            "bootstrap": {
                "package_patterns": ["bootstrap", "@bootstrap"],
                "file_patterns": ["*.css", "*.scss", "*.less"],
                "config_files": ["package.json", "bootstrap.config.js"],
                "repo_indicators": ["bootstrap", "ui"]
            }
        }
        
        self.detected_repos = []
        self.source_analysis = {}
        
    def analyze_tech_stack_for_repos(self) -> Dict[str, Any]:
        """Analyze detected tech stack to find potential repositories."""
        print("🔍 Analyzing tech stack for repository patterns...")
        
        # Load tech stack analysis
        tech_stack_file = self.crawl_data_dir / "enhanced_framework_detection.json"
        if not tech_stack_file.exists():
            print("❌ No tech stack analysis found. Run enhanced_framework_detector.py first.")
            return {}
        
        with open(tech_stack_file, 'r') as f:
            tech_stack_data = json.load(f)
        
        detected_frameworks = tech_stack_data.get("detected_frameworks", {})
        
        repo_opportunities = {}
        for framework, details in detected_frameworks.items():
            if framework in self.repo_patterns:
                confidence = details.get("confidence", 0)
                if confidence > 10:  # Only high-confidence frameworks
                    repo_opportunities[framework] = {
                        "confidence": confidence,
                        "patterns": self.repo_patterns[framework],
                        "search_terms": self.repo_patterns[framework]["repo_indicators"]
                    }
        
        return repo_opportunities
    
    def search_github_repos(self, search_terms: List[str], domain: str = "viralstyle.com") -> List[Dict[str, Any]]:
        """Search GitHub for repositories related to the detected tech stack."""
        print(f"🔍 Searching GitHub for repositories related to: {', '.join(search_terms)}")
        
        repos = []
        
        for term in search_terms:
            try:
                # Search for repositories with the domain name and technology
                search_query = f"{domain} {term}"
                url = f"https://api.github.com/search/repositories?q={search_query}&sort=stars&order=desc"
                
                response = requests.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
                
                if response.status_code == 200:
                    data = response.json()
                    for repo in data.get("items", [])[:5]:  # Top 5 results
                        repos.append({
                            "name": repo["full_name"],
                            "description": repo["description"],
                            "url": repo["html_url"],
                            "clone_url": repo["clone_url"],
                            "stars": repo["stargazers_count"],
                            "language": repo["language"],
                            "search_term": term,
                            "relevance_score": self.calculate_relevance_score(repo, term, domain)
                        })
                
            except Exception as e:
                print(f"⚠️  Error searching for {term}: {e}")
        
        # Sort by relevance score
        repos.sort(key=lambda x: x["relevance_score"], reverse=True)
        return repos
    
    def calculate_relevance_score(self, repo: Dict[str, Any], search_term: str, domain: str) -> int:
        """Calculate relevance score for a repository."""
        score = 0
        
        # Domain in name or description
        if domain.lower() in repo["name"].lower():
            score += 50
        if repo["description"] and domain.lower() in repo["description"].lower():
            score += 30
        
        # Search term in name or description
        if search_term.lower() in repo["name"].lower():
            score += 40
        if repo["description"] and search_term.lower() in repo["description"].lower():
            score += 20
        
        # Stars (popularity)
        score += min(repo["stars"], 100)
        
        # Language relevance
        if repo["language"] in ["JavaScript", "TypeScript", "Vue", "HTML", "CSS"]:
            score += 20
        
        return score
    
    def clone_and_analyze_repo(self, repo_url: str, repo_name: str) -> Dict[str, Any]:
        """Clone and analyze a repository."""
        print(f"📥 Cloning repository: {repo_name}")
        
        analysis = {
            "repo_name": repo_name,
            "repo_url": repo_url,
            "clone_success": False,
            "file_structure": {},
            "dependencies": {},
            "config_files": {},
            "source_code_samples": [],
            "architecture_insights": []
        }
        
        try:
            # Create temporary directory for cloning
            with tempfile.TemporaryDirectory() as temp_dir:
                temp_path = Path(temp_dir)
                
                # Clone repository
                print(f"  🔄 Cloning to: {temp_path}")
                repo = Repo.clone_from(repo_url, temp_path)
                
                analysis["clone_success"] = True
                analysis["file_structure"] = self.analyze_file_structure(temp_path)
                analysis["dependencies"] = self.extract_dependencies(temp_path)
                analysis["config_files"] = self.analyze_config_files(temp_path)
                analysis["source_code_samples"] = self.extract_source_samples(temp_path)
                analysis["architecture_insights"] = self.analyze_architecture(temp_path)
                
        except Exception as e:
            print(f"❌ Error cloning {repo_name}: {e}")
            analysis["error"] = str(e)
        
        return analysis
    
    def analyze_file_structure(self, repo_path: Path) -> Dict[str, Any]:
        """Analyze the file structure of a repository."""
        structure = {
            "total_files": 0,
            "file_types": {},
            "directories": [],
            "key_files": []
        }
        
        try:
            for root, dirs, files in os.walk(repo_path):
                # Skip node_modules and other large directories
                dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
                
                for file in files:
                    structure["total_files"] += 1
                    
                    # Count file types
                    ext = Path(file).suffix
                    structure["file_types"][ext] = structure["file_types"].get(ext, 0) + 1
                    
                    # Identify key files
                    if file in ['package.json', 'README.md', 'Dockerfile', 'docker-compose.yml']:
                        structure["key_files"].append(str(Path(root) / file))
            
            # Get top-level directories
            structure["directories"] = [d.name for d in repo_path.iterdir() if d.is_dir()]
            
        except Exception as e:
            print(f"⚠️  Error analyzing file structure: {e}")
        
        return structure
    
    def extract_dependencies(self, repo_path: Path) -> Dict[str, Any]:
        """Extract dependencies from package.json and other config files."""
        dependencies = {
            "package.json": {},
            "requirements.txt": [],
            "Pipfile": {},
            "Cargo.toml": {},
            "go.mod": {},
            "composer.json": {}
        }
        
        # Package.json (Node.js)
        package_json = repo_path / "package.json"
        if package_json.exists():
            try:
                with open(package_json, 'r') as f:
                    data = json.load(f)
                    dependencies["package.json"] = {
                        "dependencies": data.get("dependencies", {}),
                        "devDependencies": data.get("devDependencies", {}),
                        "scripts": data.get("scripts", {}),
                        "engines": data.get("engines", {})
                    }
            except Exception as e:
                print(f"⚠️  Error reading package.json: {e}")
        
        # Requirements.txt (Python)
        requirements_txt = repo_path / "requirements.txt"
        if requirements_txt.exists():
            try:
                with open(requirements_txt, 'r') as f:
                    dependencies["requirements.txt"] = [line.strip() for line in f if line.strip()]
            except Exception as e:
                print(f"⚠️  Error reading requirements.txt: {e}")
        
        # Pipfile (Python)
        pipfile = repo_path / "Pipfile"
        if pipfile.exists():
            try:
                with open(pipfile, 'r') as f:
                    dependencies["Pipfile"] = yaml.safe_load(f)
            except Exception as e:
                print(f"⚠️  Error reading Pipfile: {e}")
        
        # Cargo.toml (Rust)
        cargo_toml = repo_path / "Cargo.toml"
        if cargo_toml.exists():
            try:
                with open(cargo_toml, 'r') as f:
                    dependencies["Cargo.toml"] = toml.load(f)
            except Exception as e:
                print(f"⚠️  Error reading Cargo.toml: {e}")
        
        return dependencies
    
    def analyze_config_files(self, repo_path: Path) -> Dict[str, Any]:
        """Analyze configuration files for technology insights."""
        configs = {}
        
        config_files = [
            "package.json", "tsconfig.json", "webpack.config.js", "vite.config.js",
            "vue.config.js", "next.config.js", "angular.json", "docker-compose.yml",
            "Dockerfile", ".env", ".env.example", "README.md"
        ]
        
        for config_file in config_files:
            config_path = repo_path / config_file
            if config_path.exists():
                try:
                    if config_file.endswith('.json'):
                        with open(config_path, 'r') as f:
                            configs[config_file] = json.load(f)
                    elif config_file.endswith('.md'):
                        with open(config_path, 'r') as f:
                            configs[config_file] = f.read()[:1000]  # First 1000 chars
                    else:
                        with open(config_path, 'r') as f:
                            configs[config_file] = f.read()
                except Exception as e:
                    print(f"⚠️  Error reading {config_file}: {e}")
        
        return configs
    
    def extract_source_samples(self, repo_path: Path) -> List[Dict[str, Any]]:
        """Extract sample source code files for analysis."""
        samples = []
        
        # Look for key source files
        source_patterns = [
            "*.js", "*.ts", "*.jsx", "*.tsx", "*.vue", "*.py", "*.java", "*.go",
            "*.rs", "*.php", "*.rb", "*.cs", "*.scala"
        ]
        
        for pattern in source_patterns:
            for file_path in repo_path.rglob(pattern):
                # Skip node_modules and other large directories
                if "node_modules" in str(file_path) or "dist" in str(file_path):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Only include files with reasonable size
                        if len(content) < 10000:  # Less than 10KB
                            samples.append({
                                "file": str(file_path.relative_to(repo_path)),
                                "size": len(content),
                                "content_preview": content[:500],
                                "language": file_path.suffix[1:] if file_path.suffix else "unknown"
                            })
                        
                        # Limit number of samples
                        if len(samples) >= 20:
                            break
                            
                except Exception as e:
                    continue
        
        return samples[:20]  # Return max 20 samples
    
    def analyze_architecture(self, repo_path: Path) -> List[str]:
        """Analyze repository architecture and patterns."""
        insights = []
        
        # Check for common architectural patterns
        if (repo_path / "src").exists():
            insights.append("Uses src/ directory structure")
        
        if (repo_path / "components").exists():
            insights.append("Component-based architecture")
        
        if (repo_path / "pages").exists():
            insights.append("Page-based routing structure")
        
        if (repo_path / "api").exists():
            insights.append("API directory present")
        
        if (repo_path / "public").exists():
            insights.append("Public assets directory")
        
        if (repo_path / "tests").exists():
            insights.append("Test directory present")
        
        if (repo_path / "docs").exists():
            insights.append("Documentation directory")
        
        # Check for Docker
        if (repo_path / "Dockerfile").exists():
            insights.append("Containerized with Docker")
        
        if (repo_path / "docker-compose.yml").exists():
            insights.append("Uses Docker Compose")
        
        # Check for CI/CD
        ci_files = [".github", ".gitlab-ci.yml", ".travis.yml", "Jenkinsfile"]
        for ci_file in ci_files:
            if (repo_path / ci_file).exists():
                insights.append(f"CI/CD configured ({ci_file})")
        
        return insights
    
    def generate_repo_analysis_report(self, repo_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate comprehensive repository analysis report."""
        report = {
            "summary": {
                "total_repos_analyzed": len(repo_analyses),
                "successful_clones": len([r for r in repo_analyses if r.get("clone_success")]),
                "failed_clones": len([r for r in repo_analyses if not r.get("clone_success")])
            },
            "repositories": repo_analyses,
            "technology_insights": self.extract_technology_insights(repo_analyses),
            "architecture_patterns": self.extract_architecture_patterns(repo_analyses),
            "dependency_analysis": self.analyze_dependencies_across_repos(repo_analyses)
        }
        
        return report
    
    def extract_technology_insights(self, repo_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract technology insights from repository analyses."""
        insights = {
            "frameworks": {},
            "languages": {},
            "build_tools": {},
            "databases": {},
            "deployment": {}
        }
        
        for repo in repo_analyses:
            if not repo.get("clone_success"):
                continue
            
            # Analyze package.json dependencies
            deps = repo.get("dependencies", {}).get("package.json", {})
            
            # Frameworks
            for dep_type in ["dependencies", "devDependencies"]:
                for dep, version in deps.get(dep_type, {}).items():
                    if "vue" in dep.lower():
                        insights["frameworks"]["vue"] = insights["frameworks"].get("vue", 0) + 1
                    elif "react" in dep.lower():
                        insights["frameworks"]["react"] = insights["frameworks"].get("react", 0) + 1
                    elif "angular" in dep.lower():
                        insights["frameworks"]["angular"] = insights["frameworks"].get("angular", 0) + 1
                    elif "webpack" in dep.lower():
                        insights["build_tools"]["webpack"] = insights["build_tools"].get("webpack", 0) + 1
                    elif "vite" in dep.lower():
                        insights["build_tools"]["vite"] = insights["build_tools"].get("vite", 0) + 1
                    elif "typescript" in dep.lower():
                        insights["languages"]["typescript"] = insights["languages"].get("typescript", 0) + 1
        
        return insights
    
    def extract_architecture_patterns(self, repo_analyses: List[Dict[str, Any]]) -> List[str]:
        """Extract common architecture patterns."""
        patterns = []
        pattern_counts = {}
        
        for repo in repo_analyses:
            if not repo.get("clone_success"):
                continue
            
            insights = repo.get("architecture_insights", [])
            for insight in insights:
                pattern_counts[insight] = pattern_counts.get(insight, 0) + 1
        
        # Return patterns that appear in multiple repos
        for pattern, count in pattern_counts.items():
            if count > 1:
                patterns.append(f"{pattern} (found in {count} repos)")
        
        return patterns
    
    def analyze_dependencies_across_repos(self, repo_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze dependencies across all repositories."""
        all_deps = {}
        common_deps = {}
        
        for repo in repo_analyses:
            if not repo.get("clone_success"):
                continue
            
            deps = repo.get("dependencies", {}).get("package.json", {})
            
            for dep_type in ["dependencies", "devDependencies"]:
                for dep, version in deps.get(dep_type, {}).items():
                    all_deps[dep] = all_deps.get(dep, 0) + 1
        
        # Find common dependencies (used in multiple repos)
        for dep, count in all_deps.items():
            if count > 1:
                common_deps[dep] = count
        
        return {
            "total_unique_dependencies": len(all_deps),
            "common_dependencies": dict(sorted(common_deps.items(), key=lambda x: x[1], reverse=True)[:20])
        }
    
    def save_repo_analysis(self, report: Dict[str, Any]):
        """Save repository analysis to files."""
        # Save JSON report
        report_file = self.crawl_data_dir / "repository_analysis.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Save markdown report
        markdown_file = self.crawl_data_dir / "repository_analysis.md"
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(self.generate_markdown_report(report))
        
        print(f"📄 Repository analysis saved to:")
        print(f"   - {report_file}")
        print(f"   - {markdown_file}")
    
    def generate_markdown_report(self, report: Dict[str, Any]) -> str:
        """Generate markdown report for repository analysis."""
        md = "# 📂 Repository Analysis Report\n\n"
        md += "**Analysis Method:** GitHub repository search and cloning based on tech stack detection\n\n"
        
        # Summary
        summary = report.get("summary", {})
        md += "## 📊 Analysis Summary\n\n"
        md += f"- **Total Repositories Found:** {summary.get('total_repos_analyzed', 0)}\n"
        md += f"- **Successfully Cloned:** {summary.get('successful_clones', 0)}\n"
        md += f"- **Failed Clones:** {summary.get('failed_clones', 0)}\n\n"
        
        # Technology Insights
        insights = report.get("technology_insights", {})
        if insights:
            md += "## 🛠️ Technology Insights\n\n"
            
            for category, items in insights.items():
                if items:
                    md += f"### {category.title()}\n"
                    for tech, count in items.items():
                        md += f"- **{tech}**: Found in {count} repositories\n"
                    md += "\n"
        
        # Architecture Patterns
        patterns = report.get("architecture_patterns", [])
        if patterns:
            md += "## 🏗️ Architecture Patterns\n\n"
            for pattern in patterns:
                md += f"- {pattern}\n"
            md += "\n"
        
        # Dependency Analysis
        deps = report.get("dependency_analysis", {})
        if deps:
            md += "## 📦 Dependency Analysis\n\n"
            md += f"- **Total Unique Dependencies:** {deps.get('total_unique_dependencies', 0)}\n\n"
            
            common_deps = deps.get("common_dependencies", {})
            if common_deps:
                md += "### Most Common Dependencies\n\n"
                for dep, count in list(common_deps.items())[:10]:
                    md += f"- **{dep}**: Used in {count} repositories\n"
                md += "\n"
        
        # Individual Repository Details
        repos = report.get("repositories", [])
        if repos:
            md += "## 📁 Repository Details\n\n"
            
            for i, repo in enumerate(repos, 1):
                md += f"### {i}. {repo.get('repo_name', 'Unknown')}\n"
                md += f"- **URL:** {repo.get('repo_url', 'Unknown')}\n"
                md += f"- **Clone Success:** {'✅' if repo.get('clone_success') else '❌'}\n"
                
                if repo.get("clone_success"):
                    structure = repo.get("file_structure", {})
                    md += f"- **Total Files:** {structure.get('total_files', 0)}\n"
                    md += f"- **Key Files:** {', '.join(structure.get('key_files', [])[:5])}\n"
                    
                    insights = repo.get("architecture_insights", [])
                    if insights:
                        md += f"- **Architecture:** {', '.join(insights[:3])}\n"
                
                md += "\n"
        
        return md


def main():
    """Main function to run source code scraping."""
    print("📂 Source Code Repository Scraper")
    print("=" * 50)
    
    scraper = SourceCodeScraper()
    
    # Analyze tech stack for repository opportunities
    repo_opportunities = scraper.analyze_tech_stack_for_repos()
    
    if not repo_opportunities:
        print("❌ No high-confidence frameworks detected for repository search.")
        return
    
    print(f"🎯 Found {len(repo_opportunities)} frameworks for repository search:")
    for framework, details in repo_opportunities.items():
        print(f"   - {framework.title()} (confidence: {details['confidence']})")
    
    # Search for repositories
    all_repos = []
    for framework, details in repo_opportunities.items():
        search_terms = details["search_terms"]
        repos = scraper.search_github_repos(search_terms)
        all_repos.extend(repos)
    
    if not all_repos:
        print("❌ No relevant repositories found.")
        return
    
    print(f"\n📥 Found {len(all_repos)} potential repositories")
    
    # Clone and analyze top repositories
    repo_analyses = []
    for repo in all_repos[:5]:  # Analyze top 5 repositories
        analysis = scraper.clone_and_analyze_repo(repo["clone_url"], repo["name"])
        repo_analyses.append(analysis)
    
    # Generate comprehensive report
    report = scraper.generate_repo_analysis_report(repo_analyses)
    
    # Save results
    scraper.save_repo_analysis(report)
    
    print("\n✅ Repository analysis completed!")
    print(f"📊 Analyzed {len(repo_analyses)} repositories")
    print(f"✅ Successfully cloned: {report['summary']['successful_clones']}")
    print(f"❌ Failed clones: {report['summary']['failed_clones']}")


if __name__ == "__main__":
    main() 