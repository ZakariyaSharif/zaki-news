ALTER TABLE schedules ADD COLUMN actual TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN forecast TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN previous TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN importance TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN release_time TEXT NOT NULL DEFAULT '';
