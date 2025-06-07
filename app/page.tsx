"use client"

import Link from "next/link"
import { Package, ShoppingCart, TrendingUp, FileText, TrendingDown } from "lucide-react"
import { 
  MobileLayout, 
  PageWrapper, 
  AnimatedCard, 
  ResponsiveGrid,
  StatsContainer,
  StatCard
} from "@/components/shared"
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
    type: "order"
  },
  {
    title: "Товар требует модерации",
    description: "Кроссовки Nike Air Max",
    time: "1 час назад",
    type: "moderation"
  },
  {
    title: "Заказ отгружен",
    description: "Заказ #12340 передан в доставку",
    time: "2 часа назад",
    type: "shipped"
  },
]

export default function HomePage() {
  return (
    <MobileLayout>
      <PageWrapper maxWidth="2xl">
        {/* Welcome section */}
        <AnimatedCard className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Добро пожаловать в Lamoda Seller
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Управляйте своим бизнесом на Lamoda из одного места
          </p>
        </AnimatedCard>

        {/* Stats overview */}
        <AnimatedCard delay={200} className="mb-8 md:mb-12">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Статистика за сегодня
          </h2>
          <StatsContainer>
            <StatCard
              title="Заказы сегодня"
              value="24"
              change="+12% от вчера"
              changeType="positive"
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <StatCard
              title="Выручка"
              value="₽67,890"
              change="+8% от вчера"
              changeType="positive"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatCard
              title="Товары"
              value="156"
              change="Активных"
              changeType="neutral"
              icon={<Package className="h-5 w-5" />}
            />
            <StatCard
              title="Конверсия"
              value="3.2%"
              change="-0.5% от вчера"
              changeType="negative"
              icon={<TrendingDown className="h-5 w-5" />}
            />
          </StatsContainer>
        </AnimatedCard>

        {/* Content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Quick actions */}
          <div className="xl:col-span-2">
            <AnimatedCard delay={400}>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
                Быстрые действия
              </h2>
              <ResponsiveGrid columns={{ sm: 1, md: 2 }} gap="md">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <AnimatedCard key={action.href} delay={500 + index * 100}>
                      <Link href={action.href}>
                        <div className="bg-card p-4 md:p-6 rounded-xl border border-border hover:shadow-lg hover:border-border/60 transition-all duration-200 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </AnimatedCard>
                  )
                })}
              </ResponsiveGrid>
            </AnimatedCard>
          </div>

          {/* Recent activity */}
          <div className="xl:col-span-1">
            <AnimatedCard delay={600}>
              <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
                Последняя активность
              </h2>
              <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                <div className="space-y-4">
                  {recentActivity.map((item, index) => (
                    <AnimatedCard key={index} delay={700 + index * 100} direction="right">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
                <AnimatedCard delay={1000}>
                  <Button variant="outline" size="sm" className="w-full mt-4 hover:bg-accent">
                    Показать все
                  </Button>
                </AnimatedCard>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </PageWrapper>
    </MobileLayout>
  )
}
