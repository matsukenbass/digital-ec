// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     // remotePatterns: [
//     //   {
//     //     hostname: 'localhost',
//     //     protocol: 'http',
//     //   },
//     // ],
//     domains: ['localhost', 'digital-ec.vercel.app'],
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
