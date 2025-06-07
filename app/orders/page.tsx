"use client"

import { useState } from "react"
import { Download, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui"
import { 
  MobileLayout,
  PageWrapper,
  Filters, 
  FilterCheckbox, 
  DataTable, 
  EmptyState, 
  EmptyIcon,
  AnimatedCard
} from "@/components/shared"
import { OrderCard, MobileCardList } from "@/components/shared/mobile-card"
import { MobileFilters, orderFilterSections } from "@/components/shared/mobile-filters"
import { isTouchDevice } from "@/lib/utils"
import type { Order } from "@/types/lamoda"
import { mockOrders } from "@/lib/mock-data"

// Используем мокованные данные
// const mockOrders: Order[] = []

const orderColumns = [
  {
    key: "number",
    label: "Номер заказа",
    sortable: true,
  },
  {
    key: "date",
    label: "Дата заказа",
    sortable: true,
  },
  {
    key: "shippingDeadline",
    label: "Отгрузка на склад Lamoda до даты",
    sortable: true,
  },
  {
    key: "amount",
    label: "Сумма заказа",
    render: (value: unknown) => `${(value as number).toLocaleString()} ₽`,
  },
  {
    key: "itemsCount",
    label: "Товаров в заказе",
  },
  {
    key: "status",
    label: "Статус",
    render: (value: unknown) => {
      const status = value as string
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          status === 'new' ? 'bg-blue-100 text-blue-800' :
          status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
          status === 'shipped' ? 'bg-green-100 text-green-800' :
          status === 'delivered' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'new' ? 'Новый' :
           status === 'processing' ? 'В обработке' :
           status === 'shipped' ? 'Отгружен' :
           status === 'delivered' ? 'Доставлен' :
           'Отменен'}
        </span>
      )
    },
  },
]

export default function OrdersPage() {
  const [showMismatchOrders, setShowMismatchOrders] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => 
    isTouchDevice() ? 'cards' : 'table'
  )

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const handleRefresh = async () => {
    setLoading(true)
    // Имитация загрузки данных
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleOrderView = (order: Order) => {
    console.log("Просмотр заказа:", order)
    // Навигация к деталям заказа
  }

  const handleOrderEdit = (order: Order) => {
    console.log("Редактирование заказа:", order)
  }

  const handleOrderDelete = (order: Order) => {
    console.log("Удаление заказа:", order)
  }

  const emptyState = (
    <EmptyState
      icon={<EmptyIcon />}
      title="Заказы не найдены"
      description="Попробуйте изменить условия поиска или добавить новый заказ"
      action={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать заказ
        </Button>
      }
    />
  )

  return (
    <MobileLayout>
      <PageWrapper maxWidth="2xl">
        {/* Header */}
        <AnimatedCard className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Title and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Управление заказами
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {filteredOrders.length} заказов найдено
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View toggle - только на планшетах и больше */}
                <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('cards')}
                  >
                    Карточки
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('table')}
                  >
                    Таблица
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="h-9 md:h-10">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Экспорт</span>
                </Button>
                <Button size="sm" className="h-9 md:h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Создать</span>
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по номеру заказа, клиенту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>
        </AnimatedCard>

        {/* Filters */}
        <AnimatedCard delay={200} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              {isTouchDevice() ? (
                <MobileFilters
                  sections={orderFilterSections}
                  onApply={(filters) => console.log('Applied filters:', filters)}
                  onReset={() => console.log('Reset filters')}
                />
              ) : (
                <Filters
                  searchPlaceholder="Дополнительные фильтры..."
                  onSearch={() => {}}
                />
              )}
            </div>
            <FilterCheckbox
              label="Показать заказы с актами несоответствия"
              checked={showMismatchOrders}
              onChange={setShowMismatchOrders}
            />
          </div>
        </AnimatedCard>

        {/* Content */}
        <AnimatedCard delay={400}>
          {viewMode === 'cards' || window.innerWidth < 768 ? (
            /* Mobile Cards */
            <MobileCardList
              items={filteredOrders}
              renderCard={(order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={handleOrderView}
                  onEdit={handleOrderEdit}
                  onDelete={handleOrderDelete}
                />
              )}
              onRefresh={handleRefresh}
              loading={loading}
              emptyState={emptyState}
              className="space-y-3"
            />
          ) : (
            /* Desktop Table */
            <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              {filteredOrders.length > 0 ? (
                <DataTable
                  data={filteredOrders}
                  columns={orderColumns}
                  onRowClick={handleOrderView}
                />
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  {emptyState}
                </div>
              )}
            </div>
          )}
        </AnimatedCard>

        {/* Quick Stats */}
        <AnimatedCard delay={600} className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-muted-foreground">Новых заказов</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <div className="text-sm text-muted-foreground">В обработке</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-muted-foreground">Отгружено</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-muted-foreground">Отменено</div>
            </div>
          </div>
        </AnimatedCard>
      </PageWrapper>
    </MobileLayout>
  )
} 