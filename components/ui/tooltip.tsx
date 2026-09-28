"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("inline-flex", className)} {...props}>
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "bottom" | "left" | "right" }
>(({ className, side = "top", children, ...props }, ref) => {
  const context = React.useContext(TooltipContext);
  if (!context?.open) return null;

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={ref}
      role="tooltip"
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-slate-900 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-white shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-nowrap border border-slate-700 dark:border-zinc-700",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";
