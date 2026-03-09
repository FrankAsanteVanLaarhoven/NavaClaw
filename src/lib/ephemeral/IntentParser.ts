/**
 * NAVACLAW-AI IntentParser — Natural Language → FluxFrame
 *
 * Classifies user intent and generates the optimal FluxFrame configuration.
 * No menus, no navigation — just say what you want.
 */

import {
  FluxEngine,
  FluxFrame,
  FluxComponent,
  FluxComponentType,
  FluxLayout,
  FluxTheme,
  getFluxEngine,
} from './FluxEngine';

// ─── Intent Classification ──────────────────────────────────────

export type IntentCategory =
  | 'build'       // "Create a website", "Build a form"
  | 'analyze'     // "Show me metrics", "Analyze this data"
  | 'communicate' // "Send a message", "Check emails"
  | 'create'      // "Generate an image", "Write a report"
  | 'monitor'     // "Show system status", "Check server health"
  | 'manage'      // "Organize files", "Schedule a task"
  | 'search'      // "Find information", "Search for..."
  | 'execute'     // "Run this code", "Execute command"
  | 'configure'   // "Change settings", "Update config"
  | 'explore'     // "Show memories", "Browse skills"
  | 'converse';   // General conversation / fallback

export interface ParsedIntent {
  category: IntentCategory;
  confidence: number;
  entities: IntentEntity[];
  rawInput: string;
  suggestedTheme: FluxTheme;
  suggestedLayout: FluxLayout;
  suggestedComponents: FluxComponent[];
}

export interface IntentEntity {
  type: 'target' | 'action' | 'modifier' | 'quantity' | 'time' | 'location';
  value: string;
  start: number;
  end: number;
}

// ─── Intent Patterns ─────────────────────────────────────────────

