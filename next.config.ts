import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Add experimental features to improve route groups handling in Next.js 15.0.3
    serverComponentsExternalPackages: [],
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },

  // Ensure the build process treats route groups properly
  reactStrictMode: true,
  swcMinify: true,

  // Set higher limits for static generation
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
