/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lovely-flamingo-139.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "decisive-gull-332.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      { protocol: "https", hostname: "img.icons8.com" },
    ],
  },
};

export default nextConfig;
