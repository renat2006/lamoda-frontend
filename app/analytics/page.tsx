'use client'

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart, 
  Eye,
  RotateCcw,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Share,
  X,
  MapPin,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { 
  ComposedChart, 
  Line, 
  Area,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  BarChart as RechartsBarChart,
  Legend
} from "recharts"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard } from "@/components/ui/lamoda-card"
import { PageLayout } from "@/components/shared/page-layout"
import { cn } from "@/lib/utils"
import { formatCurrency, formatNumber, formatPercentage, formatDate } from '@/lib/format-utils'
import { ExportModal } from '@/components/shared/export-modal'
import { exportProductsToExcel } from '@/lib/excel-export'

// Lamoda Marketplace Analytics Data
const salesData = [
  { month: "Янв", revenue: 125000, orders: 485, commission: 18750, returns: 35, avgRating: 4.2, searchRank: 25 },
  { month: "Фев", revenue: 142000, orders: 523, commission: 21300, returns: 42, avgRating: 4.3, searchRank: 22 },
  { month: "Мар", revenue: 168000, orders: 612, commission: 25200, returns: 28, avgRating: 4.4, searchRank: 18 },
  { month: "Апр", revenue: 195000, orders: 731, commission: 29250, returns: 51, avgRating: 4.5, searchRank: 15 },
  { month: "Май", revenue: 218000, orders: 824, commission: 32700, returns: 33, avgRating: 4.6, searchRank: 12 },
  { month: "Июн", revenue: 234000, orders: 887, commission: 35100, returns: 29, avgRating: 4.7, searchRank: 8 }
]

// Lamoda promotion types
const promotionData = [
  { name: "Ламода Реклама", value: 45, revenue: 1890000, cost: 147000, ctr: 2.8 },
  { name: "Продвижение", value: 25, revenue: 1050000, cost: 89000, ctr: 3.2 },
  { name: "Органика", value: 20, revenue: 840000, cost: 0, ctr: 1.9 },
  { name: "Скидки/Акции", value: 10, revenue: 420000, cost: 25000, ctr: 4.1 }
]

// Product performance segments on Lamoda
const productSegments = [
  { segment: "Топ-продажи", count: 12, revenue: 1890000, avgRating: 4.8, searchPos: 5 },
  { segment: "Стабильные", count: 34, revenue: 1260000, avgRating: 4.4, searchPos: 15 },
  { segment: "Новинки", count: 23, revenue: 756000, avgRating: 4.2, searchPos: 28 },
  { segment: "Проблемные", count: 8, revenue: 294000, avgRating: 3.9, searchPos: 45 }
]

// Weekly sales patterns on Lamoda
const weeklyData = [
  { day: "Пн", orders: 95, revenue: 234000, views: 1250 },
  { day: "Вт", orders: 112, revenue: 276000, views: 1420 },
  { day: "Ср", orders: 98, revenue: 241000, views: 1380 },
  { day: "Чт", orders: 124, revenue: 305000, views: 1560 },
  { day: "Пт", orders: 156, revenue: 384000, views: 1890 },
  { day: "Сб", orders: 189, revenue: 465000, views: 2340 },
  { day: "Вс", orders: 167, revenue: 411000, views: 2120 }
]

const categoryData = [
  { name: "Одежда", value: 45, revenue: 1890000, growth: 12.5 },
  { name: "Обувь", value: 30, revenue: 1260000, growth: 8.3 },
  { name: "Аксессуары", value: 15, revenue: 630000, growth: -2.1 },
  { name: "Спорт", value: 10, revenue: 420000, growth: 15.7 }
]

const regionData = [
  { name: "Москва", value: 35, revenue: 1470000 },
  { name: "СПб", value: 20, revenue: 840000 },
  { name: "Екатеринбург", value: 8, revenue: 336000 },
  { name: "Новосибирск", value: 7, revenue: 294000 },
  { name: "Другие", value: 30, revenue: 1260000 }
]

