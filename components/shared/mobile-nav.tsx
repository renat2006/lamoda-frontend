"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  Home, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Plus,
  Search,
  Bell,
  AlertTriangle,
  X,
  Truck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LamodaButton } from "@/components/ui/lamoda-button"

const navigationItems = [
  {
    name: "Главная",
    href: "/",
    icon: Home
  },
  {
    name: "Заказы", 
    href: "/orders",
    icon: ShoppingCart,
    badge: 12,
    urgent: true
  },
  {
    name: "Товары",
    href: "/products", 
    icon: Package,
    badge: 3
  },
  {
    name: "Действия",
    href: "#",
    icon: Plus,
    isAction: true
  }
]

const quickActions = [
  {
    name: "Добавить товар",
    icon: Plus,
    href: "/products/new",
    color: "bg-primary text-white"
  },
  {
    name: "Поиск",
    icon: Search,
    action: "search",
    color: "bg-gray-100 text-gray-700"
  }
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  // Double tap detection for quick actions
  const handleDoubleTap = (action: () => void) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap
    if (tapLength < 300 && tapLength > 0) {
      action()
    }
    setLastTap(currentTime)
  }

  return (
    <>
      {/* Quick Action Menu Overlay */}
      {isQuickMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
          onClick={() => setIsQuickMenuOpen(false)}
        >
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 z-[61] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-600">Быстрые действия</div>
              <button 
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href || "#"}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-md",
                      action.color
                    )}
                    onClick={() => setIsQuickMenuOpen(false)}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium text-center">{action.name}</span>
                  </Link>
                )
              })}
              <Link
                href="/logistics"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-100 text-green-700 transition-all duration-200 active:scale-95 hover:shadow-md"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <Truck className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium text-center">Логистика</span>
              </Link>
              <Link
                href="/analytics"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-100 text-blue-700 transition-all duration-200 active:scale-95 hover:shadow-md"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium text-center">Аналитика</span>
              </Link>
              <Link
                href="/orders"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-100 text-amber-700 transition-all duration-200 active:scale-95 hover:shadow-md"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <AlertTriangle className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium text-center">Срочные заказы</span>
              </Link>
              <Link
                href="#"
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-100 text-purple-700 transition-all duration-200 active:scale-95 hover:shadow-md"
                onClick={() => setIsQuickMenuOpen(false)}
              >
                <Bell className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium text-center">Уведомления</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom",
        className
      )}>
        {/* Status indicator - только если есть срочные уведомления */}
        <div className="px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-700 font-medium">12 срочных заказов</span>
          </div>
          <Link 
            href="/orders"
            className="text-red-600 font-semibold text-xs px-3 py-1 bg-red-100 rounded active:bg-red-200 transition-colors"
          >
            Смотреть
          </Link>
        </div>

        <div className="flex items-center justify-between px-2 py-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href))

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsQuickMenuOpen(true)}
                  className="flex flex-col items-center justify-center min-w-0 flex-1 py-2.5 px-1 rounded-xl transition-all duration-200 active:scale-95 tap-highlight-transparent text-gray-500 active:bg-gray-50"
                >
                  <div className="relative mb-1">
                    <Icon className="h-5 w-5 transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-center truncate max-w-full">
                    {item.name}
                  </span>
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 flex-1 py-2.5 px-1 rounded-xl transition-all duration-200 active:scale-95 tap-highlight-transparent",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-500 active:bg-gray-50"
                )}
              >
                <div className="relative mb-1">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-500"
                  )} />
                  {item.badge && (
                    <Badge 
                      variant={item.urgent ? "destructive" : "secondary"}
                      className={cn(
                        "absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-xs font-bold min-w-0 border-2 border-white",
                        item.urgent && "animate-pulse bg-red-500 text-white"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs leading-tight text-center font-medium max-w-full truncate",
                  isActive ? "text-primary" : "text-gray-500"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export function useMobileNav() {
  const pathname = usePathname()
  
  const hiddenRoutes = ['/login', '/register', '/onboarding']
  const shouldShow = !hiddenRoutes.some(route => pathname.startsWith(route))
  
  return { shouldShow }
} 