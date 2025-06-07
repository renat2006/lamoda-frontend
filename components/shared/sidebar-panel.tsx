import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface SidebarPanelProps {
  title: string
  children: React.ReactNode
  className?: string
  collapsible?: boolean
}

export function SidebarPanel({ 
  title, 
  children, 
  className,
  collapsible = false 
}: SidebarPanelProps) {
  return (
    <div className={cn("w-80 bg-background border-l border-border p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {collapsible && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </div>
  )
}

// Информационная карточка для боковой панели
interface InfoCardProps {
  title: string
  description?: string
  image?: string
  actions?: React.ReactNode
  className?: string
}

export function InfoCard({ 
  title, 
  description, 
  image, 
  actions,
  className 
}: InfoCardProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {image && (
        <div className="relative rounded-lg overflow-hidden bg-muted">
          <Image 
            src={image} 
            alt={title}
            width={320}
            height={160}
            className="w-full h-40 object-cover"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="pt-2">
          {actions}
        </div>
      )}
    </div>
  )
}

// Список элементов для боковой панели
interface SidebarListProps {
  items: {
    title: string
    subtitle?: string
    badge?: string | number
    onClick?: () => void
  }[]
  className?: string
}

export function SidebarList({ items, className }: SidebarListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors",
            item.onClick && "cursor-pointer"
          )}
          onClick={item.onClick}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {item.subtitle}
              </p>
            )}
          </div>
          
          {item.badge && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
} 