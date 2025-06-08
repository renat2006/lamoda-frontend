"use client"

import { useState } from "react"
import { 
  Download, 
  Search, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  MessageSquare,
  ChevronRight,
  Calendar,
  User,
  Mail,
  FileText,
  RefreshCw,
  Bell,
  Phone,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui"
import { 
  PageWrapper,
  AnimatedCard
} from "@/components/shared"
import { PageLayout } from "@/components/shared/page-layout"
import type { Order } from "@/types/lamoda"
import { mockOrders } from "@/lib/mock-data"
import { LamodaButton } from '@/components/ui/lamoda-button'
import { LamodaCard } from '@/components/ui/lamoda-card'
import { useNotification } from '@/components/shared/notification-modal'
import { ExportModal } from '@/components/shared/export-modal'
import { exportData, printShippingLabels } from '@/lib/export-utils'
import { formatCurrency, formatNumber } from '@/lib/format-utils'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <ShoppingCart className="h-4 w-4" />
    case 'processing': return <Package className="h-4 w-4" />
    case 'shipped': return <Truck className="h-4 w-4" />
    case 'delivered': return <CheckCircle className="h-4 w-4" />
    case 'cancelled': return <XCircle className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'text-primary'
    case 'processing': return 'text-amber-600'
    case 'shipped': return 'text-green-600'
    case 'delivered': return 'text-foreground'
    case 'cancelled': return 'text-gray-400'
    default: return 'text-foreground'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'new': return 'Новый'
    case 'processing': return 'В обработке'
    case 'shipped': return 'Отправлен'
    case 'delivered': return 'Доставлен'
    case 'cancelled': return 'Отменён'
    default: return status
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'text-primary'
    case 'normal': return 'text-foreground/60'
    case 'low': return 'text-foreground/40'
    default: return 'text-foreground'
  }
}

