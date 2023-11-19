/** @type {import('next').NextConfig} */
const nextConfig = {
  // Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,

  // automatically redirects user to /login page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      }
    ]
  },
  
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  // reactStrictMode: true

  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com'
    ],
  },
}

module.exports = nextConfig
