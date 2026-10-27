import Link from "next/link";
import type { ResetEvent } from "@/lib/events";

export default function Badge({ status }: { status: ResetEvent["status"] }) {
  const ok = status === "verified";
  return (
    <Link href="/reset-history#how-we-verify" className={ok ? "badge ok" : "badge"} title={ok ? "Primary source checked by a human. How we verify." : "Primary source cited by reports, not yet checked by us. How we verify."}>
      {ok ? "Verified" : "Source-linked"}
    </Link>
  );
}
