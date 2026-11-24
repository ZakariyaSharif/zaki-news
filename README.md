# Zaki News self-hosting export

Source revision 698b4db87195b1709ccbc192f1d5218186d6939b, exported November 24, 2026. This copy adds an independent runtime and deployment configuration. The existing public deployment is separate.

## Run locally

Install Node.js 24 with npm, Python 3, and Bash. On Windows use WSL. From the extracted project root:

```sh
npm ci
npm run dev
```

Visit http://localhost:3000. The application builds into dist/server/index.js. Local SQLite migrations run automatically. SQLite persists in .local/news.sqlite. Use npm run build followed by npm start after source edits. The application has zero runtime npm dependencies.

## Structure and routes

The app is server-rendered JavaScript ES modules using the Fetch API, browser JavaScript and CSS. scripts/build.sh assembles assets and components into a Worker bundle. worker/index.js dispatches requests, renders articles, topics, 404, robots.txt, sitemap.xml and rss.xml. worker/editions.js and worker/terminal.js contain shared bilingual navigation. worker/publisher.js and the studio code implement the newsroom. worker/markets.js implements the market endpoints including /data/prices, /data/unlock-prices, /data/fear-greed, and /data/chart. /bitcoin-panel is handled in worker/index.js. worker/liquidation-history.js, worker/terminal-client.js and worker/market-client.js implement additional exchange data, charts, caching and refresh behavior.

Open / for Somali or /en for English. Check /smart-money, /etf-flows, /charts and /liquidations. The original project has no scheduled cron or always-on collector. Market data refreshes on requests, browser polling, and exchange streams. Some providers have subscription, availability or regional restrictions. Historical snapshots and the dated Smart Money list remain bundled exactly as in the source. External chart widgets, video embeds, Zaki Bubble and data feeds still use their respective hosts.

## Content and images

data/bundled-articles.json contains all 53 built-in entries (including translations and sample articles) as evaluated by the site. Their editable sources are under worker/, including stories.js, news-nov21.js, education-stories.js and editions.js. Keep editing the source modules for built-in stories. The JSON is a portable export. New newsroom articles are written to the articles table. At export time the source D1 articles and schedules tables each returned zero rows, including drafts. Their JSON exports are included. Four transient market-highlight cache entries regenerate from providers. Subscriber addresses, private inbox messages and credentials are excluded from this code handoff. All tracked project images are included. FILES.txt lists their paths. Some editorial assets also reference external URLs recorded in article and component source.

Re-export built-in articles and local SQLite articles, after starting the site at least once:

```sh
npm run build
node scripts/export-articles.mjs --local
```

To export articles from your own hosted D1 database (including drafts), supply the D1 variables below:

```sh
node --env-file-if-exists=.env.local scripts/export-hosted-articles.mjs
```

## Variables

| Name | Purpose |
|---|---|
| SITE_ORIGIN | Public HTTPS origin for canonical URLs, RSS, sitemap and newsroom origin validation. Set it to the exact domain you open, without a trailing slash. Locally omit to use localhost. |
| D1_ACCOUNT_ID | Cloudflare account that owns your new production D1 database. |
| D1_DATABASE_ID | ID of your new production D1 database. |
| D1_API_TOKEN | Server-side Cloudflare API token with D1 read/write access to the intended account. |
| NEWSROOM_OWNER_EMAIL | Newsroom login name and authorized editor email. |
| NEWSROOM_ADMIN_PASSWORD | Strong unique password for the self-hosted newsroom. |
| COINGLASS_API_KEY | Optional CoinGlass data access, subject to plan entitlement. |
| ADSENSE_MODE | Optional ad mode used by the existing application. |
| ADSENSE_PUBLISHER_ID | Optional AdSense publisher identifier. |
| PORT | Optional local port. |
| VERCEL_URL | Host supplied automatically by Vercel when SITE_ORIGIN is absent. |
| DB | Original runtime database binding. The included adapters supply it automatically. |

CryptoQuant and Nansen keys are not consumed by this source revision. Set local variables in .env.local, or in Vercel Project Settings under Environment Variables. Keep credentials and unredacted article exports containing drafts out of public repositories. The original ChatGPT authentication is replaced by HTTP Basic authentication on the self-hosted newsroom. Incoming identity headers are stripped. Configure both newsroom variables, then open /admin over HTTPS (localhost for development). Without the two variables the admin is disabled.

## Deploy to your GitHub and Vercel

1. Create an empty repository in your GitHub account. In the extracted project directory:

   ```sh
   git init -b main
   git add .
   git commit -m "Import Zaki News"
   git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
   git push -u origin main
   ```

2. In Cloudflare, create a D1 database named zaki-news. Initialize the new empty database once from the project root:

   ```sh
   npx wrangler login
   npx wrangler d1 execute zaki-news --remote --file=data/schema.sql
   ```

   Use the Cloudflare account that owns the database. The schema includes all six original migrations. For an existing database apply only outstanding migrations. The bundled articles are available immediately and do not need to be inserted into D1.
3. In Vercel, import the GitHub repository. Use the repository root, framework preset Other and Node.js 24.x. vercel.json sets the build command, public output directory and rewrite to the Node function. The build uses Bash and Python 3. Configure the three D1 variables in Vercel. Configure the newsroom variables if you want admin access. Add optional provider variables as needed.
4. Deploy, assign your domain and set SITE_ORIGIN to its exact HTTPS origin. Redeploy after changing environment variables. For previews, omit the production origin or configure a matching preview origin.
5. Check /, /en, /article/ethereum-smart-money-nov24, /smart-money, /etf-flows, /data/prices, /robots.txt, /sitemap.xml and /rss.xml. Confirm /admin challenges for login and a draft survives a redeploy. The portable adapter uses D1 over HTTPS. Public sources may return delayed data or an unavailable response depending on network location.

## Inventory

FILES.txt is the full sorted list of files inside the zip. The original source includes .openai/hosting.json as project metadata. Vercel does not use it to connect to the original database. The build output is also included for inspection and can be regenerated.
