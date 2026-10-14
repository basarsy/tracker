import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", startIcon, endIcon, error, disabled, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {startIcon ? (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-muted">
            {startIcon}
          </span>
        ) : null}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            "h-11 w-full rounded-xl border border-line dark:border-[#262C38] bg-surface px-3.5 text-sm text-main placeholder:text-muted/70 transition-all duration-150",
            "focus:border-[#3B5BFF] dark:focus:border-[#6C86FF] focus:outline-none focus:ring-2 focus:ring-[#3B5BFF]/20 dark:focus:ring-[#6C86FF]/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            startIcon && "pl-10",
            endIcon && "pr-10",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            className,
          )}
          {...props}
        />
        {endIcon ? (
          <span className="pointer-events-none absolute right-3.5 flex items-center text-muted">
            {endIcon}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
