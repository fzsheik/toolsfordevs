export const SITE = {
  name: "toolsfordevs",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolsfordevs.com",
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
