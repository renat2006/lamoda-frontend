"use client"

import { useState } from "react"
import { 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Package,
  Star,
  Clock,
  DollarSign,
  BarChart3,
  Camera,
  ShoppingCart,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard } from "@/components/ui/lamoda-card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format-utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  inStock: boolean
  createdAt: string
  updatedAt: string
  brand?: string
  category?: string
  gender?: string
  sizes?: string[]
  colors?: string[]
  currency?: string
  tags?: string[]
  season?: string
  // Analytics data
  views?: number
  sales?: number
  conversion?: number
  profit?: number
  competition?: 'low' | 'medium' | 'high'
  trending?: 'up' | 'down' | 'stable'
  lastSold?: string
  avgRating?: number
  reviewCount?: number
}

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: (product: Product) => void
  onDuplicate: (product: Product) => void
  onDelete: (id: string) => void
  onQuickAction?: (action: string, productId: string) => void
}

// Compact List View - For bulk operations
export const CompactProductCard = ({ product, isSelected, onSelect, onEdit, onDuplicate, onDelete, onQuickAction }: ProductCardProps) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors",
      isSelected && "bg-primary/5 border-l-4 border-l-primary"
    )}>
      {/* Selection */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(product.id)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
      />

      {/* Image */}
      <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          {product.trending && (
            <div className="flex items-center">
              {product.trending === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
              {product.trending === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{product.category}</div>
      </div>

      {/* Price & Stock */}
      <div className="text-right">
        <div className="font-semibold text-sm">{formatCurrency(product.price)}</div>
        <div className={cn(
          "text-xs",
          product.inStock ? "text-green-600" : "text-red-600"
        )}>
          {product.inStock ? `В наличии` : "Нет в наличии"}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
        <div className="text-center">
          <div className="font-medium">{product.views || 0}</div>
          <div>Просмотры</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{product.sales || 0}</div>
          <div>Продажи</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{product.conversion || 0}%</div>
          <div>Конверсия</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <LamodaButton variant="ghost" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4" />
        </LamodaButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <LamodaButton variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </LamodaButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onQuickAction?.('view_analytics', product.id)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Аналитика
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(product)}>
              <Copy className="h-4 w-4 mr-2" />
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Grid View - Visual focus
export const GridProductCard = ({ product, isSelected, onSelect, onEdit, onDuplicate, onDelete, onQuickAction }: ProductCardProps) => {
  return (
    <LamodaCard className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      isSelected && "ring-2 ring-primary ring-offset-2"
    )}>
      {/* Image Section */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product.id)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
        </div>

        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.trending === 'up' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs p-1">
              <TrendingUp className="h-3 w-3" />
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="text-xs">
              Нет в наличии
            </Badge>
          )}
          {product.competition === 'high' && (
            <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
              <Target className="h-3 w-3" />
            </Badge>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <LamodaButton size="sm" variant="secondary" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4 mr-1" />
            Изменить
          </LamodaButton>
          <LamodaButton size="sm" variant="secondary" onClick={() => onQuickAction?.('view_analytics', product.id)}>
            <BarChart3 className="h-4 w-4 mr-1" />
            Аналитика
          </LamodaButton>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>

        {/* Price and performance */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
          {product.profit && (
            <div className="text-xs text-green-600 font-medium">
              +{formatCurrency(product.profit)} прибыль
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">{product.views || 0}</div>
            <div className="text-muted-foreground">Просмотры</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">{product.sales || 0}</div>
            <div className="text-muted-foreground">Продажи</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="font-medium">{product.conversion || 0}%</div>
            <div className="text-muted-foreground">Конверсия</div>
          </div>
        </div>

        {/* Rating */}
        {product.avgRating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.avgRating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <LamodaButton variant="outline" size="sm" className="flex-1" onClick={() => onEdit(product)}>
            <Edit className="h-3 w-3 mr-1" />
            Изменить
          </LamodaButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <LamodaButton variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </LamodaButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onQuickAction?.('boost', product.id)}>
                <Zap className="h-4 w-4 mr-2" />
                Продвинуть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQuickAction?.('update_photos', product.id)}>
                <Camera className="h-4 w-4 mr-2" />
                Обновить фото
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(product)}>
                <Copy className="h-4 w-4 mr-2" />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </LamodaCard>
  )
}

// Analytics Card - Performance focused
export const AnalyticsProductCard = ({ product, isSelected, onSelect, onEdit, onDuplicate, onDelete, onQuickAction }: ProductCardProps) => {
  const getPerformanceColor = (value: number, type: 'conversion' | 'trend') => {
    if (type === 'conversion') {
      if (value >= 15) return 'text-green-600'
      if (value >= 8) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-foreground'
  }

  return (
    <LamodaCard className={cn(
      "p-4 hover:shadow-md transition-all",
      isSelected && "ring-2 ring-primary ring-offset-1"
    )}>
      <div className="flex gap-4">
        {/* Checkbox & Image */}
        <div className="flex flex-col items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product.id)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <div className="w-16 h-16 bg-muted rounded overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
              {product.profit && (
                <div className="text-xs text-green-600">+{formatCurrency(product.profit)}</div>
              )}
            </div>
          </div>

          {/* Performance metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Eye className="h-3 w-3 text-blue-500" />
                <span className="text-sm font-medium">{product.views || 0}</span>
              </div>
              <div className="text-xs text-muted-foreground">Просмотры</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <ShoppingCart className="h-3 w-3 text-green-500" />
                <span className="text-sm font-medium">{product.sales || 0}</span>
              </div>
              <div className="text-xs text-muted-foreground">Продажи</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-3 w-3 text-purple-500" />
                <span className={cn(
                  "text-sm font-medium",
                  getPerformanceColor(product.conversion || 0, 'conversion')
                )}>
                  {product.conversion || 0}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Конверсия</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="h-3 w-3 text-green-500" />
                <span className="text-sm font-medium">{formatCurrency(product.profit || 0)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Прибыль</div>
            </div>
          </div>

          {/* Trend & Competition */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.trending === 'up' && (
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs">Растет</span>
                </div>
              )}
              {product.trending === 'down' && (
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  <span className="text-xs">Падает</span>
                </div>
              )}
              
              {product.competition && (
                <Badge variant="outline" className={cn(
                  "text-xs",
                  product.competition === 'high' && "border-red-300 text-red-600",
                  product.competition === 'medium' && "border-yellow-300 text-yellow-600",
                  product.competition === 'low' && "border-green-300 text-green-600"
                )}>
                  Конкуренция: {product.competition === 'high' ? 'высокая' : product.competition === 'medium' ? 'средняя' : 'низкая'}
                </Badge>
              )}
            </div>

            <div className="flex gap-1">
              <LamodaButton variant="ghost" size="sm" onClick={() => onQuickAction?.('view_analytics', product.id)}>
                <BarChart3 className="h-4 w-4" />
              </LamodaButton>
              <LamodaButton variant="ghost" size="sm" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4" />
              </LamodaButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <LamodaButton variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </LamodaButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onQuickAction?.('optimize_price', product.id)}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Оптимизировать цену
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onQuickAction?.('boost', product.id)}>
                    <Zap className="h-4 w-4 mr-2" />
                    Продвинуть
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(product)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Дублировать
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </LamodaCard>
  )
}