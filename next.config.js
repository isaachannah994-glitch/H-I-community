/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite compilar sin errores de TypeScript bloqueantes durante el build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
