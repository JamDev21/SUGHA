import { Button } from "@/components/ui/button"
import { Droplets, Gauge, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function SughaLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-blue-200" />
            <span className="text-xl font-bold">SUGHA</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="hover:text-blue-200 transition-colors">
              Inicio
            </Link>
            <Link href="#" className="hover:text-blue-200 transition-colors">
              Características
            </Link>
            <Link href="#" className="hover:text-blue-200 transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              SUGHA
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-8 text-blue-100">
              Sistema Unificado de Gestión Hídrica Adaptable
            </h2>
            <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed mb-12">
              Monitorea, controla y gestiona el suministro y calidad del agua en comités y municipios de forma
              inteligente.
            </p>
          </div>

          {/* Hero Image/Icon */}
          <div className="mb-12">
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <div className="relative">
                <Droplets className="h-32 w-32 md:h-40 md:w-40 text-blue-200" />
                <div className="absolute -top-4 -right-4">
                  <Zap className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Gauge className="h-6 w-6 text-green-300" />
                </div>
                <div className="absolute top-0 right-8">
                  <Shield className="h-6 w-6 text-blue-300" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-800 hover:bg-blue-50 text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="./login">Iniciar sesión como administrador</Link>
            </Button>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Gauge className="h-12 w-12 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Monitoreo en Tiempo Real</h3>
              <p className="text-blue-100 text-sm">Supervisa la calidad y flujo del agua las 24 horas del día</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Zap className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gestión Inteligente</h3>
              <p className="text-blue-100 text-sm">Automatiza procesos y optimiza el uso de recursos hídricos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Shield className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Control de Calidad</h3>
              <p className="text-blue-100 text-sm">Garantiza estándares de calidad y seguridad del agua</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-blue-100">
            <p>&copy; 2025 SUGHA - Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>

  )
}
