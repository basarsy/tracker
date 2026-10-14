import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ApplicationForm } from "../components/ApplicationForm";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ToastProvider";
import { useApplication, useApplicationMutations } from "../hooks/useApplications";

export function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading } = useApplication(id);
  const { create, update } = useApplicationMutations();
  const editing = Boolean(id);

  if (editing && isLoading) {
    return (
      <div className="mx-auto max-w-[720px] space-y-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate(editing ? `/applications/${id}` : "/applications")}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-main transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{editing ? "Back to application" : "Back to applications"}</span>
        </button>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-main">
          {editing ? `Edit ${data?.application.companyName || "Application"}` : "New application"}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          {editing
            ? "Update the details, compensation, or contacts for this application."
            : "Enter the role information to start tracking interview rounds and responses."}
        </p>
      </div>

      <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 sm:p-8 shadow-card">
        <ApplicationForm
          initial={data?.application}
          submitting={create.isPending || update.isPending}
          onCancel={() => navigate(editing ? `/applications/${id}` : "/applications")}
          onSubmit={(payload) => {
            if (editing && id) {
              update.mutate(
                { id, payload },
                {
                  onSuccess: () => {
                    toast.success("Application updated successfully");
                    navigate(`/applications/${id}`);
                  },
                  onError: (error) => toast.error(error.message),
                },
              );
            } else {
              create.mutate(payload, {
                onSuccess: (result) => {
                  toast.success("Application created successfully");
                  navigate(`/applications/${result.application.id}`);
                },
                onError: (error) => toast.error(error.message),
              });
            }
          }}
        />
      </div>
    </div>
  );
}
