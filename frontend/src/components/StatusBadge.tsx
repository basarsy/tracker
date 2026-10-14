import type { ApplicationStatus } from "../api/types";
import { StatusPill } from "./ui/StatusPill";

export function StatusBadge({
  status,
  short = false,
  interactive = false,
  onClick,
}: {
  status: ApplicationStatus;
  short?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}) {
  return (
    <StatusPill
      status={status}
      short={short}
      interactive={interactive}
      onClick={onClick}
    />
  );
}
