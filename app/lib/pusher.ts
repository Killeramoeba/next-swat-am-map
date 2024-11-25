import PusherClient from "pusher-js";
import Pusher from "pusher";

if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
  throw new Error("NEXT_PUBLIC_PUSHER_APP_KEY is not defined");
}
if (!process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER) {
  throw new Error("NEXT_PUBLIC_PUSHER_APP_CLUSTER is not defined");
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  }
);

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  useTLS: true,
});
