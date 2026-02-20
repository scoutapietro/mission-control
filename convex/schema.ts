import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")),
    assignee: v.union(v.literal("me"), v.literal("scout")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assignee"]),

  contentItems: defineTable({
    title: v.string(),
    type: v.union(v.literal("video"), v.literal("blog")),
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("published")
    ),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_stage", ["stage"]),

  scheduledJobs: defineTable({
    name: v.string(),
    description: v.string(),
    schedule: v.string(),
    lastRun: v.optional(v.number()),
    nextRun: v.number(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("error")),
    createdAt: v.number(),
  }).index("by_nextRun", ["nextRun"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"]),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    avatar: v.string(),
    status: v.union(v.literal("active"), v.literal("idle"), v.literal("offline")),
    description: v.string(),
    responsibilities: v.array(v.string()),
    lastActive: v.number(),
  }).index("by_status", ["status"]),
});
