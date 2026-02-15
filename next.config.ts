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
  serverExternalPackages: ["@libsql/client", "@libsql/isomorphic-fetch", "@libsql/isomorphic-ws", "@prisma/adapter-libsql", "@prisma/client"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|LICENSE|node)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
