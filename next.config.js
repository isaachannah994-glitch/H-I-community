/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite hacer deploy aunque haya errores menores de TypeScript o ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
