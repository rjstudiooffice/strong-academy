import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable client-side router cache for dynamic pages.
    // Without this, Server Action results (revalidatePath + redirect) require
    // a manual page refresh because the browser still shows the cached version.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
