#!/usr/bin/env node
// Usage: did-it-reset [claude|codex] [--line]   (--line = one short line, for a Claude Code statusline)
const SITE = "https://toolsfordevs.app";
const args = process.argv.slice(2);
const only = args.find((a) => a === "claude" || a === "codex");
const res = await fetch(`${SITE}/resets.json`);
if (!res.ok) throw new Error(`resets.json ${res.status}`);
const { events } = await res.json();
const day = 86_400_000;
const out = [];
for (const v of ["claude", "codex"].filter((x) => !only || x === only)) {
  const last = events.find((e) => e.vendor === v && e.kind === "reset");
  if (!last) { out.push(`${v}: none logged`); continue; }
  const t = last.announced_at ?? `${last.date}T00:00:00Z`;
  const d = Math.floor((Date.now() - Date.parse(`${last.date}T00:00:00Z`)) / day);
  out.push(`${v}: ${d === 0 ? "reset today" : d === 1 ? "1 day ago" : `${d} days ago`} (${t.slice(0, 16).replace("T", " ")} UTC)`);
}
console.log(args.includes("--line") ? out.join(" | ") : [...out, `More: ${SITE}`].join("\n"));
