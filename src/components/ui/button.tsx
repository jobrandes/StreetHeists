import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
  {
    variants: {
      variant: {
        gold: "bg-gold font-semibold text-ink hover:bg-[#edd15d]",
        bronze: "border border-gold bg-transparent text-cream hover:bg-gold/10",
        ghost: "bg-transparent text-body hover:bg-white/5",
        fail: "bg-transparent text-fail border border-fail/50 hover:bg-fail/10",
        cream: "bg-cream text-ink hover:bg-white",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-14 px-6 text-base",
        xl: "h-16 px-8 text-lg tracking-wide",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
