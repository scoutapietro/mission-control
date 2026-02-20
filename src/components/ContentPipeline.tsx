"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, FileText, Image, Video, CheckCircle, Lightbulb } from "lucide-react";

const stages = [
  { id: "idea", label: "Ideas", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "script", label: "Script", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "thumbnail", label: "Thumbnail", icon: Image, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "filming", label: "Filming", icon: Video, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "published", label: "Published", icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
] as const;

export function ContentPipeline() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const contentItems = useQuery(api.tasks.getContentItems);

  if (!contentItems) {
    return (
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Content Pipeline</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-48 h-40 rounded-lg border border-zinc-800 bg-zinc-900/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Content Pipeline</h3>
        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const stageItems = contentItems.filter((i) => i.stage === stage.id);

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
              className="flex-shrink-0 w-48 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="p-3 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${stage.bg}`}>
                      <Icon className={`h-4 w-4 ${stage.color}`} />
                    </div>
                    <span className="text-sm font-medium text-zinc-300">{stage.label}</span>
                  </div>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                    {stageItems.length}
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-2 min-h-[100px]">
                {stageItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-2 rounded bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all"
                  >
                    <p className="text-xs text-zinc-200 font-medium mb-1">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 uppercase bg-zinc-800 px-1.5 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
