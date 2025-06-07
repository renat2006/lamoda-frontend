"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui"

interface MobileCardProps {
  title: string
  subtitle?: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function MobileCard({
  title,
  subtitle,
  description, 
  badge,
  actions,
  onClick,
  className,
  children
}: MobileCardProps) {
  const isClickable = !!onClick

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 transition-all duration-200",
        isClickable && "hover:shadow-md active:scale-[0.98] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            {badge && badge}
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>
        
        {isClickable && (
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
        )}
      </div>
      
      {actions && (
        <div className="mt-4 flex items-center justify-between">
          {actions}
        </div>
      )}
    </div>
  )
}

// Компонент для списка мобильных карточек
interface MobileCardListProps {
  title?: string
  cards: Array<MobileCardProps & { id: string }>
  className?: string
  showAll?: boolean
  onShowAll?: () => void
}

export function MobileCardList({
  title,
  cards,
  className,
  showAll = true,
  onShowAll
}: MobileCardListProps) {
  const displayCards = showAll ? cards : cards.slice(0, 3)
  const hasMore = cards.length > 3 && !showAll

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      )}
      
      <div className="space-y-3">
        {displayCards.map((card, index) => (
          <div
            key={card.id}
            className="animate-in fade-in-0 duration-300 slide-in-from-bottom-2"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <MobileCard {...card} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={onShowAll}
        >
          Показать все ({cards.length})
        </Button>
      )}
    </div>
  )
} 