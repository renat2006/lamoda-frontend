import type { Order, Product, Analytics } from "@/types/lamoda"

// Мокованные заказы
export const mockOrders: Order[] = [
  {
    id: "1",
    number: "LM12345",
    date: "2024-06-07",
    status: "new",
    amount: 4500,
    itemsCount: 2,
    customer: {
      name: "Анна Петрова",
      email: "anna@example.com",
      phone: "+7 900 123-45-67"
    },
    shippingDeadline: "2024-06-10",
    items: [
      {
        id: "1",
        productId: "p1",
        sku: "SHOE001",
        name: "Кроссовки Nike Air Max",
        size: "40",
        color: "Белый",
        quantity: 1,
        price: 3000,
        image: "/images/product1.jpg"
      },
      {
        id: "2", 
        productId: "p2",
        sku: "TSHIRT001",
        name: "Футболка Adidas",
        size: "M",
        color: "Черный",
        quantity: 1,
        price: 1500,
        image: "/images/product2.jpg"
      }
    ]
  },
  {
    id: "2",
    number: "LM12346",
    date: "2024-06-06",
    status: "processing",
    amount: 2800,
    itemsCount: 1,
    customer: {
      name: "Иван Сидоров",
      phone: "+7 900 987-65-43"
    },
    shippingDeadline: "2024-06-09",
    items: [
      {
        id: "3",
        productId: "p3",
        sku: "JACKET001",
        name: "Куртка Zara",
        size: "L",
        color: "Темно-синий",
        quantity: 1,
        price: 2800,
        image: "/images/product3.jpg"
      }
    ]
  }
]

// Мокованные товары
export const mockProducts: Product[] = [
  {
    id: "p1",
    sellerSku: "SHOE001",
    lamodaSku: "LM-SHOE001-40",
    name: "Кроссовки Nike Air Max 270",
    description: "Современные кроссовки с инновационной подушкой Air Max",
    category: "Обувь",
    brand: "Nike",
    price: 8990,
    discountPrice: 6990,
    images: ["/images/nike-air-max-1.jpg", "/images/nike-air-max-2.jpg"],
    status: "active",
    inStock: 15,
    sizes: [
      { size: "39", quantity: 3 },
      { size: "40", quantity: 5 },
      { size: "41", quantity: 4 },
      { size: "42", quantity: 3 }
    ],
    attributes: [
      { name: "Материал", value: "Текстиль, синтетика" },
      { name: "Подошва", value: "Резина" },
      { name: "Застежка", value: "Шнурки" }
    ],
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-06-01T15:30:00Z"
  },
  {
    id: "p2",
    sellerSku: "TSHIRT001",
    lamodaSku: "LM-TSHIRT001-M",
    name: "Футболка Adidas Originals",
    description: "Классическая футболка с логотипом бренда",
    category: "Одежда",
    brand: "Adidas",
    price: 2990,
    images: ["/images/adidas-tshirt-1.jpg"],
    status: "moderation",
    inStock: 25,
    sizes: [
      { size: "S", quantity: 8 },
      { size: "M", quantity: 10 },
      { size: "L", quantity: 7 }
    ],
    attributes: [
      { name: "Материал", value: "100% хлопок" },
      { name: "Крой", value: "Прямой" },
      { name: "Рукав", value: "Короткий" }
    ],
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-05T09:15:00Z"
  }
]

// Мокованная аналитика
export const mockAnalytics: Analytics = {
  period: "month",
  sales: [
    { date: "2024-06-01", amount: 15000, ordersCount: 8 },
    { date: "2024-06-02", amount: 22000, ordersCount: 12 },
    { date: "2024-06-03", amount: 18000, ordersCount: 9 },
    { date: "2024-06-04", amount: 25000, ordersCount: 15 },
    { date: "2024-06-05", amount: 30000, ordersCount: 18 },
    { date: "2024-06-06", amount: 20000, ordersCount: 11 },
    { date: "2024-06-07", amount: 28000, ordersCount: 16 }
  ],
  topProducts: [
    {
      productId: "p1",
      name: "Кроссовки Nike Air Max 270",
      salesCount: 45,
      revenue: 314550
    },
    {
      productId: "p2", 
      name: "Футболка Adidas Originals",
      salesCount: 32,
      revenue: 95680
    }
  ],
  metrics: {
    totalRevenue: 410230,
    averageCheck: 4890,
    conversionRate: 3.2,
    returnRate: 2.1
  }
}

// Статусы для фильтров
export const orderStatuses = [
  { value: "new", label: "Новые" },
  { value: "processing", label: "В обработке" },
  { value: "shipped", label: "Отгружены" },
  { value: "delivered", label: "Доставлены" },
  { value: "cancelled", label: "Отменены" }
]

export const productStatuses = [
  { value: "active", label: "Активные" },
  { value: "moderation", label: "На модерации" },
  { value: "inactive", label: "Неактивные" },
  { value: "draft", label: "Черновики" },
  { value: "rejected", label: "Отклонены" }
]

// Страны для фильтров
export const countries = [
  { value: "ru", label: "Россия" },
  { value: "kz", label: "Казахстан" },
  { value: "by", label: "Беларусь" },
  { value: "uz", label: "Узбекистан" }
] 