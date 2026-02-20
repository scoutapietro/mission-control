"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, MoreHorizontal } from "lucide-react";

const columns = [
  { id: "backlog", label: "Backlog", color: "bg-slate-500" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
] as const;

const priorityColors = {
  low: "bg-slate-400",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function TaskBoard() {
  const tasks = useQuery(api.tasks.getTasks);

  if (!tasks) {
    return (
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Task Board</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-sm font-medium text-zinc-300">{col.label}</span>
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Task Board</h3>
        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-sm font-medium text-zinc-300">{col.label}</span>
                <span className="text-xs text-zinc-500">
                  {tasks.filter((t) => t.status === col.id).length}
                </span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-zinc-600" />
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status === col.id)
                .map((task) => (
                  <div
                    key={task._id}
                    className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-zinc-200 font-medium">{task.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[task.priority as keyof typeof priorityColors]} text-white`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-zinc-500 mb-2 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          task.assignee === "me"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {task.assignee === "me" ? "G" : "S"}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {task.assignee === "me" ? "You" : "Scout"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
