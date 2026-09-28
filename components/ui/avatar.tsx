"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarContextType {
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextType | null>(null);

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt = "", onError, onLoad, ...props }, ref) => {
  const context = React.useContext(AvatarContext);
  const [hasError, setHasError] = React.useState(!src);

  React.useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onLoad={(e) => {
        context?.setImageLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setHasError(true);
        context?.setImageLoaded(false);
        onError?.(e);
      }}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AvatarContext);

  if (context?.imageLoaded) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-200 select-none uppercase font-mono",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
