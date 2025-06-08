"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, LayoutGrid, List, BarChart3, Eye, Calendar, Copy, 
  Edit2, Trash2, Upload, Download, MoreHorizontal, Star,
  Package, TrendingUp, DollarSign, Activity, Zap, Target
} from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { productService, type Product } from "@/lib/api/products"
import { authService } from "@/lib/auth"
import { PageLayout } from "@/components/shared/page-layout"
import { PageWrapper, ResponsiveGrid, AnimatedCard } from "@/components/shared" 
import { ProductFiltersComponent } from "@/components/products/product-filters"
import { ExportModal } from "@/components/products/export-modal"
import { EnhancedProductCard, EnhancedProductListCard } from "@/components/products/enhanced-product-card"
import { exportProducts } from "@/lib/product-export-utils"
import { 
  ProductFilters, ViewMode, SortOption, SortDirection, 
  ExportOptions, ProductStats 
} from "@/types/products"
import { cn } from "@/lib/utils"

export default function ProductsPage() {
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ProductFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('created')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Computed values
  const stats = useMemo<ProductStats>(() => {
    const total = products.length
    const active = products.filter(p => p.in_stock).length
    const inactive = products.filter(p => !p.in_stock).length  
    const pending = 0
    const rejected = 0
    const inStock = products.filter(p => p.in_stock).length
    const outOfStock = total - inStock
    const averagePrice = total > 0 ? products.reduce((sum, p) => sum + (p.price || 0), 0) / total : 0
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)
    
    const categories: { [key: string]: number } = {}
    const brands: { [key: string]: number } = {}
    
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1
      if (product.brand) {
        brands[product.brand] = (brands[product.brand] || 0) + 1
      }
    })

    return {
      total, active, inactive, pending, rejected, inStock, outOfStock,
      averagePrice, totalValue, categories, brands
    }
  }, [products])

  const availableOptions = useMemo(() => ({
    categories: Array.from(new Set(products.map(p => p.category))).filter(Boolean),
    brands: Array.from(new Set(products.map(p => p.brand).filter(Boolean) as string[])),
    tags: Array.from(new Set(products.flatMap(p => p.tags || []))),
    sizes: Array.from(new Set(products.flatMap(p => p.sizes || []))),
    colors: Array.from(new Set(products.flatMap(p => p.colors || [])))
  }), [products])

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await productService.getProductsPaginated(currentPage, 20)
      setProducts(response.products)
      setTotalPages(response.pages)
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        authService.logout()
        return
      }
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить товары",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, toast])

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.id?.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category?.length) {
      filtered = filtered.filter(product => filters.category!.includes(product.category))
    }

    if (filters.brand?.length) {
      filtered = filtered.filter(product => product.brand && filters.brand!.includes(product.brand))
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => Boolean(product.in_stock) === filters.inStock)
    }

    // Status filtering removed as field doesn't exist in Product type

    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(product => (product.price || 0) >= filters.priceMin!)
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(product => (product.price || 0) <= filters.priceMax!)
    }

    // Rating filtering removed as field doesn't exist in Product type

    // Apply sorting with only available fields
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name || ''
          bValue = b.name || ''
          break
        case 'price':
          aValue = a.price || 0
          bValue = b.price || 0
          break
        case 'created':
          aValue = new Date(a.created_at || 0)
          bValue = new Date(b.created_at || 0)
          break
        default:
          aValue = 0
          bValue = 0
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    setFilteredProducts(filtered)
  }, [products, filters, sortBy, sortDirection])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id!)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedProducts).map(id => productService.deleteProduct(id))
      )
      toast({
        title: "Товары удалены",
        description: `Удалено ${selectedProducts.size} товаров`,
      })
      setSelectedProducts(new Set())
      loadProducts()
    } catch (error) {
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить товары",
        variant: "destructive",
      })
    }
  }

  const handleExport = (options: ExportOptions) => {
    const productsToExport = selectedProducts.size > 0 
      ? filteredProducts.filter(p => selectedProducts.has(p.id!))
      : filteredProducts

    exportProducts(productsToExport, options)
    toast({
      title: "Экспорт запущен",
      description: `Экспортируется ${productsToExport.length} товаров`,
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await productService.uploadExcel(file)
      toast({
        title: "Файл загружен",
        description: "Товары успешно импортированы",
      })
      loadProducts()
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить файл",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <PageWrapper maxWidth="2xl">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-12 bg-muted rounded w-48 mb-4" />
                <div className="h-6 bg-muted rounded w-64" />
              </div>
              <div className="h-10 bg-muted rounded w-40" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
            
            <div className="h-16 bg-muted rounded" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded" />
              ))}
            </div>
          </div>
        </PageWrapper>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageWrapper maxWidth="2xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
                Товары
              </h1>
              <p className="text-lg text-foreground/60 font-light">
                Управление каталогом и аналитика продаж
              </p>
            </div>
            <div className="text-xs text-foreground/40 uppercase tracking-widest">
              CMS
            </div>
          </div>
          <div className="w-full h-px bg-border mt-8" />
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
            Аналитика
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {stats.total}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Всего товаров
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Package className="w-3 h-3" />
                В каталоге
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-green-600 group-hover:text-foreground transition-colors duration-300">
                {stats.active}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Активные
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Zap className="w-3 h-3" />
                {Math.round((stats.active / stats.total) * 100)}% от всех
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-blue-600 group-hover:text-foreground transition-colors duration-300">
                {stats.inStock}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                В наличии
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Activity className="w-3 h-3" />
                Доступно к продаже
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                {Math.round(stats.averagePrice).toLocaleString()} ₽
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Средняя цена
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <DollarSign className="w-3 h-3" />
                По каталогу
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-purple-600 group-hover:text-foreground transition-colors duration-300">
                {Object.keys(stats.categories).length}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Категорий
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Target className="w-3 h-3" />
                Товарных групп
              </div>
            </div>
            
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-light text-orange-600 group-hover:text-foreground transition-colors duration-300">
                {Math.round(stats.totalValue / 1000)}K ₽
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Стоимость склада
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <TrendingUp className="w-3 h-3" />
                Общая стоимость
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
            Фильтрация и поиск
          </h2>
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableOptions.categories}
            availableBrands={availableOptions.brands}
            availableTags={availableOptions.tags}
            availableSizes={availableOptions.sizes}
            availableColors={availableOptions.colors}
          />
        </div>

        {/* Toolbar */}
        <div className="mb-16">
          <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
            Управление ({filteredProducts.length})
          </h2>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Select All */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border"
                />
                Выбрать все
              </label>

              {selectedProducts.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Выбрано {selectedProducts.size}
                  </Badge>
                  <LamodaButton variant="outline" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить выбранные
                  </LamodaButton>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <Select value={`${sortBy}-${sortDirection}`} onValueChange={(value) => {
                const [sort, direction] = value.split('-') as [SortOption, SortDirection]
                setSortBy(sort)
                setSortDirection(direction)
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created-desc">Дата создания ↓</SelectItem>
                  <SelectItem value="created-asc">Дата создания ↑</SelectItem>
                  <SelectItem value="name-asc">Название А-Я</SelectItem>
                  <SelectItem value="name-desc">Название Я-А</SelectItem>
                  <SelectItem value="price-desc">Цена ↓</SelectItem>
                  <SelectItem value="price-asc">Цена ↑</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 hover:bg-muted transition-colors",
                    viewMode === 'grid' && "bg-muted"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 hover:bg-muted transition-colors border-l border-border",
                    viewMode === 'list' && "bg-muted"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Actions */}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <LamodaButton 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Импорт
              </LamodaButton>

              <LamodaButton 
                variant="outline" 
                size="sm"
                onClick={() => setIsExportModalOpen(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </LamodaButton>

              <LamodaButton 
                onClick={() => router.push('/products/create')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </LamodaButton>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="mb-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/60 mb-4">
                {Object.keys(filters).length > 0 ? 'Товары не найдены' : 'Пока нет товаров'}
              </p>
              {Object.keys(filters).length === 0 && (
                <LamodaButton 
                  onClick={() => router.push('/products/create')}
                  variant="outline"
                >
                  Добавить первый товар
                </LamodaButton>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <ResponsiveGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="lg">
              {filteredProducts.map((product, index) => (
                <AnimatedCard key={product.id} delay={index * 50}>
                  <EnhancedProductCard
                    product={product}
                    isSelected={selectedProducts.has(product.id!)}
                    onSelect={() => handleSelectProduct(product.id!)}
                    onEdit={() => router.push(`/products/edit/${product.id}`)}
                    onDelete={async () => {
                      try {
                        await productService.deleteProduct(product.id!)
                        toast({
                          title: "Товар удален",
                          description: "Товар успешно удален из каталога",
                        })
                        loadProducts()
                      } catch (error) {
                        toast({
                          title: "Ошибка удаления",
                          description: "Не удалось удалить товар",
                          variant: "destructive",
                        })
                      }
                    }}
                  />
                </AnimatedCard>
              ))}
            </ResponsiveGrid>
          ) : (
            <div className="space-y-1">
              {filteredProducts.map((product, index) => (
                <AnimatedCard key={product.id} delay={index * 30}>
                  <EnhancedProductListCard
                    product={product}
                    isSelected={selectedProducts.has(product.id!)}
                    onSelect={() => handleSelectProduct(product.id!)}
                    onEdit={() => router.push(`/products/edit/${product.id}`)}
                    onDelete={async () => {
                      try {
                        await productService.deleteProduct(product.id!)
                        toast({
                          title: "Товар удален",
                          description: "Товар успешно удален из каталога",
                        })
                        loadProducts()
                      } catch (error) {
                        toast({
                          title: "Ошибка удаления",
                          description: "Не удалось удалить товар",
                          variant: "destructive",
                        })
                      }
                    }}
                  />
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-border pt-8">
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "px-4 py-2 text-sm transition-colors rounded",
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          selectedCount={selectedProducts.size}
        />
      </PageWrapper>
    </PageLayout>
  )
}

// Components are imported from enhanced-product-card.tsx 