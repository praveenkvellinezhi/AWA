import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-700",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        destructive:
          "border-transparent bg-rose-600 text-white shadow hover:bg-rose-700",
        outline:
          "border-slate-200 text-slate-800 dark:border-zinc-800 dark:text-zinc-200",
        amber:
          "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300",
        emerald:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        indigo:
          "border-indigo-500/30 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
