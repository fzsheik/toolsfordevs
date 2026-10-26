// Watches official public sources for limit-reset language and writes
// *candidates* to src/data/candidates.json. A human reviews each one and
// promotes it into events.json. Nothing here is published automatically.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Community trackers are used as *signals* only: we take the X post id, then a human checks the post itself.
// Their terms: identify ourselves via User-Agent, poll at most once a minute, credit when showing their data.
const UA = "toolsfordevs-reset-watcher/1.0 (+https://toolsfordevs.com)";

const SOURCES = [
  { vendor: "codex", kind: "html", url: "https://learn.chatgpt.com/docs/changelog", label: "Codex changelog" },
  { vendor: "claude", kind: "rss", url: "https://status.claude.com/history.rss", label: "Claude status" },
];
// Matches "reset ... limit" or "limit ... reset" within one sentence.
const HIT = /(?:\bresets?\b[^.\n]{0,80}\b(?:limits?|usage|quota)\b)|(?:\b(?:limits?|usage|quota)\b[^.\n]{0,80}\bresets?\b)/i;

// Commit-style changelog lines ("feat(tui): ...", "[app-server] ...") are not announcements.
const NOISE = /^(?:\[|(?:feat|fix|chore|refactor|docs|test)(?:\(|:))/i;

const CANDIDATES = new URL("../src/data/candidates.json", import.meta.url);
const EVENTS = new URL("../src/data/events.json", import.meta.url);

const readJson = async (u, fallback) => {
  try {
    return JSON.parse(await readFile(u, "utf8"));
  } catch {
    return fallback;
  }
};

const strip = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!\[CDATA\[|\]\]>/g, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');

function snippets(text) {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 20 && l.length < 400 && !NOISE.test(l) && HIT.test(l));
}

async function fetchSource(src) {
  const res = await fetch(src.url, {
    redirect: "follow",
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

const known = await readJson(CANDIDATES, []);
const events = await readJson(EVENTS, []);
const seen = new Set(known.map((c) => c.id));
const eventText = JSON.stringify(events).toLowerCase();
const found = [];
let failed = 0;

for (const src of SOURCES) {
  try {
    const body = await fetchSource(src);
    for (const s of snippets(strip(body))) {
      const id = createHash("sha1").update(src.url + s).digest("hex").slice(0, 12);
      if (seen.has(id) || eventText.includes(s.toLowerCase().slice(0, 60))) continue;
      found.push({ id, vendor: src.vendor, source: { label: src.label, url: src.url }, snippet: s, detectedAt: new Date().toISOString(), reviewed: false });
      seen.add(id);
    }
    console.log(`ok   ${src.label}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${src.label}: ${e.message}`);
  }
}

// --- community trackers (signal only) ---
const postDate = (id) => new Date(Number((BigInt(id) >> 22n) + 1288834974657n)).toISOString().slice(0, 10);
const knownPosts = new Set(events.map((e) => e.postId).filter(Boolean));
const knownDay = new Set(events.map((e) => `${e.vendor}:${e.date}`));
const addPost = (vendor, id, url, hint, via, quote) => {
  if (!/^\d{15,20}$/.test(id) || seen.has(id) || knownPosts.has(id) || knownDay.has(`${vendor}:${postDate(id)}`)) return;
  seen.add(id);
  found.push({ id, vendor, postId: id, date: postDate(id), source: { label: `X post (via ${via})`, url }, snippet: hint, via, ...(quote ? { quote } : {}), detectedAt: new Date().toISOString(), reviewed: false });
};
const getJson = async (url) => {
  const res = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

try {
  const j = await getJson("https://claude-resets.com/data/resets.json");
  for (const [vendor, prov] of Object.entries(j.providers ?? {}))
    for (const ev of prov.events ?? []) if (ev.kind === "reset") addPost(vendor, String(ev.id), ev.url, ev.note ?? "", "claude-resets.com");
  console.log("ok   claude-resets.com");
} catch (e) {
  failed++;
  console.error(`FAIL claude-resets.com: ${e.message}`);
}
try {
  const j = await getJson("https://codex-reset.com/api/feed");
  for (const t of j.tweets ?? [])
    if (!t.is_reply && (t.explicit_reset_claim || t.reset_verification_candidate)) addPost("codex", String(t.id), t.url, t.text ?? "", "codex-reset.com", t.text ? { text: t.text, via: "codex-reset.com" } : undefined);
  console.log("ok   codex-reset.com");
} catch (e) {
  failed++;
  console.error(`FAIL codex-reset.com: ${e.message}`);
}

if (found.length) {
  await writeFile(CANDIDATES, JSON.stringify([...found, ...known], null, 2) + "\n");
  console.log(`${found.length} new candidate(s):`);
  for (const c of found) console.log(`- [${c.vendor}] ${c.date ?? ""} ${c.snippet.slice(0, 110)}`);
} else {
  console.log("no new candidates");
}
if (failed >= SOURCES.length + 2) process.exit(1);
