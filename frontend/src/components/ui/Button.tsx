import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-app active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#3B5BFF] hover:bg-[#2A4AEB] dark:bg-[#6C86FF] dark:hover:bg-[#5874F5] text-white shadow-sm focus-visible:ring-[#3B5BFF]/50 dark:focus-visible:ring-[#6C86FF]/50",
      secondary:
        "bg-subtle text-main hover:bg-line/50 dark:hover:bg-subtle/80 border-0 focus-visible:ring-line",
      outline:
        "border border-line bg-surface text-main hover:bg-subtle focus-visible:ring-accent/40",
      ghost:
        "text-muted hover:text-main hover:bg-subtle focus-visible:ring-accent/40",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-500/40",
    }[variant];

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-11 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
