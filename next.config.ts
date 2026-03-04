import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now().toString();
  },
};

export default nextConfig;
