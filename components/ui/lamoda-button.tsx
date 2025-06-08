import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-foreground text-white hover:bg-foreground/90 active:bg-foreground/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-white hover:bg-muted/50 hover:border-foreground text-foreground",
        secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
        ghost: "hover:bg-muted/50 hover:text-foreground text-foreground/60",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-12 px-6 py-3 text-sm", // Increased from h-10 for better mobile touch
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-base", // Larger for primary actions on mobile
        icon: "h-12 w-12", // Increased from h-10 w-10 for better touch targets
        touch: "h-16 px-8 py-4 text-base min-w-[120px]" // Special touch-optimized size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const LamodaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // When using asChild, we need to ensure only one child is passed to Slot
    const content = loading || asChild ? (
      <span className="flex items-center">
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
    ) : children
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          // Additional mobile optimizations
          "select-none tap-highlight-transparent", // Prevent text selection and tap highlights
          loading && "opacity-70 cursor-not-allowed",
          // Ensure minimum touch target on mobile
          "min-h-[44px] md:min-h-[auto]"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
LamodaButton.displayName = "LamodaButton"

export { LamodaButton, buttonVariants } 