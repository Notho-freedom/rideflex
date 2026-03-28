import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const rfButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-card hover:bg-muted hover:text-foreground",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
        brand: "bg-gradient-brand text-primary-foreground hover:opacity-90",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-xs",
        lg: "h-10 gap-1.5 px-4",
        xl: "h-12 gap-2 px-6 text-lg rounded-xl",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

interface RFButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof rfButtonVariants> {}

const RFButton = React.forwardRef<HTMLButtonElement, RFButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button ref={ref} className={cn(rfButtonVariants({ variant, size, className }))} {...props} />
  )
);
RFButton.displayName = "RFButton";

export { RFButton, rfButtonVariants };
