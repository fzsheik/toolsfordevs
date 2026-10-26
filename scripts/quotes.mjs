// Fills `quote` (verbatim post text) on events whose X post appears in codex-reset.com's public feed.
// Their terms: identify ourselves, poll gently, credit them where the data is shown (PostCard does).
import { readFile, writeFile } from "node:fs/promises";

const EVENTS = new URL("../src/data/events.json", import.meta.url);
const UA = "toolsfordevs-reset-watcher/1.0 (+https://toolsfordevs.com)";
const events = JSON.parse(await readFile(EVENTS, "utf8"));

const res = await fetch("https://codex-reset.com/api/feed", { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20_000) });
if (!res.ok) throw new Error(`feed ${res.status}`);
const feed = await res.json();
const byId = new Map((feed.tweets ?? []).map((t) => [String(t.id), t]));

let n = 0;
for (const e of events) {
  const t = e.postId && !e.quote ? byId.get(e.postId) : null;
  if (t?.text) {
    e.quote = { text: t.text, via: "codex-reset.com" };
    n++;
  }
}
if (n) await writeFile(EVENTS, JSON.stringify(events, null, 2) + "\n");
console.log(`added ${n} quote(s); ${events.filter((e) => e.postId && !e.quote).length} post-backed events still without text`);
