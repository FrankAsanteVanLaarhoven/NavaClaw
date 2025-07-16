#!/usr/bin/env python3
"""
Enhanced Framework Detector
Analyzes JavaScript content and HTML structure to identify specific frameworks.
"""

import json
import re
import requests
from pathlib import Path
from typing import Dict, List, Any, Set
from urllib.parse import urlparse
import base64


class EnhancedFrameworkDetector:
    """Enhanced framework detection with content analysis."""
    
    def __init__(self, crawl_data_dir: str = None):
        if crawl_data_dir:
            self.crawl_data_dir = Path(crawl_data_dir)
        else:
            desktop_path = Path.home() / "Desktop"
            self.crawl_data_dir = desktop_path / "ViralStyle_Crawl_Data"
        
        self.framework_signatures = {
            "react": {
                "patterns": [
                    r"React\.createElement",
                    r"ReactDOM\.render",
                    r"useState|useEffect|useContext",
                    r"data-reactroot",
                    r"data-reactid",
                    r"__REACT_DEVTOOLS_GLOBAL_HOOK__",
                    r"react-dom",
                    r"@types/react"
                ],
                "confidence": 0
            },
            "vue": {
                "patterns": [
                    r"Vue\.createApp",
                    r"new Vue",
                    r"v-",
                    r"data-v-",
                    r"@click|@input|@submit",
                    r"v-model|v-if|v-for",
                    r"vue-router",
                    r"vuex"
                ],
                "confidence": 0
            },
            "angular": {
                "patterns": [
                    r"ng-",
                    r"data-ng-",
                    r"angular\.module",
                    r"@Component|@Injectable|@NgModule",
                    r"@angular",
                    r"zone\.js"
                ],
                "confidence": 0
            },
            "jquery": {
                "patterns": [
                    r"\$\(\)",
                    r"jQuery",
                    r"\$\.ajax",
                    r"\$\.get|\$\.post",
                    r"jquery\.min\.js"
                ],
                "confidence": 0
            },
            "bootstrap": {
                "patterns": [
                    r"bootstrap\.min\.js",
                    r"bootstrap\.css",
                    r"data-bs-",
                    r"data-toggle",
                    r"navbar|modal|dropdown"
                ],
                "confidence": 0
            },
            "webpack": {
                "patterns": [
                    r"webpack",
                    r"__webpack_require__",
                    r"webpackJsonp",
                    r"vendors~",
                    r"runtime~",
                    r"chunk~"
                ],
                "confidence": 0
            },
            "typescript": {
                "patterns": [
                    r"\.ts$|\.tsx$",
                    r"typescript",
                    r"tsconfig",
                    r"interface\s+\w+",
                    r"type\s+\w+",
                    r"as\s+\w+"
                ],
                "confidence": 0
            },
            "nextjs": {
                "patterns": [
                    r"__next",
                    r"next/link",
                    r"next/router",
                    r"next/image",
                    r"getServerSideProps",
                    r"getStaticProps"
                ],
                "confidence": 0
            },
            "gatsby": {
                "patterns": [
                    r"gatsby",
                    r"gatsby-link",
                    r"gatsby-image",
                    r"gatsby-plugin"
                ],
                "confidence": 0
            },
            "svelte": {
                "patterns": [
                    r"svelte",
                    r"on:click",
                    r"bind:value",
                    r"#if|#each|#await"
                ],
                "confidence": 0
            }
        }
        
        self.detected_frameworks = {}
        self.js_content_samples = []
        self.html_structure = {}
    
    def analyze_crawl_data(self) -> Dict[str, Any]:
        """Analyze crawl data for framework detection."""
        print("🔍 Enhanced Framework Detection Analysis")
        print("=" * 50)
        
        # Find all JSON files
        json_files = list(self.crawl_data_dir.glob("*.json"))
        
        for json_file in json_files:
            if "deep_viralstyle.com_" in json_file.name:
                print(f"📄 Analyzing: {json_file.name}")
                self.analyze_single_file(json_file)
        
        # Analyze framework confidence scores
        self.calculate_framework_confidence()
        
        # Generate comprehensive report
        report = self.generate_detailed_report()
        
        # Save results
        self.save_detection_results(report)
        
        return report
    
    def analyze_single_file(self, json_file: Path):
        """Analyze a single crawl file for framework signatures."""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Analyze HTML content for framework signatures
            content = data.get("content", "")
            self.analyze_html_content(content)
            
            # Analyze JavaScript files
            if "extraction" in data and "basic" in data["extraction"]:
                basic_data = data["extraction"]["basic"]
                scripts = basic_data.get("scripts", [])
                
                # Try to fetch and analyze JavaScript content
                for script in scripts[:5]:  # Limit to first 5 scripts
                    self.analyze_javascript_content(script)
            
            # Analyze meta tags and headers
            if "extraction" in data and "basic" in data["extraction"]:
                basic_data = data["extraction"]["basic"]
                meta_tags = basic_data.get("meta_tags", [])
                self.analyze_meta_tags(meta_tags)
                
        except Exception as e:
            print(f"⚠️  Error analyzing {json_file.name}: {e}")
    
    def analyze_html_content(self, content: str):
        """Analyze HTML content for framework signatures."""
        content_lower = content.lower()
        
        # React signatures
        if "data-reactroot" in content_lower:
            self.framework_signatures["react"]["confidence"] += 10
        if "data-reactid" in content_lower:
            self.framework_signatures["react"]["confidence"] += 5
        
        # Vue signatures
        if "data-v-" in content_lower:
            self.framework_signatures["vue"]["confidence"] += 10
        if "v-" in content_lower and not "data-v-":
            self.framework_signatures["vue"]["confidence"] += 3
        
        # Angular signatures
        if "ng-" in content_lower:
            self.framework_signatures["angular"]["confidence"] += 8
        if "data-ng-" in content_lower:
            self.framework_signatures["angular"]["confidence"] += 5
        
        # Next.js signatures
        if "__next" in content_lower:
            self.framework_signatures["nextjs"]["confidence"] += 15
        
        # Bootstrap signatures
        if "bootstrap" in content_lower:
            self.framework_signatures["bootstrap"]["confidence"] += 5
        if "data-toggle" in content_lower:
            self.framework_signatures["bootstrap"]["confidence"] += 3
        
        # Webpack signatures
        if "vendors~" in content_lower or "runtime~" in content_lower:
            self.framework_signatures["webpack"]["confidence"] += 10
        
        # Store HTML structure
        self.html_structure = {
            "has_react_signatures": "data-reactroot" in content_lower or "data-reactid" in content_lower,
            "has_vue_signatures": "data-v-" in content_lower,
            "has_angular_signatures": "ng-" in content_lower,
            "has_nextjs_signatures": "__next" in content_lower,
            "has_bootstrap": "bootstrap" in content_lower,
            "has_webpack": "vendors~" in content_lower or "runtime~" in content_lower
        }
    
    def analyze_javascript_content(self, script_url: str):
        """Analyze JavaScript content for framework signatures."""
        try:
            # Only analyze external scripts
            if not script_url.startswith('http'):
                return
            
            print(f"  🔍 Fetching: {script_url}")
            
            # Try to fetch the script content
            response = requests.get(script_url, timeout=10, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Store sample for analysis
                self.js_content_samples.append({
                    "url": script_url,
                    "content_preview": content[:500],
                    "size": len(content)
                })
                
                # Analyze for framework signatures
                for framework, signature in self.framework_signatures.items():
                    for pattern in signature["patterns"]:
                        if re.search(pattern, content, re.IGNORECASE):
                            self.framework_signatures[framework]["confidence"] += 2
                            print(f"    ✅ Found {framework} signature in {script_url}")
                
        except Exception as e:
            print(f"    ⚠️  Could not fetch {script_url}: {e}")
    
    def analyze_meta_tags(self, meta_tags: List[Dict[str, str]]):
        """Analyze meta tags for framework hints."""
        for meta in meta_tags:
            content = meta.get("content", "").lower()
            name = meta.get("name", "").lower()
            
            # Check for framework-specific meta tags
            if "generator" in name:
                if "wordpress" in content:
                    self.framework_signatures["wordpress"] = {"confidence": 15, "patterns": []}
                elif "drupal" in content:
                    self.framework_signatures["drupal"] = {"confidence": 15, "patterns": []}
                elif "shopify" in content:
                    self.framework_signatures["shopify"] = {"confidence": 15, "patterns": []}
    
    def calculate_framework_confidence(self):
        """Calculate confidence scores for detected frameworks."""
        for framework, signature in self.framework_signatures.items():
            if signature["confidence"] > 0:
                self.detected_frameworks[framework] = {
                    "confidence": signature["confidence"],
                    "confidence_level": self.get_confidence_level(signature["confidence"]),
                    "patterns_found": signature["patterns"]
                }
    
    def get_confidence_level(self, score: int) -> str:
        """Get confidence level based on score."""
        if score >= 15:
            return "High"
        elif score >= 8:
            return "Medium"
        elif score >= 3:
            return "Low"
        else:
            return "Very Low"
    
    def generate_detailed_report(self) -> Dict[str, Any]:
        """Generate detailed framework detection report."""
        report = {
            "detected_frameworks": self.detected_frameworks,
            "html_structure_analysis": self.html_structure,
            "javascript_samples": self.js_content_samples[:10],  # First 10 samples
            "analysis_summary": {
                "total_frameworks_detected": len(self.detected_frameworks),
                "high_confidence_frameworks": len([f for f in self.detected_frameworks.values() if f["confidence_level"] == "High"]),
                "medium_confidence_frameworks": len([f for f in self.detected_frameworks.values() if f["confidence_level"] == "Medium"]),
                "low_confidence_frameworks": len([f for f in self.detected_frameworks.values() if f["confidence_level"] in ["Low", "Very Low"]])
            },
            "recommendations": self.generate_recommendations()
        }
        
        return report
    
    def generate_recommendations(self) -> List[str]:
        """Generate recommendations based on detected frameworks."""
        recommendations = []
        
        if "react" in self.detected_frameworks:
            recommendations.append("✅ React.js detected - Modern component-based framework")
        
        if "vue" in self.detected_frameworks:
            recommendations.append("✅ Vue.js detected - Progressive JavaScript framework")
        
        if "angular" in self.detected_frameworks:
            recommendations.append("✅ Angular detected - Full-featured framework")
        
        if "webpack" in self.detected_frameworks:
            recommendations.append("✅ Webpack detected - Modern build system with code splitting")
        
        if "bootstrap" in self.detected_frameworks:
            recommendations.append("✅ Bootstrap detected - CSS framework for responsive design")
        
        if "jquery" in self.detected_frameworks:
            recommendations.append("⚠️  jQuery detected - Consider modern JavaScript alternatives")
        
        if not any(f in self.detected_frameworks for f in ["react", "vue", "angular"]):
            recommendations.append("ℹ️  No major frontend framework detected - may be vanilla JS or custom framework")
        
        return recommendations
    
    def save_detection_results(self, report: Dict[str, Any]):
        """Save detection results to files."""
        # Save JSON report
        report_file = self.crawl_data_dir / "enhanced_framework_detection.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Save markdown report
        markdown_file = self.crawl_data_dir / "enhanced_framework_detection.md"
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(self.generate_markdown_report(report))
        
        print(f"\n📄 Enhanced framework detection saved to:")
        print(f"   - {report_file}")
        print(f"   - {markdown_file}")
    
    def generate_markdown_report(self, report: Dict[str, Any]) -> str:
        """Generate markdown report."""
        md = "# 🔍 Enhanced Framework Detection Report\n\n"
        md += "**Analysis Method:** Content-based framework signature detection\n\n"
        
        # Summary
        summary = report.get("analysis_summary", {})
        md += "## 📊 Detection Summary\n\n"
        md += f"- **Total Frameworks Detected:** {summary.get('total_frameworks_detected', 0)}\n"
        md += f"- **High Confidence:** {summary.get('high_confidence_frameworks', 0)}\n"
        md += f"- **Medium Confidence:** {summary.get('medium_confidence_frameworks', 0)}\n"
        md += f"- **Low Confidence:** {summary.get('low_confidence_frameworks', 0)}\n\n"
        
        # Detected Frameworks
        frameworks = report.get("detected_frameworks", {})
        if frameworks:
            md += "## 🎯 Detected Frameworks\n\n"
            
            # Sort by confidence
            sorted_frameworks = sorted(frameworks.items(), key=lambda x: x[1]["confidence"], reverse=True)
            
            for framework, details in sorted_frameworks:
                confidence = details["confidence"]
                level = details["confidence_level"]
                md += f"### {framework.title()}\n"
                md += f"- **Confidence:** {confidence} ({level})\n"
                md += f"- **Detection Method:** Pattern matching in HTML/JS content\n\n"
        
        # HTML Structure Analysis
        html_analysis = report.get("html_structure_analysis", {})
        if html_analysis:
            md += "## 🏗️ HTML Structure Analysis\n\n"
            for key, value in html_analysis.items():
                status = "✅" if value else "❌"
                md += f"- {status} {key.replace('_', ' ').title()}: {value}\n"
            md += "\n"
        
        # JavaScript Samples
        js_samples = report.get("javascript_samples", [])
        if js_samples:
            md += "## 📜 JavaScript Content Analysis\n\n"
            md += f"Analyzed {len(js_samples)} JavaScript files for framework signatures.\n\n"
            
            for i, sample in enumerate(js_samples[:5], 1):  # Show first 5
                md += f"### Sample {i}: {sample['url']}\n"
                md += f"- **Size:** {sample['size']} characters\n"
                md += f"- **Preview:** `{sample['content_preview'][:100]}...`\n\n"
        
        # Recommendations
        recommendations = report.get("recommendations", [])
        if recommendations:
            md += "## 💡 Recommendations\n\n"
            for rec in recommendations:
                md += f"- {rec}\n"
            md += "\n"
        
        return md


def main():
    """Main function to run enhanced framework detection."""
    print("🔍 Enhanced Framework Detection for ViralStyle.com")
    print("=" * 60)
    
    detector = EnhancedFrameworkDetector()
    report = detector.analyze_crawl_data()
    
    print("\n✅ Enhanced framework detection completed!")
    
    # Show key findings
    frameworks = report.get("detected_frameworks", {})
    if frameworks:
        print(f"\n🎯 Detected Frameworks:")
        for framework, details in sorted(frameworks.items(), key=lambda x: x[1]["confidence"], reverse=True):
            print(f"   - {framework.title()}: {details['confidence']} ({details['confidence_level']})")
    else:
        print("\n❌ No specific frameworks detected with high confidence")
    
    summary = report.get("analysis_summary", {})
    print(f"\n📊 Summary:")
    print(f"   - Total frameworks: {summary.get('total_frameworks_detected', 0)}")
    print(f"   - High confidence: {summary.get('high_confidence_frameworks', 0)}")
    print(f"   - Medium confidence: {summary.get('medium_confidence_frameworks', 0)}")


if __name__ == "__main__":
    main() 