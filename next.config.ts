import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ajplnleilpczkgumlwyl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/projects-images/**",
      },
      {
        protocol: "https",
        hostname: "ajplnleilpczkgumlwyl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/profiles-images//**",
      },
      {
        protocol: "https",
        hostname: "ajplnleilpczkgumlwyl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/teams-images//**",
      },
    ],
  },
};

export default nextConfig;
