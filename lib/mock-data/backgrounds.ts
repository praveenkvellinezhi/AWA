import { AnimatedBackground } from "../types";

export const initialBackgrounds: AnimatedBackground[] = [
  {
    id: "bg-aurora",
    title: "Cosmic Northern Lights Aurora",
    category: "Aurora",
    gradientClass: "from-emerald-950 via-teal-900 to-indigo-950",
    previewType: "gradient",
    codeSnippet: `// Cosmic Northern Lights
<div className="relative min-h-screen bg-slate-950 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-indigo-500/25 blur-3xl animate-pulse" />
  <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400/20 blur-[120px]" />
</div>`,
  },
  {
    id: "bg-cyber-grid",
    title: "Tron Neon Perspective Cyber Grid",
    category: "Cyber",
    gradientClass: "from-slate-950 via-cyan-950 to-purple-950",
    previewType: "canvas",
    codeSnippet: `// Cyber Grid
<div className="relative min-h-screen bg-[#070709] overflow-hidden">
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
</div>`,
  },
  {
    id: "bg-liquid-mesh",
    title: "Liquid Gradient Mesh Distortion",
    category: "Mesh",
    gradientClass: "from-purple-950 via-rose-950 to-amber-950",
    previewType: "mesh",
    codeSnippet: `// Liquid Mesh
<div className="relative min-h-screen bg-[#0d0a14] overflow-hidden">
  <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-fuchsia-600/30 to-rose-500/20 blur-[140px] animate-spin [animation-duration:25s]" />
  <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-amber-500/20 to-purple-500/25 blur-[120px]" />
</div>`,
  },
  {
    id: "bg-starfield",
    title: "Deep Space Quantum Particle Starfield",
    category: "Particles",
    gradientClass: "from-black via-zinc-950 to-indigo-950",
    previewType: "canvas",
    codeSnippet: `// Quantum Starfield
<div className="relative min-h-screen bg-black">
  <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
</div>`,
  },
  {
    id: "bg-glassmorphism",
    title: "Prismatic Translucent Frosted Glass",
    category: "Glass",
    gradientClass: "from-slate-900 via-indigo-950 to-slate-950",
    previewType: "gradient",
    codeSnippet: `// Prismatic Frosted Glass
<div className="relative min-h-screen bg-[#0b0c10]">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/30 rounded-full blur-[100px]" />
  <div className="relative z-10 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8" />
</div>`,
  },
  {
    id: "bg-neon-matrix",
    title: "Matrix Rain Digital Glyph Stream",
    category: "Matrix",
    gradientClass: "from-black via-emerald-950 to-black",
    previewType: "canvas",
    codeSnippet: `// Matrix Stream
<div className="relative min-h-screen bg-black">
  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
</div>`,
  },
];
