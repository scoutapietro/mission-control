"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Video, FileText } from "lucide-react";

type ContentType = "video" | "blog";
type Stage = "idea" | "script" | "thumbnail" | "filming" | "published";

export interface ContentFormData {
  title: string;
  type: ContentType;
  stage: Stage;
  script: string;
}

interface ContentFormProps {
  initialData?: ContentFormData;
  onSubmit: (data: ContentFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  mode?: "create" | "edit";
}

const typeOptions: { value: ContentType; label: string; icon: typeof Video }[] = [
  { value: "video", label: "Video", icon: Video },
  { value: "blog", label: "Blog", icon: FileText },
];

const stageOptions: { value: Stage; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "script", label: "Script" },
  { value: "thumbnail", label: "Thumbnail" },
  { value: "filming", label: "Filming" },
  { value: "published", label: "Published" },
];

export function ContentForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Create",
  mode = "create",
}: ContentFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [type, setType] = useState<ContentType>(initialData?.type ?? "video");
  const [stage, setStage] = useState<Stage>(initialData?.stage ?? "idea");
  const [script, setScript] = useState(initialData?.script ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), type, stage, script: script.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Title</label>
        <Input
          placeholder="Content title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Type</label>
        <div className="flex gap-2">
          {typeOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  type === opt.value
                    ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "edit" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Stage</label>
          <div className="flex gap-2 flex-wrap">
            {stageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStage(opt.value)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  stage === opt.value
                    ? "bg-zinc-700 text-zinc-100 ring-1 ring-zinc-600"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Script</label>
        <textarea
          placeholder="Optional script or notes..."
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={3}
          className="flex w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-100 resize-none"
        />
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
