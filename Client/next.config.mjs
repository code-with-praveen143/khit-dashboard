/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.188.116.118",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "osaw.in",
        port: "",
        pathname: "/v1/uploads/**",
      },
      {
        protocol: "https",
        hostname: "khit.campusify.io",
        port: "",
        pathname: "/_next/image**", // Fixed the pathname to match the correct Next.js image pattern
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
