/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Static rendering için gerekli ayarlar
  output: 'standalone',
  // Proxy route'u artık Next.js API routes ile yönetiyoruz
  // CORS headers'ları da proxy handler'da yönetiliyor
}

module.exports = nextConfig;