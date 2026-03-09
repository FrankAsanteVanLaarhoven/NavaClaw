'use client';

/**
 * NAVACLAW-AI — Main Landing Page
 * Palantir/Tesla/Inception Labs aesthetic: pure black, emerald monochrome, matrix rain.
 * Author: Frank Van Laarhoven
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ─── Matrix Character Rain Background (Inception Labs style) ─────

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'NAVACLAW01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

    const draw = () => {
      // Fade effect — very subtle trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is brighter
        const isHead = Math.random() > 0.95;
        if (isHead) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'; // emerald-500
        } else {
          const opacity = 0.03 + Math.random() * 0.12;
          ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
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

// ─── Feature Card ────────────────────────────────────────────────

function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode; title: string; description: string; delay: number;
}) {
  return (
    <div
      className="group relative p-6 rounded-lg bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.025] hover:border-emerald-500/15 transition-all duration-500 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="w-10 h-10 rounded-md bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4 group-hover:border-emerald-500/25 transition-colors font-mono text-emerald-500/60 text-sm">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-zinc-300 mb-2 tracking-tight">{title}</h3>
        <p className="text-xs text-zinc-600 leading-relaxed font-light">{description}</p>
      </div>
    </div>
  );
}

// ─── Stats Counter ───────────────────────────────────────────────

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-mono text-emerald-400/80 tracking-tight tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-[10px] text-zinc-600 mt-2 font-mono tracking-[0.2em] uppercase">{label}</div>
    </div>
  );
}

// ─── Main Landing ────────────────────────────────────────────────

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen text-zinc-300 bg-black">
      <MatrixRain />

      {/* Navigation — Palantir minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-mono font-bold">N</span>
            </div>
            <span className="text-sm font-mono tracking-[0.15em] text-zinc-400">
              NAVACLAW<span className="text-emerald-500/70">-AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-mono text-zinc-700 tracking-wider">v2.0.0</span>
            <Link
              href="/ephemeral"
              className="px-4 py-1.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono tracking-wider hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
            >
              LAUNCH →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Dark terminal aesthetic */}
      <section className="relative pt-36 pb-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/10 bg-emerald-500/[0.03] mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500/60 tracking-[0.2em]">SYSTEM ONLINE</span>
          </div>

          {/* Headline */}
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-mono font-light text-zinc-200 tracking-tight leading-[1.1] mb-6 transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            THE INTERFACE
            <br />
            <span className="text-emerald-400/80">
              IS THE INTENT
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-sm md:text-base text-zinc-600 max-w-xl mx-auto font-mono leading-relaxed mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Zero menus. Zero navigation. Zero fixed layouts.
            <br />
            Speak, type, or gesture — tools materialize on demand.
          </p>

          {/* CTA */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/ephemeral"
              className="group px-8 py-3 rounded border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400 text-sm font-mono tracking-wider hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300"
            >
              ENTER ZERO-UI
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a
              href="#features"
              className="px-8 py-3 rounded border border-white/[0.04] text-zinc-600 text-sm font-mono tracking-wider hover:border-white/[0.08] hover:text-zinc-400 transition-all"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      {/* Terminal preview — Inception-style */}
      <section className="relative py-16 px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`relative rounded-lg overflow-hidden border border-white/[0.04] bg-black/80 backdrop-blur-sm transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.03] bg-white/[0.01]">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
              <span className="ml-3 text-[10px] font-mono text-zinc-700 tracking-wider">navaclaw://ephemeral</span>
            </div>
            <div className="p-8 min-h-[280px] flex flex-col items-center justify-center font-mono">
              <div className="text-center space-y-5 max-w-md">
                <div className="text-emerald-500/40 text-xs tracking-[0.3em]">READY</div>
                <div className="text-zinc-500 text-sm font-light">
                  <span className="text-emerald-500/50">&gt;</span> Show me a dashboard for my fleet robots
                </div>
                <div className="w-full max-w-sm mx-auto">
                  <div className="flex items-center bg-white/[0.02] border border-white/[0.04] rounded px-4 py-2.5">
                    <span className="text-emerald-500/30 mr-2 text-xs">▸</span>
                    <span className="text-zinc-700 text-xs">describe what you need…</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-700 border border-zinc-800/50">⌘K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — monochrome counters */}
      <section className="py-20 px-6 border-t border-white/[0.03] z-10 relative">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value={23} label="Agent Tools" suffix="+" />
          <StatCounter value={18} label="UI Components" />
          <StatCounter value={3} label="Input Modes" />
          <StatCounter value={0} label="Fixed Menus" />
        </div>
      </section>

      {/* Features — clean grid */}
      <section id="features" className="py-24 px-6 z-10 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-mono font-light text-zinc-300 tracking-tight mb-3">
              BEYOND WIMP
            </h2>
            <p className="text-zinc-700 text-xs font-mono tracking-wider max-w-md mx-auto">
              WINDOWS, ICONS, MENUS, POINTERS — THE 40-YEAR PARADIGM. REPLACED.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard delay={0} icon="⚡" title="FluxFrame Engine" description="JSON→UI in milliseconds. Intent-driven workspace materialization. Auto-dissolve when done." />
            <FeatureCard delay={100} icon="◉" title="Voice Control" description="Web Speech API with wake word. Speak your intent, watch the interface materialize." />
            <FeatureCard delay={200} icon="◎" title="Gesture Recognition" description="Swipe, pinch, wave — motion sensors and touch mapped to actions." />
            <FeatureCard delay={300} icon="◈" title="Agent Hierarchy" description="Orchestrator spawns sub-agents with isolated context. 23+ tools at disposal." />
            <FeatureCard delay={400} icon="◇" title="Multi-Channel Comms" description="WhatsApp, Telegram, Slack, Discord, Email — unified under one agent." />
            <FeatureCard delay={500} icon="◆" title="Secrets Management" description="Bidirectional masking: injected at execution, redacted in output." />
          </div>
        </div>
      </section>

      {/* Architecture — minimal */}
      <section className="py-24 px-6 border-t border-white/[0.03] z-10 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-mono font-light text-zinc-300 tracking-tight mb-3">
            THREE SYSTEMS. ONE PLATFORM.
          </h2>
          <p className="text-zinc-700 text-xs font-mono tracking-wider mb-12">
            UNIFIED AGENT ARCHITECTURE
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
            {[
              { name: 'DATAMINER', items: ['Crawler', 'OSINT', 'Fleet VLA', 'Financial'], symbol: '▣' },
              { name: 'AGENT ZERO', items: ['Sub-Agents', 'Memory', 'Skills', 'Code Exec'], symbol: '▤' },
              { name: 'OPENCLAW', items: ['WhatsApp', 'Telegram', 'Slack', 'Email'], symbol: '▥' },
            ].map(({ name, items, symbol }) => (
              <div key={name} className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04]">
                <div className="text-emerald-500/40 text-lg mb-2">{symbol}</div>
                <h3 className="text-[10px] font-mono text-zinc-400 tracking-[0.15em] mb-3">{name}</h3>
                <div className="space-y-1">
                  {items.map(item => (
                    <div key={item} className="text-[10px] text-zinc-700 font-mono">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-mono font-light text-zinc-300 tracking-tight mb-3">
            GO <span className="text-emerald-400/80">EPHEMERAL</span>
          </h2>
          <p className="text-zinc-700 text-xs font-mono tracking-wider mb-8">
            THE INTERFACE YOU NEED. NOTHING MORE.
          </p>
          <Link
            href="/ephemeral"
            className="inline-flex items-center gap-2 px-10 py-3 rounded border border-emerald-500/25 bg-emerald-500/[0.05] text-emerald-400 font-mono text-sm tracking-wider hover:bg-emerald-500/10 hover:border-emerald-500/35 transition-all duration-300"
          >
            LAUNCH NAVACLAW-AI
            <span className="text-emerald-500/40">▸</span>
          </Link>
        </div>
      </section>

      {/* Footer — minimal terminal */}
      <footer className="border-t border-white/[0.03] py-6 px-6 z-10 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-700 tracking-wider">
            <span className="text-emerald-500/30">▸</span>
            NAVACLAW-AI · FRANK VAN LAARHOVEN
          </div>
          <div className="text-[10px] text-zinc-800 font-mono tracking-[0.2em]">
            FLUX PROTOCOL · v2.0.0
          </div>
        </div>
      </footer>

      {/* Global animations — no purple */}
      <style jsx global>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(-10px, 15px); }
          75% { transform: translate(10px, 10px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}