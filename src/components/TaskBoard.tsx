"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TaskForm, type TaskFormData } from "@/components/TaskForm";

const columns = [
  { id: "backlog", label: "Backlog", color: "bg-slate-500" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
] as const;

type Status = (typeof columns)[number]["id"];

const priorityColors = {
  low: "bg-slate-400",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export function TaskBoard() {
  const tasks = useQuery(api.tasks.getTasks);
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<Status>("backlog");
  const [editingTask, setEditingTask] = useState<(typeof tasks extends (infer T)[] | undefined ? T : never) | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<Id<"tasks"> | null>(null);

  function openCreate(status: Status = "backlog") {
    setCreateDefaultStatus(status);
    setCreateOpen(true);
  }

  async function handleCreate(data: TaskFormData) {
    await createTask({
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
    });
    setCreateOpen(false);
  }

  async function handleUpdate(data: TaskFormData) {
    if (!editingTask) return;
    await updateTask({
      taskId: editingTask._id,
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
    });
    setEditingTask(null);
  }

  async function handleDelete() {
    if (!deletingTaskId) return;
    await deleteTask({ taskId: deletingTaskId });
    setDeletingTaskId(null);
  }

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
    <>
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Task Board</h3>
          <button
            onClick={() => openCreate()}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all"
          >
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
                <button
                  onClick={() => openCreate(col.id)}
                  className="p-1 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <div
                      key={task._id}
                      onClick={() => setEditingTask(task)}
                      className="group p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 cursor-pointer transition-all relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingTaskId(task._id);
                        }}
                        className="absolute top-2 right-2 p-1 rounded text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-zinc-700/50 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-start justify-between mb-2 pr-6">
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

      {/* Create Task Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Add a new task to the board.</DialogDescription>
          </DialogHeader>
          <TaskForm
            initialData={{
              title: "",
              description: "",
              status: createDefaultStatus,
              priority: "medium",
              assignee: "me",
            }}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            submitLabel="Create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              key={editingTask._id}
              initialData={{
                title: editingTask.title,
                description: editingTask.description ?? "",
                status: editingTask.status,
                priority: editingTask.priority,
                assignee: editingTask.assignee,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              submitLabel="Save"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTaskId} onOpenChange={(open) => !open && setDeletingTaskId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setDeletingTaskId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
