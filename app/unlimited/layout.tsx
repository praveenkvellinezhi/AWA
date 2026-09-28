import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AWA Unlimited — Full Access Subscription Plans",
  description:
    "Unlock unlimited access to 500+ production-ready AI prompts, animated canvas backgrounds, MCP integration, and weekly content drops. Choose monthly, yearly, or lifetime plans.",
  openGraph: {
    title: "AWA Unlimited — Full Access Subscription Plans",
    description:
      "Get unlimited access to all AWA prompts, shaders, and premium features. Plans starting at affordable prices.",
  },
};

export default function UnlimitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
