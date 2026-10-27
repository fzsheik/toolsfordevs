import type { Metadata } from "next";
import Link from "next/link";
import { getEvents, stats, fmtMDY, plural } from "@/lib/events";
import { VENDORS, type VendorId } from "@/lib/site";

export const revalidate = 300;

const TITLE = "Claude vs Codex Resets: Monthly Counts and Gaps";
const DESC = "Resets per month for Claude and Codex, median gap, longest wait, and banked vs global counts, computed from our own reset log.";

export const metadata: Metadata = { title: { absolute: TITLE }, description: DESC, alternates: { canonical: "/claude-vs-codex-resets" } };

const ids: VendorId[] = ["claude", "codex"];

export default async function Page() {
  const all = await getEvents();
  const months = [...new Set(all.map((e) => e.date.slice(0, 7)))].sort();
  const count = (m: string, v: VendorId) => all.filter((e) => e.vendor === v && e.kind === "reset" && e.date.startsWith(m)).length;
  const max = Math.max(1, ...months.flatMap((m) => ids.map((v) => count(m, v))));
  const st = Object.fromEntries(await Promise.all(ids.map(async (v) => [v, await stats(v)]))) as Record<VendorId, Awaited<ReturnType<typeof stats>>>;
  const kinds = (v: VendorId) => ({ banked: all.filter((e) => e.vendor === v && e.kind === "banked").length, global: all.filter((e) => e.vendor === v && e.kind === "reset").length });
  const label = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  return (
    <article className="prose">
      <h1>Claude vs Codex resets</h1>
      <p>Computed from our own <Link href="/reset-history">reset log</Link>, regenerated at build and every few minutes. {fmtMDY(all[all.length - 1].date)} to {fmtMDY(all[0].date)}.</p>
      <h2>Resets per month</h2>
      <div className="chart" role="img" aria-label="Resets per month for Claude and Codex">
        {months.map((m) => (
          <div className="chart-row" key={m}>
            <span>{label(m)}</span>
            <div>
              {ids.map((v) => (
                <div className="bar" key={v}><i className={v} style={{ width: `${(count(m, v) / max) * 100}%` }} /><span>{VENDORS[v].name} {count(m, v)}</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h2>Gaps and totals</h2>
      <table>
        <thead><tr><th></th>{ids.map((v) => <th key={v}>{VENDORS[v].name}</th>)}</tr></thead>
        <tbody>
          <tr><td>Full resets logged</td>{ids.map((v) => <td key={v}>{kinds(v).global}</td>)}</tr>
          <tr><td>Banked grants logged</td>{ids.map((v) => <td key={v}>{kinds(v).banked}</td>)}</tr>
          <tr><td>Median gap</td>{ids.map((v) => <td key={v}>{st[v].median === null ? "n/a" : plural(st[v].median!, "day")}</td>)}</tr>
          <tr><td>Longest wait</td>{ids.map((v) => <td key={v}>{st[v].longest === null ? "n/a" : plural(st[v].longest!, "day")}</td>)}</tr>
          <tr><td>Last 30 days</td>{ids.map((v) => <td key={v}>{st[v].last30}</td>)}</tr>
          <tr><td>Last 90 days</td>{ids.map((v) => <td key={v}>{st[v].last90}</td>)}</tr>
        </tbody>
      </table>
      <p className="muted">Resets are ad hoc; there is no schedule. Counts only include what we have logged.</p>
      <p><Link href="/claude-reset">Claude tracker</Link> · <Link href="/codex-reset">Codex tracker</Link></p>
    </article>
  );
}
