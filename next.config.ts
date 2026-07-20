import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/webp'],
  },
  allowedDevOrigins: ['192.168.1.7', '192.168.1.7:3000', 'localhost:3000'],
};

export default nextConfig;
