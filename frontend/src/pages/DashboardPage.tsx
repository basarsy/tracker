import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Calendar, CheckCircle2, Inbox } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { CompanyAvatar } from "../components/ui/Avatar";
import { Skeleton } from "../components/ui/Skeleton";
import { useDashboardStats } from "../hooks/useStats";
import {
  formatDateTime,
  formatRelativeDays,
  formatShortDate,
  interviewLabel,
  percent,
  sourceLabel,
  workModelLabel,
} from "../lib/labels";
import type { ApplicationSource, WorkModel } from "../api/types";

const WORK_MODEL_COLORS: Record<string, string> = {
  REMOTE: "#3B5BFF",
  HYBRID: "#8B5CF6",
  ON_SITE: "#F59E0B",
};

export function DashboardPage() {
  const { summary, responseTime, funnel, weekly, bySource, byWorkModel, stale, upcoming } =
    useDashboardStats();

  const isLoading =
    summary.isLoading ||
    responseTime.isLoading ||
    funnel.isLoading ||
    weekly.isLoading ||
    bySource.isLoading ||
    byWorkModel.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-44 rounded-xl" />
          <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const sum = summary.data;
  const rt = responseTime.data;
  const fn = funnel.data;

  // Format short date "27 Jul" for x-axis
  const weeklyData = (weekly.data ?? []).map((w) => ({
    week: formatShortDate(w.weekStart),
    count: w.count,
  }));

  const sourceData = (bySource.data ?? []).map((s) => ({
    source: sourceLabel[s.key as ApplicationSource] || s.key,
    total: s.applications,
    responseRate: Math.round(s.responseRate * 100),
    interviewRate: Math.round(s.interviewRate * 100),
  }));

  const workModelData = (byWorkModel.data ?? []).map((w) => ({
    name: workModelLabel[w.key as WorkModel] || w.key,
    key: w.key,
    value: w.applications,
  }));

  const hasApplications = (sum?.totalApplications ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-main">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Real-time pipeline analytics, response metrics, and upcoming interviews.
        </p>
      </div>

      {/* Stat Cards Grid - 13px sentence case, big numbers, reserved alignment */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
        <StatCard
          label="Total applications"
          value={String(sum?.totalApplications ?? 0)}
          hint="All time submissions"
        />
        <StatCard
          label="Active pipeline"
          value={String(sum?.activeApplications ?? 0)}
          hint="Currently in review"
        />
        <StatCard
          label="Response rate"
          value={percent(sum?.responseRate ?? 0)}
          hint="Excluding withdrawn"
        />
        <StatCard
          label="Interview rate"
          value={percent(sum?.interviewRate ?? 0)}
          hint="Reached interview stage"
        />
        <StatCard
          label="Offer rate"
          value={percent(sum?.offerRate ?? 0)}
          hint="Of all applications"
        />
        <StatCard
          label="Rejection rate"
          value={percent(sum?.rejectionRate ?? 0)}
          hint="Not moved forward"
        />
        <StatCard
          label="Ghosted"
          value={String(sum?.ghostedCount ?? 0)}
          hint="Inactive > 30 days"
        />
        <StatCard
          label="Avg response time"
          value={rt?.averageDays ? `${rt.averageDays}d` : "—"}
          hint={rt?.sampleSize ? `${rt.medianDays}d median (${rt.sampleSize} replies)` : "No replies yet"}
        />
      </div>

      {/* Application Funnel Card */}
      {fn && (
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-main">Application funnel</h2>
              <p className="mt-0.5 text-xs text-muted">Progression across hiring milestones</p>
            </div>
            <span className="text-xs font-medium text-muted">
              {hasApplications ? `${fn.applied} total candidates` : "0 applications"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Step 1: Applied */}
            <div className="space-y-2 rounded-xl bg-subtle p-4 border border-line/40 dark:border-[#262C38]/60">
              <span className="text-xs font-medium text-muted">1. Applied</span>
              <p className="text-2xl font-bold tracking-tight text-main tabular-nums">{fn.applied}</p>
              <div className="h-2 w-full rounded-full bg-line/60 dark:bg-line/40 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#3B5BFF] dark:bg-[#6C86FF] transition-all duration-300"
                  style={{ width: fn.applied > 0 ? "100%" : "0%" }}
                />
              </div>
              <span className="text-xs text-muted tabular-nums">
                {fn.applied > 0 ? "100%" : "0%"}
              </span>
            </div>

            {/* Step 2: Responded */}
            <div className="space-y-2 rounded-xl bg-subtle p-4 border border-line/40 dark:border-[#262C38]/60">
              <span className="text-xs font-medium text-muted">2. Responded</span>
              <p className="text-2xl font-bold tracking-tight text-main tabular-nums">{fn.responded}</p>
              <div className="h-2 w-full rounded-full bg-line/60 dark:bg-line/40 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${fn.applied ? (fn.responded / fn.applied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted tabular-nums">
                {fn.applied ? percent(fn.responded / fn.applied) : "0%"} of applied
              </span>
            </div>

            {/* Step 3: Interview */}
            <div className="space-y-2 rounded-xl bg-subtle p-4 border border-line/40 dark:border-[#262C38]/60">
              <span className="text-xs font-medium text-muted">3. Interview</span>
              <p className="text-2xl font-bold tracking-tight text-main tabular-nums">{fn.interview}</p>
              <div className="h-2 w-full rounded-full bg-line/60 dark:bg-line/40 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-violet-500 transition-all duration-300"
                  style={{ width: `${fn.applied ? (fn.interview / fn.applied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted tabular-nums">
                {fn.applied ? percent(fn.interview / fn.applied) : "0%"} of applied
              </span>
            </div>

            {/* Step 4: Offer */}
            <div className="space-y-2 rounded-xl bg-subtle p-4 border border-line/40 dark:border-[#262C38]/60">
              <span className="text-xs font-medium text-muted">4. Offer</span>
              <p className="text-2xl font-bold tracking-tight text-main tabular-nums">{fn.offer}</p>
              <div className="h-2 w-full rounded-full bg-line/60 dark:bg-line/40 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${fn.applied ? (fn.offer / fn.applied) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted tabular-nums">
                {fn.applied ? percent(fn.offer / fn.applied) : "0%"} of applied
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Trend Chart */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-main">Applications over time</h2>
              <p className="text-xs text-muted">Weekly volume over the last 12 weeks</p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.6} />
                <XAxis
                  dataKey="week"
                  interval={1}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={{ stroke: "var(--border-subtle)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--bg-subtle)", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "0.875rem",
                    color: "var(--text-main)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Applications"
                  fill="#3B5BFF"
                  className="fill-[#3B5BFF] dark:fill-[#6C86FF]"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Source Chart */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-main">Applications by source</h2>
              <p className="text-xs text-muted">Volume by application channel</p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sourceData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-subtle)" opacity={0.6} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={{ stroke: "var(--border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="source"
                    width={100}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--bg-subtle)", opacity: 0.5 }}
                    contentStyle={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "0.875rem",
                      color: "var(--text-main)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name="Applications"
                    fill="#3B5BFF"
                    className="fill-[#3B5BFF] dark:fill-[#6C86FF]"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Inbox className="h-8 w-8 text-muted/60" />
                <p className="mt-2 text-xs text-muted">No source distribution data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Work Model Distribution */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-main">Work model distribution</h2>
              <p className="text-xs text-muted">Remote vs Hybrid vs On-Site</p>
            </div>
          </div>
          <div className="mt-6 h-64 w-full">
            {workModelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workModelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {workModelData.map((entry) => (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={WORK_MODEL_COLORS[entry.key] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "0.875rem",
                      color: "var(--text-main)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Inbox className="h-8 w-8 text-muted/60" />
                <p className="mt-2 text-xs text-muted">No work model data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Actionable: Needs Attention (Stale Applications) */}
        <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-main">Needs attention</h2>
              <p className="text-xs text-muted">No update received in &gt; 14 days</p>
            </div>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              {stale.data?.length ?? 0} stale
            </span>
          </div>

          <div className="mt-4 divide-y divide-line/60 dark:divide-[#262C38] max-h-56 overflow-y-auto">
            {stale.data && stale.data.length > 0 ? (
              stale.data.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyAvatar name={item.companyName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-main truncate">{item.companyName}</p>
                      <p className="text-xs text-muted truncate">
                        {item.positionTitle} &bull; Applied {item.daysSinceApplied} days ago
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/applications/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline shrink-0"
                  >
                    <span>View</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/80" />
                <p className="mt-2 text-sm font-medium text-main">All caught up!</p>
                <p className="text-xs text-muted">No applications waiting for response over 14 days.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Section */}
      <div className="rounded-2xl border border-line dark:border-[#262C38] bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-main">Upcoming interviews</h2>
            <p className="text-xs text-muted">Scheduled rounds across all active applications</p>
          </div>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
            {upcoming.data?.length ?? 0} scheduled
          </span>
        </div>

        <div className="mt-4 divide-y divide-line/60 dark:divide-[#262C38]">
          {upcoming.data && upcoming.data.length > 0 ? (
            upcoming.data.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <CompanyAvatar name={item.companyName || "Interview"} size="md" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-main truncate">
                        {item.companyName || "Company"}
                      </p>
                      <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                        {interviewLabel[item.type] || item.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">
                      {item.positionTitle ? `${item.positionTitle} &bull; ` : ""}
                      {formatDateTime(item.scheduledAt)} ({formatRelativeDays(item.scheduledAt)})
                      {item.notes ? ` &bull; ${item.notes}` : ""}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/applications/${item.applicationId}`}
                  className="rounded-xl bg-subtle px-3 py-1.5 text-xs font-medium text-main hover:bg-line/40 dark:hover:bg-subtle/80 shrink-0 transition-colors"
                >
                  View application
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="h-8 w-8 text-muted/60" />
              <p className="mt-2 text-sm font-medium text-main">No interviews scheduled</p>
              <p className="text-xs text-muted">When you schedule interviews on applications, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
