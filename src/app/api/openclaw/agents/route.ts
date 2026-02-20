import { NextResponse } from "next/server";
import { readAgents } from "@/lib/openclaw/read-agents";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const agents = await readAgents();
    return NextResponse.json(agents);
  } catch (e) {
    console.error("Failed to read agents:", e);
    return NextResponse.json({ error: "Failed to read agents" }, { status: 500 });
  }
}
