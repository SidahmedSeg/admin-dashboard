import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Disable Turbopack to use the traditional webpack-based dev server
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
