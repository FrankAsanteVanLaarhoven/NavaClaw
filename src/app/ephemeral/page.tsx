'use client';

/**
 * NAVACLAW-AI — Ephemeral UI Main Page
 * 
 * The Ephemeral UI experience. No menus, no navigation, no fixed layouts.
 * Just speak, type, or gesture → the system builds the tools in real time.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FluxRenderer } from '@/components/ephemeral/FluxRenderer';
import { Sidebar } from '@/components/ephemeral/Sidebar';
import {
  getFluxEngine,
  getIntentParser,
} from '@/lib/ephemeral';
import { Zap, Bug, Shield, Terminal, Brain, BarChart2, Mic, ArrowRight, Keyboard, Hand } from 'lucide-react';
import { CharacterMosaic } from '@/components/ui/MatrixRain';

// ─── Lazy-load voice/gesture engines (client-only) ───────────────

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export default function EphemeralPage() {
  const [input, setInput] = useState('');
  const [hasFrame, setHasFrame] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize engines
  useEffect(() => {
    const engine = getFluxEngine();
    const unsubscribe = engine.subscribe((frame) => {
      setHasFrame(!!frame);
      if (frame) setShowOnboarding(false);
    });

    // Check voice support
    if (typeof window !== 'undefined') {
      const hasSpeech = !!(
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
      );
      setVoiceSupported(hasSpeech);
    }

    // Initialize gesture engine
    if (containerRef.current) {
      import('@/lib/ephemeral/GestureEngine').then(({ getGestureEngine }) => {
        const gesture = getGestureEngine();
        const cleanup = gesture.attach(containerRef.current!);
        return cleanup;
      });
    }

    return unsubscribe;
  }, []);

  // Handle text input
  const handleSubmit = useCallback((text?: string) => {
    const value = (text || input).trim();
    if (!value) return;

    const parser = getIntentParser();
    parser.parseAndPresent(value);
    setInput('');
    inputRef.current?.blur();
  }, [input]);

  // Handle voice toggle
  const toggleVoice = useCallback(async () => {
    const { getVoiceEngine } = await import('@/lib/ephemeral/VoiceEngine');
    const voice = getVoiceEngine();

    voice.on((event) => {
      if (event.type === 'state_change') {
        setVoiceState(event.data as VoiceState);
      }
      if (event.type === 'transcript') {
        setInterimTranscript(event.data);
      }
      if (event.type === 'final') {
        setInterimTranscript('');
      }
    });

    voice.toggleListening();
  }, []);

  // Quick action handler
  const quickAction = useCallback((intent: string) => {
    const parser = getIntentParser();
    parser.parseAndPresent(intent);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-transparent text-zinc-100 relative overflow-hidden flex">
      <Sidebar onAction={quickAction} />
      <div className="flex-1 relative overflow-hidden pl-[64px] transition-all duration-300 flex flex-col">
      {/* Ambient Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white dark:bg-[#0b0b0f] transition-colors duration-500 text-black dark:text-white">
        <CharacterMosaic />
        <div className="absolute inset-0 bg-[radial-gradient(1400px_800px_at_50%_-200px,rgba(255,255,255,0.05),transparent_60%)] dark:bg-[radial-gradient(1400px_800px_at_50%_-200px,rgba(255,255,255,0.03),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_100%,rgba(255,255,255,0.03),transparent_50%)] dark:bg-[radial-gradient(800px_400px_at_80%_100%,rgba(255,255,255,0.02),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-400/20 to-transparent dark:via-zinc-500/20" />
      </div>

      {/* ─── Onboarding / Ephemeral Welcome ─────────────────────── */}
      {showOnboarding && !hasFrame && (
        <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 animate-[fadeIn_1s_ease-out]">
          {/* Logo / Brand */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 mb-6 shadow-sm dark:shadow-none">
              <Zap className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h1 className="text-5xl md:text-7xl font-mono tracking-tighter font-bold text-zinc-900 dark:text-zinc-100 mb-4 selection:bg-zinc-200 dark:selection:bg-zinc-800">
              NAVACLAW
            </h1>
            <p className="text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed">
              The interface is invisible. Just tell me what you need &mdash; 
              I&apos;ll build the tools in real time.
            </p>
          </div>

          {/* Main Input */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={interimTranscript || input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={voiceState === 'listening' ? 'Listening...' : 'What do you want to do?'}
                className={`
                  w-full py-5 px-6 pr-24 text-lg rounded-2xl
                  bg-zinc-900/80 border transition-all duration-300
                  placeholder-zinc-500 text-zinc-100
                  focus:outline-none
                  ${voiceState === 'listening'
                    ? 'border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                    : 'border-zinc-800/60 focus:border-white/50 focus:shadow-[0_0_30px_rgba(255,255,255,0.05)]'}
                `}
                id="navaclaw-main-input"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Voice Button */}
                {voiceSupported && (
                  <button
                    onClick={toggleVoice}
                    className={`
                      p-3 rounded-xl transition-all duration-300
                      ${voiceState === 'listening'
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'}
                    `}
                    title={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
                    id="navaclaw-voice-btn"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
                {/* Submit */}
                <button
                  onClick={() => handleSubmit()}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white text-zinc-400 hover:text-black transition-colors"
                  title="Submit"
                  id="navaclaw-submit-btn"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Interim transcript */}
            {interimTranscript && (
              <p className="text-sm flex items-center gap-2 text-zinc-400 mt-2 ml-2 animate-pulse">
                <Mic className="w-4 h-4" /> {interimTranscript}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full">
            {[
              { icon: Zap, label: 'Core Health', intent: 'show me the core system health dashboard' },
              { icon: Bug, label: 'Web Crawler', intent: 'launch the web crawler' },
              { icon: Shield, label: 'Security Audit', intent: 'run a security audit' },
              { icon: Terminal, label: 'Terminal', intent: 'open a terminal' },
              { icon: Brain, label: 'Memory', intent: 'explore my memories' },
              { icon: BarChart2, label: 'Analytics', intent: 'show analytics dashboard' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => quickAction(action.intent)}
                className="
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-zinc-900/50 border border-zinc-800/40
                  hover:bg-zinc-800/80 hover:border-zinc-600/60
                  transition-all duration-200 hover:scale-[1.02]
                  text-left shadow-sm hover:shadow-md
                "
                id={`navaclaw-quick-${i}`}
              >
                <action.icon className="w-6 h-6 text-zinc-100" />
                <span className="text-sm text-zinc-300 group-hover:text-white">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p className="text-xs font-mono text-zinc-500 mt-8 flex items-center gap-3">
            <span className="flex items-center gap-1 text-zinc-400"><Keyboard className="w-3 h-3" /> Type</span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1 text-zinc-400"><Mic className="w-3 h-3" /> Speak</span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1 text-zinc-400"><Hand className="w-3 h-3" /> Gesture</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-600 italic">Say &quot;Hey Nava&quot; to activate voice</span>
          </p>
        </div>
      )}

      {/* ─── Flux Renderer (Ephemeral Interface) ─────────────── */}
      {hasFrame && (
        <div className="animate-[fadeIn_0.5s_ease-out]">
          {/* Floating input bar */}
          <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#0b0b0f]/90 backdrop-blur-xl border-b border-zinc-800/30">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <button
                onClick={() => {
                  getFluxEngine().dissolve();
                  setShowOnboarding(true);
                }}
                className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 transition-colors"
                title="Back to Desktop"
                id="navaclaw-back-btn"
              >
                <Zap className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="What next?"
                className="flex-1 py-2 px-4 rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/20"
                id="navaclaw-floating-input"
              />
              {voiceSupported && (
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-all ${
                    voiceState === 'listening'
                      ? 'bg-white text-black animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                  id="navaclaw-floating-voice"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleSubmit()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white text-zinc-400 hover:text-black transition-colors"
                id="navaclaw-floating-submit"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flux content (below the floating bar) */}
          <div className="pt-16">
            <FluxRenderer />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
