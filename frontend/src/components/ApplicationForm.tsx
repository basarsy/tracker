import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  SOURCES,
  WORK_MODELS,
  type Application,
  type ApplicationPayload,
} from "../api/types";
import { employmentLabel, sourceLabel, workModelLabel } from "../lib/labels";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { SimpleSelect } from "./ui/Select";
import { DatePicker } from "./ui/DatePicker";

const schema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    positionTitle: z.string().min(1, "Position title is required"),
    workModel: z.enum(["ON_SITE", "HYBRID", "REMOTE"]),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]),
    applicationSource: z.enum([
      "LINKEDIN",
      "KARIYER_NET",
      "COMPANY_WEBSITE",
      "REFERRAL",
      "EMAIL",
      "OTHER",
    ]),
    appliedDate: z.string().min(1, "Applied date is required"),
    location: z.string().optional(),
    jobPostingUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    salaryCurrency: z.string().optional(),
    cvVersion: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
    notes: z.string().optional(),
  })
  .refine(
    (value) => {
      if (!value.salaryMin || !value.salaryMax) return true;
      return Number(value.salaryMin) <= Number(value.salaryMax);
    },
    { message: "Min salary cannot exceed max salary", path: ["salaryMax"] },
  );

type FormValues = z.infer<typeof schema>;

function toPayload(values: FormValues): ApplicationPayload {
  return {
    companyName: values.companyName,
    positionTitle: values.positionTitle,
    workModel: values.workModel,
    employmentType: values.employmentType,
    applicationSource: values.applicationSource,
    appliedDate: values.appliedDate,
    location: values.location || undefined,
    jobPostingUrl: values.jobPostingUrl || undefined,
    salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
    salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
    salaryCurrency: values.salaryCurrency || undefined,
    cvVersion: values.cvVersion || undefined,
    contactName: values.contactName || undefined,
    contactEmail: values.contactEmail || undefined,
    notes: values.notes || undefined,
  };
}

