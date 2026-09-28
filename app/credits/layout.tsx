import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits — Token Balance & Usage",
  description:
    "View your AWA credit balance, purchase additional tokens, and track usage across AI prompt generation and template access.",
  openGraph: {
    title: "Credits — Token Balance & Usage",
    description:
      "Manage your AWA credit tokens for AI prompt generation and premium template access.",
  },
};

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
