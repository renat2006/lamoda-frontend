import { MobileNav } from "@/components/shared/mobile-nav"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  )
} 