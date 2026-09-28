"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: controlledOpen,
  onOpenChange,
  children,
}: DialogProps) {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, onClick, ...props }, ref) => {
  const { setOpen } = useDialog();

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
DialogTrigger.displayName = "DialogTrigger";

export function DialogPortal({ children }: { children: React.ReactNode }) {
  const { open } = useDialog();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

export const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useDialog();

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
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }
>(({ className, children, showCloseButton = true, ...props }, ref) => {
  const { setOpen } = useDialog();

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#131B2A] p-6 shadow-2xl duration-200 animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

export function DialogFooter({
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
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const { setOpen } = useDialog();

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
DialogClose.displayName = "DialogClose";
