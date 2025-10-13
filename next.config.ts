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

      // CRITICAL: Bundle splitting to reduce main bundle size
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 150000, // Reduced from 200KB to 150KB
        cacheGroups: {
          // React and Next.js framework
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            maxSize: 120000,
          },
          // Heavy libraries in separate chunks
          googleapis: {
            test: /[\\/]node_modules[\\/]googleapis[\\/]/,
            name: 'googleapis',
            chunks: 'async', // Only load when needed
            priority: 30,
            maxSize: 100000,
          },
          // Motion/Framer Motion in separate chunk
          motion: {
            test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
            name: 'motion',
            chunks: 'async', // Only load when needed
            priority: 25,
            maxSize: 100000,
          },
          // Chart.js separate
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|chartjs-adapter-date-fns)[\\/]/,
            name: 'charts',
            chunks: 'async',
            priority: 25,
            maxSize: 80000,
          },
          // DnD Kit separate
          dnd: {
            test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
            name: 'dnd',
            chunks: 'async',
            priority: 25,
            maxSize: 60000,
          },
          // Prisma client separate
          prisma: {
            test: /[\\/]node_modules[\\/]@prisma[\\/]/,
            name: 'prisma',
            chunks: 'all',
            priority: 20,
            maxSize: 80000,
          },
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 120000,
          },
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            maxSize: 100000,
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
    optimizePackageImports: ['@prisma/client', 'googleapis', 'motion', 'framer-motion'],
    // Tree shake unused exports
    optimizeServerReact: true,
    // Faster builds
    webpackBuildWorker: true,
    // Faster TypeScript checking
    typedRoutes: false,
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
