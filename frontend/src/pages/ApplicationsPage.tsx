import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  EMPLOYMENT_TYPES,
  SOURCES,
  STATUSES,
  WORK_MODELS,
  type ApplicationFilter,
  type Application,
  type ApplicationStatus,
  type ApplicationSource,
  type EmploymentType,
  type WorkModel,
} from "../api/types";
import { exportApplicationsCsv } from "../api/applications";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/ToastProvider";
import { useApplicationMutations, useApplications } from "../hooks/useApplications";
import {
  employmentLabel,
  formatDate,
  formatRelativeDays,
  sourceLabel,
  statusLabel,
  workModelLabel,
} from "../lib/labels";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CompanyAvatar } from "../components/ui/Avatar";
import { StatusPill } from "../components/ui/StatusPill";
import { DatePicker } from "../components/ui/DatePicker";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const emptyFilter: ApplicationFilter = { page: 0, size: 20 };

const STATUS_QUICK_TABS: { key: string; label: string; status?: ApplicationStatus }[] = [
  { key: "ALL", label: "All" },
  { key: "APPLIED", label: "Applied", status: "APPLIED" },
  { key: "RESPONDED", label: "Responded", status: "RESPONDED" },
  { key: "INTERVIEW", label: "Interview", status: "INTERVIEW_SCHEDULED" },
  { key: "OFFER", label: "Offer", status: "OFFER" },
  { key: "REJECTED", label: "Rejected", status: "REJECTED" },
];

