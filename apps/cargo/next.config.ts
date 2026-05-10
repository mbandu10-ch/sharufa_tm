import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jaahszatxsvrondptyeq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.sharufa.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Plus large pour les uploads de preuves photo/vidéo
    },
  },
};

export default withNextIntl(nextConfig);
