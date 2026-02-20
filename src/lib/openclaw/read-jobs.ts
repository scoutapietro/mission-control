import { readFile } from "fs/promises";
import { PATHS } from "./config";
import type { ScheduledJob } from "./types";

interface RawJob {
  id: string;
  name: string;
  enabled: boolean;
  createdAtMs: number;
  schedule: { expr: string; tz?: string };
  payload: { message?: string; text?: string };
  state: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    consecutiveErrors?: number;
  };
}

function deriveStatus(job: RawJob): "active" | "paused" | "error" {
  if (!job.enabled) return "paused";
  if (
    job.state.lastStatus === "error" ||
    (job.state.consecutiveErrors && job.state.consecutiveErrors > 0)
  ) {
    return "error";
  }
  return "active";
}

function deriveDescription(job: RawJob): string {
  const text = job.payload.message ?? job.payload.text ?? "";
  // Strip markdown/emoji, take first 120 chars
  return text.replace(/[*_#`]/g, "").trim().slice(0, 120);
}

export async function readJobs(): Promise<ScheduledJob[]> {
  const raw = await readFile(PATHS.jobsJson, "utf-8");
  const data = JSON.parse(raw) as { jobs: RawJob[] };

  return data.jobs.map((job) => ({
    _id: job.id,
    name: job.name,
    schedule: job.schedule.expr + (job.schedule.tz ? ` (${job.schedule.tz})` : ""),
    cronExpr: job.schedule.expr,
    status: deriveStatus(job),
    description: deriveDescription(job),
    nextRun: job.state.nextRunAtMs ?? 0,
    lastRun: job.state.lastRunAtMs ?? null,
    createdAt: job.createdAtMs,
  }));
}
