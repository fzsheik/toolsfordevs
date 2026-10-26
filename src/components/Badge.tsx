import type { ResetEvent } from "@/lib/events";

export default function Badge({ status }: { status: ResetEvent["status"] }) {
  const ok = status === "verified";
  return (
    <span className={ok ? "badge ok" : "badge"} title={ok ? "Primary source checked by a human" : "Primary source cited by reports, not yet checked by us"}>
      {ok ? "Verified" : "Source-linked"}
    </span>
  );
}
