import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  ChevronLeft,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { INTERVIEW_TYPES, STATUSES, type ApplicationStatus, type InterviewType } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/ToastProvider";
import { useApplication, useApplicationMutations } from "../hooks/useApplications";
import {
  employmentLabel,
  formatDate,
  formatDateTime,
  formatRelativeDays,
  interviewLabel,
  sourceLabel,
  statusLabel,
  statusPillConfig,
  workModelLabel,
} from "../lib/labels";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CompanyAvatar } from "../components/ui/Avatar";
import { StatusPill } from "../components/ui/StatusPill";
import { SimpleSelect } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { cn } from "../lib/utils";

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading } = useApplication(id);
  const { status, interview, remove, removeInterview } = useApplicationMutations();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: "RESPONDED" as ApplicationStatus,
    changedAt: "",
    note: "",
  });
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    type: "HR" as InterviewType,
    notes: "",
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Application not found"
        body="The requested application could not be found or has been removed."
        actionLabel="Back to applications"
        onAction={() => navigate("/applications")}
      />
    );
  }

  const app = data.application;

  const handleDelete = () => {
    remove.mutate(app.id, {
      onSuccess: () => {
        toast.success(`Deleted application for ${app.companyName}`);
        navigate("/applications");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    status.mutate(
      {
        id: app.id,
        status: statusForm.status,
        changedAt: statusForm.changedAt ? new Date(statusForm.changedAt).toISOString() : undefined,
        note: statusForm.note || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Status timeline updated");
          setStatusForm({ status: "RESPONDED", changedAt: "", note: "" });
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewForm.scheduledAt) {
      toast.error("Please pick a date and time for the interview");
      return;
    }
    interview.mutate(
      {
        id: app.id,
        scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
        type: interviewForm.type,
        notes: interviewForm.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Interview scheduled");
          setInterviewForm({ scheduledAt: "", type: "HR", notes: "" });
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/applications")}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-main transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to applications</span>
        </button>
      </div>

      {/* Header Card with Avatar, Company, Position, Status & Actions */}
      <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <CompanyAvatar name={app.companyName} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-main">{app.companyName}</h1>
                <StatusPill status={app.currentStatus} />
              </div>
              <p className="mt-0.5 text-sm text-muted">{app.positionTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/applications/${app.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => setDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata Overview Card */}
      <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Application Details
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4">
          <div>
            <span className="text-xs text-muted">Work Model</span>
            <p className="mt-1 text-sm font-medium text-main">{workModelLabel[app.workModel]}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Employment Type</span>
            <p className="mt-1 text-sm font-medium text-main">{employmentLabel[app.employmentType]}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Source</span>
            <p className="mt-1 text-sm font-medium text-main">{sourceLabel[app.applicationSource]}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Applied Date</span>
            <p className="mt-1 text-sm font-medium text-main tabular-nums">
              {formatDate(app.appliedDate)}{" "}
              <span className="text-xs text-muted font-normal">
                ({formatRelativeDays(app.appliedDate)})
              </span>
            </p>
          </div>
          <div>
            <span className="text-xs text-muted">Location</span>
            <p className="mt-1 text-sm font-medium text-main flex items-center gap-1">
              {app.location ? (
                <>
                  <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
                  <span className="truncate">{app.location}</span>
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted">Salary Range</span>
            <p className="mt-1 text-sm font-medium text-main tabular-nums">
              {app.salaryMin || app.salaryMax
                ? `${app.salaryMin?.toLocaleString() ?? "—"} – ${app.salaryMax?.toLocaleString() ?? "—"} ${app.salaryCurrency ?? ""}`
                : "—"}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted">CV Version</span>
            <p className="mt-1 text-sm font-medium text-main">{app.cvVersion || "—"}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Job Posting</span>
            <p className="mt-1 text-sm font-medium text-main">
              {app.jobPostingUrl ? (
                <a
                  href={app.jobPostingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <span>Open link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
          {app.contactName || app.contactEmail ? (
            <div className="col-span-2">
              <span className="text-xs text-muted">Contact Person</span>
              <p className="mt-1 text-sm font-medium text-main flex items-center gap-2">
                {app.contactName && <span>{app.contactName}</span>}
                {app.contactEmail && (
                  <a
                    href={`mailto:${app.contactEmail}`}
                    className="inline-flex items-center gap-1 text-accent text-xs hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{app.contactEmail}</span>
                  </a>
                )}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Two Column Grid: Status Timeline & Interviews Card */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Timeline */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-line dark:border-[#262C38]">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-main">Status timeline</h2>
                <p className="text-xs text-muted">Chronological milestone history</p>
              </div>
            </div>

            {/* Vertical timeline */}
            <div className="mt-5 relative pl-4 border-l-2 border-line dark:border-[#262C38] space-y-5 ml-2">
              {data.statusHistory.map((item) => {
                const config = statusPillConfig[item.status] || statusPillConfig.APPLIED;
                return (
                  <div key={item.id} className="relative group">
                    {/* Circle dot on the vertical line */}
                    <div
                      className={cn(
                        "absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-surface shadow-sm",
                        config.dot,
                      )}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusPill status={item.status} short />
                        <span className="text-xs text-muted tabular-nums">
                          {formatDateTime(item.changedAt)}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-main bg-subtle p-2.5 rounded-xl border border-line/40 dark:border-[#262C38]/60 mt-1.5">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Status Update form */}
          <form
            onSubmit={handleAddStatus}
            className="mt-6 pt-5 border-t border-line dark:border-[#262C38] space-y-3"
          >
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Add status update
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <SimpleSelect
                value={statusForm.status}
                onChange={(val) =>
                  setStatusForm({ ...statusForm, status: val as ApplicationStatus })
                }
                options={STATUSES.map((st) => ({ value: st, label: statusLabel[st] }))}
              />
              <Input
                type="datetime-local"
                value={statusForm.changedAt}
                onChange={(e) => setStatusForm({ ...statusForm, changedAt: e.target.value })}
                className="text-xs"
              />
            </div>
            <Input
              placeholder="Note or feedback (optional)"
              value={statusForm.note}
              onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={status.isPending}
              className="w-full sm:w-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add status update</span>
            </Button>
          </form>
        </div>

        {/* Interviews Card */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-line dark:border-[#262C38]">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-main">Interviews</h2>
                <p className="text-xs text-muted">Scheduled and completed rounds</p>
              </div>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                {data.interviews.length} rounds
              </span>
            </div>

            {data.interviews.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="h-7 w-7 text-muted/50 mx-auto" />
                <p className="mt-2 text-xs text-muted">No interviews scheduled yet for this role.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {data.interviews.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line dark:border-[#262C38] bg-subtle p-3.5 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                          {interviewLabel[item.type] || item.type}
                        </span>
                        <span className="text-xs text-muted tabular-nums">
                          {formatDateTime(item.scheduledAt)}
                        </span>
                      </div>
                      {item.notes && <p className="text-xs text-main truncate">{item.notes}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeInterview.mutate(
                          { applicationId: app.id, interviewId: item.id },
                          { onSuccess: () => toast.success("Interview removed") },
                        )
                      }
                      className="text-xs text-rose-500 hover:text-rose-700 hover:underline shrink-0 p-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Interview Form */}
          <form
            onSubmit={handleAddInterview}
            className="mt-6 pt-5 border-t border-line dark:border-[#262C38] space-y-3"
          >
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Schedule interview
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Input
                type="datetime-local"
                value={interviewForm.scheduledAt}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })
                }
                className="text-xs"
              />
              <SimpleSelect
                value={interviewForm.type}
                onChange={(val) =>
                  setInterviewForm({ ...interviewForm, type: val as InterviewType })
                }
                options={INTERVIEW_TYPES.map((t) => ({ value: t, label: interviewLabel[t] }))}
              />
            </div>
            <Input
              placeholder="Interviewer, video link, or notes..."
              value={interviewForm.notes}
              onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={interview.isPending}
              className="w-full sm:w-auto"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Schedule round</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Notes Card */}
      <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
        <h2 className="text-base font-semibold tracking-tight text-main">Notes & Observations</h2>
        <div className="mt-3 rounded-xl bg-subtle p-4 border border-line/40 dark:border-[#262C38]/60">
          <p className="whitespace-pre-wrap text-sm text-main">
            {app.notes ? app.notes : "No additional notes recorded for this application."}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application for{" "}
              <strong className="text-main font-semibold">{app.companyName}</strong>? All
              interview history and status milestones will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={remove.isPending}>
              Delete application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
