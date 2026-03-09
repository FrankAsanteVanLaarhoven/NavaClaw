'use client';

/**
 * NAVACLAW-AI FluxRenderer — Dynamic Ephemeral UI Renderer
 *
 * Receives FluxFrame JSON and renders the full interface dynamically.
 * Components appear/disappear based on user intent. No static pages.
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { FileText, Grid, Lightbulb, Image as ImageIcon, Volume2, Zap, Terminal, Bot, Code, Folder, LineChart, FormInput, Brain, Rocket, Shield, Bug, Video, Bell, Wrench, CheckCircle, Globe, Activity, Search, TrendingUp } from 'lucide-react';
import { DraggableWindow } from './DraggableWindow';
import { TrendingIntelWidget } from './TrendingIntelWidget';
import {
  FluxFrame,
  FluxComponent,
  FluxComponentType,
  FluxLayout,
  FluxTheme,
  getFluxEngine,
} from '@/lib/ephemeral/FluxEngine';

// ─── Theme System ────────────────────────────────────────────────

const THEME_PALETTES: Record<FluxTheme | 'monochrome_zinc', { bg: string; card: string; accent: string; text: string; border: string; glow: string }> = {
  analysis_red: { bg: 'from-[#0b0b0f] via-[#0b0f0d] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.08)]' },
  studio_neon: { bg: 'from-[#0b0b0f] via-[#0a0f0d] to-[#0b0b0f]', card: 'bg-[#0c1310]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.1)]' },
  ocean_deep: { bg: 'from-[#0b0b0f] via-[#0a0e0c] to-[#0b0b0f]', card: 'bg-[#0b1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.08)]' },
  forest_calm: { bg: 'from-[#0b0b0f] via-[#0a100e] to-[#0b0b0f]', card: 'bg-[#0c1410]/90 border-white/15', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/20', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.12)]' },
  midnight_gold: { bg: 'from-[#0b0b0f] via-[#0b0f0d] to-[#0b0b0f]', card: 'bg-[#0d1310]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.1)]' },
  cyber_emerald: { bg: 'from-[#0b0b0f] via-[#0a110e] to-[#0b0b0f]', card: 'bg-[#0c1510]/90 border-white/15', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/20', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.12)]' },
  monochrome_zinc: { bg: 'from-[#0b0b0f] via-[#0b0d0c] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.08)]' },
  auto: { bg: 'from-[#0b0b0f] via-[#0b0d0c] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.06)]' },
};

// ─── Layout System ───────────────────────────────────────────────

const LAYOUT_GRID: Record<FluxLayout, string> = {
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  split_v: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
  split_h: 'grid grid-rows-2 gap-4',
  gallery: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
  focus: 'flex flex-col items-center max-w-4xl mx-auto',
  conversational: 'flex flex-col items-center max-w-3xl mx-auto',
  immersive: 'fixed inset-0 flex items-center justify-center',
};

// ─── Animation Classes ───────────────────────────────────────────

const ANIMATION_CLASSES: Record<string, string> = {
  fade_in: 'animate-[fadeIn_0.5s_ease-out_forwards]',
  slide_up: 'animate-[slideUp_0.4s_ease-out_forwards]',
  scale_in: 'animate-[scaleIn_0.3s_ease-out_forwards]',
  morph: 'animate-[morph_0.6s_ease-in-out_forwards]',
  none: '',
};

// ─── Component Renderers ─────────────────────────────────────────

interface ComponentProps {
  component: FluxComponent;
  theme: typeof THEME_PALETTES['auto'];
}

const FluxComponentCard: React.FC<ComponentProps> = ({ component, theme }) => {
  const animClass = ANIMATION_CLASSES[component.animate || 'fade_in'] || '';
  const spanStyle = component.span
    ? { gridColumn: `span ${component.span.cols}`, gridRow: `span ${component.span.rows}` }
    : {};

  // Icon mapping
  const icons: Record<string, React.ElementType> = {
    smart_viewer: FileText,
    data_grid: Grid,
    insight_card: Lightbulb,
    visual_gallery: ImageIcon,
    audio_brief: Volume2,
    quick_action: Zap,
    terminal: Terminal,
    agent_chat: Bot,
    code_editor: Code,
    file_browser: Folder,
    chart: LineChart,
    form_builder: FormInput,
    memory_explorer: Brain,
    skill_launcher: Rocket,
    fleet_monitor: Bot,
    security_audit: Shield,
    crawler_dashboard: Bug,
    video_feed: Video,
    notification_center: Bell,
    trending_intel: TrendingUp,
  };
  const Icon = icons[component.type] || Wrench;

  return (
    <DraggableWindow id={component.id}>
      <div
        className={`
          ${theme.card} ${theme.glow} ${animClass}
          rounded-sm border backdrop-blur-xl p-6
          transition-all duration-300 hover:scale-[1.02]
          hover:border-opacity-60 cursor-default
          opacity-0 h-full
        `}
        style={spanStyle}
        id={`flux-component-${component.id}`}
      >
        {/* Component Header */}
        <div className="flex items-center gap-3 mb-4">
          
        <div>
          <h3 className={`font-semibold ${theme.accent} text-sm uppercase tracking-wider`}>
            {component.title || component.type.replace(/_/g, ' ')}
          </h3>
          
        </div>
        <div className="ml-auto">
          <div className={`w-2 h-2 rounded-full bg-white animate-pulse`} />
        </div>
      </div>

      {/* Component Body — Type-specific renders */}
      <div className="min-h-[120px]">
        {component.type === 'agent_chat' && (
          <AgentChatComponent config={component.config} theme={theme} />
        )}
        {component.type === 'terminal' && (
          <TerminalComponent config={component.config} theme={theme} />
        )}
        {component.type === 'insight_card' && (
          <InsightCardComponent config={component.config} theme={theme} />
        )}
        {component.type === 'chart' && (
          <ChartComponent config={component.config} theme={theme} />
        )}
        {component.type === 'quick_action' && (
          <QuickActionComponent config={component.config} theme={theme} />
        )}
        {component.type === 'data_grid' && (
          <DataGridComponent config={component.config} theme={theme} />
        )}
        {component.type === 'fleet_monitor' && (
          <FleetMonitorComponent config={component.config} theme={theme} />
        )}
        {component.type === 'security_audit' && (
          <SecurityAuditComponent config={component.config} theme={theme} />
        )}
        {component.type === 'memory_explorer' && (
          <MemoryExplorerComponent config={component.config} theme={theme} />
        )}
        {component.type === 'crawler_dashboard' && (
          <CrawlerDashboardComponent config={component.config} theme={theme} />
        )}
        {component.type === 'code_editor' && (
          <CodeEditorComponent config={component.config} theme={theme} />
        )}
        {component.type === 'skill_launcher' && (
          <SkillLauncherComponent config={component.config} theme={theme} />
        )}
        {component.type === 'trending_intel' && (
          <TrendingIntelWidget config={component.config} theme={theme} />
        )}
        {/* Fallback */}
        {!['agent_chat', 'terminal', 'insight_card', 'chart', 'quick_action', 'data_grid',
          'fleet_monitor', 'security_audit', 'memory_explorer', 'crawler_dashboard',
          'code_editor', 'skill_launcher', 'trending_intel'].includes(component.type) && (
          <div className="text-zinc-400 text-sm flex items-center justify-center h-full">
            <div className="text-center">
              
              <p className="opacity-60">Component ready</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </DraggableWindow>
  );
};

