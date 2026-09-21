import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoProvider } from "@/lib/demo-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DemoControls } from "@/components/demo-controls";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AWA — AI Creation Guide Platform",
  description:
    "Instant expert prompts, matched AI tools with one-line rationales, and short usage steps for Midjourney, Runway, Sora, and generative AI creation.",
  keywords: ["AI prompts", "Midjourney prompt", "Runway Gen-3", "Sora prompt", "AI creation guide", "prompt templates"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('awa-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <ThemeProvider>
          <DemoProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <DemoControls />
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
