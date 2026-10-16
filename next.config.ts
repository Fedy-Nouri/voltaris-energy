import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fail the production build on type errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },

  // Don't advertise the framework in response headers.
  poweredByHeader: false,

  reactStrictMode: true,
};

export default nextConfig;
