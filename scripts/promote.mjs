// Promotes strong reset candidates (those with an X post id) into src/data/events.json
// as status "reported". Wording is ours, not the community trackers': the page links the primary
// post for the exact text. Review the resulting diff/PR before merging.
import { readFile, writeFile } from "node:fs/promises";

const CANDIDATES = new URL("../src/data/candidates.json", import.meta.url);
const EVENTS = new URL("../src/data/events.json", import.meta.url);

// "reset ... limits/usage/rate" (and the reverse, plus common typos like "reseting"), "usage reset", "full/double reset", "reset button".
const STRONG = /\bres?et(?:s|ed|ing|ting)?\b[^.]{0,60}\b(?:limits?|usage|rate)|\b(?:limits?|usage)\b[^.]{0,60}\bres?et(?:s|ed|ting|ing)?\b|\breset (?:has been |all |is )?(?:propagated|landed)|resets? all propagated|\b(?:usage|limit|full|double)\s+resets?\b|reset button|\breset day\b|\b(?:today is|it.?s) a reset\b|\band reset\b[.!, ]|\banother reset\b|\bresets? (?:everyone|for all)/i;
// Grants of banked credits, negations and questions are not resets.
const EXCLUDE = /don.?t (?:just )?reset|\?\s*$/i;
// A banked reset is a credit users redeem later, not an immediate flush. Logged separately.
const BANKED = /\bbanked resets?\b/i;

const candidates = JSON.parse(await readFile(CANDIDATES, "utf8"));
const events = JSON.parse(await readFile(EVENTS, "utf8"));
const taken = new Set(events.map((e) => `${e.vendor}:${e.date}`));
const postIds = new Set(events.map((e) => e.postId).filter(Boolean));

const keep = [];
let added = 0;
for (const c of candidates) {
  // A post that flushes limits AND mentions a banked credit is a full reset.
  const banked = BANKED.test(c.snippet) && !STRONG.test(c.snippet.replace(/\bbanked resets?\b/gi, ""));
  const ok = c.postId && c.date && !c.reviewed && (BANKED.test(c.snippet) || STRONG.test(c.snippet)) && !EXCLUDE.test(c.snippet);
  const day = `${c.vendor}:${c.date}`;
  if (!ok || taken.has(day) || postIds.has(c.postId)) {
    keep.push(c);
    continue;
  }
  const account = c.source.url.match(/x\.com\/([^/]+)\/status/)?.[1] ?? (c.vendor === "claude" ? "ClaudeDevs" : "thsottiaux");
  const name = c.vendor === "claude" ? "Claude" : "Codex";
  events.push({
    id: `${c.vendor}-${c.date}`,
    vendor: c.vendor,
    date: c.date,
    postId: c.postId,
    kind: banked ? "banked" : "reset",
    title: banked ? `@${account} grants a banked ${name} reset` : `@${account} announces a ${name} usage limit reset`,
    summary: banked
      ? `@${account} posted about a banked ${name} reset: a credit you redeem later, not an immediate flush of your limits. Read the linked post for who got it.`
      : `@${account} posted that ${name} usage limits were reset. Read the linked post for the exact wording and which limits and plans were covered.`,
    scope: banked ? "Banked reset credit (see post)" : "Usage limits (see post)",
    status: "reported",
    ...(c.quote ? { quote: c.quote } : {}),
    sources: [
      { label: `@${account} on X (primary)`, url: c.source.url },
      { label: `Spotted via ${c.via}`, url: c.via === "codex-reset.com" ? "https://codex-reset.com/" : "https://claude-resets.com/" },
    ],
  });
  taken.add(day);
  postIds.add(c.postId);
  added++;
}

if (added) {
  await writeFile(EVENTS, JSON.stringify(events, null, 2) + "\n");
  await writeFile(CANDIDATES, JSON.stringify(keep, null, 2) + "\n");
}
console.log(`promoted ${added}, ${keep.length} candidates left for manual review`);
