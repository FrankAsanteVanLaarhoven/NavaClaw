import React, { useState } from 'react';
import { 
  Shield, Terminal, Brain, BarChart2, 
  ChevronLeft, ChevronRight, ChevronDown, Zap, TrendingUp,
  Settings, Database, Network, MessageSquare, 
  FolderGit2, Clock, FileText, Globe, Code,
  ListTodo, Cpu
} from 'lucide-react';

interface SidebarProps {
  onAction: (intent: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAction }) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Track which accordion sections are expanded. Default first section to open.
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'GO Core': true
  });

  const isOpen = isPinned || isHovered;

  const toggleGroup = (heading: string) => {
    // Only allow toggling if the sidebar is open
    if (!isOpen) return;
    setExpandedGroups(prev => ({ ...prev, [heading]: !prev[heading] }));
  };

  const serviceGroups = [
    {
      heading: 'GO Core',
      items: [
        { icon: MessageSquare, label: 'Chats', intent: 'open agent chat' },
        { icon: FolderGit2, label: 'Projects', intent: 'show my projects' },
        { icon: Brain, label: 'Memory', intent: 'explore my memories' },
        { icon: Clock, label: 'Scheduler', intent: 'open scheduler' },
        { icon: FileText, label: 'Files', intent: 'open file browser' },
        { icon: Globe, label: 'Visit Website', intent: 'visit website' },
        { icon: Code, label: 'Visit GitHub', intent: 'visit github repo' },
        { icon: Settings, label: 'Settings', intent: 'open settings' },
      ]
    },
    {
      heading: 'Intelligence',
      items: [
        { icon: TrendingUp, label: 'Trending Intel', intent: 'show me trending topics' },
        { icon: BarChart2, label: 'Analytics', intent: 'show analytics dashboard' },
      ]
    },
    {
      heading: 'Operations',
      items: [
        { icon: ListTodo, label: 'Tasks', intent: 'show my tasks' },
        { icon: Cpu, label: 'System Resources', intent: 'status of system' },
        { icon: Database, label: 'Dataminer', intent: 'launch the web crawler' },
        { icon: Network, label: 'Integrations', intent: 'nava integrations' },
      ]
    },
    {
      heading: 'Diagnostics',
      items: [
        { icon: Shield, label: 'Security Audit', intent: 'run a security audit' },
        { icon: Terminal, label: 'Terminal', intent: 'open a terminal' },
      ]
    }
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#0b0b0f]/95 backdrop-blur-2xl border-r border-white/5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'w-64 shadow-[8px_0_32px_-8px_rgba(0,0,0,0.5)]' : 'w-16'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/5 h-16 shrink-0 bg-[#111116]/50">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <div className="w-8 h-8 rounded-sm bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-widest text-zinc-100 text-xs shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">GO</span>
        </div>
        
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`p-1.5 rounded-sm hover:bg-white/10 text-zinc-500 hover:text-white transition-colors shrink-0 ${!isOpen && 'mx-auto'}`}
          title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          {isPinned ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-2 scrollbar-none custom-scrollbar-hide">
        {serviceGroups.map((group, groupIdx) => {
          // If sidebar is closed, all accordion logic is bypassed to show icon grid
          const isExpanded = isOpen ? !!expandedGroups[group.heading] : false;
          
          return (
            <div key={groupIdx} className={`rounded-sm transition-colors duration-200 ${isOpen && isExpanded ? 'bg-white/[0.02] border border-white/[0.05]' : 'border border-transparent'}`}>
              
              {/* Accordion Header */}
              <button 
                onClick={() => toggleGroup(group.heading)}
                className={`w-full flex items-center justify-between px-3 py-2 transition-opacity duration-300 ${isOpen ? 'opacity-100 cursor-pointer' : 'opacity-0 h-0 hidden overflow-hidden pointer-events-none'}`}
              >
                <h3 className="text-[10px] font-mono font-semibold tracking-widest text-zinc-500 uppercase flex-1 text-left">
                  {group.heading}
                </h3>
                <div className={`transition-transform duration-300 text-zinc-600 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>
              
              {/* Accordion Body */}
              <div 
                className={`space-y-0.5 px-1 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen && !isExpanded ? 'max-h-0 opacity-0 pb-0' : 'max-h-[500px] opacity-100 pb-2'
                }`}
              >
                {group.items.map((svc) => (
                  <button
                    key={svc.label}
                    onClick={() => {
                      onAction(svc.intent);
                      // Visual feedback hack: briefly flash the button background 
                      // handled by standard hover/active states in CSS mostly
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-sm hover:bg-white/[0.08] active:bg-white/20 active:scale-[0.98] transition-all duration-200 group text-left ${isOpen ? 'justify-start' : 'justify-center mx-auto w-10 h-10 mb-2'}`}
                    title={isOpen ? undefined : svc.label}
                  >
                    <div className="relative flex items-center justify-center shrink-0 w-6 h-6">
                      <svc.icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    
                    {isOpen && (
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-100 font-medium whitespace-nowrap shrink-0 transition-colors">
                        {svc.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
