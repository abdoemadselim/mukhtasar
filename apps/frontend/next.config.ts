import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  transpilePackages: ["@mukhtasar/shared"],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.mukhtasar.pro/ui/:path*',
      },
    ];
  },
};

export default nextConfig;
