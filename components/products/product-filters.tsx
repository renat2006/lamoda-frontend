"use client"

import { useState } from "react"
import { Search, Filter, X, Calendar, DollarSign, Tag, Package, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ProductFilters } from "@/types/products"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  availableCategories: string[]
  availableBrands: string[]
  availableTags: string[]
  availableSizes: string[]
  availableColors: string[]
}

export function ProductFiltersComponent({
  filters,
  onFiltersChange,
  availableCategories,
  availableBrands,
  availableTags,
  availableSizes,
  availableColors
}: ProductFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [priceMin, setPriceMin] = useState(filters.priceMin?.toString() || '')
  const [priceMax, setPriceMax] = useState(filters.priceMax?.toString() || '')

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof ProductFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const clearFilters = () => {
    onFiltersChange({})
    setPriceMin('')
    setPriceMax('')
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const applyPriceFilter = () => {
    updateFilter('priceMin', priceMin ? Number(priceMin) : undefined)
    updateFilter('priceMax', priceMax ? Number(priceMax) : undefined)
  }

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Поиск по названию, бренду, описанию..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock Status */}
          <Select value={filters.inStock?.toString() || 'all'} onValueChange={(value) => 
            updateFilter('inStock', value === 'all' ? undefined : value === 'true')
          }>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Наличие" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все товары</SelectItem>
              <SelectItem value="true">В наличии</SelectItem>
              <SelectItem value="false">Нет в наличии</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => 
            updateFilter('status', value === 'all' ? undefined : [value])
          }>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
              <SelectItem value="pending">На модерации</SelectItem>
              <SelectItem value="rejected">Отклонены</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters Toggle */}
          <div className="relative">
            <LamodaButton 
              variant="outline" 
              className="relative"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </LamodaButton>
            
            {isFiltersOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsFiltersOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-border rounded-lg shadow-lg z-50">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground">Расширенные фильтры</h3>
                  <LamodaButton variant="ghost" size="sm" onClick={clearFilters}>
                    Очистить все
                  </LamodaButton>
                </div>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Категории
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {availableCategories.map(category => (
                        <label key={category} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={(filters.category || []).includes(category)}
                            onCheckedChange={() => toggleArrayFilter('category', category)}
                          />
                          <span className="truncate">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Бренды
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {availableBrands.map(brand => (
                        <label key={brand} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={(filters.brand || []).includes(brand)}
                            onCheckedChange={() => toggleArrayFilter('brand', brand)}
                          />
                          <span className="truncate">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Диапазон цен
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="От"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-20"
                      />
                      <span className="text-foreground/40">—</span>
                      <Input
                        type="number"
                        placeholder="До"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-20"
                      />
                      <LamodaButton size="sm" onClick={applyPriceFilter}>
                        ОК
                      </LamodaButton>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Размеры
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleArrayFilter('sizes', size)}
                          className={cn(
                            "px-2 py-1 text-xs border rounded transition-colors",
                            (filters.sizes || []).includes(size)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-foreground/20"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Цвета
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => toggleArrayFilter('colors', color)}
                          className={cn(
                            "px-3 py-1 text-xs border rounded transition-colors",
                            (filters.colors || []).includes(color)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-foreground/20"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Минимальный рейтинг
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => updateFilter('rating', filters.rating === rating ? undefined : rating)}
                          className={cn(
                            "p-1 rounded transition-colors",
                            filters.rating === rating
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          <Star className={cn(
                            "w-4 h-4",
                            filters.rating && rating <= filters.rating
                              ? "fill-current"
                              : ""
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <LamodaButton variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Очистить ({activeFiltersCount})
            </LamodaButton>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              <Search className="w-3 h-3" />
              "{filters.search}"
              <button onClick={() => updateFilter('search', undefined)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.category?.map(category => (
            <Badge key={category} variant="secondary" className="gap-1">
              <Package className="w-3 h-3" />
              {category}
              <button onClick={() => toggleArrayFilter('category', category)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {filters.brand?.map(brand => (
            <Badge key={brand} variant="secondary" className="gap-1">
              <Tag className="w-3 h-3" />
              {brand}
              <button onClick={() => toggleArrayFilter('brand', brand)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {(filters.priceMin || filters.priceMax) && (
            <Badge variant="secondary" className="gap-1">
              <DollarSign className="w-3 h-3" />
              {filters.priceMin || 0} - {filters.priceMax || '∞'} ₽
              <button onClick={() => {
                updateFilter('priceMin', undefined)
                updateFilter('priceMax', undefined)
                setPriceMin('')
                setPriceMax('')
              }}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 