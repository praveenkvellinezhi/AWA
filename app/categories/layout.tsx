import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category Templates — AI Creation Guides",
  description:
    "Browse AI prompt templates by creative category. Expert-crafted workflows with matched tools and step-by-step usage guidance.",
  openGraph: {
    title: "Category Templates — AI Creation Guides",
    description:
      "Explore AI creation templates organized by category with production-ready prompts and tool matching.",
  },
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
