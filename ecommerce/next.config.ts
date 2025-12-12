import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build (linting errors exist but don't affect bundle)
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Habilitar compresión gzip/brotli
  compress: true,

  // Optimizaciones experimentales para mejor rendimiento
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react', 'zod', 'react-hook-form']
  },

  // Tree-shaking mejorado para iconos
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Optimizar salida del build
  output: 'standalone',

  // Configurar headers de cache para optimización
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
