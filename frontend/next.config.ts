import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable React strict mode to avoid some compatibility issues
    reactStrictMode: false,
  },
  // Add output file tracing root to fix the lockfile warning
  outputFileTracingRoot: undefined,
  // Disable some experimental features that might cause issues
  serverComponentsExternalPackages: [],
};

export default nextConfig;
