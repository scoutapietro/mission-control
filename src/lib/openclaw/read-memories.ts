import { readFile } from "fs/promises";
import { basename, join } from "path";
import Database from "better-sqlite3";
import { PATHS } from "./config";
import { parseMemory } from "./parse-memory";
import type { Memory } from "./types";

interface FileRow {
  path: string;
  mtime: number;
  size: number;
}

export async function readMemories(): Promise<Memory[]> {
  const db = new Database(PATHS.memorySqlite, { readonly: true });
  try {
    const rows = db
      .prepare(
        "SELECT path, mtime, size FROM files WHERE path LIKE 'memory/%.md' ORDER BY mtime DESC",
      )
      .all() as FileRow[];

    const memories: Memory[] = [];

    for (const row of rows) {
      try {
        // SQLite paths are like "memory/filename.md", files live in PATHS.memoryDir
        const fullPath = join(PATHS.memoryDir, basename(row.path));
        const content = await readFile(fullPath, "utf-8");
        memories.push(parseMemory(row.path, content, row.mtime));
      } catch {
        // File may have been deleted since SQLite was updated; skip
      }
    }

    return memories;
  } finally {
    db.close();
  }
}
