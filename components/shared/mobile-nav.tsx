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
import { cn, hapticFeedback } from "@/lib/utils"

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50">
      {/* Glowing top border effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {mobileNavItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                hapticFeedback(item.isAction ? 'medium' : 'light')
              }}
              className={cn(
                "group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 ease-out",
                "touch-target min-w-[60px]",
                item.isAction
                  ? "bg-gradient-to-t from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-110"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Active indicator - floating dot */}
              {isActive && !item.isAction && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-primary/60 rounded-full animate-ping absolute top-0 left-0" />
                </div>
              )}
              
              {/* Icon container with animations */}
              <div className={cn(
                "relative flex items-center justify-center transition-all duration-300 ease-out",
                item.isAction 
                  ? "w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm group-active:scale-95" 
                  : "w-10 h-10 rounded-xl group-hover:bg-accent/50 group-active:scale-95",
                isActive && !item.isAction && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "transition-all duration-300 ease-out",
                  item.isAction 
                    ? "h-7 w-7 group-hover:scale-110" 
                    : "h-5 w-5 group-hover:scale-110",
                  isActive && !item.isAction && "text-primary"
                )} />
                
                {/* Ripple effect on action button */}
                {item.isAction && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-active:opacity-100 group-active:animate-ping" />
                )}
              </div>
              
              {/* Label with improved typography */}
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-300 ease-out leading-none",
                item.isAction 
                  ? "text-primary-foreground font-semibold" 
                  : isActive 
                  ? "text-primary font-semibold" 
                  : "text-muted-foreground group-hover:text-foreground",
                "group-hover:scale-105"
              )}>
                {item.name}
              </span>

              {/* Hover effect background */}
              {!item.isAction && (
                <div className={cn(
                  "absolute inset-0 rounded-2xl transition-all duration-300 ease-out -z-10",
                  "bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100",
                  isActive && "opacity-60"
                )} />
              )}

              {/* Focus ring for accessibility */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 ring-offset-2 ring-offset-background opacity-0 group-focus-visible:opacity-100 transition-opacity duration-200" />
            </Link>
          )
        })}
      </div>
      
      {/* Bottom safe area with subtle gradient */}
      <div className="h-safe-area-inset-bottom bg-gradient-to-t from-background/50 to-transparent" />
    </div>
  )
}

// Улучшенный хук для определения видимости навигации
export function useMobileNav() {
  const pathname = usePathname()
  
  // Скрываем на специальных страницах
  const hiddenRoutes = ['/login', '/register', '/onboarding', '/splash']
  const shouldShow = !hiddenRoutes.some(route => pathname.startsWith(route))
  
  return { shouldShow }
} 