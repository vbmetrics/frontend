// src/components/ui/button.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background hover:bg-accent",
        ghost: "hover:bg-accent text-foreground",
        soft: "border border-accent-soft bg-accent-soft text-foreground hover:bg-accent-soft/90",
        ghostAccent: "text-primary hover:bg-accent-soft",
        link: "text-primary underline-offset-4 hover:underline",
        navbar: "text-foreground hover:bg-accent",
        start: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-9 px-3 py-2",
        sm: "h-8 px-2",
        lg: "h-10 px-4",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
