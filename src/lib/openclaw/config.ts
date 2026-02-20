import { homedir } from "os";
import { join } from "path";

const OPENCLAW_DIR = join(homedir(), ".openclaw");

export const PATHS = {
  jobsJson: join(OPENCLAW_DIR, "cron", "jobs.json"),
  openclawJson: join(OPENCLAW_DIR, "openclaw.json"),
  memoryDir: join(OPENCLAW_DIR, "workspace", "memory"),
  memorySqlite: join(OPENCLAW_DIR, "memory", "main.sqlite"),
  heartbeatState: join(OPENCLAW_DIR, "workspace", "memory", "heartbeat-state.json"),
} as const;
