import Link from "next/link";
import type { VendorId } from "@/lib/site";

export const GUIDES: Record<VendorId, { href: string; label: string }[]> = {
  claude: [
    { href: "/claude-reset", label: "Claude reset tracker" },
    { href: "/claude-usage-limits", label: "How Claude usage limits work" },
    { href: "/claude-limit-reset", label: "Claude limit reset: Reset for free" },
  ],
  codex: [
    { href: "/codex-reset", label: "Codex reset tracker" },
    { href: "/codex-usage-limits", label: "How Codex usage limits work" },
    { href: "/codex-banked-reset", label: "Codex banked reset" },
  ],
};

/** Cross-links between a tracker and its guides; the current page is left out. */
export default function GuideLinks({ vendor, current }: { vendor: VendorId; current?: string }) {
  return (
    <nav className="guide-links" aria-label={`${vendor} guides`}>
      <b>Related:</b>{" "}
      {GUIDES[vendor].filter((g) => g.href !== current).map((g, i) => (
        <span key={g.href}>{i ? " · " : ""}<Link href={g.href}>{g.label}</Link></span>
      ))}
    </nav>
  );
}
