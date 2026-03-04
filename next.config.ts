import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => {
    return 'my-build-id-' + Date.now();
  },
  // Không có basePath hay assetPrefix ở đây nữa
};

export default nextConfig;
