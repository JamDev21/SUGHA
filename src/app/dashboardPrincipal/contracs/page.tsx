"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "María González López",
    curp: "GOLM850315MDFNPR03",
    phone: "+52 555 123 4567",
    email: "maria.gonzalez@email.com",
    fiscalAddress: "Av. Reforma 123, Col. Centro",
  },
  {
    id: 2,
    name: "Juan Carlos Pérez",
    curp: "PECJ900520HDFRRL05",
    phone: "+52 555 234 5678",
    email: "juan.perez@email.com",
    fiscalAddress: "Calle Morelos 456, Col. Norte",
  },
  {
    id: 3,
    name: "Ana Sofía Martínez",
    curp: "MASA920710MDFRTNA08",
    phone: "+52 555 345 6789",
    email: "ana.martinez@email.com",
    fiscalAddress: "Av. Juárez 789, Col. Sur",
  },
]

const mockCountries = [
  { id: 1, name: "México" },
  { id: 2, name: "Estados Unidos" },
  { id: 3, name: "Guatemala" },
]

const mockStates = [
  { id: 1, name: "Hidalgo", countryId: 1 },
  { id: 2, name: "Ciudad de México", countryId: 1 },
  { id: 3, name: "Jalisco", countryId: 1 },
  { id: 4, name: "Nuevo León", countryId: 1 },
  { id: 5, name: "Puebla", countryId: 1 },
]

const mockMunicipalities = [
  { id: 1, name: "Atitalaquia", stateId: 1 },
  { id: 2, name: "Tlaxcoapan", stateId: 1 },
  { id: 3, name: "Tlahuelilpan", stateId: 1 },
  { id: 4, name: "Benito Juárez", stateId: 2 },
  { id: 5, name: "Coyoacán", stateId: 2 },
  { id: 6, name: "Guadalajara", stateId: 3},
  { id: 7, name: "Zapopan", stateId: 3 },
]

const mockNeighborhoods = [
  { id: 1, name: "Tezoquipa", municipalityId: 1 },
  { id: 2, name: "Tablón", municipalityId: 1 },
  { id: 3, name: "Dendho", municipalityId: 1 },
  { id: 4, name: "Del Valle", municipalityId: 2 },
  { id: 5, name: "Roma Norte", municipalityId: 2 },
  { id: 6, name: "Centro Histórico", municipalityId: 3 },
  { id: 7, name: "Providencia", municipalityId: 4 },
]

const mockPostalCodes = [
  { id: 1, code: "42970", neighborhoodId: 1 },
  { id: 2, code: "03100", neighborhoodId: 2 },
  { id: 3, code: "06700", neighborhoodId: 3 },
  { id: 4, code: "04000", neighborhoodId: 4 },
  { id: 5, code: "44630", neighborhoodId: 5 },
]

const mockTariffs = [
  { id: 1, type: "Residencial Básica", amount: 150.0, description: "Consumo hasta 20m³" },
  { id: 2, type: "Residencial Media", amount: 280.0, description: "Consumo de 21-40m³" },
  { id: 3, type: "Comercial", amount: 450.0, description: "Uso comercial estándar" },
  { id: 4, type: "Industrial", amount: 850.0, description: "Uso industrial" },
]

const mockTaps = [
  { id: 1, identifier: "TM-001-2024", location: "Calle Principal #123", status: "Disponible" },
  { id: 2, identifier: "TM-002-2024", location: "Av. Reforma #456", status: "Disponible" },
  { id: 3, identifier: "TM-003-2024", location: "Calle Morelos #789", status: "Disponible" },
  { id: 4, identifier: "TM-004-2024", location: "Av. Juárez #321", status: "Disponible" },
]

interface ContractFormData {
  userId: number | null
  countryId: number | null
  stateId: number | null
  municipalityId: number | null
  neighborhoodId: number | null
  postalCodeId: number | null
  houseNumber: string
  startDate: string
  endDate: string
  tariffId: number | null
  tapId: number | null
}

