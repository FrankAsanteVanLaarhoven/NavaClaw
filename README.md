# NAVACLAW-AI
**The Ultimate Autonomous Multi-Agent AI Platform**

NAVACLAW-AI is a next-generation local-first AI orchestration framework. Born from the feature-convergence of `dataminerAI`, `Agent Zero`, and `OpenClaw`, it provides a 100% comprehensive, deeply integrated environment for building, running, and interacting with autonomous agents.

---

## ⚡ Core Architecture

NAVACLAW-AI replaces static chat interfaces with a state-of-the-art **Ephemeral UI Engine**. Interfaces, dashboards, and tools are generated *on-the-fly* by the LLM natively matching the user's immediate intent.

### Key Capabilities

1. **Inception / Palantir Design System:** A stunning emerald monochrome and pure black aesthetic (`zero-purple` has been purged).
2. **Feature Convergence:**
   - **Unified Messaging Sandbox:** Native adapters for Slack, Discord, and macOS iMessage.
   - **Audio Sandbox:** Local privacy-compliant Speech-to-Text (Whisper) and Text-to-Speech engines.
   - **Background Autonomous Skills:** Native Email (IMAP/SMTP) and Calendar (CalDAV) management.
3. **Always-On Heartbeat Scheduler:** A continuously running background loop that allows autonomous sub-agents to execute multi-step routines, monitor environments, and perform scheduled intelligence gathering.
4. **Local-First Privacy Engine:** By toggling the global privacy flag, all external API traffic (OpenAI, Anthropic) is severed, and execution is strictly routed to the native local Rust-based container runner (supporting models like Qwen 3.5, Llama 3).
5. **Mobile Canvas Bridge:** Streaming generative UI components directly to iOS and Android nodes.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js v20+
- Python 3.10+
- Docker & Docker Compose (for the local engine isolated environments)

### 2. Installation
```bash
git clone https://github.com/FrankAsanteVanLaarhoven/NavaClaw.git
cd NavaClaw

# Install dependencies
npm install
pip install -r requirements.txt
```

### 3. Execution
```bash
# Launch the main web server and the agentic core
npm run dev

# (macOS only) Run the provided AppleScript to generate your 1-click Desktop SDK shortcut
osacompile -e 'do shell script "open http://navaclaw.com"' -o "$HOME/Desktop/NAVACLAW-AI SDK.app"
```

---

## 🔒 Security & Privacy

NAVACLAW-AI ensures **absolute data sovereignty**. 
- Edge Middleware (`src/middleware.ts`) protects standard endpoints against ingestion attacks.
- The `production_llm_router.py` can be hard-locked to local execution.
- All system credentials remain strictly localized.

---

## License

MIT License. Designed and engineered by Frank Van Laarhoven.
