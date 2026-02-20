"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Plus, FileText, Image, Video, CheckCircle, Lightbulb, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ContentForm, type ContentFormData } from "@/components/ContentForm";

type Stage = "idea" | "script" | "thumbnail" | "filming" | "published";

const stages = [
  { id: "idea", label: "Ideas", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "script", label: "Script", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "thumbnail", label: "Thumbnail", icon: Image, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "filming", label: "Filming", icon: Video, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "published", label: "Published", icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
] as const;

export function ContentPipeline() {
  const contentItems = useQuery(api.tasks.getContentItems);
  const createContentItem = useMutation(api.tasks.createContentItem);
  const updateContentItem = useMutation(api.tasks.updateContentItem);
  const deleteContentItem = useMutation(api.tasks.deleteContentItem);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultStage, setCreateDefaultStage] = useState<Stage>("idea");
  const [editingItem, setEditingItem] = useState<(typeof contentItems extends (infer T)[] | undefined ? T : never) | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<Id<"contentItems"> | null>(null);

  function openCreate(stage: Stage = "idea") {
    setCreateDefaultStage(stage);
    setCreateOpen(true);
  }

  async function handleCreate(data: ContentFormData) {
    await createContentItem({
      title: data.title,
      type: data.type,
    });
    setCreateOpen(false);
  }

  async function handleUpdate(data: ContentFormData) {
    if (!editingItem) return;
    await updateContentItem({
      itemId: editingItem._id,
      title: data.title,
      type: data.type,
      stage: data.stage,
      script: data.script || undefined,
    });
    setEditingItem(null);
  }

  async function handleDelete() {
    if (!deletingItemId) return;
    await deleteContentItem({ itemId: deletingItemId });
    setDeletingItemId(null);
  }

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
    <>
      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-100">Content Pipeline</h3>
          <button
            onClick={() => openCreate()}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all"
          >
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
                className="flex-shrink-0 w-48 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all"
              >
                <div className="p-3 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${stage.bg}`}>
                        <Icon className={`h-4 w-4 ${stage.color}`} />
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                        {stageItems.length}
                      </span>
                      <button
                        onClick={() => openCreate(stage.id)}
                        className="p-1 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-2 min-h-[100px]">
                  {stageItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setEditingItem(item)}
                      className="group p-2 rounded bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 cursor-pointer transition-all relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingItemId(item._id);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-zinc-700/50 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-zinc-200 font-medium mb-1 pr-5">{item.title}</p>
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

      {/* Create Content Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Content</DialogTitle>
            <DialogDescription>Add a new content item to the pipeline.</DialogDescription>
          </DialogHeader>
          <ContentForm
            initialData={{
              title: "",
              type: "video",
              stage: createDefaultStage,
              script: "",
            }}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            submitLabel="Create"
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>Update content details.</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <ContentForm
              key={editingItem._id}
              initialData={{
                title: editingItem.title,
                type: editingItem.type,
                stage: editingItem.stage,
                script: editingItem.script ?? "",
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingItem(null)}
              submitLabel="Save"
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingItemId} onOpenChange={(open) => !open && setDeletingItemId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setDeletingItemId(null)}>
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
