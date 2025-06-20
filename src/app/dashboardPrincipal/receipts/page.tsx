"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Receipt,
  Search,
  Download,
  Mail,
  MessageCircle,
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  ArrowRight,
  Plus,
  RefreshCw,
  MapPin,
  CreditCard,
  Building,
  Filter,
  Printer,
  Trash2,
  TrendingUp,
  AlertCircle,
  X,
  Check,
} from "lucide-react"
import Link from "next/link"

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "María González López",
    contractNumber: "CT-2024-001",
    address: "Av. Reforma 123, Col. Centro, CP 03100",
    phone: "+52 555 123 4567",
    email: "maria.gonzalez@email.com",
    tariff: 150.0,
    status: "Activo",
  },
  {
    id: 2,
    name: "Juan Carlos Pérez",
    contractNumber: "CT-2024-002",
    address: "Calle Morelos 456, Col. Norte, CP 06700",
    phone: "+52 555 234 5678",
    email: "juan.perez@email.com",
    tariff: 150.0,
    status: "Activo",
  },
  {
    id: 3,
    name: "Ana Sofía Martínez",
    contractNumber: "CT-2024-003",
    address: "Av. Juárez 789, Col. Sur, CP 04000",
    phone: "+52 555 345 6789",
    email: "ana.martinez@email.com",
    tariff: 280.0,
    status: "Activo",
  },
  {
    id: 4,
    name: "Carlos Roberto Silva",
    contractNumber: "CT-2024-004",
    address: "Calle Hidalgo 321, Col. Este, CP 02100",
    phone: "+52 555 456 7890",
    email: "carlos.silva@email.com",
    tariff: 150.0,
    status: "Activo",
  },
]

const mockReceipts = [
  {
    id: 1,
    receiptNumber: "REC-2024-001",
    userId: 1,
    userName: "María González López",
    contractNumber: "CT-2024-001",
    period: "Enero 2024",
    month: "Enero",
    year: "2024",
    amount: 150.0,
    status: "Pagado",
    generatedDate: "2024-01-15",
    paidDate: "2024-01-20",
    comments: "",
  },
  {
    id: 2,
    receiptNumber: "REC-2024-002",
    userId: 2,
    userName: "Juan Carlos Pérez",
    contractNumber: "CT-2024-002",
    period: "Enero 2024",
    month: "Enero",
    year: "2024",
    amount: 150.0,
    status: "Pendiente",
    generatedDate: "2024-01-15",
    paidDate: null,
    comments: "Recordatorio enviado",
  },
  {
    id: 3,
    receiptNumber: "REC-2024-003",
    userId: 3,
    userName: "Ana Sofía Martínez",
    contractNumber: "CT-2024-003",
    period: "Enero 2024",
    month: "Enero",
    year: "2024",
    amount: 280.0,
    status: "Pagado",
    generatedDate: "2024-01-15",
    paidDate: "2024-01-18",
    comments: "Pago anticipado",
  },
  {
    id: 4,
    receiptNumber: "REC-2024-004",
    userId: 4,
    userName: "Carlos Roberto Silva",
    contractNumber: "CT-2024-004",
    period: "Enero 2024",
    month: "Enero",
    year: "2024",
    amount: 150.0,
    status: "Vencido",
    generatedDate: "2024-01-15",
    paidDate: null,
    comments: "Pago vencido hace 15 días",
  },
  {
    id: 5,
    receiptNumber: "REC-2024-005",
    userId: 1,
    userName: "María González López",
    contractNumber: "CT-2024-001",
    period: "Febrero 2024",
    month: "Febrero",
    year: "2024",
    amount: 150.0,
    status: "Pendiente",
    generatedDate: "2024-02-15",
    paidDate: null,
    comments: "",
  },
]

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

interface ReceiptForm {
  userId: number | null
  contractNumber: string
  month: string
  year: string
  tariff: number
  status: "Pagado" | "Pendiente" | "Vencido"
  comments: string
}

