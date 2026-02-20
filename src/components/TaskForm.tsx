"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

type Status = "backlog" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";
type Assignee = "me" | "scout";

export interface TaskFormData {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: Assignee;
}

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-slate-400" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-red-500" },
];

const assigneeOptions: { value: Assignee; label: string; avatar: string; color: string }[] = [
  { value: "me", label: "Me", avatar: "G", color: "bg-blue-500/20 text-blue-400" },
  { value: "scout", label: "Scout", avatar: "S", color: "bg-purple-500/20 text-purple-400" },
];

export function TaskForm({ initialData, onSubmit, onCancel, submitLabel = "Create" }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [status, setStatus] = useState<Status>(initialData?.status ?? "backlog");
  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? "medium");
  const [assignee, setAssignee] = useState<Assignee>(initialData?.assignee ?? "me");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), status, priority, assignee });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Title</label>
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Description</label>
        <textarea
          placeholder="Optional description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Priority</label>
        <div className="flex gap-2">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPriority(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                priority === opt.value
                  ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.color}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Assignee</label>
        <div className="flex gap-2">
          {assigneeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAssignee(opt.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                assignee === opt.value
                  ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${opt.color}`}>
                {opt.avatar}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Status</label>
        <div className="flex gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                status === opt.value
                  ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <DialogFooter className="pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
