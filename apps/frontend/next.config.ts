import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  transpilePackages: ["@mukhtasar/shared"],
  // basePath: '/pages',
  async rewrites() {
    return [
      // Proxy UI routes (public stuff)
      {
        source: "/api/:path*",
        destination: "http://api.mukhtasar.pro/ui/:path*"
      },
    ]
  },
};

export default nextConfig;
