import type { Metadata } from "next";
import VendorPage from "@/components/VendorPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Did Claude Reset Today? Claude Code Usage Limit Reset Tracker" },
  description: "Did Claude reset today? Last Claude usage limit reset, banked Reset for free status and expiry, and every Anthropic reset since April 2026 with source posts.",
  alternates: { canonical: "/claude-reset" },
};

export default function Page() {
  return <VendorPage vendor="claude" />;
}
