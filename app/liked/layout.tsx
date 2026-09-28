import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liked Templates — My Favorites",
  description:
    "View all the AI prompt templates you've liked. Quick access to your favorite creation workflows, prompts, and tool-matched guides.",
  openGraph: {
    title: "Liked Templates — My Favorites",
    description:
      "Access your liked and favorite AI prompt templates in one place.",
  },
};

export default function LikedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
