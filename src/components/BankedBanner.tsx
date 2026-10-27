import Link from "next/link";
import { activeBanked, countdown, fmtPacific, fmtUtc } from "@/lib/events";
import { VENDORS, type VendorId } from "@/lib/site";

/** Top banner while a banked reset is still redeemable. Renders nothing otherwise. */
export default async function BankedBanner({ vendor }: { vendor?: VendorId }) {
  const active = await activeBanked(vendor);
  if (!active.length) return null;
  return (
    <div className="card banked-banner" role="status">
      {active.map((e) => (
        <p key={e.id}>
          <b>Banked reset active:</b> {VENDORS[e.vendor].name} credit granted <Link href={`${VENDORS[e.vendor].path}/${e.date}`}>{e.date}</Link> expires {fmtUtc(e.expires_at!)} ({fmtPacific(e.expires_at!)}), {countdown(e.expires_at!)} left.
        </p>
      ))}
    </div>
  );
}
