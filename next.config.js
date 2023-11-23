/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com'
    ],
  },
}

module.exports = nextConfig
