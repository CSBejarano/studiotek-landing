import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desactivar caché persistente de Turbopack en dev para evitar
  // corrupción de archivos SST por symlinks externos (.claude/)
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },

  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },

  // Compilación optimizada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

};

export default nextConfig;
