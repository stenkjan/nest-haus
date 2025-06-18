import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallback for Prisma client in browser environments
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  experimental: {
    // Prevent webpack chunk issues
    optimizePackageImports: ['@prisma/client'],
  },
};

export default nextConfig;
