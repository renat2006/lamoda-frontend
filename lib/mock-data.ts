import type { Order, Product, Analytics } from "@/types/lamoda"

// Мокованные заказы
export const mockOrders: Order[] = [
  {
    id: "1",
    number: "LAM-2024-001",
    date: "15.01.2024",
    shippingDeadline: "18.01.2024",
    amount: 15420,
    itemsCount: 3,
    status: "new",
    customer: {
      name: "Анна Петрова",
      email: "anna.petrova@example.com",
      phone: "+7 (999) 123-45-67"
    }
  },
  {
    id: "2",
    number: "LAM-2024-002",
    date: "15.01.2024",
    shippingDeadline: "19.01.2024",
    amount: 8900,
    itemsCount: 2,
    status: "processing",
    customer: {
      name: "Дмитрий Смирнов",
      email: "dmitry.smirnov@example.com"
    }
  },
  {
    id: "3",
    number: "LAM-2024-003",
    date: "14.01.2024",
    amount: 25300,
    itemsCount: 5,
    status: "shipped",
    customer: {
      name: "Елена Иванова",
      email: "elena.ivanova@example.com",
      phone: "+7 (985) 777-88-99"
    }
  },
  {
    id: "4",
    number: "LAM-2024-004",
    date: "13.01.2024",
    amount: 12600,
    itemsCount: 1,
    status: "delivered",
    customer: {
      name: "Михаил Козлов"
    }
  },
  {
    id: "5",
    number: "LAM-2024-005",
    date: "12.01.2024",
    amount: 4500,
    itemsCount: 2,
    status: "cancelled",
    customer: {
      name: "Ольга Никитина",
      email: "olga.nikitina@example.com"
    }
  }
]

// Мокованные товары
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Куртка зимняя мужская Nike",
    sellerSku: "NIKE-JKT-001",
    lamodaSku: "LA12345678",
    price: 12500,
    discountPrice: 9990,
    inStock: 15,
    status: "active",
    brand: "Nike",
    category: "Верхняя одежда",
    images: ["/api/placeholder/300/300?text=Nike+Jacket"]
  },
  {
    id: "2", 
    name: "Платье вечернее Zara",
    sellerSku: "ZARA-DRS-002",
    lamodaSku: "LA87654321",
    price: 8900,
    inStock: 8,
    status: "moderation",
    brand: "Zara",
    category: "Платья",
    images: ["/api/placeholder/300/300?text=Zara+Dress"]
  },
  {
    id: "3",
    name: "Кроссовки Adidas Ultraboost",
    sellerSku: "ADIDAS-SNK-003", 
    lamodaSku: "LA11223344",
    price: 15600,
    discountPrice: 12480,
    inStock: 22,
    status: "active",
    brand: "Adidas",
    category: "Обувь",
    images: ["/api/placeholder/300/300?text=Adidas+Sneakers"]
  },
  {
    id: "4",
    name: "Джинсы классические Levi's",
    sellerSku: "LEVIS-JNS-004",
    price: 7800,
    inStock: 0,
    status: "inactive",
    brand: "Levi's", 
    category: "Джинсы"
  },
  {
    id: "5",
    name: "Рубашка деловая Hugo Boss",
    sellerSku: "BOSS-SHT-005",
    lamodaSku: "LA55667788",
    price: 18900,
    inStock: 12,
    status: "draft",
    brand: "Hugo Boss",
    category: "Рубашки",
    images: ["/api/placeholder/300/300?text=Hugo+Boss+Shirt"]
  },
  {
    id: "6",
    name: "Сумка женская Michael Kors",
    sellerSku: "MK-BAG-006",
    lamodaSku: "LA99887766",
    price: 22400,
    discountPrice: 16800,
    inStock: 5,
    status: "active",
    brand: "Michael Kors",
    category: "Сумки",
    images: ["/api/placeholder/300/300?text=MK+Bag"]
  },
  {
    id: "7",
    name: "Свитер вязаный H&M",
    sellerSku: "HM-SWT-007",
    price: 3400,
    discountPrice: 2720,
    inStock: 25,
    status: "rejected",
    brand: "H&M",
    category: "Свитеры"
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