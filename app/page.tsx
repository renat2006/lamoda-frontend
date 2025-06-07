"use client"

import Link from "next/link"
import { Package, ShoppingCart, TrendingUp, FileText } from "lucide-react"
import { MobileLayout, PageWrapper, AnimatedCard } from "@/components/shared"
import { Button } from "@/components/ui"

const quickActions = [
  {
    title: "Управление заказами",
    description: "Просматривайте и обрабатывайте заказы",
    icon: ShoppingCart,
    href: "/orders",
    color: "bg-blue-500",
  },
  {
    title: "Управление товарами",
    description: "Добавляйте и редактируйте товары",
    icon: Package,
    href: "/products",
    color: "bg-green-500",
  },
  {
    title: "Аналитика",
    description: "Отчеты и статистика продаж",
    icon: TrendingUp,
    href: "/analytics",
    color: "bg-purple-500",
  },
  {
    title: "Логистика",
    description: "Управление поставками",
    icon: FileText,
    href: "/logistics",
    color: "bg-orange-500",
  },
]

const recentActivity = [
  {
    title: "Новый заказ #12345",
    description: "2 товара на сумму 3 450 ₽",
    time: "5 минут назад",
  },
  {
    title: "Товар требует модерации",
    description: "Кроссовки Nike Air Max",
    time: "1 час назад",
  },
  {
    title: "Заказ отгружен",
    description: "Заказ #12340 передан в доставку",
    time: "2 часа назад",
  },
]

export default function HomePage() {
  return (
    <MobileLayout>
      <PageWrapper className="max-w-7xl">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Добро пожаловать в Lamoda Seller
          </h1>
          <p className="text-lg text-muted-foreground">
            Управляйте своим бизнесом на Lamoda из одного места
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <AnimatedCard delay={0} className="bg-card p-4 md:p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Заказы сегодня</h3>
            <p className="text-xl md:text-2xl font-bold text-foreground">24</p>
            <p className="text-xs md:text-sm text-green-600">+12% от вчера</p>
          </AnimatedCard>
          <AnimatedCard delay={100} className="bg-card p-4 md:p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Выручка</h3>
            <p className="text-xl md:text-2xl font-bold text-foreground">₽67,890</p>
            <p className="text-xs md:text-sm text-green-600">+8% от вчера</p>
          </AnimatedCard>
          <AnimatedCard delay={200} className="bg-card p-4 md:p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Товары</h3>
            <p className="text-xl md:text-2xl font-bold text-foreground">156</p>
            <p className="text-xs md:text-sm text-muted-foreground">Активных</p>
          </AnimatedCard>
          <AnimatedCard delay={300} className="bg-card p-4 md:p-6 rounded-lg border border-border hover:shadow-md transition-shadow duration-200">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Конверсия</h3>
            <p className="text-xl md:text-2xl font-bold text-foreground">3.2%</p>
            <p className="text-xs md:text-sm text-red-600">-0.5% от вчера</p>
          </AnimatedCard>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Последняя активность
            </h2>
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Показать все
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </MobileLayout>
  )
}
