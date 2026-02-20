"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar() {
  const jobs = useQuery(api.tasks.getScheduledJobs);

  const today = new Date();
  const currentMonth = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i - 5);
    return date;
  });

  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-100">Calendar</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{currentMonth}</span>
          <CalendarIcon className="h-4 w-4 text-zinc-500" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs text-zinc-500 font-medium py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, i) => {
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
          const isCurrentMonth = date.getMonth() === today.getMonth();

          return (
            <div
              key={i}
              className={`aspect-square rounded-lg border p-1 flex flex-col justify-between ${
                isToday ? "border-blue-500/50 bg-blue-500/10" : "border-zinc-800 bg-zinc-900/50"
              } ${!isCurrentMonth ? "opacity-40" : ""}`}
            >
              <span className={`text-xs ${isToday ? "text-blue-400 font-bold" : "text-zinc-500"}`}>
                {date.getDate()}
              </span>
              {isToday && (
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-medium text-zinc-400 uppercase">Upcoming Jobs</h4>
        {!jobs ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-pulse" />
          ))
        ) : (
          jobs.slice(0, 3).map((job) => (
            <div key={job._id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <div className={`p-1.5 rounded ${job.status === "active" ? "bg-green-400/10" : "bg-yellow-400/10"}`}>
                {job.status === "active" ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-yellow-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{job.name}</p>
                <p className="text-xs text-zinc-500">{job.schedule}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