const topProducts = [
  {
    id: 1,
    name: "Джинсы Slim Fit",
    views: 12450,
    orders: 341,
    conversion: 2.74,
    revenue: 892400,
    stock: 23
  },
  {
    id: 2,
    name: "Кроссовки Nike Air",
    views: 8920,
    orders: 298,
    conversion: 3.34,
    revenue: 2682200,
    stock: 12
  },
  {
    id: 3,
    name: "Платье летнее",
    views: 6730,
    orders: 187,
    conversion: 2.78,
    revenue: 467250,
    stock: 45
  },
  {
    id: 4,
    name: "Рубашка классика",
    views: 5240,
    orders: 156,
    conversion: 2.98,
    revenue: 390000,
    stock: 8
  },
  {
    id: 5,
    name: "Сумка кожаная",
    views: 3910,
    orders: 89,
    conversion: 2.28,
    revenue: 534600,
    stock: 34
  }
]

const COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d']

const metrics = [
  {
    label: "Выручка",
    value: "234 000 ₽",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "За текущий месяц",
    mobile: true,
    target: "250 000 ₽",
    progress: 94
  },
  {
    label: "Заказы",
    value: "887",
    change: "+8.3%", 
    trend: "up",
    icon: ShoppingCart,
    description: "Продано товаров",
    mobile: true,
    target: "950",
    progress: 93
  },
  {
    label: "Рейтинг",
    value: "4.7★",
    change: "+0.1★",
    trend: "up",
    icon: TrendingUp,
    description: "Средний рейтинг",
    mobile: true,
    target: "4.8★",
    progress: 98
  },
  {
    label: "Комиссия Lamoda",
    value: "35 100 ₽",
    change: "+15%",
    trend: "up",
    icon: Target,
    description: "Комиссия платформы",
    mobile: false,
    target: "37 500 ₽",
    progress: 94
  },
  {
    label: "Позиция в поиске",
    value: "№8",
    change: "-4 поз.",
    trend: "down",
    icon: Eye,
    description: "Средняя позиция",
    mobile: false,
    target: "Топ-5",
    progress: 60
  },
  {
    label: "Возвраты",
    value: "29",
    change: "-12%",
    trend: "down",
    icon: RotateCcw,
    description: "Возвратов товаров",
    mobile: false,
    target: "< 25",
    progress: 86
  },
  {
    label: "ROI рекламы",
    value: "286%",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    description: "Lamoda реклама",
    mobile: false,
    target: "300%",
    progress: 95
  },
  {
    label: "Остатки",
    value: "156 шт",
    change: "+23 шт",
    trend: "up",
    icon: Package,
    description: "На складе Lamoda",
    mobile: false,
    target: "200 шт",
    progress: 78
  },
  {
    label: "Отзывы",
    value: "142",
    change: "+18",
    trend: "up",
    icon: Users,
    description: "Новых отзывов",
    mobile: false,
    target: "150",
    progress: 95
  }
]

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview")
  const [selectedChart, setSelectedChart] = useState("revenue")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)

  // Notification functions (simple implementation)
  const showSuccess = (title: string, message: string) => {
    alert(`✅ ${title}: ${message}`)
  }

  const showError = (title: string, message: string) => {
    alert(`❌ ${title}: ${message}`)
  }

  // Export functions for analytics
  const handleExport = async (format: 'excel' | 'csv' | 'json' | 'pdf') => {
    try {
      switch (format) {
        case 'excel':
          await handleExportExcel()
          break
          
        case 'json':
          handleExportJSON()
          break
          
        case 'pdf':
          await handleExportPDF()
          break
          
        default:
          handleExportCSV()
      }
    } catch (error) {
      showError('Ошибка экспорта', 'Не удалось экспортировать данные аналитики')
    }
  }

  const handleExportExcel = async () => {
    try {
      // Prepare analytics data for Excel export
      const analyticsData = [
        {
          id: 'sales_summary',
          name: 'Сводка продаж',
          sellerSku: 'ANALYTICS_001',
          category: 'Аналитика',
          price: 0,
          stock: 0,
          status: 'active' as const,
          salesLast30Days: salesData[salesData.length - 1]?.orders || 0,
          rating: salesData[salesData.length - 1]?.avgRating || 0,
          createdAt: new Date().toISOString(),
          views: weeklyData.reduce((sum, day) => sum + day.views, 0),
          conversion: 0,
          sales: salesData.reduce((sum, month) => sum + month.orders, 0),
          urgent: false,
          lowStock: false
        }
      ]

      await exportProductsToExcel(analyticsData, {
        includeAnalytics: true,
        includeInventory: false
      })

      showSuccess('Excel экспорт завершен', 'Аналитические данные экспортированы в Excel с несколькими листами')
    } catch (error) {
      showError('Ошибка Excel экспорта', 'Не удалось создать Excel файл')
    }
  }

  const handleExportJSON = () => {
    try {
      const analyticsReport = {
        exportDate: new Date().toISOString(),
        period: selectedPeriod,
        metrics: metrics.map(metric => ({
          label: metric.label,
          value: metric.value,
          change: metric.change,
          trend: metric.trend,
          target: metric.target,
          progress: metric.progress
        })),
        salesData: salesData,
        promotionData: promotionData,
        productSegments: productSegments,
        weeklyData: weeklyData,
        categoryData: categoryData,
        regionData: regionData,
        topProducts: topProducts
      }

      const blob = new Blob([JSON.stringify(analyticsReport, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      showSuccess('JSON экспорт завершен', 'Аналитический отчет экспортирован в JSON')
    } catch (error) {
      showError('Ошибка JSON экспорта', 'Не удалось экспортировать данные в JSON')
    }
  }

  const handleExportCSV = () => {
    try {
      const csvData = [
        // Header row
        ['Показатель', 'Значение', 'Изменение', 'Тренд', 'Цель', 'Прогресс'],
        // Metrics data
        ...metrics.map(metric => [
          metric.label,
          metric.value,
          metric.change,
          metric.trend === 'up' ? 'Рост' : 'Снижение',
          metric.target,
          `${metric.progress}%`
        ]),
        // Empty row separator
        [],
        // Sales data header
        ['Месяц', 'Выручка', 'Заказы', 'Комиссия', 'Возвраты', 'Рейтинг'],
        // Sales data
        ...salesData.map(month => [
          month.month,
          month.revenue.toString(),
          month.orders.toString(),
          month.commission.toString(),
          month.returns.toString(),
          month.avgRating.toString()
        ])
      ]

      const csvString = csvData.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n')

      const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      
      showSuccess('CSV экспорт завершен', 'Аналитические данные экспортированы в CSV')
    } catch (error) {
      showError('Ошибка CSV экспорта', 'Не удалось экспортировать данные в CSV')
    }
  }

  const handleExportPDF = async () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Аналитический отчет</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #dc2626; padding-bottom: 20px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9; }
            .metric-value { font-size: 24px; font-weight: bold; color: #dc2626; }
            .metric-change { font-size: 14px; margin-top: 5px; }
            .trend-up { color: #059669; }
            .trend-down { color: #dc2626; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .data-table th { background: #f3f4f6; font-weight: bold; }
            .summary-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .stat-item { text-align: center; padding: 10px; background: #f9f9f9; border-radius: 5px; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Аналитический отчет Lamoda</h1>
            <p>Дата создания: ${formatDate(new Date())}</p>
            <p>Период: ${periods.find(p => p.id === selectedPeriod)?.label || 'Месяц'}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Ключевые показатели</div>
            <div class="metrics-grid">
              ${metrics.map(metric => `
                <div class="metric-card">
                  <div class="metric-value">${metric.value}</div>
                  <div style="font-weight: bold; margin: 5px 0;">${metric.label}</div>
                  <div class="metric-change ${metric.trend === 'up' ? 'trend-up' : 'trend-down'}">
                    ${metric.change} (${metric.trend === 'up' ? '↗' : '↘'})
                  </div>
                  <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    Цель: ${metric.target} | Прогресс: ${metric.progress}%
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Динамика продаж по месяцам</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Месяц</th>
                  <th>Выручка</th>
                  <th>Заказы</th>
                  <th>Комиссия</th>
                  <th>Возвраты</th>
                  <th>Рейтинг</th>
                </tr>
              </thead>
              <tbody>
                ${salesData.map(month => `
                  <tr>
                    <td>${month.month}</td>
                    <td>${formatCurrency(month.revenue)}</td>
                    <td>${month.orders}</td>
                    <td>${formatCurrency(month.commission)}</td>
                    <td>${month.returns}</td>
                    <td>${month.avgRating}★</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Топ товаров</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Просмотры</th>
                  <th>Заказы</th>
                  <th>Конверсия</th>
                  <th>Выручка</th>
                </tr>
              </thead>
              <tbody>
                ${topProducts.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${formatNumber(product.views)}</td>
                    <td>${product.orders}</td>
                    <td>${product.conversion}%</td>
                    <td>${formatCurrency(product.revenue)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Сводная статистика</div>
            <div class="summary-stats">
              <div class="stat-item">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">
                  ${formatCurrency(salesData.reduce((sum, month) => sum + month.revenue, 0))}
                </div>
                <div>Общая выручка</div>
              </div>
              <div class="stat-item">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">
                  ${salesData.reduce((sum, month) => sum + month.orders, 0)}
                </div>
                <div>Всего заказов</div>
              </div>
              <div class="stat-item">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">
                  ${(salesData.reduce((sum, month) => sum + month.avgRating, 0) / salesData.length).toFixed(1)}★
                </div>
                <div>Средний рейтинг</div>
              </div>
              <div class="stat-item">
                <div style="font-size: 20px; font-weight: bold; color: #dc2626;">
                  ${salesData.reduce((sum, month) => sum + month.returns, 0)}
                </div>
                <div>Всего возвратов</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>Отчет создан автоматически системой аналитики Lamoda</p>
            <p>Данные актуальны на ${formatDate(new Date())}</p>
          </div>
        </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
        
        showSuccess('PDF экспорт начат', 'Откроется диалог печати для сохранения отчета в PDF')
      } else {
        throw new Error('Не удалось открыть окно печати')
      }
    } catch (error) {
      showError('Ошибка PDF экспорта', 'Не удалось создать PDF файл')
    }
  }

  // Mobile chart selection
  const chartOptions = [
    { id: "revenue", label: "Выручка", icon: DollarSign },
    { id: "orders", label: "Заказы", icon: ShoppingCart },
    { id: "conversion", label: "Конверсия", icon: Target }
  ]

  const periods = [
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
    { id: "quarter", label: "Квартал" },
    { id: "year", label: "Год" }
  ]

  return (
    <PageLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Mobile Header with Quick Stats */}
        <div className="md:hidden bg-white border-b border-border p-4 -m-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-light text-foreground">Аналитика</h1>
            <div className="flex items-center gap-2">
              <LamodaButton variant="ghost" size="sm" onClick={() => setIsFilterOpen(true)}>
                <Filter className="h-4 w-4" />
              </LamodaButton>
              <LamodaButton 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Аналитика Lamoda',
                      text: `Текущие показатели: Выручка ${metrics[0].value}, Заказы ${metrics[1].value}, Рейтинг ${metrics[2].value}`,
                      url: window.location.href
                    })
                  } else {
                    showSuccess('Ссылка скопирована', 'Ссылка на отчет скопирована в буфер обмена')
                  }
                }}
              >
                <Share className="h-4 w-4" />
              </LamodaButton>
            </div>
          </div>
          
          {/* Mobile Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {metrics.filter(m => m.mobile).map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-foreground/40" />
                  </div>
                  <div className="text-xl font-light text-foreground">{metric.value}</div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                  <div className={cn(
                    "text-xs font-medium flex items-center justify-center gap-1",
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-foreground">Аналитика продаж</h1>
            <p className="text-sm text-foreground/40 mt-1">
              Статистика и показатели эффективности
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-border focus:outline-none focus:border-foreground text-sm"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
              ))}
            </select>
            
            <LamodaButton 
              variant="outline" 
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="h-4 w-4" />
              Экспорт
            </LamodaButton>
          </div>
        </div>

        {/* Enhanced Desktop Metrics Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <LamodaCard key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-xs text-foreground/40 uppercase tracking-wider mb-2">
                      {metric.label}
                    </div>
                    <div className="text-3xl font-light text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {metric.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Icon className="h-5 w-5 text-foreground/40" />
                    <div className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    )}>
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar and target */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground/60">Цель: {metric.target}</span>
                    <span className={cn(
                      "font-medium",
                      metric.progress >= 100 ? "text-green-600" : 
                      metric.progress >= 80 ? "text-amber-600" : "text-red-600"
                    )}>
                      {metric.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        metric.progress >= 100 ? "bg-green-500" : 
                        metric.progress >= 80 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${Math.min(metric.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </LamodaCard>
            )
          })}
        </div>

        {/* Mobile Chart Selector */}
        <div className="md:hidden">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {chartOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedChart(option.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 border transition-colors whitespace-nowrap",
                    selectedChart === option.id
                      ? "border-foreground bg-muted/20"
                      : "border-border hover:border-foreground/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Chart */}
        <LamodaCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-light text-foreground">
              Динамика продаж
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <LamodaButton 
                variant={viewMode === "overview" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("overview")}
              >
                Обзор
              </LamodaButton>
              <LamodaButton 
                variant={viewMode === "detailed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("detailed")}
              >
                Детально
              </LamodaButton>
            </div>
          </div>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0px',
                    fontSize: '12px'
                  }}
                />
                
                {/* Mobile: Show only selected chart */}
                {selectedChart === "revenue" && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    className="md:hidden"
                  />
                )}
                {selectedChart === "orders" && (
                  <Bar dataKey="orders" fill="#dc2626" className="md:hidden" />
                )}
                {selectedChart === "conversion" && (
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    className="md:hidden"
                  />
                )}
                
                {/* Desktop: Show all charts */}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  className="hidden md:block"
                />
                <Bar dataKey="orders" fill="#ea580c" opacity={0.7} className="hidden md:block" />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  className="hidden md:block"
                />
                <Legend className="hidden md:flex" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </LamodaCard>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Lamoda Promotion Types */}
          <LamodaCard className="p-4 md:p-6">
            <h3 className="text-lg font-light text-foreground mb-4">
              Источники продаж на Lamoda
            </h3>
            
            <div className="space-y-4">
              {promotionData.map((source, index) => {
                const roi = source.cost > 0 ? ((source.revenue / source.cost) * 100 - 100).toFixed(0) : '∞'
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {source.name}
                        </div>
                        <div className="text-xs text-foreground/60">
                          CTR: {source.ctr}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {source.value}%
                      </div>
                      <div className="text-xs text-primary">
                        ROI: {roi}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </LamodaCard>

          {/* Product Performance Segments */}
          <LamodaCard className="p-4 md:p-6">
            <h3 className="text-lg font-light text-foreground mb-4">
              Сегменты товаров
            </h3>
            
            <div className="space-y-4">
              {productSegments.map((segment, index) => (
                <div key={index} className="p-3 border border-border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {segment.segment}
                    </span>
                    <span className="text-sm text-foreground/60">
                      {segment.count} товаров
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-foreground/40 uppercase tracking-wider">Выручка</div>
                      <div className="font-medium text-foreground">
                        {(segment.revenue / 1000000).toFixed(1)}M ₽
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/40 uppercase tracking-wider">Рейтинг</div>
                      <div className="font-medium text-foreground">
                        {segment.avgRating}★
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/40 uppercase tracking-wider">Позиция</div>
                      <div className="font-medium text-primary">
                        №{segment.searchPos}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LamodaCard>
        </div>

        {/* Hourly Sales Pattern */}
        <LamodaCard className="p-4 md:p-6">
          <h3 className="text-lg font-light text-foreground mb-4">
            Почасовая динамика продаж
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'orders' ? `${value} заказов` : `${formatNumber(Number(value))}`,
                    name === 'orders' ? 'Заказы' : name === 'views' ? 'Просмотры' : 'Выручка'
                  ]}
                />
                <Bar dataKey="orders" fill="#dc2626" name="orders" />
                <Bar dataKey="views" fill="#94a3b8" name="views" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </LamodaCard>

        {/* Two Column Layout - Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Category Performance */}
          <LamodaCard className="p-4 md:p-6">
            <h3 className="text-lg font-light text-foreground mb-4">
              Продажи по категориям
            </h3>
            
            {/* Mobile: List View */}
            <div className="md:hidden space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {category.value}%
                    </div>
                    <div className={cn(
                      "text-xs flex items-center gap-1",
                      category.growth > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {category.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(category.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop: Chart View */}
            <div className="hidden md:block h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                                         label={({ name, value }: { name: string, value: number }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </LamodaCard>

          {/* Geographic Distribution */}
          <LamodaCard className="p-4 md:p-6">
            <h3 className="text-lg font-light text-foreground mb-4">
              География продаж
            </h3>
            
            <div className="space-y-3">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-foreground/40" />
                    <span className="text-sm text-foreground">{region.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {region.value}%
                    </div>
                    <div className="text-xs text-foreground/60">
                      {formatCurrency(region.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LamodaCard>
        </div>

        {/* Top Products Table - Mobile Optimized */}
        <LamodaCard className="p-4 md:p-6">
          <h3 className="text-lg font-light text-foreground mb-4">
            Топ товаров
          </h3>
          
          {/* Mobile: Card Layout */}
          <div className="md:hidden space-y-3">
            {(showAllProducts ? topProducts : topProducts.slice(0, 3)).map((product, index) => (
              <div key={product.id} className="p-3 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/40 font-mono">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-foreground/40 uppercase tracking-wider">Просмотры</span>
                    <div className="font-medium text-foreground">{formatNumber(product.views)}</div>
                  </div>
                  <div>
                    <span className="text-foreground/40 uppercase tracking-wider">Заказы</span>
                    <div className="font-medium text-foreground">{product.orders}</div>
                  </div>
                  <div>
                    <span className="text-foreground/40 uppercase tracking-wider">Конверсия</span>
                    <div className="font-medium text-primary">{product.conversion}%</div>
                  </div>
                </div>
              </div>
            ))}
            
            <LamodaButton 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              {showAllProducts ? 'Показать меньше' : 'Показать все товары'}
            </LamodaButton>
          </div>
          
          {/* Desktop: Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Товар
                  </th>
                  <th className="text-right py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Просмотры
                  </th>
                  <th className="text-right py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Заказы
                  </th>
                  <th className="text-right py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Конверсия
                  </th>
                  <th className="text-right py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Выручка
                  </th>
                  <th className="text-right py-3 text-xs text-foreground/40 uppercase tracking-wider">
                    Остаток
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b border-border/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-foreground/40 font-mono w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-sm text-foreground">
                      {formatNumber(product.views)}
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-foreground">
                      {product.orders}
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-primary">
                      {product.conversion}%
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-foreground">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="py-4 text-right">
                      <span className={cn(
                        "text-sm",
                        product.stock < 15 ? "text-amber-600 font-medium" : "text-foreground"
                      )}>
                        {product.stock} шт
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LamodaCard>

        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">Фильтры</h2>
              <LamodaButton variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </LamodaButton>
            </div>
            
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Период</label>
                <div className="space-y-2">
                  {periods.map(period => (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={cn(
                        "w-full text-left p-3 border transition-colors",
                        selectedPeriod === period.id 
                          ? "border-foreground bg-muted/20" 
                          : "border-border hover:border-foreground/50"
                      )}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
              <LamodaButton 
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                Применить фильтры
              </LamodaButton>
            </div>
          </div>
        )}

        {/* AI-Powered Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Expert Recommendations */}
          <LamodaCard className="p-4 md:p-6 bg-red-50 border-red-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h3 className="text-lg font-light text-foreground">
                AI Рекомендации для Lamoda
              </h3>
            </div>
            
            <div className="space-y-4 text-sm text-foreground/80">
              <div className="p-3 bg-white rounded border-l-4 border-amber-500">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <strong className="text-amber-600">Высокий приоритет</strong>
                </div>
                <p>
                  Позиция в поиске улучшилась до №8. Активизируйте сбор отзывов 
                  для попадания в топ-5 и увеличения органических продаж на 25%.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <strong className="text-blue-600">Продвижение</strong>
                </div>
                <p>
                  ROI рекламы Lamoda 286%. Увеличьте бюджет на топ-продажи 
                  и добавьте новые товары в продвижение для роста выручки.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-green-600" />
                  <strong className="text-green-600">Качество</strong>
                </div>
                <p>
                  Возвраты снизились до 29 штук. Проанализируйте "проблемные" 
                  товары и улучшите их описания для сокращения возвратов.
                </p>
              </div>
              
              <div className="md:hidden">
                <LamodaButton 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    showSuccess('Отчет подготовлен', 'Подробный AI-отчет будет отправлен на вашу почту в течение 5 минут')
                  }}
                >
                  Подробный отчет
                </LamodaButton>
              </div>
            </div>
          </LamodaCard>

          {/* Performance Benchmarks */}
          <LamodaCard className="p-4 md:p-6">
            <h3 className="text-lg font-light text-foreground mb-4">
              Бенчмарки маркетплейсов
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium text-foreground">Рейтинг</div>
                  <div className="text-xs text-foreground/60">Ваш результат: 4.7★</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">
                    +9% к среднему
                  </div>
                  <div className="text-xs text-foreground/60">Маркетплейс: 4.3★</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium text-foreground">ROI рекламы</div>
                  <div className="text-xs text-foreground/60">Ваш результат: 286%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">
                    +43% к среднему
                  </div>
                  <div className="text-xs text-foreground/60">Маркетплейс: 200%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="text-sm font-medium text-foreground">Позиция в поиске</div>
                  <div className="text-xs text-foreground/60">Ваш результат: №8</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600 font-medium">
                    Средний показатель
                  </div>
                  <div className="text-xs text-foreground/60">Цель: Топ-5</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-xs text-blue-800 mb-1">💡 Совет для Lamoda</div>
                <div className="text-sm text-blue-900">
                  Инвестируйте в качественные фото и видео товаров - это 
                  увеличивает продажи на маркетплейсах на 20-30%.
                </div>
              </div>
            </div>
          </LamodaCard>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(format: string) => {
          switch (format) {
            case 'xlsx':
              handleExport('excel')
              break
            case 'json':
              handleExport('json')
              break
            case 'pdf':
              handleExport('pdf')
              break
            default:
              handleExport('csv')
          }
        }}
        title="Экспорт аналитики"
        description="Выберите формат для экспорта аналитических данных"
        itemCount={salesData.length + topProducts.length}
      />
    </PageLayout>
  )
} 