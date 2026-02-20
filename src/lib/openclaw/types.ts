export interface Memory {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
}

export interface ScheduledJob {
  _id: string;
  name: string;
  schedule: string;
  cronExpr: string;
  status: "active" | "paused" | "error";
  description: string;
  nextRun: number;
  lastRun: number | null;
  createdAt: number;
}

export interface Agent {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  status: "active" | "idle" | "offline";
  description: string;
  responsibilities: string[];
  lastActive: number;
}
