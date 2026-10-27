import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE } from "@/lib/site";
import BrandMark from "@/components/BrandMark";
import VendorLogo from "@/components/VendorLogo";
import FooterCredit from "@/components/FooterCredit";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-head", weight: ["600", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  title: { default: SITE.tagline, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  openGraph: { siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Claude and Codex resets" href="/feed.xml" />
      </head>
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
          <FooterCredit />
          <div className="footer-links">
            <Link href="/claude-usage-limits">Claude usage limits</Link>
            <Link href="/claude-limit-reset">Claude limit reset</Link>
            <Link href="/codex-usage-limits">Codex usage limits</Link>
            <Link href="/codex-banked-reset">Codex banked reset</Link>
            <Link href="/claude-vs-codex-resets">Claude vs Codex</Link>
            <Link href="/changes">Limit changes</Link>
          </div>
          <p>Independent. Not affiliated with Anthropic or OpenAI. Claude is a trademark of Anthropic; Codex and OpenAI are trademarks of OpenAI. Every entry links its sources; &quot;Source-linked&quot; means the primary link is cited but not yet checked by us.</p>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
