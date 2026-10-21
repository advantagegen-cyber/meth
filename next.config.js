/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: '/site',
      destination: '/index.html',
    }]
  },
}

module.exports = nextConfig
