import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Dev-only rewrites to avoid CORS by proxying via Next dev server
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/proxy/v1/:path*',
          destination: 'https://api.relationshipmenu.org/v1/:path*'
        }
      ];
    }
    return [];
  },
};

export default nextConfig;
