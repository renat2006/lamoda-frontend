"use client"

import Link from "next/link"
import { Package, ShoppingCart, TrendingUp, FileText, AlertCircle, CheckCircle, Clock, Target } from "lucide-react"
import { 
  PageWrapper, 
  AnimatedCard, 
  ResponsiveGrid,
  StatsContainer,
  StatCard
} from "@/components/shared"
import { PageLayout } from "@/components/shared/page-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { LamodaCard, LamodaCardHeader, LamodaCardTitle, LamodaCardDescription, LamodaCardContent } from "@/components/ui/lamoda-card"

const quickActions = [
  {
    title: "Добавить товар",
    description: "Создайте карточку нового товара",
    icon: Package,
    href: "/products/add",
    color: "bg-primary",
    urgent: false,
  },
  {
    title: "Обработка заказов",
    description: "5 заказов требуют вашего внимания",
    icon: ShoppingCart,
    href: "/orders",
    color: "bg-[oklch(0.75_0.08_220)]",
    urgent: true,
    badge: 5,
  },
  {
    title: "Аналитика продаж",
    description: "Отчёты и метрики эффективности",
    icon: TrendingUp,
    href: "/analytics",
    color: "bg-[oklch(0.85_0.08_160)]",
    urgent: false,
  },
  {
    title: "Подготовка к отгрузке",
    description: "12 товаров готовы к комплектации",
    icon: FileText,
    href: "/logistics",
    color: "bg-[oklch(0.78_0.12_65)]",
    urgent: true,
    badge: 12,
  },
]

const criticalAlerts = [
  {
    type: "critical",
    title: "Требуется корректировка карточек товаров",
    description: "3 карточки отклонены модерацией. Рекомендуем исправить до 18:00",
    time: "2 часа назад",
    action: "Исправить",
    href: "/products?status=rejected"
  },
  {
    type: "important", 
    title: "Обновите информацию об остатках",
    description: "8 товаров имеют низкий остаток. Обновите данные для корректного отображения",
    time: "4 часа назад",
    action: "Обновить",
    href: "/products?action=update-stock"
  },
  {
    type: "success",
    title: "Выплата успешно обработана",
    description: "Зачисление 67 890 ₽ на ваш расчётный счёт завершено",
    time: "Вчера",
    action: "Подробнее",
    href: "/finance/payouts"
  },
]

const performanceMetrics = [
  {
    title: "Заказы сегодня",
    value: "24",
    change: "+8 к вчера (конверсия: 3,2%)",
    changeType: "positive" as const,
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    title: "К выплате",
    value: "67 890 ₽",
    change: "Выплата: 15 марта 2025 (комиссия: 12%)",
    changeType: "neutral" as const,
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    title: "Активных товаров",
    value: "156",
    change: "+3 прошли модерацию (рейтинг: 4,3)",
    changeType: "positive" as const,
    icon: <Package className="h-5 w-5" />
  },
  {
    title: "Время комплектации",
    value: "2,4 ч",
    change: "Соответствует SLA (цель: до 4 часов)",
    changeType: "positive" as const,
    icon: <Clock className="h-5 w-5" />
  },
]

export default function HomePage() {
  return (
    <PageLayout>
      <PageWrapper maxWidth="2xl">
          {/* Welcome section */}
          <div className="mb-12">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4 tracking-tight">
                  Lamoda
                </h1>
                <p className="text-lg text-foreground/60 font-light">
                  Панель селлера
                </p>
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-widest">
                Активный
              </div>
            </div>
            <div className="w-full h-px bg-border mt-8" />
          </div>

          {/* Critical alerts */}
          {criticalAlerts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
                Требует внимания
              </h2>
              <div className="space-y-1">
                {criticalAlerts.map((alert, index) => (
                  <div key={index} className="border-b border-border last:border-0">
                    <div className="flex items-center justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.type === 'critical' ? 'bg-primary' :
                            alert.type === 'important' ? 'bg-foreground/40' :
                            'bg-foreground/20'
                          }`} />
                          <span className="font-medium text-foreground">
                            {alert.title}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60 ml-5">
                          {alert.description}
                        </p>
                      </div>
                      <LamodaButton size="sm" variant="secondary">
                        <Link href={alert.href}>
                          {alert.action}
                        </Link>
                      </LamodaButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance metrics */}
          <div className="mb-16">
            <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
              Показатели
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {performanceMetrics.map((metric, index) => (
                <div key={metric.title} className="space-y-2 group">
                  <div className="text-3xl md:text-4xl font-light text-primary group-hover:text-foreground transition-colors duration-300">
                    {metric.value}
                  </div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider">
                    {metric.title}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-16">
            <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
              Действия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <div className="group border border-border hover:border-foreground transition-all duration-150 p-6 cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="h-5 w-5 text-foreground/40 group-hover:text-foreground transition-colors" />
                        {action.badge && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <h3 className="font-medium text-foreground mb-2">
                        {action.title}
                      </h3>
                      <p className="text-xs text-foreground/60">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Expert recommendations */}
          <div className="border-t border-border pt-8">
            <h2 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">
              Рекомендации
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-foreground font-medium mb-2">
                    Добавьте фото товаров на модели
                  </p>
                  <p className="text-sm text-foreground/60 mb-3">
                    Увеличивает конверсию на 25%
                  </p>
                  <LamodaButton variant="secondary" size="sm">
                    Узнать подробнее
                  </LamodaButton>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
    </PageLayout>
  )
}
