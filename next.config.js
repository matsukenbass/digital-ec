/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'digital-ec-matsukenbass.koyeb.app',
      },
      {
        protocol: 'https',
        hostname: 'makemoke-dev-matsukenbass.koyeb.app',
      },
    ],
  },
};

module.exports = nextConfig;
