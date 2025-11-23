/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // VERY IMPORTANT for AWS SSR hosting
};

module.exports = nextConfig;
