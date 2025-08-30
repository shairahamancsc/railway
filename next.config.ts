
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to solve the 'fs' and 'encoding' module not found errors in face-api.js and its dependencies
    if (!isServer) {
        config.resolve.fallback.fs = false;
        config.resolve.fallback.encoding = false;
    }
    return config;
  },
};

export default withPWA(nextConfig);
