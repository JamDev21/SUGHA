import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto desactiva ESLint durante el build (ideal para deploy rápido)
    ignoreDuringBuilds: true,
  },
  // Puedes agregar más opciones aquí si lo necesitas
};

export default nextConfig;