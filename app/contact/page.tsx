"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
            <span>GET IN TOUCH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact AWA
          </h1>

          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Questions regarding our MCP server, template licensing, or enterprise AI workflows? We typically respond within 4 hours.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121316] p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Thank you, {form.name || "friend"}. Our engineering team has received your inquiry and will reply to {form.email || "your email"}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-full bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Praveen"
                    className="w-full bg-[#16171c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Your Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="praveen@example.com"
                    className="w-full bg-[#16171c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Inquiry regarding custom MCP tool integration"
                  className="w-full bg-[#16171c] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help your team?"
                  className="w-full bg-[#16171c] border border-zinc-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
