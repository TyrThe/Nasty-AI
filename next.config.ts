import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /react-syntax-highlighter/,
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
};

export default nextConfig;
