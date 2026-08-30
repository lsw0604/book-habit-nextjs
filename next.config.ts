import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search1.kakaocdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "image.aladin.co.kr",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
