"use client"

import { useState, useEffect } from "react"
import { CalendarDays, MapPin, Package, Clock, Filter, Download, TrendingUp, X, Plus, Minus, Users, ArrowRight, BarChart3, FileText, CheckCircle, Clock as ClockIcon, AlertTriangle, Package2, Search, Truck, Phone, Eye, MoreHorizontal, Edit, Bell, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LamodaCard, LamodaCardContent, LamodaCardHeader, LamodaCardTitle } from "@/components/ui/lamoda-card"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { PageLayout } from "@/components/shared/page-layout"
import { cn } from "@/lib/utils"
import { useNotification } from '@/components/shared/notification-modal'
import { formatDate } from '@/lib/format-utils'
import { WarehouseMap } from "@/components/logistics/warehouse-map"
import { TimeSlot, Shipment, Warehouse } from "@/types/logistics"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockTimeSlots: TimeSlot[] = [
  // Сегодня
  { id: '1', date: new Date().toISOString().split('T')[0], time: '09:00-10:00', warehouse: 'Москва-Север', type: 'FBO', available: true },
  { id: '2', date: new Date().toISOString().split('T')[0], time: '10:00-11:00', warehouse: 'Москва-Север', type: 'FBS', available: false },
  { id: '3', date: new Date().toISOString().split('T')[0], time: '11:00-12:00', warehouse: 'Москва-Юг', type: 'DBS', available: true },
  { id: '4', date: new Date().toISOString().split('T')[0], time: '14:00-15:00', warehouse: 'СПб-Центр', type: 'FBO', available: true },
  { id: '5', date: new Date().toISOString().split('T')[0], time: '15:00-16:00', warehouse: 'Москва-Север', type: 'FBS', available: true },
  { id: '6', date: new Date().toISOString().split('T')[0], time: '16:00-17:00', warehouse: 'Москва-Юг', type: 'DBS', available: false },
  
  // Завтра
  { id: '7', date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], time: '09:00-10:00', warehouse: 'Москва-Север', type: 'FBO', available: true },
  { id: '8', date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], time: '10:00-11:00', warehouse: 'Москва-Юг', type: 'FBS', available: true },
  { id: '9', date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], time: '11:00-12:00', warehouse: 'СПб-Центр', type: 'DBS', available: true },
  { id: '10', date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], time: '14:00-15:00', warehouse: 'Москва-Север', type: 'FBO', available: true, reserved: true },
  
  // Послезавтра
  { id: '11', date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], time: '09:00-10:00', warehouse: 'Москва-Юг', type: 'FBS', available: true },
  { id: '12', date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], time: '10:00-11:00', warehouse: 'СПб-Центр', type: 'DBS', available: true },
  { id: '13', date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], time: '15:00-16:00', warehouse: 'Москва-Север', type: 'FBO', available: true },
]

const mockShipments: Shipment[] = [
  {
    id: '1',
    tracking: 'LM2024001234',
    status: 'ready',
    warehouse: 'Москва-Север',
    destination: 'Москва, ул. Тверская, 12',
    items: 3,
    created: '2024-01-15',
    delivery_date: '2024-01-22',
    type: 'FBS'
  },
  {
    id: '2',
    tracking: 'LM2024001235',
    status: 'in_transit',
    warehouse: 'Москва-Юг',
    destination: 'СПб, Невский пр., 45',
    items: 1,
    created: '2024-01-18',
    delivery_date: '2024-01-25',
    type: 'FBO'
  },
  {
    id: '3',
    tracking: 'LM2024001236',
    status: 'waiting',
    warehouse: 'СПб-Центр',
    destination: 'Казань, ул. Баумана, 78',
    items: 5,
    created: '2024-01-19',
    type: 'DBS'
  }
]

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Москва-Север',
    address: 'г. Москва, Дмитровское шоссе, д. 163А',
    phone: '+7 (495) 123-45-67',
    workingHours: 'Пн-Пт: 08:00-20:00, Сб: 09:00-18:00',
    coordinates: { lat: 55.8783, lng: 37.6568 },
    services: ['FBO', 'FBS', 'Экспресс-доставка', 'Возвраты'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Москва-Юг',
    address: 'г. Москва, Каширское шоссе, д. 55к2',
    phone: '+7 (495) 987-65-43',
    workingHours: 'Пн-Пт: 09:00-19:00, Сб: 10:00-16:00',
    coordinates: { lat: 55.6037, lng: 37.7505 },
    services: ['FBS', 'DBS', 'Самовывоз'],
    status: 'active'
  },
  {
    id: '3',
    name: 'СПб-Центр',
    address: 'г. Санкт-Петербург, пр. Обуховской Обороны, д. 120',
    phone: '+7 (812) 555-77-99',
    workingHours: 'Пн-Вс: 08:00-22:00',
    coordinates: { lat: 59.8944, lng: 30.4916 },
    services: ['FBO', 'FBS', 'DBS', 'Ночная доставка'],
    status: 'maintenance'
  }
]

