"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, Brain, Clock, Tag } from "lucide-react";

export function MemoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const memories = useQuery(api.tasks.getMemories);

  const filteredMemories = (memories ?? []).filter((m) =>
    !searchQuery ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Memory Screen</h3>
        <div className="text-xs text-zinc-500">{memories ? memories.length : "--"} memories</div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search memories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {!memories ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
          ))
        ) : (
          filteredMemories.map((memory) => {
            const date = new Date(memory.createdAt).toLocaleDateString();
            return (
              <div key={memory._id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Brain className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-zinc-200">{memory.title}</h4>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{memory.content}</p>
                    <div className="flex gap-1 flex-wrap">
                      {memory.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
