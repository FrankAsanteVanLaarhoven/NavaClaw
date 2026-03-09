const fs = require('fs');

const path = 'src/components/ephemeral/FluxRenderer.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace THEME_PALETTES completely
const newThemes = `const THEME_PALETTES: Record<FluxTheme | 'monochrome_zinc', { bg: string; card: string; accent: string; text: string; border: string; glow: string }> = {
  analysis_red: { bg: 'from-[#0b0b0f] via-[#0b0f0d] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.08)]' },
  studio_neon: { bg: 'from-[#0b0b0f] via-[#0a0f0d] to-[#0b0b0f]', card: 'bg-[#0c1310]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.1)]' },
  ocean_deep: { bg: 'from-[#0b0b0f] via-[#0a0e0c] to-[#0b0b0f]', card: 'bg-[#0b1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.08)]' },
  forest_calm: { bg: 'from-[#0b0b0f] via-[#0a100e] to-[#0b0b0f]', card: 'bg-[#0c1410]/90 border-white/15', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/20', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.12)]' },
  midnight_gold: { bg: 'from-[#0b0b0f] via-[#0b0f0d] to-[#0b0b0f]', card: 'bg-[#0d1310]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.1)]' },
  cyber_emerald: { bg: 'from-[#0b0b0f] via-[#0a110e] to-[#0b0b0f]', card: 'bg-[#0c1510]/90 border-white/15', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/20', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.12)]' },
  monochrome_zinc: { bg: 'from-[#0b0b0f] via-[#0b0d0c] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.08)]' },
  auto: { bg: 'from-[#0b0b0f] via-[#0b0d0c] to-[#0b0b0f]', card: 'bg-[#0d1210]/90 border-white/10', accent: 'text-white', text: 'text-zinc-100', border: 'border-white/15', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.06)]' },
};`;

content = content.replace(/const THEME_PALETTES[\s\S]*?auto: {[\s\S]*?},[\s\S]*?};/m, newThemes);

// Replace emerald classes
content = content.replace(/emerald-400/g, 'white');
content = content.replace(/emerald-500/g, 'white');
content = content.replace(/emerald-600/g, 'zinc-200');

fs.writeFileSync(path, content);
console.log("Done");
