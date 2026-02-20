"use client";

import { useState } from "react";
import { TaskBoard } from "@/components/TaskBoard";
import { ContentPipeline } from "@/components/ContentPipeline";
import { Calendar } from "@/components/Calendar";
import { MemoryScreen } from "@/components/MemoryScreen";
import { TeamStructure } from "@/components/TeamStructure";
import { DigitalOffice } from "@/components/DigitalOffice";
import { Navigation } from "@/components/Navigation";
import { StatsBar } from "@/components/StatsBar";
import { Activity } from "lucide-react";

type View = "dashboard" | "tasks" | "content" | "calendar" | "memory" | "team" | "office";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Mission Control
                </h1>
                <p className="text-zinc-400 mt-1">OpenClaw Agent Dashboard</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Activity className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <StatsBar />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TaskBoard />
              <ContentPipeline />
              <Calendar />
              <TeamStructure />
              <MemoryScreen />
              <DigitalOffice />
            </div>
          </div>
        );
      case "tasks":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Task Board</h2>
            <TaskBoard />
          </div>
        );
      case "content":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Content Pipeline</h2>
            <ContentPipeline />
          </div>
        );
      case "calendar":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Calendar</h2>
            <Calendar />
          </div>
        );
      case "memory":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Memory Screen</h2>
            <MemoryScreen />
          </div>
        );
      case "team":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Team Structure</h2>
            <TeamStructure />
          </div>
        );
      case "office":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Digital Office</h2>
            <DigitalOffice />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}
