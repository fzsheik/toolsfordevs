/** Accepts "toolsfordevs.app", "https://toolsfordevs.app/" etc. and always returns an origin with a scheme. */
function siteUrl(raw?: string) {
  const v = raw?.trim();
  if (!v) return "https://toolsfordevs.app";
  return (/^https?:\/\//i.test(v) ? v : `https://${v}`).replace(/\/+$/, "");
}

export const SITE = {
  name: "toolsfordevs",
  url: siteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  tagline: "Live Claude and Codex usage limit reset tracker",
};

export type VendorId = "claude" | "codex";

export const VENDORS: Record<
  VendorId,
  { id: VendorId; name: string; product: string; owner: string; path: string }
> = {
  claude: {
    id: "claude",
    name: "Claude",
    product: "Claude Code",
    owner: "Anthropic",
    path: "/claude-reset",
  },
  codex: {
    id: "codex",
    name: "Codex",
    product: "OpenAI Codex",
    owner: "OpenAI",
    path: "/codex-reset",
  },
};
