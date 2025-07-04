/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  // Skip build-time database connection requirements
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Set environment variables for build
  env: {
    SKIP_BUILD_STATIC_GENERATION: process.env.SKIP_BUILD_STATIC_GENERATION || 'false',
  },
};

export default nextConfig;
