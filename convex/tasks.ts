import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Tasks
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").take(50);
  },
});

export const getTasksByStatus = query({
  args: { status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("tasks").collect();
    return all.filter((t) => t.status === args.status);
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")),
    assignee: v.union(v.literal("me"), v.literal("scout")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("in_progress"), v.literal("done")),
    assignee: v.union(v.literal("me"), v.literal("scout")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const { taskId, ...fields } = args;
    await ctx.db.patch(taskId, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

// Content Pipeline
export const getContentItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentItems").order("desc").take(50);
  },
});

export const createContentItem = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("video"), v.literal("blog")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contentItems", {
      ...args,
      stage: "idea",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateContentItem = mutation({
  args: {
    itemId: v.id("contentItems"),
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
  },
  handler: async (ctx, args) => {
    const { itemId, ...fields } = args;
    await ctx.db.patch(itemId, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const deleteContentItem = mutation({
  args: { itemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});

export const advanceContentStage = mutation({
  args: { itemId: v.id("contentItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return;
    
    const stages = ["idea", "script", "thumbnail", "filming", "published"] as const;
    const currentIndex = stages.indexOf(item.stage);
    if (currentIndex < stages.length - 1) {
      await ctx.db.patch(args.itemId, {
        stage: stages[currentIndex + 1],
        updatedAt: Date.now(),
      });
    }
  },
});

// Scheduled Jobs
export const getScheduledJobs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scheduledJobs").order("asc").take(20);
  },
});

// Memories
export const getMemories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memories").order("desc").take(100);
  },
});

export const searchMemories = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("memories").collect();
    return all.filter(m => 
      m.title.toLowerCase().includes(args.query.toLowerCase()) ||
      m.content.toLowerCase().includes(args.query.toLowerCase()) ||
      m.tags.some((t: string) => t.toLowerCase().includes(args.query.toLowerCase()))
    );
  },
});

// Agents
export const getAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").order("desc").collect();
  },
});

export const updateAgentStatus = mutation({
  args: {
    agentId: v.id("agents"),
    status: v.union(v.literal("active"), v.literal("idle"), v.literal("offline")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      status: args.status,
      lastActive: Date.now(),
    });
  },
});