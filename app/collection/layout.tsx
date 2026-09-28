import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Collections — Curated Prompt Sets",
  description:
    "Organize and manage your personal collections of AI prompts and creative templates. Group workflows by project, theme, or tool.",
  openGraph: {
    title: "My Collections — Curated Prompt Sets",
    description:
      "Build custom collections of AI prompts organized by project, theme, or creative discipline.",
  },
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
