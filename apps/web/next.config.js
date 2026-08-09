import "@repo/env/load";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  env: {
    NEXT_PUBLIC_API_PORT: process.env.API_PORT,
  },
};

export default nextConfig;
