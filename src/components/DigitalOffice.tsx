"use client";

import { useOpenClawQuery } from "@/lib/hooks/use-openclaw-query";
import type { Agent } from "@/lib/openclaw/types";
import { Monitor, Coffee, Clock, Activity } from "lucide-react";

export function DigitalOffice() {
  const agents = useOpenClawQuery<Agent[]>("/api/openclaw/agents");

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active": return { icon: Monitor, color: "text-green-400", bg: "bg-green-400/20", label: "Working" };
      case "idle": return { icon: Coffee, color: "text-yellow-400", bg: "bg-yellow-400/20", label: "Idle" };
      default: return { icon: Clock, color: "text-zinc-500", bg: "bg-zinc-500/20", label: "Offline" };
    }
  };

  if (!agents) {
    return (
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Digital Office</h3>
        </div>
        <div className="h-48 bg-zinc-950 rounded-lg border border-zinc-800 animate-pulse mb-4" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-32 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Digital Office</h3>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-400" />
          <span className="text-xs text-zinc-400">{agents.filter(a => a.status === "active").length} active</span>
        </div>
      </div>

      <div className="relative h-48 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(zinc-700 1px, transparent 1px), linear-gradient(90deg, zinc-700 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {agents.map((agent, idx) => {
          const status = getStatusDisplay(agent.status);
          const Icon = status.icon;
          const positions = [
            { x: 15, y: 20 }, { x: 40, y: 15 }, { x: 65, y: 25 }, { x: 85, y: 20 }
          ];
          const pos = positions[idx] || { x: 50, y: 50 };

          return (
            <div key={agent._id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              <div className="relative group">
                <div className="w-16 h-10 bg-zinc-800 rounded border border-zinc-700 shadow-lg">
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 rounded border border-zinc-600 ${agent.status === "active" ? "bg-blue-400/30" : "bg-zinc-600"}`} />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-zinc-800 ${agent.status === "active" ? "bg-blue-500 text-white" : agent.status === "idle" ? "bg-yellow-500" : "bg-zinc-600"}`}>
                    {agent.avatar}
                  </div>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 whitespace-nowrap">
                    <p className="text-sm font-medium text-zinc-200">{agent.name}</p>
                    <Icon className={`h-3 w-3 inline mr-1 ${status.color}`} /> <span className={`text-xs ${status.color}`}>{status.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {agents.map((agent) => {
          const status = getStatusDisplay(agent.status);
          const Icon = status.icon;
          return (
            <div key={agent._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border min-w-fit ${agent.status === "active" ? "bg-green-400/10 border-green-400/30" : agent.status === "idle" ? "bg-yellow-400/10 border-yellow-400/30" : "bg-zinc-800 border-zinc-700"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${agent.status === "active" ? "bg-blue-500 text-white" : "bg-zinc-600"}`}>
                {agent.avatar}
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-200">{agent.name}</p>
                <Icon className={`h-2.5 w-2.5 inline mr-1 ${status.color}`} />
                <span className={`text-[10px] ${status.color}`}>{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
