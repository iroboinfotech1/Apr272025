/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  images: {
    unoptimized: true,
  },
  //basePath: '/ui',
}

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: false,
  register: true,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: false,
  sw: 'sw.js',
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
})

module.exports = withPWA(nextConfig)