"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within <Sheet>");
  }
  return context;
}

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (action: boolean | ((prev: boolean) => boolean)) => {
      const nextOpen = typeof action === "function" ? action(open) : action;
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, open, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const { setOpen } = useSheet();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
SheetTrigger.displayName = "SheetTrigger";

export function SheetPortal({ children }: { children: React.ReactNode }) {
  const { open } = useSheet();
  if (!open) return null;

  return <div className="fixed inset-0 z-50 overflow-hidden">{children}</div>;
}

export const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useSheet();

  return (
    <div
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200",
        className
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const { setOpen } = useSheet();

    const sideClasses = {
      top: "inset-x-0 top-0 border-b animate-in slide-in-from-top",
      bottom: "inset-x-0 bottom-0 border-t animate-in slide-in-from-bottom",
      left: "inset-y-0 left-0 h-full w-3/4 border-r animate-in slide-in-from-left sm:max-w-sm",
      right:
        "inset-y-0 right-0 h-full w-full sm:max-w-xl md:max-w-2xl border-l animate-in slide-in-from-right",
    };

    return (
      <SheetPortal>
        <SheetOverlay />
        <div
          ref={ref}
          className={cn(
            "fixed z-50 gap-4 bg-white dark:bg-[#111726] p-6 shadow-2xl transition ease-in-out duration-300 border-border/80 dark:border-zinc-800 overflow-y-auto",
            sideClasses[side],
            className
          )}
          {...props}
        >
          {children}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = "SheetContent";

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2",
        className
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const { setOpen } = useSheet();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
});
SheetClose.displayName = "SheetClose";
