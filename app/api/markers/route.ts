import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  const body = await req.json();
  const { markers, channel } = body;

  await pusherServer.trigger(channel, "markers-update", markers);

  return NextResponse.json({ success: true });
}
