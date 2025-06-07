"use client"

import { useState } from "react"
import { Download, ChevronRight } from "lucide-react"
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
  SidebarList
} from "@/components/shared"
import { cn } from "@/lib/utils"
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
      <div className="space-y-8">
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

  return (
    <MobileLayout showSidebar={showSidebar} sidebar={sidebar}>
      <PageWrapper>
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">
              Управление товарами Россия
            </h1>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Добавить
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <Button size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              {productTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
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

          {/* Filters */}
          <Filters
            searchPlaceholder="Например: Наименование товара, Seller SKU, Parent SKU, Lamoda SKU, EAN или бренд"
            className="mb-6"
          />

          {/* Data table */}
          {mockProducts.length > 0 ? (
            <DataTable
              data={mockProducts}
              columns={productColumns}
              onRowClick={(product) => {
                console.log("Открыть товар:", product)
              }}
            />
          ) : (
            <div className="border border-border rounded-lg bg-background min-h-[400px] flex items-center justify-center">
              <EmptyState
                icon={<EmptyIcon />}
                title="Упс, здесь ничего нет"
              />
            </div>
          )}
      </PageWrapper>
    </MobileLayout>
  )
} 