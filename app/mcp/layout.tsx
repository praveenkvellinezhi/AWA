import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Integration — Model Context Protocol Server",
  description:
    "Connect AWA prompts directly to Cursor, Claude Desktop, Bolt, and Lovable via the Model Context Protocol (MCP). One command setup for AI-assisted development.",
  openGraph: {
    title: "MCP Integration — Model Context Protocol Server",
    description:
      "Integrate AWA's prompt library into your AI development workflow via MCP — works with Cursor, Claude, Bolt, and Lovable.",
  },
};

export default function McpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
