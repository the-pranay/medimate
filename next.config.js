/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  // Skip build-time database connection requirements  
  serverExternalPackages: ['mongoose'],
  // Set environment variables for build
  env: {
    SKIP_BUILD_STATIC_GENERATION: process.env.SKIP_BUILD_STATIC_GENERATION || 'false',
  },
  // Webpack configuration for PDF libraries
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallbacks for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
