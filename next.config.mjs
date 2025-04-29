/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next.js 13 以前／fields に URL が含まれる場合
    domains: ['images.microcms-assets.io'],

    // Next.js 14＋Remote Patterns 推奨設定
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.microcms-assets.io',
    //     port: '',
    //     pathname: '/**',
    //   },
    // ],
  },
};

export default nextConfig;
