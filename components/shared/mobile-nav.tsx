"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  {
    name: "Главная",
    href: "/",
    icon: Home,
  },
  {
    name: "Заказы", 
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Добавить",
    href: "/products/add",
    icon: Plus,
    isAction: true,
  },
  {
    name: "Товары",
    href: "/products", 
    icon: Package,
  },
  {
    name: "Аналитика",
    href: "/analytics",
    icon: BarChart3,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ease-in-out relative group",
                item.isAction
                  ? "bg-primary text-primary-foreground shadow-lg transform active:scale-95 hover:shadow-xl"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Активный индикатор */}
              {isActive && !item.isAction && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
              
              {/* Иконка */}
              <div className={cn(
                "flex items-center justify-center transition-transform duration-200",
                item.isAction 
                  ? "w-12 h-12 rounded-full bg-primary group-hover:scale-105" 
                  : "w-6 h-6 group-hover:scale-110"
              )}>
                <Icon className={cn(
                  item.isAction ? "h-6 w-6" : "h-5 w-5"
                )} />
              </div>
              
              {/* Текст */}
              <span className={cn(
                "text-xs font-medium mt-1 transition-opacity duration-200",
                item.isAction ? "text-primary-foreground" : "",
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}>
                {item.name}
              </span>

              {/* Hover эффект */}
              {!item.isAction && (
                <div className="absolute inset-0 rounded-lg bg-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
              )}
            </Link>
          )
        })}
      </div>
      
      {/* Безопасная область для устройств с home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}

// Хук для определения, нужно ли показывать мобильную навигацию
export function useMobileNav() {
  const pathname = usePathname()
  
  // Скрываем на специальных страницах
  const hiddenRoutes = ['/login', '/register', '/onboarding']
  const shouldShow = !hiddenRoutes.some(route => pathname.startsWith(route))
  
  return { shouldShow }
} 