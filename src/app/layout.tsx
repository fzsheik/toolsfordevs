import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE } from "@/lib/site";
import BrandMark from "@/components/BrandMark";
import VendorLogo from "@/components/VendorLogo";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-head", weight: ["600", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: SITE.tagline, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <nav aria-label="Main navigation">
            <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
              <BrandMark />
              <span>tools<span className="brand-for">for</span>devs</span>
            </Link>
            <div className="nav-links">
              <Link href="/claude-reset"><VendorLogo vendor="claude" size={18} />Claude</Link>
              <Link href="/codex-reset"><VendorLogo vendor="codex" size={18} />Codex</Link>
              <Link href="/reset-history">History <span aria-hidden="true">↗</span></Link>
            </div>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <Link href="/" className="brand"><BrandMark size={28} /><span>{SITE.name}</span></Link>
            <span className="footer-note">Small tools. More headroom.</span>
            <a href="/feed.xml">RSS <span aria-hidden="true">↗</span></a>
          </div>
          <p>Data: <a href="https://codex-reset.com/" rel="noopener" target="_blank">codex-reset.com</a> and <a href="https://claude-resets.com/" rel="noopener" target="_blank">claude-resets.com</a>, merged with our own log.</p>
          <p>Independent. Not affiliated with Anthropic or OpenAI. Claude is a trademark of Anthropic; Codex and OpenAI are trademarks of OpenAI. Every entry links its sources; &quot;Source-linked&quot; means the primary link is cited but not yet checked by us.</p>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