// ─── Individual Component Implementations ────────────────────────

const AgentChatComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ config, theme }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agent', content: `Processing: "${input}"... I'm connecting to the agent framework to handle your request.` }]);
    }, 500);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[300px]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-sm text-center mt-8">
            {(config.initialMessage as string) || 'Initiate sequence...'}
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-sm px-4 py-2 text-sm ${
              msg.role === 'user'
                ? `bg-zinc-200/30 ${theme.text}`
                : 'bg-zinc-800/60 text-zinc-300'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type or speak..."
          className="flex-1 bg-zinc-900/60 border border-zinc-700/50 rounded-sm px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/50"
          id="flux-agent-chat-input"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-zinc-200/80 hover:bg-zinc-200 rounded-sm text-sm font-medium transition-colors"
          id="flux-agent-chat-send"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const TerminalComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ config }) => {
  const [lines, setLines] = useState<string[]>(['Terminal v2.0.0', '$ ']);
  const [input, setInput] = useState('');

  const executeCommand = () => {
    if (!input.trim()) return;
    setLines(prev => [...prev.slice(0, -1), `$ ${input}`, 'Executing via agent framework...', '$ ']);
    setInput('');
  };

  return (
    <div className="bg-black/60 rounded-sm p-3 font-mono text-xs h-[250px] flex flex-col">
      <div className="flex-1 overflow-y-auto text-green-400 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-white' : 'text-zinc-400'}>
            {line}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && executeCommand()}
        className="bg-transparent border-t border-zinc-800 pt-2 text-white placeholder-zinc-600 focus:outline-none"
        placeholder="Enter command..."
        id="flux-terminal-input"
      />
    </div>
  );
};

const InsightCardComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-3">
    {[
      { label: 'Active Agents', value: '12', change: '+3', positive: true },
      { label: 'Tasks Today', value: '47', change: '+12', positive: true },
      { label: 'Memory Usage', value: '2.4GB', change: '-0.3GB', positive: true },
    ].map((metric, i) => (
      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0">
        <span className="text-zinc-400 text-sm">{metric.label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${theme.text}`}>{metric.value}</span>
          <span className={`text-xs ${metric.positive ? 'text-white' : 'text-red-400'}`}>
            {metric.change}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const ChartComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => {
  // SVG-based mini chart
  const data = [30, 45, 60, 40, 70, 55, 80, 65, 90, 75];
  const max = Math.max(...data);
  const w = 280;
  const h = 120;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - (d / max) * h}`).join(' ');

  return (
    <div className="flex items-center justify-center py-4">
      <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full" style={{ maxWidth: 320 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h + 5} ${points} ${w},${h + 5}`}
          fill="url(#chartGrad)"
          className={theme.accent}
        />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={theme.accent}
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * w}
            cy={h - (d / max) * h}
            r="3"
            fill="currentColor"
            className={theme.accent}
          />
        ))}
      </svg>
    </div>
  );
};

const QuickActionComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ config, theme }) => {
  const actions = (config.actions as Array<{ label: string; intent: string }>) || [
    { label: '🔍 Search', intent: 'search for' },
    { label: '💻 Code', intent: 'open terminal' },
    { label: '📊 Analyze', intent: 'show dashboard' },
  ];

  const handleAction = (intent: string) => {
    const { getIntentParser } = require('@/lib/ephemeral/IntentParser');
    getIntentParser().parseAndPresent(intent);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={() => handleAction(action.intent)}
          className={`
            px-4 py-2 rounded-sm text-sm font-medium
            bg-zinc-800/60 hover:bg-zinc-700/80 border border-zinc-700/30
            transition-all duration-200 hover:scale-105 hover:border-opacity-60
            ${theme.text}
          `}
          id={`flux-action-${i}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

const DataGridComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-700/50">
          {['Name', 'Status', 'Score', 'Updated'].map(h => (
            <th key={h} className={`text-left py-2 px-3 ${theme.accent} font-medium text-xs uppercase tracking-wider`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          ['Agent Alpha', '● Active', '98.2%', '2m ago'],
          ['CrawlBot v3', '● Active', '95.8%', '5m ago'],
          ['Core Health', '○ Idle', '99.1%', '1h ago'],
        ].map((row, i) => (
          <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
            {row.map((cell, j) => (
              <td key={j} className={`py-2 px-3 ${j === 1 ? (cell.includes('Active') ? 'text-white' : 'text-zinc-500') : theme.text}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FleetMonitorComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-3">
    {[
      { name: 'G1-Alpha', battery: 87, status: 'navigating', zone: 'Ward-A' },
      { name: 'G1-Beta', battery: 62, status: 'charging', zone: 'Dock-1' },
      { name: 'G1-Gamma', battery: 95, status: 'patrolling', zone: 'Corridor-B' },
    ].map((bot, i) => (
      <div key={i} className="flex items-center gap-3 py-2">
        <Bot className="w-6 h-6 text-white" />
        <div className="flex-1">
          <div className="flex justify-between">
            <span className={`font-medium ${theme.text} text-sm`}>{bot.name}</span>
            <span className={`text-xs ${bot.status === 'navigating' ? 'text-white' : bot.status === 'charging' ? 'text-amber-400' : 'text-blue-400'}`}>
              {bot.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${bot.battery > 70 ? 'bg-white' : bot.battery > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${bot.battery}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500">{bot.battery}%</span>
            <span className="text-xs text-zinc-600">· {bot.zone}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SecurityAuditComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-2">
    {[
      { check: 'FIPS 140-2 Level 4', status: 'pass' },
      { check: 'Zero-trust segmentation', status: 'pass' },
      { check: 'Quantum-safe crypto', status: 'pass' },
      { check: 'Docker sandbox integrity', status: 'pass' },
      { check: 'Secrets exposure scan', status: 'pass' },
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-3 py-1.5 text-sm">
        <CheckCircle className="w-4 h-4 text-white" />
        <span className={theme.text}>{item.check}</span>
        <span className="ml-auto text-white text-xs font-medium uppercase">{item.status}</span>
      </div>
    ))}
  </div>
);

const MemoryExplorerComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-2">
    <input
      type="text"
      placeholder="Search memories..."
      className="w-full bg-zinc-900/60 border border-zinc-700/50 rounded-sm px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/50"
      id="flux-memory-search"
    />
    {[
      { key: 'WordPress config', similarity: 0.95, age: '2h ago' },
      { key: 'SSH credentials setup', similarity: 0.87, age: '1d ago' },
      { key: 'Fleet deployment #12', similarity: 0.82, age: '3d ago' },
    ].map((mem, i) => (
      <div key={i} className="flex items-center gap-2 py-1.5 text-sm border-b border-zinc-800/30 last:border-0">
        <Brain className="w-4 h-4 text-white" />
        <span className={theme.text}>{mem.key}</span>
        <span className="ml-auto text-xs text-zinc-500">{mem.age}</span>
        <span className="text-xs text-white">{Math.round(mem.similarity * 100)}%</span>
      </div>
    ))}
  </div>
);

const CrawlerDashboardComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-3">
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Enter URL to crawl..."
        defaultValue={(typeof window !== 'undefined' && '') || ''}
        className="flex-1 bg-zinc-900/60 border border-zinc-700/50 rounded-sm px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
        id="flux-crawler-url"
      />
      <button className="px-4 py-2 bg-amber-600/80 hover:bg-amber-600 rounded-sm text-sm font-medium transition-colors" id="flux-crawler-start">
        Crawl
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center text-xs">
      {[
        { label: 'Pages', value: '0' },
        { label: 'Assets', value: '0' },
        { label: 'Depth', value: '0' },
      ].map((stat, i) => (
        <div key={i} className="bg-zinc-900/40 rounded-sm py-2">
          <div className={`font-bold text-lg ${theme.accent}`}>{stat.value}</div>
          <div className="text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const CodeEditorComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="bg-black/60 rounded-sm overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
      </div>
      <span className="text-xs text-zinc-500 ml-2">{(typeof window !== 'undefined' && 'untitled.py') || 'untitled.py'}</span>
    </div>
    <textarea
      className="w-full h-[200px] bg-transparent p-3 font-mono text-sm text-zinc-300 resize-none focus:outline-none"
      placeholder="# Start coding..."
      spellCheck={false}
      id="flux-code-editor-textarea"
    />
  </div>
);

const SkillLauncherComponent: React.FC<{ config: Record<string, unknown>; theme: typeof THEME_PALETTES['auto'] }> = ({ theme }) => (
  <div className="space-y-2">
    {[
      { name: 'WordPress Manager', icon: Globe, installed: true },
      { name: 'GitHub Version Scan', icon: Search, installed: true },
      { name: 'Image Generator', icon: ImageIcon, installed: true },
      { name: 'System Health Monitor', icon: Activity, installed: false },
    ].map((skill, i) => (
      <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-800/30 last:border-0">
        <skill.icon className="w-5 h-5 text-zinc-400" />
        <span className={`${theme.text} text-sm flex-1`}>{skill.name}</span>
        <button className={`px-3 py-1 rounded-sm text-xs font-medium ${
          skill.installed
            ? 'bg-zinc-200/20 text-white border border-white/30'
            : 'bg-zinc-700/40 text-zinc-400 border border-zinc-600/30'
        }`}>
          {skill.installed ? 'Launch' : 'Install'}
        </button>
      </div>
    ))}
  </div>
);

// ─── Main FluxRenderer ──────────────────────────────────────────

export const FluxRenderer: React.FC<{ className?: string }> = ({ className }) => {
  const [frame, setFrame] = useState<FluxFrame | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const engine = getFluxEngine();
    const unsubscribe = engine.subscribe((newFrame) => {
      if (newFrame && frame) {
        setIsTransitioning(true);
        setTimeout(() => {
          setFrame(newFrame);
          setIsTransitioning(false);
        }, 300);
      } else {
        setFrame(newFrame);
      }
    });
    return unsubscribe;
  }, []);

  const theme = useMemo(() => {
    return THEME_PALETTES[frame?.theme || 'auto'];
  }, [frame?.theme]);

  const layoutClass = useMemo(() => {
    return LAYOUT_GRID[frame?.layout || 'conversational'];
  }, [frame?.layout]);

  if (!frame) {
    return null; // No frame = invisible UI. Zero-UI mode.
  }

  return (
    <div
      ref={containerRef}
      className={`
        min-h-screen bg-gradient-to-br ${theme.bg} ${theme.text}
        transition-all duration-500
        ${isTransitioning ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
        ${className || ''}
      `}
      id="flux-renderer-container"
    >
      {/* Frame Header */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h2 className={`text-xs uppercase tracking-widest ${theme.accent} font-medium`}>
            {frame.intent}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Frame #{frame.id.split('_')[1]} · {frame.layout} · {frame.components.length} components
          </p>
        </div>
        <div className="flex items-center gap-2">
          {frame.ttl && (
            <span className="text-xs text-zinc-500">
              ⏱️ auto-dissolve
            </span>
          )}
          <button
            onClick={() => getFluxEngine().dissolve()}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
            id="flux-dissolve-btn"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Components Grid */}
      <div className={`px-6 py-4 ${layoutClass}`}>
        {frame.components
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))
          .map((component) => (
            <FluxComponentCard key={component.id} component={component} theme={theme} />
          ))}
      </div>
    </div>
  );
};

export default FluxRenderer;
