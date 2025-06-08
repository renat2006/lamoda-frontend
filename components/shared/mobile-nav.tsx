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
  Truck,
  User,
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/auth"

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
    href: "/products/create",
    color: "bg-primary text-white"
  },
  {
    name: "Логистика",
    icon: Truck,
    href: "/logistics",
    color: "bg-blue-100 text-blue-700"
  },
  {
    name: "Аналитика",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-green-100 text-green-700"
  },
  {
    name: "Профиль",
    icon: User,
    href: "/profile",
    color: "bg-purple-100 text-purple-700"
  },
  {
    name: "Настройки",
    icon: Settings,
    href: "/settings",
    color: "bg-gray-100 text-gray-700"
  },
  {
    name: "Выйти",
    icon: LogOut,
    action: "logout",
    color: "bg-red-100 text-red-700"
  }
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleActionClick = async (action: typeof quickActions[0]) => {
    if (action.action === "logout") {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    setIsQuickMenuOpen(false)
  }

  return (
    <>
      {/* Quick Actions Menu */}
      {isQuickMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Быстрые действия</h3>
              <button
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                action.href ? (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-md",
                      action.color
                    )}
                    onClick={() => setIsQuickMenuOpen(false)}
                  >
                    <action.icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium text-center">{action.name}</span>
                  </Link>
                ) : (
                  <button
                    key={action.name}
                    onClick={() => handleActionClick(action)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 active:scale-95 hover:shadow-md",
                      action.color
                    )}
                  >
                    <action.icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium text-center">{action.name}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom",
        className
      )}>
        <div className="flex items-center justify-around px-2 py-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsQuickMenuOpen(true)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary text-white transition-all duration-200 active:scale-95 hover:shadow-md"
                >
                  <Icon className="h-6 w-6" />
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && (
                    <Badge
                      variant={item.urgent ? "destructive" : "default"}
                      className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-1">{item.name}</span>
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