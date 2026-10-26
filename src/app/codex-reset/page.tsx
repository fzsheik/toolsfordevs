import type { Metadata } from "next";
import VendorPage from "@/components/VendorPage";
import { getEvents, fmtDate } from "@/lib/events";

export const revalidate = 300;

const last = async () => (await getEvents("codex")).find((e) => e.kind === "reset");

export async function generateMetadata(): Promise<Metadata> {
  const l = await last();
  return {
    title: "Codex reset tracker: last limit reset and news",
    description: l
      ? `Did Codex reset? Last Codex usage limit reset was ${fmtDate(l.date)}. Full history, sources and a rough estimate of the next reset.`
      : "Codex usage limit reset news, history and estimates.",
    alternates: { canonical: "/codex-reset" },
  };
}

export default function Page() {
  return <VendorPage vendor="codex" />;
}
