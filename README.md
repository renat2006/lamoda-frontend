# Lamoda Seller - Приложение продавца

Веб-приложение для продавцов (селлеров) Lamoda, которое упрощает управление заказами, товарами, клиентами и аналитикой. Построено на Next.js 15 с использованием shadcn/ui компонентов и Tailwind CSS v4.

## 📋 Описание кейса

Этот проект решает проблему продавцов на маркетплейсе Lamoda, которым нужен оперативный доступ к управлению бизнесом. Текущий веб-интерфейс Lamoda Seller сложный и не адаптирован для мобильных устройств.

### Ключевые функции:
- 📦 **Управление товарами** - просмотр, добавление и редактирование товаров
- 🛒 **Управление заказами** - отслеживание и обработка заказов  
- 📊 **Аналитика** - графики продаж и статистика
- 🚚 **Логистика** - управление поставками
- 💬 **Взаимодействие с площадкой** - чат и уведомления

## 🚀 Технологический стек

- **Framework**: [Next.js 15](https://nextjs.org/) с App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks + Context API
- **Form Handling**: React Hook Form (рекомендуется добавить)
- **HTTP Client**: Fetch API с кастомными утилитами

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   │   ├── button.tsx    # Компонент кнопки
│   │   └── index.ts      # Экспорт UI компонентов
│   └── shared/           # Переиспользуемые компоненты
│       ├── header.tsx    # Компонент заголовка
│       └── index.ts      # Экспорт shared компонентов
├── hooks/                # Кастомные React хуки
│   ├── use-local-storage.ts
│   └── index.ts
├── lib/                  # Утилиты и конфигурация
│   └── utils.ts         # Утилиты для работы с классами
├── types/               # TypeScript типы
│   └── index.ts        # Глобальные типы
├── utils/              # Вспомогательные функции
│   ├── api.ts         # API утилиты
│   ├── constants.ts   # Константы приложения
│   └── index.ts       # Экспорт утилит
├── public/            # Статические файлы
│   ├── icons/        # Иконки
│   └── images/       # Изображения
├── components.json    # Конфигурация shadcn/ui
├── tailwind.config.ts # Конфигурация Tailwind CSS
└── tsconfig.json     # Конфигурация TypeScript
```

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18.17 или выше
- npm, yarn, pnpm или bun

### Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd frontend
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
# или
pnpm install
```

3. Скопируйте файл переменных окружения:
```bash
cp .env.example .env.local
```

4. Настройте переменные окружения в `.env.local`

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm run start
```

## 🎯 Готовые компоненты

Проект содержит готовые компоненты для быстрой разработки:

### UI компоненты (`components/ui/`)
- `Button` - кнопки с различными вариантами стилизации

### Shared компоненты (`components/shared/`)
- `LamodaHeader` - шапка с навигацией в стиле Lamoda Seller
- `DataTable` - универсальная таблица с сортировкой и чекбоксами
- `Filters` - компонент фильтров с поиском и датами
- `EmptyState` - состояние "ничего не найдено" с иконкой
- `SidebarPanel` - боковая панель для дополнительной информации
- `InfoCard` - информационные карточки
- `SidebarList` - списки для боковой панели

### Готовые страницы
- `/` - главная страница с дашбордом
- `/orders` - управление заказами
- `/products` - управление товарами с табами и боковой панелью

### Типы данных (`types/lamoda.ts`)
Полный набор TypeScript типов для:
- Заказы и товары
- Аналитика и метрики  
- Фильтры и навигация
- API ответы

## 🎨 Работа с shadcn/ui

### Добавление новых компонентов

Для добавления новых компонентов shadcn/ui используйте CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# и т.д.
```

### Доступные компоненты

Проект настроен для работы со всеми компонентами shadcn/ui. Полный список доступен на [официальном сайте](https://ui.shadcn.com/docs/components).

### Кастомизация темы

Цвета и стили настраиваются в файле `app/globals.css`. Проект поддерживает светлую и темную темы.

## 📝 Разработка

### Добавление новых страниц

Создайте новую папку в `app/` директории:

```bash
mkdir app/about
touch app/about/page.tsx
```

### Создание компонентов

1. **UI компоненты** (базовые) → `components/ui/`
2. **Shared компоненты** (переиспользуемые) → `components/shared/`
3. **Page компоненты** (специфичные для страниц) → в соответствующей папке `app/`

### Работа с API

Используйте утилиты из `utils/api.ts`:

```typescript
import { api } from '@/utils/api'

// GET запрос
const users = await api.get('/users')

// POST запрос
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' })
```

### Кастомные хуки

Создавайте хуки в папке `hooks/` и экспортируйте через `hooks/index.ts`:

```typescript
// hooks/use-counter.ts
export function useCounter(initialValue = 0) {
  // логика хука
}

// hooks/index.ts
export { useCounter } from './use-counter'
```

## 🔧 Конфигурация

### Tailwind CSS

Конфигурация находится в `tailwind.config.ts`. Проект использует Tailwind CSS v4 с поддержкой:
- CSS переменных для цветов
- Темной темы
- Анимаций
- Кастомных утилит

### TypeScript

Строгая конфигурация TypeScript в `tsconfig.json` с поддержкой:
- Path mapping (`@/` для корневой директории)
- Строгой типизации
- Современных ES возможностей

### ESLint

Настроен ESLint с правилами Next.js для поддержания качества кода.

## 📦 Рекомендуемые пакеты для добавления

```bash
# Формы
npm install react-hook-form @hookform/resolvers zod

# Состояние
npm install zustand

# Анимации
npm install framer-motion

# Даты
npm install date-fns

# Иконки (дополнительно)
npm install @heroicons/react

# Аутентификация
npm install next-auth

# База данных (если нужно)
npm install prisma @prisma/client
```

## 🚀 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к [Vercel](https://vercel.com)
2. Настройте переменные окружения
3. Деплой произойдет автоматически

### Другие платформы

Проект совместим с любыми платформами, поддерживающими Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📚 Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.
