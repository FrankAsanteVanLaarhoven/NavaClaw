/**
 * NAVACLAW-AI VoiceEngine — "Just say what you want"
 *
 * Handles Speech-to-Text and Text-to-Speech for the ephemeral UI.
 * Wake word detection, continuous listening, and voice commands.
 */

import { getIntentParser, IntentParser } from './IntentParser';

// ─── Types ───────────────────────────────────────────────────────

export interface VoiceConfig {
  language: string;
  continuous: boolean;
  wakeWord: string;
  wakeWordEnabled: boolean;
  ttsVoice?: string;
  ttsRate: number;
  ttsPitch: number;
  silenceTimeout: number; // ms before considering speech complete
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceEvent {
  type: 'transcript' | 'final' | 'error' | 'state_change' | 'wake_word';
  data: string;
  confidence?: number;
  timestamp: number;
}

// ─── VoiceEngine ─────────────────────────────────────────────────

export class VoiceEngine {
  private config: VoiceConfig;
  private state: VoiceState = 'idle';
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private listeners: Set<(event: VoiceEvent) => void> = new Set();
  private intentParser: IntentParser;
  private wakeWordActive = false;
  private interimTranscript = '';

  constructor(config?: Partial<VoiceConfig>) {
    this.config = {
      language: 'en-US',
      continuous: true,
      wakeWord: 'hey nava',
      wakeWordEnabled: true,
      ttsRate: 1.0,
      ttsPitch: 1.0,
      silenceTimeout: 2000,
      ...config,
    };
    this.intentParser = getIntentParser();
    this.initRecognition();
    this.initSynthesis();
  }

  // ─── Speech-to-Text (STT) ───────────────────────────────────

  private initRecognition(): void {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('[VoiceEngine] SpeechRecognition not supported. Falling back to text input.');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.lang = this.config.language;
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        this.interimTranscript = interim;
        this.emit({ type: 'transcript', data: interim, timestamp: Date.now() });
      }

      if (final) {
        this.handleFinalTranscript(final, event.results[event.resultIndex]?.[0]?.confidence ?? 0);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[VoiceEngine] STT error:', event.error);
      this.setState('error');
      this.emit({ type: 'error', data: event.error, timestamp: Date.now() });

      // Auto-restart on recoverable errors
      if (['network', 'aborted', 'no-speech'].includes(event.error)) {
        setTimeout(() => {
          if (this.state !== 'idle') this.startListening();
        }, 1000);
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if in continuous mode
      if (this.config.continuous && this.state === 'listening') {
        try {
          this.recognition?.start();
        } catch { /* already started */ }
      }
    };
  }

  private handleFinalTranscript(transcript: string, confidence: number): void {
    const normalized = transcript.toLowerCase().trim();

    // Wake word detection
    if (this.config.wakeWordEnabled && !this.wakeWordActive) {
      if (normalized.includes(this.config.wakeWord)) {
        this.wakeWordActive = true;
        this.emit({ type: 'wake_word', data: this.config.wakeWord, timestamp: Date.now() });
        // Extract command after wake word
        const afterWake = normalized.split(this.config.wakeWord).pop()?.trim();
        if (afterWake) {
          this.processVoiceCommand(afterWake, confidence);
        }
        return;
      }
      return; // Ignore if wake word not detected and required
    }

    this.processVoiceCommand(transcript, confidence);
  }

  private processVoiceCommand(transcript: string, confidence: number): void {
    this.emit({
      type: 'final',
      data: transcript,
      confidence,
      timestamp: Date.now(),
    });

    // Parse intent and generate UI
    this.intentParser.parseAndPresent(transcript);

    // Reset wake word state after processing
    if (this.config.wakeWordEnabled) {
      this.wakeWordActive = false;
    }
  }

  // ─── Text-to-Speech (TTS) ───────────────────────────────────

  private initSynthesis(): void {
    if (typeof window === 'undefined') return;
    this.synthesis = window.speechSynthesis;
  }

  /**
   * Speak text aloud using TTS.
   */
  speak(text: string, options?: { rate?: number; pitch?: number; voice?: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        console.warn('[VoiceEngine] TTS not supported');
        resolve();
        return;
      }

      // Pause recognition while speaking
      const wasListening = this.state === 'listening';
      if (wasListening) this.pauseListening();

      this.setState('speaking');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.config.language;
      utterance.rate = options?.rate ?? this.config.ttsRate;
      utterance.pitch = options?.pitch ?? this.config.ttsPitch;

      // Select voice
      if (options?.voice || this.config.ttsVoice) {
        const voices = this.synthesis.getVoices();
        const targetVoice = options?.voice ?? this.config.ttsVoice;
        const voice = voices.find(v => v.name.includes(targetVoice!));
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => {
        this.setState(wasListening ? 'listening' : 'idle');
        if (wasListening) this.startListening();
        resolve();
      };

      utterance.onerror = (e) => {
        this.setState('error');
        reject(e);
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop any ongoing TTS.
   */
  stopSpeaking(): void {
    this.synthesis?.cancel();
    if (this.state === 'speaking') this.setState('idle');
  }

  // ─── Public API ──────────────────────────────────────────────

  /**
   * Start listening for voice input.
   */
  startListening(): void {
    if (!this.recognition) {
      console.warn('[VoiceEngine] STT not available');
      return;
    }
    try {
      this.recognition.start();
      this.setState('listening');
    } catch {
      // Already started
    }
  }

  /**
   * Stop listening.
   */
  stopListening(): void {
    this.recognition?.stop();
    this.setState('idle');
    this.wakeWordActive = false;
  }

  /**
   * Pause listening temporarily (e.g., while TTS is speaking).
   */
  pauseListening(): void {
    this.recognition?.stop();
  }

  /**
   * Toggle listening on/off.
   */
  toggleListening(): void {
    if (this.state === 'listening') {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  /**
   * Bypass wake word — immediately process next speech as command.
   */
  activateImmediate(): void {
    this.wakeWordActive = true;
    this.startListening();
  }

  // ─── State Management ────────────────────────────────────────

  getState(): VoiceState {
    return this.state;
  }

  private setState(state: VoiceState): void {
    if (this.state !== state) {
      this.state = state;
      this.emit({ type: 'state_change', data: state, timestamp: Date.now() });
    }
  }

  // ─── Event System ────────────────────────────────────────────

  on(listener: (event: VoiceEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: VoiceEvent): void {
    this.listeners.forEach(fn => fn(event));
  }

  // ─── Cleanup ─────────────────────────────────────────────────

  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    this.listeners.clear();
  }

  // ─── Feature Detection ───────────────────────────────────────

  static isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  static isTTSSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!window.speechSynthesis;
  }
}

// ─── Singleton ───────────────────────────────────────────────────

let voiceInstance: VoiceEngine | null = null;

export function getVoiceEngine(config?: Partial<VoiceConfig>): VoiceEngine {
  if (!voiceInstance) {
    voiceInstance = new VoiceEngine(config);
  }
  return voiceInstance;
}
