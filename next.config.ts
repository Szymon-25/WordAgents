import type { NextConfig } from "next";

const isProd = (process.env.NODE_ENV || 'production') === 'production';

const nextConfig: NextConfig = {
  output: 'export',                 // for static export
  images: {
    unoptimized: true,              // disable image optimization
  },
  trailingSlash: true,              // required for GitHub Pages static export
  basePath: isProd ? '/WordAgents' : '',
  assetPrefix: isProd ? '/WordAgents' : '',
  exportPathMap: async () => ({
    '/': { page: '/' },
  }),
};

export default nextConfig;
