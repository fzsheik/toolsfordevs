// Pings IndexNow with hub pages plus any sitemap URL modified in the last HOURS hours.
// Run after a deploy (see .github/workflows/indexnow.yml). The key file lives in /public.
const HOST = "toolsfordevs.app";
const KEY = "3fc3759d4c2d242ad0f56a69ada7d03c";
const HOURS = Number(process.env.HOURS ?? 36);

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const cutoff = Date.now() - HOURS * 3_600_000;
const recent = [...xml.matchAll(/<url>(.*?)<\/url>/gs)]
  .map((m) => ({ loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1], mod: Date.parse(m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? "") }))
  .filter((u) => u.loc && u.mod >= cutoff)
  .map((u) => u.loc);
const hubs = ["", "/claude-reset", "/codex-reset", "/reset-history"].map((p) => `https://${HOST}${p}`);
const urlList = [...new Set([...hubs, ...recent])];
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow ${res.status}: submitted ${urlList.length} URL(s)`);
if (res.status >= 400) process.exit(1);
