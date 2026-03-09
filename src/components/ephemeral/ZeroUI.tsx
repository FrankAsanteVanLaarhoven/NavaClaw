'use client';

/**
 * NAVACLAW-AI ZeroUI — The "Invisible" Interface
 *
 * Full-screen conversational agent with no menus, no navigation, no buttons.
 * Intent-driven: speak or type what you want.
 * Dynamic tool panels appear/disappear based on context.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import FluxRenderer from './FluxRenderer';
import {
  getFluxEngine,
  getIntentParser,
  FluxFrame,
  type FluxEngine,
  type IntentParser,
} from '@/lib/ephemeral';

// ─── Types ──────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  fluxFrame?: FluxFrame;
}

type ZeroUIMode = 'conversational' | 'immersive' | 'ambient';

interface ZeroUIProps {
  className?: string;
  initialMode?: ZeroUIMode;
  onModeChange?: (mode: ZeroUIMode) => void;
}

// ─── Particle Background ─────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        hue: 155 + Math.random() * 15, // emerald monochrome range
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 50%, 45%, ${p.opacity})`;
        ctx.fill();
      }

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(155, 40%, 35%, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ─── Agent Thinking Indicator ────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400/60"
            style={{
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-zinc-500 font-mono tracking-wide">
        constructing interface…
      </span>
    </div>
  );
}

// ─── ZeroUI Component ────────────────────────────────────────────

export default function ZeroUI({ className = '', initialMode = 'conversational', onModeChange }: ZeroUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<FluxFrame | null>(null);
  const [mode, setMode] = useState<ZeroUIMode>(initialMode);
  const [showWelcome, setShowWelcome] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FluxEngine | null>(null);
  const parserRef = useRef<IntentParser | null>(null);

  // Initialize engines
  useEffect(() => {
    engineRef.current = getFluxEngine();
    parserRef.current = getIntentParser();

    // Subscribe to frame changes
    const unsub = engineRef.current.subscribe((frame) => {
      setCurrentFrame(frame);
    });

    // System welcome message
    setMessages([{
      id: 'welcome',
      role: 'system',
      content: 'NAVACLAW-AI initialized. Type or speak your intent — the interface will materialize around your needs.',
      timestamp: Date.now(),
    }]);

    return unsub;
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    if (!isThinking) inputRef.current?.focus();
  }, [isThinking]);

  // Handle mode change
  const changeMode = useCallback((newMode: ZeroUIMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  }, [onModeChange]);

  // ── Core: parse intent & generate UI ──
  const processIntent = useCallback(async (text: string) => {
    if (!text.trim() || !parserRef.current) return;

    // Add user message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setShowWelcome(false);
    setIsThinking(true);

    // Simulate brief processing delay (replaced by real AI backend later)
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    try {
      // Parse intent → generate FluxFrame
      const frame = parserRef.current.parseAndPresent(text);

      // Check for mode-switching intents
      if (text.toLowerCase().includes('fullscreen') || text.toLowerCase().includes('immersive')) {
        changeMode('immersive');
      } else if (text.toLowerCase().includes('ambient') || text.toLowerCase().includes('background')) {
        changeMode('ambient');
      } else if (text.toLowerCase().includes('chat') || text.toLowerCase().includes('conversation')) {
        changeMode('conversational');
      }

      // Add agent response
      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: getAgentResponse(text, frame),
        timestamp: Date.now(),
        fluxFrame: frame,
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Intent processing error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  }, [changeMode]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processIntent(input);
    setInput('');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Escape → clear/dismiss current frame
      if (e.key === 'Escape' && currentFrame) {
        engineRef.current?.dissolve();
        return;
      }
      // Cmd+K → focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Cmd+Shift+F → toggle fullscreen/immersive
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        changeMode(mode === 'immersive' ? 'conversational' : 'immersive');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentFrame, mode, changeMode]);

  // ── Render ──
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      {/* Particle background */}
      <ParticleField />

      {/* Dynamic FluxFrame workspace (fills most of screen when active) */}
      {currentFrame && mode !== 'ambient' && (
        <div className={`absolute inset-0 z-10 transition-all duration-700 ${
          mode === 'immersive'
            ? 'p-0'
            : 'p-4 pb-32'
        }`}>
          <FluxRenderer className="w-full h-full" />
        </div>
      )}

      {/* Conversation rail (slides up from bottom) */}
      {mode !== 'immersive' && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Messages */}
          <div className="max-w-3xl mx-auto px-4">
            <div className={`space-y-3 overflow-y-auto transition-all duration-500 ${
              currentFrame ? 'max-h-40' : 'max-h-[60vh]'
            } scrollbar-none`}>
              {showWelcome && !currentFrame && (
                <WelcomeScreen onExample={processIntent} />
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isThinking && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar */}
          <div className="backdrop-blur-xl bg-black/80 border-t border-white/[0.04] p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-zinc-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you need…"
                  disabled={isThinking}
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg py-3.5 pl-12 pr-24 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/25 focus:ring-1 focus:ring-emerald-500/10 transition-all text-sm font-mono tracking-wide disabled:opacity-50"
                  autoFocus
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-zinc-600 border border-zinc-800 bg-zinc-900/50">
                    ⌘K
                  </kbd>
                  <button
                    type="submit"
                    disabled={!input.trim() || isThinking}
                    className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-30 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mode indicator (top-right) */}
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={() => changeMode(mode === 'immersive' ? 'conversational' : 'immersive')}
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-all"
          title={mode === 'immersive' ? 'Exit immersive' : 'Go immersive'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mode === 'immersive' ? (
              <>
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const roleStyles: Record<Message['role'], string> = {
    user: 'bg-emerald-500/5 border-emerald-500/15 text-zinc-300 ml-auto',
    agent: 'bg-white/[0.03] border-white/[0.06] text-zinc-300',
    system: 'bg-amber-500/5 border-amber-500/10 text-amber-200/60 text-center text-sm italic',
  };

  const roleIcons: Record<Message['role'], string> = {
    user: '👤',
    agent: '⚡',
    system: '⚙️',
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeSlideUp_0.3s_ease-out]`}>
      <div className={`max-w-[85%] rounded-2xl px-5 py-3 border ${roleStyles[message.role]}`}>
        <div className="flex items-start gap-2">
          <span className="text-sm mt-0.5 select-none">{roleIcons[message.role]}</span>
          <p className="text-[14px] leading-relaxed font-light">{message.content}</p>
        </div>
        {message.fluxFrame && (
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-500/50">
              FluxFrame: {message.fluxFrame.layout} · {message.fluxFrame.components.length} components
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Welcome Screen ──────────────────────────────────────────────

function WelcomeScreen({ onExample }: { onExample: (text: string) => void }) {
  const examples = [
    { icon: '📊', text: 'Show me a dashboard for my fleet robots', category: 'Monitor' },
    { icon: '🔒', text: 'Run a security audit on the system', category: 'Analyze' },
    { icon: '💬', text: 'Open an agent chat session', category: 'Communicate' },
    { icon: '🌐', text: 'Start crawling example.com for data', category: 'Build' },
    { icon: '📝', text: 'Build a form to collect user feedback', category: 'Create' },
    { icon: '🧠', text: 'Show me the agent memory explorer', category: 'Explore' },
  ];

  return (
    <div className="py-12 text-center animate-[fadeIn_0.8s_ease-out]">
      {/* Logo */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-500/5 border border-emerald-500/10 mb-4">
          <span className="text-3xl font-mono text-emerald-400/60">N</span>
        </div>
        <h1 className="text-3xl font-mono font-light text-zinc-300 tracking-tight">
          NAVACLAW<span className="text-emerald-400/70">-AI</span>
        </h1>
        <p className="text-sm text-zinc-600 mt-2 tracking-wide font-light">
          Zero-UI · Intent-Driven · Ephemeral
        </p>
      </div>

      {/* Example prompts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {examples.map((ex) => (
          <button
            key={ex.text}
            onClick={() => onExample(ex.text)}
            className="group text-left p-4 rounded-lg bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.025] hover:border-emerald-500/15 transition-all duration-300"
          >
            <span className="text-xl mb-2 block">{ex.icon}</span>
            <span className="text-[12px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">
              {ex.category}
            </span>
            <span className="text-[13px] text-zinc-400 font-light leading-snug group-hover:text-zinc-300 transition-colors">
              {ex.text}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-zinc-700 mt-8 font-mono tracking-wider">
        ⌘K to focus · ESC to dismiss · ⌘⇧F for immersive mode
      </p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────

function getAgentResponse(input: string, frame: FluxFrame): string {
  const componentNames = frame.components.map(c => c.type.replace(/_/g, ' ')).join(', ');
  const responses: Record<string, string> = {
    monitor: `Monitoring interface ready with ${frame.components.length} panels: ${componentNames}. All data streams are live.`,
    analyze: `Analysis workspace deployed. ${frame.components.length} components active: ${componentNames}. Processing data now.`,
    build: `Build environment materialized with ${componentNames}. Ready for your input.`,
    communicate: `Communication channel opened. You have ${componentNames} available.`,
    create: `Creative workspace generated with ${componentNames}. Start building.`,
    explore: `Explorer view active. ${frame.components.length} tools ready: ${componentNames}.`,
  };

  // Match category from input keywords
  const lc = input.toLowerCase();
  if (lc.includes('dashboard') || lc.includes('monitor') || lc.includes('fleet')) return responses.monitor;
  if (lc.includes('audit') || lc.includes('analyze') || lc.includes('security')) return responses.analyze;
  if (lc.includes('crawl') || lc.includes('build') || lc.includes('scrape')) return responses.build;
  if (lc.includes('chat') || lc.includes('message') || lc.includes('talk')) return responses.communicate;
  if (lc.includes('form') || lc.includes('create') || lc.includes('design')) return responses.create;
  if (lc.includes('memory') || lc.includes('explore') || lc.includes('show')) return responses.explore;

  return `Interface generated with ${frame.layout} layout — ${frame.components.length} components: ${componentNames}. Everything is ready.`;
}

export { ZeroUI };
