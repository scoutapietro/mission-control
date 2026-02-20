"use client";

import { useMemo } from "react";
import { useOpenClawQuery } from "@/lib/hooks/use-openclaw-query";
import type { ScheduledJob } from "@/lib/openclaw/types";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  PauseCircle,
} from "lucide-react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Minimal cron day-of-week + day-of-month matcher
function cronMatchesDate(cronExpr: string, date: Date): boolean {
  const parts = cronExpr.trim().split(/\s+/);
  if (parts.length < 5) return false;

  const domField = parts[2]; // day-of-month
  const monField = parts[3]; // month (1-12)
  const dowField = parts[4]; // day-of-week (0-7, 0 & 7 = Sun)

  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay(); // 0=Sun

  if (!fieldMatches(monField, month)) return false;

  // Cron: if both dom and dow are restricted (not *), match either.
  // If only one is restricted, match that one.
  const domStar = domField === "*";
  const dowStar = dowField === "*";

  if (domStar && dowStar) return true;
  if (domStar) return fieldMatchesDow(dowField, dayOfWeek);
  if (dowStar) return fieldMatches(domField, dayOfMonth);
  // Both restricted — match either (standard cron behavior)
  return fieldMatches(domField, dayOfMonth) || fieldMatchesDow(dowField, dayOfWeek);
}

function fieldMatchesDow(field: string, dow: number): boolean {
  // Normalize: 7 → 0 (both mean Sunday)
  return field.split(",").some((part) => {
    if (part.includes("-")) {
      const [lo, hi] = part.split("-").map(Number);
      // Normalize value 7 to 0 in range check
      return (dow >= lo && dow <= hi) || (dow === 0 && (7 >= lo && 7 <= hi));
    }
    const val = Number(part);
    return val === dow || (val === 7 && dow === 0);
  });
}

function fieldMatches(field: string, value: number): boolean {
  if (field === "*") return true;

  return field.split(",").some((part) => {
    if (part.includes("/")) {
      const [base, stepStr] = part.split("/");
      const step = Number(stepStr);
      const start = base === "*" ? 1 : Number(base);
      return (value - start) % step === 0 && value >= start;
    }
    if (part.includes("-")) {
      const [lo, hi] = part.split("-").map(Number);
      return value >= lo && value <= hi;
    }
    return Number(part) === value;
  });
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  // Leading blanks
  for (let i = 0; i < firstDay; i++) cells.push(null);
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  // Trailing blanks to fill last row
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

const STATUS_ICON = {
  active: CheckCircle,
  paused: PauseCircle,
  error: AlertCircle,
} as const;

const STATUS_COLORS = {
  active: { dot: "bg-green-400", icon: "text-green-400", bg: "bg-green-400/10" },
  paused: { dot: "bg-zinc-500", icon: "text-zinc-400", bg: "bg-zinc-800" },
  error: { dot: "bg-red-400", icon: "text-red-400", bg: "bg-red-400/10" },
} as const;

export function Calendar() {
  const jobs = useOpenClawQuery<ScheduledJob[]>("/api/openclaw/jobs");

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentMonth = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  // Map each calendar day → count of active jobs that fire on it
  const jobCountByDay = useMemo(() => {
    if (!jobs) return new Map<number, number>();
    const map = new Map<number, number>();
    const activeJobs = jobs.filter((j) => j.status !== "paused");
    for (const cell of cells) {
      if (!cell) continue;
      const d = cell.getDate();
      let count = 0;
      for (const job of activeJobs) {
        if (cronMatchesDate(job.cronExpr, cell)) count++;
      }
      if (count > 0) map.set(d, count);
    }
    return map;
  }, [jobs, cells]);

  // Sort upcoming jobs by nextRun
  const upcomingJobs = useMemo(() => {
    if (!jobs) return [];
    return [...jobs]
      .filter((j) => j.status !== "paused")
      .sort((a, b) => a.nextRun - b.nextRun);
  }, [jobs]);

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Calendar</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{currentMonth}</span>
          <CalendarIcon className="h-4 w-4 text-zinc-500" />
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((day) => (
          <div key={day} className="text-center text-xs text-zinc-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`blank-${i}`} className="aspect-square" />;
          }

          const d = date.getDate();
          const isToday =
            d === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          const jobCount = jobCountByDay.get(d) ?? 0;

          return (
            <div
              key={d}
              className={`aspect-square rounded-lg border p-1 flex flex-col justify-between ${
                isToday
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              <span
                className={`text-xs ${
                  isToday ? "text-blue-400 font-bold" : "text-zinc-500"
                }`}
              >
                {d}
              </span>
              {jobCount > 0 && (
                <div className="flex gap-0.5 flex-wrap">
                  {Array.from({ length: Math.min(jobCount, 4) }, (_, j) => (
                    <div
                      key={j}
                      className={`w-1.5 h-1.5 rounded-full ${
                        j === 0
                          ? "bg-green-400"
                          : j === 1
                            ? "bg-blue-400"
                            : j === 2
                              ? "bg-purple-400"
                              : "bg-orange-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming jobs list */}
      <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
        <h4 className="text-xs font-medium text-zinc-400 uppercase">
          Scheduled Jobs{" "}
          {jobs && (
            <span className="text-zinc-600">
              ({jobs.filter((j) => j.status === "active").length} active / {jobs.length} total)
            </span>
          )}
        </h4>
        {!jobs ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse"
            />
          ))
        ) : (
          upcomingJobs.map((job) => {
            const colors = STATUS_COLORS[job.status];
            const Icon = STATUS_ICON[job.status];
            const nextRunStr = job.nextRun
              ? new Date(job.nextRun).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={job._id}
                className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
              >
                <div className={`p-1.5 rounded ${colors.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{job.name}</p>
                  <p className="text-xs text-zinc-500">
                    {job.schedule}
                    {nextRunStr && (
                      <span className="ml-2 text-zinc-600">next: {nextRunStr}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