interface IntentPattern {
  category: IntentCategory;
  keywords: string[];
  phrases: RegExp[];
  theme: FluxTheme;
  layout: FluxLayout;
  components: FluxComponentType[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    category: 'monitor',
    keywords: ['status', 'health', 'monitor', 'sensors', 'telemetry', 'system', 'core'],
    phrases: [/show\s+(me\s+)?(?:the\s+)?(?:status|health|system)/i, /how\s+(?:are|is)\s+(?:the\s+)?(?:system|services)/i],
    theme: 'monochrome_zinc',
    layout: 'grid',
    components: ['fleet_monitor', 'chart', 'insight_card', 'notification_center'],
  },
  {
    category: 'analyze',
    keywords: ['analyze', 'analysis', 'metrics', 'dashboard', 'data', 'report', 'statistics', 'chart', 'graph'],
    phrases: [/(?:show|display|give)\s+(me\s+)?(?:the\s+)?(?:analysis|metrics|data|dashboard)/i, /analyze\s+/i],
    theme: 'analysis_red',
    layout: 'grid',
    components: ['chart', 'data_grid', 'insight_card'],
  },
  {
    category: 'build',
    keywords: ['build', 'create', 'make', 'develop', 'code', 'program', 'website', 'app', 'script'],
    phrases: [/(?:build|create|make|develop)\s+(?:a\s+)?/i, /write\s+(?:a\s+)?(?:program|script|code)/i],
    theme: 'studio_neon',
    layout: 'split_v',
    components: ['code_editor', 'terminal', 'agent_chat'],
  },
  {
    category: 'communicate',
    keywords: ['email', 'message', 'send', 'whatsapp', 'telegram', 'slack', 'discord', 'chat', 'call'],
    phrases: [/(?:send|check|read)\s+(?:my\s+)?(?:email|message)/i, /(?:message|contact)\s+/i],
    theme: 'ocean_deep',
    layout: 'split_v',
    components: ['agent_chat', 'quick_action', 'notification_center'],
  },
  {
    category: 'search',
    keywords: ['search', 'find', 'look', 'crawl', 'scrape', 'extract', 'locate', 'discover'],
    phrases: [/(?:search|find|look)\s+(?:for\s+)?/i, /crawl\s+/i, /scrape\s+/i],
    theme: 'midnight_gold',
    layout: 'split_h',
    components: ['crawler_dashboard', 'data_grid', 'smart_viewer'],
  },
  {
    category: 'execute',
    keywords: ['run', 'execute', 'terminal', 'command', 'shell', 'bash', 'python', 'node'],
    phrases: [/(?:run|execute)\s+/i, /open\s+(?:a\s+)?terminal/i],
    theme: 'forest_calm',
    layout: 'focus',
    components: ['terminal', 'agent_chat'],
  },
  {
    category: 'create',
    keywords: ['generate', 'image', 'video', 'audio', 'write', 'compose', 'design', 'draw'],
    phrases: [/(?:generate|create)\s+(?:an?\s+)?(?:image|video|audio)/i, /write\s+(?:a\s+)?/i],
    theme: 'studio_neon',
    layout: 'split_v',
    components: ['visual_gallery', 'agent_chat', 'quick_action'],
  },
  {
    category: 'manage',
    keywords: ['organize', 'schedule', 'task', 'manage', 'plan', 'arrange', 'sort', 'clean', 'backup'],
    phrases: [/(?:organize|manage|schedule)\s+/i, /(?:create|set)\s+(?:a\s+)?(?:task|schedule)/i],
    theme: 'ocean_deep',
    layout: 'grid',
    components: ['data_grid', 'quick_action', 'insight_card'],
  },
  {
    category: 'configure',
    keywords: ['settings', 'config', 'configure', 'setup', 'change', 'update', 'preferences'],
    phrases: [/(?:change|update)\s+(?:my\s+)?(?:settings|config)/i, /configure\s+/i],
    theme: 'forest_calm',
    layout: 'focus',
    components: ['form_builder', 'agent_chat'],
  },
  {
    category: 'explore',
    keywords: ['memory', 'memories', 'skills', 'browse', 'explore', 'history', 'knowledge'],
    phrases: [/(?:show|browse)\s+(?:my\s+)?(?:memories|skills|history)/i, /explore\s+/i],
    theme: 'cyber_emerald',
    layout: 'gallery',
    components: ['memory_explorer', 'skill_launcher'],
  },
  {
    category: 'manage',
    keywords: ['projects', 'tasks', 'scheduler', 'schedule'],
    phrases: [/(?:show\s+)?(?:my\s+)?(?:projects|tasks)/i, /open\s+scheduler/i],
    theme: 'ocean_deep',
    layout: 'grid',
    components: ['data_grid'],
  },
  {
    category: 'search',
    keywords: ['crawler', 'dataminer', 'scrape', 'extract'],
    phrases: [/open\s+dataminer/i, /start\s+crawler/i],
    theme: 'midnight_gold',
    layout: 'split_v',
    components: ['crawler_dashboard', 'data_grid'],
  },
  {
    category: 'configure',
    keywords: ['integrations', 'nava integrations', 'api'],
    phrases: [/show\s+integrations/i, /open\s+api\s+settings/i],
    theme: 'studio_neon',
    layout: 'grid',
    components: ['insight_card', 'data_grid'],
  },
  {
    category: 'manage',
    keywords: ['files', 'browser', 'workspace', 'directory'],
    phrases: [/(?:open\s+)?(?:file\s+browser|files|workspace)/i],
    theme: 'monochrome_zinc',
    layout: 'focus',
    components: ['file_browser'],
  },
  {
    category: 'manage',
    keywords: ['projects', 'tasks', 'scheduler', 'schedule'],
    phrases: [/(?:show\s+)?(?:my\s+)?(?:projects|tasks)/i, /open\s+scheduler/i],
    theme: 'monochrome_zinc',
    layout: 'grid',
    components: ['data_grid'],
  },
  {
    category: 'search',
    keywords: ['website', 'github', 'repo', 'visit', 'url'],
    phrases: [/visit\s+(?:website|github)/i],
    theme: 'monochrome_zinc',
    layout: 'focus',
    components: ['smart_viewer'],
  },
  {
    category: 'converse',
    keywords: ['chat', 'agent', 'conversational', 'talk'],
    phrases: [/open\s+agent\s+chat/i],
    theme: 'monochrome_zinc',
    layout: 'focus',
    components: ['agent_chat'],
  },
  {
    category: 'monitor',
    keywords: ['security', 'audit', 'scan', 'vulnerability', 'threat', 'compliance'],
    phrases: [/(?:run|show)\s+(?:a\s+)?(?:security|audit|scan)/i],
    theme: 'analysis_red',
    layout: 'grid',
    components: ['security_audit', 'chart', 'notification_center'],
  },
  {
    category: 'monitor',
    keywords: ['trending', 'trends', 'hot', 'viral', 'scouting', 'scout', 'social', 'news', 'feed', 'twitter', 'reddit', 'hacker news'],
    phrases: [/(?:show|what['\s]s?)\s+(?:trending|hot|viral)/i, /(?:scouting|scout)\s+(?:report|feed)/i, /(?:social|news)\s+(?:feed|trends)/i],
    theme: 'midnight_gold',
    layout: 'focus',
    components: ['trending_intel'],
  },
];

// ─── Default / Conversational ────────────────────────────────────

const CONVERSATIONAL_FALLBACK: ParsedIntent = {
  category: 'converse',
  confidence: 0.5,
  entities: [],
  rawInput: '',
  suggestedTheme: 'auto',
  suggestedLayout: 'conversational',
  suggestedComponents: [
    {
      type: 'agent_chat',
      id: 'main_chat',
      title: 'GO',
      config: { fullscreen: true, voiceEnabled: true },
      animate: 'fade_in',
    },
    {
      type: 'quick_action',
      id: 'suggestions',
      title: 'GO ACTIONS',
      config: {
        actions: [
          { label: 'Search the web', intent: 'search for latest AI news' },
          { label: 'Core Health', intent: 'show core health status' },
          { label: 'Security audit', intent: 'run security audit' },
          { label: 'Open terminal', intent: 'open terminal' },
          { label: 'Browse memories', intent: 'explore my memories' },
          { label: 'Settings', intent: 'configure settings' },
        ],
      },
      animate: 'slide_up',
    },
  ],
};

// ─── IntentParser Class ──────────────────────────────────────────

export class IntentParser {
  private engine: FluxEngine;
  private contextHistory: string[] = [];
  private maxContextHistory = 10;

  constructor(engine?: FluxEngine) {
    this.engine = engine ?? getFluxEngine();
  }

  /**
   * Parse raw user input (text or transcribed voice) into a FluxFrame.
   */
  parse(input: string): ParsedIntent {
    const normalizedInput = input.toLowerCase().trim();

    if (!normalizedInput) {
      return { ...CONVERSATIONAL_FALLBACK, rawInput: input };
    }

    // Track context
    this.contextHistory.push(normalizedInput);
    if (this.contextHistory.length > this.maxContextHistory) {
      this.contextHistory.shift();
    }

    // Score each intent pattern
    let bestMatch: { pattern: IntentPattern; score: number } | null = null;

    for (const pattern of INTENT_PATTERNS) {
      let score = 0;

      // Keyword matching
      for (const keyword of pattern.keywords) {
        if (normalizedInput.includes(keyword)) {
          score += 2;
        }
      }

      // Phrase matching (higher weight)
      for (const phrase of pattern.phrases) {
        if (phrase.test(normalizedInput)) {
          score += 5;
        }
      }

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { pattern, score };
      }
    }

    // If no strong match, fall back to conversational
    if (!bestMatch || bestMatch.score < 2) {
      return { ...CONVERSATIONAL_FALLBACK, rawInput: input };
    }

    const { pattern } = bestMatch;
    const confidence = Math.min(bestMatch.score / 10, 1.0);

    // Extract entities
    const entities = this.extractEntities(normalizedInput);

    // Build components
    const components: FluxComponent[] = pattern.components.map((type, i) => ({
      type,
      id: `${type}_${Date.now()}_${i}`,
      title: this.getComponentTitle(type, normalizedInput, entities),
      config: this.getComponentConfig(type, normalizedInput, entities),
      animate: i === 0 ? 'scale_in' as const : 'fade_in' as const,
      priority: i,
    }));

    return {
      category: pattern.category,
      confidence,
      entities,
      rawInput: input,
      suggestedTheme: pattern.theme,
      suggestedLayout: pattern.layout,
      suggestedComponents: components,
    };
  }

  /**
   * Parse and immediately present the generated FluxFrame.
   */
  parseAndPresent(input: string): FluxFrame {
    const parsed = this.parse(input);
    const frame = this.engine.generateFrame(
      input,
      parsed.suggestedComponents,
      {
        theme: parsed.suggestedTheme,
        layout: parsed.suggestedLayout,
        transition: 'morph',
      }
    );
    this.engine.present(frame);
    return frame;
  }

  // ─── Entity Extraction ───────────────────────────────────────

  private extractEntities(input: string): IntentEntity[] {
    const entities: IntentEntity[] = [];

    // URL patterns
    const urlMatch = input.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      entities.push({
        type: 'target',
        value: urlMatch[1],
        start: urlMatch.index!,
        end: urlMatch.index! + urlMatch[1].length,
      });
    }

    // Quoted strings
    const quotedMatch = input.match(/["']([^"']+)["']/);
    if (quotedMatch) {
      entities.push({
        type: 'target',
        value: quotedMatch[1],
        start: quotedMatch.index!,
        end: quotedMatch.index! + quotedMatch[0].length,
      });
    }

    // Time patterns
    const timeMatch = input.match(
      /(?:every|in|at|after)\s+(\d+\s*(?:hour|minute|second|day|week)s?)/i
    );
    if (timeMatch) {
      entities.push({
        type: 'time',
        value: timeMatch[1],
        start: timeMatch.index!,
        end: timeMatch.index! + timeMatch[0].length,
      });
    }

    // Quantity patterns
    const qtyMatch = input.match(/(\d+)\s+(?:files?|items?|results?|pages?)/i);
    if (qtyMatch) {
      entities.push({
        type: 'quantity',
        value: qtyMatch[1],
        start: qtyMatch.index!,
        end: qtyMatch.index! + qtyMatch[0].length,
      });
    }

    return entities;
  }

  // ─── Component Config Generation ─────────────────────────────

  private getComponentTitle(type: FluxComponentType, input: string, entities: IntentEntity[]): string {
    const target = entities.find(e => e.type === 'target')?.value;
    const lc = input.toLowerCase();
    
    // Explicit title overrides for Agent Zero sidebar clicks
    if (lc.includes('scheduler') || lc.includes('schedule')) return 'GO SCHEDULER';
    if (lc.includes('memories') || lc.includes('memory')) return 'GO MEMORY';
    if (lc.includes('projects') || lc.includes('tasks')) return 'GO PROJECTS';
    if (lc.includes('crawler') || lc.includes('dataminer')) return 'GO DATAMINER';
    if (lc.includes('integrations') || lc.includes('nava integrations')) return 'GO INTEGRATIONS';
    
    const titles: Record<string, string> = {
      smart_viewer: target ? `GO VIEW: ${target}` : input.includes('github') ? 'GO GITHUB' : input.includes('website') ? 'GO BROWSER' : 'GO DOCUMENT',
      data_grid: input.includes('project') ? 'GO PROJECTS' : input.includes('task') ? 'GO TASKS' : input.includes('schedule') ? 'GO SCHEDULER' : 'GO DATA',
      insight_card: 'GO INSIGHTS',
      visual_gallery: 'GO GALLERY',
      audio_brief: 'GO AUDIO',
      quick_action: 'GO ACTIONS',
      terminal: 'GO TERMINAL',
      agent_chat: 'GO',
      code_editor: 'GO CODE',
      file_browser: 'GO FILES',
      chart: 'GO ANALYTICS',
      form_builder: input.includes('setting') ? 'GO SETTINGS' : 'GO CONFIG',
      memory_explorer: 'GO MEMORY',
      skill_launcher: 'GO SKILLS',
      fleet_monitor: 'GO RESOURCES',
      security_audit: 'GO SECURITY',
      crawler_dashboard: 'GO CRAWLER',
      video_feed: 'GO FEED',
      notification_center: 'GO NOTIFICATIONS',
      trending_intel: 'GO TRENDING',
    };
    return titles[type] ?? type;
  }

  private getComponentConfig(
    type: FluxComponentType,
    input: string,
    entities: IntentEntity[]
  ): Record<string, unknown> {
    const target = entities.find(e => e.type === 'target')?.value;

    switch (type) {
      case 'agent_chat':
        return { initialMessage: input, voiceEnabled: true, streamResponses: true };
      case 'terminal':
        return { initialCommand: '', theme: 'dark', fontSize: 14 };
      case 'crawler_dashboard':
        return { targetUrl: target, mode: 'stealth', depth: 3 };
      case 'chart':
        return { chartType: 'auto', animated: true, realtime: false };
      case 'data_grid':
        return { 
          editable: true, 
          searchable: true, 
          sortable: true,
          type: input.includes('project') ? 'projects' : input.includes('task') ? 'tasks' : 'generic'
        };
      case 'fleet_monitor':
        return { refreshInterval: 1000, showMetrics: true, showResources: true };
      case 'security_audit':
        return { scanType: 'full', target: target ?? 'system' };
      case 'code_editor':
        return { language: 'python', theme: 'vs-dark', minimap: false };
      case 'memory_explorer':
        return { searchQuery: '', filterType: 'all' };
      case 'skill_launcher':
        return { category: 'all', showInstalled: true };
      case 'form_builder':
        return { autoSave: true };
      case 'trending_intel':
        return { refreshInterval: 30000 };
      default:
        return {};
    }
  }
}

// ─── Singleton Export ────────────────────────────────────────────

let parserInstance: IntentParser | null = null;

export function getIntentParser(): IntentParser {
  if (!parserInstance) {
    parserInstance = new IntentParser();
  }
  return parserInstance;
}
