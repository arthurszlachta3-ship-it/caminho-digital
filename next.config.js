/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'avatars.githubusercontent.com'
    ]
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
