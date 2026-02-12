import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,
  
  // Performance optimizations
  compress: true,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/components/ui', 'lucide-react'],
  },
};

export default nextConfig;