export function ApplicationForm({
  initial,
  submitting,
  onCancel,
  onSubmit,
}: {
  initial?: Application;
  submitting?: boolean;
  onCancel?: () => void;
  onSubmit: (payload: ApplicationPayload) => void;
}) {
  const [more, setMore] = useState(
    Boolean(
      initial?.location ||
        initial?.jobPostingUrl ||
        initial?.salaryMin ||
        initial?.salaryMax ||
        initial?.cvVersion ||
        initial?.contactName ||
        initial?.contactEmail ||
        initial?.notes,
    ),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: initial?.companyName ?? "",
      positionTitle: initial?.positionTitle ?? "",
      workModel: initial?.workModel ?? "HYBRID",
      employmentType: initial?.employmentType ?? "FULL_TIME",
      applicationSource: initial?.applicationSource ?? "LINKEDIN",
      appliedDate: initial?.appliedDate ?? new Date().toISOString().slice(0, 10),
      location: initial?.location ?? "",
      jobPostingUrl: initial?.jobPostingUrl ?? "",
      salaryMin: initial?.salaryMin?.toString() ?? "",
      salaryMax: initial?.salaryMax?.toString() ?? "",
      salaryCurrency: initial?.salaryCurrency ?? "TRY",
      cvVersion: initial?.cvVersion ?? "",
      contactName: initial?.contactName ?? "",
      contactEmail: initial?.contactEmail ?? "",
      notes: initial?.notes ?? "",
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) => onSubmit(toPayload(values)))}
    >
      {/* Required primary fields - 2-column grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Company <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Stripe, Revolut"
            error={Boolean(form.formState.errors.companyName)}
            {...form.register("companyName")}
          />
          {form.formState.errors.companyName && (
            <p className="text-xs text-rose-500">{form.formState.errors.companyName.message}</p>
          )}
        </div>

        {/* Position Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Position title <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="e.g. Senior Frontend Engineer"
            error={Boolean(form.formState.errors.positionTitle)}
            {...form.register("positionTitle")}
          />
          {form.formState.errors.positionTitle && (
            <p className="text-xs text-rose-500">{form.formState.errors.positionTitle.message}</p>
          )}
        </div>

        {/* Work Model */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Work model <span className="text-rose-500">*</span>
          </label>
          <Controller
            control={form.control}
            name="workModel"
            render={({ field }) => (
              <SimpleSelect
                value={field.value}
                onChange={field.onChange}
                options={WORK_MODELS.map((w) => ({ value: w, label: workModelLabel[w] }))}
              />
            )}
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Employment type <span className="text-rose-500">*</span>
          </label>
          <Controller
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <SimpleSelect
                value={field.value}
                onChange={field.onChange}
                options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: employmentLabel[t] }))}
              />
            )}
          />
        </div>

        {/* Application Source */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Source <span className="text-rose-500">*</span>
          </label>
          <Controller
            control={form.control}
            name="applicationSource"
            render={({ field }) => (
              <SimpleSelect
                value={field.value}
                onChange={field.onChange}
                options={SOURCES.map((s) => ({ value: s, label: sourceLabel[s] }))}
              />
            )}
          />
        </div>

        {/* Applied Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-main">
            Applied date <span className="text-rose-500">*</span>
          </label>
          <Controller
            control={form.control}
            name="appliedDate"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Pick date"
              />
            )}
          />
          {form.formState.errors.appliedDate && (
            <p className="text-xs text-rose-500">{form.formState.errors.appliedDate.message}</p>
          )}
        </div>
      </div>

      {/* Collapsible "More details" section */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline focus:outline-none"
        >
          {more ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{more ? "Hide additional details" : "More details (location, salary, URL, notes)"}</span>
        </button>
      </div>

      {more && (
        <div className="grid gap-5 sm:grid-cols-2 rounded-2xl border border-line dark:border-[#262C38] bg-subtle/50 p-5">
          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">Location</label>
            <Input placeholder="e.g. Istanbul, Turkey or Remote" {...form.register("location")} />
          </div>

          {/* Job Posting URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">Job posting URL</label>
            <Input
              type="url"
              placeholder="https://..."
              error={Boolean(form.formState.errors.jobPostingUrl)}
              {...form.register("jobPostingUrl")}
            />
            {form.formState.errors.jobPostingUrl && (
              <p className="text-xs text-rose-500">{form.formState.errors.jobPostingUrl.message}</p>
            )}
          </div>

          {/* Salary Min & Max */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">Salary range (Min - Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                {...form.register("salaryMin")}
              />
              <Input
                type="number"
                placeholder="Max"
                error={Boolean(form.formState.errors.salaryMax)}
                {...form.register("salaryMax")}
              />
            </div>
            {form.formState.errors.salaryMax && (
              <p className="text-xs text-rose-500">{form.formState.errors.salaryMax.message}</p>
            )}
          </div>

          {/* Salary Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">Currency</label>
            <Input placeholder="TRY, USD, EUR..." {...form.register("salaryCurrency")} />
          </div>

          {/* CV Version */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">CV version</label>
            <Input placeholder="e.g. v2-frontend-en" {...form.register("cvVersion")} />
          </div>

          {/* Contact Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted">Contact person name</label>
            <Input placeholder="e.g. Jane Doe (Recruiter)" {...form.register("contactName")} />
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted">Contact email</label>
            <Input
              type="email"
              placeholder="recruiter@company.com"
              error={Boolean(form.formState.errors.contactEmail)}
              {...form.register("contactEmail")}
            />
            {form.formState.errors.contactEmail && (
              <p className="text-xs text-rose-500">{form.formState.errors.contactEmail.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted">Notes</label>
            <textarea
              rows={3}
              placeholder="Any relevant observations, referral info, or requirements..."
              className="w-full rounded-xl border border-line dark:border-[#262C38] bg-surface p-3.5 text-sm text-main placeholder:text-muted/70 focus:border-[#3B5BFF] dark:focus:border-[#6C86FF] focus:outline-none focus:ring-2 focus:ring-[#3B5BFF]/20"
              {...form.register("notes")}
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-[#262C38]">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={submitting}>
          <Save className="h-4 w-4" />
          <span>Save application</span>
        </Button>
      </div>
    </form>
  );
}
