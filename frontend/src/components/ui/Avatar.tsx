import React from "react";
import { cn } from "../../lib/utils";

const AVATAR_PALETTE = [
  { bg: "bg-blue-100 dark:bg-blue-950/70", text: "text-blue-700 dark:text-blue-300" },
  { bg: "bg-indigo-100 dark:bg-indigo-950/70", text: "text-indigo-700 dark:text-indigo-300" },
  { bg: "bg-purple-100 dark:bg-purple-950/70", text: "text-purple-700 dark:text-purple-300" },
  { bg: "bg-violet-100 dark:bg-violet-950/70", text: "text-violet-700 dark:text-violet-300" },
  { bg: "bg-pink-100 dark:bg-pink-950/70", text: "text-pink-700 dark:text-pink-300" },
  { bg: "bg-rose-100 dark:bg-rose-950/70", text: "text-rose-700 dark:text-rose-300" },
  { bg: "bg-amber-100 dark:bg-amber-950/70", text: "text-amber-800 dark:text-amber-300" },
  { bg: "bg-emerald-100 dark:bg-emerald-950/70", text: "text-emerald-700 dark:text-emerald-300" },
  { bg: "bg-teal-100 dark:bg-teal-950/70", text: "text-teal-700 dark:text-teal-300" },
  { bg: "bg-cyan-100 dark:bg-cyan-950/70", text: "text-cyan-700 dark:text-cyan-300" },
];

function getInitials(name: string): string {
  if (!name) return "?";
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

function getPaletteIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % AVATAR_PALETTE.length;
}

export interface CompanyAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CompanyAvatar({ name, size = "md", className, ...props }: CompanyAvatarProps) {
  const initials = getInitials(name);
  const color = AVATAR_PALETTE[getPaletteIndex(name || "Company")];

  const sizeClasses = {
    sm: "h-8 w-8 text-xs font-medium",
    md: "h-10 w-10 text-sm font-semibold",
    lg: "h-12 w-12 text-base font-semibold",
    xl: "h-16 w-16 text-xl font-bold",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full transition-transform",
        sizeClasses,
        color.bg,
        color.text,
        className,
      )}
      {...props}
    >
      {initials}
    </div>
  );
}
