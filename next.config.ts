import type { NextConfig } from "next";
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  images: {
    // Enable SVG placeholders
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1mkowktdsbm6ra0z.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      }
    ],
    
    // Optimize image loading
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
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
    
    // Ensure Prisma client is properly bundled for Vercel
    if (isServer) {
      config.externals = [...(config.externals || []), '_http_common'];
      
      // Add Prisma plugin for Vercel deployment
      config.plugins = [...(config.plugins || []), new PrismaPlugin()];
      
      // Ensure Prisma binaries are included in serverless functions
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '.prisma/client/index-browser': './node_modules/.prisma/client/index.js',
        },
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
