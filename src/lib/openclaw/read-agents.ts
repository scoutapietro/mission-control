import { readFile } from "fs/promises";
import { PATHS } from "./config";
import type { Agent } from "./types";

interface HeartbeatState {
  lastChecks?: Record<string, number | null>;
  notes?: Record<string, string>;
}

interface OpenClawConfig {
  ui?: { assistant?: { name?: string } };
  agents?: {
    defaults?: {
      model?: {
        primary?: string;
        fallbacks?: string[];
      };
    };
    list?: Array<{
      id: string;
      identity?: { name?: string; emoji?: string };
    }>;
  };
}

function modelDisplayName(modelId: string): string {
  // "openrouter/moonshotai/kimi-k2.5" -> "Kimi K2.5"
  const last = modelId.split("/").pop() ?? modelId;
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function modelRole(index: number): string {
  return index === 0 ? "Primary LLM" : "Fallback LLM";
}

function modelEmoji(modelId: string): string {
  if (modelId.includes("kimi")) return "\u{1F31F}"; // star
  if (modelId.includes("opus")) return "\u{1F3B5}"; // music note
  if (modelId.includes("sonnet")) return "\u{1F4DD}"; // memo
  return "\u{1F916}"; // robot
}

function modelDescription(modelId: string, index: number): string {
  const name = modelDisplayName(modelId);
  if (index === 0) return `Primary language model: ${name}`;
  return `Fallback language model: ${name}`;
}

async function readHeartbeat(): Promise<HeartbeatState> {
  try {
    const raw = await readFile(PATHS.heartbeatState, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function scoutStatus(heartbeat: HeartbeatState): "active" | "idle" | "offline" {
  const hbTime = heartbeat.lastChecks?.heartbeat;
  if (!hbTime) return "offline";

  const ageMs = Date.now() - hbTime * 1000;
  const TEN_MIN = 10 * 60 * 1000;
  const ONE_HOUR = 60 * 60 * 1000;

  if (ageMs < TEN_MIN) return "active";
  if (ageMs < ONE_HOUR) return "idle";
  return "offline";
}

export async function readAgents(): Promise<Agent[]> {
  const [configRaw, heartbeat] = await Promise.all([
    readFile(PATHS.openclawJson, "utf-8"),
    readHeartbeat(),
  ]);

  const config: OpenClawConfig = JSON.parse(configRaw);
  const agents: Agent[] = [];

  // Scout agent
  const scoutEntry = config.agents?.list?.[0];
  const scoutName = scoutEntry?.identity?.name ?? config.ui?.assistant?.name ?? "Scout";
  const scoutEmoji = scoutEntry?.identity?.emoji ?? "\u{1F415}";
  const status = scoutStatus(heartbeat);

  agents.push({
    _id: scoutEntry?.id ?? "main",
    name: scoutName,
    role: "main",
    avatar: scoutEmoji,
    status,
    description: "Primary AI agent managing tasks, cron jobs, and communication",
    responsibilities: [
      "Task execution",
      "Cron job management",
      "Email monitoring",
      "Telegram messaging",
    ],
    lastActive: (heartbeat.lastChecks?.heartbeat ?? 0) * 1000,
  });

  // LLM model sub-agents
  const modelConfig = config.agents?.defaults?.model;
  if (modelConfig) {
    const allModels = [
      modelConfig.primary,
      ...(modelConfig.fallbacks ?? []),
    ].filter(Boolean) as string[];

    allModels.forEach((modelId, idx) => {
      agents.push({
        _id: `model-${idx}`,
        name: modelDisplayName(modelId),
        role: modelRole(idx),
        avatar: modelEmoji(modelId),
        status: idx === 0 ? "active" : "idle",
        description: modelDescription(modelId, idx),
        responsibilities:
          idx === 0
            ? ["Primary reasoning", "Tool use", "Code generation"]
            : ["Backup reasoning", "Failover support"],
        lastActive: Date.now(),
      });
    });
  }

  return agents;
}
