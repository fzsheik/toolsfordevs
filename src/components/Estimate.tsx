import { estimate } from "@/lib/events";
import { VENDORS, type VendorId } from "@/lib/site";
import VendorLogo from "./VendorLogo";

const LEVEL = { low: 1, medium: 2 } as const;

export default async function Estimate({ vendor }: { vendor: VendorId }) {
  const e = await estimate(vendor);
  const v = VENDORS[vendor];
  if (!e) return <p className="estimate-empty">Not enough {v.name} resets to see a rhythm yet.</p>;
  const axis = Math.max(e.since, e.median * 2, 1);
  const gaps = [...e.gaps].reverse();
  const maxGap = Math.max(...gaps);
  const label = {
    fresh: "Just reset",
    waiting: `Usually ${e.left} more days`,
    due: "Due any day now",
    overdue: `${e.behind} days overdue`,
  }[e.verdict];
  return (
    <section className={`card est v-${vendor}`} aria-labelledby={`est-${vendor}`}>
      <div className="est-head">
        <VendorLogo vendor={vendor} size={28} />
        <h2 id={`est-${vendor}`}>{v.name} rhythm</h2>
        <span className={`meter lv${LEVEL[e.confidence]}`} title={`${e.confidence} confidence`}>
          <i /><i /><i />
          <b>{e.confidence}</b>
        </span>
      </div>
      <p className="est-big">Every ~{e.median}<small>days</small></p>
      <p className={`est-chip ${e.verdict}`}>{label}</p>
      <div className="wait" role="img" aria-label={`${e.since} days since the last reset, usual gap ${e.median} days`}>
        <span className={`fill ${e.verdict}`} style={{ width: `${(e.since / axis) * 100}%` }} />
        <span className="usual" style={{ left: `${(e.median / axis) * 100}%` }}><em>usual</em></span>
      </div>
      <div className="est-range"><span>last reset</span><span>{e.since} days ago</span></div>
      <div className="gapbars" aria-label={`Days between the last ${gaps.length} resets`}>
        {gaps.map((g, i) => (
          <span key={i} style={{ height: `${Math.max((g / maxGap) * 100, 8)}%` }}><b>{g}d</b></span>
        ))}
      </div>
      <p className="est-note">Past gaps, newest on the right. Resets are random, so this is a gauge, not a promise.</p>
    </section>
  );
}
