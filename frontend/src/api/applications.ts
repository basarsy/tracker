import { api } from "./client";
import type {
  Application,
  ApplicationDetail,
  ApplicationFilter,
  ApplicationPayload,
  ApplicationStatus,
  Interview,
  InterviewType,
  PageResponse,
} from "./types";

export async function listApplications(filter: ApplicationFilter) {
  const { data } = await api.get<PageResponse<Application>>("/applications", {
    params: {
      status: filter.status || undefined,
      workModel: filter.workModel || undefined,
      employmentType: filter.employmentType || undefined,
      source: filter.source || undefined,
      search: filter.search || undefined,
      appliedFrom: filter.appliedFrom || undefined,
      appliedTo: filter.appliedTo || undefined,
      page: filter.page ?? 0,
      size: filter.size ?? 20,
      sort: filter.sort ?? "appliedDate,desc",
    },
  });
  return data;
}

export async function getApplication(id: string) {
  const { data } = await api.get<ApplicationDetail>(`/applications/${id}`);
  return data;
}

export async function createApplication(payload: ApplicationPayload) {
  const { data } = await api.post<ApplicationDetail>("/applications", payload);
  return data;
}

export async function updateApplication(id: string, payload: ApplicationPayload) {
  const { data } = await api.put<ApplicationDetail>(`/applications/${id}`, payload);
  return data;
}

export async function deleteApplication(id: string) {
  await api.delete(`/applications/${id}`);
}

export async function changeStatus(
  id: string,
  body: { status: ApplicationStatus; changedAt?: string; note?: string },
) {
  const { data } = await api.post<ApplicationDetail>(`/applications/${id}/status`, body);
  return data;
}

export async function addInterview(
  id: string,
  body: { scheduledAt: string; type: InterviewType; notes?: string },
) {
  const { data } = await api.post<Interview>(`/applications/${id}/interviews`, body);
  return data;
}

export async function updateInterview(
  applicationId: string,
  interviewId: string,
  body: { scheduledAt: string; type: InterviewType; notes?: string },
) {
  const { data } = await api.put<Interview>(
    `/applications/${applicationId}/interviews/${interviewId}`,
    body,
  );
  return data;
}

export async function deleteInterview(applicationId: string, interviewId: string) {
  await api.delete(`/applications/${applicationId}/interviews/${interviewId}`);
}

export async function upcomingInterviews() {
  const { data } = await api.get<Interview[]>("/interviews/upcoming");
  return data;
}

export async function exportApplicationsCsv(filter: ApplicationFilter) {
  const { data } = await api.get<Blob>("/applications/export", {
    params: {
      status: filter.status || undefined,
      workModel: filter.workModel || undefined,
      employmentType: filter.employmentType || undefined,
      source: filter.source || undefined,
      search: filter.search || undefined,
      appliedFrom: filter.appliedFrom || undefined,
      appliedTo: filter.appliedTo || undefined,
    },
    responseType: "blob",
  });
  return data;
}
