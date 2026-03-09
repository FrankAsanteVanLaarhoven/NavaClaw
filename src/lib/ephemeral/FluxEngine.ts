/**
 * NAVACLAW-AI FluxEngine — The Ephemeral UI Core
 * 
 * Converts user intent into dynamic FluxFrame interfaces.
 * No more WIMP (Windows, Icons, Menus, Pointers).
 * The interface IS the intent.
 */

// ─── FluxFrame Schema ────────────────────────────────────────────

export type FluxTheme = 
  | 'analysis_red' 
  | 'studio_neon' 
  | 'ocean_deep' 
  | 'forest_calm' 
  | 'midnight_gold'
  | 'cyber_emerald'
  | 'monochrome_zinc'
  | 'auto';

export type FluxLayout = 
  | 'grid' 
  | 'split_v' 
  | 'split_h' 
  | 'gallery' 
  | 'focus' 
  | 'conversational'
  | 'immersive';

export type FluxComponentType = 
  | 'smart_viewer'      // Focused document viewer
  | 'data_grid'          // Structured data table
  | 'insight_card'       // KPI / summary card
  | 'visual_gallery'     // Image/chart stream
  | 'audio_brief'        // TTS audio briefing
  | 'quick_action'       // Intent trigger button
  | 'terminal'           // Live terminal console
  | 'agent_chat'         // Agent conversation panel
  | 'code_editor'        // Live code editor
  | 'file_browser'       // File system explorer
  | 'chart'              // Dynamic chart (line, bar, pie, etc.)
  | 'form_builder'       // Dynamic form generation
  | 'memory_explorer'    // Agent memory browser
  | 'skill_launcher'     // Skill activation panel
  | 'fleet_monitor'      // Robot fleet status
  | 'security_audit'     // Security scan results
  | 'crawler_dashboard'  // Web crawling status
  | 'video_feed'         // Live video / WebRTC stream
  | 'notification_center' // Notification hub
  | 'trending_intel';     // Social media trending feed

export interface FluxAccessibility {
  voiceEnabled: boolean;
  gestureEnabled: boolean;
  hapticFeedback: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  reducedMotion: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FluxComponent {
  type: FluxComponentType;
  id: string;
  title?: string;
  dataSource?: string;
  config: Record<string, unknown>;
  span?: { cols: number; rows: number };
  priority?: number;
  animate?: 'fade_in' | 'slide_up' | 'scale_in' | 'morph' | 'none';
}

export interface FluxFrame {
  id: string;
  intent: string;
  timestamp: number;
  theme: FluxTheme;
  layout: FluxLayout;
  components: FluxComponent[];
  ttl?: number; // ms — auto-dissolve after this time
  transition: 'morph' | 'fade' | 'slide' | 'dissolve' | 'instant';
  accessibility: FluxAccessibility;
  parentFrameId?: string; // For frame chaining
  metadata?: Record<string, unknown>;
}

// ─── FluxFrame History ───────────────────────────────────────────

export interface FluxFrameHistoryEntry {
  frame: FluxFrame;
  createdAt: number;
  dissolvedAt?: number;
  userIntent: string;
}

// ─── FluxEngine ──────────────────────────────────────────────────

export class FluxEngine {
  private frameHistory: FluxFrameHistoryEntry[] = [];
  private currentFrame: FluxFrame | null = null;
  private listeners: Set<(frame: FluxFrame | null) => void> = new Set();
  private componentRegistry: Map<FluxComponentType, boolean> = new Map();
  private frameCounter = 0;
  private dissolveTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor() {
    // Register all component types
    const allTypes: FluxComponentType[] = [
      'smart_viewer', 'data_grid', 'insight_card', 'visual_gallery',
      'audio_brief', 'quick_action', 'terminal', 'agent_chat',
      'code_editor', 'file_browser', 'chart', 'form_builder',
      'memory_explorer', 'skill_launcher', 'fleet_monitor',
      'security_audit', 'crawler_dashboard', 'video_feed',
      'notification_center', 'trending_intel'
    ];
    allTypes.forEach(t => this.componentRegistry.set(t, true));
  }

  // ─── Core API ────────────────────────────────────────────────

