'use client';

/**
 * NAVACLAW-AI — Main Landing Page
 * Palantir/Tesla/Inception Labs aesthetic: pure black, emerald monochrome, matrix rain.
 * Author: Frank Van Laarhoven
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, Mic, Fingerprint, Layers, MessageSquare, Key, Database, Cpu, Plug } from 'lucide-react';

import { CharacterMosaic } from '@/components/ui/MatrixRain';

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
        <div className="w-10 h-10 rounded-md bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-4 group-hover:border-emerald-500/25 transition-colors">
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

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-white/20 font-sans">
      <CharacterMosaic />

      {/* Navigation — Palantir minimal */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.05]' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-[0.2em] text-white text-sm">NAVACLAW<span className="text-zinc-500 font-light">.AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/ephemeral" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-widest hidden sm:block">
            Workspace
          </Link>
          <Link href="https://github.com/FrankAsanteVanLaarhoven/NavaClaw" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
            GitHub
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center -mt-16 overflow-hidden">
        
        {/* Animated Glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] mb-8">
            <span className="flex w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">System Active</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1] selection:bg-white/20">
            THE EPHEMERAL <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500">
              WORKSPACE.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Stop navigating rigid app layouts. State your intent, and NAVACLAW materializes the exact tools, dashboards, and agents you need—then dissolves them when you are done.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/ephemeral" 
              className="group relative px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-sm hover:-translate-y-0.5 transition-all overflow-hidden flex items-center justify-center min-w-[200px]"
            >
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">Initialize <Zap className="w-4 h-4" /></span>
            </Link>
            
            <a 
              href="#architecture"
              className="px-8 py-4 bg-transparent text-white border border-white/20 hover:bg-white/5 text-sm font-mono tracking-widest uppercase rounded-sm hover:-translate-y-0.5 transition-all min-w-[200px]"
            >
              Architecture
            </a>
          </div>
        </div>

        {/* Terminal Simulation */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl translate-y-1/2 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="rounded-t-xl bg-[#0b0b0f] border border-white/[0.08] border-b-0 shadow-2xl overflow-hidden p-4 relative backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] to-transparent pointer-events-none z-10 h-12 bottom-0" />
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <span className="ml-2 text-[10px] font-mono text-zinc-600">navaclaw@agent-core ~ %</span>
            </div>
            <div className="font-mono text-sm leading-relaxed text-zinc-300">
              <p className="text-zinc-500 mb-2">{`// 1. User declares intent via voice or text`}</p>
              <p className="flex items-center gap-2 mb-4">
                <span className="text-white">❯</span> 
                <span className="text-zinc-300 font-semibold">&quot;Show me the latest trending AI news&quot;</span>
              </p>
              <p className="text-zinc-500 mb-2">{`// 2. Engine parses intent & spawns specialized UI widget`}</p>
              <p className="text-white font-semibold">Generating &lt;TrendingIntelWidget /&gt; ...</p>
              <p className="text-white opacity-50 text-xs mt-2">[✓] UI Materialized in 42ms</p>
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

      {/* Grid of Features Section */}
      <section id="architecture" className="py-32 px-6 bg-[#0b0b0f] relative z-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-mono tracking-tighter text-white mb-4">
              NO STATIC VIEWS.
            </h2>
            <p className="text-zinc-500 text-sm font-mono tracking-wider max-w-md mx-auto">
              WINDOWS, ICONS, MENUS, POINTERS — THE 40-YEAR PARADIGM. REPLACED.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard delay={0} icon={<Zap className="w-5 h-5 text-white/70" />} title="FluxFrame Engine" description="JSON→UI in milliseconds. Intent-driven workspace materialization. Auto-dissolve when done." />
            <FeatureCard delay={100} icon={<Mic className="w-5 h-5 text-white/70" />} title="Voice Control" description="Web Speech API with wake word. Speak your intent, watch the interface materialize." />
            <FeatureCard delay={200} icon={<Fingerprint className="w-5 h-5 text-white/70" />} title="Gesture Recognition" description="Swipe, pinch, wave — motion sensors and touch mapped to actions." />
            <FeatureCard delay={300} icon={<Layers className="w-5 h-5 text-white/70" />} title="Agent Hierarchy" description="Orchestrator spawns sub-agents with isolated context. 23+ tools at disposal." />
            <FeatureCard delay={400} icon={<MessageSquare className="w-5 h-5 text-white/70" />} title="Multi-Channel Comms" description="WhatsApp, Telegram, Slack, Discord, Email — unified under one agent." />
            <FeatureCard delay={500} icon={<Key className="w-5 h-5 text-white/70" />} title="Secrets Management" description="Bidirectional masking: injected at execution, redacted in output." />
          </div>
        </div>
      </section>

      {/* Architecture — minimal */}
      <section className="py-24 px-6 border-t border-white/[0.03] bg-[#0b0b0f] relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-mono font-light text-zinc-300 tracking-tight mb-3">
            THREE SYSTEMS. ONE PLATFORM.
          </h2>
          <p className="text-zinc-600 text-xs font-mono tracking-wider mb-12">
            UNIFIED AGENT ARCHITECTURE
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
            {[
              { name: 'DATAMINER', items: ['Crawler', 'OSINT', 'Scouting', 'Financial'], icon: Database },
              { name: 'AGENT CORE', items: ['Sub-Agents', 'Memory', 'Skills', 'Code Exec'], icon: Cpu },
              { name: 'OPENCLAW', items: ['WhatsApp', 'Telegram', 'Slack', 'Email'], icon: Plug },
            ].map(({ name, items, icon: Icon }) => (
              <div key={name} className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04]">
                <div className="text-white/40 mb-3"><Icon className="w-6 h-6 mx-auto md:mx-0" /></div>
                <h3 className="text-[10px] font-mono text-zinc-400 tracking-[0.15em] mb-3">{name}</h3>
                <div className="space-y-1">
                  {items.map(item => (
                    <div key={item} className="text-[10px] text-zinc-600 font-mono">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-[#0b0b0f] relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-mono font-light text-zinc-300 tracking-tight mb-3">
            GO <span className="text-white font-bold">EPHEMERAL</span>
          </h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm">
            Stop adapting to software. Let the software adapt to you.
          </p>
          <Link 
            href="/ephemeral"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold tracking-widest uppercase rounded-sm hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            Enter Workspace <Zap className="w-4 h-4" />
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