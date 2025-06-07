"use client"

import { useState } from "react"
import { Download, Plus, Search, Grid, List } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui"
import { 
  MobileLayout,
  PageWrapper,
  Filters, 
  DataTable, 
  EmptyState, 
  EmptyIcon,
  SidebarPanel,
  InfoCard,
  SidebarList,
  AnimatedCard
} from "@/components/shared"
import { ProductCard, MobileCardList } from "@/components/shared/mobile-card"
import { MobileFilters, productFilterSections } from "@/components/shared/mobile-filters"
import { cn, isTouchDevice } from "@/lib/utils"
import type { TabItem } from "@/types/lamoda"
import { mockProducts } from "@/lib/mock-data"

// Табы для товаров
const productTabs: TabItem[] = [
  { name: "Все товары", key: "all" },
  { name: "Товары на сайте", key: "live" },
  { name: "Скрытые", key: "hidden" },
  { name: "Нет в наличии", key: "out-of-stock" },
  { name: "Товары на съемке", key: "photo-session" },
]

// Используем мокованные данные
// const mockProducts: Product[] = []

const productColumns = [
  {
    key: "images",
    label: "Фото",
    width: "80px",
    render: (value: unknown) => {
      const images = value as string[]
      return (
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
          {images?.[0] ? (
            <Image 
              src={images[0]} 
              alt="Product" 
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-md" 
            />
          ) : (
            <span className="text-xs text-muted-foreground">Нет фото</span>
          )}
        </div>
      )
    },
  },
  {
    key: "name",
    label: "Наименование товара",
    sortable: true,
  },
  {
    key: "sellerSku",
    label: "Seller SKU",
    sortable: true,
  },
  {
    key: "lamodaSku",
    label: "Lamoda SKU",
    sortable: true,
  },
  {
    key: "status",
    label: "Статус",
    render: (value: unknown) => {
      const status = value as string
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'moderation' ? 'bg-yellow-100 text-yellow-800' :
          status === 'inactive' ? 'bg-gray-100 text-gray-800' :
          status === 'draft' ? 'bg-blue-100 text-blue-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'active' ? 'Активный' :
           status === 'moderation' ? 'На модерации' :
           status === 'inactive' ? 'Неактивный' :
           status === 'draft' ? 'Черновик' :
           'Отклонен'}
        </span>
      )
    },
  },
]

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(() => 
    isTouchDevice() ? 'cards' : 'table'
  )

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.lamodaSku?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'live' && product.status === 'active') ||
      (activeTab === 'hidden' && product.status === 'inactive') ||
      (activeTab === 'out-of-stock' && product.inStock === 0) ||
      (activeTab === 'photo-session' && product.status === 'moderation')
    
    return matchesSearch && matchesTab
  })

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleProductView = (product: typeof mockProducts[0]) => {
    console.log("Просмотр товара:", product)
  }

  const handleProductEdit = (product: typeof mockProducts[0]) => {
    console.log("Редактирование товара:", product)
  }

  const handleProductDelete = (product: typeof mockProducts[0]) => {
    console.log("Удаление товара:", product)
  }

  const sidebarItems = [
    {
      title: "Изменение паковых этикеток",
      subtitle: "Новый формат этикеток 75x120мм, подробнее — в статье",
      badge: "6/8",
    },
    {
      title: "Съемка «Товары для дома»",
      subtitle: "Стандарты изображений и описания товаров в разделе «Товары для дома»",
    },
  ]

  const sidebar = (
    <SidebarPanel title="Для вас">
      <div className="space-y-6 md:space-y-8">
        <InfoCard
          title="Больше продаж с рекламой на Lamoda"
          description="Продвигайте ваши товары от 1000 рублей в день. Без оплаты за показы — вы платите только за посещения страницы товара."
          actions={
            <Button variant="outline" size="sm" className="w-full">
              Получить доступ
            </Button>
          }
        />

        <SidebarList items={sidebarItems} />

        <InfoCard
          title="Как отправить фото на пречек и зачем это нужно?"
          description="«Пречек»"
        />
      </div>
    </SidebarPanel>
  )

  const emptyState = (
    <EmptyState
      icon={<EmptyIcon />}
      title="Товары не найдены"
      description="Попробуйте изменить условия поиска или добавить новый товар"
      action={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
        </Button>
      }
    />
  )

  return (
    <MobileLayout showSidebar={showSidebar} sidebar={sidebar}>
      <PageWrapper maxWidth="2xl">
        {/* Header */}
        <AnimatedCard className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Управление товарами
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {filteredProducts.length} товаров найдено
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid className="h-4 w-4 mr-1" />
                    Карточки
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Таблица
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="h-9 md:h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Добавить</span>
                </Button>
                <Button variant="outline" size="sm" className="h-9 md:h-10">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Экспорт</span>
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию, SKU, бренду..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>
        </AnimatedCard>

        {/* Tabs */}
        <AnimatedCard delay={200} className="mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
              {productTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "py-3 px-1 border-b-2 font-medium text-sm md:text-base transition-colors whitespace-nowrap flex-shrink-0",
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  {tab.name}
                  {tab.count && (
                    <span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </AnimatedCard>

        {/* Filters */}
        <AnimatedCard delay={300} className="mb-6">
          {isTouchDevice() ? (
            <MobileFilters
              sections={productFilterSections}
              onApply={(filters) => console.log('Applied filters:', filters)}
              onReset={() => console.log('Reset filters')}
            />
          ) : (
            <Filters
              searchPlaceholder="Дополнительные фильтры (статус, категория, цена...)"
              onSearch={() => {}}
            />
          )}
        </AnimatedCard>

        {/* Content */}
        <AnimatedCard delay={400}>
          {viewMode === 'cards' || window.innerWidth < 768 ? (
            /* Mobile Cards */
            <MobileCardList
              items={filteredProducts}
              renderCard={(product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={handleProductView}
                  onEdit={handleProductEdit}
                  onDelete={handleProductDelete}
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
              {filteredProducts.length > 0 ? (
                <DataTable
                  data={filteredProducts}
                  columns={productColumns}
                  onRowClick={handleProductView}
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
              <div className="text-2xl font-bold text-green-600">{mockProducts.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Активных</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{mockProducts.filter(p => p.status === 'moderation').length}</div>
              <div className="text-sm text-muted-foreground">На модерации</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockProducts.filter(p => p.status === 'draft').length}</div>
              <div className="text-sm text-muted-foreground">Черновиков</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{mockProducts.filter(p => p.inStock === 0).length}</div>
              <div className="text-sm text-muted-foreground">Нет в наличии</div>
            </div>
          </div>
        </AnimatedCard>
      </PageWrapper>
    </MobileLayout>
  )
} 