export default function NewContractPage() {
  // const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [contractSaved, setContractSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newUser, setNewUser] = useState({
    name: "",
    curp: "",
    phone: "",
    email: "",
    fiscalAddress: "",
  })

  const [contractData, setContractData] = useState<ContractFormData>({
    userId: null,
    countryId: null,
    stateId: null,
    municipalityId: null,
    neighborhoodId: null,
    postalCodeId: null,
    houseNumber: "",
    startDate: "",
    endDate: "",
    tariffId: null,
    tapId: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filtered data based on selections
  const filteredStates = mockStates.filter((state) => state.countryId === contractData.countryId)
  const filteredMunicipalities = mockMunicipalities.filter(
    (municipality) => municipality.stateId === contractData.stateId,
  )
  const filteredNeighborhoods = mockNeighborhoods.filter(
    (neighborhood) => neighborhood.municipalityId === contractData.municipalityId,
  )
  const filteredPostalCodes = mockPostalCodes.filter((code) => code.neighborhoodId === contractData.neighborhoodId)

  const selectedTariff = mockTariffs.find((tariff) => tariff.id === contractData.tariffId)

  // Reset dependent fields when parent changes
  useEffect(() => {
    setContractData((prev) => ({
      ...prev,
      stateId: null,
      municipalityId: null,
      neighborhoodId: null,
      postalCodeId: null,
    }))
  }, [contractData.countryId])

  useEffect(() => {
    setContractData((prev) => ({ ...prev, municipalityId: null, neighborhoodId: null, postalCodeId: null }))
  }, [contractData.stateId])

  useEffect(() => {
    setContractData((prev) => ({ ...prev, neighborhoodId: null, postalCodeId: null }))
  }, [contractData.municipalityId])

  useEffect(() => {
    setContractData((prev) => ({ ...prev, postalCodeId: null }))
  }, [contractData.neighborhoodId])

  const handleUserSearch = (searchTerm: string) => {
    setSearchValue(searchTerm)

    if (searchTerm.length < 3) return

    const foundUser = mockUsers.find(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.curp.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (foundUser) {
      setSelectedUser(foundUser)
      setContractData((prev) => ({ ...prev, userId: foundUser.id! }))
      setCurrentStep(2)
    }
  }

  const handleCreateNewUser = async () => {
    // Validate new user form
    const newErrors: Record<string, string> = {}
    if (!newUser.name.trim()) newErrors.userName = "El nombre es requerido"
    if (!newUser.curp.trim()) newErrors.userCurp = "La CURP es requerida"
    if (!newUser.phone.trim()) newErrors.userPhone = "El teléfono es requerido"
    if (!newUser.email.trim()) newErrors.userEmail = "El correo es requerido"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new user with mock ID
      const createdUser = { ...newUser, id: Date.now() }
      setSelectedUser(createdUser)
      setContractData((prev) => ({ ...prev, userId: createdUser.id! }))
      setShowNewUserModal(false)
      setCurrentStep(2)

      // toast({
      //   title: "Usuario creado exitosamente",
      //   description: `${createdUser.name} ha sido registrado en el sistema.`,
      // })
      toast.success(`Usuario creado exitosamente: ${createdUser.name} ha sido registrado.`)

      // Reset new user form
      setNewUser({
        name: "",
        curp: "",
        phone: "",
        email: "",
        fiscalAddress: "",
      })
      setErrors({})
    } catch (error) {
      // toast({
      //   title: "Error al crear usuario",
      //   description: "Ocurrió un error inesperado. Intente nuevamente.",
      //   variant: "destructive",
      // })
      toast.error("Ocurrió un error inesperado. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const validateContractForm = () => {
    const newErrors: Record<string, string> = {}

    if (!contractData.countryId) newErrors.countryId = "Debe seleccionar un país"
    if (!contractData.stateId) newErrors.stateId = "Debe seleccionar un estado"
    if (!contractData.municipalityId) newErrors.municipalityId = "Debe seleccionar un municipio"
    if (!contractData.neighborhoodId) newErrors.neighborhoodId = "Debe seleccionar una colonia"
    if (!contractData.postalCodeId) newErrors.postalCodeId = "Debe seleccionar un código postal"
    if (!contractData.houseNumber.trim()) newErrors.houseNumber = "Debe ingresar el número de casa"
    if (!contractData.startDate) newErrors.startDate = "Debe seleccionar la fecha de inicio"
    if (!contractData.tariffId) newErrors.tariffId = "Debe seleccionar una tarifa"
    if (!contractData.tapId) newErrors.tapId = "Debe seleccionar una toma"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveContract = async () => {
    if (!validateContractForm()) {
      // toast({
      //   title: "Error en el formulario",
      //   description: "Por favor, complete todos los campos obligatorios.",
      //   variant: "destructive",
      // })
      toast.success(`Error en el formulario:\n Por favor, complete todos los campos obligatorios.`)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setContractSaved(true)
      setCurrentStep(3)

      // toast({
      //   title: "¡Contrato guardado exitosamente!",
      //   description: `El contrato ha sido asignado a ${selectedUser?.name}.`,
      // })
      toast.success(`¡Contrato guardado exitosamente! \n El contrato ha sido asignado a ${selectedUser?.name}.`)

    } catch (error) {
      // toast({
      //   title: "Error al guardar el contrato",
      //   description: "Ocurrió un error inesperado. Intente nuevamente.",
      //   variant: "destructive",
      // })
      toast.success(`Error al guardar el contrato \n Ocurrió un error inesperado. Intente nuevamente.`)

    } finally {
      setIsLoading(false)
    }
  }

  const handleClearForm = () => {
    setSelectedUser(null)
    setContractData({
      userId: null,
      countryId: null,
      stateId: null,
      municipalityId: null,
      neighborhoodId: null,
      postalCodeId: null,
      houseNumber: "",
      startDate: "",
      endDate: "",
      tariffId: null,
      tapId: null,
    })
    setErrors({})
    setSearchValue("")
    setCurrentStep(1)
    setContractSaved(false)
  }

  const StepIndicator = ({
    step,
    title,
    completed,
    active,
  }: { step: number; title: string; completed: boolean; active: boolean }) => (
    <div className="flex items-center space-x-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          completed ? "bg-green-500 text-white" : active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
        }`}
      >
        {completed ? <span className="h-4 w-4">✓</span> : step}
      </div>
      <span
        className={`text-sm font-medium ${active ? "text-blue-600" : completed ? "text-green-600" : "text-gray-500"}`}
      >
        {title}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboardPrincipal">
              <Button variant="ghost" size="sm">
                <span className="h-4 w-4 mr-2">←</span>
                Volver
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-8 w-8 text-blue-600">📝</span>
            <h1 className="text-3xl font-bold text-gray-900">Nuevo Contrato</h1>
          </div>
          <p className="text-gray-600">Busca o registra un usuario y llena los datos del contrato.</p>
        </div>

        {/* Step Indicator */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <StepIndicator
                step={1}
                title="Buscar/Crear Usuario"
                completed={currentStep > 1}
                active={currentStep === 1}
              />
              <div className="hidden md:block w-16 h-px bg-gray-300"></div>
              <StepIndicator
                step={2}
                title="Datos del Contrato"
                completed={currentStep > 2}
                active={currentStep === 2}
              />
              <div className="hidden md:block w-16 h-px bg-gray-300"></div>
              <StepIndicator step={3} title="Confirmación" completed={contractSaved} active={currentStep === 3} />
            </div>
          </CardContent>
        </Card>

        {/* Step 1: User Search */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="h-5 w-5 text-blue-600">🔍</span>
                <span>Buscar Usuario</span>
              </CardTitle>
              <CardDescription>Busca por nombre completo o CURP. Si no existe, podrás crear uno nuevo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-search">Buscar usuario</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">🔍</span>
                  <Input
                    id="user-search"
                    placeholder="Escribe el nombre completo o CURP..."
                    value={searchValue}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {searchValue.length >= 3 && !selectedUser && (
                <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="h-5 w-5 text-yellow-600">⚠️</span>
                    <p className="text-sm font-medium text-yellow-800">Usuario no encontrado</p>
                  </div>
                  <p className="text-sm text-yellow-700 mb-3">
                    No se encontró ningún usuario con "{searchValue}". ¿Deseas crear un nuevo usuario?
                  </p>
                  <Button onClick={() => setShowNewUserModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <span className="h-4 w-4 mr-2">➕</span>
                    Agregar nuevo usuario
                  </Button>
                </div>
              )}

              {selectedUser && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="h-5 w-5 text-green-600">✓</span>
                      <p className="font-medium text-green-800">Usuario encontrado</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 text-green-600">👤</span>
                        <div>
                          <p className="text-sm font-medium">Nombre completo</p>
                          <p className="text-sm text-gray-600">{selectedUser.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 text-green-600">📝</span>
                        <div>
                          <p className="text-sm font-medium">CURP</p>
                          <p className="text-sm text-gray-600">{selectedUser.curp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 text-green-600">📞</span>
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 text-green-600">✉️</span>
                        <div>
                          <p className="text-sm font-medium">Correo electrónico</p>
                          <p className="text-sm text-gray-600">{selectedUser.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <Button onClick={() => setCurrentStep(2)} className="bg-green-600 hover:bg-green-700">
                        Continuar con el contrato
                        <span className="h-4 w-4 ml-2 rotate-180">←</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contract Form */}
        {currentStep === 2 && selectedUser && (
          <div className="space-y-6">
            {/* User Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="h-5 w-5 text-blue-600">👤</span>
                    <div>
                      <p className="font-medium text-blue-900">{selectedUser.name}</p>
                      <p className="text-sm text-blue-700">{selectedUser.curp}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                    Cambiar usuario
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="h-5 w-5 text-blue-600">📍</span>
                  <span>Dirección del Contrato</span>
                </CardTitle>
                <CardDescription>Especifica la ubicación donde se prestará el servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País *</Label>
                    <Select
                      value={contractData.countryId?.toString() || ""}
                      onValueChange={(value) => {
                        setContractData((prev) => ({ ...prev, countryId: Number.parseInt(value) }))
                        if (errors.countryId) setErrors((prev) => ({ ...prev, countryId: "" }))
                      }}
                    >
                      <SelectTrigger className={errors.countryId ? "border-red-500" : ""}>
        {/* <span placeholder="Seleccionar país" /> */}
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCountries.map((country) => (
                          <SelectItem key={country.id} value={country.id.toString()}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.countryId && <p className="text-sm text-red-600">{errors.countryId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select
                      value={contractData.stateId?.toString() || ""}
                      onValueChange={(value) => {
                        setContractData((prev) => ({ ...prev, stateId: Number.parseInt(value) }))
                        if (errors.stateId) setErrors((prev) => ({ ...prev, stateId: "" }))
                      }}
                      disabled={!contractData.countryId}
                    >
                      <SelectTrigger className={errors.stateId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStates.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.stateId && <p className="text-sm text-red-600">{errors.stateId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="municipality">Municipio *</Label>
                    <Select
                      value={contractData.municipalityId?.toString() || ""}
                      onValueChange={(value) => {
                        setContractData((prev) => ({ ...prev, municipalityId: Number.parseInt(value) }))
                        if (errors.municipalityId) setErrors((prev) => ({ ...prev, municipalityId: "" }))
                      }}
                      disabled={!contractData.stateId}
                    >
                      <SelectTrigger className={errors.municipalityId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredMunicipalities.map((municipality) => (
                          <SelectItem key={municipality.id} value={municipality.id.toString()}>
                            {municipality.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.municipalityId && <p className="text-sm text-red-600">{errors.municipalityId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Colonia *</Label>
                    <Select
                      value={contractData.neighborhoodId?.toString() || ""}
                      onValueChange={(value) => {
                        setContractData((prev) => ({ ...prev, neighborhoodId: Number.parseInt(value) }))
                        if (errors.neighborhoodId) setErrors((prev) => ({ ...prev, neighborhoodId: "" }))
                      }}
                      disabled={!contractData.municipalityId}
                    >
                      <SelectTrigger className={errors.neighborhoodId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar colonia" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredNeighborhoods.map((neighborhood) => (
                          <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                            {neighborhood.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.neighborhoodId && <p className="text-sm text-red-600">{errors.neighborhoodId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Select
                      value={contractData.postalCodeId?.toString() || ""}
                      onValueChange={(value) => {
                        setContractData((prev) => ({ ...prev, postalCodeId: Number.parseInt(value) }))
                        if (errors.postalCodeId) setErrors((prev) => ({ ...prev, postalCodeId: "" }))
                      }}
                      disabled={!contractData.neighborhoodId}
                    >
                      <SelectTrigger className={errors.postalCodeId ? "border-red-500" : ""}>
                        {/* <span placeholder="Seleccionar código postal" /> */}
                        <SelectValue placeholder="Seleccionar código postal" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPostalCodes.map((code) => (
                          <SelectItem key={code.id} value={code.id.toString()}>
                            {code.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.postalCodeId && <p className="text-sm text-red-600">{errors.postalCodeId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">Número de Casa *</Label>
                    <Input
                      id="houseNumber"
                      placeholder="Ej: 123, 45-A, S/N"
                      value={contractData.houseNumber}
                      onChange={(e) => {
                        setContractData((prev) => ({ ...prev, houseNumber: e.target.value }))
                        if (errors.houseNumber) setErrors((prev) => ({ ...prev, houseNumber: "" }))
                      }}
                      className={errors.houseNumber ? "border-red-500" : ""}
                    />
                    {errors.houseNumber && <p className="text-sm text-red-600">{errors.houseNumber}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="h-5 w-5 text-blue-600">📅</span>
                  <span>Fechas del Contrato</span>
                </CardTitle>
                <CardDescription>Define el período de vigencia del contrato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={contractData.startDate}
                      onChange={(e) => {
                        setContractData((prev) => ({ ...prev, startDate: e.target.value }))
                        if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }))
                      }}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Fin (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={contractData.endDate}
                      onChange={(e) => setContractData((prev) => ({ ...prev, endDate: e.target.value }))}
                      min={contractData.startDate}
                    />
                    <p className="text-xs text-gray-500">Dejar vacío para contrato indefinido</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tariff Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="h-5 w-5 text-blue-600">💰</span>
                  <span>Tarifa</span>
                </CardTitle>
                <CardDescription>Selecciona la tarifa aplicable al contrato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tariff">Tarifa *</Label>
                  <Select
                    value={contractData.tariffId?.toString() || ""}
                    onValueChange={(value) => {
                      setContractData((prev) => ({ ...prev, tariffId: Number.parseInt(value) }))
                      if (errors.tariffId) setErrors((prev) => ({ ...prev, tariffId: "" }))
                    }}
                  >
                    <SelectTrigger className={errors.tariffId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar tarifa" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTariffs.map((tariff) => (
                        <SelectItem key={tariff.id} value={tariff.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{tariff.type}</span>
                            <span className="ml-2 font-medium">${tariff.amount}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tariffId && <p className="text-sm text-red-600">{errors.tariffId}</p>}
                </div>

                {selectedTariff && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{selectedTariff.type}</p>
                          <p className="text-sm text-gray-600">{selectedTariff.description}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">${selectedTariff.amount.toFixed(2)} MXN</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Tap Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="h-5 w-5 text-blue-600">💧</span>
                  <span>Toma de Agua</span>
                </CardTitle>
                <CardDescription>Asigna una toma disponible al contrato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tap">Toma Disponible *</Label>
                  <Select
                    value={contractData.tapId?.toString() || ""}
                    onValueChange={(value) => {
                      setContractData((prev) => ({ ...prev, tapId: Number.parseInt(value) }))
                      if (errors.tapId) setErrors((prev) => ({ ...prev, tapId: "" }))
                    }}
                  >
                    <SelectTrigger className={errors.tapId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar toma" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTaps.map((tap) => (
                        <SelectItem key={tap.id} value={tap.id.toString()}>
                          <div>
                            <div className="font-medium">{tap.identifier}</div>
                            <div className="text-sm text-gray-500">{tap.location}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tapId && <p className="text-sm text-red-600">{errors.tapId}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setCurrentStep(1)} className="w-full sm:w-auto">
                    Volver a búsqueda
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearForm}
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    Limpiar formulario
                  </Button>
                  <Button
                    onClick={handleSaveContract}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar contrato"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && contractSaved && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="h-8 w-8 text-green-600">✓</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contrato guardado exitosamente!</h2>
                  <p className="text-gray-600">
                    El contrato ha sido asignado a <strong>{selectedUser?.name}</strong> y está listo para usar.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setShowPrintModal(true)} className="bg-green-600 hover:bg-green-700">
                    <span className="h-4 w-4 mr-2">🖨️</span>
                    Imprimir contrato
                  </Button>
                  <Button variant="outline" onClick={handleClearForm}>
                    Crear otro contrato
                  </Button>
                  <Link href="/dashboardPrincipal">
                    <Button variant="ghost">Volver al menú</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New User Modal */}
        <Dialog open={showNewUserModal} onOpenChange={setShowNewUserModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span className="h-5 w-5 text-blue-600">➕</span>
                <span>Agregar Nuevo Usuario</span>
              </DialogTitle>
              <DialogDescription>
                Completa los datos del nuevo usuario para continuar con el contrato.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUserName">Nombre Completo *</Label>
                <Input
                  id="newUserName"
                  placeholder="Ej: Juan Pérez García"
                  value={newUser.name}
                  onChange={(e) => {
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                    if (errors.userName) setErrors((prev) => ({ ...prev, userName: "" }))
                  }}
                  className={errors.userName ? "border-red-500" : ""}
                />
                {errors.userName && <p className="text-sm text-red-600">{errors.userName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newUserCurp">CURP *</Label>
                <Input
                  id="newUserCurp"
                  placeholder="Ej: PEGJ900520HDFRRL05"
                  value={newUser.curp}
                  onChange={(e) => {
                    setNewUser((prev) => ({ ...prev, curp: e.target.value.toUpperCase() }))
                    if (errors.userCurp) setErrors((prev) => ({ ...prev, userCurp: "" }))
                  }}
                  className={errors.userCurp ? "border-red-500" : ""}
                  maxLength={18}
                />
                {errors.userCurp && <p className="text-sm text-red-600">{errors.userCurp}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newUserPhone">Teléfono *</Label>
                <Input
                  id="newUserPhone"
                  placeholder="Ej: +52 555 123 4567"
                  value={newUser.phone}
                  onChange={(e) => {
                    setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                    if (errors.userPhone) setErrors((prev) => ({ ...prev, userPhone: "" }))
                  }}
                  className={errors.userPhone ? "border-red-500" : ""}
                />
                {errors.userPhone && <p className="text-sm text-red-600">{errors.userPhone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newUserEmail">Correo Electrónico *</Label>
                <Input
                  id="newUserEmail"
                  type="email"
                  placeholder="Ej: juan.perez@email.com"
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                    if (errors.userEmail) setErrors((prev) => ({ ...prev, userEmail: "" }))
                  }}
                  className={errors.userEmail ? "border-red-500" : ""}
                />
                {errors.userEmail && <p className="text-sm text-red-600">{errors.userEmail}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newUserAddress">Dirección Fiscal (Opcional)</Label>
                <Textarea
                  id="newUserAddress"
                  placeholder="Ej: Av. Reforma 123, Col. Centro, Ciudad de México"
                  value={newUser.fiscalAddress}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, fiscalAddress: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewUserModal(false)
                    setErrors({})
                  }}
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateNewUser}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar usuario y continuar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Modal */}
        <Dialog open={showPrintModal} onOpenChange={setShowPrintModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span className="h-5 w-5 text-blue-600">🖨️</span>
                <span>Vista Previa del Contrato</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">CONTRATO DE SERVICIO DE AGUA</h2>
                  <p className="text-sm text-gray-600">Sistema SUGHA</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Datos del Usuario:</h3>
                    <p>
                      <strong>Nombre:</strong> {selectedUser?.name}
                    </p>
                    <p>
                      <strong>CURP:</strong> {selectedUser?.curp}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {selectedUser?.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser?.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Datos del Contrato:</h3>
                    <p>
                      <strong>Fecha de inicio:</strong> {contractData.startDate}
                    </p>
                    <p>
                      <strong>Tarifa:</strong> {selectedTariff?.type}
                    </p>
                    <p>
                      <strong>Monto:</strong> ${selectedTariff?.amount} MXN
                    </p>
                    <p>
                      <strong>Toma asignada:</strong> {mockTaps.find((t) => t.id === contractData.tapId)?.identifier}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowPrintModal(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
                  <span className="h-4 w-4 mr-2">🖨️</span>
                  Imprimir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  )
}
