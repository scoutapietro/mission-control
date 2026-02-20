"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Users, Bot, Code, PenTool, Search, Cpu } from "lucide-react";

const roleIcons: Record<string, typeof Bot> = {
  main: Bot, developer: Code, writer: PenTool, researcher: Search, specialist: Cpu,
};

export function TeamStructure() {
  const agents = useQuery(api.tasks.getAgents);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-400";
      case "idle": return "bg-yellow-400";
      default: return "bg-zinc-500";
    }
  };

  if (!agents) {
    return (
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Team Structure</h3>
          <Users className="h-4 w-4 text-zinc-500" />
        </div>
        <div className="mb-6">
          <div className="h-24 rounded-xl bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const mainAgent = agents.find((a) => a.role === "main") ?? agents[0];
  const subAgents = agents.filter((a) => a._id !== mainAgent?._id);

  if (!mainAgent) {
    return (
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Team Structure</h3>
          <Users className="h-4 w-4 text-zinc-500" />
        </div>
        <p className="text-sm text-zinc-500">No agents found.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Team Structure</h3>
        <Users className="h-4 w-4 text-zinc-500" />
      </div>

      {/* Main Agent */}
      <div className="mb-6">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
              {mainAgent.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(mainAgent.status)} border-2 border-zinc-900`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-semibold text-zinc-100">{mainAgent.name}</h4>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Main Agent</span>
            </div>
            <p className="text-sm text-zinc-400 mb-2">{mainAgent.description}</p>
          </div>
        </div>
      </div>

      {/* Sub Agents */}
      <div className="grid grid-cols-2 gap-3">
        {subAgents.map((agent) => {
          const Icon = roleIcons[agent.role] || Bot;
          return (
            <div key={agent._id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">{agent.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${getStatusColor(agent.status)} border-2 border-zinc-800`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-zinc-200 truncate">{agent.name}</h5>
                  <p className="text-xs text-zinc-500 mb-1 capitalize">{agent.role}</p>
                </div>
                <Icon className="h-3 w-3 text-zinc-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
