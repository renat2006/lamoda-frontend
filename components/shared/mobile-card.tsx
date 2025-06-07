"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { 
  ChevronRight, 
  MoreVertical, 
  Package, 
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { Button } from "@/components/ui"
import { cn, hapticFeedback } from "@/lib/utils"
import type { Order, Product } from "@/types/lamoda"

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
  const currentX = useRef(0)

  const statusConfig = {
    new: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Новый" },
    processing: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", label: "В обработке" },
    shipped: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Отгружен" },
    delivered: { icon: CheckCircle, color: "text-gray-600", bg: "bg-gray-50", label: "Доставлен" },
    cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Отменен" }
  }

  const config = statusConfig[order.status] || statusConfig.new
  const StatusIcon = config.icon

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current) return
    
    currentX.current = e.touches[0].clientX
    const diffX = startX.current - currentX.current
    
    if (diffX > 60) {
      setIsSwipeOpen(true)
      hapticFeedback('light')
    } else if (diffX < -60) {
      setIsSwipeOpen(false)
    }
  }

  const handleTouchEnd = () => {
    // Reset positions
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Action buttons (показываются при swipe) */}
      <div className={cn(
        "absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 bg-red-50 transition-transform duration-300",
        isSwipeOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-blue-600 hover:bg-blue-100"
            onClick={() => {
              onEdit(order)
              hapticFeedback('medium')
              setIsSwipeOpen(false)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-red-600 hover:bg-red-100"
            onClick={() => {
              onDelete(order)
              hapticFeedback('heavy')
              setIsSwipeOpen(false)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-background border border-border rounded-xl p-4 transition-all duration-300 ease-out",
          "hover:shadow-md hover:border-border/60 active:scale-[0.98]",
          isSwipeOpen && "-translate-x-24"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          onView?.(order)
          hapticFeedback('light')
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">#{order.number}</span>
              <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.bg, config.color)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Сумма заказа</span>
            <span className="font-semibold text-foreground">₽{order.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Товаров</span>
            <span className="text-sm text-foreground">{order.itemsCount} шт.</span>
          </div>
          {order.shippingDeadline && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Отгрузка до</span>
              <span className="text-sm text-foreground">{order.shippingDeadline}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {order.customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">{order.customer.name}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
    draft: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Черновик" },
    moderation: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", label: "На модерации" },
    active: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Активный" },
    inactive: { icon: XCircle, color: "text-gray-600", bg: "bg-gray-50", label: "Неактивный" },
    rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Отклонен" }
  }

  const config = statusConfig[product.status] || statusConfig.draft
  const StatusIcon = config.icon

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

  const priceChange = product.discountPrice 
    ? ((product.discountPrice - product.price) / product.price * 100)
    : 0

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Action buttons */}
      <div className={cn(
        "absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 bg-red-50 transition-transform duration-300",
        isSwipeOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-yellow-600 hover:bg-yellow-100"
          onClick={() => {
            setIsFavorite(!isFavorite)
            hapticFeedback('light')
          }}
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </Button>
        {onEdit && (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-blue-600 hover:bg-blue-100"
            onClick={() => {
              onEdit(product)
              hapticFeedback('medium')
              setIsSwipeOpen(false)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-red-600 hover:bg-red-100"
            onClick={() => {
              onDelete(product)
              hapticFeedback('heavy')
              setIsSwipeOpen(false)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          "bg-background border border-border rounded-xl overflow-hidden transition-all duration-300 ease-out",
          "hover:shadow-md hover:border-border/60 active:scale-[0.98]",
          isSwipeOpen && "-translate-x-28"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={() => {
          onView?.(product)
          hapticFeedback('light')
        }}
      >
        <div className="flex gap-4 p-4">
          {/* Product image */}
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
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
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate mb-1">{product.name}</h3>
                <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", config.bg, config.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">SKU</span>
                <span className="text-xs font-medium text-foreground">{product.sellerSku}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">В наличии</span>
                <span className="text-xs text-foreground">{product.inStock} шт.</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">₽{product.price.toLocaleString()}</span>
                {product.discountPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₽{product.discountPrice.toLocaleString()}
                  </span>
                )}
                {priceChange !== 0 && (
                  <div className={cn("flex items-center gap-1", priceChange > 0 ? "text-green-600" : "text-red-600")}>
                    {priceChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-xs font-medium">{Math.abs(priceChange).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm"
          style={{ height: pullDistance }}
        >
          <div className={cn(
            "flex items-center gap-2 text-sm font-medium transition-all duration-200",
            pullDistance > 60 ? "text-primary" : "text-muted-foreground"
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
        className="space-y-3 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {(isRefreshing || loading) && items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms` }}>
              {renderCard(item, index)}
            </div>
          ))
        )}

        {/* Load more indicator */}
        {loading && items.length > 0 && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Загрузка...
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 