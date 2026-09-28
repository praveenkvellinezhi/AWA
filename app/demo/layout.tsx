import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo — AI Prompt Walkthrough",
  description:
    "Experience the AWA AI creation workflow live. Walk through a complete prompt-to-output demonstration with real tool matching and step-by-step guidance.",
  openGraph: {
    title: "Interactive Demo — AI Prompt Walkthrough",
    description:
      "Try AWA's AI prompt generation workflow with an interactive step-by-step demonstration.",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
