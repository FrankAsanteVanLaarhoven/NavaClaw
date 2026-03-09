const fs = require('fs');

const path = 'src/components/ephemeral/FluxRenderer.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update Themes to be more translucent (glassmorphism)
const newThemes = `const THEME_PALETTES: Record<FluxTheme | 'monochrome_zinc', { bg: string; card: string; accent: string; text: string; border: string; glow: string }> = {
  analysis_red: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  studio_neon: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  ocean_deep: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  forest_calm: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  midnight_gold: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  cyber_emerald: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  monochrome_zinc: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
  auto: { bg: 'from-black via-[#050505] to-black', card: 'bg-black/40 backdrop-blur-xl border-white/[0.08]', accent: 'text-white', text: 'text-zinc-300', border: 'border-white/[0.08]', glow: 'shadow-[0_4px_30px_rgba(255,255,255,0.03)]' },
};`;

content = content.replace(/const THEME_PALETTES[\s\S]*?auto: {[\s\S]*?},[\s\S]*?};/m, newThemes);

fs.writeFileSync(path, content);
console.log("Glassmorphism themes applied.");
