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
