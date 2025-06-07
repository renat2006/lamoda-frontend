import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "Упс, здесь ничего нет",
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      {icon && (
        <div className="mb-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}

// Иконка из референса - 2 овала
export function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="120" 
      height="80" 
      viewBox="0 0 120 80" 
      fill="none" 
      className={cn("text-muted-foreground", className)}
    >
      <ellipse 
        cx="30" 
        cy="40" 
        rx="20" 
        ry="30" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <ellipse 
        cx="90" 
        cy="40" 
        rx="20" 
        ry="30" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
      <circle cx="30" cy="25" r="8" fill="currentColor" />
      <circle cx="90" cy="25" r="8" fill="currentColor" />
    </svg>
  )
} 