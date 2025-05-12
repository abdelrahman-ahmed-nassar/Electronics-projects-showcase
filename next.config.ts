import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable static data caching for more frequent data updates
  staticPageGenerationTimeout: 120,
  experimental: {
    // Disable React server component payload caching
    workerThreads: true,
  },
  // Completely disable fetch caching for all data requests
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 10 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1,
  },
  headers: async () => {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/projects-images/**",
      },
      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/projects-images//**",
      },
      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/profiles-images//**",
      },
      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/profiles-images/**",
      },

      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/teams-images//**",
      },
      {
        protocol: "https",
        hostname: "wefmacormdggmnrgoqqv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/teams-images/**",
      },
    ],
  },
};

export default nextConfig;
