import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old Aug 25 entry was a reply about the Aug 24 reset, not a separate reset.
      { source: "/codex-reset/2026-08-25", destination: "/codex-reset/2026-08-24", statusCode: 301 },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.toolsfordevs.app" }],
        destination: "https://toolsfordevs.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
