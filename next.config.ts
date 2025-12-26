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
    // Safari-compatible CSP: Allow HTTPS sources for Vercel Blob Storage
    contentSecurityPolicy: "default-src 'self' https:; script-src 'none'; sandbox;",

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
    // Configure allowed quality values (required for Next.js 16+)
    qualities: [75, 85, 90, 100],
  },
  webpack: (config, { isServer }) => {
    // Ignore markdown files to prevent webpack from trying to bundle them
    // This fixes the build error where webpack tries to parse .md files
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.md$/,
      })
    );

    if (!isServer) {
      // Fallback for Prisma client in browser environments
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // Exclude server-only modules from client bundle
      config.externals = {
        ...config.externals,
        googleapis: 'googleapis',
        'service-account-key.json': 'service-account-key.json',
      };

      // CRITICAL: Aggressive bundle splitting to reduce main bundle size
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 150000, // Reduced from 200KB to 150KB
        cacheGroups: {
          // Google APIs in separate chunk (largest dependency)
          googleapis: {
            test: /[\\/]node_modules[\\/]googleapis[\\/]/,
            name: 'googleapis',
            chunks: 'async', // Only load when needed
            priority: 30,
            maxSize: 100000,
          },
          // Chart.js in separate chunk
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|chartjs-adapter-date-fns)[\\/]/,
            name: 'charts',
            chunks: 'async', // Only load when needed
            priority: 25,
            maxSize: 100000,
          },
          // DnD Kit in separate chunk
          dndkit: {
            test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            name: 'dndkit',
            chunks: 'all',
            priority: 22,
            maxSize: 100000,
          },
          // Motion/Framer Motion in separate chunk
          motion: {
            test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
            name: 'motion',
            chunks: 'async', // Only load when needed
            priority: 20,
            maxSize: 100000,
          },
          // Prisma client separate
          prisma: {
            test: /[\\/]node_modules[\\/]@prisma[\\/]/,
            name: 'prisma',
            chunks: 'all',
            priority: 20,
            maxSize: 80000,
          },
          // Separate vendor libraries (smaller chunks)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 120000, // Reduced from 200KB
          },
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            maxSize: 100000, // Reduced from 150KB
          },
        },
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
    optimizePackageImports: ['@prisma/client', 'googleapis', 'motion', 'framer-motion', '@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
    // Tree shake unused exports
    optimizeServerReact: true,
  },
  // Enable build cache cleaning
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
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
