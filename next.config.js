/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: () => [
    {
      source: '/main',
      destination: '/main/home',
    }
  ]
}

module.exports = nextConfig
