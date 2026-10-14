import { useQuery } from "@tanstack/react-query";
import { upcomingInterviews } from "../api/applications";
import {
  getBySource,
  getByWorkModel,
  getFunnel,
  getResponseTime,
  getStale,
  getSummary,
  getWeekly,
} from "../api/stats";

export function useDashboardStats() {
  const summary = useQuery({ queryKey: ["stats", "summary"], queryFn: getSummary });
  const responseTime = useQuery({ queryKey: ["stats", "response-time"], queryFn: getResponseTime });
  const funnel = useQuery({ queryKey: ["stats", "funnel"], queryFn: getFunnel });
  const weekly = useQuery({ queryKey: ["stats", "weekly"], queryFn: getWeekly });
  const bySource = useQuery({ queryKey: ["stats", "by-source"], queryFn: getBySource });
  const byWorkModel = useQuery({ queryKey: ["stats", "by-work-model"], queryFn: getByWorkModel });
  const stale = useQuery({ queryKey: ["stats", "stale"], queryFn: () => getStale(14) });
  const upcoming = useQuery({ queryKey: ["interviews", "upcoming"], queryFn: upcomingInterviews });
  return { summary, responseTime, funnel, weekly, bySource, byWorkModel, stale, upcoming };
}
