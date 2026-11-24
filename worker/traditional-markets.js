const currencyFlags={EUR:'🇪🇺',USD:'🇺🇸',GBP:'🇬🇧',JPY:'🇯🇵',CHF:'🇨🇭',CAD:'🇨🇦',AUD:'🇦🇺',NZD:'🇳🇿'};
const fxPairs=[['EUR','USD'],['GBP','USD'],['USD','JPY'],['USD','CHF'],['USD','CAD'],['AUD','USD'],['NZD','USD'],['EUR','GBP']];
const fxSource='https://frankfurter.dev/v1/';
function fxQuotes(series){
  const valid=Object.entries(series||{}).filter(([day,rates])=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&rates&&Object.keys(rates).length).sort(([a],[b])=>a.localeCompare(b));
  if(valid.length<2)throw Error('Forex rates unavailable');
  const [date,last]=valid.at(-1);
  const previous=valid.at(-2)[1];
  const rate=(d,c)=>c==='EUR'?1:Number(d[c]);
  const items=fxPairs.flatMap(([base,quote])=>{
    const value=rate(last,quote)/rate(last,base),before=rate(previous,quote)/rate(previous,base);
    return value>0&&before>0&&Number.isFinite(value+before)?[{symbol:base+'/'+quote,value,change:(value/before-1)*100}]:[];
  });
  if(!items.length)throw Error('Forex rates unavailable');
  return {date,items};
}
function forexFeed(){
  return marketData('forex',300,async()=>{
    const end=new Date().toISOString().slice(0,10);
    const start=daysAfter(end,-10);
    try{
      const payload=await remote('https://api.frankfurter.dev/v1/'+start+'..'+end+'?base=EUR&symbols=USD,JPY,GBP,CHF,CAD,AUD,NZD');
      return fxQuotes(payload.rates);
    }catch{return {...fxQuotes(fxSnapshot),snapshot:true};}
  });
}
function forexPanel(ctx){
  const data=fxQuotes(fxSnapshot);
  const latest=t(ctx,'Qiimayaasha tixraaca maalinlaha ah','Daily reference rates');
  const rows=data.items.map(({symbol,value,change})=>'<tr data-fx="'+symbol+'"><th scope="row">'+symbol.split('/').map(code=>'<span class="fx-currency"><span aria-hidden="true">'+currencyFlags[code]+'</span>'+code+'</span>').join(' / ')+'</th><td data-rate>'+value.toFixed(symbol.endsWith('JPY')?3:4)+'</td><td data-change data-direction="'+(change>=0?'up':'down')+'">'+(change>=0?'+':'')+change.toFixed(2)+'%</td></tr>').join('');
  return '<section class="asset-board" data-feed="forex"><h2>'+latest+'</h2><p class="feed-status">'+t(ctx,'Xogta kaydsan','Saved data')+' · '+data.date+'</p><div class="studio-table"><table><thead><tr><th>'+t(ctx,'Lammaanaha','Pair')+'</th><th>'+t(ctx,'Qiimaha','Rate')+'</th><th>'+t(ctx,'Isbeddelka maalinlaha ah','Daily change')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="meta">'+t(ctx,'Isbeddelka waxa laga xisaabiyaa maalintii xogta ugu dambaysay ee ka horraysay.','Change is measured against the preceding published rate.')+' · '+publicLink(fxSource,'Frankfurter')+'</p></section>';
}
const stockGroups=[
  {name:'Benchmark ETFs',symbols:[{name:'AMEX:SPY',displayName:'S&P 500 ETF'},{name:'NASDAQ:QQQ',displayName:'Nasdaq-100 ETF'},{name:'AMEX:DIA',displayName:'Dow Jones ETF'}]},
  {name:'U.S. stocks',symbols:[{name:'NASDAQ:AAPL',displayName:'Apple'},{name:'NASDAQ:MSFT',displayName:'Microsoft'},{name:'NASDAQ:NVDA',displayName:'NVIDIA'},{name:'NASDAQ:AMZN',displayName:'Amazon'},{name:'NASDAQ:GOOGL',displayName:'Alphabet'},{name:'NYSE:BRK.B',displayName:'Berkshire Hathaway'}]}
];
function stockPanel(ctx){
  return '<section class="asset-board stock-board"><h2>'+t(ctx,'Saamiyada iyo ETF-yada','Stocks and benchmark ETFs')+'</h2><p class="meta">'+t(ctx,'Xogta suuqa waxaa laga yaabaa inay dib u dhacdo.','Market quotes may be delayed.')+'</p><iframe class="stock-widget" data-stock-widget src="/embed/stocks" title="'+t(ctx,'Qiimaha saamiyada Maraykanka','U.S. stock market quotes')+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="meta">'+publicLink('https://www.tradingview.com/markets/stocks-usa/','TradingView · U.S. stocks')+'</p></section>';
}
function stockEmbed(ctx){
  const colorTheme=ctx.url.searchParams.get('theme')==='dark'?'dark':'light';
  const requested=ctx.url.searchParams.get('view');
  const view=Object.hasOwn(watchlists,requested)?requested:'stocks';
  const [creditUrl,credit]=marketRefs[view];
  const settings={width:'100%',height:'100%',symbolsGroups:watchlists[view],showSymbolLogo:true,isTransparent:false,colorTheme,locale:'en',largeChartUrl:''};
  return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,.tradingview-widget-container{height:100%;margin:0;background:'+(colorTheme==='dark'?'#131722':'#fff')+'}.tradingview-widget-container__widget{height:calc(100% - 24px)}</style></head><body><div class="tradingview-widget-container"><div class="tradingview-widget-container__widget"></div><div class="tradingview-widget-copyright"><a href="'+creditUrl+'" rel="noopener noreferrer" target="_blank">'+credit+'</a> by TradingView</div><script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js" async>'+JSON.stringify(settings)+'</script></div></body></html>',{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=600','x-robots-tag':'noindex'}});
}
const shariaGroups=[
  {key:'Halal',className:'halal',titles:['Xalaal','Halal'],body:['Qaybaha ay hawshooda asaasiga ahi geli karto baaritaanka, sida software-ka, caafimaadka iyo wax-soo-saarka. Shirkadda waa in weli la hubiyaa.','Core activities such as software, healthcare, and manufacturing can qualify. Each company still needs to pass business and financial screening.']},
  {key:'Haram',className:'haram',titles:['Xaaraan','Haram'],body:['Tusaalooyinka hawlaha laga reebo waxaa ka mid ah khamriga, khamaarka, hilibka doofaarka iyo adeegyada maaliyadeed ee ribada ku salaysan.','Commonly excluded activities include alcohol, gambling, pork products, and conventional interest-based financial services.']},
  {key:'Mashbooh',className:'mashbooh',titles:['Mashbooh','Mashbooh'],body:['Waxaa loo baahan yahay baaritaan dheeraad ah marka dakhligu ka yimaado hawlo isku dhafan ama xogta deymaha iyo dakhliga aan la hubin.','Further review is needed when revenue comes from mixed activities or when business and financial disclosures are insufficient.']}
];
const coinScreeningSources={
  Halal:['https://halalscreener.app/en/halal-crypto','HalalScreener'],
  Haram:['https://www.coingecko.com/en/categories/decentralized-finance-defi','CoinGecko · DeFi'],
  Mashbooh:['https://www.coingecko.com/en/categories/meme-token','CoinGecko · Meme coins']
};
const screenedCoins={
  Halal:[['BTC','Bitcoin'],['ETH','Ethereum'],['SOL','Solana'],['XRP','XRP'],['ADA','Cardano'],['LTC','Litecoin'],['XLM','Stellar'],['AVAX','Avalanche'],['BCH','Bitcoin Cash'],['TRX','TRON'],['DOT','Polkadot'],['LINK','Chainlink'],['HBAR','Hedera'],['SUI','Sui'],['TON','Toncoin'],["ALGO", "Algorand"],["ATOM", "Cosmos Hub"],["ICP", "Internet Computer"],["VET", "VeChain"],["FIL", "Filecoin"],["GRT", "The Graph"],["ISLM","Islamic Coin"],["ICX","ICON"],["QUAI","Quai Network"],["GUN","Gunz"],["CYS","Cysic"]],
  Haram:[['AAVE','Aave'],['UNI','Uniswap'],['CRV','Curve DAO'],['COMP','Compound'],['SNX','Synthetix'],['SUSHI','Sushi'],['MKR','Maker'],['CAKE','PancakeSwap'],['1INCH','1inch'],['LDO','Lido DAO'],['BAL','Balancer'],["MORPHO", "Morpho"],["PENDLE", "Pendle"],["JUP", "Jupiter"],["RAY", "Raydium"],["CVX", "Convex Finance"],["JTO", "Jito"],["HYPE","Hyperliquid"],["ENA","Ethena"],["KMNO","Kamino"],["GMX","GMX"],["YFI","yearn.finance"],["OHM","Olympus"]],
  Mashbooh:[['DOGE','Dogecoin'],['SHIB','Shiba Inu'],['PEPE','Pepe'],['BONK','Bonk'],['WIF','dogwifhat'],['FLOKI','FLOKI'],['PENGU','Pudgy Penguins'],['BRETT','Brett'],['FARTCOIN','Fartcoin'],["SPX", "SPX6900"],["MOG", "Mog Coin"],["POPCAT", "Popcat"],["TURBO", "Turbo"],["BABYDOGE", "Baby Doge Coin"],["MEW", "cat in a dogs world"]]
};
function coinScreenList(ctx,group){
  const [source,label]=coinScreeningSources[group.key];
  const coins=screenedCoins[group.key].map(([symbol,name])=>'<li>'+coinIcon(symbol.toLowerCase())+'<span><strong>'+name+'</strong><small>'+symbol+'</small></span></li>').join('');
  return '<ul class="sharia-coin-list">'+coins+'</ul><p class="meta sharia-coin-source">'+t(ctx,'Isha','Source')+' · '+publicLink(source,label)+(group.key==='Haram'?' · '+publicLink('https://halalscreener.app/en/halal-crypto/lending-yield-and-derivatives','HalalScreener'):'')+'</p>';
}
function shariaPage(ctx){
  const title=t(ctx,...shariaTitles);
  const cards=shariaGroups.map(g=>'<article class="sharia-card '+g.className+'"><h2>'+t(ctx,...g.titles)+'</h2><p>'+t(ctx,...g.body)+'</p>'+coinScreenList(ctx,g)+'<a class="text-link" href="'+catUrl(g.key)+'">'+t(ctx,'Akhri maqaallada','Read articles')+' →</a></article>').join('');
  const methodology=t(ctx,'Habka tifaftirka Zaki News wuxuu tokennada mashruucyada DeFi geliyaa Xaaraan, meme coins-na Mashbooh. Tusaalooyinka Xalaal waxay raacaan isha baaritaanka ee ku lifaaqan. Calaamadahani waa waxbarasho.','The Zaki News editorial policy places DeFi protocol tokens under Haram and meme coins under Mashbooh. The Halal examples are classified by the linked screener. These labels are educational and do not certify every use of a token.');
  const body='<div class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Tusaalooyin coin iyo habka tifaftirka ee Zaki News.','Coin examples and the Zaki News editorial screening policy.')+'</p></div><div class="sharia-grid">'+cards+'</div><p class="meta">'+methodology+'</p><p class="calendar-sources">'+publicLink('https://www.msci.com/indexes/group/islamic-indexes','MSCI Islamic Indexes')+' · '+publicLink('https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-shariah-indices.pdf','S&P Shariah methodology')+'</p>';
  return layout(ctx,title,terminalShell(ctx,body),{terminal:'sharia'});
}
const etfGroups=[
  {name:'Broad market ETFs',symbols:[{name:'AMEX:SPY',displayName:'SPDR S&P 500 ETF'},{name:'NASDAQ:QQQ',displayName:'Invesco QQQ'},{name:'AMEX:VTI',displayName:'Vanguard Total Stock Market ETF'}]},
  {name:'Spot crypto funds',symbols:[{name:'NASDAQ:IBIT',displayName:'iShares Bitcoin Trust ETF'},{name:'NASDAQ:ETHA',displayName:'iShares Ethereum Trust ETF'},{name:'AMEX:GBTC',displayName:'Grayscale Bitcoin Trust ETF'},{name:'AMEX:BITB',displayName:'Bitwise Bitcoin ETF'}]}
];
function etfPage(ctx){
  const label=t(ctx,'Liiska ETF-yada','ETF watchlist');
  const body='<div class="calendar-intro"><h1>'+label+'</h1><p>'+t(ctx,'ETF-yada suuqa guud iyo sanduuqyada spot crypto ee Maraykanka.','U.S. broad-market ETFs and spot crypto funds.')+'</p></div><section class="asset-board stock-board"><iframe class="stock-widget" data-stock-widget src="/embed/stocks?view=etfs" title="'+label+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="meta">'+t(ctx,'Qiimayaasha waxaa laga yaabaa inay dib u dhacaan.','Quotes may be delayed.')+' · '+publicLink('https://www.tradingview.com/markets/etfs/','TradingView')+'</p></section>';
  return layout(ctx,label,terminalShell(ctx,body+'<p class="calendar-sources"><a href="'+editionHref(ctx,'/etf-flows')+'">'+t(ctx,'Qulqulka ETF-yada crypto','Crypto ETF inflows and outflows')+' →</a></p>'),{terminal:'etfs'});
}
const sentimentSource='https://alternative.me/crypto/fear-and-greed-index/';
function normalizeSentiment(payload){
  const accepted=['Extreme Fear','Fear','Neutral','Greed','Extreme Greed'];
  const values=payload.data.flatMap(row=>{
    const value=Number(row.value),timestamp=Number(row.timestamp);
    return Number.isInteger(value)&&value>=0&&value<=100&&Number.isSafeInteger(timestamp)&&timestamp>0&&timestamp<Date.now()/1000+86400&&accepted.includes(row.value_classification)
      ?[{value,date:new Date(timestamp*1000).toISOString().slice(0,10),level:row.value_classification}]:[];
  }).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
  if(!values.length)throw Error('Sentiment unavailable');
  return values;
}
function sentimentFeed(){
  return marketData('fear-greed',300,async()=>{
    try{return {items:normalizeSentiment(await remote('https://api.alternative.me/fng/?limit=8'))};}
    catch{return {items:normalizeSentiment(sentimentSnapshot),snapshot:true};}
  });
}
const sentimentLabels={'Extreme Fear':'Cabsi aad u daran',Fear:'Cabsi',Neutral:'Dhexdhexaad',Greed:'Damac','Extreme Greed':'Damac aad u badan'};
async function sentimentPage(ctx){
  const title=t(ctx,'Tusaha Cabsi iyo Damac ee Crypto','Crypto Fear & Greed Index');
  let data=normalizeSentiment(sentimentSnapshot),snapshot=true;
  try{
    const feed=await sentimentFeed();
    if(feed.ok){
      const payload=await feed.json();
      if(payload.items?.length){data=payload.items;snapshot=!!payload.snapshot;}
    }
  }catch{}
  const latest=data[0];
  const rows=data.slice(1).map(r=>'<tr><td>'+r.date+'</td><td>'+r.value+'</td><td>'+t(ctx,sentimentLabels[r.level],r.level)+'</td></tr>').join('');
  const content='<div class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Cabbirka maalinlaha ah ee dareenka suuqa Bitcoin.','Daily measure of Bitcoin market sentiment.')+'</p></div><section class="asset-board sentiment-board" data-feed="sentiment"><div class="sentiment-main"><strong data-sentiment-value>'+latest.value+'</strong><span>/ 100</span></div><h2 data-sentiment-level>'+t(ctx,sentimentLabels[latest.level],latest.level)+'</h2><div class="sentiment-scale" aria-hidden="true"><i data-sentiment-marker style="left:'+latest.value+'%"></i></div><div class="sentiment-axis"><span>'+t(ctx,'Cabsi aad u daran','Extreme Fear')+'</span><span>'+t(ctx,'Dhexdhexaad','Neutral')+'</span><span>'+t(ctx,'Damac aad u badan','Extreme Greed')+'</span></div><p class="feed-status">'+(snapshot?t(ctx,'Xogta kaydsan','Saved data'):t(ctx,'Taariikhda xogta','Index date'))+' · '+latest.date+'</p><p class="meta">'+publicLink(sentimentSource,'Alternative.me')+'</p><details open><summary>'+t(ctx,'Toddobadii maalmood ee hore','Previous seven days')+'</summary><div class="studio-table"><table><thead><tr><th>'+t(ctx,'Taariikh','Date')+'</th><th>'+t(ctx,'Dhibco','Score')+'</th><th>'+t(ctx,'Heerka','Classification')+'</th></tr></thead><tbody data-sentiment-history>'+rows+'</tbody></table></div></details></section>';
  return layout(ctx,title,terminalShell(ctx,content),{terminal:'fear-greed'});
}

