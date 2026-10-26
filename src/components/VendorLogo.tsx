import Image from "next/image";
import type { VendorId } from "@/lib/site";

/** Reads /public/logos/<vendor>.svg. Swap those files for the official logos from each company's brand page. */
export default function VendorLogo({ vendor, size = 32 }: { vendor: VendorId; size?: number }) {
  return <Image src={`/logos/${vendor}.svg`} alt="" width={size} height={size} unoptimized className="vlogo" />;
}
