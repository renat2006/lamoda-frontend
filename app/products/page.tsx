"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Package,
  AlertCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard } from "@/components/ui/lamoda-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageWrapper, AnimatedCard } from "@/components/shared"
import { PageLayout } from "@/components/shared/page-layout"
import { cn } from "@/lib/utils"
import { useNotification } from '@/components/shared/notification-modal'
import { ExportModal } from '@/components/shared/export-modal'
import { exportData } from '@/lib/export-utils'
import { formatCurrency, formatNumber, formatDate } from '@/lib/format-utils'
import { exportProductsToExcel, exportProductTemplate } from '@/lib/excel-export'
import { ProductModal } from '@/components/shared/product-modal'

interface Product {
  id: string
  name: string
  sellerSku: string
  category: string
  price: number
  stock: number
  status: "active" | "moderation" | "rejected" | "draft"
  imageUrl?: string
  salesLast30Days: number
  rating: number
  createdAt: string
  rejectionReason?: string
  urgent: boolean
  lowStock: boolean
  sales: number
  views: number
  conversion: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Джинсы slim fit",
    sellerSku: "JEANS001",
    category: "Джинсы",
    price: 3299,
    stock: 5,
    status: "active",
    imageUrl: "/api/placeholder/300/400",
    salesLast30Days: 45,
    rating: 4.3,
    createdAt: "2024-01-15",
    urgent: true,
    lowStock: true,
    sales: 45,
    views: 234,
    conversion: 19.2
  },
  {
    id: "2", 
    name: "Кроссовки Nike Air Max",
    sellerSku: "NIKE001",
    category: "Обувь",
    price: 8999,
    stock: 0,
    status: "moderation",
    imageUrl: "/api/placeholder/300/400",
    salesLast30Days: 0,
    rating: 0,
    createdAt: "2024-01-20",
    urgent: false,
    lowStock: false,
    sales: 0,
    views: 67,
    conversion: 0
  },
  {
    id: "3",
    name: "Платье летнее",
    sellerSku: "DRESS001", 
    category: "Платья",
    price: 2499,
    stock: 23,
    status: "rejected",
    imageUrl: "/api/placeholder/300/400",
    salesLast30Days: 0,
    rating: 0,
    createdAt: "2024-01-22",
    rejectionReason: "Недостаточно качественные фотографии",
    urgent: true,
    lowStock: false,
    sales: 0,
    views: 89,
    conversion: 0
  },
  {
    id: "4",
    name: "Джинсы Levi's 501",
    sellerSku: "LEVIS-501-W32L34",
    category: "Одежда / Джинсы",
    price: 6990,
    stock: 8,
    status: "moderation",
    imageUrl: "/products/levis-jeans.jpg",
    salesLast30Days: 0,
    rating: 0,
    createdAt: "2024-02-01",
    urgent: false,
    lowStock: false,
    sales: 0,
    views: 0,
    conversion: 0
  }
]

const statusConfig = {
  active: {
    label: "Активен",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Товар в продаже"
  },
  moderation: {
    label: "На модерации",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: Clock,
    description: "Проверка займет до 24 часов"
  },
  rejected: {
    label: "Отклонен",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    description: "Требует исправления"
  },
  draft: {
    label: "Черновик",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Edit,
    description: "Не опубликован"
  }
}

const statusMap = {
  active: { 
    label: "Активен", 
    color: "bg-green-100 text-green-800",
    dot: "bg-green-500"
  },
  moderation: { 
    label: "Модерация", 
    color: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-500"
  },
  rejected: { 
    label: "Отклонён", 
    color: "bg-red-100 text-red-800",
    dot: "bg-red-500"
  },
  draft: { 
    label: "Черновик", 
    color: "bg-gray-100 text-gray-800",
    dot: "bg-gray-500"
  }
}

