ALTER TABLE articles ADD COLUMN language TEXT NOT NULL DEFAULT 'so';
--> statement-breakpoint
CREATE TABLE subscribers (email TEXT PRIMARY KEY COLLATE NOCASE, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE schedules (
 id INTEGER PRIMARY KEY, kind TEXT NOT NULL, title TEXT NOT NULL, event_date TEXT NOT NULL,
 amount REAL, usd REAL, supply REAL, source TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX schedules_date ON schedules(kind,event_date);