const OrderCard = ({ order, onView }: { order: Order; onView: (order: Order) => void }) => {
  const daysUntilDeadline = order.shippingDeadline 
    ? Math.ceil((new Date(order.shippingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const isUrgent = daysUntilDeadline <= 2 && daysUntilDeadline > 0
  
      return (
    <div 
      className={`relative bg-white rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
        isUrgent ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-primary/40'
      }`}
      onClick={() => onView(order)}
    >
      {/* Mobile Optimized Layout */}
      <div className="p-4 space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                #{order.number}
              </h3>
              {isUrgent && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.date).toLocaleDateString('ru-RU')}
            </p>
          </div>
          
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(order.status)} bg-white`}>
            {getStatusIcon(order.status)}
            <span className="hidden sm:inline">{getStatusText(order.status)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">{order.customer.name}</span>
          </div>
          {(order.customer.email || order.customer.phone) && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">
                {order.customer.email || order.customer.phone}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(order.amount)}
            </div>
            <div className="text-xs text-gray-500">Сумма</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-sm font-semibold text-gray-900">
              {order.itemsCount}
            </div>
            <div className="text-xs text-gray-500">Позиций</div>
          </div>
        </div>

        {/* Deadline */}
        {order.shippingDeadline && (
          <div className={`flex items-center gap-2 p-2 rounded-md ${
            isUrgent ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-800'
        }`}>
            <Clock className="h-3 w-3 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate">
                До {new Date(order.shippingDeadline).toLocaleDateString('ru-RU')}
              </div>
              {daysUntilDeadline > 0 && (
                <div className="text-xs opacity-75">
                  {daysUntilDeadline} дн.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <LamodaButton variant="ghost" size="sm" className="text-xs px-2 py-1">
            <Eye className="h-3 w-3 mr-1" />
            Открыть
          </LamodaButton>
          
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [isExporting, setIsExporting] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>("")
  
  const { showNotification, showSuccess, showError, showConfirm } = useNotification()

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    
    // Date range filter
    const orderDate = new Date(order.date)
    const matchesDateRange = (!dateRange.from || orderDate >= new Date(dateRange.from)) &&
                            (!dateRange.to || orderDate <= new Date(dateRange.to))
    
    return matchesSearch && matchesStatus && matchesDateRange
  })

  const urgentOrders = mockOrders.filter(order => {
    if (!order.shippingDeadline) return false
    const daysUntilDeadline = Math.ceil((new Date(order.shippingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 2 && daysUntilDeadline > 0 && order.status !== 'delivered' && order.status !== 'cancelled'
  }).length

  const newOrders = mockOrders.filter(order => order.status === 'new').length

  // Seller tools functions
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id))
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      showError('Ошибка', 'Выберите заказы для выполнения действия');
      return;
    }

    setLoading(true)
    
    try {
      switch (action) {
        case 'mark_shipped':
          await new Promise(resolve => setTimeout(resolve, 1500))
          // In real app, would update backend
          showSuccess('Успешно', `${selectedOrders.length} заказов отмечено как отправленные`)
          break
          
        case 'print_labels':
          await new Promise(resolve => setTimeout(resolve, 800))
          printShippingLabels(selectedOrders)
          showSuccess('Этикетки созданы', `Создано ${selectedOrders.length} этикеток для печати`)
          break
          
        case 'send_notifications':
          await new Promise(resolve => setTimeout(resolve, 1200))
          showSuccess('Уведомления отправлены', `Уведомления отправлены для ${selectedOrders.length} заказов`)
          break
          
        case 'export_csv':
          setIsExportModalOpen(true)
          break
          
        default:
          console.log(`Unknown bulk action: ${action}`)
      }
    } catch (error) {
      showError('Ошибка', 'Произошла ошибка при выполнении действия')
    } finally {
      setLoading(false)
      if (action !== 'export_csv') {
        setSelectedOrders([])
        setBulkAction("")
      }
    }
  }

  const handleExport = (format: string, options: any) => {
    setIsExporting(true)
    
    try {
      const ordersToExport = selectedOrders.length > 0 
        ? filteredOrders.filter(order => selectedOrders.includes(order.id))
        : filteredOrders
      
      const ordersData = ordersToExport.map(order => ({
        'Номер заказа': order.number,
        'Дата': order.date,
        'Клиент': order.customer.name,
        'Статус': getStatusText(order.status),
        'Сумма': order.amount,
        'Позиций': order.itemsCount,
        'Телефон': order.customer.phone || '',
        'Email': order.customer.email || ''
      }))
      
      exportData(ordersData, format, `orders_export_${new Date().toISOString().split('T')[0]}`, options, 'Отчет по заказам')
      
      showSuccess('Экспорт завершен', `Экспортировано ${ordersToExport.length} заказов в формате ${format.toUpperCase()}`)
      setSelectedOrders([])
    } catch (error) {
      showError('Ошибка экспорта', 'Не удалось экспортировать данные')
    } finally {
      setIsExporting(false)
    }
  }

  const generateShippingLabel = async (orderId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      printShippingLabels([orderId])
      showSuccess('Этикетка создана', `Этикетка для заказа ${orderId} готова к печати`)
    } catch (error) {
      showError('Ошибка', 'Не удалось создать этикетку')
    } finally {
      setLoading(false)
    }
  }

  const sendCustomerNotification = async (orderId: string, type: 'shipped' | 'delayed' | 'delivered') => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showSuccess('Уведомление отправлено', `Уведомление отправлено клиенту по заказу ${orderId}`)
    } catch (error) {
      showError('Ошибка', 'Не удалось отправить уведомление')
    } finally {
      setLoading(false)
    }
  }

  const handleOrderAction = async (orderId: string, action: string) => {
    setLoading(true)
    
    try {
      switch (action) {
        case 'collect':
          await new Promise(resolve => setTimeout(resolve, 1000))
          showSuccess('Заказ собран', 'Заказ собран и готов к отправке')
          break
          
        case 'ship':
          await new Promise(resolve => setTimeout(resolve, 1200))
          showSuccess('Заказ отправлен', 'Заказ отправлен в Lamoda')
          break
          
        case 'track':
          // Open tracking page in new tab
          window.open(`https://lamoda.ru/track/${orderId}`, '_blank')
          return // Don't show notification for link opening
          
        case 'details':
          showNotification({
            type: 'info',
            title: 'Детали заказа',
            message: `Открытие деталей заказа ${orderId}`,
            actionType: 'info'
          })
          break
          
        case 'contact':
          showNotification({
            type: 'info',
            title: 'Контакты клиента',
            message: `Открытие контактов клиента для заказа ${orderId}`,
            actionType: 'info'
          })
          break
          
        case 'print_label':
          await generateShippingLabel(orderId)
          return // generateShippingLabel handles its own notifications
          
        case 'notify':
          await sendCustomerNotification(orderId, 'shipped')
          return // sendCustomerNotification handles its own notifications
          
        default:
          console.log(`Unknown order action: ${action}`)
      }
    } catch (error) {
      showError('Ошибка', 'Произошла ошибка при выполнении действия')
    } finally {
      setLoading(false)
    }
  }
  const processingOrders = mockOrders.filter(order => order.status === 'processing').length
  const totalRevenue = mockOrders.filter(order => order.status !== 'cancelled').reduce((sum, order) => sum + order.amount, 0)
  const avgOrderValue = totalRevenue / mockOrders.filter(o => o.status !== 'cancelled').length

  const handleOrderView = (order: Order) => {
    console.log("Просмотр заказа:", order)
  }

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const statusOptions = [
    { value: "all", label: "Все заказы" },
    { value: "new", label: "Новые", count: newOrders },
    { value: "processing", label: "В обработке", count: processingOrders },
    { value: "shipped", label: "Отгружены" },
    { value: "delivered", label: "Доставлены" },
    { value: "cancelled", label: "Отмененные" }
  ]

  return (
    <>
    <PageLayout>
      <PageWrapper maxWidth="2xl">
          <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-border pb-8">
          <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
            Заказы
          </h1>
          <p className="text-lg text-foreground/60 font-light">
            Управление заказами и отгрузками
          </p>
        </div>

        {/* Critical Alerts */}
        {urgentOrders > 0 && (
          <div className="bg-primary/5 border-l-4 border-primary p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">
                  Требует немедленного внимания
                </h3>
                <p className="text-sm text-foreground/60 mb-4">
                  {urgentOrders} срочных заказов требуют обработки в течение 2 часов
                </p>
                <LamodaButton size="sm">
                  Обработать срочные заказы
                </LamodaButton>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
            Статистика
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {mockOrders.length}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Всего заказов
              </div>
              <div className="text-xs text-foreground/60">
                За последние 30 дней
              </div>
              </div>
              
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {urgentOrders}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Срочные заказы
              </div>
              <div className="text-xs text-foreground/60">
                Обработать до 18:00
              </div>
                </div>

            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Выручка
              </div>
              <div className="text-xs text-foreground/60">
                За период
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {formatCurrency(Math.round(avgOrderValue))}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Средний чек
              </div>
              <div className="text-xs text-foreground/60">
                На заказ
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters & Tools */}
        <LamodaCard className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-light text-foreground">
              Фильтры и инструменты
            </h2>
            
            <div className="flex items-center gap-2">
              <LamodaButton
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedOrders.length === filteredOrders.length ? 'Снять выбор' : 'Выбрать все'}
              </LamodaButton>
              
              <LamodaButton
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </LamodaButton>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { value: 'all', label: 'Все заказы', count: mockOrders.length },
              { value: 'new', label: 'Новые', count: newOrders },
              { value: 'processing', label: 'В обработке', count: mockOrders.filter(o => o.status === 'processing').length },
              { value: 'shipped', label: 'Отправлены', count: mockOrders.filter(o => o.status === 'shipped').length },
              { value: 'cancelled', label: 'Отменённые', count: mockOrders.filter(o => o.status === 'cancelled').length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 text-sm border transition-colors flex items-center gap-2 ${
                  selectedStatus === filter.value
                    ? 'bg-foreground text-white border-foreground'
                    : 'bg-white text-foreground border-border hover:border-foreground'
                }`}
              >
                {filter.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedStatus === filter.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Поиск по номеру заказа или имени клиента..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border focus:border-foreground focus:outline-none text-sm"
            />
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Дата от
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-border focus:border-foreground focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Дата до
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-border focus:border-foreground focus:outline-none text-sm"
                />
              </div>
              
              <div className="flex items-end">
                <LamodaButton
                  variant="outline"
                  onClick={() => setDateRange({ from: "", to: "" })}
                  className="w-full"
                >
                  Сбросить фильтры
                </LamodaButton>
                </div>
            </div>
          )}
        </LamodaCard>

        {/* Bulk Actions Toolbar */}
        {selectedOrders.length > 0 && (
          <LamodaCard className="p-4 bg-primary/5 border-primary/20 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  Выбрано {selectedOrders.length} заказов
                </span>
                <LamodaButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                >
                  Отменить выбор
                </LamodaButton>
              </div>
              
                                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                {/* Mobile: Stack buttons vertically */}
                <div className="md:hidden grid grid-cols-2 gap-2">
                  <LamodaButton
                    size="sm"
                    onClick={() => handleBulkAction('mark_shipped')}
                    disabled={loading}
                    className="text-xs"
                  >
                    <Truck className="h-3 w-3 mr-1" />
                    Отправлены
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('print_labels')}
                    disabled={loading}
                    className="text-xs"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Этикетки
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('send_notifications')}
                    disabled={loading}
                    className="text-xs"
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Уведомить
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export_csv')}
                    disabled={loading}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Экспорт
                  </LamodaButton>
                </div>

                {/* Desktop: Horizontal layout */}
                <div className="hidden md:flex items-center gap-2 flex-wrap">
                  <LamodaButton
                    size="sm"
                    onClick={() => handleBulkAction('mark_shipped')}
                    disabled={loading}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Отметить отправленными
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('print_labels')}
                    disabled={loading}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Печать этикеток
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('send_notifications')}
                    disabled={loading}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Уведомить клиентов
                  </LamodaButton>
                  
                  <LamodaButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export_csv')}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт выбранных
                  </LamodaButton>
                </div>
              </div>
            </div>
          </LamodaCard>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <LamodaCard key={order.id} className={`p-6 transition-all duration-200 ${
              selectedOrders.includes(order.id) ? 'bg-primary/5 border-primary/30' : ''
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Checkbox + Order Info */}
                <div className="flex gap-4 flex-1">
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">#{order.number}</h3>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status).replace('text-', 'bg-')}`} />
                        <span className={`text-xs uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        {urgentOrders > 0 && (
                          <span className="text-xs uppercase tracking-wider text-primary">
                            СРОЧНО
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/60 mb-1">{order.customer.name}</p>
                      <p className="text-xs text-foreground/40">Контактный телефон: {order.customer.phone || 'не указан'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-foreground">
                        {formatCurrency(order.amount)}
                      </div>
                      <div className="text-xs text-foreground/40">
                        {new Date(order.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">
                        Товаров: {order.itemsCount}
                      </span>
                      <span className="text-foreground">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:min-w-[240px]">
                  {/* Mobile: Compact layout */}
                  <div className="md:hidden">
                    {order.status === 'new' && (
                      <div className="grid grid-cols-1 gap-2">
                        <LamodaButton 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderAction(order.id, 'collect');
                          }}
                        >
                          <Package className="h-3 w-3 mr-1" />
                          Собрать заказ
                        </LamodaButton>
                        <div className="grid grid-cols-2 gap-1">
                          <LamodaButton 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderAction(order.id, 'print_label');
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Этикетка
                          </LamodaButton>
                          <LamodaButton 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderAction(order.id, 'details');
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Детали
                          </LamodaButton>
                        </div>
                      </div>
                    )}
                    {order.status === 'processing' && (
                      <div className="grid grid-cols-1 gap-2">
                        <LamodaButton 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderAction(order.id, 'ship');
                          }}
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Отправить
                        </LamodaButton>
                        <div className="grid grid-cols-2 gap-1">
                          <LamodaButton 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderAction(order.id, 'notify');
                            }}
                          >
                            <Bell className="h-3 w-3 mr-1" />
                            Уведомить
                          </LamodaButton>
                          <LamodaButton 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderAction(order.id, 'contact');
                            }}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Клиент
                          </LamodaButton>
                        </div>
                      </div>
                    )}
                    {order.status === 'shipped' && (
                      <div className="grid grid-cols-2 gap-1">
                        <LamodaButton 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderAction(order.id, 'track');
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Трекинг
                        </LamodaButton>
                        <LamodaButton 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderAction(order.id, 'contact');
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Клиент
                        </LamodaButton>
                      </div>
                    )}
                  </div>

                  {/* Desktop: Full layout */}
                  <div className="hidden md:flex md:flex-col gap-2">
                    {order.status === 'new' && (
                      <>
                        <LamodaButton size="sm" className="w-full">
                          <Package className="h-4 w-4 mr-2" />
                          Собрать заказ
                        </LamodaButton>
                        <LamodaButton variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Печать этикетки
                        </LamodaButton>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <>
                        <LamodaButton size="sm" className="w-full">
                          <Truck className="h-4 w-4 mr-2" />
                          Отправить в Lamoda
                        </LamodaButton>
                        <LamodaButton variant="outline" size="sm" className="w-full">
                          <Bell className="h-4 w-4 mr-2" />
                          Уведомить клиента
                        </LamodaButton>
                      </>
                    )}
                    {order.status === 'shipped' && (
                      <LamodaButton variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Отследить посылку
                      </LamodaButton>
                    )}
                    
                    <div className="flex gap-2">
                      <LamodaButton variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Детали
                      </LamodaButton>
                      <LamodaButton variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Клиент
                      </LamodaButton>
                    </div>
                  </div>
                  
                  {/* Deadline Warning - Compact on mobile */}
                  {order.shippingDeadline && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                      <div className="flex items-center gap-1 text-yellow-800">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium md:text-xs text-[10px]">
                          Дедлайн: {new Date(order.shippingDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
            </div>
            </div>
            </LamodaCard>
          ))}
            </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">
              {selectedStatus === 'all' ? 'Заказов пока нет' : 'Нет заказов с выбранным статусом'}
            </p>
          </div>
        )}
              </div>
      </PageWrapper>
      </PageLayout>
      
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Экспорт заказов"
        description="Выберите формат для экспорта данных о заказах"
        itemCount={selectedOrders.length > 0 ? selectedOrders.length : filteredOrders.length}
      />
        </>
  )
} 