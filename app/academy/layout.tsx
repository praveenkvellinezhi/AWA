import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy — AI Creation Playbooks & Tutorials",
  description:
    "Learn AI creation through step-by-step playbooks, expert tutorials, and production-tested workflows for Midjourney, Runway, Sora, and more.",
  openGraph: {
    title: "Academy — AI Creation Playbooks & Tutorials",
    description:
      "Master generative AI creation with structured learning paths, hands-on tutorials, and production-ready prompt techniques.",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
