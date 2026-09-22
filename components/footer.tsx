import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-awa-border bg-awa-dark/95 py-12 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="inline-flex items-center group">
                <img
                  src="/logo/logolight.png"
                  alt="AWA"
                  className="h-6 w-auto object-contain block dark:hidden"
                />
                <img
                  src="/logo/logodark.png"
                  alt="AWA"
                  className="h-6 w-auto object-contain hidden dark:block"
                />
              </Link>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider font-mono">
                GUIDE
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              The AI Creation Guide Platform. Instant expert-authored prompts, matched AI tools with one-line rationales, and step-by-step guidance for Midjourney, Runway, Sora, and modern creative AI.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>
                <strong>Product Boundary:</strong> AWA prepares expert prompts and tool workflows. Final rendering is executed on external AI tools by the user.
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Creation Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/cat-image-gen" className="hover:text-indigo-300 transition-colors">
                  Image Generation
                </Link>
              </li>
              <li>
                <Link href="/categories/cat-video-gen" className="hover:text-indigo-300 transition-colors">
                  Video Generation
                </Link>
              </li>
              <li>
                <Link href="/categories/cat-website-making" className="hover:text-indigo-300 transition-colors">
                  Website Making
                </Link>
              </li>
              <li>
                <Link href="/categories/cat-slides-presentations" className="hover:text-indigo-300 transition-colors">
                  Slides & Presentations
                </Link>
              </li>
              <li>
                <Link href="/categories/cat-poster-design" className="hover:text-indigo-300 transition-colors">
                  Poster & Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform / Demo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform Demo
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-indigo-300 transition-colors">
                  Sign In / Sign Up
                </Link>
              </li>
              <li>
                <Link href="/unlimited" className="hover:text-indigo-300 transition-colors">
                  Subscription Plans (₹199/yr)
                </Link>
              </li>
              <li>
                <Link href="/credits" className="hover:text-indigo-300 transition-colors">
                  Buy AI Credits
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                  Administrator Portal <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-300 transition-colors">
                  User Account & Devices
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} AWA Platform. UI-Only Demonstration Build.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with Next.js & Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
