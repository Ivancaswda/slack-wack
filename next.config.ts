import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      domains: ['neat-dove-689.convex.cloud']
  },
    eslint: {
        ignoreDuringBuilds: true, // отключает ESLint при сборке
    },
    typescript: {
        ignoreBuildErrors: true, // отключает ошибки TypeScript при сборке
    },

};

export default nextConfig;
