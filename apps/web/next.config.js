import "@repo/env/load";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
