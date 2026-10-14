import React from "react";
import type { ApplicationStatus } from "../../api/types";
import { shortStatusLabel, statusLabel, statusPillConfig } from "../../lib/labels";
import { cn } from "../../lib/utils";

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ApplicationStatus;
  short?: boolean;
  interactive?: boolean;
}

export function StatusPill({
  status,
  short = false,
  interactive = false,
  className,
  ...props
}: StatusPillProps) {
  const config = statusPillConfig[status] || statusPillConfig.APPLIED;
  const label = short ? shortStatusLabel[status] : statusLabel[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 select-none",
        config.bg,
        config.text,
        interactive && "cursor-pointer hover:opacity-80 active:scale-95",
        className,
      )}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", config.dot)} />
      {label}
    </span>
  );
}