export function ApplicationsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [filter, setFilter] = useState<ApplicationFilter>(emptyFilter);
  const [searchInput, setSearchInput] = useState("");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Application | null>(null);
  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter((prev) => {
        const nextSearch = searchInput.trim() || undefined;
        if (prev.search === nextSearch) return prev;
        return { ...prev, search: nextSearch, page: 0 };
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useApplications(filter);
  const { status, remove } = useApplicationMutations();

  const rows = useMemo(() => data?.content ?? [], [data]);
  const pages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // Count active secondary filters for badge
  const activeSecondaryFilterCount = useMemo(() => {
    let count = 0;
    if (filter.workModel) count++;
    if (filter.employmentType) count++;
    if (filter.source) count++;
    if (filter.appliedFrom || filter.appliedTo) count++;
    return count;
  }, [filter]);

  const onExport = async () => {
    try {
      const blob = await exportApplicationsCsv(filter);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setChangingStatusId(null);
    status.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => toast.success(`Status updated to ${statusLabel[newStatus]}`),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteCandidate) return;
    remove.mutate(deleteCandidate.id, {
      onSuccess: () => {
        toast.success(`Deleted application for ${deleteCandidate.companyName}`);
        setDeleteCandidate(null);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setFilter(emptyFilter);
  };

  const isFiltered = Boolean(
    filter.search ||
      filter.status ||
      filter.workModel ||
      filter.employmentType ||
      filter.source ||
      filter.appliedFrom ||
      filter.appliedTo,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-main">
            Applications
          </h1>
          <p className="mt-1 text-sm text-muted">
            {totalElements} {totalElements === 1 ? "application" : "applications"} tracked
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={() => void onExport()}
            title="Export filtered applications as CSV"
          >
            <Download className="h-4 w-4 text-muted" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/applications/new")}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add application</span>
          </Button>
        </div>
      </div>

      {/* Search & Quick Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Large search input */}
          <div className="flex-1">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search company or position..."
              startIcon={<Search className="h-4 w-4" />}
              endIcon={
                searchInput ? (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="p-1 hover:text-main"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null
              }
              className="bg-surface shadow-card"
            />
          </div>

          {/* Secondary Filters Popover Trigger */}
          <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className={cn(
                  "gap-2",
                  activeSecondaryFilterCount > 0 && "bg-accent-soft text-accent font-medium ring-1 ring-accent/30",
                )}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeSecondaryFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
                    {activeSecondaryFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-line dark:border-[#262C38] pb-3">
                <span className="text-sm font-semibold text-main">Filter Applications</span>
                {activeSecondaryFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilter((prev) => ({
                        search: prev.search,
                        status: prev.status,
                        page: 0,
                        size: 20,
                      }))
                    }
                    className="flex items-center gap-1 text-xs text-muted hover:text-accent"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Work Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Work Model</label>
                <select
                  value={filter.workModel ?? ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      workModel: (e.target.value || undefined) as WorkModel | undefined,
                      page: 0,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-line dark:border-[#262C38] bg-surface px-3 text-xs text-main focus:border-accent focus:outline-none"
                >
                  <option value="">All work models</option>
                  {WORK_MODELS.map((w) => (
                    <option key={w} value={w}>
                      {workModelLabel[w]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Employment Type</label>
                <select
                  value={filter.employmentType ?? ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      employmentType: (e.target.value || undefined) as EmploymentType | undefined,
                      page: 0,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-line dark:border-[#262C38] bg-surface px-3 text-xs text-main focus:border-accent focus:outline-none"
                >
                  <option value="">All employment types</option>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {employmentLabel[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Application Source */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Source</label>
                <select
                  value={filter.source ?? ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      source: (e.target.value || undefined) as ApplicationSource | undefined,
                      page: 0,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-line dark:border-[#262C38] bg-surface px-3 text-xs text-main focus:border-accent focus:outline-none"
                >
                  <option value="">All sources</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {sourceLabel[s]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted">Applied Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    value={filter.appliedFrom ?? ""}
                    onChange={(val) =>
                      setFilter((prev) => ({ ...prev, appliedFrom: val || undefined, page: 0 }))
                    }
                    placeholder="From"
                    className="h-9 text-xs"
                  />
                  <DatePicker
                    value={filter.appliedTo ?? ""}
                    onChange={(val) =>
                      setFilter((prev) => ({ ...prev, appliedTo: val || undefined, page: 0 }))
                    }
                    placeholder="To"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Quick Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_QUICK_TABS.map((tab) => {
            const isSelected =
              tab.key === "ALL" ? !filter.status : filter.status === tab.status;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    status: tab.status,
                    page: 0,
                  }))
                }
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 select-none",
                  isSelected
                    ? "bg-accent-soft text-accent ring-1 ring-accent/30 font-semibold"
                    : "bg-subtle text-muted hover:text-main hover:bg-line/40 dark:hover:bg-subtle/80",
                )}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Removable Tags */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted">Active:</span>

            {filter.search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                Search: "{filter.search}"
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filter.status && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                Status: {statusLabel[filter.status]}
                <button
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, status: undefined, page: 0 }))}
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filter.workModel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                {workModelLabel[filter.workModel]}
                <button
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, workModel: undefined, page: 0 }))}
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filter.employmentType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                {employmentLabel[filter.employmentType]}
                <button
                  type="button"
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, employmentType: undefined, page: 0 }))
                  }
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filter.source && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                {sourceLabel[filter.source]}
                <button
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, source: undefined, page: 0 }))}
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(filter.appliedFrom || filter.appliedTo) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs text-main">
                Dates: {formatDate(filter.appliedFrom)} - {formatDate(filter.appliedTo)}
                <button
                  type="button"
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      appliedFrom: undefined,
                      appliedTo: undefined,
                      page: 0,
                    }))
                  }
                  className="hover:text-rose-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-medium text-accent hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title={isFiltered ? "No matching applications" : "No applications yet"}
          body={
            isFiltered
              ? "We couldn't find any applications matching your filters. Try clearing some criteria."
              : "Track your job applications, interview schedules, and notes all in one place."
          }
          actionLabel={isFiltered ? "Reset filters" : "Add your first application"}
          onAction={isFiltered ? resetAllFilters : () => navigate("/applications/new")}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-line dark:border-[#262C38] bg-surface shadow-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line dark:border-[#262C38] bg-subtle/40 text-xs font-semibold text-muted tracking-wider uppercase">
                  <th className="py-3.5 pl-5 pr-4">Company & Position</th>
                  <th className="py-3.5 px-4">Work / Type</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Applied</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pl-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 dark:divide-[#262C38] text-sm">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/applications/${row.id}`)}
                    className="group cursor-pointer hover:bg-subtle/50 transition-colors duration-150"
                  >
                    {/* Company & Position Stacked */}
                    <td className="py-4 pl-5 pr-4">
                      <div className="flex items-center gap-3.5">
                        <CompanyAvatar name={row.companyName} size="md" />
                        <div className="min-w-0">
                          <p className="font-semibold text-main truncate group-hover:text-accent transition-colors">
                            {row.companyName}
                          </p>
                          <p className="text-xs text-muted truncate">{row.positionTitle}</p>
                        </div>
                      </div>
                    </td>

                    {/* Combined Work Model & Employment Type */}
                    <td className="py-4 px-4 text-muted text-xs sm:text-sm">
                      {workModelLabel[row.workModel]} &bull; {employmentLabel[row.employmentType]}
                    </td>

                    {/* Source */}
                    <td className="py-4 px-4 text-muted text-xs sm:text-sm">
                      {sourceLabel[row.applicationSource]}
                    </td>

                    {/* Applied Date & Relative Days */}
                    <td className="py-4 px-4">
                      <p className="font-medium text-main text-xs sm:text-sm tabular-nums">
                        {formatDate(row.appliedDate)}
                      </p>
                      <p className="text-xs text-muted">{formatRelativeDays(row.appliedDate)}</p>
                    </td>

                    {/* Interactive Status Pill */}
                    <td
                      className="py-4 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Popover
                        open={changingStatusId === row.id}
                        onOpenChange={(open) => setChangingStatusId(open ? row.id : null)}
                      >
                        <PopoverTrigger asChild>
                          <button type="button" className="group/pill focus:outline-none">
                            <StatusPill
                              status={row.currentStatus}
                              short
                              interactive
                              className="group-hover/pill:ring-1 group-hover/pill:ring-accent/40"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-48 p-1.5 space-y-0.5">
                          <div className="px-2.5 py-1 text-xs font-medium text-muted">
                            Change status to:
                          </div>
                          {STATUSES.map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(row.id, st)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors",
                                row.currentStatus === st
                                  ? "bg-accent-soft text-accent font-semibold"
                                  : "text-main hover:bg-subtle",
                              )}
                            >
                              <span>{statusLabel[st]}</span>
                              {row.currentStatus === st && <Check className="h-3.5 w-3.5" />}
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    </td>

                    {/* Row Actions Menu */}
                    <td
                      className="py-4 pl-4 pr-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted hover:bg-subtle hover:text-main focus:outline-none"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => navigate(`/applications/${row.id}`)}>
                            <Briefcase className="h-4 w-4" />
                            <span>Open details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/applications/${row.id}/edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteCandidate(row)}
                            danger
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="space-y-3 md:hidden">
            {rows.map((row) => (
              <div
                key={row.id}
                onClick={() => navigate(`/applications/${row.id}`)}
                className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-4 shadow-card space-y-3 cursor-pointer active:scale-[0.99] transition-transform"
              >
                {/* Header: Avatar, Name, Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyAvatar name={row.companyName} size="md" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-main truncate">{row.companyName}</h4>
                      <p className="text-xs text-muted truncate">{row.positionTitle}</p>
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="h-8 w-8 inline-flex items-center justify-center rounded-xl text-muted hover:bg-subtle"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => navigate(`/applications/${row.id}`)}>
                          <Briefcase className="h-4 w-4" />
                          <span>Open</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/applications/${row.id}/edit`)}>
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteCandidate(row)} danger>
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Sub details */}
                <div className="flex items-center justify-between text-xs text-muted pt-1 border-t border-line dark:border-[#262C38]">
                  <span>
                    {workModelLabel[row.workModel]} &bull; {employmentLabel[row.employmentType]}
                  </span>
                  <span>{formatRelativeDays(row.appliedDate)}</span>
                </div>

                {/* Bottom row: source & status pill */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted">{sourceLabel[row.applicationSource]}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusPill status={row.currentStatus} short />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-line dark:border-[#262C38] bg-surface px-4 py-3 shadow-card">
              <span className="text-xs sm:text-sm text-muted">
                Page <span className="font-medium text-main">{(filter.page ?? 0) + 1}</span> of{" "}
                <span className="font-medium text-main">{pages}</span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filter.page ?? 0) === 0}
                  onClick={() =>
                    setFilter((current) => ({ ...current, page: (current.page ?? 0) - 1 }))
                  }
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filter.page ?? 0) + 1 >= pages}
                  onClick={() =>
                    setFilter((current) => ({ ...current, page: (current.page ?? 0) + 1 }))
                  }
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteCandidate)}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the application for{" "}
              <strong className="text-main font-semibold">
                {deleteCandidate?.companyName}
              </strong>
              {deleteCandidate?.positionTitle ? ` (${deleteCandidate.positionTitle})` : ""}?
              All associated status history and scheduled interviews will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteCandidate(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={remove.isPending}
            >
              Delete application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
