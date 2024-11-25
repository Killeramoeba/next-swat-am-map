import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  const body = await req.json();

  await pusherServer.trigger("markers-channel", "markers-update", body);

  return NextResponse.json({ success: true });
}
