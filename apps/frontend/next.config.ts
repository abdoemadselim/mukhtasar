import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  transpilePackages: ["@mukhtasar/shared"],
};

export default nextConfig;
