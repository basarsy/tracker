import type { ApplicationSource, ApplicationStatus, EmploymentType, InterviewType, WorkModel } from "../api/types";

export const statusLabel: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  RESPONDED: "Responded",
  INTERVIEW_SCHEDULED: "Interview scheduled",
  INTERVIEWED: "Interviewed",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

export const shortStatusLabel: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  RESPONDED: "Responded",
  INTERVIEW_SCHEDULED: "Interview",
  INTERVIEWED: "Interviewed",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

export const statusPillConfig: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string }
> = {
  APPLIED: {
    bg: "bg-slate-100 dark:bg-slate-800/80",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-400 dark:bg-slate-500",
  },
  RESPONDED: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  INTERVIEW_SCHEDULED: {
    bg: "bg-violet-50 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  INTERVIEWED: {
    bg: "bg-violet-50 dark:bg-violet-950/50",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  OFFER: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-800 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  ACCEPTED: {
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    bg: "bg-rose-50 dark:bg-rose-950/50",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  GHOSTED: {
    bg: "bg-zinc-100 dark:bg-zinc-800/80",
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
  WITHDRAWN: {
    bg: "bg-zinc-100 dark:bg-zinc-800/80",
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

// Legacy alias for backwards compatibility
export const statusClass: Record<ApplicationStatus, string> = {
  APPLIED: `${statusPillConfig.APPLIED.bg} ${statusPillConfig.APPLIED.text}`,
  RESPONDED: `${statusPillConfig.RESPONDED.bg} ${statusPillConfig.RESPONDED.text}`,
  INTERVIEW_SCHEDULED: `${statusPillConfig.INTERVIEW_SCHEDULED.bg} ${statusPillConfig.INTERVIEW_SCHEDULED.text}`,
  INTERVIEWED: `${statusPillConfig.INTERVIEWED.bg} ${statusPillConfig.INTERVIEWED.text}`,
  OFFER: `${statusPillConfig.OFFER.bg} ${statusPillConfig.OFFER.text}`,
  ACCEPTED: `${statusPillConfig.ACCEPTED.bg} ${statusPillConfig.ACCEPTED.text}`,
  REJECTED: `${statusPillConfig.REJECTED.bg} ${statusPillConfig.REJECTED.text}`,
  GHOSTED: `${statusPillConfig.GHOSTED.bg} ${statusPillConfig.GHOSTED.text}`,
  WITHDRAWN: `${statusPillConfig.WITHDRAWN.bg} ${statusPillConfig.WITHDRAWN.text}`,
};

export const workModelLabel: Record<WorkModel, string> = {
  ON_SITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

export const employmentLabel: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
};

export const sourceLabel: Record<ApplicationSource, string> = {
  LINKEDIN: "LinkedIn",
  KARIYER_NET: "Kariyer.net",
  COMPANY_WEBSITE: "Company website",
  REFERRAL: "Referral",
  EMAIL: "Email",
  OTHER: "Other",
};

export const interviewLabel: Record<InterviewType, string> = {
  PHONE: "Phone",
  TECHNICAL: "Technical",
  HR: "HR",
  ONSITE: "On-site",
  OTHER: "Other",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export function formatShortDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return shortDateFormatter.format(d);
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return dateTimeFormatter.format(d);
}

export function formatRelativeDays(dateStr?: string | null) {
  if (!dateStr) return "—";
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return "—";

  const now = new Date();
  // Strip time for exact date comparison
  const d1 = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays === -1) return "Tomorrow";
  if (diffDays > 1) return `${diffDays} days ago`;
  return `In ${Math.abs(diffDays)} days`;
}

export function percent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}