export default function ReceiptsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNewReceiptDialog, setShowNewReceiptDialog] = useState(false)
  const [showFiltersDialog, setShowFiltersDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterPeriod, setFilterPeriod] = useState("")
  const [filterUser, setFilterUser] = useState("")
  const [receipts, setReceipts] = useState(mockReceipts)

  const [receiptForm, setReceiptForm] = useState<ReceiptForm>({
    userId: null,
    contractNumber: "",
    month: "",
    year: currentYear.toString(),
    tariff: 0,
    status: "Pendiente",
    comments: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate statistics
  const totalReceipts = receipts.length
  const paidReceipts = receipts.filter((r) => r.status === "Pagado").length
  const pendingReceipts = receipts.filter((r) => r.status === "Pendiente").length
  const overdueReceipts = receipts.filter((r) => r.status === "Vencido").length
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0)
  const paidAmount = receipts.filter((r) => r.status === "Pagado").reduce((sum, r) => sum + r.amount, 0)
  const paymentProgress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  // Filter users based on search
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.contractNumber.toLowerCase().includes(searchValue.toLowerCase()),
  )

  // Filter receipts based on filters
  const filteredReceipts = receipts.filter((receipt) => {
    const statusMatch = filterStatus === "Todos" || receipt.status === filterStatus
    const periodMatch = !filterPeriod || receipt.period.toLowerCase().includes(filterPeriod.toLowerCase())
    const userMatch = !filterUser || receipt.userName.toLowerCase().includes(filterUser.toLowerCase())
    return statusMatch && periodMatch && userMatch
  })

  // Handle user selection
  const handleUserSelect = (user: any) => {
    setSelectedUser(user)
    setReceiptForm({
      ...receiptForm,
      userId: user.id,
      contractNumber: user.contractNumber,
      tariff: user.tariff,
    })
    setSearchValue(user.name)
    setErrors({})
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!receiptForm.userId) newErrors.user = "Debe seleccionar un usuario"
    if (!receiptForm.month) newErrors.month = "Debe seleccionar un mes"
    if (!receiptForm.year) newErrors.year = "Debe seleccionar un año"
    if (receiptForm.tariff <= 0) newErrors.tariff = "La tarifa debe ser mayor a 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generate receipt
  const handleGenerateReceipt = async () => {
    if (!validateForm()) {
      toast.error("Error en el formulario", {
        description: "Por favor, complete todos los campos obligatorios.",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create new receipt
      const newReceipt = {
        id: receipts.length + 1,
        receiptNumber: `REC-2024-${String(receipts.length + 1).padStart(3, "0")}`,
        userId: receiptForm.userId!,
        userName: selectedUser!.name,
        contractNumber: receiptForm.contractNumber,
        period: `${receiptForm.month} ${receiptForm.year}`,
        month: receiptForm.month,
        year: receiptForm.year,
        amount: receiptForm.tariff,
        status: receiptForm.status,
        generatedDate: new Date().toISOString().split("T")[0],
        paidDate: receiptForm.status === "Pagado" ? new Date().toISOString().split("T")[0] : null,
        comments: receiptForm.comments,
      }

      setReceipts([newReceipt, ...receipts])

      toast.success("¡Recibo generado exitosamente!", {
        description: `Recibo ${newReceipt.receiptNumber} para ${selectedUser?.name}`,
        duration: 4000,
      })

      // Reset form
      setReceiptForm({
        userId: null,
        contractNumber: "",
        month: "",
        year: currentYear.toString(),
        tariff: 0,
        status: "Pendiente",
        comments: "",
      })
      setSelectedUser(null)
      setSearchValue("")
      setShowNewReceiptDialog(false)
    } catch (error) {
      toast.error("Error al generar recibo", {
        description: "Ocurrió un error inesperado. Intente nuevamente.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Change receipt status
  const handleStatusChange = (receiptId: number, newStatus: string) => {
    setReceipts(
      receipts.map((receipt) =>
        receipt.id === receiptId
          ? {
              ...receipt,
              status: newStatus as "Pagado" | "Pendiente" | "Vencido",
              paidDate: newStatus === "Pagado" ? new Date().toISOString().split("T")[0] : null,
            }
          : receipt,
      ),
    )

    toast.success("Estado actualizado", {
      description: `Recibo marcado como ${newStatus.toLowerCase()}`,
      duration: 3000,
    })
  }

  // Action handlers
  const handleDownloadPDF = (receipt?: any) => {
    const receiptInfo = receipt ? `${receipt.receiptNumber}` : "vista previa"
    toast.success("Descargando PDF", {
      description: `Descargando recibo ${receiptInfo}`,
      duration: 3000,
    })
  }

  const handlePrint = (receipt?: any) => {
    const receiptInfo = receipt ? `${receipt.receiptNumber}` : "vista previa"
    toast.info("Imprimiendo", {
      description: `Enviando recibo ${receiptInfo} a la impresora`,
      duration: 3000,
    })
  }

  const handleSendEmail = (receipt: any) => {
    const user = mockUsers.find((u) => u.id === receipt.userId)
    if (!user?.email) {
      toast.error("Sin correo electrónico", {
        description: "El usuario no tiene correo registrado",
      })
      return
    }

    toast.success("Correo enviado", {
      description: `Recibo enviado a ${user.email}`,
      duration: 3000,
    })
  }

  const handleSendWhatsApp = (receipt: any) => {
    const user = mockUsers.find((u) => u.id === receipt.userId)
    if (!user?.phone) {
      toast.error("Sin teléfono", {
        description: "El usuario no tiene teléfono registrado",
      })
      return
    }

    toast.success("WhatsApp enviado", {
      description: `Recibo enviado por WhatsApp a ${user.phone}`,
      duration: 3000,
    })
  }

  const handleDeleteReceipt = (receiptId: number) => {
    setReceipts(receipts.filter((r) => r.id !== receiptId))
    toast.success("Recibo eliminado", {
      description: "El recibo ha sido eliminado exitosamente",
      duration: 3000,
    })
  }

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Pagado":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          badge: "bg-green-100 text-green-800 border-green-200",
          color: "text-green-600",
        }
      case "Pendiente":
        return {
          icon: <Clock className="h-4 w-4" />,
          badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
          color: "text-yellow-600",
        }
      case "Vencido":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          badge: "bg-red-100 text-red-800 border-red-200",
          color: "text-red-600",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          color: "text-gray-600",
        }
    }
  }

  // Receipt Preview Component
  const ReceiptPreview = () => {
    if (!selectedUser || !receiptForm.month || !receiptForm.year) {
      return (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
          <CardContent className="flex items-center justify-center h-80">
            <div className="text-center text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Vista Previa del Recibo</p>
              <p className="text-sm">Complete los campos para ver la vista previa</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-gradient-to-b from-blue-50 to-white border-blue-200 shadow-lg">
        <CardHeader className="text-center border-b border-blue-200 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Receipt className="h-6 w-6" />
            <span>RECIBO DE PAGO</span>
          </CardTitle>
          <CardDescription className="text-blue-100">Sistema SUGHA - Comité de Agua</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <User className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuario</p>
                  <p className="font-semibold">{selectedUser.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Contrato</p>
                  <p className="font-semibold">{selectedUser.contractNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Dirección</p>
                  <p className="text-sm">{selectedUser.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Periodo</p>
                  <p className="font-semibold">
                    {receiptForm.month} {receiptForm.year}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tarifa Fija</p>
                  <p className="font-semibold text-lg">${receiptForm.tariff.toFixed(2)} MXN</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <Badge className={getStatusDisplay(receiptForm.status).badge}>
                    {getStatusDisplay(receiptForm.status).icon}
                    <span className="ml-1">{receiptForm.status}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {receiptForm.comments && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Comentarios</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg border">{receiptForm.comments}</p>
            </div>
          )}

          <div className="pt-4 border-t-2 border-blue-600">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total a Pagar:</span>
              <span className="text-2xl font-bold text-blue-600">${receiptForm.tariff.toFixed(2)} MXN</span>
            </div>
          </div>

          {/* Preview Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadPDF()}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="h-3 w-3 mr-1" />
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePrint()}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Printer className="h-3 w-3 mr-1" />
              Imprimir
            </Button>
            {selectedUser?.email && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendEmail({ userId: selectedUser.id })}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            )}
            {selectedUser?.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendWhatsApp({ userId: selectedUser.id })}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                WhatsApp
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
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
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Gestión de Recibos
                </h1>
                <p className="text-gray-600">Genera y administra recibos de pago del servicio de agua</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Recibos</p>
                  <p className="text-2xl font-bold">{totalReceipts}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pagados</p>
                  <p className="text-2xl font-bold">{paidReceipts}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold">{pendingReceipts}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Vencidos</p>
                  <p className="text-2xl font-bold">{overdueReceipts}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Progreso de Cobranza</span>
            </CardTitle>
            <CardDescription>Porcentaje de pagos realizados del total facturado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Recaudado: ${paidAmount.toFixed(2)} MXN</span>
                <span>Total: ${totalAmount.toFixed(2)} MXN</span>
              </div>
              <Progress value={paymentProgress} className="h-3" />
              <div className="text-center">
                <span className="text-lg font-semibold text-green-600">{paymentProgress.toFixed(1)}%</span>
                <span className="text-sm text-gray-500 ml-2">de cobranza efectiva</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Historial de Recibos</span>
                </CardTitle>
                <CardDescription>Gestiona y consulta todos los recibos generados</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por usuario..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filtrar por periodo..."
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full md:w-48"
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => {
                    const statusDisplay = getStatusDisplay(receipt.status)
                    return (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                        <TableCell>{receipt.userName}</TableCell>
                        <TableCell>{receipt.contractNumber}</TableCell>
                        <TableCell>{receipt.period}</TableCell>
                        <TableCell className="font-semibold">${receipt.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={receipt.status}
                            onValueChange={(value) => handleStatusChange(receipt.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <Badge className={statusDisplay.badge}>
                                {statusDisplay.icon}
                                <span className="ml-1">{receipt.status}</span>
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pendiente">Pendiente</SelectItem>
                              <SelectItem value="Pagado">Pagado</SelectItem>
                              <SelectItem value="Vencido">Vencido</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{receipt.generatedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                toast.info("Vista previa", {
                                  description: `Mostrando recibo ${receipt.receiptNumber}`,
                                })
                              }
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPDF(receipt)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrint(receipt)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Printer className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendEmail(receipt)}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendWhatsApp(receipt)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReceipt(receipt.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-500 mb-2">No se encontraron recibos</p>
                <p className="text-gray-400">Ajusta los filtros o genera un nuevo recibo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full shadow-lg bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtros Avanzados</DialogTitle>
                <DialogDescription>Personaliza la vista de recibos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Estado</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Pagado">Pagado</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Usuario</Label>
                  <Input
                    placeholder="Nombre del usuario..."
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Periodo</Label>
                  <Input
                    placeholder="Ej: Enero 2024"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowFiltersDialog(false)} className="w-full bg-blue-600 hover:bg-blue-700">
                  Aplicar Filtros
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNewReceiptDialog} onOpenChange={setShowNewReceiptDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Generar Nuevo Recibo</span>
                </DialogTitle>
                <DialogDescription>Complete la información para generar un nuevo recibo de pago</DialogDescription>
              </DialogHeader>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="space-y-6">
                  {/* User Search */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Search className="h-4 w-4 text-blue-600" />
                        <span>Seleccionar Usuario</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-search">Buscar usuario</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-search"
                            placeholder="Nombre del usuario o número de contrato..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className={`pl-10 ${errors.user ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.user && <p className="text-sm text-red-600">{errors.user}</p>}
                      </div>

                      {/* User Search Results */}
                      {searchValue.length >= 2 && !selectedUser && (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-600">{user.contractNumber}</p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    ${user.tariff.toFixed(2)}
                                  </Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 border rounded-lg">
                              <p className="text-sm">No se encontraron usuarios</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selected User */}
                      {selectedUser && (
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                  <User className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-green-900 text-sm">{selectedUser.name}</p>
                                  <p className="text-xs text-green-700">{selectedUser.contractNumber}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(null)
                                  setSearchValue("")
                                  setReceiptForm({
                                    ...receiptForm,
                                    userId: null,
                                    contractNumber: "",
                                    tariff: 0,
                                  })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>

                  {/* Receipt Form */}
                  {selectedUser && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>Datos del Recibo</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="month">Mes *</Label>
                            <Select
                              value={receiptForm.month}
                              onValueChange={(value) => {
                                setReceiptForm({ ...receiptForm, month: value })
                                if (errors.month) setErrors({ ...errors, month: "" })
                              }}
                            >
                              <SelectTrigger className={errors.month ? "border-red-500" : ""}>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.month && <p className="text-sm text-red-600">{errors.month}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="year">Año *</Label>
                            <Select
                              value={receiptForm.year}
                              onValueChange={(value) => {
                                setReceiptForm({ ...receiptForm, year: value })
                                if (errors.year) setErrors({ ...errors, year: "" })
                              }}
                            >
                              <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tariff">Tarifa (MXN) *</Label>
                            <Input
                              id="tariff"
                              type="number"
                              step="0.01"
                              min="0"
                              value={receiptForm.tariff}
                              onChange={(e) => {
                                setReceiptForm({ ...receiptForm, tariff: Number.parseFloat(e.target.value) || 0 })
                                if (errors.tariff) setErrors({ ...errors, tariff: "" })
                              }}
                              className={errors.tariff ? "border-red-500" : ""}
                            />
                            {errors.tariff && <p className="text-sm text-red-600">{errors.tariff}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                              value={receiptForm.status}
                              onValueChange={(value: "Pagado" | "Pendiente" | "Vencido") =>
                                setReceiptForm({ ...receiptForm, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Pagado">Pagado</SelectItem>
                                <SelectItem value="Vencido">Vencido</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comments">Comentarios</Label>
                          <Textarea
                            id="comments"
                            placeholder="Observaciones adicionales..."
                            value={receiptForm.comments}
                            onChange={(e) => setReceiptForm({ ...receiptForm, comments: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleGenerateReceipt}
                            disabled={isGenerating}
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                          >
                            {isGenerating ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Generando...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Generar Recibo
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vista Previa</h3>
                    <p className="text-sm text-gray-600">Visualización en tiempo real del recibo</p>
                  </div>
                  <ReceiptPreview />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
