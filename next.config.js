/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['digital-ec-matsukenbass.koyeb.app'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'digital-ec-matsukenbass.koyeb.app',
      },
    ],
  },
};

module.exports = nextConfig;
