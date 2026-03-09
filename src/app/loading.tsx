import { Loader2, Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0b0b0f] to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Primary Spinner */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-zinc-200 to-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-white/20 rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Loading AuraAI
        </h2>
        
        <p className="text-gray-300 mb-6">
          Initializing specialized AI agents...
        </p>
        
        <div className="flex items-center space-x-3 mb-2">
          <Loader2 className="w-5 h-5 text-zinc-200 animate-spin" />
          <span className="text-zinc-200 text-sm">Please wait</span>
        </div>
        
        <div className="mt-8 space-y-2">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Neural Stealth Engine</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-zinc-400">Loading System</span>
            <div className="w-2 h-2 bg-zinc-200 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-zinc-200 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-zinc-200 rounded-full animate-pulse delay-150"></div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>AI Prompt Generator</span>
          </div>
        </div>
      </div>
    </div>
  );
}