import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Главная',
    href: '/',
  },
  {
    title: 'Заказы',
    href: '/orders',
  },
  {
    title: 'Товары',
    href: '/products',
  },
  {
    title: 'Аналитика',
    href: '/analytics',
  },
  {
    title: 'Логистика',
    href: '/logistics',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 