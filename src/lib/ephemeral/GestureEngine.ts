/**
 * NAVACLAW-AI GestureEngine — Movement-based interaction
 *
 * Uses device sensors and camera for gesture-based UI control.
 * Swipe, pinch, point, wave — the UI responds to your movements.
 */

import { getFluxEngine, FluxEngine } from './FluxEngine';

// ─── Types ───────────────────────────────────────────────────────

export type GestureType =
  | 'swipe_left'
  | 'swipe_right'
  | 'swipe_up'
  | 'swipe_down'
  | 'pinch_in'
  | 'pinch_out'
  | 'tap'
  | 'double_tap'
  | 'long_press'
  | 'shake'
  | 'rotate_cw'
  | 'rotate_ccw'
  | 'wave'
  | 'point';

export interface GestureEvent {
  type: GestureType;
  magnitude: number; // 0-1 intensity
  position?: { x: number; y: number };
  timestamp: number;
}

export interface GestureBinding {
  gesture: GestureType;
  action: string; // Intent string to parse
  description: string;
}

export interface GestureConfig {
  enabled: boolean;
  sensitivity: number; // 0.1 - 2.0
  touchEnabled: boolean;
  motionEnabled: boolean;
  cameraEnabled: boolean;
  bindings: GestureBinding[];
}

// ─── Default Bindings ────────────────────────────────────────────

const DEFAULT_BINDINGS: GestureBinding[] = [
  { gesture: 'swipe_left', action: '__navigate_back', description: 'Go back to previous view' },
  { gesture: 'swipe_right', action: '__navigate_forward', description: 'Go forward' },
  { gesture: 'swipe_up', action: '__scroll_up', description: 'Scroll up / Show more' },
  { gesture: 'swipe_down', action: '__dismiss', description: 'Dismiss current panel' },
  { gesture: 'pinch_in', action: '__zoom_out', description: 'Zoom out / Collapse' },
  { gesture: 'pinch_out', action: '__zoom_in', description: 'Zoom in / Expand' },
  { gesture: 'double_tap', action: '__toggle_focus', description: 'Toggle focus mode' },
  { gesture: 'long_press', action: '__context_menu', description: 'Show context options' },
  { gesture: 'shake', action: '__reset_view', description: 'Reset to default view' },
];

// ─── GestureEngine ───────────────────────────────────────────────

export class GestureEngine {
  private config: GestureConfig;
  private engine: FluxEngine;
  private listeners: Set<(event: GestureEvent) => void> = new Set();
  private touchState: {
    startX: number;
    startY: number;
    startTime: number;
    touches: number;
  } | null = null;
  private pinchStartDistance = 0;
  private lastShakeTime = 0;
  private shakeThreshold = 15;
  private motionHandler: ((e: DeviceMotionEvent) => void) | null = null;

  constructor(config?: Partial<GestureConfig>) {
    this.config = {
      enabled: true,
      sensitivity: 1.0,
      touchEnabled: true,
      motionEnabled: true,
      cameraEnabled: false,
      bindings: DEFAULT_BINDINGS,
      ...config,
    };
    this.engine = getFluxEngine();
  }

  // ─── Initialization ──────────────────────────────────────────

  /**
   * Attach gesture listeners to a DOM element.
   */
  attach(element: HTMLElement): () => void {
    if (!this.config.enabled) return () => {};

    const cleanups: (() => void)[] = [];

    if (this.config.touchEnabled) {
      cleanups.push(this.attachTouchListeners(element));
    }

    if (this.config.motionEnabled) {
      cleanups.push(this.attachMotionListeners());
    }

    return () => cleanups.forEach(fn => fn());
  }

  // ─── Touch Gestures ──────────────────────────────────────────

