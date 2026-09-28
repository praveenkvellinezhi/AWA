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
  itemLabels: Record<string, React.ReactNode>;
  registerItem: (value: string, label: React.ReactNode) => void;
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
  const [itemLabels, setItemLabels] = React.useState<Record<string, React.ReactNode>>({});
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

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    setItemLabels((prev) => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerRef,
        itemLabels,
        registerItem,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("py-1", className)} {...props}>
        {children}
      </div>
    );
  }
);
SelectGroup.displayName = "SelectGroup";

export interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectLabel.displayName = "SelectLabel";

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-zinc-800", className)}
        {...props}
      />
    );
  }
);
SelectSeparator.displayName = "SelectSeparator";

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
          "flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-950 dark:text-white hover:border-slate-400 dark:hover:border-zinc-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SelectValue({ placeholder, className, children }: SelectValueProps) {
  const { value, itemLabels } = useSelect();
  const label = itemLabels[value || ""];
  const display = children !== undefined ? children : label !== undefined ? label : value || placeholder;

  return (
    <span
      className={cn(
        "block truncate text-xs font-semibold text-left",
        !value && "text-slate-400 dark:text-slate-500 font-normal",
        className
      )}
    >
      {display}
    </span>
  );
}

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "left" | "right";
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, align = "left", ...props }, ref) => {
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

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          "absolute z-50 mt-1 max-h-72 min-w-[12rem] w-full overflow-y-auto overflow-x-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111827] p-1 text-slate-900 dark:text-slate-100 shadow-xl [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full animate-in fade-in-80 zoom-in-95 duration-150",
          align === "right" ? "right-0" : "left-0",
          !open && "hidden",
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
    const { value, onValueChange, registerItem } = useSelect();
    const isSelected = value === itemValue;

    // Register label for SelectValue display
    React.useEffect(() => {
      registerItem(itemValue, children);
    }, [itemValue, children, registerItem]);

    return (
      <div
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onValueChange?.(itemValue);
        }}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 pr-8 text-xs font-medium outline-none transition-colors",
          isSelected
            ? "bg-[#EAF5ED] dark:bg-emerald-950/60 text-[#008235] dark:text-emerald-300 font-semibold"
            : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white",
          className
        )}
        {...props}
      >
        <span className="truncate flex items-center gap-2">{children}</span>
        {isSelected && (
          <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center">
            <Check className="h-4 w-4 text-[#008235] dark:text-emerald-400 stroke-[2.5]" />
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
            "w-full h-9 bg-white dark:bg-slate-950 border border-slate-300 dark:border-zinc-800 rounded-xl px-3 py-1.5 pr-8 text-xs text-slate-950 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors appearance-none cursor-pointer shadow-2xs disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="h-4 w-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }
);
SelectNative.displayName = "SelectNative";
