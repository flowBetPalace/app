/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nbatopshot.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.laligagolazos.com',
        port: '',
        pathname: '/editions/**',
      },
    ],
  },
}

module.exports = nextConfig
