'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ExternalLink, MessageSquare, ArrowUpRight } from 'lucide-react';

interface TrendingItem {
  id: string;
  source: string;
  title: string;
  url: string;
  score: number;
  comments: number;
  category: string;
  timestamp: string;
}

interface TrendingFeed {
  generated_at: string;
  total_items: number;
  sources: { hacker_news: number; reddit: number; x_twitter: number };
  categories: Record<string, number>;
  items: TrendingItem[];
  message?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  Tech: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  Crypto: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Science: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  Dev: 'text-green-400 border-green-500/30 bg-green-500/10',
  Business: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  Culture: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
};

export const TrendingIntelWidget: React.FC<{
  config: Record<string, unknown>;
  theme: { accent: string; text: string };
}> = () => {
  const [feed, setFeed] = useState<TrendingFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(data => {
        setFeed(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="flex items-center gap-3 text-zinc-500">
          <TrendingUp className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-mono">Scanning sources...</span>
        </div>
      </div>
    );
  }

  if (!feed || feed.total_items === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <TrendingUp className="w-8 h-8 text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-500 font-mono">
          {feed?.message || 'No trending data yet. Scout runs at 08:00 & 20:00 UTC.'}
        </p>
      </div>
    );
  }

  const categories = Object.keys(feed.categories);
  const filteredItems = filter === 'all'
    ? feed.items.slice(0, 20)
    : feed.items.filter(i => i.category === filter).slice(0, 20);

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return `${Math.floor(diff / 60000)}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
        <span>{feed.total_items} items · {Object.keys(feed.sources).length} sources</span>
        <span>Updated {timeAgo(feed.generated_at)} ago</span>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
            filter === 'all'
              ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
              : 'text-zinc-500 border-zinc-800/40 hover:border-zinc-700'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
              filter === cat
                ? CATEGORY_COLORS[cat] || 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                : 'text-zinc-500 border-zinc-800/40 hover:border-zinc-700'
            }`}
          >
            {cat} ({feed.categories[cat]})
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-1.5 max-h-[350px] overflow-y-auto scrollbar-thin">
        {filteredItems.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 leading-snug group-hover:text-zinc-100 line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600">
                <span className="font-mono">{item.source}</span>
                {item.score > 0 && (
                  <span className="flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {item.score}
                  </span>
                )}
                {item.comments > 0 && (
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3" />
                    {item.comments}
                  </span>
                )}
                <span>{timeAgo(item.timestamp)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                CATEGORY_COLORS[item.category] || 'text-zinc-400 border-zinc-700'
              }`}>
                {item.category}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
