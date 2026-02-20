/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = "agents" | "contentItems" | "memories" | "scheduledJobs" | "tasks";

/**
 * The type of a document stored in the "agents" table.
 */
export type Doc<TableName extends TableNames> = TableName extends "agents"
  ? {
      _id: GenericId<"agents">;
      _creationTime: number;
      avatar: string;
      description: string;
      lastActive: number;
      name: string;
      responsibilities: string[];
      role: string;
      status: "active" | "idle" | "offline";
    }
  : TableName extends "contentItems"
  ? {
      _id: GenericId<"contentItems">;
      _creationTime: number;
      createdAt: number;
      script?: string;
      stage: "idea" | "script" | "thumbnail" | "filming" | "published";
      thumbnailUrl?: string;
      title: string;
      type: "video" | "blog";
      updatedAt: number;
    }
  : TableName extends "memories"
  ? {
      _id: GenericId<"memories">;
      _creationTime: number;
      category: string;
      content: string;
      createdAt: number;
      tags: string[];
      title: string;
    }
  : TableName extends "scheduledJobs"
  ? {
      _id: GenericId<"scheduledJobs">;
      _creationTime: number;
      createdAt: number;
      description: string;
      lastRun?: number;
      name: string;
      nextRun: number;
      schedule: string;
      status: "active" | "paused" | "error";
    }
  : TableName extends "tasks"
  ? {
      _id: GenericId<"tasks">;
      _creationTime: number;
      assignee: "me" | "scout";
      createdAt: number;
      description?: string;
      priority: "low" | "medium" | "high";
      status: "backlog" | "in_progress" | "done";
      title: string;
      updatedAt: number;
    }
  : never;

export type DataModel = AnyDataModel;