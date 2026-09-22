"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Copy, Check, Cpu, Layers, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react";

export default function McpPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"claude" | "cursor" | "bolt" | "lovable">("cursor");

  const mcpCommand = `npx -y @awa/mcp-server`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clientConfigs = {
    cursor: {
      title: "Cursor Settings Setup",
      filePath: "~/.cursor/settings.json or Project MCP",
      code: `{\n  "mcpServers": {\n    "awa": {\n      "command": "npx",\n      "args": ["-y", "@awa/mcp-server"],\n      "env": {\n        "AWA_API_KEY": "YOUR_API_KEY"\n      }\n    }\n  }\n}`,
    },
    claude: {
      title: "Claude Desktop Config",
      filePath: "~/Library/Application Support/Claude/claude_desktop_config.json",
      code: `{\n  "mcpServers": {\n    "awa": {\n      "command": "npx",\n      "args": ["-y", "@awa/mcp-server"]\n    }\n  }\n}`,
    },
    bolt: {
      title: "Bolt.new & WebContainers",
      filePath: "bolt-mcp.config.json",
      code: `{\n  "name": "awa-mcp",\n  "transport": "stdio",\n  "command": "npx -y @awa/mcp-server"\n}`,
    },
    lovable: {
      title: "Lovable Fullstack Agents",
      filePath: "Lovable Integrations > MCP Endpoints",
      code: `Endpoint: https://api.awa.ai/mcp/v1\nHeaders: {\n  "Authorization": "Bearer YOUR_UNLIMITED_KEY"\n}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
            <span>MODEL CONTEXT PROTOCOL</span>
            <span className="text-zinc-600">•</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[10px]">NEW</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Connect AWA to{" "}
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              Any AI Coding Agent
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Directly query 500+ production prompts, animated canvas shaders, and component templates straight inside Cursor, Claude Code, Lovable, or Bolt.
          </p>
        </div>

        {/* Quick Launch Terminal Command */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>1-Click Terminal Launch</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MCP Spec 2025.1 Compliant
            </span>
          </div>

          <div className="dark-surface flex flex-col sm:flex-row items-center gap-3 bg-black/60 rounded-xl p-3 border border-zinc-800/80 font-mono text-sm">
            <code className="flex-1 text-cyan-300 select-all overflow-x-auto py-1">
              $ {mcpCommand}
            </code>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied Command!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Client Configuration Tabs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Agent Client Integration</h2>

          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
            {(["cursor", "claude", "bolt", "lovable"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 text-white dark:bg-zinc-800 dark:text-white border border-slate-700 dark:border-zinc-700 shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#141518] p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="font-semibold text-white">{clientConfigs[activeTab].title}</span>
              <span className="text-[11px] text-zinc-500">{clientConfigs[activeTab].filePath}</span>
            </div>
            <pre className="dark-surface text-xs text-cyan-300 overflow-x-auto p-3 rounded-lg bg-black/50 leading-relaxed">
              {clientConfigs[activeTab].code}
            </pre>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-5 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tool Invocation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your agent can call <code>get_template</code>, <code>search_prompts</code>, and <code>export_tokens</code> natively during generation.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-5 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live CSS & Shaders</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stream complex GLSL and CSS keyframe animations directly into your project files with zero manual copy-pasting.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-5 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Setup Friction</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Self-contained stdio process. Runs anywhere Node 18+ is present, including headless CI/CD environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
