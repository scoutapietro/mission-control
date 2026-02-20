import { basename } from "path";
import type { Memory } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TOPIC_RE = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

function humanize(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function categorize(stem: string): string {
  if (DATE_RE.test(stem)) return "daily-log";
  if (DATE_TOPIC_RE.test(stem)) return "session-note";
  return "reference";
}

function extractTitle(content: string, stem: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/^Memory:\s*/i, "").trim();
  return humanize(stem);
}

function extractTags(content: string): string[] {
  const tags: string[] = [];
  const headings = content.matchAll(/^##\s+(.+)$/gm);
  for (const m of headings) {
    const tag = m[1].trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !tags.includes(tag)) tags.push(tag);
    if (tags.length >= 5) break;
  }
  return tags;
}

function extractBody(content: string): string {
  // Strip headings and leading whitespace, take first 500 chars of body text
  const lines = content.split("\n");
  const body: string[] = [];
  for (const line of lines) {
    if (line.startsWith("#")) continue;
    if (line.startsWith("---")) continue;
    const trimmed = line.trim();
    if (trimmed) body.push(trimmed);
  }
  return body.join(" ").slice(0, 500);
}

export function parseMemory(
  filePath: string,
  content: string,
  mtime: number,
): Memory {
  const stem = basename(filePath, ".md");
  return {
    _id: filePath,
    title: extractTitle(content, stem),
    content: extractBody(content),
    category: categorize(stem),
    tags: extractTags(content),
    createdAt: mtime,
  };
}
