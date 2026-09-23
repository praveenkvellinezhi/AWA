"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a <Select>");
  }
  return context;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (action: boolean | ((prev: boolean) => boolean)) => {
      const nextOpen = typeof action === "function" ? action(open) : action;
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, open, onOpenChange]
  );

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isValueControlled) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
      setOpen(false);
    },
    [isValueControlled, onValueChange, setOpen]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild, onClick, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useSelect();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpen((prev) => !prev);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref: (node: any) => {
          triggerRef.current = node;
          const childRef = (child as any).ref;
          if (typeof childRef === "function") childRef(node);
          else if (childRef) childRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        },
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
        "aria-expanded": open,
        className: cn("cursor-pointer", className, child.props.className),
      });
    }

    return (
      <button
        type="button"
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onClick={handleClick}
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white shadow-xs ring-offset-background placeholder:text-slate-400 focus:outline-none focus:border-[#008235] focus:ring-1 focus:ring-[#008235] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const { value } = useSelect();
  return (
    <span className={cn("block truncate text-xs", !value && "text-slate-400", className)}>
      {value || placeholder}
    </span>
  );
}

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = useSelect();
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "absolute left-0 z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-slate-900 dark:text-slate-100 shadow-md animate-in fade-in-80 duration-100",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const { value, onValueChange } = useSelect();
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        onClick={() => onValueChange?.(itemValue)}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-2 pr-8 text-xs outline-none hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors",
          isSelected && "bg-emerald-50/60 dark:bg-emerald-950/40 text-[#008235] dark:text-emerald-400 font-semibold",
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && (
          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            <Check className="h-4 w-4 text-[#008235] dark:text-emerald-400" />
          </span>
        )}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export interface SelectNativeProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full h-9 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#008235] focus:ring-1 focus:ring-[#008235] transition-colors appearance-none cursor-pointer shadow-xs disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }
);
SelectNative.displayName = "SelectNative";
