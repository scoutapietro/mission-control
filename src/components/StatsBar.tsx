"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CheckSquare, Clapperboard, Calendar as CalendarIcon, Users } from "lucide-react";

export function StatsBar() {
  const tasks = useQuery(api.tasks.getTasks);
  const contentItems = useQuery(api.tasks.getContentItems);
  const scheduledJobs = useQuery(api.tasks.getScheduledJobs);
  const agents = useQuery(api.tasks.getAgents);

  const stats = [
    {
      label: "Active Tasks",
      value: tasks ? tasks.filter((t) => t.status !== "done").length : "--",
      total: tasks ? tasks.length : "--",
      icon: CheckSquare,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Content Items",
      value: contentItems ? contentItems.filter((c) => c.stage !== "published").length : "--",
      total: contentItems ? contentItems.length : "--",
      icon: Clapperboard,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Scheduled Jobs",
      value: scheduledJobs ? scheduledJobs.filter((j) => j.status === "active").length : "--",
      total: scheduledJobs ? scheduledJobs.length : "--",
      icon: CalendarIcon,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Team Members",
      value: agents ? agents.filter((a) => a.status === "active").length : "--",
      total: agents ? agents.length : "--",
      icon: Users,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
                  <p className="text-sm text-zinc-500">/ {stat.total}</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
