/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: '*.thesportsdb.com' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
    ],
  },
};

module.exports = nextConfig;
