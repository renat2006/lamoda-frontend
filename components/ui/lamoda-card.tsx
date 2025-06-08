import * as React from "react"
import { cn } from "@/lib/utils"

const LamodaCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "interactive"
    size?: "sm" | "md" | "lg"
  }
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  const variants = {
    default: "bg-white border border-border",
    interactive: "bg-white border border-border hover:shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
  }

  const sizes = {
    sm: "p-3",
    md: "p-4 md:p-6", 
    lg: "p-6 md:p-8"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "text-foreground",
        variants[variant],
        sizes[size],
        // Mobile-first improvements
        "touch-manipulation", // Improves touch responsiveness
        "min-h-[44px]", // Minimum touch target size
        className
      )}
      {...props}
    />
  )
})
LamodaCard.displayName = "LamodaCard"

// Компонент заголовка карточки
interface LamodaCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  border?: boolean
}

const LamodaCardHeader = React.forwardRef<HTMLDivElement, LamodaCardHeaderProps>(
  ({ className, children, border = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5",
          border && "pb-4 border-b border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LamodaCardHeader.displayName = "LamodaCardHeader"

// Компонент заголовка
interface LamodaCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

const LamodaCardTitle = React.forwardRef<HTMLParagraphElement, LamodaCardTitleProps>(
  ({ className, children, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-base",
      md: "text-lg", 
      lg: "text-xl"
    }
    
    return (
      <h3
        ref={ref}
        className={cn(
          "font-semibold leading-none tracking-tight text-foreground",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

LamodaCardTitle.displayName = "LamodaCardTitle"

// Компонент описания
interface LamodaCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const LamodaCardDescription = React.forwardRef<HTMLParagraphElement, LamodaCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

LamodaCardDescription.displayName = "LamodaCardDescription"

// Компонент контента
interface LamodaCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const LamodaCardContent = React.forwardRef<HTMLDivElement, LamodaCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("pt-0", className)} {...props}>
        {children}
      </div>
    )
  }
)

LamodaCardContent.displayName = "LamodaCardContent"

// Компонент футера
interface LamodaCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const LamodaCardFooter = React.forwardRef<HTMLDivElement, LamodaCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LamodaCardFooter.displayName = "LamodaCardFooter"

export {
  LamodaCard,
  LamodaCardHeader,
  LamodaCardTitle,
  LamodaCardDescription,
  LamodaCardContent,
  LamodaCardFooter,
} 