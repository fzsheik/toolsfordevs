import type { Metadata } from "next";
import VendorPage from "@/components/VendorPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Did Codex Reset Today? OpenAI Codex Usage Limit Reset Tracker" },
  description: "Did Codex reset today? Last OpenAI Codex usage limit reset with time in UTC, every Tibo reset post, banked resets, and how often Codex resets lately.",
  alternates: { canonical: "/codex-reset" },
};

export default function Page() {
  return <VendorPage vendor="codex" />;
}