const statusConfig = {
  waiting: { 
    color: 'bg-amber-100 text-amber-800 border-amber-200', 
    icon: ClockIcon, 
    label: 'Ожидает сборки',
    dot: 'bg-amber-500'
  },
  ready: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: CheckCircle, 
    label: 'Готов к отгрузке',
    dot: 'bg-blue-500'
  },
  in_transit: { 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Truck, 
    label: 'В пути',
    dot: 'bg-purple-500'
  },
  delivered: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle, 
    label: 'Доставлено',
    dot: 'bg-green-500'
  },
  cancelled: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: AlertTriangle, 
    label: 'Отменено',
    dot: 'bg-red-500'
  }
}

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState("slots")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")
  const [selectedSlotType, setSelectedSlotType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedShipmentStatus, setSelectedShipmentStatus] = useState("all")
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMapWarehouse, setSelectedMapWarehouse] = useState<Warehouse | null>(null)
  
  const { showSuccess, showError } = useNotification()
  
  const filteredSlots = mockTimeSlots.filter(slot => {
    const matchesWarehouse = selectedWarehouse === "all" || slot.warehouse === selectedWarehouse
    const matchesType = selectedSlotType === "all" || slot.type === selectedSlotType
    const matchesDate = slot.date === selectedDate
    return matchesWarehouse && matchesType && matchesDate
  })

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = searchQuery === "" || 
      shipment.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedShipmentStatus === "all" || shipment.status === selectedShipmentStatus
    return matchesSearch && matchesStatus
  })

  const handleSlotBooking = async (slot: TimeSlot) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Слот забронирован', `Слот на ${slot.time} успешно забронирован`)
    } catch (error) {
      showError('Ошибка', 'Не удалось забронировать слот')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string, format: 'excel' | 'csv' | 'json' | 'pdf') => {
    setLoading(true)
    try {
      let data: any[] = []
      switch (type) {
        case 'slots':
          data = filteredSlots
          break
        case 'shipments':
          data = filteredShipments
          break
        case 'warehouses':
          data = mockWarehouses
          break
        default:
          data = []
      }
      
      // Mock export functionality
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logistics_${type}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      
      showSuccess('Экспорт выполнен', `Данные экспортированы в формате ${format.toUpperCase()}`)
    } catch (error) {
      showError('Ошибка экспорта', 'Не удалось экспортировать данные')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      switch (action) {
        case 'cancel_slots':
          showSuccess('Слоты отменены', `Отменено ${selectedSlots.length} слотов`)
          setSelectedSlots([])
          break
        case 'track_shipments':
          showSuccess('Отслеживание обновлено', `Обновлен статус ${selectedShipments.length} отправлений`)
          setSelectedShipments([])
          break
        default:
          break
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось выполнить действие')
    } finally {
      setLoading(false)
    }
  }

  // Analytics data
  const analytics = {
    totalShipments: mockShipments.length,
    readyShipments: mockShipments.filter(s => s.status === 'ready').length,
    inTransit: mockShipments.filter(s => s.status === 'in_transit').length,
    delivered: mockShipments.filter(s => s.status === 'delivered').length,
    onTimeDelivery: 94.2,
    avgDeliveryTime: 2.3,
    cancelledRate: 1.2
  }

  return (
    <PageLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Dashboard Stats */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LamodaCard className="p-4 bg-black text-white">
              <div className="text-2xl font-bold">{analytics.readyShipments}</div>
              <div className="text-sm opacity-90 mt-1">Готовы к отгрузке</div>
            </LamodaCard>
            <LamodaCard className="p-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.inTransit}</div>
              <div className="text-sm text-gray-600 mt-1">В пути</div>
            </LamodaCard>
            <LamodaCard className="p-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.delivered}</div>
              <div className="text-sm text-gray-600 mt-1">Доставлено</div>
            </LamodaCard>
            <LamodaCard className="p-4">
              <div className="text-2xl font-bold text-gray-900">{analytics.onTimeDelivery}%</div>
              <div className="text-sm text-gray-600 mt-1">Своевременность</div>
            </LamodaCard>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-semibold md:font-light text-gray-900">Логистика</h1>
            <p className="text-sm text-gray-600 mt-1 hidden md:block">
              Управление отгрузками и складскими операциями
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <LamodaButton variant="outline" size="sm" className="md:size-default">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Уведомления</span>
            </LamodaButton>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <LamodaButton variant="outline" size="sm" className="md:size-default">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Экспорт</span>
                </LamodaButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('slots', 'excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт слотов (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('shipments', 'csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт отправлений (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('warehouses', 'json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Данные складов (JSON)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { id: "slots", label: "Временные слоты", icon: Clock, shortLabel: "Слоты" },
              { id: "shipments", label: "Отправления", icon: Package, shortLabel: "Отправления" },
              { id: "warehouses", label: "Склады", icon: MapPin, shortLabel: "Склады" },
              { id: "analytics", label: "Аналитика", icon: BarChart3, shortLabel: "Аналитика" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors min-w-fit",
                  activeTab === tab.id
                    ? "border-black text-black bg-gray-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === "slots" && (
          <div className="space-y-4">
            {/* Mobile Calendar View */}
            <div className="md:hidden">
              <LamodaCard className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Выберите дату</h3>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dateStr = date.toISOString().split('T')[0]
                    const isSelected = dateStr === selectedDate
                    const dayName = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : 
                      date.toLocaleDateString('ru', { weekday: 'short' })
                    
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg text-xs transition-all duration-200 border",
                          isSelected 
                            ? "bg-black text-white border-black" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <span className={cn(
                          "font-medium mb-1",
                          isSelected ? "text-gray-300" : "text-gray-500"
                        )}>
                          {dayName}
                        </span>
                        <span className="text-lg font-bold">{date.getDate()}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Warehouse & Type Quick Filter */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  >
                    <option value="all">Все склады</option>
                    {mockWarehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedSlotType}
                    onChange={(e) => setSelectedSlotType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  >
                    <option value="all">Все типы</option>
                    <option value="FBO">FBO</option>
                    <option value="FBS">FBS</option>
                    <option value="DBS">DBS</option>
                  </select>
                </div>
              </LamodaCard>

              {/* Available Slots */}
              <LamodaCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Доступные слоты</h3>
                  <div className="text-sm text-gray-500">
                    {filteredSlots.filter(s => s.available).length} из {filteredSlots.length}
                  </div>
                </div>
                
                {filteredSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Нет доступных слотов на выбранную дату</p>
                    <p className="text-xs text-gray-400 mt-1">Попробуйте выбрать другую дату</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSlots.map((slot, index) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "border rounded-lg p-4 transition-all duration-200",
                          slot.available && !slot.reserved
                            ? "border-gray-200 hover:border-gray-900 cursor-pointer hover:shadow-sm"
                            : slot.reserved
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50 opacity-60"
                        )}
                        onClick={() => slot.available && !slot.reserved && handleSlotBooking(slot)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-3 h-3 rounded-full flex-shrink-0",
                              slot.available ? "bg-green-500" : "bg-gray-400"
                            )} />
                            <div>
                              <div className="font-medium text-gray-900">{slot.time}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span>{slot.warehouse}</span>
                                <Badge variant="outline" className="text-xs">
                                  {slot.type}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {slot.available && !slot.reserved ? (
                            <LamodaButton 
                              size="sm"
                              disabled={loading}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSlotBooking(slot)
                              }}
                              className="bg-black text-white hover:bg-gray-800"
                            >
                              Выбрать
                            </LamodaButton>
                          ) : (
                            <div className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded">
                              {slot.reserved ? "Забронирован" : "Недоступен"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </LamodaCard>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:block">
              <LamodaCard>
                <LamodaCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Дата</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-border focus:outline-none focus:border-foreground transition-colors rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Склад</label>
                      <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="w-full px-3 py-2 border border-border focus:outline-none focus:border-foreground rounded-lg"
                      >
                        <option value="all">Все склады</option>
                        {mockWarehouses.map(warehouse => (
                          <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Тип</label>
                      <select
                        value={selectedSlotType}
                        onChange={(e) => setSelectedSlotType(e.target.value)}
                        className="w-full px-3 py-2 border border-border focus:outline-none focus:border-foreground rounded-lg"
                      >
                        <option value="all">Все типы</option>
                        <option value="FBO">FBO</option>
                        <option value="FBS">FBS</option>
                        <option value="DBS">DBS</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <LamodaButton
                        variant="outline"
                        onClick={() => {
                          setSelectedWarehouse("all")
                          setSelectedSlotType("all")
                          setSelectedDate(new Date().toISOString().split('T')[0])
                        }}
                        className="w-full"
                      >
                        Сбросить
                      </LamodaButton>
                    </div>
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              {/* Desktop Slots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSlots.map((slot) => (
                  <LamodaCard key={slot.id} variant="interactive">
                    <LamodaCardContent>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-foreground">{slot.time}</div>
                          <div className="text-sm text-foreground/60">{slot.warehouse}</div>
                        </div>
                        <Badge variant={slot.available ? "default" : "secondary"}>
                          {slot.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            slot.available ? "bg-green-500" : "bg-red-500"
                          )} />
                          <span className="text-xs text-foreground/60">
                            {slot.available ? "Доступен" : "Занят"}
                          </span>
                          {slot.reserved && (
                            <Badge variant="outline" className="text-xs">
                              Забронирован
                            </Badge>
                          )}
                        </div>
                        
                        <LamodaButton 
                          size="sm"
                          disabled={!slot.available || loading}
                          onClick={() => handleSlotBooking(slot)}
                        >
                          {slot.available ? "Забронировать" : "Недоступен"}
                        </LamodaButton>
                      </div>
                    </LamodaCardContent>
                  </LamodaCard>
                ))}
              </div>
            </div>
          </div>
        )}

                 {activeTab === "shipments" && (
          <div className="space-y-4">
            {/* Status Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = mockShipments.filter(s => s.status === status).length
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedShipmentStatus(selectedShipmentStatus === status ? "all" : status)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-left",
                      selectedShipmentStatus === status 
                        ? "border-primary bg-primary/10" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                      <span className="text-xs font-medium">{config.label}</span>
                    </div>
                    <div className="text-xl font-bold">{count}</div>
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <LamodaCard>
              <LamodaCardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Поиск по трекинг-номеру или адресу доставки..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border focus:outline-none focus:border-foreground transition-colors rounded-lg"
                  />
                </div>
                {(searchQuery || selectedShipmentStatus !== "all") && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm text-gray-500">Активные фильтры:</span>
                    {searchQuery && (
                      <Badge variant="outline" className="gap-1">
                        {searchQuery}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                      </Badge>
                    )}
                    {selectedShipmentStatus !== "all" && (
                      <Badge variant="outline" className="gap-1">
                        {statusConfig[selectedShipmentStatus as keyof typeof statusConfig]?.label}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedShipmentStatus("all")} />
                      </Badge>
                    )}
                  </div>
                )}
              </LamodaCardContent>
            </LamodaCard>

            {/* Shipments List with Progress Tracking */}
            <div className="space-y-3">
              {filteredShipments.length === 0 ? (
                <LamodaCard>
                  <LamodaCardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">Отправления не найдены</p>
                      <p className="text-xs text-gray-400 mt-1">Попробуйте изменить параметры поиска</p>
                    </div>
                  </LamodaCardContent>
                </LamodaCard>
              ) : (
                filteredShipments.map((shipment) => (
                  <LamodaCard key={shipment.id} variant="interactive">
                    <LamodaCardContent>
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-3 h-3 rounded-full", statusConfig[shipment.status].dot)} />
                            <div>
                              <div className="font-medium text-foreground">{shipment.tracking}</div>
                              <div className="text-sm text-foreground/60">{shipment.warehouse}</div>
                            </div>
                          </div>
                          <Badge className={statusConfig[shipment.status].color}>
                            {statusConfig[shipment.status].label}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Прогресс доставки</span>
                            <span>
                              {shipment.status === 'delivered' ? '100%' : 
                               shipment.status === 'in_transit' ? '75%' :
                               shipment.status === 'ready' ? '50%' : '25%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full transition-all duration-1000",
                                shipment.status === 'delivered' ? 'bg-green-500' :
                                shipment.status === 'in_transit' ? 'bg-blue-500' :
                                shipment.status === 'ready' ? 'bg-yellow-500' : 'bg-gray-400'
                              )}
                              style={{ 
                                width: shipment.status === 'delivered' ? '100%' : 
                                       shipment.status === 'in_transit' ? '75%' :
                                       shipment.status === 'ready' ? '50%' : '25%'
                              }}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 py-2 bg-gray-50 rounded-lg px-3">
                          <div>
                            <div className="text-xs text-gray-500">Товаров</div>
                            <div className="font-medium">{shipment.items}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Создано</div>
                            <div className="font-medium text-sm">{formatDate(shipment.created)}</div>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-gray-600">{shipment.destination}</div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <LamodaButton size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Отследить
                          </LamodaButton>
                          <LamodaButton size="sm" variant="outline" className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Позвонить
                          </LamodaButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <LamodaButton variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </LamodaButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Документы
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Экспорт данных
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MapPin className="h-4 w-4 mr-2" />
                                Показать на карте
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", statusConfig[shipment.status].dot)} />
                            <span className="text-xs text-foreground/60 uppercase tracking-wider">
                              {statusConfig[shipment.status].label}
                            </span>
                          </div>
                          
                          <div>
                            <div className="font-medium text-foreground">{shipment.tracking}</div>
                            <div className="text-sm text-foreground/60">{shipment.destination}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-foreground">{shipment.items}</div>
                            <div className="text-xs text-foreground/40">ТОВАРОВ</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{shipment.warehouse}</div>
                            <div className="text-xs text-foreground/40">СКЛАД</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-foreground">{formatDate(shipment.created)}</div>
                            <div className="text-xs text-foreground/40">СОЗДАНО</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <LamodaButton size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Отследить
                          </LamodaButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <LamodaButton variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </LamodaButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Документы
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Экспорт данных
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MapPin className="h-4 w-4 mr-2" />
                                Показать на карте
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </LamodaCardContent>
                  </LamodaCard>
                ))
              )}
            </div>
          </div>
        )}

                 {activeTab === "warehouses" && (
          <div className="space-y-4">
            {/* Interactive Map Section */}
            <LamodaCard>
              <LamodaCardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Склады на карте</h3>
                  <LamodaButton size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Построить маршрут
                  </LamodaButton>
                                  </div>
                  
                  {/* Mapbox Interactive Map */}
                  <WarehouseMap 
                    warehouses={mockWarehouses}
                    selectedWarehouse={selectedMapWarehouse}
                    onWarehouseSelect={setSelectedMapWarehouse}
                  />
              </LamodaCardContent>
            </LamodaCard>

            {/* Warehouses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWarehouses.map((warehouse, index) => (
                <LamodaCard key={warehouse.id} variant="interactive">
                  <LamodaCardContent>
                    <div className="space-y-4">
                      {/* Header with Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                            warehouse.status === 'active' ? 'bg-green-500' :
                            warehouse.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{warehouse.name}</h3>
                            <p className="text-xs text-foreground/60">{warehouse.id}</p>
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            "text-xs",
                            warehouse.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                            warehouse.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          )}
                        >
                          {warehouse.status === 'active' ? 'Активен' :
                           warehouse.status === 'maintenance' ? 'Техобслуживание' : 'Закрыт'}
                        </Badge>
                      </div>

                      {/* Address */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{warehouse.address}</p>
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-foreground/40" />
                          <span className="text-foreground/60">{warehouse.workingHours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-foreground/40" />
                          <span className="text-foreground/60">{warehouse.phone}</span>
                        </div>
                      </div>
                      
                      {/* Services */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Доступные услуги:</p>
                        <div className="flex flex-wrap gap-1">
                          {warehouse.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                        <LamodaButton 
                          size="sm" 
                          variant="outline" 
                          className="h-9"
                          onClick={() => {
                            // Mock navigation
                            window.open(`https://maps.google.com/search/${encodeURIComponent(warehouse.address)}`, '_blank')
                          }}
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-xs">Маршрут</span>
                        </LamodaButton>
                        <LamodaButton 
                          size="sm" 
                          variant="outline"
                          className="h-9"
                          onClick={() => {
                            window.open(`tel:${warehouse.phone}`, '_self')
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          <span className="text-xs">Позвонить</span>
                        </LamodaButton>
                      </div>

                      {/* Additional Info for Mobile */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <LamodaButton variant="ghost" size="sm" className="w-full">
                              <MoreHorizontal className="h-4 w-4 mr-2" />
                              Подробнее
                            </LamodaButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              Проверить график работы
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="h-4 w-4 mr-2" />
                              Забронировать слот
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Требования к упаковке
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </LamodaCardContent>
                </LamodaCard>
              ))}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LamodaCard>
                <LamodaCardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Стандарты упаковки</p>
                      <p className="text-xs text-gray-500">Требования к товарам</p>
                    </div>
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              <LamodaCard>
                <LamodaCardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Расписание работы</p>
                      <p className="text-xs text-gray-500">Актуальные графики</p>
                    </div>
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              <LamodaCard>
                <LamodaCardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Поддержка 24/7</p>
                      <p className="text-xs text-gray-500">Экстренная связь</p>
                    </div>
                  </div>
                </LamodaCardContent>
              </LamodaCard>
            </div>
          </div>
        )}

                 {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary KPIs */}
              <LamodaCard>
                <LamodaCardContent>
                  <h3 className="font-medium mb-4">Ключевые показатели</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">{analytics.onTimeDelivery}%</p>
                          <p className="text-sm text-green-700">Своевременность</p>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        +2.3% к цели
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">{analytics.avgDeliveryTime} дня</p>
                          <p className="text-sm text-blue-700">Среднее время</p>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        -0.4 дня
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-900">{analytics.totalShipments}</p>
                          <p className="text-sm text-purple-700">Всего отправлений</p>
                        </div>
                      </div>
                      <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        +12% к прошлому месяцу
                      </div>
                    </div>
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              {/* Status Distribution */}
              <LamodaCard>
                <LamodaCardContent>
                  <h3 className="font-medium mb-4">Распределение по статусам</h3>
                  <div className="space-y-3">
                    {Object.entries(statusConfig).map(([status, config]) => {
                      const count = mockShipments.filter(s => s.status === status).length
                      const percentage = (count / mockShipments.length * 100).toFixed(1)
                      
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-3 h-3 rounded-full", config.dot)} />
                              <span>{config.label}</span>
                            </div>
                            <div className="font-medium">{count} ({percentage}%)</div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className={cn("h-2 rounded-full transition-all duration-1000", config.dot.replace('bg-', 'bg-'))}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </LamodaCardContent>
              </LamodaCard>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weekly Performance Chart */}
              <LamodaCard className="md:col-span-2">
                <LamodaCardContent>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Производительность по дням</h3>
                    <div className="flex gap-2">
                      <select className="text-xs border border-gray-200 rounded px-2 py-1">
                        <option>Эта неделя</option>
                        <option>Этот месяц</option>
                        <option>Этот квартал</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="space-y-3">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                      const value = Math.floor(Math.random() * 40) + 60
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <div className="w-8 text-xs text-gray-500">{day}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary/80 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-1000"
                              style={{ width: `${value}%` }}
                            >
                              <span className="text-xs text-white font-medium">{value}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              {/* Quick Stats */}
              <LamodaCard>
                <LamodaCardContent>
                  <h3 className="font-medium mb-4">Быстрая статистика</h3>
                  <div className="space-y-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">156</div>
                      <div className="text-xs text-gray-500">Активных слотов</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-xs text-gray-500">Активных складов</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{analytics.cancelledRate}%</div>
                      <div className="text-xs text-gray-500">Отмен доставки</div>
                    </div>

                    <LamodaButton size="sm" variant="outline" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Подробная аналитика
                    </LamodaButton>
                  </div>
                </LamodaCardContent>
              </LamodaCard>
            </div>

            {/* Performance Insights */}
            <LamodaCard>
              <LamodaCardContent>
                <h3 className="font-medium mb-4">Рекомендации для оптимизации</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900 text-sm">Отличная производительность</p>
                      <p className="text-xs text-green-700 mt-1">
                        Ваша своевременность доставки превышает целевой показатель на 2.3%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900 text-sm">Рекомендуем улучшить</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Стоит оптимизировать загрузку склада Москва-Юг в пиковые часы
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Рост эффективности</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Среднее время доставки сократилось на 0.4 дня за последний месяц
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-900 text-sm">Поддержка команды</p>
                      <p className="text-xs text-purple-700 mt-1">
                        Ваш персональный менеджер всегда готов помочь с оптимизацией
                      </p>
                    </div>
                  </div>
                </div>
              </LamodaCardContent>
            </LamodaCard>

            {/* Export and Support Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LamodaCard>
                <LamodaCardHeader>
                  <LamodaCardTitle>Экспорт отчетов</LamodaCardTitle>
                </LamodaCardHeader>
                <LamodaCardContent>
                  <div className="space-y-3">
                    <LamodaButton 
                      variant="outline" 
                      onClick={() => handleExport('analytics', 'excel')}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Полный отчет по логистике</div>
                        <div className="text-xs text-gray-500">Excel, все показатели</div>
                      </div>
                    </LamodaButton>
                    
                    <LamodaButton 
                      variant="outline" 
                      onClick={() => handleExport('shipments', 'pdf')}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Детализация отправлений</div>
                        <div className="text-xs text-gray-500">PDF, за текущий период</div>
                      </div>
                    </LamodaButton>
                    
                    <LamodaButton 
                      variant="outline" 
                      onClick={() => handleExport('warehouses', 'csv')}
                      disabled={loading}
                      className="w-full justify-start"
                    >
                      <BarChart3 className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Аналитика по складам</div>
                        <div className="text-xs text-gray-500">CSV, операционные данные</div>
                      </div>
                    </LamodaButton>
                  </div>
                </LamodaCardContent>
              </LamodaCard>

              <LamodaCard>
                <LamodaCardHeader>
                  <LamodaCardTitle>Поддержка и помощь</LamodaCardTitle>
                </LamodaCardHeader>
                <LamodaCardContent>
                  <div className="space-y-3">
                    <LamodaButton className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Связаться с менеджером</div>
                        <div className="text-xs opacity-90">Персональная поддержка</div>
                      </div>
                    </LamodaButton>
                    
                    <LamodaButton variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Горячая линия 24/7</div>
                        <div className="text-xs text-gray-500">+7 (800) 123-45-67</div>
                      </div>
                    </LamodaButton>
                    
                    <LamodaButton variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">База знаний</div>
                        <div className="text-xs text-gray-500">Инструкции и FAQ</div>
                      </div>
                    </LamodaButton>
                  </div>
                </LamodaCardContent>
              </LamodaCard>
            </div>
          </div>
        )}

        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
              <LamodaButton variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </LamodaButton>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Дата</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Склад</label>
                <div className="space-y-2">
                  {["all", ...mockWarehouses.map(w => w.name)].map(warehouse => (
                    <button
                      key={warehouse}
                      onClick={() => setSelectedWarehouse(warehouse)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 text-sm font-medium transition-all text-left",
                        selectedWarehouse === warehouse 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {warehouse === "all" ? "Все склады" : warehouse}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-white">
              <LamodaButton 
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                Применить фильтры
              </LamodaButton>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
} 