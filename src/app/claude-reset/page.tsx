import type { Metadata } from "next";
import VendorPage from "@/components/VendorPage";
import { getEvents, fmtDate } from "@/lib/events";

export const revalidate = 300;

const last = async () => (await getEvents("claude")).find((e) => e.kind === "reset");

export async function generateMetadata(): Promise<Metadata> {
  const l = await last();
  return {
    title: "Claude reset tracker: last limit reset and news",
    description: l
      ? `Did Claude reset? Last Claude usage limit reset was ${fmtDate(l.date)}. Full history, sources and a rough estimate of the next reset.`
      : "Claude usage limit reset news, history and estimates.",
    alternates: { canonical: "/claude-reset" },
  };
}

export default function Page() {
  return <VendorPage vendor="claude" />;
}
