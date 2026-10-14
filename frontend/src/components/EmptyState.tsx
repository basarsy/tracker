import React from "react";
import { FolderSearch, Plus } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-line/60 bg-surface px-6 py-16 text-center shadow-card",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icon || <FolderSearch className="h-7 w-7 stroke-[1.75]" />}
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-main">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{body}</p>
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            <Plus className="h-4 w-4 stroke-[2.5]" />
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
