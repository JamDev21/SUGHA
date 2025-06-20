"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Droplets,
  Home,
  Users,
  FileText,
  CreditCard,
  Receipt,
  Scissors,
  Beaker,
  Bell,
  BarChart3,
  Database,
  Settings,
  LogOut,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
} from "lucide-react"

// Mock data
const dashboardData = {
  contracts: {
    total: 1247,
    active: 1189,
    inactive: 58,
    trend: "+5.2%",
  },
  payments: {
    thisMonth: 45680,
    lastMonth: 42350,
    trend: "+7.9%",
  },
  waterQuality: {
    average: 8.7,
    ph: 7.2,
    chlorine: 0.8,
    turbidity: 1.2,
    status: "Excelente",
  },
  cuts: {
    active: 23,
    byDebt: 18,
    byContamination: 5,
    trend: "-12%",
  },
  alerts: [
    { id: 1, type: "warning", message: "Nivel de cloro bajo en Sector Norte", time: "Hace 15 min" },
    { id: 2, type: "info", message: "Pago recibido - Contrato #1247", time: "Hace 32 min" },
    { id: 3, type: "error", message: "Sensor de pH desconectado - Zona Centro", time: "Hace 1 hora" },
  ],
}

const menuItems = [
  {
    title: "Principal",
    items: [
      { title: "Inicio", icon: Home, url: "/dashboard", active: true },
      { title: "Usuarios del Sistema", icon: Users, url: "/dashboard/users", adminOnly: true },
    ],
  },
  {
    title: "Gestión de Servicios",
    items: [
      { title: "Contratos de Servicio", icon: FileText, url: "./dashboardPrincipal/contracs" },
      { title: "Pagos y Adeudos", icon: CreditCard, url: "/dashboard/payments" },
      { title: "Recibos Generados", icon: Receipt, url: "./dashboardPrincipal/receipts" },
      { title: "Cortes de Servicio", icon: Scissors, url: "/dashboard/cuts" },
    ],
  },
  {
    title: "Monitoreo",
    items: [
      { title: "Calidad del Agua", icon: Beaker, url: "/dashboardPrincipal/water_quality" },
      { title: "Notificaciones", icon: Bell, url: "/dashboard/notifications" },
      { title: "Reportes Automáticos", icon: BarChart3, url: "/dashboard/reports" },
    ],
  },
  {
    title: "Administración",
    items: [
      { title: "Migración de Datos", icon: Database, url: "/dashboard/migration" },
      { title: "Configuración", icon: Settings, url: "/dashboard/settings" },
    ],
  },
]

function AppSidebar() {
  const userRole = "Administrador General" // This would come from auth context

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SUGHA</h1>
            <p className="text-xs text-gray-500">Sistema de Gestión Hídrica</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  // Hide admin-only items for non-admin users
                  if ("adminOnly" in item && item.adminOnly && userRole !== "Administrador General") {
                    return null
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      {/* <SidebarMenuButton asChild isActive={item.active}> */}
                      <SidebarMenuButton asChild isActive={"active" in item ? item.active : false}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Panel de Control</h1>
          <p className="text-sm text-gray-500">Resumen general del sistema</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Juan Pérez</p>
                <p className="text-xs leading-none text-muted-foreground">juan.perez@sugha.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  trendUp,
}: {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  icon: any
  trendUp?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <div className="flex items-center pt-1">
            {trendUp ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-xs ml-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
              {trend} desde el mes pasado
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AlertCard({ alert }: { alert: any }) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }
  

  return (
    <div className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
      <div className="flex items-start space-x-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
          <p className="text-xs text-gray-500">{alert.time}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
    const router = useRouter();

    const handleNewContract = () => {
      // CAMBIO: Usar router.push en lugar de navigate
      router.push('./dashboardPrincipal/contracs/new');
    };
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Contratos Activos"
                  value={dashboardData.contracts.active.toLocaleString()}
                  subtitle={`${dashboardData.contracts.total.toLocaleString()} total`}
                  trend={dashboardData.contracts.trend}
                  icon={FileText}
                  trendUp={true}
                />
                <MetricCard
                  title="Pagos del Mes"
                  value={`$${dashboardData.payments.thisMonth.toLocaleString()}`}
                  subtitle="Ingresos mensuales"
                  trend={dashboardData.payments.trend}
                  icon={DollarSign}
                  trendUp={true}
                />
                <MetricCard
                  title="Calidad del Agua"
                  value={dashboardData.waterQuality.average}
                  subtitle={dashboardData.waterQuality.status}
                  icon={Beaker}
                />
                <MetricCard
                  title="Cortes Activos"
                  value={dashboardData.cuts.active}
                  subtitle={`${dashboardData.cuts.byDebt} por adeudo`}
                  trend={dashboardData.cuts.trend}
                  icon={Scissors}
                  trendUp={false}
                />
              </div>

              {/* Charts and Details Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Water Quality Details */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span>Parámetros de Calidad</span>
                    </CardTitle>
                    <CardDescription>Mediciones en tiempo real</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">pH</span>
                      <Badge variant="secondary">{dashboardData.waterQuality.ph}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cloro (mg/L)</span>
                      <Badge variant="secondary">{dashboardData.waterQuality.chlorine}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Turbidez (NTU)</span>
                      <Badge variant="secondary">{dashboardData.waterQuality.turbidity}</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Estado General</span>
                        <Badge className="bg-green-100 text-green-800">{dashboardData.waterQuality.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Alerts */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-yellow-600" />
                      <span>Alertas Recientes</span>
                    </CardTitle>
                    <CardDescription>Notificaciones y eventos del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dashboardData.alerts.map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Tareas frecuentes del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link  href="./dashboardPrincipal/contracs">
                    <Button className="h-20 flex-col space-y-2" variant="outline" onClick={handleNewContract}>
                      <FileText className="h-6 w-6" />
                      {/* Mandar a la pagina de nuevo contrato al dar clic en el boton */}
                      <span className="text-sm">Nuevo Contrato</span>
                    </Button>
                    </Link>
                    <Button className="h-20 flex-col space-y-2" variant="outline">
                      <Receipt className="h-6 w-6" />
                      <span className="text-sm">Generar Recibo</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2" variant="outline">
                      <BarChart3 className="h-6 w-6" />
                      <span className="text-sm">Ver Reportes</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2" variant="outline">
                      <Bell className="h-6 w-6" />
                      <span className="text-sm">Enviar Notificación</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
