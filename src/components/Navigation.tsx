"use client";

import {
  LayoutDashboard,
  CheckSquare,
  Clapperboard,
  Calendar,
  Brain,
  Users,
  Building2,
} from "lucide-react";

type View = "dashboard" | "tasks" | "content" | "calendar" | "memory" | "team" | "office";

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "content", label: "Content", icon: Clapperboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "team", label: "Team", icon: Users },
  { id: "office", label: "Office", icon: Building2 },
];

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">🐕</span>
          </div>
          <div>
            <h1 className="font-bold text-zinc-100">Mission Control</h1>
            <p className="text-xs text-zinc-500">OpenClaw Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-zinc-900">
            G
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200">Greg</p>
            <p className="text-xs text-zinc-500 truncate">Commander</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
