/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'new-medimate.vercel.app'],
  },
  // Skip build-time database connection requirements  
  serverExternalPackages: ['mongoose'],
  // Set environment variables for build
  env: {
    SKIP_BUILD_STATIC_GENERATION: process.env.SKIP_BUILD_STATIC_GENERATION || 'false',
    NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  },
  // Optimize chunk loading for development
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  // API routes configuration
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://new-medimate.vercel.app' 
              : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
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
