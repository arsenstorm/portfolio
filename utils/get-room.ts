import { init } from "@instantdb/react";

type Schema = {
  user: { name: string };
}

// Provide a room schema to get typings for presence!
type RoomSchema = {
  chat: {
    presence: { name: string };
  };
}

// db will export all the presence hooks you need!
const db = init<Schema, RoomSchema>({ appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID! });

// Specifying a room type and room id gives you the power to
// restrict sharing to a specific room. However you can also just use
// `db.room()` to share presence and topics to an Instant generated default room
export const room = db.room('chat', 'everyone');