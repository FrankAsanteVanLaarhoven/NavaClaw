'use client';

/**
 * NAVACLAW-AI — Ephemeral UI Main Page
 * 
 * The Zero-UI experience. No menus, no navigation, no fixed layouts.
 * Just speak, type, or gesture → the system builds the tools in real time.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FluxRenderer } from '@/components/ephemeral/FluxRenderer';
import {
  getFluxEngine,
  getIntentParser,
  FluxFrame,
} from '@/lib/ephemeral';

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
    <div ref={containerRef} className="min-h-screen bg-[#0b0b0f] text-zinc-100 relative overflow-hidden">
      {/* Ambient Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1400px_800px_at_50%_-200px,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_100%,rgba(139,92,246,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* ─── Onboarding / Zero-UI Welcome ─────────────────────── */}
      {showOnboarding && !hasFrame && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-[fadeIn_1s_ease-out]">
          {/* Logo / Brand */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 mb-6">
              <span className="text-4xl">⚡</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 mb-4">
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
                    ? 'border-violet-500/60 shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                    : 'border-zinc-800/60 focus:border-indigo-500/50 focus:shadow-[0_0_30px_rgba(99,102,241,0.15)]'}
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
                        ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] animate-pulse'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'}
                    `}
                    title={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
                    id="navaclaw-voice-btn"
                  >
                    🎙️
                  </button>
                )}
                {/* Submit */}
                <button
                  onClick={() => handleSubmit()}
                  className="p-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors"
                  title="Submit"
                  id="navaclaw-submit-btn"
                >
                  →
                </button>
              </div>
            </div>
            {/* Interim transcript */}
            {interimTranscript && (
              <p className="text-sm text-violet-400/70 mt-2 ml-2 animate-pulse">
                🎤 {interimTranscript}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl w-full">
            {[
              { emoji: '🤖', label: 'Fleet Dashboard', intent: 'show me the fleet robot dashboard' },
              { emoji: '🕷️', label: 'Web Crawler', intent: 'launch the web crawler' },
              { emoji: '🛡️', label: 'Security Audit', intent: 'run a security audit' },
              { emoji: '💻', label: 'Terminal', intent: 'open a terminal' },
              { emoji: '🧠', label: 'Memory', intent: 'explore my memories' },
              { emoji: '📊', label: 'Analytics', intent: 'show analytics dashboard' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => quickAction(action.intent)}
                className="
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-zinc-900/50 border border-zinc-800/40
                  hover:bg-zinc-800/60 hover:border-zinc-700/60
                  transition-all duration-200 hover:scale-[1.02]
                  text-left
                "
                id={`navaclaw-quick-${i}`}
              >
                <span className="text-xl">{action.emoji}</span>
                <span className="text-sm text-zinc-300">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p className="text-xs text-zinc-600 mt-8 flex items-center gap-2">
            <span>⌨️ Type</span>
            <span>·</span>
            <span>🎤 Speak</span>
            <span>·</span>
            <span>👆 Gesture</span>
            <span>·</span>
            <span className="text-zinc-500">Say &quot;Hey Nava&quot; to activate voice</span>
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
                title="Back to Zero-UI"
                id="navaclaw-back-btn"
              >
                ⚡
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="What next?"
                className="flex-1 py-2 px-4 rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/40"
                id="navaclaw-floating-input"
              />
              {voiceSupported && (
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-all ${
                    voiceState === 'listening'
                      ? 'bg-violet-600 text-white animate-pulse'
                      : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700'
                  }`}
                  id="navaclaw-floating-voice"
                >
                  🎙️
                </button>
              )}
              <button
                onClick={() => handleSubmit()}
                className="p-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors"
                id="navaclaw-floating-submit"
              >
                →
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
  );
}
