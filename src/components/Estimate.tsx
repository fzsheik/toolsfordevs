import { stats, plural } from "@/lib/events";
import { VENDORS, type VendorId } from "@/lib/site";
import VendorLogo from "./VendorLogo";

export default async function Estimate({ vendor }: { vendor: VendorId }) {
  const e = await stats(vendor);
  const v = VENDORS[vendor];
  if (e.median === null) return <p className="estimate-empty">Not enough {v.name} resets to see a rhythm yet.</p>;
  const gaps = e.gaps.slice(0, 8).reverse();
  const maxGap = Math.max(...gaps, 1);
  return (
    <section className={`card est v-${vendor}`} aria-labelledby={`est-${vendor}`}>
      <div className="est-head">
        <VendorLogo vendor={vendor} size={28} />
        <h2 id={`est-${vendor}`}>{v.name} rhythm</h2>
      </div>
      <p className="est-big">Median gap {e.median}<small>{e.median === 1 ? "day" : "days"}</small></p>
      <p className="est-chip waiting">{plural(e.last30, "reset")} in the last 30 days · {plural(e.last90, "reset")} in the last 90 days</p>
      <div className="gapbars" aria-label={`Days between the last ${gaps.length} resets`}>
        {gaps.map((g, i) => (
          <span key={i} style={{ height: `${Math.max((g / maxGap) * 100, 8)}%` }}><b>{g}d</b></span>
        ))}
      </div>
      <p className="est-note">Gaps between the last {gaps.length} logged resets, newest on the right. Resets are ad hoc; there is no schedule.</p>
    </section>
  );
}
