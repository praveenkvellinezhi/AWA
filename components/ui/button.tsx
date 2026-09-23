import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        outline:
          "border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 text-slate-800 dark:text-zinc-200 shadow-sm hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white",
        secondary:
          "bg-slate-100 text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-200 hover:text-slate-900 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
        link:
          "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
        amber:
          "bg-amber-500 text-slate-950 font-bold shadow hover:bg-amber-400 active:bg-amber-600",
        forest:
          "bg-[#008235] text-white shadow-xs hover:bg-[#006e2c] active:bg-[#005a24]",
        emerald:
          "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800",
        slate:
          "bg-slate-900 text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-6 text-sm",
        icon: "h-9 w-9 rounded-lg",
        pill: "h-8 rounded-full px-4 text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size, className }), child.props.className),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
