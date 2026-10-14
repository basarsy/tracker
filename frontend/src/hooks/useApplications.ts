import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addInterview,
  changeStatus,
  createApplication,
  deleteApplication,
  deleteInterview,
  getApplication,
  listApplications,
  upcomingInterviews,
  updateApplication,
} from "../api/applications";
import type { ApplicationFilter, ApplicationPayload, ApplicationStatus, InterviewType } from "../api/types";

export function useApplications(filter: ApplicationFilter) {
  return useQuery({
    queryKey: ["applications", filter],
    queryFn: () => listApplications(filter),
  });
}

export function useApplication(id?: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id!),
    enabled: Boolean(id),
  });
}

export function useUpcomingInterviews() {
  return useQuery({
    queryKey: ["interviews", "upcoming"],
    queryFn: upcomingInterviews,
  });
}

export function useApplicationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["applications"] });
    void queryClient.invalidateQueries({ queryKey: ["application"] });
    void queryClient.invalidateQueries({ queryKey: ["stats"] });
    void queryClient.invalidateQueries({ queryKey: ["interviews"] });
  };

  const create = useMutation({
    mutationFn: (payload: ApplicationPayload) => createApplication(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApplicationPayload }) =>
      updateApplication(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: invalidate,
  });
  const status = useMutation({
    mutationFn: (input: { id: string; status: ApplicationStatus; changedAt?: string; note?: string }) =>
      changeStatus(input.id, input),
    onSuccess: invalidate,
  });
  const interview = useMutation({
    mutationFn: (input: { id: string; scheduledAt: string; type: InterviewType; notes?: string }) =>
      addInterview(input.id, input),
    onSuccess: invalidate,
  });
  const removeInterview = useMutation({
    mutationFn: (input: { applicationId: string; interviewId: string }) =>
      deleteInterview(input.applicationId, input.interviewId),
    onSuccess: invalidate,
  });

  return { create, update, remove, status, interview, removeInterview };
}