  private attachTouchListeners(element: HTMLElement): () => void {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.touchState = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTime: Date.now(),
          touches: 1,
        };
      } else if (e.touches.length === 2) {
        this.pinchStartDistance = this.getPinchDistance(e.touches);
        this.touchState = {
          startX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          startY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          startTime: Date.now(),
          touches: 2,
        };
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!this.touchState) return;

      const duration = Date.now() - this.touchState.startTime;

      if (this.touchState.touches === 2 && e.changedTouches.length > 0) {
        // Pinch gesture
        const currentDistance = e.changedTouches.length >= 2
          ? this.getPinchDistance(e.changedTouches)
          : this.pinchStartDistance;
        const ratio = currentDistance / Math.max(this.pinchStartDistance, 1);

        if (ratio < 0.7) {
          this.triggerGesture('pinch_in', 1 - ratio);
        } else if (ratio > 1.3) {
          this.triggerGesture('pinch_out', ratio - 1);
        }
      } else if (this.touchState.touches === 1) {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - this.touchState.startX;
        const dy = touch.clientY - this.touchState.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 50 * this.config.sensitivity;

        if (distance < 10 && duration < 300) {
          this.triggerGesture('tap', 1, { x: touch.clientX, y: touch.clientY });
        } else if (distance < 10 && duration >= 500) {
          this.triggerGesture('long_press', duration / 1000, { x: touch.clientX, y: touch.clientY });
        } else if (distance >= threshold) {
          // Determine swipe direction
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          const magnitude = Math.min(distance / 300, 1);

          if (absDx > absDy) {
            this.triggerGesture(dx > 0 ? 'swipe_right' : 'swipe_left', magnitude);
          } else {
            this.triggerGesture(dy > 0 ? 'swipe_down' : 'swipe_up', magnitude);
          }
        }
      }

      this.touchState = null;
    };

    // Keyboard shortcuts as gesture proxies (for desktop)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            this.triggerGesture('swipe_left', 0.8);
            e.preventDefault();
            break;
          case 'ArrowRight':
            this.triggerGesture('swipe_right', 0.8);
            e.preventDefault();
            break;
          case 'ArrowUp':
            this.triggerGesture('swipe_up', 0.8);
            e.preventDefault();
            break;
          case 'ArrowDown':
            this.triggerGesture('swipe_down', 0.8);
            e.preventDefault();
            break;
          case '=':
          case '+':
            this.triggerGesture('pinch_out', 0.5);
            e.preventDefault();
            break;
          case '-':
            this.triggerGesture('pinch_in', 0.5);
            e.preventDefault();
            break;
          case 'Escape':
            this.triggerGesture('shake', 1.0);
            e.preventDefault();
            break;
        }
      }
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKeyDown);
    };
  }

  // ─── Motion Gestures ─────────────────────────────────────────

  private attachMotionListeners(): () => void {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      return () => {};
    }

    this.motionHandler = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const force = Math.sqrt(
        (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2
      );

      const now = Date.now();
      if (force > this.shakeThreshold && now - this.lastShakeTime > 1000) {
        this.lastShakeTime = now;
        this.triggerGesture('shake', Math.min(force / 30, 1));
      }
    };

    window.addEventListener('devicemotion', this.motionHandler);

    return () => {
      if (this.motionHandler) {
        window.removeEventListener('devicemotion', this.motionHandler);
      }
    };
  }

  // ─── Gesture Processing ──────────────────────────────────────

  private triggerGesture(
    type: GestureType,
    magnitude: number,
    position?: { x: number; y: number }
  ): void {
    const event: GestureEvent = {
      type,
      magnitude: Math.min(Math.max(magnitude, 0), 1),
      position,
      timestamp: Date.now(),
    };

    // Emit to listeners
    this.emit(event);

    // Find binding and execute action
    const binding = this.config.bindings.find(b => b.gesture === type);
    if (binding) {
      this.executeAction(binding.action, event);
    }
  }

  private executeAction(action: string, event: GestureEvent): void {
    switch (action) {
      case '__navigate_back':
        // Go back in frame history
        const history = this.engine.getHistory();
        if (history.length >= 2) {
          const prevFrame = history[history.length - 2].frame;
          this.engine.present(prevFrame);
        }
        break;
      case '__dismiss':
        this.engine.dissolve();
        break;
      case '__toggle_focus':
        const current = this.engine.getCurrentFrame();
        if (current) {
          const newLayout = current.layout === 'focus' ? 'grid' : 'focus';
          this.engine.present({ ...current, layout: newLayout, id: current.id + '_refocus' });
        }
        break;
      case '__reset_view':
        this.engine.dissolve();
        break;
      default:
        // Non-system action — treat as an intent string
        if (!action.startsWith('__')) {
          const { IntentParser } = require('./IntentParser');
          const parser = new IntentParser(this.engine);
          parser.parseAndPresent(action);
        }
        break;
    }
  }

  // ─── Public API ──────────────────────────────────────────────

  /**
   * Add a custom gesture binding.
   */
  addBinding(binding: GestureBinding): void {
    this.config.bindings.push(binding);
  }

  /**
   * Remove a gesture binding.
   */
  removeBinding(gesture: GestureType): void {
    this.config.bindings = this.config.bindings.filter(b => b.gesture !== gesture);
  }

  /**
   * Get all available gesture bindings.
   */
  getBindings(): GestureBinding[] {
    return [...this.config.bindings];
  }

  // ─── Event System ────────────────────────────────────────────

  on(listener: (event: GestureEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: GestureEvent): void {
    this.listeners.forEach(fn => fn(event));
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private getPinchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ─── Singleton ───────────────────────────────────────────────────

let gestureInstance: GestureEngine | null = null;

export function getGestureEngine(config?: Partial<GestureConfig>): GestureEngine {
  if (!gestureInstance) {
    gestureInstance = new GestureEngine(config);
  }
  return gestureInstance;
}
