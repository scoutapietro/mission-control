import { NextResponse } from "next/server";
import { readMemories } from "@/lib/openclaw/read-memories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const memories = await readMemories();
    return NextResponse.json(memories);
  } catch (e) {
    console.error("Failed to read memories:", e);
    return NextResponse.json({ error: "Failed to read memories" }, { status: 500 });
  }
}
