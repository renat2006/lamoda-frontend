"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { 
  ChevronRight, 
  MoreVertical, 
  Package, 
  ShoppingCart,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingDown
} from "lucide-react"
import { Button } from "@/components/ui"
import type { Order, Product } from "@/types/lamoda"
import { formatCurrency } from "@/lib/format-utils"

// Простая cn функция
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')

// Простая заглушка для haptic feedback
const hapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = { light: 10, medium: 20, heavy: 40 }
    navigator.vibrate(patterns[type])
  }
}

// Мобильная карточка заказа
interface OrderCardProps {
  order: Order
  onView?: (order: Order) => void
  onEdit?: (order: Order) => void
  onDelete?: (order: Order) => void
  className?: string
}

export function OrderCard({ order, onView, onEdit, onDelete, className }: OrderCardProps) {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const statusConfig = {
    new: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500", label: "Новый" },
    processing: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500", label: "В обработке" },
    shipped: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500", label: "Отгружен" },
    delivered: { icon: CheckCircle, color: "text-slate-600", bg: "bg-slate-50", dot: "bg-slate-500", label: "Доставлен" },
    cancelled: { icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-500", label: "Отменен" }
  }

  const config = statusConfig[order.status] || statusConfig.new

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current) return
    
    const currentX = e.touches[0].clientX
    const diffX = startX.current - currentX
    
    if (diffX > 60) {
      setIsSwipeOpen(true)
      hapticFeedback('light')
    } else if (diffX < -60) {
      setIsSwipeOpen(false)
    }
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Action buttons */}
      <div className={cn(
        "absolute right-0 top-0 bottom-0 flex items-center gap-3 px-6 transition-transform duration-300 ease-out",
        "bg-gradient-to-l from-slate-50 via-slate-50/95 to-transparent",
        isSwipeOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {onEdit && (
          <button
            onClick={() => {
              onEdit(order)
              hapticFeedback('medium')
              setIsSwipeOpen(false)
            }}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:bg-blue-600 active:scale-95 transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              onDelete(order)
              hapticFeedback('heavy')
              setIsSwipeOpen(false)
            }}
            className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 hover:bg-rose-600 active:scale-95 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-2xl p-6 transition-all duration-300 ease-out",
          "border border-slate-200/60 hover:border-slate-300/60",
          "shadow-sm hover:shadow-md hover:shadow-slate-200/40",
          "active:scale-[0.99] cursor-pointer",
          isSwipeOpen && "-translate-x-24"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={() => {
          onView?.(order)
          hapticFeedback('light')
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg tracking-tight">#{order.number}</h3>
                <p className="text-sm text-slate-500 font-medium">{order.date}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
              config.bg, config.color, "border-current/20"
            )}>
              <div className={cn("w-2 h-2 rounded-full", config.dot)} />
              <span className="text-xs font-medium">{config.label}</span>
            </div>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600 font-medium">Сумма заказа</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(order.amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Товаров в заказе</span>
            <span className="text-sm font-semibold text-slate-700">{order.itemsCount} шт.</span>
          </div>
          {order.shippingDeadline && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Отгрузка до</span>
              <span className="text-sm font-semibold text-slate-700">{order.shippingDeadline}</span>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {order.customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{order.customer.name}</p>
              {order.customer.email && (
                <p className="text-xs text-slate-500">{order.customer.email}</p>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>
      </div>
    </div>
  )
}

// Мобильная карточка товара
interface ProductCardProps {
  product: Product
  onView?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  className?: string
}

export function ProductCard({ product, onView, onEdit, onDelete, className }: ProductCardProps) {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const statusConfig = {
    draft: { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500", label: "Черновик" },
    moderation: { color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500", label: "На модерации" },
    active: { color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500", label: "Активный" },
    inactive: { color: "text-slate-600", bg: "bg-slate-50", dot: "bg-slate-500", label: "Неактивный" },
    rejected: { color: "text-rose-600", bg: "bg-rose-50", dot: "bg-rose-500", label: "Отклонен" }
  }

  const config = statusConfig[product.status] || statusConfig.draft

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current) return
    
    const currentX = e.touches[0].clientX
    const diffX = startX.current - currentX
    
    if (diffX > 60) {
      setIsSwipeOpen(true)
      hapticFeedback('light')
    } else if (diffX < -60) {
      setIsSwipeOpen(false)
    }
  }

  // Логика скидки
  const originalPrice = product.price
  const currentPrice = product.discountPrice || product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  return (
    <div className={cn("relative group", className)}>
      {/* Action buttons */}
      <div className={cn(
        "absolute right-0 top-0 bottom-0 flex items-center gap-3 px-6 transition-transform duration-300 ease-out",
        "bg-gradient-to-l from-slate-50 via-slate-50/95 to-transparent",
        isSwipeOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <button
          onClick={() => {
            setIsFavorite(!isFavorite)
            hapticFeedback('light')
          }}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95",
            isFavorite 
              ? "bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-600" 
              : "bg-white text-slate-400 shadow-slate-200/40 hover:text-amber-500 border border-slate-200"
          )}
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
        {onEdit && (
          <button
            onClick={() => {
              onEdit(product)
              hapticFeedback('medium')
              setIsSwipeOpen(false)
            }}
            className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:bg-blue-600 active:scale-95 transition-all duration-200"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              onDelete(product)
              hapticFeedback('heavy')
              setIsSwipeOpen(false)
            }}
            className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 hover:bg-rose-600 active:scale-95 transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-out",
          "border border-slate-200/60 hover:border-slate-300/60",
          "shadow-sm hover:shadow-md hover:shadow-slate-200/40",
          "active:scale-[0.99] cursor-pointer",
          isSwipeOpen && "-translate-x-28"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={() => {
          onView?.(product)
          hapticFeedback('light')
        }}
      >
        <div className="flex gap-4 p-6">
          {/* Product image */}
          <div className="w-20 h-20 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-slate-300" />
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate mb-2 leading-tight">{product.name}</h3>
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-colors text-xs font-medium",
                  config.bg, config.color, "border-current/20"
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                  {config.label}
                </div>
              </div>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Meta info */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Артикул</span>
                <span className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{product.sellerSku}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">В наличии</span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  product.inStock > 0 
                    ? "text-emerald-700 bg-emerald-100" 
                    : "text-rose-700 bg-rose-100"
                )}>
                  {product.inStock} шт.
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-900">{formatCurrency(currentPrice)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      <TrendingDown className="h-3 w-3" />
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Список мобильных карточек с pull-to-refresh
interface MobileCardListProps<T> {
  items: T[]
  renderCard: (item: T, index: number) => React.ReactNode
  onRefresh?: () => Promise<void>
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  emptyState?: React.ReactNode
  className?: string
}

export function MobileCardList<T>({
  items,
  renderCard,
  onRefresh,
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyState,
  className
}: MobileCardListProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, (currentY - startY.current) * 0.5)
      setPullDistance(Math.min(distance, 80))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && onRefresh) {
      setIsRefreshing(true)
      hapticFeedback('medium')
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
    startY.current = 0
  }

  const handleScroll = () => {
    if (!scrollRef.current || !hasMore || loading) return
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      onLoadMore?.()
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        {emptyState}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 bg-white/90 backdrop-blur-md border-b border-slate-200"
          style={{ height: pullDistance }}
        >
          <div className={cn(
            "flex items-center gap-3 text-sm font-medium transition-all duration-200",
            pullDistance > 60 ? "text-blue-600" : "text-slate-500"
          )}>
            <div className={cn(
              "w-5 h-5 border-2 border-current rounded-full transition-transform duration-200",
              pullDistance > 60 && "animate-spin border-t-transparent"
            )} />
            {pullDistance > 60 ? "Отпустите для обновления" : "Потяните для обновления"}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="space-y-4 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {(isRefreshing || loading) && items.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          items.map((item, index) => (
            <div 
              key={index} 
              className="animate-in fade-in-0 slide-in-from-bottom-4" 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {renderCard(item, index)}
            </div>
          ))
        )}

        {/* Load more indicator */}
        {loading && items.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Загрузка...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 