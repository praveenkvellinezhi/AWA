import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Templates — My Bookmarks",
  description:
    "Access all the AI prompt templates you've bookmarked for future use. Quickly revisit production-ready workflows and creation guides.",
  openGraph: {
    title: "Saved Templates — My Bookmarks",
    description:
      "Your bookmarked AI creation templates — organized for quick access and reuse.",
  },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
