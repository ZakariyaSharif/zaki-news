CREATE TABLE articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  published_at TEXT,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX articles_published ON articles (published_at DESC);
--> statement-breakpoint
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
ALTER TABLE articles ADD COLUMN seo_title TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE articles ADD COLUMN seo_description TEXT NOT NULL DEFAULT '';
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX contacts_created_at ON contacts (created_at);
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
ALTER TABLE schedules ADD COLUMN actual TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN forecast TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN previous TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN importance TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN release_time TEXT NOT NULL DEFAULT '';
ALTER TABLE schedules ADD COLUMN country TEXT NOT NULL DEFAULT '';
