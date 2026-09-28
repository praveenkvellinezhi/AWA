import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Access Your Account",
  description:
    "Sign in to your AWA account to access saved prompts, collections, credits, and your personalized AI creation dashboard.",
  openGraph: {
    title: "Sign In — Access Your Account",
    description:
      "Log in to AWA to manage your AI prompts, collections, and subscription.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
