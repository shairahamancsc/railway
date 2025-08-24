
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
    // This is to solve the 'fs' module not found error in face-api.js
    if (!isServer) {
        config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default withPWA(nextConfig);
