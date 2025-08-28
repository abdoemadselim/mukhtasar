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
        destination: process.env.NODE_ENV === "production" ? "http://api.mukhtasar.pro/ui/:path*": "http://localhost:3000/ui/:path*"
      },
    ]
  },
};

export default nextConfig;
