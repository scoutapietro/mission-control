import { NextResponse } from "next/server";
import { readJobs } from "@/lib/openclaw/read-jobs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await readJobs();
    return NextResponse.json(jobs);
  } catch (e) {
    console.error("Failed to read jobs:", e);
    return NextResponse.json({ error: "Failed to read jobs" }, { status: 500 });
  }
}
