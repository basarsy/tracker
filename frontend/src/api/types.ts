export type WorkModel = "ON_SITE" | "HYBRID" | "REMOTE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT";
export type ApplicationSource =
  | "LINKEDIN"
  | "KARIYER_NET"
  | "COMPANY_WEBSITE"
  | "REFERRAL"
  | "EMAIL"
  | "OTHER";
export type ApplicationStatus =
  | "APPLIED"
  | "RESPONDED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEWED"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "GHOSTED"
  | "WITHDRAWN";
export type InterviewType = "PHONE" | "TECHNICAL" | "HR" | "ONSITE" | "OTHER";

export const WORK_MODELS: WorkModel[] = ["ON_SITE", "HYBRID", "REMOTE"];
export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
];
export const SOURCES: ApplicationSource[] = [
  "LINKEDIN",
  "KARIYER_NET",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "EMAIL",
  "OTHER",
];
export const STATUSES: ApplicationStatus[] = [
  "APPLIED",
  "RESPONDED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
];
export const INTERVIEW_TYPES: InterviewType[] = [
  "PHONE",
  "TECHNICAL",
  "HR",
  "ONSITE",
  "OTHER",
];

export interface Application {
  id: string;
  companyName: string;
  positionTitle: string;
  workModel: WorkModel;
  employmentType: EmploymentType;
  location?: string | null;
  jobPostingUrl?: string | null;
  applicationSource: ApplicationSource;
  appliedDate: string;
  currentStatus: ApplicationStatus;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  cvVersion?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  daysSinceApplied: number;
}

export interface StatusHistory {
  id: string;
  status: ApplicationStatus;
  changedAt: string;
  note?: string | null;
}

export interface Interview {
  id: string;
  applicationId: string;
  companyName?: string;
  positionTitle?: string;
  scheduledAt: string;
  type: InterviewType;
  notes?: string | null;
}

export interface ApplicationDetail {
  application: Application;
  statusHistory: StatusHistory[];
  interviews: Interview[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  workModel?: WorkModel;
  employmentType?: EmploymentType;
  source?: ApplicationSource;
  search?: string;
  appliedFrom?: string;
  appliedTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ApplicationPayload {
  companyName: string;
  positionTitle: string;
  workModel: WorkModel;
  employmentType: EmploymentType;
  location?: string;
  jobPostingUrl?: string;
  applicationSource: ApplicationSource;
  appliedDate: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string;
  cvVersion?: string;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  username: string;
}

export interface SummaryStats {
  totalApplications: number;
  activeApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
  ghostedCount: number;
}

export interface ResponseTimeStats {
  averageDays: number;
  medianDays: number;
  sampleSize: number;
}

export interface GroupStats {
  key: string;
  applications: number;
  responseRate: number;
  interviewRate: number;
}

export interface WeeklyCount {
  weekStart: string;
  count: number;
}

export interface FunnelStats {
  applied: number;
  responded: number;
  interview: number;
  offer: number;
}

export interface StaleApplication {
  id: string;
  companyName: string;
  positionTitle: string;
  appliedDate: string;
  daysSinceApplied: number;
}

export interface ApiErrorBody {
  status: number;
  error: string;
  message: string;
  fieldErrors?: { field: string; message: string }[];
}