const categories = ["Все", "Одежда", "Обувь", "Аксессуары", "Джинсы", "Платья"]
const statuses = ["Все", "Активен", "Модерация", "Отклонён", "Черновик"]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [selectedStatus, setSelectedStatus] = useState("Все")
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isProductLoading, setIsProductLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [stockFilter, setStockFilter] = useState<string>("all")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Mobile-specific states
  const [viewMode, setViewMode] = useState<"grid" | "list">("list") // Default to list for mobile
  const [sortBy, setSortBy] = useState("name")
  
  const { showNotification, showSuccess, showError, showConfirm } = useNotification()

  // Product management functions
  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async (productData: any) => {
    setIsProductLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: productData.name,
                category: productData.category,
                price: productData.variants[0]?.price || p.price,
                stock: productData.variants[0]?.stock || p.stock,
                sellerSku: productData.variants[0]?.sku || p.sellerSku
              }
            : p
        ))
        showSuccess('Товар обновлен', 'Изменения в товаре успешно сохранены')
      } else {
        // Create new product
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productData.name,
          sellerSku: productData.variants[0]?.sku || '',
          category: productData.category,
          price: productData.variants[0]?.price || 0,
          stock: productData.variants[0]?.stock || 0,
          status: 'draft',
          salesLast30Days: 0,
          rating: 0,
          createdAt: new Date().toISOString().split('T')[0],
          urgent: false,
          lowStock: false,
          sales: 0,
          views: 0,
          conversion: 0,

        }
        setProducts(prev => [newProduct, ...prev])
        showSuccess('Товар создан', 'Новый товар добавлен в каталог')
      }
      
      setIsProductModalOpen(false)
      setEditingProduct(null)
    } catch (error) {
      showError('Ошибка', 'Не удалось сохранить товар')
    } finally {
      setIsProductLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm('Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.')
    
    if (confirmed) {
      setProducts(prev => prev.filter(p => p.id !== productId))
      showSuccess('Товар удален', 'Товар был успешно удален из каталога')
    }
  }

  const handleDuplicateProduct = async (product: Product) => {
    setIsProductLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const duplicatedProduct: Product = {
        ...product,
        id: Date.now().toString(),
        name: `${product.name} (копия)`,
        sellerSku: `${product.sellerSku}-COPY`,
        status: 'draft',
        salesLast30Days: 0,
        sales: 0,
        views: 0,
        conversion: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setProducts(prev => [duplicatedProduct, ...prev])
      showSuccess('Товар скопирован', 'Копия товара создана и добавлена в каталог')
    } catch (error) {
      showError('Ошибка', 'Не удалось скопировать товар')
    } finally {
      setIsProductLoading(false)
    }
  }

  // Export functions
  const handleExport = async (format: 'excel' | 'csv' | 'json' | 'pdf') => {
    try {
      const productsToExport = selectedProducts.length > 0 
        ? products.filter(product => selectedProducts.includes(product.id))
        : filteredProducts
      
      switch (format) {
        case 'excel':
          await exportProductsToExcel(productsToExport, {
            includeAnalytics: true,
            includeInventory: true
          })
          showSuccess('Экспорт завершен', `Экспортировано ${productsToExport.length} товаров в Excel`)
          break
          
        case 'json':
          handleExportJSON(productsToExport)
          break
          
        case 'pdf':
          await handleExportPDF(productsToExport)
          break
          
        default:
          handleExportProductsCSV()
      }
    } catch (error) {
      showError('Ошибка экспорта', 'Не удалось экспортировать данные')
    }
  }

  const handleExportTemplate = () => {
    try {
      exportProductTemplate()
      showSuccess('Шаблон скачан', 'Шаблон для импорта товаров успешно скачан')
    } catch (error) {
      showError('Ошибка', 'Не удалось скачать шаблон')
    }
  }

  const handleExportJSON = (productsToExport: Product[]) => {
    try {
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalProducts: productsToExport.length,
        products: productsToExport.map(product => ({
          id: product.id,
          name: product.name,
          sellerSku: product.sellerSku,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.status,
          salesLast30Days: product.salesLast30Days,
          rating: product.rating,
          views: product.views,
          conversion: product.conversion,
          createdAt: product.createdAt,
          imageUrl: product.imageUrl,
          rejectionReason: product.rejectionReason,
          urgent: product.urgent,
          lowStock: product.lowStock
        }))
      }

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      showSuccess('JSON экспорт завершен', `Экспортировано ${productsToExport.length} товаров в JSON`)
    } catch (error) {
      showError('Ошибка JSON экспорта', 'Не удалось экспортировать данные в JSON')
    }
  }

  const handleExportPDF = async (productsToExport: Product[]) => {
    try {
      // Создаем HTML для PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Отчет по товарам</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .product { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
            .product-header { font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .product-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
            .detail-item { padding: 5px 0; }
            .label { font-weight: bold; color: #666; }
            .status { padding: 3px 8px; border-radius: 3px; font-size: 12px; }
            .status-active { background: #dcfce7; color: #166534; }
            .status-moderation { background: #fef3c7; color: #92400e; }
            .status-rejected { background: #fee2e2; color: #991b1b; }
            .status-draft { background: #f3f4f6; color: #374151; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Отчет по товарам</h1>
            <p>Дата создания: ${formatDate(new Date())}</p>
          </div>
          
          <div class="summary">
            <h2>Сводная информация</h2>
            <p><strong>Всего товаров:</strong> ${productsToExport.length}</p>
            <p><strong>Активных:</strong> ${productsToExport.filter(p => p.status === 'active').length}</p>
            <p><strong>На модерации:</strong> ${productsToExport.filter(p => p.status === 'moderation').length}</p>
            <p><strong>Отклоненных:</strong> ${productsToExport.filter(p => p.status === 'rejected').length}</p>
            <p><strong>Черновиков:</strong> ${productsToExport.filter(p => p.status === 'draft').length}</p>
          </div>
          
          <div class="products">
            ${productsToExport.map(product => `
              <div class="product">
                <div class="product-header">${product.name}</div>
                <div class="product-details">
                  <div class="detail-item">
                    <span class="label">Артикул:</span> ${product.sellerSku}
                  </div>
                  <div class="detail-item">
                    <span class="label">Категория:</span> ${product.category}
                  </div>
                  <div class="detail-item">
                    <span class="label">Цена:</span> ${formatCurrency(product.price)}
                  </div>
                  <div class="detail-item">
                    <span class="label">Остаток:</span> ${product.stock}
                  </div>
                  <div class="detail-item">
                    <span class="label">Статус:</span> 
                    <span class="status status-${product.status}">
                      ${statusConfig[product.status as keyof typeof statusConfig]?.label || product.status}
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Продажи (30 дней):</span> ${product.salesLast30Days}
                  </div>
                  <div class="detail-item">
                    <span class="label">Рейтинг:</span> ${product.rating}
                  </div>
                  <div class="detail-item">
                    <span class="label">Просмотры:</span> ${product.views}
                  </div>
                  <div class="detail-item">
                    <span class="label">Конверсия:</span> ${product.conversion}%
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p>Отчет создан автоматически системой управления товарами Lamoda</p>
          </div>
        </body>
        </html>
      `
      
      // Создаем и скачиваем PDF через print
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Небольшая задержка для загрузки стилей
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
        
        showSuccess('PDF экспорт начат', 'Откроется диалог печати для сохранения в PDF')
      } else {
        throw new Error('Не удалось открыть окно печати')
      }
    } catch (error) {
      showError('Ошибка PDF экспорта', 'Не удалось создать PDF файл')
    }
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sellerSku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Все" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "Все" || statusConfig[product.status as keyof typeof statusConfig]?.label === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Seller tools functions
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      showError('Ошибка', 'Выберите товары для выполнения действия');
      return;
    }

    setLoading(true)
    
    try {
      switch (action) {
        case 'bulk_edit_price':
          await new Promise(resolve => setTimeout(resolve, 1500))
          const newPrice = prompt(`Введите новую цену для ${selectedProducts.length} товаров:`)
          if (newPrice && !isNaN(Number(newPrice))) {
            setProducts(prev => prev.map(p => 
              selectedProducts.includes(p.id) 
                ? { ...p, price: Number(newPrice) }
                : p
            ))
            showSuccess('Цены обновлены', `Цены обновлены для ${selectedProducts.length} товаров`)
          }
          break
          
        case 'update_stock':
          await new Promise(resolve => setTimeout(resolve, 1200))
          const newStock = prompt(`Введите новый остаток для ${selectedProducts.length} товаров:`)
          if (newStock && !isNaN(Number(newStock))) {
            setProducts(prev => prev.map(p => 
              selectedProducts.includes(p.id) 
                ? { ...p, stock: Number(newStock) }
                : p
            ))
            showSuccess('Остатки обновлены', `Остатки обновлены для ${selectedProducts.length} товаров`)
          }
          break
          
        case 'export_csv':
          setIsExportModalOpen(true)
          break
          
        case 'resubmit_moderation':
    await new Promise(resolve => setTimeout(resolve, 1000))
          showSuccess('Отправлено на модерацию', `${selectedProducts.length} товаров отправлено на повторную модерацию`)
          break
          
        case 'update_images':
          await new Promise(resolve => setTimeout(resolve, 2000))
          showSuccess('Фотографии обновлены', `Фотографии обновлены для ${selectedProducts.length} товаров`)
          break
          
        default:
          console.log(`Unknown bulk action: ${action}`)
      }
    } catch (error) {
      showError('Ошибка', 'Произошла ошибка при выполнении действия')
    } finally {
    setLoading(false)
      if (action !== 'export_csv') {
        setSelectedProducts([])
        setBulkAction("")
      }
    }
  }

  const handleExportProductsCSV = () => {
    const productsToExport = selectedProducts.length > 0 
      ? enhancedFilteredProducts.filter(product => selectedProducts.includes(product.id))
      : enhancedFilteredProducts
    
    const csvData = productsToExport.map(product => ({
      'Артикул': product.sellerSku,
      'Название': product.name,
      'Категория': product.category,
      'Цена': product.price,
      'Остаток': product.stock,
      'Статус': statusConfig[product.status as keyof typeof statusConfig]?.label,
      'Продажи 30 дней': product.salesLast30Days,
      'Рейтинг': product.rating,
      'Просмотры': product.views,
      'Конверсия': product.conversion + '%'
    }))
    
    // Convert to CSV format with proper escaping
    const headers = Object.keys(csvData[0])
    const csvString = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n')
    
    // Download CSV file with BOM for proper encoding
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    showSuccess('Экспорт завершен', `Экспортировано ${productsToExport.length} товаров`)
  }

  const optimizeSEO = async (productId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate SEO optimization analysis
      const suggestions = [
        'Добавить больше ключевых слов в название',
        'Улучшить описание товара',
        'Добавить размерную сетку',
        'Оптимизировать теги'
      ]
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      showSuccess('SEO анализ завершен', `Рекомендация: ${randomSuggestion}`)
    } catch (error) {
      showError('Ошибка', 'Не удалось выполнить SEO анализ')
    } finally {
      setLoading(false)
    }
  }

  const updatePricing = async (productId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Simulate competitor price analysis
      const currentPrice = products.find(p => p.id === productId)?.price || 0
      const competitorPrice = Math.round(currentPrice * (0.9 + Math.random() * 0.2))
      const suggested = Math.round(competitorPrice * 0.95)
      
      const message = `Анализ конкурентов завершен!\n\nТекущая цена: ${formatCurrency(currentPrice)}\nСредняя цена конкурентов: ${formatCurrency(competitorPrice)}\nРекомендуемая цена: ${formatCurrency(suggested)}`
      
      const confirmed = confirm(`${message}\n\nПрименить рекомендуемую цену?`)
      
      if (confirmed) {
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, price: suggested } : p
        ))
        showSuccess('Цена обновлена', `Новая цена: ${formatCurrency(suggested)}`)
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось выполнить анализ цен')
    } finally {
      setLoading(false)
    }
  }

  const handleProductAction = async (productId: string, action: string) => {
    setLoading(true)
    
    try {
      switch (action) {
        case 'edit':
          const editProduct = products.find(p => p.id === productId)
          if (editProduct) {
            handleEditProduct(editProduct)
          }
          break
          
        case 'view_on_lamoda':
          // Open Lamoda product page
          window.open(`https://lamoda.ru/product/${productId}`, '_blank')
          break
          
        case 'update_photos':
          await new Promise(resolve => setTimeout(resolve, 1500))
          showSuccess('Фотографии обновлены', 'Фотографии товара успешно обновлены')
          break
          
        case 'download_data':
          // Download product data as JSON
          const product = products.find(p => p.id === productId)
          if (product) {
            const dataStr = JSON.stringify(product, null, 2)
            const blob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `product_${productId}_data.json`
            a.click()
          }
          break
          
        case 'unpublish':
          const confirmed = confirm('Снять товар с публикации?')
          if (confirmed) {
            await new Promise(resolve => setTimeout(resolve, 800))
            setProducts(prev => prev.map(p => 
              p.id === productId ? { ...p, status: 'draft' as const } : p
            ))
            showSuccess('Товар снят с публикации', 'Товар переведен в черновики')
          }
          break
          
        case 'restock':
          const newStock = prompt('Введите количество для пополнения:')
          if (newStock && !isNaN(Number(newStock))) {
            await new Promise(resolve => setTimeout(resolve, 600))
            setProducts(prev => prev.map(p => 
              p.id === productId ? { ...p, stock: p.stock + Number(newStock) } : p
            ))
            showSuccess('Остатки пополнены', `Добавлено ${newStock} единиц товара`)
          }
          break
          
        case 'publish':
          await new Promise(resolve => setTimeout(resolve, 1000))
          setProducts(prev => prev.map(p => 
            p.id === productId ? { ...p, status: 'moderation' as const } : p
          ))
          showSuccess('Товар отправлен на модерацию', 'Статус товара изменен на "На модерации"')
          break
          
        case 'fix_rejection':
          const fixProduct = products.find(p => p.id === productId)
          if (fixProduct) {
            handleEditProduct(fixProduct)
          }
          break
          
        default:
          console.log(`Unknown product action: ${action}`)
      }
    } catch (error) {
      showError('Ошибка', 'Произошла ошибка при выполнении действия')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced filter functionality
  const enhancedFilteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sellerSku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Все" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "Все" || statusConfig[product.status as keyof typeof statusConfig]?.label === selectedStatus
    
    // Price range filter
    const matchesPriceRange = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                             (!priceRange.max || product.price <= parseInt(priceRange.max))
    
    // Stock filter
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "low" && product.stock < 10) ||
                        (stockFilter === "zero" && product.stock === 0) ||
                        (stockFilter === "available" && product.stock > 10)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange && matchesStock
  })

  // Stats for mobile dashboard
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === "active").length,
    moderation: products.filter(p => p.status === "moderation").length,
    rejected: products.filter(p => p.status === "rejected").length,
    lowStock: products.filter(p => p.lowStock).length,
    urgent: products.filter(p => p.urgent).length
  }

  return (
    <PageLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Mobile Stats Bar */}
        <div className="md:hidden bg-gradient-to-r from-white to-gray-50 rounded-lg p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">Всего</div>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="text-xl font-semibold text-red-600">{stats.urgent}</div>
              <div className="text-xs text-red-600 mt-1">Срочные</div>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="text-xl font-semibold text-amber-600">{stats.lowStock}</div>
              <div className="text-xs text-amber-600 mt-1">Мало</div>
            </div>
          </div>
        </div>

          {/* Header */}
        <div className="space-y-4">
          {/* Mobile: Simplified header */}
          <div className="md:hidden">
            <h1 className="text-xl font-semibold text-gray-900">Товары</h1>
            <div className="flex items-center gap-3 mt-3">
              <LamodaButton 
                variant="outline" 
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="flex-1"
              >
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </LamodaButton>
              
              <LamodaButton 
                onClick={handleCreateProduct}
                size="sm"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </LamodaButton>
            </div>
          </div>

          {/* Desktop: Full header */}
          <div className="hidden md:flex md:items-center md:justify-between">
                <div>
              <h1 className="text-3xl font-light text-foreground">Карточки товаров</h1>
              <p className="text-sm text-foreground/40 mt-1">
                Управление товарами на Lamoda
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
              <LamodaButton onClick={handleCreateProduct}>
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Добавить товар</span>
                </div>
              </LamodaButton>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <LamodaButton variant="outline">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Экспорт</span>
                    </div>
                  </LamodaButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsExportModalOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт товаров
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Скачать шаблон
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedProducts.length > 0 && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {selectedProducts.length} выбрано
                </span>
                <LamodaButton 
                  variant="ghost" 
                      size="sm"
                  onClick={() => setSelectedProducts([])}
                  className="text-xs px-2 py-1"
                >
                  <X className="h-3 w-3 mr-1" />
                  Отменить
                </LamodaButton>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <LamodaButton
                      size="sm"
                  onClick={() => handleBulkAction('bulk_edit_price')}
                  disabled={loading}
                  className="text-xs h-9"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Цены
                </LamodaButton>
                
                <LamodaButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update_stock')}
                  disabled={loading}
                  className="text-xs h-9"
                >
                  <Package className="h-3 w-3 mr-1" />
                  Остатки
                </LamodaButton>
              </div>
                  </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  Выбрано {selectedProducts.length} товаров
                </span>
                <LamodaButton 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Отменить выбор
                </LamodaButton>
                </div>
              
              <div className="flex items-center gap-2">
                <LamodaButton
                  size="sm"
                  onClick={() => handleBulkAction('bulk_edit_price')}
                  disabled={loading}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Изменить цены
                </LamodaButton>
                
                <LamodaButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update_stock')}
                  disabled={loading}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Обновить остатки
                </LamodaButton>
                
                <LamodaButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update_images')}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Обновить фото
                </LamodaButton>
                
                <LamodaButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('resubmit_moderation')}
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  На модерацию
                </LamodaButton>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters & Tools */}
        <LamodaCard className="p-6">
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
                {selectedProducts.length === enhancedFilteredProducts.length ? 'Снять выбор' : 'Выбрать все'}
              </LamodaButton>
              
              <LamodaButton
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Расширенные фильтры
              </LamodaButton>
            </div>
          </div>

          {/* Quick Search & Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Поиск по названию или артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border focus:outline-none focus:border-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-border focus:outline-none focus:border-foreground"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-border focus:outline-none focus:border-foreground"
            >
              <option value="all">Все остатки</option>
              <option value="available">В наличии (&gt;10)</option>
              <option value="low">Мало остатков (&lt;10)</option>
              <option value="zero">Закончились</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Цена от
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-3 py-2 border border-border focus:border-foreground focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Цена до
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-3 py-2 border border-border focus:border-foreground focus:outline-none text-sm"
                />
              </div>
              
              <div className="flex items-end">
                <LamodaButton
                  variant="outline"
                  onClick={() => {
                    setPriceRange({ min: "", max: "" })
                    setStockFilter("all")
                    setSelectedCategory("Все")
                    setSelectedStatus("Все")
                    setSearchQuery("")
                  }}
                  className="w-full"
                >
                  Сбросить все фильтры
                </LamodaButton>
              </div>
            </div>
          )}
        </LamodaCard>

        {/* Mobile Search */}
        <div className="md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border focus:outline-none focus:border-foreground transition-colors text-base"
            />
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
              <LamodaButton variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </LamodaButton>
              </div>

              {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Категория</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                        selectedCategory === category 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {category}
                    </button>
                  ))}
            </div>
          </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Статус товара</label>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map(status => (
                  <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                    className={cn(
                        "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                        selectedStatus === status 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Остатки</label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Все остатки" },
                    { value: "available", label: "В наличии (>10)" },
                    { value: "low", label: "Мало остатков (<10)" },
                    { value: "zero", label: "Закончились" }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setStockFilter(option.value)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 text-sm font-medium transition-all text-left",
                        stockFilter === option.value 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {option.label}
                  </button>
                ))}
            </div>
          </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Диапазон цен</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="От"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="До"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
          </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white space-y-3">
              <div className="flex gap-3">
                <LamodaButton 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPriceRange({ min: "", max: "" })
                    setStockFilter("all")
                    setSelectedCategory("Все")
                    setSelectedStatus("Все")
                    setSearchQuery("")
                  }}
                >
                  Сбросить
                </LamodaButton>
                <LamodaButton 
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Применить
                </LamodaButton>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3 md:space-y-4">
          {enhancedFilteredProducts.map((product) => (
            <LamodaCard key={product.id} variant="interactive" className={`overflow-hidden transition-all duration-200 ${
              selectedProducts.includes(product.id) ? 'bg-primary/5 border-primary/30' : ''
            }`}>
              {/* Mobile Layout */}
              <div className="md:hidden p-4 space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                          {product.name}
                        </h3>
                        {product.urgent && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {product.sellerSku}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Price Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", statusMap[product.status as keyof typeof statusMap]?.dot)} />
                    <span className="text-xs text-gray-600">
                      {statusMap[product.status as keyof typeof statusMap]?.label}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 py-2 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{product.stock}</div>
                    <div className="text-xs text-gray-500">Остаток</div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{product.sales}</div>
                    <div className="text-xs text-gray-500">Продажи</div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-sm font-medium text-primary">{product.conversion}%</div>
                    <div className="text-xs text-gray-500">Конверсия</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {product.status === "active" && (
                    <div className="flex items-center gap-2">
                      {product.lowStock && (
                        <LamodaButton 
                          variant="outline" 
                          size="sm" 
                          className="text-xs px-3 py-1"
                          onClick={() => handleProductAction(product.id, 'restock')}
                        >
                          Пополнить
                        </LamodaButton>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 ml-auto">
                    <LamodaButton 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="text-xs px-2 py-1"
                    >
                      <Edit className="h-3 w-3" />
                    </LamodaButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <LamodaButton variant="ghost" size="sm" className="px-2 py-1">
                          <MoreHorizontal className="h-3 w-3" />
                        </LamodaButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Дублировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-center gap-4">
                {/* Checkbox + Product Image */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
              </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                        <Package className="h-8 w-8 text-foreground/20" />
                      </div>
                      {product.urgent && (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">
                        {product.name}
                      </h3>
                      <div className="text-sm text-foreground/60 mt-1">
                        <span className="font-mono">{product.sellerSku}</span>
                        <span className="mx-2">•</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-2 h-2 rounded-full", statusMap[product.status as keyof typeof statusMap]?.dot)} />
                          <span className="text-xs text-foreground/60 uppercase tracking-wider">
                            {statusMap[product.status as keyof typeof statusMap]?.label}
                          </span>
                        </div>
                        
                        <div className="text-xs text-foreground/60">
                          {product.stock > 0 ? (
                            <span className={cn(
                              product.lowStock && "text-amber-600 font-medium"
                            )}>
                              {product.stock} шт
                            </span>
                          ) : (
                            <span className="text-red-600 font-medium">Нет в наличии</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-xs text-right">
                      <div>
                        <span className="text-foreground/40 uppercase tracking-wider">Продажи</span>
                        <div className="font-medium text-foreground">{product.sales}</div>
                      </div>
                      <div>
                        <span className="text-foreground/40 uppercase tracking-wider">Просмотры</span>
                        <div className="font-medium text-foreground">{product.views}</div>
                      </div>
                      {product.conversion > 0 && (
                        <div>
                          <span className="text-foreground/40 uppercase tracking-wider">Конверсия</span>
                          <div className="font-medium text-primary">{product.conversion}%</div>
                  </div>
                )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      {product.urgent && (
                        <div className="flex items-center gap-1.5 text-primary">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs font-medium uppercase tracking-wider">
                            Требует внимания
                          </span>
                        </div>
                      )}
                      
                      {product.rejectionReason && (
                        <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          {product.rejectionReason}
                        </div>
            )}
          </div>

                    {/* Mobile: Compact actions */}
                    <div className="md:hidden">
                      {product.status === "rejected" && (
                        <div className="flex gap-1">
                          <LamodaButton 
                            variant="outline" 
                            size="sm" 
                            className="text-xs flex-1"
                            onClick={() => handleProductAction(product.id, 'fix_rejection')}
                          >
                            Исправить
                          </LamodaButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <LamodaButton variant="ghost" size="sm" className="px-2">
                                <MoreHorizontal className="h-3 w-3" />
                              </LamodaButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Дублировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
            </div>
                      )}
                      {product.status === "active" && (
                        <div className="flex gap-1">
                          {product.lowStock && (
                            <LamodaButton 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleProductAction(product.id, 'restock')}
                            >
                              Пополнить
                            </LamodaButton>
                          )}
                          <LamodaButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => optimizeSEO(product.id)}
                            disabled={loading}
                            className="text-xs px-2"
                          >
                            <TrendingUp className="h-3 w-3" />
                          </LamodaButton>
                          <LamodaButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => updatePricing(product.id)}
                            disabled={loading}
                            className="text-xs px-2"
                          >
                            💰
                          </LamodaButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <LamodaButton variant="ghost" size="sm" className="px-2">
                                <MoreHorizontal className="h-3 w-3" />
                              </LamodaButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Дублировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProductAction(product.id, 'view_on_lamoda')}>
                                <Eye className="h-4 w-4 mr-2" />
                                Просмотр на Lamoda
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProductAction(product.id, 'update_photos')}>
                                <Upload className="h-4 w-4 mr-2" />
                                Обновить фото
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProductAction(product.id, 'download_data')}>
                                <Download className="h-4 w-4 mr-2" />
                                Скачать данные
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleProductAction(product.id, 'unpublish')}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Снять с публикации
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
            </div>
                      )}
                      {product.status === "moderation" && (
                        <div className="text-xs text-yellow-600">На модерации...</div>
                      )}
                      {product.status === "draft" && (
                        <LamodaButton 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => handleProductAction(product.id, 'publish')}
                        >
                          Опубликовать
                        </LamodaButton>
                      )}
            </div>

                    {/* Desktop: Full actions */}
                    <div className="hidden md:flex items-center gap-2">
                      {product.status === "rejected" && (
                        <LamodaButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProductAction(product.id, 'fix_rejection')}
                        >
                          Исправить
                        </LamodaButton>
                      )}
                      {product.status === "active" && (
                        <>
                          {product.lowStock && (
                            <LamodaButton 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProductAction(product.id, 'restock')}
                            >
                              Пополнить
                            </LamodaButton>
                          )}
                          <LamodaButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => optimizeSEO(product.id)}
                            disabled={loading}
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            SEO
                          </LamodaButton>
                          <LamodaButton 
                            variant="outline" 
                            size="sm"
                            onClick={() => updatePricing(product.id)}
                            disabled={loading}
                          >
                            💰 Цена
                          </LamodaButton>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <LamodaButton variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </LamodaButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Дублировать
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProductAction(product.id, 'view_on_lamoda')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Просмотр на Lamoda
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProductAction(product.id, 'update_photos')}>
                            <Upload className="h-4 w-4 mr-2" />
                            Обновить фото
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleProductAction(product.id, 'download_data')}>
                            <Download className="h-4 w-4 mr-2" />
                            Скачать данные
                          </DropdownMenuItem>
                          {product.status === "active" && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleProductAction(product.id, 'unpublish')}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Снять с публикации
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
            </div>
          </div>
      </div>
              </div>
            </LamodaCard>
          ))}
        </div>

        {/* Empty State */}
        {enhancedFilteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Товары не найдены</h3>
            <p className="text-foreground/60 mb-4">
              Попробуйте изменить фильтры или добавить новый товар
            </p>
            <LamodaButton onClick={handleCreateProduct}>
              Добавить товар
            </LamodaButton>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        isLoading={isProductLoading}
      />

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
        title="Экспорт товаров"
        description="Выберите формат экспорта товаров"
        itemCount={selectedProducts.length > 0 ? selectedProducts.length : filteredProducts.length}
      />
    </PageLayout>
  )
} 