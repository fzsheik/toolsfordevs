import type { ResetEvent } from "./events";
import type { VendorId } from "./site";

// Free community trackers, read at request time (cached + revalidated, so ~1 hit per 5 min each).
// Terms (codex-reset.com): identify ourselves via User-Agent, <=1 poll/min, credit the source where shown.
const UA = "toolsfordevs-reset-site/1.0 (+https://toolsfordevs.com)";
const REVALIDATE = 300;

const STRONG = /\bres?et(?:s|ed|ing|ting)?\b[^.]{0,60}\b(?:limits?|usage|rate)|\b(?:limits?|usage)\b[^.]{0,60}\bres?et(?:s|ed|ting|ing)?\b|\breset (?:has been |all |is )?(?:propagated|landed)|resets? all propagated|\b(?:usage|limit|full|double)\s+resets?\b|reset button|\breset day\b|\b(?:today is|it.?s) a reset\b|\band reset\b[.!, ]|\banother reset\b|\bresets? (?:everyone|for all)/i;
const EXCLUDE = /don.?t (?:just )?reset|\?\s*$/i;
const BANKED = /\bbanked resets?\b/i;

const postDate = (id: string) =>
  new Date(Number((BigInt(id) >> BigInt(22)) + BigInt(1288834974657))).toISOString().slice(0, 10);

async function getJson(url: string): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = await fetch(url, { headers: { "user-agent": UA }, next: { revalidate: REVALIDATE }, signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.json();
}

const NAME: Record<VendorId, string> = { claude: "Claude", codex: "Codex" };

function build(vendor: VendorId, id: string, url: string, via: "claude-resets.com" | "codex-reset.com", text: string, banked: boolean): ResetEvent {
  const account = url.match(/x\.com\/([^/]+)\/status/)?.[1] ?? (vendor === "claude" ? "ClaudeDevs" : "thsottiaux");
  const name = NAME[vendor];
  const date = postDate(id);
  return {
    id: `${vendor}-${date}`,
    vendor,
    date,
    postId: id,
    kind: banked ? "banked" : "reset",
    title: banked ? `@${account} grants a banked ${name} reset` : `@${account} announces a ${name} usage limit reset`,
    summary: banked
      ? `@${account} posted about a banked ${name} reset: a credit you redeem later, not an immediate flush of your limits. Read the linked post for who got it.`
      : `@${account} posted that ${name} usage limits were reset. Read the linked post for the exact wording and which limits and plans were covered.`,
    scope: banked ? "Banked reset credit (see post)" : "Usage limits (see post)",
    status: "reported",
    ...(text ? { quote: { text, via } } : {}),
    sources: [
      { label: `@${account} on X (primary)`, url },
      { label: `Spotted via ${via}`, url: `https://${via}/` },
    ],
  };
}

async function fromClaudeResets(): Promise<ResetEvent[]> {
  const j = await getJson("https://claude-resets.com/data/resets.json");
  const out: ResetEvent[] = [];
  for (const [vendor, prov] of Object.entries<any>(j.providers ?? {})) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (vendor !== "claude" && vendor !== "codex") continue;
    for (const ev of prov.events ?? [])
      if (ev.kind === "reset" && /^\d{15,20}$/.test(String(ev.id)) && ev.url)
        out.push(build(vendor, String(ev.id), ev.url, "claude-resets.com", "", false));
  }
  return out;
}

async function fromCodexReset(): Promise<ResetEvent[]> {
  const j = await getJson("https://codex-reset.com/api/feed");
  const out: ResetEvent[] = [];
  for (const t of j.tweets ?? []) {
    const text: string = t.text ?? "";
    const id = String(t.id);
    if (t.is_reply || !/^\d{15,20}$/.test(id) || !t.url) continue;
    if (!(t.explicit_reset_claim || t.reset_verification_candidate)) continue;
    if (EXCLUDE.test(text) || !(BANKED.test(text) || STRONG.test(text))) continue;
    const banked = BANKED.test(text) && !STRONG.test(text.replace(/\bbanked resets?\b/gi, ""));
    out.push(build("codex", id, t.url, "codex-reset.com", text, banked));
  }
  return out;
}

/** Never throws: if a tracker is down we just fall back to our committed data. */
export async function liveEvents(): Promise<ResetEvent[]> {
  const results = await Promise.allSettled([fromClaudeResets(), fromCodexReset()]);
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}
