import { BRAND } from "@/lib/brand";

/** Lime tile with a terminal prompt, hard offset shadow. */
export default function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="52" height="52" rx="12" fill={BRAND.ink} />
      <rect x="3" y="3" width="52" height="52" rx="12" fill={BRAND.lime} stroke={BRAND.ink} strokeWidth="4" />
      <path d={BRAND.markPath} stroke={BRAND.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
