import React from "react";
import { cn } from "../lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-line dark:border-[#262C38] bg-surface p-5 shadow-card transition-all duration-150",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        {icon ? <span className="text-muted/80">{icon}</span> : null}
      </div>
      <div className="mt-2.5">
        <div className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-main tabular-nums leading-tight">
          {value}
        </div>
        <p className="mt-2 text-xs text-muted truncate min-h-[16px] leading-4">
          {hint || "\u00A0"}
        </p>
      </div>
    </div>
  );
}
