import type { NextConfig } from "next";

const isProd = (process.env.NODE_ENV || 'production') === 'production';

const nextConfig: NextConfig = {
  output: 'export',                  // for static export
  images: { unoptimized: true },     // needed for next export
  trailingSlash: true,               // GitHub Pages prefers trailing slashes
  basePath: isProd ? process.env.NEXT_PUBLIC_BASE_PATH : '',
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_BASE_PATH : '',
};

export default nextConfig;
