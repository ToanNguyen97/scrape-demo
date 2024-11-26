/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium']
  },
  images: {
    domains: [
      'pic.origapp.com',
    ],
  }
};

export default nextConfig;
