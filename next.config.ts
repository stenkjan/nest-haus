import type { NextConfig } from "next";
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

// Bundle analyzer for development
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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

      // Simplified bundle splitting - avoid complex configurations that can cause hanging
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Ensure Prisma client is properly bundled for Vercel
    if (isServer) {
      config.externals = [...(config.externals || []), '_http_common'];

      // Add Prisma plugin for Vercel deployment
      config.plugins = [...(config.plugins || []), new PrismaPlugin()];

      // Externalize heavy server-only dependencies
      config.externals.push({
        'googleapis': 'commonjs googleapis',
        'node-cron': 'commonjs node-cron',
        'ical': 'commonjs ical',
        'node-ical': 'commonjs node-ical',
        'jsdom': 'commonjs jsdom',
        'isomorphic-dompurify': 'commonjs isomorphic-dompurify'
      });

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
    // Tree shake unused exports
    optimizeServerReact: true,
  },
  // Allow cross-origin requests from local network
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
