#!/usr/bin/env python3
"""
Tech Stack Analyzer
Detects frameworks, languages, and extracts source code specifications from the crawled data
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any, Set
from urllib.parse import urlparse
import subprocess
import tempfile
import os


class TechStackAnalyzer:
    """Analyzes tech stack from crawled data."""
    
    def __init__(self, crawl_data_dir: str = None):
        if crawl_data_dir:
            self.crawl_data_dir = Path(crawl_data_dir)
        else:
            # Default to desktop location
            desktop_path = Path.home() / "Desktop"
            self.crawl_data_dir = desktop_path / "ViralStyle_Crawl_Data"
        
        self.tech_stack = {
            "frontend": {
                "frameworks": set(),
                "libraries": set(),
                "build_tools": set(),
                "languages": set(),
                "css_frameworks": set(),
                "state_management": set(),
                "routing": set(),
                "ui_libraries": set()
            },
            "backend": {
                "frameworks": set(),
                "languages": set(),
                "databases": set(),
                "apis": set(),
                "servers": set(),
                "caching": set()
            },
            "devops": {
                "hosting": set(),
                "cdn": set(),
                "monitoring": set(),
                "analytics": set(),
                "payment_processors": set()
            },
            "source_code": {
                "javascript_files": [],
                "css_files": [],
                "html_structure": {},
                "api_endpoints": [],
                "dependencies": {}
            }
        }
    
    def analyze_crawl_data(self) -> Dict[str, Any]:
        """Analyze all crawl data for tech stack detection."""
        print("🔍 Analyzing tech stack from crawl data...")
        
        # Find all JSON files
        json_files = list(self.crawl_data_dir.glob("*.json"))
        
        for json_file in json_files:
            if "deep_viralstyle.com_" in json_file.name:
                print(f"📄 Analyzing: {json_file.name}")
                self.analyze_single_crawl_file(json_file)
        
        # Convert sets to lists for JSON serialization
        self._convert_sets_to_lists()
        
        # Generate comprehensive report
        report = self.generate_tech_stack_report()
        
        # Save analysis results
        self.save_analysis_results(report)
        
        return report
    
    def analyze_single_crawl_file(self, json_file: Path):
        """Analyze a single crawl file for tech stack."""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Analyze basic extraction data
            if "extraction" in data and "basic" in data["extraction"]:
                basic_data = data["extraction"]["basic"]
                
                # Analyze scripts for frameworks and libraries
                scripts = basic_data.get("scripts", [])
                self.analyze_scripts(scripts)
                
                # Analyze stylesheets for CSS frameworks
                stylesheets = basic_data.get("stylesheets", [])
                self.analyze_stylesheets(stylesheets)
                
                # Analyze meta tags for tech hints
                meta_tags = basic_data.get("meta_tags", [])
                self.analyze_meta_tags(meta_tags)
                
                # Analyze content for framework signatures
                content = data.get("content", "")
                self.analyze_content_signatures(content)
            
            # Analyze enhanced data if available
            if "extraction" in data and "enhanced" in data["extraction"]:
                enhanced_data = data["extraction"]["enhanced"]
                self.analyze_enhanced_data(enhanced_data)
            
            # Analyze APIs
            if "extraction" in data and "apis" in data["extraction"]:
                api_data = data["extraction"]["apis"]
                self.analyze_api_data(api_data)
            
        except Exception as e:
            print(f"⚠️  Error analyzing {json_file.name}: {e}")
    
    def analyze_scripts(self, scripts: List[str]):
        """Analyze JavaScript files for frameworks and libraries."""
        framework_patterns = {
            # React ecosystem
            "react": [r"react", r"react-dom", r"@types/react"],
            "next.js": [r"next", r"__next"],
            "gatsby": [r"gatsby"],
            
            # Vue ecosystem
            "vue": [r"vue", r"vue-router", r"vuex"],
            "nuxt": [r"nuxt"],
            
            # Angular
            "angular": [r"angular", r"@angular"],
            
            # Other frameworks
            "svelte": [r"svelte"],
            "ember": [r"ember"],
            "backbone": [r"backbone"],
            
            # State management
            "redux": [r"redux", r"@reduxjs"],
            "mobx": [r"mobx"],
            "zustand": [r"zustand"],
            "recoil": [r"recoil"],
            
            # UI libraries
            "material-ui": [r"@mui", r"@material-ui"],
            "ant-design": [r"antd", r"@ant-design"],
            "bootstrap": [r"bootstrap"],
            "tailwind": [r"tailwind"],
            "chakra-ui": [r"@chakra-ui"],
            
            # Build tools
            "webpack": [r"webpack"],
            "vite": [r"vite"],
            "parcel": [r"parcel"],
            "rollup": [r"rollup"],
            
            # Testing
            "jest": [r"jest"],
            "cypress": [r"cypress"],
            "playwright": [r"playwright"],
            
            # Utilities
            "lodash": [r"lodash"],
            "axios": [r"axios"],
            "fetch": [r"fetch"],
            "jquery": [r"jquery", r"\$\(\)"],
            
            # TypeScript
            "typescript": [r"typescript", r"tsconfig", r"\.ts$", r"\.tsx$"],
            
            # Modern JS features
            "es6+": [r"const\s+", r"let\s+", r"=>", r"async", r"await"],
            
            # Payment processors
            "stripe": [r"stripe", r"stripe\.com"],
            "paypal": [r"paypal", r"paypalobjects\.com"],
            "braintree": [r"braintree"],
            
            # Analytics
            "google-analytics": [r"gtag", r"ga\(\)", r"google-analytics"],
            "facebook-pixel": [r"fbq", r"facebook\.net"],
            "hotjar": [r"hotjar"],
            "mixpanel": [r"mixpanel"],
            
            # CDN/Cloud
            "cloudflare": [r"cloudflare"],
            "aws": [r"aws", r"amazonaws\.com"],
            "google-cloud": [r"googleapis\.com"],
            "cdnjs": [r"cdnjs"],
            "unpkg": [r"unpkg"],
            "jsdelivr": [r"jsdelivr"]
        }
        
        for script in scripts:
            script_lower = script.lower()
            
            for framework, patterns in framework_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, script_lower, re.IGNORECASE):
                        if framework in ["react", "vue", "angular", "svelte", "ember", "backbone"]:
                            self.tech_stack["frontend"]["frameworks"].add(framework)
                        elif framework in ["redux", "mobx", "zustand", "recoil"]:
                            self.tech_stack["frontend"]["state_management"].add(framework)
                        elif framework in ["material-ui", "ant-design", "bootstrap", "tailwind", "chakra-ui"]:
                            self.tech_stack["frontend"]["ui_libraries"].add(framework)
                        elif framework in ["webpack", "vite", "parcel", "rollup"]:
                            self.tech_stack["frontend"]["build_tools"].add(framework)
                        elif framework in ["typescript"]:
                            self.tech_stack["frontend"]["languages"].add(framework)
                        elif framework in ["stripe", "paypal", "braintree"]:
                            self.tech_stack["devops"]["payment_processors"].add(framework)
                        elif framework in ["google-analytics", "facebook-pixel", "hotjar", "mixpanel"]:
                            self.tech_stack["devops"]["analytics"].add(framework)
                        elif framework in ["cloudflare", "aws", "google-cloud", "cdnjs", "unpkg", "jsdelivr"]:
                            self.tech_stack["devops"]["cdn"].add(framework)
                        else:
                            self.tech_stack["frontend"]["libraries"].add(framework)
    
    def analyze_stylesheets(self, stylesheets: List[str]):
        """Analyze CSS files for frameworks and preprocessors."""
        css_patterns = {
            "bootstrap": [r"bootstrap", r"bootstrap\.css"],
            "tailwind": [r"tailwind", r"tailwindcss"],
            "foundation": [r"foundation"],
            "bulma": [r"bulma"],
            "semantic-ui": [r"semantic"],
            "materialize": [r"materialize"],
            "sass": [r"\.scss", r"\.sass"],
            "less": [r"\.less"],
            "stylus": [r"\.styl"],
            "postcss": [r"postcss"],
            "css-modules": [r"\.module\.css"],
            "styled-components": [r"styled-components"],
            "emotion": [r"@emotion"],
            "css-in-js": [r"styled-", r"@emotion", r"fela"]
        }
        
        for stylesheet in stylesheets:
            stylesheet_lower = stylesheet.lower()
            
            for framework, patterns in css_patterns.items():
                for pattern in patterns:
                    if re.search(pattern, stylesheet_lower, re.IGNORECASE):
                        if framework in ["bootstrap", "tailwind", "foundation", "bulma", "semantic-ui", "materialize"]:
                            self.tech_stack["frontend"]["css_frameworks"].add(framework)
                        elif framework in ["sass", "less", "stylus"]:
                            self.tech_stack["frontend"]["languages"].add(framework)
                        else:
                            self.tech_stack["frontend"]["libraries"].add(framework)
    
    def analyze_meta_tags(self, meta_tags: List[Dict[str, str]]):
        """Analyze meta tags for technology hints."""
        for meta in meta_tags:
            content = meta.get("content", "").lower()
            name = meta.get("name", "").lower()
            property = meta.get("property", "").lower()
            
            # Check for framework-specific meta tags
            if "generator" in name:
                if "wordpress" in content:
                    self.tech_stack["backend"]["frameworks"].add("wordpress")
                elif "drupal" in content:
                    self.tech_stack["backend"]["frameworks"].add("drupal")
                elif "joomla" in content:
                    self.tech_stack["backend"]["frameworks"].add("joomla")
                elif "shopify" in content:
                    self.tech_stack["backend"]["frameworks"].add("shopify")
                elif "magento" in content:
                    self.tech_stack["backend"]["frameworks"].add("magento")
                elif "woocommerce" in content:
                    self.tech_stack["backend"]["frameworks"].add("woocommerce")
            
            # Check for security headers
            if "x-powered-by" in name:
                if "php" in content:
                    self.tech_stack["backend"]["languages"].add("php")
                elif "asp.net" in content:
                    self.tech_stack["backend"]["languages"].add("asp.net")
                elif "express" in content:
                    self.tech_stack["backend"]["frameworks"].add("express")
                elif "django" in content:
                    self.tech_stack["backend"]["frameworks"].add("django")
                elif "rails" in content:
                    self.tech_stack["backend"]["frameworks"].add("rails")
    
    def analyze_content_signatures(self, content: str):
        """Analyze HTML content for framework signatures."""
        content_lower = content.lower()
        
        # React signatures
        if "data-reactroot" in content_lower or "data-reactid" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("react")
        
        # Vue signatures
        if "data-v-" in content_lower or "v-" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("vue")
        
        # Angular signatures
        if "ng-" in content_lower or "data-ng-" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("angular")
        
        # Svelte signatures
        if "svelte" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("svelte")
        
        # Next.js signatures
        if "__next" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("next.js")
        
        # Gatsby signatures
        if "gatsby" in content_lower:
            self.tech_stack["frontend"]["frameworks"].add("gatsby")
        
        # Check for server-side rendering indicators
        if "ssr" in content_lower or "server-side" in content_lower:
            self.tech_stack["frontend"]["libraries"].add("ssr")
        
        # Check for PWA indicators
        if "service-worker" in content_lower or "manifest.json" in content_lower:
            self.tech_stack["frontend"]["libraries"].add("pwa")
    
    def analyze_enhanced_data(self, enhanced_data: Dict[str, Any]):
        """Analyze enhanced extraction data."""
        # This would analyze localStorage, sessionStorage, network traffic, etc.
        pass
    
    def analyze_api_data(self, api_data: Dict[str, Any]):
        """Analyze API endpoints for backend technology hints."""
        endpoints = api_data.get("endpoints", [])
        
        for endpoint in endpoints:
            endpoint_lower = endpoint.lower()
            
            # Check for common API patterns
            if "/api/v1/" in endpoint_lower or "/api/v2/" in endpoint_lower:
                self.tech_stack["backend"]["apis"].add("rest-api")
            
            if "graphql" in endpoint_lower:
                self.tech_stack["backend"]["apis"].add("graphql")
            
            if "grpc" in endpoint_lower:
                self.tech_stack["backend"]["apis"].add("grpc")
            
            # Check for specific service endpoints
            if "stripe" in endpoint_lower:
                self.tech_stack["devops"]["payment_processors"].add("stripe")
            
            if "paypal" in endpoint_lower:
                self.tech_stack["devops"]["payment_processors"].add("paypal")
    
    def extract_source_code_specs(self) -> Dict[str, Any]:
        """Extract detailed source code specifications."""
        specs = {
            "javascript": {
                "files": [],
                "frameworks": [],
                "libraries": [],
                "patterns": []
            },
            "css": {
                "files": [],
                "frameworks": [],
                "preprocessors": [],
                "patterns": []
            },
            "html": {
                "structure": {},
                "meta_tags": [],
                "semantic_elements": []
            },
            "backend_indicators": {
                "headers": [],
                "cookies": [],
                "server_signatures": []
            }
        }
        
        # Analyze all JSON files for source code patterns
        json_files = list(self.crawl_data_dir.glob("*.json"))
        
        for json_file in json_files:
            if "deep_viralstyle.com_" in json_file.name:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Extract JavaScript files
                if "extraction" in data and "basic" in data["extraction"]:
                    basic_data = data["extraction"]["basic"]
                    
                    # JavaScript files
                    scripts = basic_data.get("scripts", [])
                    for script in scripts:
                        specs["javascript"]["files"].append({
                            "url": script,
                            "type": self._classify_script_type(script),
                            "framework": self._detect_script_framework(script)
                        })
                    
                    # CSS files
                    stylesheets = basic_data.get("stylesheets", [])
                    for stylesheet in stylesheets:
                        specs["css"]["files"].append({
                            "url": stylesheet,
                            "type": self._classify_css_type(stylesheet),
                            "framework": self._detect_css_framework(stylesheet)
                        })
                    
                    # HTML structure
                    if "meta_tags" in basic_data:
                        specs["html"]["meta_tags"] = basic_data["meta_tags"]
        
        return specs
    
    def _classify_script_type(self, script_url: str) -> str:
        """Classify the type of JavaScript file."""
        script_lower = script_url.lower()
        
        if "vendor" in script_lower or "vendors" in script_lower:
            return "vendor"
        elif "runtime" in script_lower:
            return "runtime"
        elif "main" in script_lower:
            return "main"
        elif "static" in script_lower:
            return "static"
        elif "bundle" in script_lower:
            return "bundle"
        else:
            return "unknown"
    
    def _detect_script_framework(self, script_url: str) -> str:
        """Detect framework from script URL."""
        script_lower = script_url.lower()
        
        if "react" in script_lower:
            return "react"
        elif "vue" in script_lower:
            return "vue"
        elif "angular" in script_lower:
            return "angular"
        elif "jquery" in script_lower:
            return "jquery"
        elif "bootstrap" in script_lower:
            return "bootstrap"
        else:
            return "unknown"
    
    def _classify_css_type(self, css_url: str) -> str:
        """Classify the type of CSS file."""
        css_lower = css_url.lower()
        
        if "vendor" in css_lower:
            return "vendor"
        elif "main" in css_lower:
            return "main"
        elif "bootstrap" in css_lower:
            return "bootstrap"
        elif "tailwind" in css_lower:
            return "tailwind"
        else:
            return "unknown"
    
    def _detect_css_framework(self, css_url: str) -> str:
        """Detect CSS framework from URL."""
        css_lower = css_url.lower()
        
        if "bootstrap" in css_lower:
            return "bootstrap"
        elif "tailwind" in css_lower:
            return "tailwind"
        elif "foundation" in css_lower:
            return "foundation"
        else:
            return "unknown"
    
    def _convert_sets_to_lists(self):
        """Convert all sets to lists for JSON serialization."""
        for category in self.tech_stack.values():
            if isinstance(category, dict):
                for key, value in category.items():
                    if isinstance(value, set):
                        category[key] = list(value)
    
    def generate_tech_stack_report(self) -> Dict[str, Any]:
        """Generate comprehensive tech stack report."""
        source_specs = self.extract_source_code_specs()
        
        report = {
            "tech_stack": self.tech_stack,
            "source_code_specifications": source_specs,
            "summary": {
                "frontend_frameworks": len(self.tech_stack["frontend"]["frameworks"]),
                "backend_frameworks": len(self.tech_stack["backend"]["frameworks"]),
                "libraries_detected": len(self.tech_stack["frontend"]["libraries"]),
                "payment_processors": len(self.tech_stack["devops"]["payment_processors"]),
                "analytics_tools": len(self.tech_stack["devops"]["analytics"]),
                "cdn_services": len(self.tech_stack["devops"]["cdn"])
            },
            "recommendations": self._generate_recommendations()
        }
        
        return report
    
    def _generate_recommendations(self) -> List[str]:
        """Generate recommendations based on detected tech stack."""
        recommendations = []
        
        # Frontend recommendations
        if "react" in self.tech_stack["frontend"]["frameworks"]:
            recommendations.append("Frontend: React.js detected - Consider Next.js for SSR/SSG")
        
        if "vue" in self.tech_stack["frontend"]["frameworks"]:
            recommendations.append("Frontend: Vue.js detected - Consider Nuxt.js for SSR/SSG")
        
        if "jquery" in self.tech_stack["frontend"]["libraries"]:
            recommendations.append("Frontend: jQuery detected - Consider modern JavaScript frameworks")
        
        # Backend recommendations
        if not self.tech_stack["backend"]["frameworks"]:
            recommendations.append("Backend: No clear backend framework detected - may be using headless CMS")
        
        # Performance recommendations
        if "bootstrap" in self.tech_stack["frontend"]["css_frameworks"]:
            recommendations.append("CSS: Bootstrap detected - Consider Tailwind CSS for better performance")
        
        # Security recommendations
        if "stripe" in self.tech_stack["devops"]["payment_processors"]:
            recommendations.append("Security: Stripe detected - Ensure PCI compliance")
        
        return recommendations
    
    def save_analysis_results(self, report: Dict[str, Any]):
        """Save analysis results to files."""
        # Save JSON report
        report_file = self.crawl_data_dir / "tech_stack_analysis.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Save markdown report
        markdown_file = self.crawl_data_dir / "tech_stack_analysis.md"
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(self._generate_markdown_report(report))
        
        print(f"📄 Tech stack analysis saved to:")
        print(f"   - {report_file}")
        print(f"   - {markdown_file}")
    
    def _generate_markdown_report(self, report: Dict[str, Any]) -> str:
        """Generate markdown report."""
        md = "# 🛠️ Tech Stack Analysis Report\n\n"
        md += f"**Generated:** {report.get('summary', {}).get('timestamp', 'Unknown')}\n\n"
        
        # Tech Stack Summary
        md += "## 📊 Tech Stack Summary\n\n"
        summary = report.get("summary", {})
        md += f"- **Frontend Frameworks:** {summary.get('frontend_frameworks', 0)}\n"
        md += f"- **Backend Frameworks:** {summary.get('backend_frameworks', 0)}\n"
        md += f"- **Libraries Detected:** {summary.get('libraries_detected', 0)}\n"
        md += f"- **Payment Processors:** {summary.get('payment_processors', 0)}\n"
        md += f"- **Analytics Tools:** {summary.get('analytics_tools', 0)}\n"
        md += f"- **CDN Services:** {summary.get('cdn_services', 0)}\n\n"
        
        # Frontend Technologies
        md += "## 🎨 Frontend Technologies\n\n"
        frontend = report.get("tech_stack", {}).get("frontend", {})
        
        if frontend.get("frameworks"):
            md += "### Frameworks\n"
            for framework in frontend["frameworks"]:
                md += f"- {framework}\n"
            md += "\n"
        
        if frontend.get("libraries"):
            md += "### Libraries\n"
            for library in frontend["libraries"]:
                md += f"- {library}\n"
            md += "\n"
        
        if frontend.get("css_frameworks"):
            md += "### CSS Frameworks\n"
            for css_framework in frontend["css_frameworks"]:
                md += f"- {css_framework}\n"
            md += "\n"
        
        # Backend Technologies
        md += "## ⚙️ Backend Technologies\n\n"
        backend = report.get("tech_stack", {}).get("backend", {})
        
        if backend.get("frameworks"):
            md += "### Frameworks\n"
            for framework in backend["frameworks"]:
                md += f"- {framework}\n"
            md += "\n"
        
        if backend.get("apis"):
            md += "### APIs\n"
            for api in backend["apis"]:
                md += f"- {api}\n"
            md += "\n"
        
        # DevOps & Services
        md += "## 🚀 DevOps & Services\n\n"
        devops = report.get("tech_stack", {}).get("devops", {})
        
        if devops.get("payment_processors"):
            md += "### Payment Processors\n"
            for processor in devops["payment_processors"]:
                md += f"- {processor}\n"
            md += "\n"
        
        if devops.get("analytics"):
            md += "### Analytics\n"
            for analytics in devops["analytics"]:
                md += f"- {analytics}\n"
            md += "\n"
        
        if devops.get("cdn"):
            md += "### CDN Services\n"
            for cdn in devops["cdn"]:
                md += f"- {cdn}\n"
            md += "\n"
        
        # Source Code Specifications
        md += "## 📝 Source Code Specifications\n\n"
        specs = report.get("source_code_specifications", {})
        
        if specs.get("javascript", {}).get("files"):
            md += "### JavaScript Files\n"
            for js_file in specs["javascript"]["files"][:10]:  # Show first 10
                md += f"- {js_file['url']} ({js_file['type']})\n"
            md += "\n"
        
        if specs.get("css", {}).get("files"):
            md += "### CSS Files\n"
            for css_file in specs["css"]["files"][:10]:  # Show first 10
                md += f"- {css_file['url']} ({css_file['type']})\n"
            md += "\n"
        
        # Recommendations
        recommendations = report.get("recommendations", [])
        if recommendations:
            md += "## 💡 Recommendations\n\n"
            for rec in recommendations:
                md += f"- {rec}\n"
            md += "\n"
        
        return md
    
    def analyze_single_crawl_data(self, crawl_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a single crawl data object for tech stack detection."""
        try:
            # Create a fresh tech stack for this analysis
            fresh_tech_stack = {
                "frontend": {
                    "frameworks": set(),
                    "libraries": set(),
                    "build_tools": set(),
                    "languages": set(),
                    "css_frameworks": set(),
                    "state_management": set(),
                    "routing": set(),
                    "ui_libraries": set()
                },
                "backend": {
                    "frameworks": set(),
                    "languages": set(),
                    "databases": set(),
                    "apis": set(),
                    "servers": set(),
                    "caching": set()
                },
                "devops": {
                    "hosting": set(),
                    "cdn": set(),
                    "monitoring": set(),
                    "analytics": set(),
                    "payment_processors": set()
                },
                "source_code": {
                    "javascript_files": [],
                    "css_files": [],
                    "html_structure": {},
                    "api_endpoints": [],
                    "dependencies": {}
                }
            }
            
            # Extract basic data
            content = crawl_data.get("content", "")
            extraction = crawl_data.get("extraction", {})
            basic_extraction = extraction.get("basic", {})
            
            # Analyze scripts
            scripts = basic_extraction.get("scripts", [])
            for script in scripts:
                script_lower = script.lower()
                if "react" in script_lower:
                    fresh_tech_stack["frontend"]["frameworks"].add("react")
                elif "vue" in script_lower:
                    fresh_tech_stack["frontend"]["frameworks"].add("vue")
                elif "angular" in script_lower:
                    fresh_tech_stack["frontend"]["frameworks"].add("angular")
                elif "jquery" in script_lower:
                    fresh_tech_stack["frontend"]["libraries"].add("jquery")
                elif "bootstrap" in script_lower:
                    fresh_tech_stack["frontend"]["css_frameworks"].add("bootstrap")
            
            # Analyze stylesheets
            stylesheets = basic_extraction.get("stylesheets", [])
            for stylesheet in stylesheets:
                stylesheet_lower = stylesheet.lower()
                if "bootstrap" in stylesheet_lower:
                    fresh_tech_stack["frontend"]["css_frameworks"].add("bootstrap")
                elif "tailwind" in stylesheet_lower:
                    fresh_tech_stack["frontend"]["css_frameworks"].add("tailwind")
            
            # Analyze meta tags
            meta_tags = basic_extraction.get("meta_tags", {})
            if isinstance(meta_tags, dict):
                for name, content in meta_tags.items():
                    if "generator" in name.lower() and "wordpress" in content.lower():
                        fresh_tech_stack["backend"]["frameworks"].add("wordpress")
            
            # Convert sets to lists for JSON serialization
            for category in fresh_tech_stack.values():
                if isinstance(category, dict):
                    for key, value in category.items():
                        if isinstance(value, set):
                            category[key] = list(value)
            
            return fresh_tech_stack
            
        except Exception as e:
            print(f"Error analyzing single crawl data: {e}")
            return {
                "error": str(e),
                "frontend": {"frameworks": [], "libraries": []},
                "backend": {"frameworks": [], "languages": []},
                "devops": {"hosting": [], "cdn": []},
                "source_code": {"javascript_files": [], "css_files": []}
            }


