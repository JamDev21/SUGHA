"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { toast } from "sonner"
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Brain,
  Eye,
  Thermometer,
  Zap,
  Activity,
  Beaker,
  Waves,
  ArrowRight,
  RefreshCw,
  Calendar,
  Target,
  Lightbulb,
  Shield,
} from "lucide-react"
import Link from "next/link"

// Generate mock data for charts
const generateHistoricalData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      ph: 7.2 + (Math.random() - 0.5) * 1.2,
      turbidity: 1.5 + Math.random() * 2.5,
      temperature: 22 + Math.random() * 8,
      tds: 150 + Math.random() * 100,
      chlorine: 0.8 + Math.random() * 0.6,
      quality: 75 + Math.random() * 20,
    })
  }
  return data
}

const generatePredictionData = () => {
  const data = []
  const now = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    data.push({
      day: date.toLocaleDateString("es-ES", { weekday: "short" }),
      quality: 85 - Math.random() * 15,
      confidence: 90 + Math.random() * 10,
    })
  }
  return data
}

export default function WaterQualityDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [historicalData] = useState(generateHistoricalData())
  const [predictionData] = useState(generatePredictionData())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Current parameters
  const currentParams = {
    // 7.3
    ph: 7.3,
    turbidity: 2.1,
    temperature: 24.5,
    tds: 185,
    chlorine: 0.9,
    quality: 40,
  }

  // Calculate quality status
  const getQualityStatus = (quality: number) => {
    if (quality >= 85) return { status: "excellent", label: "Excelente", color: "blue", bgColor: "bg-blue-500" }
    if (quality >= 70) return { status: "good", label: "Buena", color: "green", bgColor: "bg-green-500" }
    if (quality >= 50) return { status: "regular", label: "Regular", color: "yellow", bgColor: "bg-yellow-500" }
    return { status: "poor", label: "Mala", color: "red", bgColor: "bg-red-500" }
  }

  const qualityStatus = getQualityStatus(currentParams.quality)

  // AI Recommendations based on current parameters
  const getAIRecommendations = () => {
    const recommendations = []

    if (currentParams.ph < 6.5 || currentParams.ph > 8.5) {
      recommendations.push({
        type: "critical",
        message: "Ajustar niveles de pH mediante tratamiento químico",
        icon: Beaker,
        priority: "Alta",
      })
    }

    if (currentParams.turbidity > 2.0) {
      recommendations.push({
        type: "warning",
        message: "Incrementar filtración para reducir turbidez",
        icon: Waves,
        priority: "Media",
      })
    }

    if (currentParams.chlorine < 0.5) {
      recommendations.push({
        type: "info",
        message: "Agregar tratamiento de cloro para desinfección",
        icon: Shield,
        priority: "Media",
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "success",
        message: "Mantener protocolo actual de tratamiento",
        icon: CheckCircle,
        priority: "Baja",
      })
    }

    return recommendations
  }

  const aiRecommendations = getAIRecommendations()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Show critical alert if quality is poor
  useEffect(() => {
    if (qualityStatus.status === "poor") {
      toast.error("🚨 Alerta Crítica", {
        description: "La calidad del agua está en niveles críticos",
        duration: 5000,
      })
    }
  }, [qualityStatus.status])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    toast.success("Datos actualizados", {
      description: "La información ha sido sincronizada exitosamente.",
      duration: 3000,
    })
  }

  // Water Tank Visualization Component
  const WaterTankVisualization = () => {
    const getWaterColor = () => {
      switch (qualityStatus.color) {
        case "blue":
          return "#3B82F6"
        case "green":
          return "#10B981"
        case "yellow":
          return "#F59E0B"
        case "red":
          return "#EF4444"
        default:
          return "#3B82F6"
      }
    }

    return (
      <div className="relative w-full h-80 flex items-center justify-center">
        <svg width="280" height="320" viewBox="0 0 280 320" className="drop-shadow-xl">
          {/* Tank structure */}
          <rect x="60" y="60" width="160" height="200" fill="#E5E7EB" stroke="#6B7280" strokeWidth="3" rx="8" />
          <rect x="65" y="65" width="150" height="190" fill="#F9FAFB" />

          {/* Water level */}
          <rect
            x="70"
            y={85 + 165 * (1 - currentParams.quality / 100)}
            width="140"
            height={165 * (currentParams.quality / 100)}
            fill={getWaterColor()}
            className="transition-all duration-1000"
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.7;0.9;0.7" dur="3s" repeatCount="indefinite" />
          </rect>

          {/* Water surface animation */}
          <ellipse
            cx="140"
            cy={85 + 165 * (1 - currentParams.quality / 100)}
            rx="70"
            ry="4"
            fill={getWaterColor()}
            opacity="0.9"
          >
            <animate attributeName="ry" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Tank top */}
          <rect x="50" y="50" width="180" height="15" fill="#374151" rx="7" />

          {/* Quality indicator */}
          <circle cx="140" cy="40" r="15" fill={getWaterColor()} className="animate-pulse" />
          <text x="140" y="45" textAnchor="middle" className="text-xs font-bold fill-white">
            {currentParams.quality.toFixed(0)}%
          </text>

          {/* Sensors */}
          <circle cx="100" cy="120" r="4" fill="#10B981" className="animate-pulse" />
          <circle cx="180" cy="150" r="4" fill="#10B981" className="animate-pulse" />
          <circle cx="140" cy="180" r="4" fill="#10B981" className="animate-pulse" />
          <circle cx="120" cy="210" r="4" fill="#10B981" className="animate-pulse" />

          {/* Tank label */}
          <text x="140" y="290" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            Tanque Principal
          </text>
          <text x="140" y="305" textAnchor="middle" className="text-xs fill-gray-500">
            Calidad: {qualityStatus.label}
          </text>
        </svg>

        {/* Floating parameters */}
        <div className="absolute top-4 right-4 space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-xs animate-pulse">
                  pH: {currentParams.ph.toFixed(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nivel de acidez (6.5-8.5 óptimo)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-xs animate-pulse">
                  {currentParams.temperature.toFixed(1)}°C
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Temperatura del agua</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-xs animate-pulse">
                  TDS: {currentParams.tds}ppm
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sólidos disueltos totales</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link href="/dashboardPrincipal">
                <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Volver al dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Monitoreo de Calidad del Agua
                </h1>
                <p className="text-gray-600">Sistema inteligente de análisis en tiempo real</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right bg-white rounded-lg p-3 shadow-sm border">
              <p className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Última actualización
              </p>
              <p className="text-lg font-semibold text-gray-900">{currentTime.toLocaleTimeString("es-ES")}</p>
            </div>

            <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {qualityStatus.status === "poor" && (
          <Alert variant="destructive" className="border-red-500 bg-red-50 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">🚨 Alerta Crítica de Calidad</AlertTitle>
            <AlertDescription className="text-base">
              La calidad del agua está en niveles críticos. Se requiere acción inmediata para garantizar la seguridad
              del suministro.
              <Button
                variant="destructive"
                size="sm"
                className="ml-4"
                onClick={() =>
                  toast.info("Protocolo de emergencia", {
                    description: "Activando protocolo de emergencia para calidad crítica del agua",
                    duration: 4000,
                  })
                }
              >
                Ver protocolo de emergencia
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Water Tank Visualization */}
          <Card className="lg:col-span-1 bg-gradient-to-b from-white to-blue-50 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span>Estado del Sistema</span>
              </CardTitle>
              <div className="flex justify-center">
                <Badge
                  className={`text-sm px-3 py-1 ${
                    qualityStatus.color === "blue"
                      ? "bg-blue-100 text-blue-800"
                      : qualityStatus.color === "green"
                        ? "bg-green-100 text-green-800"
                        : qualityStatus.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {qualityStatus.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <WaterTankVisualization />
            </CardContent>
          </Card>

          {/* Parameter Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* pH Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span>pH</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          {currentParams.ph < 6.5 || currentParams.ph > 8.5 ? "Crítico" : "Normal"}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rango óptimo: 6.5 - 8.5</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-blue-700">{currentParams.ph.toFixed(1)}</p>
                  <Progress value={(currentParams.ph / 14) * 100} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    {currentParams.ph > 7.0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span>vs. promedio semanal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Turbidity Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-amber-600" />
                    <span>Turbidez</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentParams.turbidity > 2.0 ? "Alto" : "Normal"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-amber-700">{currentParams.turbidity.toFixed(1)}</p>
                  <p className="text-xs text-amber-600">NTU</p>
                  <Progress value={Math.min((currentParams.turbidity / 5) * 100, 100)} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <TrendingUp className="h-3 w-3 text-amber-600" />
                    <span>+0.3 desde ayer</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Card */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-red-600" />
                    <span>Temperatura</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Normal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-red-700">{currentParams.temperature.toFixed(1)}°C</p>
                  <Progress value={(currentParams.temperature / 40) * 100} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <TrendingUp className="h-3 w-3 text-red-600" />
                    <span>Estacional</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TDS Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span>TDS</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Normal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-700">{currentParams.tds}</p>
                  <p className="text-xs text-purple-600">ppm</p>
                  <Progress value={(currentParams.tds / 500) * 100} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <TrendingDown className="h-3 w-3 text-green-600" />
                    <span>Mejorando</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chlorine Card */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Cloro</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Normal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-700">{currentParams.chlorine.toFixed(1)}</p>
                  <p className="text-xs text-green-600">mg/L</p>
                  <Progress value={(currentParams.chlorine / 2) * 100} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Óptimo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Quality Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <span>Calidad General</span>
                  </div>
                  <Badge
                    className={`text-xs ${
                      qualityStatus.color === "blue"
                        ? "bg-blue-100 text-blue-800"
                        : qualityStatus.color === "green"
                          ? "bg-green-100 text-green-800"
                          : qualityStatus.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {qualityStatus.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-indigo-700">{currentParams.quality.toFixed(0)}%</p>
                  <Progress value={currentParams.quality} className="h-2" />
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <TrendingUp className="h-3 w-3 text-indigo-600" />
                    <span>Tendencia positiva</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and AI Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Historical Chart */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Tendencias Históricas (24h)</span>
              </CardTitle>
              <CardDescription>Evolución de los parámetros de calidad en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Area
                      type="monotone"
                      dataKey="quality"
                      stroke="#3B82F6"
                      fill="url(#qualityGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-gradient-to-b from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Recomendaciones IA</span>
              </CardTitle>
              <CardDescription>Sugerencias inteligentes basadas en análisis de datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    rec.type === "critical"
                      ? "border-red-500 bg-red-50"
                      : rec.type === "warning"
                        ? "border-yellow-500 bg-yellow-50"
                        : rec.type === "info"
                          ? "border-blue-500 bg-blue-50"
                          : "border-green-500 bg-green-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <rec.icon
                      className={`h-5 w-5 mt-0.5 ${
                        rec.type === "critical"
                          ? "text-red-600"
                          : rec.type === "warning"
                            ? "text-yellow-600"
                            : rec.type === "info"
                              ? "text-blue-600"
                              : "text-green-600"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        Prioridad: {rec.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                onClick={() =>
                  toast.info("Recomendaciones", {
                    description: "Mostrando todas las recomendaciones de IA disponibles",
                    duration: 3000,
                  })
                }
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Ver todas las recomendaciones
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Predictions Section */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Predicciones de Calidad (7 días)</span>
            </CardTitle>
            <CardDescription>Proyecciones basadas en modelos de aprendizaje automático</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Bar dataKey="quality" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Análisis Predictivo</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Calidad estable los próximos 3 días</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Posible descenso el viernes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span>Mejora esperada el fin de semana</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Confianza del Modelo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precisión general</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              toast.info("Detalles completos", {
                description: "Abriendo vista detallada del historial de calidad",
                duration: 3000,
              })
            }
          >
            <Eye className="h-5 w-5 mr-2" />
            Ver detalles completos
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={() =>
              toast.success("Recomendaciones personalizadas", {
                description: "Generando recomendaciones específicas para su sistema",
                duration: 3000,
              })
            }
          >
            <Brain className="h-5 w-5 mr-2" />
            Recomendaciones personalizadas
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
            onClick={() =>
              toast.info("Historial completo", {
                description: "Accediendo al historial completo de datos",
                duration: 3000,
              })
            }
          >
            <Calendar className="h-5 w-5 mr-2" />
            Historial completo
          </Button>
        </div>
      </div>
    </div>
  )
}
