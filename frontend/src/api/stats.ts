import { api } from "./client";
import type {
  FunnelStats,
  GroupStats,
  ResponseTimeStats,
  StaleApplication,
  SummaryStats,
  WeeklyCount,
} from "./types";

export const getSummary = async () => (await api.get<SummaryStats>("/stats/summary")).data;
export const getResponseTime = async () =>
  (await api.get<ResponseTimeStats>("/stats/response-time")).data;
export const getBySource = async () => (await api.get<GroupStats[]>("/stats/by-source")).data;
export const getByWorkModel = async () =>
  (await api.get<GroupStats[]>("/stats/by-work-model")).data;
export const getWeekly = async () => (await api.get<WeeklyCount[]>("/stats/weekly")).data;
export const getFunnel = async () => (await api.get<FunnelStats>("/stats/funnel")).data;
export const getStale = async (days = 14) =>
  (await api.get<StaleApplication[]>("/stats/stale", { params: { days } })).data;
