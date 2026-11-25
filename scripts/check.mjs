import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import worker from '../dist/server/index.js';

const storage = new DatabaseSync(':memory:');
storage.exec(readFileSync('drizzle/0000_newsroom.sql','utf8'));
storage.exec(readFileSync('drizzle/0001_article_seo.sql','utf8'));
storage.exec(readFileSync('drizzle/0002_publisher.sql','utf8'));
storage.exec(readFileSync('drizzle/0003_editions.sql','utf8'));
storage.exec(readFileSync('drizzle/0004_calendar_results.sql','utf8'));
storage.exec(readFileSync('drizzle/0005_calendar_country.sql','utf8'));
const DB = { prepare: sql => ({ bind: (...args) => {
  const statement = storage.prepare(sql);
  return { all: async()=>({results:statement.all(...args)}), first: async()=>statement.get(...args), run: async()=>({meta:statement.run(...args)}) };
}})};
const SITE_ORIGIN = 'https://example.test';
const env = { DB, SITE_ORIGIN, NEWSROOM_OWNER_EMAIL:'owner@example.test' };
const headersFor = (id, email) => id ? {
  'oai-authenticated-user-id':id,
  'oai-authenticated-user-email':email || id+'@example.test'
} : {};
const get = (path,id,email) => worker.fetch(new Request(SITE_ORIGIN+path,{headers:headersFor(id,email)}),env);
const post = (path,fields,id='owner',origin=SITE_ORIGIN) => worker.fetch(new Request(SITE_ORIGIN+path,{
  method:'POST',headers:{origin,...headersFor(id)},body:new URLSearchParams(fields)
}),env);
const home = await (await get('/')).text();
assert.match(home,/<html lang="so">/);
assert.match(home,/Zakariya Academy/);
assert.match(home,/YouTube/);
assert.match(home,/Waa maxay Bitcoin/);
assert.match(await (await get('/topic/markets')).text(),/<h1>Suuqyada<\/h1>/);
assert.match(await (await get('/rss.xml')).text(),/<language>so<\/language>/);
assert.equal((await get('/images/bitcoin.webp')).headers.get('content-type'),'image/webp');
assert.match(await (await get('/studio')).text(),/Ku gal ChatGPT/);
assert.match(await (await get('/studio','owner')).text(),/Maqaal cusub/);
assert.equal((await get('/studio','other')).status,403);
assert.equal((await post('/studio',{action:'claim'},'other')).status,403);
assert.equal((await post('/studio',{action:'save'},'owner','https://other.test')).status,403);
storage.prepare("INSERT INTO settings (key,value) VALUES ('owner','original-owner')").run();
assert.equal((await get('/studio','original-owner')).status,200);
assert.match(await (await get('/studio?new=1','owner')).text(),/name="seo_title"/);
assert.match(await (await get('/studio?new=1','owner')).text(),/id="seo-description"/);
const fields={seo_title:'Cinwaan SEO',seo_description:'Sharaxaad SEO',title:'An article',summary:'A story summary.',category:'Markets',author:'Editor',body:'## A heading\n\nAn article body.',theme:'bitcoin',image:'https://example.test/covers/article.webp',image_alt:'Article photo'};
assert.equal((await post('/studio',{...fields,action:'save'})).status,303);
assert.equal((await post('/studio',{...fields,action:'save'})).status,409);
assert.equal((await get('/article/an-article')).status,404);
assert.match(await (await get('/studio?preview=an-article','owner')).text(),/Horudhaca qabyo-qoraalka/);
assert.equal((await post('/studio?edit=an-article',{...fields,action:'publish'})).status,303);
const publishedPage=await (await get('/article/an-article')).text();
assert.match(publishedPage,/<title>Cinwaan SEO<\/title>/);
assert.match(publishedPage,/<meta name="description" content="Sharaxaad SEO">/);
assert.match(publishedPage,/<h1>An article<\/h1>/);
assert.match(publishedPage,/NewsArticle/);
assert.match(await (await get('/studio?status=live&q=article','owner')).text(),/An article/);
assert.doesNotMatch(await (await get('/studio?status=draft','owner')).text(),/An article/);
assert.equal((await post('/studio?edit=an-article',{...fields,seo_title:'',seo_description:'',action:'save'})).status,303);
assert.match(await (await get('/article/an-article')).text(),/<title>An article \| Zaki News<\/title>/);
assert.match(await (await get('/search?q=A%20heading')).text(),/An article/);
assert.match(await (await get('/sitemap.xml')).text(),/article\/an-article/);
assert.match(await (await get('/rss.xml')).text(),/An article/);
assert.equal((await get('/ads.txt')).status,404);
env.ADSENSE_PUBLISHER_ID='ca-pub-1234567890123456';
assert.match(await (await get('/ads.txt')).text(),/pub-1234567890123456/);
assert.doesNotMatch(await (await get('/article/an-article')).text(),/pagead\/js/);
env.ADSENSE_MODE='auto';
assert.match(await (await get('/article/an-article')).text(),/pagead\/js/);
assert.equal((await post('/studio?edit=an-article',{action:'unpublish'})).status,303);
assert.equal((await get('/article/an-article')).status,404);
console.log('Newsroom, publication, search, SEO feeds, and AdSense configuration passed.');
const publicHome = await (await get('/')).text();
assert.match(publicHome,/zakariyaacademy\.com/);
assert.match(publicHome,/zakariya__sharif/);
assert.match(publicHome,/\/coin-logo\/sol\.svg/);
assert.equal((await get('/coin-logo/sol.svg')).headers.get('content-type'),'image/svg+xml');
for (const path of ['/contact','/terms','/disclaimer','/privacy']) assert.equal((await get(path)).status,200);
assert.equal((await get('/studio?panel=profile','other')).status,403);
assert.equal((await post('/studio?panel=profile',{author:'Qoraa',bio:'Taariikh',email:'info@example.test',website:'https://zakariyaacademy.com/',youtube:'https://www.youtube.com/@example'})).status,303);
assert.match(await (await get('/author')).text(),/Taariikh/);
assert.match(await (await get('/studio?new=1','owner')).text(),/name="author" value="Qoraa"/);
const submitted=await post('/contact',{name:'Akhriste',email:'akhriste@example.test',subject:'Codsi sixid',body:'Fadlan dib u eeg.'});
assert.equal(submitted.status,303);
assert.equal(submitted.headers.get('location'),'/contact?sent=1');
assert.doesNotMatch(await (await get('/studio?panel=inbox')).text(),/Codsi sixid/);
assert.match(await (await get('/studio?panel=inbox','owner')).text(),/Codsi sixid/);
assert.equal((await post('/studio?panel=inbox',{delete:'1'})).status,303);
assert.doesNotMatch(await (await get('/studio?panel=inbox','owner')).text(),/Codsi sixid/);
assert.match(await (await get('/?lang=en')).text(),/<html lang="en">/);
assert.match(await (await get('/?lang=en')).text(),/What is Bitcoin/);
assert.match(await (await get('/admin')).text(),/Ku gal ChatGPT/);
assert.equal((await get('/admin?panel=subscribers','other')).status,403);
assert.equal((await post('/newsletter',{email:'reader@example.test',consent:'yes'})).status,200);
assert.equal((await post('/newsletter',{email:'Reader@example.test',consent:'yes'})).status,200);
assert.equal((await dbCount('subscribers')),1);
async function dbCount(table){return storage.prepare('SELECT COUNT(*) AS n FROM '+table).get().n;}
const csv=await get('/admin?panel=subscribers&export=1','owner');
assert.match(csv.headers.get('content-type'),/text\/csv/);
assert.match(await csv.text(),/reader@example.test/);
const tomorrow=new Date(Date.now()+86400000).toISOString().slice(0,10);
assert.equal((await post('/admin?panel=calendar',{kind:'unlocks',title:'Verified event fixture',when:tomorrow,amount:'5000',usd:'9000',supply:'1',source:'https://example.test/source'})).status,303);
assert.match(await (await get('/unlocks?view=week')).text(),/Verified event fixture/);
assert.match(await (await get('/unlocks')).text(),/Verified event fixture/);
assert.match(await (await get('/topic/central-banks')).text(),/Bangiyada Dhexe/);
assert.equal((await get('/social-logo/youtube.svg')).headers.get('content-type'),'image/svg+xml');
assert.equal((await post('/admin?panel=sections',{newsletter:'on',calendar:'on'})).status,303);
assert.equal((await get('/unlocks')).status,404);
assert.doesNotMatch(await (await get('/')).text(),/data-feed="prices"/);
assert.equal((await post('/admin?new=1',{...fields,title:'English edition example',language:'en',action:'publish'})).status,303);
assert.match(await (await get('/article/english-edition-example')).text(),/<html lang="en">/);
assert.match(await (await get('/?lang=en')).text(),/English edition example/);
assert.doesNotMatch(await (await get('/')).text(),/English edition example/);
storage.prepare("DELETE FROM settings WHERE key='sections'").run();
for (const key of ['debt','halving','liquidations']){
  const view=await get('/'+key+'?lang=en');
  const markup=await view.text();
  assert.equal(view.status,200);
  assert.match(markup,new RegExp('data-terminal="'+key+'"'));
  assert.match(markup,/terminal-rail/);
  assert.match(markup,/terminal-client\.js/);
}
const originalFetch=globalThis.fetch;
try {
  globalThis.fetch=async req=>{
    const url=String(req);
    if(url.includes('mempool.space')) return Response.json([{height:976322,timestamp:Math.floor(Date.now()/1000),id:'a'.repeat(64)}]);
    if(url.includes('BTC-USD'))return Response.json({last:64000});
    throw Error('Offline Treasury fixture');
  };
  const debt=await (await get('/data/debt')).json();
  assert.ok(debt.history.length>25);
  assert.ok(debt.spending.value>0&&debt.snapshot);
  const halving=await (await get('/data/halving')).json();
  assert.equal(halving.blocks[0].height,976322);
  assert.equal(halving.next,1050000);
  assert.equal(halving.price,64000);
} finally {
  globalThis.fetch=originalFetch;
}
for (const path of ['/','/?lang=en']){
  const markup=await (await get(path)).text();
  assert.equal([...markup.matchAll(/action="\/newsletter"/g)].length,1);
  assert.equal([...markup.matchAll(/class="wrap live-ticker"/g)].length,1);
  assert.doesNotMatch(markup,/class="coin-strip"/);
  assert.match(markup,/class="ticker-coin" href="\/topic\/bnb/);
}
assert.equal([...(await (await get('/about')).text()).matchAll(/action="\/newsletter"/g)].length,1);
const liquidationPage=await (await get('/liquidations?lang=en')).text();
assert.match(liquidationPage,/data-window="1440"/);
assert.match(liquidationPage,/data-window="720"/);
const liquidationScript=await (await get('/terminal-client.js')).text();
assert.match(liquidationScript,/"PEPE":\s*"\/coin-logo\/pepe.png"/);
assert.match(liquidationScript,/"ETH":\s*"\/coin-logo\/eth.svg"/);
assert.equal((await get('/coin-logo/pepe.png')).headers.get('content-type'),'image/png');
const originalDate=Date;
try {
  globalThis.Date=class extends originalDate {
    constructor(...args){super(...(args.length?args:['2026-11-17T20:00:00Z']));}
    static now(){return new originalDate('2026-11-17T20:00:00Z').getTime();}
  };
  const unlocks=await (await get('/unlocks?lang=en&view=week')).text();
  assert.match(unlocks,/KAITO/);
  assert.match(unlocks,/Circulating supply/);
  assert.doesNotMatch(unlocks,/Walrus/);
  assert.match(unlocks,/Time TBC/);
  assert.match(unlocks,/Unlock value over the next 30 days/);
  assert.doesNotMatch(unlocks,/ USDT/);
  const calendar=await (await get('/calendar?lang=en&view=week')).text();
  assert.match(calendar,/FOMC meeting minutes/);
  assert.match(calendar,/data-last-date="2026-11-24"/);
  assert.doesNotMatch(calendar,/GDP, second estimate/);
} finally {
  globalThis.Date=originalDate;
}
const visualCalendar=await (await get('/calendar?lang=en')).text();
assert.match(visualCalendar,/class="calendar-week"/);
assert.match(visualCalendar,/data-agency-filter="fed"/);
assert.match(visualCalendar,/class="calendar-release"/);
const quickLiquidations=await (await get('/liquidations?lang=en')).text();
assert.match(quickLiquidations,/data-window="60" aria-pressed="true"/);
assert.match(quickLiquidations,/id="liquidation-seed"/);
const fetchBeforeHistory=globalThis.fetch;
try {
  globalThis.fetch=async url=>{
    if(url.includes('instruments'))return Response.json({data:[{instId:'BTC-USDT-SWAP',ctVal:'0.01',ctMult:'1',ctValCcy:'BTC',ctType:'linear'}]});
    if(url.includes('BTC-USDT'))return Response.json({code:'0',data:[{instId:'BTC-USDT-SWAP',details:[{ts:String(Date.now()),sz:'2',bkPx:'60000',posSide:'long'}]}]});
    throw Error('Unavailable fixture');
  };
  const history=await(await get('/data/liquidations')).json();
  assert.deepEqual(history.available,['BTC']);
  assert.ok(history.events.some(e=>e[1]==='BTC'&&e[2]==='long'&&e[4]===1200));
}finally{globalThis.fetch=fetchBeforeHistory;}
const rangePage=await (await get('/liquidations?lang=en&range=24h')).text();
assert.match(rangePage,/data-window="1440" aria-pressed="true"/);
assert.match(rangePage,/data-window="60" aria-pressed="false"/);
const invalidRangePage=await (await get('/liquidations?range=invalid')).text();
assert.match(invalidRangePage,/data-window="60" aria-pressed="true"/);
const actualDate=Date;
try{
  globalThis.Date=class extends actualDate{
    constructor(...args){super(...(args.length?args:['2026-11-17T20:00:00Z']));}
    static now(){return new actualDate('2026-11-17T20:00:00Z').getTime();}
  };
  const todayCalendar=await(await get('/calendar?lang=en&view=today')).text();
  assert.match(todayCalendar,/Actual/);
  assert.match(todayCalendar,/Forecast/);
  assert.match(todayCalendar,/Previous/);
  assert.match(todayCalendar,/Industrial production/);
  assert.match(todayCalendar,/−0\.4%/);
  assert.match(todayCalendar,/data-impact="medium"/);
  assert.doesNotMatch(todayCalendar,/FOMC meeting minutes/);
  const todayUnlocks=await(await get('/unlocks?lang=en&view=today')).text();
  assert.match(todayUnlocks,/SOLV/);
  assert.match(todayUnlocks,/coin-logo\/solv.png/);
  assert.match(todayUnlocks,/>Toolz<\/a>/);
  assert.match(todayUnlocks,/>Today</);
  assert.doesNotMatch(todayUnlocks,/Kaito/);
}finally{globalThis.Date=actualDate;}
for(const path of ['/','/?lang=en']){
  const homeWithVideo=await(await get(path)).text();
  assert.match(homeWithVideo,/https:\/\/www.youtube-nocookie.com\/embed\/3L81B4MQC4k/);
  assert.match(homeWithVideo,/https:\/\/youtu.be\/3L81B4MQC4k/);
}
assert.doesNotMatch(await(await get('/latest')).text(),/ycoEPHADn28/);
for(const path of ['/latest','/latest?lang=en']){
  const listing=await(await get(path)).text();
  const thumbnailFiles=[...listing.matchAll(/<img src="(\/images\/[^"]+)" alt=/g)].map(x=>x[1]);
  assert.ok(thumbnailFiles.includes('/images/regulation-capitol.webp'));
  assert.equal(new Set(thumbnailFiles).size,thumbnailFiles.length);
}
assert.equal((await post('/admin?new=1',{...fields,title:'Another English article',language:'en',action:'publish'})).status,409);
assert.equal((await post('/admin?new=1',{...fields,title:'An article reusing the stock image',image:'',image_alt:'',action:'publish'})).status,409);
assert.match(await(await get('/topic/forex?lang=en')).text(),/EUR\/USD/);
assert.match(await(await get('/topic/stocks?lang=en')).text(),/\/embed\/stocks/);
assert.match(await(await get('/embed/stocks?theme=dark')).text(),/NASDAQ:NVDA/);
assert.match(await(await get('/sharia?lang=en')).text(),/Mashbooh/);
assert.match(await(await get('/charts?lang=en')).text(),/data-range="1w"/);
assert.match(await(await get('/charts?lang=en')).text(),/data-chart-mode="candles"/);
const customCalendar=await(await get('/calendar?lang=en&view=date&date=2026-11-17')).text();
assert.match(customCalendar,/data-first-date="2026-11-17"/);
assert.match(customCalendar,/data-last-date="2026-11-18"/);
assert.match(customCalendar,/United States/);
assert.match(customCalendar,/Next week/);
assert.match(customCalendar,/Yesterday/);
assert.match(customCalendar,/Custom date/);
assert.doesNotMatch(customCalendar,/FOMC meeting minutes/);
assert.equal((await post('/admin?panel=calendar',{kind:'calendar',title:'UK event fixture',when:'2026-11-17',country:'gb',source:'https://example.test/uk'})).status,303);
assert.match(await(await get('/calendar?lang=en&view=date&date=2026-11-17')).text(),/United Kingdom/);
assert.equal((await get('/data/chart?range=unused')).status,404);
const candleWorkbench=await(await get('/charts?lang=en')).text();
for(const interval of ['15m','1h','4h','1d','1w'])assert.match(candleWorkbench,new RegExp('data-range="'+interval+'"'));
for(const indicator of ['volume','ema','sma','rsi','macd'])assert.match(candleWorkbench,new RegExp('data-chart-indicator="'+indicator+'"'));
const coinScreen=await(await get('/sharia?lang=en')).text();
assert.match(coinScreen,/Bitcoin/);
assert.match(coinScreen,/DeFi protocol tokens under Haram/);
assert.match(coinScreen,/Shiba Inu/);
const etfEn=await get('/etfs?lang=en');
assert.equal(etfEn.status,301);
assert.equal(etfEn.headers.get('location'),'/etf-flows?lang=en');
const etfSo=await get('/etfs');
assert.equal(etfSo.status,301);
assert.equal(etfSo.headers.get('location'),'/etf-flows');
assert.match(await(await get('/embed/stocks?view=etfs')).text(),/NASDAQ:IBIT/);
assert.match(await(await get('/embed/stocks?view=etfs')).text(),/CBOE:FBTC/);
assert.match(await(await get('/embed/stocks?view=etfs')).text(),/NASDAQ:ETHA/);
assert.match(await(await get('/?lang=en')).text(),/href="\/etf-flows\?lang=en"[^>]*>ETFs</);
assert.match(await(await get('/')).text(),/href="\/etf-flows"[^>]*>ETF-yada</);
const etfWatchEn=await(await get('/etf-watchlist?lang=en')).text();
assert.match(etfWatchEn,/<h1>ETF watchlist<\/h1>/);
assert.match(etfWatchEn,/embed\/stocks\?view=etfs/);
assert.match(etfWatchEn,/etf-watchlist-widget/);
assert.match(etfWatchEn,/Liiska ETF|ETF watchlist/);
const etfWatchSo=await(await get('/etf-watchlist')).text();
assert.match(etfWatchSo,/<h1>Liiska ETF<\/h1>/);
assert.equal((await get('/etf-watchlist')).status,200);
const toolsEn=await(await get('/tools?lang=en')).text();
assert.match(toolsEn,/href="\/etf-watchlist\?lang=en"[^>]*>ETF watchlist</);
assert.match(toolsEn,/Explore markets/);
const toolsSo=await(await get('/tools')).text();
assert.match(toolsSo,/href="\/etf-watchlist"[^>]*>Liiska ETF</);
const homeEn=await(await get('/?lang=en')).text();
assert.match(homeEn,/href="\/etf-watchlist\?lang=en"[^>]*>ETF watchlist</);
assert.match(homeEn,/footer-col[\s\S]*href="\/etf-watchlist\?lang=en"[^>]*>ETF watchlist</);
const homeSo=await(await get('/')).text();
assert.match(homeSo,/href="\/etf-watchlist"[^>]*>Liiska ETF</);
assert.match(homeSo,/footer-col[\s\S]*href="\/etf-watchlist"[^>]*>Liiska ETF</);
const footerEn=homeEn.split('<footer')[1].split('</footer>')[0];
const footerSo=homeSo.split('<footer')[1].split('</footer>')[0];
assert.doesNotMatch(footerEn,/brand-logo\/bubble\.png/);
assert.doesNotMatch(footerEn,/brand-logo\/academy\.png/);
assert.doesNotMatch(footerSo,/brand-logo\/bubble\.png/);
assert.doesNotMatch(footerSo,/brand-logo\/academy\.png/);
assert.match(footerEn,/href="https:\/\/zakibubble\.zakariyaacademy\.com"[^>]*>\s*<span>Crypto bubbles<\/span>\s*<svg class="ed-ext-arrow"/);
assert.match(footerSo,/href="https:\/\/zakibubble\.zakariyaacademy\.com"[^>]*>\s*<span>Crypto bubble<\/span>\s*<svg class="ed-ext-arrow"/);
assert.match(footerEn,/<span>Zakariya Academy courses<\/span>\s*<svg class="ed-ext-arrow"/);
assert.match(footerSo,/<span>Koorsada Zakariya Academy<\/span>\s*<svg class="ed-ext-arrow"/);
assert.match(await(await get('/fear-greed?lang=en')).text(),/data-sentiment-history/);
const candleFetch=globalThis.fetch;
try{
  globalThis.fetch=async()=>Response.json(Array.from({length:12},(_,i)=>[i*3600,10+i,13+i,11+i,12+i,2]).reverse());
  const aggregated=await(await get('/data/chart?interval=4h')).json();
  assert.equal(aggregated.interval,14400);
  assert.deepEqual(aggregated.candles[0],[0,10,16,11,15,8]);
}finally{globalThis.fetch=candleFetch;}
const expandedScreen=await(await get('/sharia?lang=en')).text();
for(const name of ['Bitcoin Cash','Chainlink','Hedera','PancakeSwap','Lido DAO','Pudgy Penguins','Fartcoin'])assert.match(expandedScreen,new RegExp(name));
for(const name of ['Search a coin','No coin found','data-sharia-query','Aptos','Injective','Official Trump'])assert.match(expandedScreen,new RegExp(name));
assert.match(expandedScreen,/data-sharia-empty/);
assert.match(expandedScreen,/data-coin-ticker/);
assert.match(expandedScreen,/addEventListener\("input",apply\)/);
assert.match(await(await get('/style.css')).text(),/\.sharia-coin-list li\[hidden\]\{display:none\}/);
for(const name of ['Lido Staked Ether','Derive','Venus','Rain','Jito Staked SOL'])assert.match(expandedScreen,new RegExp(name));
for(const name of ['FUNToken','Playnance','Jackpotter','TG.Casino'])assert.match(expandedScreen,new RegExp(name));
const dailyFetch=globalThis.fetch;
try{
  globalThis.fetch=async url=>{
    if(url.includes('&start='))throw Error('Older history unavailable');
    return Response.json(Array.from({length:282},(_,i)=>[(4+i)*86400,10,13,11,12,2]).reverse());
  };
  const weekly=await(await get('/data/chart?coin=eth&interval=1w')).json();
  assert.equal(weekly.interval,604800);
  assert.ok(weekly.candles.length>500);
  assert.equal(weekly.source,'Kraken');
  assert.ok(weekly.candles[0][0]<Date.UTC(2016,0,1)/1000);
  assert.ok(weekly.candles.every((bar,i)=>bar.length===6&&(!i||bar[0]>weekly.candles[i-1][0])));
}finally{globalThis.fetch=dailyFetch;}

storage.prepare("DELETE FROM settings WHERE key IN ('publisher','sections')").run();
const brandedHome=await(await get('/?lang=en')).text();
for(const brand of ['youtube','x','instagram','facebook','tiktok','telegram']){
 const path='/social-logo/'+brand+'.svg';
 assert.ok(brandedHome.includes(path),brand);
 const asset=await get(path);
 assert.equal(asset.status,200);
 assert.match(await asset.text(),/<path\b/);
}
assert.equal((await get('/images/academy-mark.webp')).headers.get('content-type'),'image/webp');
for(const [path,expected] of [
 ['/markets?asset=bonds&lang=en','Government'],['/commodities?lang=en','Commodities'],
 ['/etf-flows?lang=en','Net flow'],['/earnings-calendar?lang=en&date=2026-11-18','EPS'],['/ipo-calendar?lang=en&month=2026-11','IPO activity'],
 ['/crypto-bubbles?lang=en','Crypto bubbles'],['/profit-calculator?lang=en','Profit calculator'],
 ['/topic/education?lang=en','Ethereum Classic'],['/calendar?lang=en','High only'],['/liquidations?lang=en','Liquidation price heatmap'],
 ['/highlights?lang=en','Most viewed'],['/charts?lang=en','MACD']
]){
 const res=await get(path);
 assert.equal(res.status,200,path);
 const markup=await res.text();
 assert.ok(markup.toLowerCase().includes((path.includes('asset=bonds')?'Bonds':expected).toLowerCase()),path);
}
console.log('Bilingual market routes, calendar controls, education and footer brands passed.');
const toolsBoardSo=await (await get('/tools')).text();
assert.match(toolsBoardSo,/Qalabka suuqa/);
assert.match(toolsBoardSo,/Crypto bubble/);
assert.match(toolsBoardSo,/Sahami suuqyada/);
assert.match(toolsBoardSo,/La soco dhaqdhaqaaqa/);
assert.match(toolsBoardSo,/Horay u qorshee/);
assert.match(toolsBoardSo,/Raadi qalab/);
assert.doesNotMatch(toolsBoardSo,/Goobooyinka crypto/);
const toolsBoardEn=await (await get('/tools?lang=en')).text();
assert.match(toolsBoardEn,/Market tools/);
assert.match(toolsBoardEn,/Find a tool/);
assert.match(toolsBoardEn,/Explore markets/);
assert.match(toolsBoardEn,/Track activity/);
assert.match(toolsBoardEn,/Plan ahead/);
assert.match(toolsBoardEn,/Crypto bubbles/);
assert.match(toolsBoardEn,/Track daily fund inflows and outflows/);
assert.match(await (await get('/crypto-bubbles')).text(),/Crypto bubble/);
assert.match(await (await get('/')).text(),/Crypto bubble/);
assert.match(await (await get('/sitemap.xml')).text(),/\/tools</);
console.log('Market tools board, Crypto bubble label, and tools route passed.');
for(const lang of ['so','en']){
 const page=await(await get('/etf-flows?asset=HYPE&lang='+lang)).text();
 for(const file of ['btc.svg','eth.svg','sol.svg','hype.png','zec.svg'])assert.ok(page.includes('/coin-logo/'+file),file);
 const guide=await(await get('/topic/education?lang='+lang)).text();
 for(const id of ['btc','eth','sol','blocks','layers']){
  assert.ok(guide.includes('/images/learn-'+id+'.webp'));
  assert.equal((await get('/images/learn-'+id+'.webp')).status,200);
 }
}
for(const page of ['/markets?asset=options&underlying=QQQ','/ipo-calendar?month=2026-11&day=2026-11-18','/markets?asset=futures','/article/what-is-bitcoin?lang=en']){
 assert.equal((await get(page)).status,200,page);
}

assert.match(candleWorkbench,/data-history="max"/);
assert.match(candleWorkbench,/data-chart-map="liquidation-map"/);
const liquidationMaps=await(await get('/liquidations?asset=ETH&range=24h&lang=en')).text();
for(const id of ['liquidation-map','price-heatmap'])assert.ok(liquidationMaps.includes('id="'+id+'"'));
assert.ok(liquidationMaps.includes('data-price-profile'));

const smartMoney=await (await get('/smart-money?lang=en')).text();
assert.match(smartMoney,/Ethereum Smart Money/);
assert.match(smartMoney,/Nansen 24-hour snapshot · November 24, 2026, 09:23 UTC/);
assert.match(smartMoney,/>NKP</);
assert.match(smartMoney,/>TAC</);
assert.match(smartMoney,/>REKT</);
assert.match(smartMoney,/>CFG</);
assert.match(smartMoney,/>HASHAI</);
assert.match(smartMoney,/Top five tokens/);
assert.match(smartMoney,/Top 5 outflows/);
assert.match(smartMoney,/No outflow data in this snapshot/);
assert.match(smartMoney,/class="sm-analysis"/);
assert.match(smartMoney,/>Read the analysis</);
assert.match(smartMoney,/sm-token-link/);
assert.match(smartMoney,/aria-current="page"/);
assert.match(smartMoney,/>Solana</);
assert.match(smartMoney,/>Base</);
assert.doesNotMatch(smartMoney,/NANSEN_API_KEY/);
assert.doesNotMatch(smartMoney,/apikey/i);
const smartMoneySol=await (await get('/smart-money?chain=solana&lang=en')).text();
assert.match(smartMoneySol,/Solana Smart Money/);
assert.match(smartMoneySol,/bundled snapshot covers Ethereum only/);
const smartMoneySo=await (await get('/smart-money')).text();
assert.match(smartMoneySo,/Akhri falanqaynta/);
assert.match(smartMoneySo,/24 Nofeembar 2026, 09:23 UTC/);
console.log('Smart Money snapshot fallback, chain tabs, and analysis button passed.');

const resourcesEn=await (await get('/resources?lang=en')).text();
assert.match(resourcesEn,/Hoopay Wallet/);
assert.match(resourcesEn,/hoopaywallet.com\/register\?ref=iwAD0jOo/);
assert.match(resourcesEn,/rel="sponsored noopener noreferrer"/);
assert.match(resourcesEn,/target="_blank"/);
assert.match(resourcesEn,/\/brand-logo\/hoopay.png/);
assert.doesNotMatch(resourcesEn,/dollar wallet and payments app/);
assert.match(resourcesEn,/>hoopaywallet.com</);
assert.match(resourcesEn,/\/brand-logo\/nordvpn.png/);
assert.equal((await get('/brand-logo/hoopay.png')).status,200);
assert.equal((await get('/brand-logo/nordvpn.png')).status,200);
const resourcesSo=await (await get('/resources')).text();
assert.match(resourcesSo,/Hoopay Wallet/);
assert.doesNotMatch(resourcesSo,/Boorso dollar ah iyo abka lacag-bixinta/);
assert.match(resourcesSo,/>hoopaywallet.com</);
assert.match(resourcesEn,/<strong>Substack<\/strong>/);
assert.match(resourcesEn,/substack.com\/@zakariyasharif/);
assert.match(resourcesEn,/\/brand-logo\/substack.png/);
assert.match(resourcesEn,/<strong>Discord<\/strong>/);
assert.match(resourcesEn,/discord.gg\/g2kBMMA9TC/);
assert.match(resourcesEn,/\/brand-logo\/discord.png/);
assert.match(resourcesSo,/<strong>Substack<\/strong>/);
assert.match(resourcesSo,/<strong>Discord<\/strong>/);
assert.match(resourcesSo,/substack.com\/@zakariyasharif/);
assert.match(resourcesSo,/discord.gg\/g2kBMMA9TC/);
assert.equal((await get('/brand-logo/substack.png')).status,200);
assert.equal((await get('/brand-logo/discord.png')).status,200);
assert.equal((await get('/brand-logo/nordvpn.png')).headers.get('content-type'),'image/png');
assert.match(resourcesEn,/Zakariya Academy and community/);
assert.match(resourcesSo,/Zakariya Academy iyo bulshada/);
const pceEn=await (await get('/article/bitcoin-falls-57209-after-pce?lang=en')).text();
assert.match(pceEn,/Bitcoin falls to \$57,209 after hot US inflation data, then rebounds toward \$60,000/);
assert.match(pceEn,/Not financial advice/);
assert.match(pceEn,/\/images\/btc-pce-25\.webp/);
const pceSo=await (await get('/article/bitcoin-hoos-57209-kadib-pce')).text();
assert.match(pceSo,/Bitcoin oo hoos ugu dhacay \$57,209 kadib sicir bararka Maraykanka/);
assert.match(await (await get('/?lang=en')).text(),/Bitcoin falls to \$57,209/);
assert.match(await (await get('/')).text(),/Bitcoin oo hoos ugu dhacay \$57,209/);
assert.equal((await get('/images/btc-pce-25.webp')).headers.get('content-type'),'image/webp');
console.log('Hoopay Wallet resource card, NordVPN logo, community links, and 25 Nov article passed.');
