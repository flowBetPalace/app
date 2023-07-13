/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.nbatopshot.com',
        port: '',
        pathname: '/resize/editions/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.laligagolazos.com',
        port: '',
        pathname: '/editions/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.nflallday.com',
        port: '',
        pathname: '/resize/editions/**',
      },
      {
        protocol: 'https',
        hostname: 'giglabs.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.motogp-ignition.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
