import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lngidscxbepfuldokikh.supabase.co',
    ],
  },
};

export default nextConfig;
