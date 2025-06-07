"use client"

import { useState } from "react"
import { Download, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui"
import { 
  MobileLayout,
  PageWrapper,
  Filters, 
  FilterCheckbox, 
  DataTable, 
  EmptyState, 
  EmptyIcon 
} from "@/components/shared"
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

  return (
    <MobileLayout>
      <PageWrapper>
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Управление заказами
          </h1>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Filters
          searchPlaceholder="Например: Вы можете ввести номер заказа, email, фамилию или телефон"
          className="mb-6"
        />

        {/* Additional filter */}
        <div className="mb-6">
          <FilterCheckbox
            label="Показать заказы с актами несоответствия"
            checked={showMismatchOrders}
            onChange={setShowMismatchOrders}
          />
        </div>

        {/* Data table */}
        {mockOrders.length > 0 ? (
          <DataTable
            data={mockOrders}
            columns={orderColumns}
            onRowClick={(order: Order) => {
              console.log("Открыть заказ:", order)
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