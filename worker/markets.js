const debtSnapshot = {"date": "2026-11-13", "total": 40616678827092.07, "public": 32825322014326.67, "internal": 7791356812765.4, "snapshot": true};
const blsSnapshot = [{"date": "2026-10-02", "time": "08:30", "title": "Employment Situation"}, {"date": "2026-10-14", "time": "08:30", "title": "Real Earnings"}, {"date": "2026-10-14", "time": "08:30", "title": "Consumer Price Index"}, {"date": "2026-10-15", "time": "08:30", "title": "Producer Price Index"}, {"date": "2026-10-16", "time": "08:30", "title": "U.S. Import and Export Price Indexes"}, {"date": "2026-10-20", "time": "10:00", "title": "State Employment and Unemployment (Monthly)"}, {"date": "2026-10-21", "time": "10:00", "title": "Usual Weekly Earnings of Wage and Salary Workers"}, {"date": "2026-10-28", "time": "10:00", "title": "Quarterly Data Series on Business Employment Dynamics"}, {"date": "2026-10-28", "time": "10:00", "title": "Metropolitan Area Employment and Unemployment (Monthly)"}, {"date": "2026-10-29", "time": "10:00", "title": "Consumer Expenditures"}, {"date": "2026-10-30", "time": "08:30", "title": "Employment Cost Index"}, {"date": "2026-11-03", "time": "10:00", "title": "Job Openings and Labor Turnover Survey"}, {"date": "2026-11-05", "time": "08:30", "title": "Productivity and Costs"}, {"date": "2026-11-06", "time": "08:30", "title": "Employment Situation"}, {"date": "2026-11-10", "time": "08:30", "title": "Real Earnings"}, {"date": "2026-11-10", "time": "08:30", "title": "Consumer Price Index"}, {"date": "2026-11-13", "time": "08:30", "title": "Producer Price Index"}, {"date": "2026-11-17", "time": "08:30", "title": "U.S. Import and Export Price Indexes"}, {"date": "2026-11-18", "time": "10:00", "title": "Employer-Reported Workplace Injuries and Illnesses (Annual)"}, {"date": "2026-11-20", "time": "10:00", "title": "State Employment and Unemployment (Monthly)"}, {"date": "2026-12-01", "time": "10:00", "title": "Job Openings and Labor Turnover Survey"}, {"date": "2026-12-02", "time": "10:00", "title": "Metropolitan Area Employment and Unemployment (Monthly)"}, {"date": "2026-12-02", "time": "10:00", "title": "County Employment and Wages"}, {"date": "2026-12-04", "time": "08:30", "title": "Employment Situation"}, {"date": "2026-12-08", "time": "08:30", "title": "Productivity and Costs"}, {"date": "2026-12-10", "time": "08:30", "title": "Consumer Price Index"}, {"date": "2026-12-10", "time": "08:30", "title": "Real Earnings"}, {"date": "2026-12-15", "time": "08:30", "title": "Producer Price Index"}, {"date": "2026-12-16", "time": "10:00", "title": "Census of Fatal Occupational Injuries"}, {"date": "2026-12-16", "time": "10:00", "title": "Employer Costs for Employee Compensation"}, {"date": "2026-12-17", "time": "08:30", "title": "U.S. Import and Export Price Indexes"}, {"date": "2026-12-18", "time": "10:00", "title": "Work Experience of the Population (Annual)"}, {"date": "2026-12-18", "time": "10:00", "title": "State Employment and Unemployment (Monthly)"}, {"date": "2026-12-30", "time": "10:00", "title": "Metropolitan Area Employment and Unemployment (Monthly)"}];
const spendingApi='https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?filter=classification_desc:eq:Year-to-Date&sort=-record_date&page%5Bsize%5D=1';
const spendingSnapshot={value:773003666480.36,date:'2026-10-31',year:2027,snapshot:true};
const priceApi='https://api.exchange.coinbase.com';
const debtApi='https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page%5Bsize%5D=1';
const marketCache = new Map();
async function marketData(key,ttl,load){
  const now=Date.now();
  let entry=marketCache.get(key);
  if(!entry||entry.expires<=now){
    entry={expires:now+ttl*1000,value:load()};
    marketCache.set(key,entry);
  }
  try{
    const data=await entry.value;
    return Response.json(data,{headers:{'cache-control':'public, max-age='+Math.max(0,Math.ceil((entry.expires-Date.now())/1000))}});
  }catch{
    if(marketCache.get(key)===entry) marketCache.delete(key);
    return Response.json({error:'unavailable'},{status:503,headers:{'cache-control':'no-store'}});
  }
}
async function remote(url,type='json'){
  const response=await fetch(url,{signal:AbortSignal.timeout(5500),headers:{accept:type==='json'?'application/json':'text/plain'}});
  if(!response.ok) throw Error('Feed unavailable');
  return type==='json'?response.json():response.text();
}
const usd = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
function bucketCandles(rows,sourceInterval,interval){
  if(interval===sourceInterval)return rows;
  const offset=interval===604800?345600:0;
  const buckets=new Map();
  for(const [time,low,high,open,close,volume] of rows){
    const start=Math.floor((time-offset)/interval)*interval+offset;
    const current=buckets.get(start);
    if(current){
      current[1]=Math.min(current[1],low);
      current[2]=Math.max(current[2],high);
      current[4]=close;current[5]+=volume;
    }else buckets.set(start,[start,low,high,open,close,volume]);
  }
  const grouped=[...buckets.values()];
  if(rows[0]?.[0]!==grouped[0]?.[0])grouped.shift();
  return grouped;
}
function pricesFeed(){
  return marketData('prices',45,async()=>{
    const exchangeQuote=async symbol=>{
      const x=await remote(priceApi+'/products/'+symbol.toUpperCase()+'-USD/stats');
      const last=Number(x.last),open=Number(x.open);
      if(last<=0||open<=0||!Number.isFinite(last+open)) throw Error('Price unavailable');
      return {symbol,last,change:(last/open-1)*100,source:"Coinbase"};
    };
    const prices=await Promise.allSettled(marketCoins.map(([symbol])=>exchangeQuote(symbol)));
    const items=prices.filter(x=>x.status==='fulfilled').map(x=>x.value);
    const ids={btc:'bitcoin',eth:'ethereum',sol:'solana',xrp:'ripple',ada:'cardano',doge:'dogecoin',usdt:'tether'};
    const missing=marketCoins.filter(([symbol])=>!items.some(q=>q.symbol===symbol));
    if(missing.length){
      try {
        const url='https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true&ids='+missing.map(([symbol])=>ids[symbol]).join(',');
        const quotes=await remote(url);
        for(const [symbol] of missing){
          const q=quotes[ids[symbol]];
          if(q?.usd>0 && Number.isFinite(q.usd_24h_change) && Math.abs(Date.now()-q.last_updated_at*1000)<300000)
            items.push({symbol,last:q.usd,change:q.usd_24h_change,source:'CoinGecko'});
        }
      } catch {}
    }
    const unresolved=missing.filter(([symbol])=>!items.some(q=>q.symbol===symbol));
    const backups=await Promise.allSettled(unresolved.map(async ([symbol])=>{
      const q=await remote('https://www.bitstamp.net/api/v2/ticker/'+symbol+'usd/');
      const last=Number(q.last),change=Number(q.percent_change_24),time=Number(q.timestamp)*1000;
      if(!(last>0)||!Number.isFinite(last)||q.percent_change_24==null||q.percent_change_24===''||!Number.isFinite(change)||!(Math.abs(Date.now()-time)<300000)) throw Error('Invalid backup quote');
      return {symbol,last,change,source:'Bitstamp'};
    }));
    items.push(...backups.filter(r=>r.status==='fulfilled').map(r=>r.value));
    if(!items.length) throw Error('No prices');
    return {items,fetchedAt:new Date().toISOString()};
  });
}
function gateBubbleTickers(){return marketData('gate-bubble-tickers',10,async()=>{
    const response=await fetch('https://api.gateio.ws/api/v4/spot/tickers',{signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw Error('Tickers unavailable');
    const time=Date.parse(response.headers.get('date'));
    if(!Number.isFinite(time))throw Error('Undated response');
    const quotes={};
    for(const q of await response.json()){
      if(Object.hasOwn(bubbleGatePairs,q.currency_pair)&&Number(q.last)>0&&Number.isFinite(Number(q.change_percentage))){
        quotes[bubbleGatePairs[q.currency_pair]]={price:Number(q.last),day:Number(q.change_percentage),time};
      }
    }
    if(!Object.keys(quotes).length)throw Error('No tickers');
    return quotes;
  });;}
function feeds(ctx,path,db){
  if(path==='/data/liquidation-spot-prices'&&enabled(ctx,'liquidations'))return marketData('liq-okx-spot',10,async()=>{
    const response=await remote('https://www.okx.com/api/v5/market/tickers?instType=SPOT');
    const quotes={};
    for(const row of response.data||[]){
      const match=/^([A-Z0-9]+)-USDT$/.exec(row.instId);
      const price=Number(row.last),time=Number(row.ts);
      if(match&&Number.isFinite(price)&&price>0&&time>0)quotes[match[1]]={price,time};
    }
    if(!Object.keys(quotes).length)throw Error('No spot quotes');
    return quotes;
  });
  if(path==='/data/liquidation-btc-price'&&enabled(ctx,'liquidations'))return marketData('liquidation-btc-price',5,async()=>{
    const ticker=await remote(priceApi+'/products/BTC-USD/ticker');
    const price=Number(ticker.price),time=Date.parse(ticker.time);
    if(!Number.isFinite(price)||price<=0||!Number.isFinite(time))throw Error('Invalid trade');
    return {price,time};
  });
  if(path==='/data/unlock-exchange-prices')return marketData('unlock-exchange',10,async()=>{
    const response=await fetch('https://api.gateio.ws/api/v4/spot/tickers',{signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('Exchange unavailable');
    const timestamp=Date.parse(response.headers.get('date'))/1000;
    if(!Number.isFinite(timestamp))throw Error('Missing timestamp');
    const quotes={};
    for(const row of await response.json()){
      const symbol=String(row.currency_pair).split('_')[0];
      if(unlockGateSymbols.includes(symbol)&&row.currency_pair===symbol+'_USDT'&&Number(row.last)>0)quotes[symbol]={price:Number(row.last),timestamp};
    }
    return quotes;
  });
  if(path==='/data/unlock-prices')return marketData('unlock-prices',60,loadUnlockQuotes);
  if(path==='/data/liquidation-model'&&enabled(ctx,'liquidations')){
    const asset=ctx.url.searchParams.get('asset')||'BTC';
    if(!Object.hasOwn(scenarioSeed,asset))return text('Not found',404);
    return marketData('liq-model-'+asset,60,async()=>{
      const saved=scenarioSeed[asset];
      try{
        const raw=await remote('https://api.gateio.ws/api/v4/futures/usdt/candlesticks?contract='+asset+'_USDT&interval=1h');
        const rows=raw.map(r=>[Number(r.t)*1000,...['o','h','l','c','sum'].map(k=>Number(r[k]))]).filter(r=>r.every(Number.isFinite)&&r[3]>0&&r[2]>=r[3]&&r[5]>=0).sort((a,b)=>a[0]-b[0]);
        if(rows.length>=72&&rows.at(-1)[0]>=saved.at(-1)[0])return {rows};
      }catch{}
      return {rows:saved};
    });
  }
  if(path==='/data/bubble-tickers'&&enabled(ctx,'crypto-bubbles'))return gateBubbleTickers()
  if(path==='/data/bubble-spot'&&enabled(ctx,'crypto-bubbles'))return bubbleSpotFeed();
  if(path==='/data/crypto-bubbles'&&enabled(ctx,'crypto-bubbles'))return bubblesFeed();
  if(path==='/data/highlights'&&enabled(ctx,'highlights')) return highlightsFeed(ctx,db);
  if(path==='/data/fear-greed') return sentimentFeed();
  if(path==='/data/forex') return forexFeed();
  if(path==='/data/liquidations'&&enabled(ctx,'liquidations')) return liquidationHistory();
  if(path==='/data/prices'&&(enabled(ctx,'ticker')||enabled(ctx,'markets'))) return pricesFeed();
  if(path==='/data/chart'&&enabled(ctx,'charts')){
    const symbol=ctx.url.searchParams.get('coin')||'btc';
    if(!marketCoins.some(x=>x[0]===symbol))return text('Not found',404);
    const range=ctx.url.searchParams.get('interval')||ctx.url.searchParams.get('range')||'72h';
    const ranges={'15m':[900,900,876],'1h':[3600,3600,876],'4h':[3600,14400,219],'1d':[86400,86400,876],'1w':[86400,604800,75],'24h':[900,900,96],'72h':[3600,3600,72],'7d':[3600,3600,168],'30d':[21600,21600,120],'90d':[86400,86400,90]};
    if(!Object.hasOwn(ranges,range))return text('Not found',404);
    const [sourceInterval,interval,limit]=ranges[range];
    return marketData('chart-'+symbol+'-'+range,120,async()=>{
      const endpoint=priceApi+'/products/'+symbol.toUpperCase()+'-USD/candles?granularity='+sourceInterval;
      if(range==='1w'){
        const pair=({btc:'XBT',doge:'XDG'}[symbol]||symbol.toUpperCase())+'USD';
        const saved=weeklyHistory.assets[symbol];
        const merged=new Map(saved.map(row=>[row[0],row]));
        let checked=weeklyHistory.checked;
        try{
          const response=await remote('https://api.kraken.com/0/public/OHLC?pair='+pair+'&interval=10080');
          const series=Object.values(response.result||{}).find(Array.isArray)||[];
          let latest=0;
          for(const r of series){
            const bar=[r[0],r[3],r[2],r[1],r[4],r[6]].map(Number);
            if(bar.every(Number.isFinite)&&bar[1]>0&&bar[2]>=bar[1]&&bar[5]>=0){
              merged.set(bar[0],bar);latest=Math.max(latest,bar[0]);
            }
          }
          if(latest>=saved.at(-1)[0])checked=Math.floor(Date.now()/1000);
        }catch{}
        const candles=[...merged.values()].sort((a,b)=>a[0]-b[0]);
        return {interval,candles,points:candles.map(row=>[row[0],row[4]]),source:'Kraken',checked};
      }
      let rows;
      if(['15m','1h','4h','1d'].includes(range)){
        const end=Math.floor(Date.now()/1000/sourceInterval)*sourceInterval;
        const span=292*sourceInterval;
        const requests=[remote(endpoint)];
        for(let i=1;i<=2;i++){
          const until=end-(i*span);
          requests.push(remote(endpoint+'&start='+new Date((until-span)*1000).toISOString()+'&end='+new Date(until*1000).toISOString()));
        }
        const pages=await Promise.allSettled(requests);
        if(pages[0].status==='rejected')throw pages[0].reason;
        rows=[...pages[0].value];
        for(const page of pages.slice(1)){
          if(page.status==='rejected'||!Array.isArray(page.value)||!page.value.length)break;
          rows.push(...page.value);
        }
      }else rows=await remote(endpoint);
      const clean=[...new Map(rows.filter(r=>Array.isArray(r)&&r.length>=6&&r.every(Number.isFinite)&&r[1]>0&&r[2]>=r[1]&&r[3]>0&&r[4]>0).map(r=>[r[0],r])).values()].sort((a,b)=>a[0]-b[0]);
      const candles=bucketCandles(clean,sourceInterval,interval).slice(-limit);
      if(candles.length<2)throw Error('No candles');
      return {candles,points:candles.map(r=>[r[0],r[4]]),interval};
    });
  }
  if(path==='/data/debt'&&enabled(ctx,'debt')) return marketData('debt',3600,async()=>{
    const [upstream,mts]=await Promise.all([remote(debtApi).catch(()=>null),remote(spendingApi).catch(()=>null)]);
    const row=upstream?.data?.[0], spendingRow=mts?.data?.[0];
    const debt=row?{date:row.record_date,total:Number(row.tot_pub_debt_out_amt),public:Number(row.debt_held_public_amt),internal:Number(row.intragov_hold_amt)}:debtSnapshot;
    const spending=spendingRow&&Number(spendingRow.current_month_gross_outly_amt)>0?{value:Number(spendingRow.current_month_gross_outly_amt),date:spendingRow.record_date,year:Number(spendingRow.record_fiscal_year)}:spendingSnapshot;
    return {...debt,spending,history:[...historicDebt.filter(([day])=>day<debt.date),[debt.date,debt.total]]};
  });
  if(path==='/data/halving'&&enabled(ctx,'halving')) return marketData('halving',45,async()=>{
    const [latest,quote]=await Promise.all([remote('https://mempool.space/api/blocks').catch(()=>[]),remote(priceApi+'/products/BTC-USD/stats').catch(()=>null)]);
    const recent=Array.isArray(latest)?latest.filter(b=>Number.isInteger(b.height)&&Number.isFinite(b.timestamp)&&/^[a-f0-9]{64}$/.test(b.id)).slice(0,12):[];
    const height=recent[0]?.height||Number(await remote('https://mempool.space/api/blocks/tip/height','text'));
    if(!Number.isInteger(height)||height<840000) throw Error('Invalid height');
    const next=(Math.floor(height/210000)+1)*210000;
    const observed=Date.now();
    const targetTime=Math.max(observed,((recent[0]?.timestamp||Math.floor(observed/1000))+(next-height)*600)*1000);
    return {height,next,seconds:Math.max(0,Math.round((targetTime-observed)/1000)),observed,targetTime,price:Number(quote?.last)||null,blocks:recent.map(b=>({height:b.height,time:b.timestamp,id:b.id}))};
  });
  if(path==='/data/calendar'&&enabled(ctx,'calendar')) return marketData('bls',3600,async()=>{
    const raw=await remote('https://www.bls.gov/schedule/news_release/bls.ics','text').catch(()=>null);
    if(!raw) return {events:blsSnapshot,snapshot:true};
    const ics=raw.replace(/\r?\n[ \t]/g,'');
    const events=ics.split('BEGIN:VEVENT').slice(1).flatMap(block=>{
      const match=block.match(/^DTSTART[^:]*:(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/m);
      const summary=block.match(/^SUMMARY:(.+)/m)?.[1]?.trim().replace(/\\([,;])/g,'$1');
      return match&&summary?[{date:match.slice(1,4).join('-'),time:match[4]?match[4]+':'+match[5]:'',title:summary}]:[];
    }).sort((a,b)=>a.date.localeCompare(b.date));
    return {events};
  });
  return text('Not found',404);
}
function ticker(ctx,table=false){
  const entries=(table?marketCoins:coins).map(([symbol,name])=>{
    const label=coinIcon(symbol)+'<strong>'+name+'</strong>';
    const coin=table?label:'<a class="ticker-coin" href="'+editionHref(ctx,catUrl(name))+'">'+label+'</a>';
    const quote=marketCoins.some(([marketSymbol])=>marketSymbol===symbol);
    return quote
      ? '<div data-symbol="'+symbol+'">'+coin+'<span data-price>—</span><small data-change></small></div>'
      : '<div>'+coin+'</div>';
  }).join('');
  return '<section class="'+(table?'market-prices':'wrap live-ticker')+'" data-feed="prices" aria-label="'+t(ctx,'Qiimaha crypto','Crypto prices')+'">'+entries+'<small class="feed-status">'+t(ctx,'Qiimaha waa la soo raraya…','Loading prices…')+'</small></section>';
}
async function loadUnlockQuotes(){
  const ids=Object.values(unlockPrices).map(asset=>asset[0]);
  const data=await remote('https://coins.llama.fi/prices/current/'+ids.join(','));
  const quotes={};
  for(const [symbol,[id]] of Object.entries(unlockPrices)){
    const q=data.coins?.[id];
    if(q?.symbol?.toUpperCase()===symbol&&Number.isFinite(q.price)&&q.price>0&&Number.isFinite(q.timestamp)&&q.timestamp>0)quotes[symbol]={price:q.price,timestamp:q.timestamp};
  }
  if(!Object.keys(quotes).length)throw Error('Missing quotes');
  return quotes;
}
let unlockQuoteCache=null;
async function refreshUnlockQuotes(){
  const response=await marketData('unlock-prices',60,loadUnlockQuotes);
  if(response.ok){
    const quotes=await response.json();
    if(quotes&&!quotes.error) unlockQuoteCache=quotes;
  }
  return unlockQuoteCache||{};
}
function unlockAsset(symbol){
  const bundled=unlockPrices[symbol];
  const live=unlockQuoteCache?.[symbol];
  if(live) return [bundled?.[0]||'',live.price,live.timestamp];
  return bundled;
}
const unlockGateSymbols=['KAITO','ZRO','H','XPL','WAL','GRVT','EIGEN','OP'];
const unlockPrices = {
  "KAITO": [
    "coingecko:kaito",
    0.1709273280652035,
    1795125182
  ],
  "ZRO": [
    "coingecko:layerzero",
    1.333218483,
    1795125485
  ],
  "XPL": [
    "coingecko:plasma",
    0.046544137,
    1795125485
  ],
  "WAL": [
    "coingecko:walrus-2",
    0.023863482100000003,
    1795125485
  ],
  "KNTQ": [
    "coingecko:kinetiq",
    0.22622773446902916,
    1795124516
  ],
  "GRVT": [
    "coingecko:grvt",
    0.1646869943,
    1795125485
  ],
  "EIGEN": [
    "coingecko:eigenlayer",
    0.12366258200000001,
    1795125485
  ],
  "OP": [
    "coingecko:optimism",
    0.073718082,
    1795125485
  ],
  "SOLV": [
    "coingecko:solv-protocol",
    0.00407846787,
    1795125485
  ],
  "H": [
    "coingecko:humanity",
    0.01533288475,
    1795125502
  ]
};
const unlockHours = {
  'KAITO/2026-11-20':'12:00','ZRO/2026-11-20':'11:00','H/2026-11-23':'10:13',
  'KNTQ/2026-11-27':'05:48','GRVT/2026-11-29':'16:00','EIGEN/2026-11-30':'23:44'
};
function unlockDetails(ctx,row){
  const symbol=row.title.split(/[ ·]/)[0].toUpperCase();
  const hour=unlockHours[symbol+'/'+row.event_date];
  const asset=unlockAsset(symbol);
  const timestamp=asset?new Date(asset[2]*1000).toISOString().slice(0,19).replace('T',' ')+' UTC':'';
  const format=new Intl.NumberFormat(ctx.lang,{style:'currency',currency:'USD',maximumSignificantDigits:5});
  return '<td><time>'+escape(row.event_date)+'</time><small class="unlock-detail">'+(hour?publicLink('https://cryptolunar.com/token-unlocks/',hour+' UTC · '+t(ctx,'Qiyaas','Estimated')):t(ctx,'Saacadda lama xaqiijin','Time unconfirmed'))+'</small></td><td>'+ (asset?'<span data-stream="'+(unlockGateSymbols.includes(symbol)?'gate':'')+'" data-time="'+asset[2]+'" data-unlock-price="'+escape(symbol)+'">'+format.format(asset[1])+'</span><small class="unlock-detail" data-unlock-stamp="'+escape(symbol)+'">'+'DefiLlama · '+timestamp+'</small>':'—')+'</td>';
}
function scheduleTable(ctx,rows,unlock){
  if(!rows.length) return '<p class="meta">'+t(ctx,'Weli dhacdo la xaqiijiyay ma jirto.','No verified events are listed yet.')+'</p>';
  const head=unlock?['Token',t(ctx,'Isha','Source'),t(ctx,'Waqtiga furitaanka','Unlock date / time'),t(ctx,'Qiimaha token-ka','Token price'),t(ctx,'Tirada','Amount'),t(ctx,'Qiimaha furitaanka','Unlock value'),t(ctx,'Sahayda wareegaysa (%)','Circulating supply (%)')]:[t(ctx,'Dhacdo','Event'),t(ctx,'Taariikh','Date')];
  const sourceCell=r=>'<td>'+publicLink(r.source,r.source===unlockSource?'Toolz':new URL(r.source).hostname.replace(/^www\./,''))+'</td>';
  return '<div class="studio-table"><table><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr><td>'+(unlock?'<span class="unlock-coin">'+coinIcon((r.title.split(/[ ·]/)[0]||'').toLowerCase())+'<strong>'+escape(r.title)+'</strong></span>':publicLink(r.source,r.title))+'</td>'+(unlock?sourceCell(r)+unlockDetails(ctx,r):'<td>'+escape(r.event_date)+'</td>')+(unlock?'<td>'+(r.amount===null?'—':r.amount.toLocaleString('en-US'))+'</td><td data-unlock-amount="'+(r.amount??'')+'">'+(r.amount!=null&&unlockAsset((r.title.split(/[ ·]/)[0]||'').toUpperCase())?usd(r.amount*unlockAsset((r.title.split(/[ ·]/)[0]||'').toUpperCase())[1]):'—')+'</td><td>'+(r.supply===null?'—':r.supply+'%')+'</td>':'')+'</tr>').join('')+'</tbody></table></div>'+(unlock?'<p class="meta">'+publicLink('https://defillama.com/','DefiLlama')+' · '+t(ctx,'Gate wuxuu bixiyaa qiimaha USDT ee tooska ah. Qiimaha USD waxaa laga helaa DefiLlama.','Gate streams USDT trades. USD quotes come from DefiLlama. Unlock value equals the token amount multiplied by its latest quote.')+'</p>':'');
}
async function nextUnlocks(ctx,db){
  if(!enabled(ctx,'unlocks')) return '';
  await refreshUnlockQuotes();
  const rows=await unlockRows(db,calendarToday('UTC'),'',4);
  return '<section class="market-block"><h2>'+t(ctx,'Furitaanka tokennada ee soo socda','Upcoming token unlocks')+'</h2>'+scheduleTable(ctx,rows,true)+'<a class="text-link" href="'+editionHref(ctx,'/unlocks')+'">'+t(ctx,'Eeg jadwalka','See schedule')+' →</a></section>';
}
async function marketPage(ctx,key,db){
  if(!enabled(ctx,key)) return publisherPage(ctx,t(ctx,'Bogga lama helin','Page not found'),'',{status:404,noindex:true});
  if(['crypto-bubbles','profit-calculator'].includes(key)) return visualMarketPage(ctx,key);
  if(['debt','halving','liquidations'].includes(key)) return terminalPage(ctx,key);
  const title=t(ctx,...toolsNav[key]);
  if(key==='highlights') return highlightsPage(ctx,title,db);
  if(key==='charts') return chartPage(ctx,title);
  let content='';
  if(key==='markets') return marketDirectory(ctx);
  if(key==='unlocks'){
    await refreshUnlockQuotes();
    const view=ctx.url.searchParams.get('view');
    const today=calendarToday('UTC');
    const end=view==='today'?daysAfter(today,1):view==='week'?daysAfter(today,7):'';
    const rows=await unlockRows(db,today,end);
    const toggle=(mode,label)=>'<a href="'+editionHref(ctx,'/unlocks'+(mode?'?view='+mode:''))+'"'+((mode===view||!mode&&!['today','week'].includes(view))?' aria-current="page"':'')+'>'+label+'</a>';
    content='<nav class="calendar-tabs">'+toggle('',t(ctx,'Dhammaan','All upcoming'))+toggle('today',t(ctx,'Maanta','Today'))+toggle('week',t(ctx,'7 maalmood','Next 7 days'))+'</nav>'+scheduleTable(ctx,rows,true)+'<p class="meta">'+t(ctx,'Saamigu waa boqolkiiba sahayda wareegaysa. Qiimayaasha iyo taariikhuhu waa qiyaas. Xogta tixraaca waxa la hubiyay 17 Nofeembar 2026.','Share refers to circulating supply. Dates and USD values are estimates. Reference rows were checked November 17, 2026.')+'</p>';
  }
  if(key==='calendar'){
    const range=calendarRange(ctx,calendarToday('America/New_York'));
    const rows=await dbAll(db,"SELECT * FROM schedules WHERE kind='calendar' AND event_date>=? AND (?='' OR event_date<?) ORDER BY event_date,id LIMIT 200",range.start,range.end,range.end);
    content=calendarFilters(ctx,range)+macroTable(ctx,rows,range.start,range.end,range.size);
  }
  if(key==='calendar') return layout(ctx,title,terminalShell(ctx,'<div class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Warbixinnada dhaqaalaha iyo go’aannada bangiyada dhexe ee suuqyada waaweyn.','Economic releases and central bank decisions across major markets.')+'</p></div>'+content),{terminal:'calendar'});
  return publisherPage(ctx,title,content,{wide:key==='unlocks'});
}