const highlightSeed={"trending":{"items":[{"name":"GTA6 / ETH","symbol":"GTA6","image":"https://assets.geckoterminal.com/431jzxo0a2i4krgqlxopohhhazgr","price":0.00298197823787513,"change":-78.642,"pool":"https://www.geckoterminal.com/eth/pools/0xb32495e38564540ff500e473b85e6d6c698352958061dd6d4c179997810b4a58"},{"name":"CASHCAT / WETH 0.3%","symbol":"CASHCAT","image":"https://coin-images.coingecko.com/coins/images/102174280/large/cashcat-logo.jpg?1782922765","price":0.0437624817243587,"change":-8.562,"pool":"https://www.geckoterminal.com/robinhood/pools/0xd42a491087a15e5afd51feb3606066cc152d2b09"},{"name":"PONS / USDG 0.3%","symbol":"PONS","image":"https://coin-images.coingecko.com/coins/images/102174571/large/jhitvkisdq8fhxvimdkpcw7y3dx5.?1784093932","price":0.115272698631419,"change":-1.521,"pool":"https://www.geckoterminal.com/robinhood/pools/0xf2a0be59ab76b96f957bd5e5b967f2b75e8db269"},{"name":"GTA6 / SOL","symbol":"GTA6","image":"https://assets.geckoterminal.com/mz4ps4bzg8efu1797lo5690awsb9","price":0.010358756249268746,"change":-41.806,"pool":"https://www.geckoterminal.com/solana/pools/5AFbwVSQPJf4cgEjq4TajZYyPYUvYktrRN3SahNrPnmv"},{"name":"HOOKR / WETH 0.25%","symbol":"HOOKR","image":"https://coin-images.coingecko.com/coins/images/102175265/large/hookr.jpg?1786013509","price":0.0135596290109702,"change":24.225,"pool":"https://www.geckoterminal.com/robinhood/pools/0x590dcb6a87828bf688b48089a62239b693378f1fb64d2286e6a399ed8c005fdf"},{"name":"JALU / SOL","symbol":"JALU","image":"https://assets.geckoterminal.com/50n4txko5nw28eiv86n5s8v8jtm5","price":0.00043202967718824635,"change":801.042,"pool":"https://www.geckoterminal.com/solana/pools/GnwWXPwh9VyYT9e7tj7dADkuU95Q5CC2VTBpQERECvfy"},{"name":"mihao / SOL","symbol":"mihao","image":"https://coin-images.coingecko.com/coins/images/102180225/large/g1i6vgqt2s0oe4tclnb3j8zbg8jz.?1794394690","price":0.008284792007751039,"change":-15.517,"pool":"https://www.geckoterminal.com/solana/pools/Ho1aSG6WGH1FfXdEHrK2f4Ggt1Hoxo9s5jcLMDqeyeBz"},{"name":"GIGATENEV / WETH","symbol":"GIGATENEV","image":"https://coin-images.coingecko.com/coins/images/102180143/large/gigatenev.jpg?1793953696","price":0.000590714691064372,"change":-4.876,"pool":"https://www.geckoterminal.com/robinhood/pools/0xe96c99be1ffcc204714ebce32870ab12b8b362308fa50b9352c03b2486a5d448"}],"asOf":"2026-11-18T12:53:16Z","source":"GeckoTerminal"},"new":{"items":[{"name":"WOKESTER / TTWO","symbol":"WOKESTER","image":null,"price":3.789261346189238e-06,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/5q7csUzrDHUd1qBMs5RWSUUtkUdKGsjGqR1HsxMa7Lck"},{"name":"AUD / SOL","symbol":"AUD","image":null,"price":1.2164133266987305e-05,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/BiqVCW1KVpjg8GHpi4yLv1axRpRNSUPFV7pHGi4aQpsM"},{"name":"USMS / SOL","symbol":"USMS","image":null,"price":6.877423923969411e-07,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/EauDFrfET4TZZkRVfEYpukiWkKjeScDUSiphZKxyCCPh"},{"name":"WOKESTER / SOL","symbol":"WOKESTER","image":null,"price":2.5557640978364334e-06,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/Da7NyJabSPZA6BUBDK8gZA3z3vyxZddXL3JdwzHMwkZw"},{"name":"CORDO / SOL","symbol":"CORDO","image":"https://assets.geckoterminal.com/a8ymwm6qjkjd1kpylc944x3q91rq","price":0.05107124153086912,"change":4.855,"pool":"https://www.geckoterminal.com/solana/pools/9o5zoi88DC8WLDEy8Jfjk8BwHRA51qXEoZST4TCxfdNs"},{"name":"TC$ / SOL","symbol":"TC$","image":"https://assets.geckoterminal.com/s8meu75abzx1p3umatfo0fgbncdn","price":7.217185352642721e-08,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/A2Udw9MfzimbRjTgQmawdQWgZVwo4kMXNc8sHb3MVhV2"},{"name":"AUDACITY / SOL","symbol":"AUDACITY","image":null,"price":4.0053198361365274e-05,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/7Jx2xD2JoNBEmiqQMxLHV8ebzALKo2Xh3Xbb4uu78mUh"},{"name":"AUDACITY / SOL","symbol":"AUDACITY","image":null,"price":5.522961646963036e-05,"change":0.0,"pool":"https://www.geckoterminal.com/solana/pools/41HmVrnQmq8bJ53mMwDZo5KhUEVAMNXmM2Xhr5Mhmb7B"}],"asOf":"2026-11-18T12:53:16Z","source":"GeckoTerminal"},"viewed":{"items":[{"name":"Bitcoin","symbol":"BTC","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/1.png","price":64025.13666101847,"change":-1.321158185487,"pool":"https://coinmarketcap.com/currencies/bitcoin/"},{"name":"XRP","symbol":"XRP","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/52.png","price":0.9798197659975141,"change":0.957209553964,"pool":"https://coinmarketcap.com/currencies/xrp/"},{"name":"Ethereum","symbol":"ETH","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png","price":1792.433369683449,"change":-1.499485506719,"pool":"https://coinmarketcap.com/currencies/ethereum/"},{"name":"Solana","symbol":"SOL","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png","price":74.17581993165017,"change":0.694566492331,"pool":"https://coinmarketcap.com/currencies/solana/"},{"name":"Zcash","symbol":"ZEC","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/1437.png","price":930.3771523096741,"change":-1.901257669906,"pool":"https://coinmarketcap.com/currencies/zcash/"},{"name":"Pi","symbol":"PI","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/35697.png","price":0.05950330287444042,"change":-0.283800545369,"pool":"https://coinmarketcap.com/currencies/pi/"},{"name":"Hyperliquid","symbol":"HYPE","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png","price":68.42663542049084,"change":-1.513277408356,"pool":"https://coinmarketcap.com/currencies/hyperliquid/"},{"name":"NEAR Protocol","symbol":"NEAR","image":"https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png","price":3.3218218284675283,"change":1.482650192069,"pool":"https://coinmarketcap.com/currencies/near-protocol/"}],"asOf":"2026-11-18T12:48:06Z","source":"CoinMarketCap"},"gainers":{"source":"CoinGecko","asOf":"2026-11-19T09:29:51.000Z","items":[{"name":"Pearl","symbol":"pearl","price":2.34,"change":34.43668,"image":"https://coin-images.coingecko.com/coins/images/102173580/large/pearl.png?1780324634","pool":"https://www.coingecko.com/en/coins/pearl-2"},{"name":"Bitway","symbol":"btw","price":0.594003,"change":30.9634,"image":"https://coin-images.coingecko.com/coins/images/71205/large/BTW_Token_200x200.png?1786291907","pool":"https://www.coingecko.com/en/coins/bitway"},{"name":"Pieverse","symbol":"pieverse","price":2.68,"change":20.18075,"image":"https://coin-images.coingecko.com/coins/images/68773/large/pieverse.png?1756546685","pool":"https://www.coingecko.com/en/coins/pieverse"},{"name":"Ether.fi","symbol":"ethfi","price":0.518489,"change":10.60226,"image":"https://coin-images.coingecko.com/coins/images/35958/large/etherfi.jpeg?1710254562","pool":"https://www.coingecko.com/en/coins/ether-fi"},{"name":"Venice Token","symbol":"vvv","price":23.32,"change":8.99575,"image":"https://coin-images.coingecko.com/coins/images/54023/large/VVV_Token_Transparent.png?1741856877","pool":"https://www.coingecko.com/en/coins/venice-token"},{"name":"LayerZero","symbol":"zro","price":1.43,"change":6.43396,"image":"https://coin-images.coingecko.com/coins/images/28206/large/ftxG9_TJ_400x400.jpeg?1696527208","pool":"https://www.coingecko.com/en/coins/layerzero"},{"name":"Jupiter","symbol":"jup","price":0.266317,"change":3.88995,"image":"https://coin-images.coingecko.com/coins/images/34188/large/jup.png?1704266489","pool":"https://www.coingecko.com/en/coins/jupiter-exchange-solana"},{"name":"Lighter","symbol":"lit","price":2.91,"change":2.85262,"image":"https://coin-images.coingecko.com/coins/images/71121/large/lighter.png?1765888098","pool":"https://www.coingecko.com/en/coins/lighter"}]},"losers":{"source":"CoinGecko","asOf":"2026-11-19T09:29:51.000Z","items":[{"name":"Sky","symbol":"sky","price":0.04614607,"change":-11.89704,"image":"https://coin-images.coingecko.com/coins/images/39925/large/sky.jpg?1724827980","pool":"https://www.coingecko.com/en/coins/sky"},{"name":"Pi Network","symbol":"pi","price":0.057357,"change":-5.51464,"image":"https://coin-images.coingecko.com/coins/images/54342/large/pi_network.jpg?1739347576","pool":"https://www.coingecko.com/en/coins/pi-network"},{"name":"Aster","symbol":"aster","price":0.524516,"change":-5.36221,"image":"https://coin-images.coingecko.com/coins/images/69040/large/_ASTER.png?1757326782","pool":"https://www.coingecko.com/en/coins/aster-2"},{"name":"Cronos","symbol":"cro","price":0.04182982,"change":-4.61933,"image":"https://coin-images.coingecko.com/coins/images/7310/large/CRO.png?1794186148","pool":"https://www.coingecko.com/en/coins/crypto-com-chain"},{"name":"Gram (prev. Toncoin)","symbol":"gram","price":1.027,"change":-4.06719,"image":"https://coin-images.coingecko.com/coins/images/17980/large/Gram_Circular_Badge.png?1781524778","pool":"https://www.coingecko.com/en/coins/the-open-network"},{"name":"Morpho","symbol":"morpho","price":1.69,"change":-3.70327,"image":"https://coin-images.coingecko.com/coins/images/29837/large/Morpho-token-icon.png?1726771230","pool":"https://www.coingecko.com/en/coins/morpho"},{"name":"Hedera","symbol":"hbar","price":0.055595,"change":-3.34144,"image":"https://coin-images.coingecko.com/coins/images/3688/large/hbar.png?1696504364","pool":"https://www.coingecko.com/en/coins/hedera-hashgraph"},{"name":"Quant","symbol":"qnt","price":151.5,"change":-3.11651,"image":"https://coin-images.coingecko.com/coins/images/3370/large/5ZOu7brX_400x400.jpg?1696504070","pool":"https://www.coingecko.com/en/coins/quant-network"}]}};
const highlightSource='https://www.coingecko.com/en/highlights';
const mostViewedSource='https://coinmarketcap.com/most-viewed-pages/';
const highlightCards=[
  ['trending','Barkadaha DEX ee la xiisaynayo','Trending DEX pools','https://www.geckoterminal.com/'],
  ['gainers','Kuwa ugu kororka badan','Top gainers',highlightSource],
  ['losers','Kuwa ugu hoos u dhaca badan','Top losers',highlightSource],
  ['new','Barkadaha DEX ee cusub','New DEX pools','https://www.geckoterminal.com/new-pools'],
  ['unlocks','Furitaannada soo socda','Upcoming token unlocks','/unlocks'],
  ['viewed','Coinnada ugu daawashada badan','Most viewed coins',mostViewedSource]
];
const geckoApi='https://api.coingecko.com/api/v3';
function highlightNumber(value){
  return value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))?Number(value):null;
}
function highlightPools(payload){
  const tokens=new Map((payload?.included||[]).map(row=>[row.id,row.attributes]));
  return (payload?.data||[]).filter(row=>row?.attributes?.name&&row.attributes.address).slice(0,8).map(row=>{
    const token=tokens.get(row.relationships?.base_token?.data?.id);
    const a=row.attributes;
    const network=row.relationships?.network?.data?.id||row.id.split('_')[0];
    return {name:a.name,symbol:token?.symbol,image:token?.image_url,price:highlightNumber(a.base_token_price_usd),change:highlightNumber(a.price_change_percentage?.h24),pool:'https://www.geckoterminal.com/'+encodeURIComponent(network)+'/pools/'+encodeURIComponent(a.address)};
  });
}
async function fetchHighlightPools(key){
  const endpoint='https://api.geckoterminal.com/api/v2/networks/'+(key==='new'?'new_pools':'trending_pools');
  for(const url of [endpoint+'?include=base_token',endpoint.replace('/networks/','/networks/solana/')+'?include=base_token',endpoint.replace('/networks/','/networks/eth/')+'?include=base_token']){
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(9000),headers:{accept:'application/json'}});
      if(!response.ok)continue;
      const received=Date.parse(response.headers.get('date'));
      const items=highlightPools(await response.json());
      if(items.length)return {items,retrieved:true,asOf:new Date(Number.isFinite(received)?received:Date.now()).toISOString(),source:url.includes('/solana/')?'GeckoTerminal · Solana':url.includes('/eth/')?'GeckoTerminal · Ethereum':'GeckoTerminal'};
    }catch{}
  }
  throw Error('No DEX pools returned');
}
async function fetchMostViewed(){
  const response=await fetch(mostViewedSource,{headers:{accept:'text/html'},signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw Error('Most viewed feed unavailable');
  const script=(await response.text()).match(/<script\b[^>]*\bid=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  const props=script&&JSON.parse(script[1]).props;
  const state=(props?.dehydratedState||props?.pageProps?.dehydratedState)?.queries?.find(q=>q.queryKey?.[0]==='most-visited')?.state;
  const items=(state?.data?.list||[]).filter(row=>row.name&&row.slug&&Number.isSafeInteger(Number(row.id))).slice(0,8).map(row=>{
    const quote=row.priceChange||row.quote?.USD||row.quotes?.find?.(q=>q.name==='USD')||row;
    return {name:row.name,symbol:row.symbol,price:highlightNumber(quote.price),change:highlightNumber(quote.priceChangePercentage24h??quote.priceChange24h??quote.percentage24h??quote.percentChange24h??quote.percent_change_24h),image:'https://s2.coinmarketcap.com/static/img/coins/64x64/'+Number(row.id)+'.png',pool:'https://coinmarketcap.com/currencies/'+encodeURIComponent(row.slug)+'/'};
  });
  if(!items.length||items.every(row=>row.price===null))throw Error('Most viewed ranking unavailable');
  const updated=Number(state.dataUpdatedAt);
  return {items,source:'CoinMarketCap',asOf:Number.isFinite(updated)&&updated>0&&updated<=Date.now()+60000?new Date(updated).toISOString():new Date().toISOString()};
}
function highlightRanking(){
  return marketData('highlight-ranking-v3',10,async()=>{
    const tickers=await (await gateBubbleTickers()).json();
    const itemsAtExchange=bubbleSeed.filter(coin=>tickers[coin.id]&&Date.now()-tickers[coin.id].time<120000).map(coin=>{
      const q=tickers[coin.id];
      return {name:coin.name,symbol:coin.symbol,image:coin.image,price:q.price,change:q.day,unit:'USDT',pool:'https://www.gate.com/trade/'+encodeURIComponent(coin.symbol)+'_USDT',time:q.time};
    });
    if(itemsAtExchange.length)return {source:'Gate',asOf:new Date(Math.min(...itemsAtExchange.map(q=>q.time))).toISOString(),items:itemsAtExchange.sort((a,b)=>b.change-a.change)};
    const market=await remote(geckoApi+'/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100').catch(()=>[]);
    let items=market.filter(row=>Number.isFinite(row.price_change_percentage_24h)).map(row=>({name:row.name,symbol:row.symbol,asOf:row.last_updated,image:row.image,price:row.current_price,change:row.price_change_percentage_24h,pool:'https://www.coingecko.com/en/coins/'+encodeURIComponent(row.id)}));
    let source='CoinGecko';
    if(!items.length){
      const feed=await remote('https://api.coinpaprika.com/v1/tickers').catch(()=>[]);
      items=feed.filter(row=>row.rank>0 && row.rank<=100 && Number.isFinite(row.quotes?.USD?.percent_change_24h) && row.quotes.USD.price>0).map(row=>({
        name:row.name,symbol:row.symbol,price:row.quotes.USD.price,change:row.quotes.USD.percent_change_24h,
        asOf:row.last_updated,image:'https://static.coinpaprika.com/coin/'+encodeURIComponent(row.id)+'/logo.png',
        pool:'https://coinpaprika.com/coin/'+encodeURIComponent(row.id)+'/'
      }));
      source='CoinPaprika';
    }
    if(!items.length){
      const backup=await (await pricesFeed()).json();
      items=(backup.items||[]).map(row=>{
        const asset=marketCoins.find(([key])=>key===row.symbol);
        const logo=coinFile(row.symbol);
        return {name:asset?.[1]||row.symbol,symbol:row.symbol,price:row.last,change:row.change,image:logo?'/coin-logo/'+logo:null,pool:'https://www.coinbase.com/advanced-trade/spot/'+encodeURIComponent(row.symbol.toUpperCase())+'-USD'};
      });
      source='Coinbase';
    }
    if(!items.length)throw Error('No tracked prices');
    const times=items.map(row=>Date.parse(row.asOf)).filter(Number.isFinite);
    return {source,asOf:times.length?new Date(Math.min(...times)).toISOString():undefined,items:items.sort((a,b)=>b.change-a.change)};
  });
}
const highlightKeys=highlightCards.map(([key])=>key).filter(key=>key!=='unlocks');
const highlightPrefix='highlights:v2:';
async function savedHighlights(db){
  const saved={...highlightSeed};
  const rows=db?await dbAll(db,"SELECT key,value FROM settings WHERE key LIKE 'highlights:v2:%'").catch(()=>[]):[];
  for(const row of rows){
    const key=row.key.slice(highlightPrefix.length);
    if(!highlightKeys.includes(key))continue;
    try{
      const data=JSON.parse(row.value);
      if(Array.isArray(data.items)&&Date.parse(data.asOf)>=(Date.parse(saved[key]?.asOf)||0))saved[key]=data;
    }catch{}
  }
  return saved;
}
function highlightCardFeed(key,db){
  return marketData(highlightPrefix+key,key==='gainers'||key==='losers'?10:45,async()=>{
    const saved=(await savedHighlights(db))[key];
    if(saved&&Date.now()-Date.parse(saved.checkedAt)<(key==='gainers'||key==='losers'?10000:45000))return saved;
    try{
      let data;
      if(key==='viewed')data=await fetchMostViewed();
      else if(key==='trending'||key==='new')data=await fetchHighlightPools(key);
      else{
        const response=await highlightRanking();
        if(!response.ok)throw Error('Unavailable market ranking');
        const ranked=await response.json();
        data={source:ranked.source,asOf:ranked.asOf,items:key==='gainers'?ranked.items.filter(x=>x.change>0).slice(0,8):ranked.items.filter(x=>x.change<0).slice(-8).reverse()};
      }
      const now=new Date().toISOString();
      data={...data,asOf:data.asOf||now,checkedAt:now};
      if(Date.parse(data.asOf)<Date.parse(saved?.asOf))return {...saved,snapshot:true};
      if(db)await dbRun(db,"INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value WHERE json_extract(excluded.value,'$.asOf')>=json_extract(settings.value,'$.asOf')",highlightPrefix+key,JSON.stringify(data)).catch(()=>{});
      return data;
    }catch(error){
      if(saved)return {...saved,snapshot:true};
      throw error;
    }
  });
}
async function highlightsFeed(ctx,db){
  const key=ctx.url.searchParams.get('card');
  if(key==='unlocks'){
    const rows=await unlockRows(db,calendarToday('UTC'),'',6);
    return Response.json(rows.map(r=>({title:r.title,date:r.event_date,icon:coinIcon(r.title.split(/[ ·]/)[0].toLowerCase())})),{headers:{'cache-control':'no-store'}});
  }
  if(key)return highlightKeys.includes(key)?highlightCardFeed(key,db):text('Not found',404);
  const result=await Promise.all(highlightKeys.map(async k=>[k,await (await highlightCardFeed(k,db)).json()]));
  const cards=Object.fromEntries(result);
  return Response.json({...Object.fromEntries(result.map(([k,v])=>[k,v.items||[]])),cards,marketSource:cards.gainers.source||cards.losers.source,trendSource:'GeckoTerminal',ranked:(cards.gainers.items?.length||0)+(cards.losers.items?.length||0)},{headers:{'cache-control':'public,max-age=10'}});
}
function highlightImage(src){
  return typeof src==='string'&&(/^\/coin-logo\/[a-z0-9-]+\.(?:svg|png)$/.test(src)||/^https:\/\/(?:coin-images\.coingecko\.com|assets\.coingecko\.com|assets\.geckoterminal\.com|s2\.coinmarketcap\.com|static\.coinpaprika\.com)\//.test(src));
}
function highlightRows(items){
  return items.map(item=>{
    const image=highlightImage(item.image)?'<img alt="" width="20" height="20" loading="lazy" src="'+escape(item.image)+'">':'';
    const price=Number.isFinite(item.price)?new Intl.NumberFormat('en-US',{style:item.unit?'decimal':'currency',currency:'USD',maximumSignificantDigits:7}).format(item.price)+(item.unit?' '+item.unit:''):'—';
    const change=Number.isFinite(item.change)?(item.change>0?'+':'')+item.change.toFixed(1)+'%':'—';
    return '<tr><th scope="row"><a href="'+escape(item.pool)+'" rel="noopener noreferrer">'+image+escape(item.name)+'</a></th><td>'+price+'</td><td data-direction="'+(item.change>0?'up':item.change<0?'down':'')+'">'+change+'</td></tr>';
  }).join('');
}
function highlightNote(ctx,card){
  const source=card.source+(card.source==='Coinbase'?' · '+t(ctx,'Coinnada la daboolay','Tracked USD pairs'):['CoinGecko','CoinPaprika'].includes(card.source)?' · '+t(ctx,'100-ka ugu waaweyn','Top 100 by market cap'):'');
  return source+(card.source==='Gate'?' · USDT':'')+' · '+(card.snapshot||Date.now()-Date.parse(card.asOf)>180000?t(ctx,'Xog kaydsan','Last known'):t(ctx,'Xogtii','As of'))+' '+new Date(card.asOf).toISOString().slice(0,16).replace('T',' ')+' UTC';
}
async function highlightsPage(ctx,title,db){
  const [rows,saved]=await Promise.all([unlockRows(db,calendarToday('UTC'),'',6),savedHighlights(db)]);
  const cards=highlightCards.map(([key,so,en,more])=>{
    const unlock=key==='unlocks';
    const card=saved[key];
    const list=unlock?rows.map(row=>'<tr><th scope="row">'+coinIcon(row.title.split(/[ ·]/)[0].toLowerCase())+' '+escape(row.title)+'</th><td>'+escape(row.event_date)+'</td></tr>').join(''):card?highlightRows(card.items):'';
    const empty=unlock?t(ctx,'Wax furitaan ah lama hayo.','No upcoming unlocks listed.'):card?t(ctx,'Ma jiraan lacagaha la raacay oo jihadan u dhaqaaqay 24-kii saac ee la soo dhaafay.','No tracked assets moved in this direction over the last 24 hours.'):t(ctx,'Xogta waa la soo rarayaa…','Loading data…');
    const name=key==='new'||key==='trending'?t(ctx,'Barkad','Pool'):'Coin';
    return '<section class="highlight-card"><header><h2>'+t(ctx,so,en)+'</h2>'+publicLink(unlock?editionHref(ctx,more):more,t(ctx,'Dheeraad','More')+' →')+'</header><table><thead><tr><th scope="col">'+name+'</th>'+(unlock?'<th scope="col">'+t(ctx,'Taariikh','Date')+'</th>':'<th scope="col">'+t(ctx,'Qiime','Price')+'</th><th scope="col">24h</th>')+'</tr></thead><tbody data-highlight="'+key+'" data-as-of="'+escape(card?.asOf||'')+'">'+(list||'<tr><td colspan="'+(unlock?2:3)+'">'+empty+'</td></tr>')+'</tbody></table>'+(!unlock?'<p class="meta highlight-note" data-highlight-note="'+key+'">'+(card?escape(highlightNote(ctx,card)):'')+'</p>':'')+'</section>';
  }).join('');
  const pairs=Object.fromEntries(Object.entries(bubbleGatePairs).flatMap(([pair,id])=>{
    const coin=bubbleSeed.find(row=>row.id===id);
    return coin?[[pair,{name:coin.name,image:coin.image}]]:[];
  }));
  const intro='<div class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Isbeddelka 24 saac, kuwa suuqa laga xiiseynayo iyo barkadaha ganacsiga ee cusub.','24-hour market moves, trending assets, and newly created trading pools.')+'</p></div>';
  const nav='<nav class="calendar-tabs"><a href="'+editionHref(ctx,'/markets')+'">'+t(ctx,'Suuqyada','Markets')+'</a><a aria-current="page" href="'+editionHref(ctx,'/highlights')+'">'+t(ctx,'Muuqaalka suuqa','Highlights')+'</a><a href="'+editionHref(ctx,'/topic/stocks')+'">'+t(ctx,'Saamiyada','Stocks')+'</a></nav>';
  return layout(ctx,title,terminalShell(ctx,intro+nav+'<div class="highlight-grid" data-feed="highlights" data-pairs="'+escape(JSON.stringify(pairs))+'">'+cards+'</div><p class="meta highlight-credit">'+publicLink(highlightSource,'CoinGecko')+' · '+publicLink('https://www.geckoterminal.com/','GeckoTerminal')+' · '+publicLink(editionHref(ctx,'/unlocks'),t(ctx,'Ilaha furitaannada','Unlock sources'))+'</p>'),{terminal:'highlights'});
}