  /**
   * Generate a FluxFrame from structured intent data.
   * This is called by the IntentParser after NLP processing.
   */
  generateFrame(
    intent: string,
    components: FluxComponent[],
    options?: Partial<Pick<FluxFrame, 'theme' | 'layout' | 'ttl' | 'transition' | 'accessibility'>>
  ): FluxFrame {
    const frame: FluxFrame = {
      id: `flux_${++this.frameCounter}_${Date.now()}`,
      intent,
      timestamp: Date.now(),
      theme: options?.theme ?? 'auto',
      layout: options?.layout ?? this.inferLayout(components),
      components: components.map((c, i) => ({
        ...c,
        id: c.id || `comp_${i}_${Date.now()}`,
        animate: c.animate ?? 'fade_in',
        priority: c.priority ?? i,
      })),
      ttl: options?.ttl,
      transition: options?.transition ?? 'morph',
      accessibility: options?.accessibility ?? this.defaultAccessibility(),
      parentFrameId: this.currentFrame?.id,
    };

    return frame;
  }

  /**
   * Present a frame — dissolves the current frame and renders the new one.
   */
  present(frame: FluxFrame): void {
    // Clear existing dissolve timer
    if (this.currentFrame) {
      const timer = this.dissolveTimers.get(this.currentFrame.id);
      if (timer) clearTimeout(timer);

      // Archive to history
      const entry = this.frameHistory.find(e => e.frame.id === this.currentFrame!.id);
      if (entry) entry.dissolvedAt = Date.now();
    }

    // Set new frame
    this.currentFrame = frame;
    this.frameHistory.push({
      frame,
      createdAt: Date.now(),
      userIntent: frame.intent,
    });

    // Set auto-dissolve timer if TTL is set
    if (frame.ttl) {
      const timer = setTimeout(() => this.dissolve(frame.id), frame.ttl);
      this.dissolveTimers.set(frame.id, timer);
    }

    // Notify all listeners
    this.notifyListeners();
  }

  /**
   * Dissolve a frame — fade it out and clear it.
   */
  dissolve(frameId?: string): void {
    if (!frameId || frameId === this.currentFrame?.id) {
      const entry = this.frameHistory.find(e => e.frame.id === this.currentFrame?.id);
      if (entry) entry.dissolvedAt = Date.now();
      this.currentFrame = null;
      this.notifyListeners();
    }
  }

  /**
   * Update a specific component within the current frame.
   */
  updateComponent(componentId: string, updates: Partial<FluxComponent>): void {
    if (!this.currentFrame) return;
    const idx = this.currentFrame.components.findIndex(c => c.id === componentId);
    if (idx >= 0) {
      this.currentFrame.components[idx] = {
        ...this.currentFrame.components[idx],
        ...updates,
      };
      this.notifyListeners();
    }
  }

  /**
   * Add a component to the current frame dynamically.
   */
  addComponent(component: FluxComponent): void {
    if (!this.currentFrame) return;
    this.currentFrame.components.push({
      ...component,
      id: component.id || `comp_dynamic_${Date.now()}`,
      animate: component.animate ?? 'slide_up',
    });
    this.notifyListeners();
  }

  /**
   * Remove a component from the current frame.
   */
  removeComponent(componentId: string): void {
    if (!this.currentFrame) return;
    this.currentFrame.components = this.currentFrame.components.filter(
      c => c.id !== componentId
    );
    this.notifyListeners();
  }

  // ─── Subscription System ─────────────────────────────────────

  subscribe(listener: (frame: FluxFrame | null) => void): () => void {
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.currentFrame);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn(this.currentFrame));
  }

  // ─── Getters ─────────────────────────────────────────────────

  getCurrentFrame(): FluxFrame | null {
    return this.currentFrame;
  }

  getHistory(): FluxFrameHistoryEntry[] {
    return [...this.frameHistory];
  }

  getRegisteredComponents(): FluxComponentType[] {
    return [...this.componentRegistry.keys()];
  }

  // ─── Private Helpers ─────────────────────────────────────────

  private inferLayout(components: FluxComponent[]): FluxLayout {
    const count = components.length;
    if (count === 1) return 'focus';
    if (count === 2) return 'split_v';
    if (count <= 4) return 'grid';
    if (count <= 6) return 'grid';
    return 'gallery';
  }

  private defaultAccessibility(): FluxAccessibility {
    return {
      voiceEnabled: true,
      gestureEnabled: true,
      hapticFeedback: false,
      highContrast: false,
      screenReaderOptimized: false,
      reducedMotion: false,
      fontSize: 'md',
    };
  }
}

// ─── Singleton Export ────────────────────────────────────────────

let fluxEngineInstance: FluxEngine | null = null;

export function getFluxEngine(): FluxEngine {
  if (!fluxEngineInstance) {
    fluxEngineInstance = new FluxEngine();
  }
  return fluxEngineInstance;
}
