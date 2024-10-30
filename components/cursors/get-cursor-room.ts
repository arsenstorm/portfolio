import type { Color } from "@/components/cursors/colours";
import { init } from "@instantdb/react";

type Schema = {
	user: { location: string };
};

type RoomSchema = {
	chat: {
		presence: {
			location: string;
			color: Color;
			idle: boolean;
		};
	};
};

// db will export all the presence hooks you need!
const db = init<Schema, RoomSchema>({
	appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID!,
	devtool: false,
});

// Specifying a room type and room id gives you the power to
// restrict sharing to a specific room. However you can also just use
// `db.room()` to share presence and topics to an Instant generated default room
export const room = db.room("chat", "everyone");