def main():
    """Main function to run tech stack analysis."""
    print("🔍 ViralStyle.com Tech Stack Analyzer")
    print("=" * 50)
    
    analyzer = TechStackAnalyzer()
    report = analyzer.analyze_crawl_data()
    
    print("\n✅ Tech stack analysis completed!")
    print(f"📊 Detected {report['summary']['frontend_frameworks']} frontend frameworks")
    print(f"🔧 Detected {report['summary']['backend_frameworks']} backend frameworks")
    print(f"📚 Detected {report['summary']['libraries_detected']} libraries")
    
    # Show key findings
    tech_stack = report["tech_stack"]
    
    if tech_stack["frontend"]["frameworks"]:
        print(f"\n🎨 Frontend Frameworks: {', '.join(tech_stack['frontend']['frameworks'])}")
    
    if tech_stack["frontend"]["css_frameworks"]:
        print(f"🎨 CSS Frameworks: {', '.join(tech_stack['frontend']['css_frameworks'])}")
    
    if tech_stack["devops"]["payment_processors"]:
        print(f"💳 Payment Processors: {', '.join(tech_stack['devops']['payment_processors'])}")
    
    if tech_stack["devops"]["analytics"]:
        print(f"📈 Analytics: {', '.join(tech_stack['devops']['analytics'])}")


if __name__ == "__main__":
    main() 