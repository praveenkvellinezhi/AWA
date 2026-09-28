import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canvas Backgrounds — Animated AI Shaders & Visuals",
  description:
    "Browse and preview animated canvas backgrounds, generative shaders, and dynamic visual effects for your creative projects.",
  openGraph: {
    title: "Canvas Backgrounds — Animated AI Shaders & Visuals",
    description:
      "Explore a curated library of animated shaders and canvas backgrounds for AI-powered creative workflows.",
  },
};

export default function BackgroundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
