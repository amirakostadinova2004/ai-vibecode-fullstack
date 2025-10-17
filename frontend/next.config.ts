import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode in production
  reactStrictMode: process.env.NODE_ENV === 'production',
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['api.qrserver.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Build optimizations
  swcMinify: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
