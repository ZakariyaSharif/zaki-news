const marketViews = [
  ['crypto','Crypto','Crypto'],['stocks','Saamiyo','Stocks'],['forex','Forex','Forex'],
  ['commodities','Badeecooyin','Commodities'],['etfs','ETF-yada','ETFs'],
  ['indices','Tusmooyin','Indices'],['bonds','Bonds','Bonds'],['futures','Futures','Futures'],['options','Options','Options']
];
const watchlists = {
  stocks:stockGroups, etfs:etfGroups,
  commodities:[{name:'Metals · USD per troy ounce',symbols:[{name:'COMEX:GC1!',displayName:'Gold'},{name:'COMEX:SI1!',displayName:'Silver'}]},
    {name:'Energy futures',symbols:[{name:'NYMEX:CL1!',displayName:'WTI crude oil'},{name:'NYMEX:NG1!',displayName:'Natural gas'}]}],
  indices:[{name:'Global equity benchmarks',symbols:[{name:'SP:SPX',displayName:'S&P 500'},{name:'XETR:DAX',displayName:'DAX'},{name:'TVC:NI225',displayName:'Nikkei 225'},{name:'TVC:UKX',displayName:'FTSE 100'}]}],
  bonds:[{name:'Government bond yields · %',symbols:[{name:'TVC:US02Y',displayName:'U.S. 2-year'},{name:'TVC:US10Y',displayName:'U.S. 10-year'},{name:'TVC:DE10Y',displayName:'Germany 10-year'},{name:'TVC:GB10Y',displayName:'UK 10-year'},{name:'TVC:JP10Y',displayName:'Japan 10-year'}]}],
  futures:[{name:'Continuous futures',symbols:[{name:'CME_MINI:ES1!',displayName:'E-mini S&P 500'},{name:'CME_MINI:NQ1!',displayName:'E-mini Nasdaq 100'},{name:'CBOT:ZC1!',displayName:'Corn'},{name:'COMEX:GC1!',displayName:'Gold'},{name:'NYMEX:CL1!',displayName:'WTI crude oil'}]}]
};
const marketRefs={
  stocks:['https://www.tradingview.com/markets/stocks-usa/','U.S. equities'],
  commodities:['https://www.tradingview.com/markets/futures/quotes-metals/','Commodities'],
  indices:['https://www.tradingview.com/markets/indices/','Indices'],
  bonds:['https://www.tradingview.com/markets/bonds/','Bonds'],
  futures:['https://www.tradingview.com/markets/futures/','Futures'],
  etfs:['https://www.tradingview.com/markets/etfs/','ETFs']
};
function assetWatchlist(ctx,key,title){
  const source=marketRefs[key];
  return '<section class="asset-board stock-board"><h2>'+title+'</h2><p class="meta">'+t(ctx,'Xigashooyinku way dib dhici karaan.','Market quotes may be delayed.')+'</p><iframe class="stock-widget" data-stock-widget src="/embed/stocks?view='+key+'" title="'+escape(title)+'" loading="lazy"></iframe><p class="meta">'+publicLink(source[0],'TradingView · '+source[1])+'</p></section>';
}
async function marketDirectory(ctx){
  const selected=marketViews.find(([key])=>key===ctx.url.searchParams.get('asset'))||marketViews[0];
  const [key,...name]=selected,title=t(ctx,'Suuqyada','Markets');
  const tabs=marketViews.map(([k,so,en])=>'<a href="'+editionHref(ctx,'/markets?asset='+k)+'"'+(key===k?' aria-current="page"':'')+'>'+t(ctx,so,en)+'</a>').join('');
  const tools=[['/etf-flows','Dhaqdhaqaaqa ETF-yada','Crypto ETF flows','farside.png'],['/crypto-bubbles','Goobooyinka crypto','Crypto bubbles','bubble.png'],['/liquidations','Liquidations','Liquidation maps','coinglass.png'],['/ipo-calendar','Jadwalka IPO','IPO calendar','nasdaq.png'],['/earnings-calendar','Jadwalka natiijooyinka','Earnings calendar','nasdaq.png'],['/profit-calculator','Xisaabiyaha faa’iidada','Profit calculator','zaki-news.svg']];
  let panel;
  if(key==='crypto'){
    const rows=marketCoins.map(([symbol,name])=>{
      const href=tradingViewChartHref('crypto',symbol);
      const label=t(ctx,'Fur jaantuska '+name,'Open '+name+' chart');
      const attrs='href="'+escape(href)+'" target="_blank" rel="noopener noreferrer"';
      return '<tr class="ed-chart-row" data-symbol="'+symbol+'" data-chart-href="'+escape(href)+'"><th scope="row"><a class="ed-row-pair" '+attrs+' aria-label="'+escape(label)+'"><span class="md-asset">'+coinIcon(symbol)+'<span>'+name+'<small>'+symbol.toUpperCase()+'</small></span></span><span class="ed-row-affordance" aria-hidden="true">'+chartArrowIcon()+'</span></a></th><td><a class="ed-row-fill" '+attrs+'><span data-price>—</span></a></td><td><a class="ed-row-fill" '+attrs+'><span data-change>—</span></a></td></tr>';
    }).join('');
    panel=`<section class="md-quotes" data-feed="prices"><header><h2>${t(ctx,'Qiimaha crypto','Crypto prices')}</h2><span>USD</span></header><table><thead><tr><th>${t(ctx,'Hantida','Asset')}</th><th>${t(ctx,'Qiimaha','Price')}</th><th>${t(ctx,'Isbeddelka 24 saac','24h change')}</th></tr></thead><tbody>${rows}</tbody></table><footer><small class="feed-status">${t(ctx,'Qiimaha waa la soo rarayaa…','Loading prices…')}</small></footer></section>`;
  }
  else if(key==='forex')panel=forexPanel(ctx);
  else if(boardKeys.includes(key))panel=quoteBoard(ctx,key,initialBoard(key));
  else if(key==='options')panel=await optionsPanel(ctx);
  else panel=assetWatchlist(ctx,key,t(ctx,...name));
  const toolLinks=tools.map(([path,so,en,logo])=>brandTextLink(editionHref(ctx,path),t(ctx,so,en),logo,false,22)).join('');
  return layout(ctx,title,terminalShell(ctx,'<div class="calendar-intro market-dir-head"><div><h1>'+title+'</h1><p>'+t(ctx,'Qiimayaasha, jadwallada iyo qalabka falanqaynta.','Quotes, calendars and analysis tools.')+'</p></div>'+brandTextLink('https://openmarket.xyz/chart/',t(ctx,'Fur OpenMarket','Open OpenMarket'),'openmarket.png',true,20)+'</div><nav class="calendar-tabs market-asset-tabs" aria-label="'+t(ctx,'Nooca suuqa','Asset class')+'">'+tabs+'</nav><div class="md-workspace">'+panel+'<section class="market-directory-tools"><h2>'+t(ctx,'Qalabka suuqa','Market tools')+'</h2><nav>'+toolLinks+'</nav></section></div>'),{terminal:'markets'});
}

const btcReference={"current_price":62720,"market_cap":1261366255019,"fully_diluted_valuation":1261366255019,"total_volume":29984218205,"circulating_supply":20113584.0,"total_supply":20113584.0,"max_supply":21000000.0,"last_updated":"2026-11-18T20:18:51.000Z","sparkline_in_7d":{"price":[74337.98129874114,74611.6280097872,74324.68765926987,73848.99946130472,73974.39237853957,74001.90945618937,73618.20760770398,73726.02395760041,73723.45795738098,73653.39800115851,73520.31409124001,73447.00944510209,73568.08757681768,73514.62103219664,73418.45786146475,73389.91976468395,72856.42671119889,72825.91896574483,72430.22223898851,71556.4976716257,71616.68759967582,71695.04702699768,71849.39056211835,71690.35783236731,71625.74137494797,71387.66421752376,71487.23999034359,71340.7937996463,71371.98179897292,71052.33930233476,70886.98183936866,70188.12927983407,68890.87991590923,68532.51646842291,68061.87153268598,69030.26857111577,68541.47136569543,68653.21567647788,69040.70816010499,69289.69937056383,69286.62052490411,69142.0218628958,69507.45186755419,68909.1788432082,68807.00149272927,68639.5209753773,68880.48102821194,68930.61015165603,68994.20009353379,68823.09552053588,68337.05941880542,68207.54911636558,68313.70902611547,68274.25966478884,68233.8075125134,67621.86872372568,66690.70426774895,67054.61033509567,67160.26822632327,67327.36587532032,67133.3860365805,66942.47050543895,67362.91767220595,67240.30314738455,67218.39598185298,66955.0930616253,66786.8048274595,65874.67059980397,65673.06797337186,65287.25025448834,65845.01360243217,65517.95008224577,65721.85345962984,64831.88673943902,64373.838171882126,63499.562995782304,64120.23641294355,63431.105585693615,62612.091267342206,64899.0306220412,64793.54792415406,64929.41051486239,64506.1577056442,64438.49529864544,63980.0998172542,65072.58610697661,65321.22831931773,65548.55905232039,65345.31730237392,65466.694691479905,65425.223528978335,64763.99912867202,64718.75767898356,64675.8490798868,64518.19391135823,64688.6449487791,64923.57120497924,65097.86195002081,64985.26381800684,65213.89335510144,65305.28100747828,64920.51933484184,64618.51379343789,65138.915046335635,65066.21210463768,64769.53652723007,64403.15777999201,64692.50391260767,64956.58639435864,64420.58311639449,64286.77058139021,64533.12824964768,64405.34159654138,64103.92561208807,64130.55867192955,65141.76926671121,64435.51420691097,64864.54405582736,64854.89525427694,64998.06856780755,65010.149357084294,64999.940289933664,65285.151309586974,65275.13388194327,64840.87214441952,64583.29048568659,64699.24903560675,64444.516880221825,65003.32889138183,65004.51887622641,64784.50557078899,64499.9086921933,64695.52249538236,64284.547394575755,64314.20295487598,64048.474633548074,64937.734334575805,65007.69026303453,65078.971878639255,64948.648785512865,64076.259815565296,63699.65229903979,63768.08236691125,63704.601588813624,63693.44345544392,63911.91942684638,64285.53906753395,64671.74081425819,64889.41287553966,64726.94251109558,64259.66766864903,64268.518075914326,64395.70010600627,64358.87366122951,64611.80281547387,64554.79309639872,64827.5694909401,64619.33194117355,64564.34122404954,64304.4465607284,64166.28930137854,64030.44107532666,63873.83289785344,63586.72970445223,63074.25116186108,62656.51530031366,63051.11228094392,63117.25134694089]},"price_change_percentage_1h_in_currency":-0.602,"price_change_percentage_24h_in_currency":-1.72231,"price_change_percentage_7d_in_currency":-15.7266,"price_change_percentage_14d_in_currency":-21.8751,"price_change_percentage_30d_in_currency":-23.3955,"price_change_percentage_1y_in_currency":-32.7556};

let lastBitcoinOverview=null;
async function loadBitcoinOverview(){
  try{
    const [coin]=await remote('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=true&price_change_percentage=1h,24h,7d,14d,30d,1y');
    if(!(coin.current_price>0&&Number.isFinite(coin.current_price)&&Array.isArray(coin.sparkline_in_7d?.price)&&!isNaN(Date.parse(coin.last_updated))))throw Error('Incomplete quote');
    coin.quoteSource='CoinGecko';
    lastBitcoinOverview=coin;
    return coin;
  }catch(error){
    try{
      const stats=await remote(priceApi+'/products/BTC-USD/stats');
      const last=Number(stats.last);
      if(!(last>0&&Number.isFinite(last))) throw Error('Price unavailable');
      const base=lastBitcoinOverview?{...lastBitcoinOverview}:{...btcReference,sparkline_in_7d:{price:[...(btcReference.sparkline_in_7d?.price||[])]}};
      base.current_price=last;
      base.last_updated=new Date().toISOString();
      base.quoteSource='Coinbase';
      const open=Number(stats.open);
      if(open>0) base.price_change_percentage_24h_in_currency=(last/open-1)*100;
      lastBitcoinOverview=base;
      return base;
    }catch{
      if(lastBitcoinOverview) return lastBitcoinOverview;
      throw error;
    }
  }
}
async function bitcoinOverviewCoin(){
  const response=await marketData('bitcoin-overview',180,loadBitcoinOverview);
  if(response.ok){
    const coin=await response.json();
    if(coin&&!coin.error) return coin;
  }
  return lastBitcoinOverview||btcReference;
}
async function marketSnapshot(){
  const pack=(id,row,source)=>({
    price:Number(row?.current_price??row?.price),
    change:Number(row?.price_change_percentage_24h??row?.price_change_percentage_24h_in_currency??row?.change),
    spark:(row?.sparkline_in_7d?.price||row?.spark||[]).filter(Number.isFinite),
    source
  });
  try{
    const rows=await remote('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&sparkline=true&price_change_percentage=24h');
    const btc=rows.find(c=>c.id==='bitcoin');
    const eth=rows.find(c=>c.id==='ethereum');
    if(btc?.current_price>0 && Array.isArray(btc.sparkline_in_7d?.price)){
      return {btc:pack('btc',btc,'CoinGecko'),eth:eth?.current_price>0?pack('eth',eth,'CoinGecko'):null};
    }
  }catch{}
  const out={btc:null,eth:null};
  try{
    const coin=await bitcoinOverviewCoin();
    if(coin?.current_price>0) out.btc=pack('btc',coin,coin.quoteSource||'CoinGecko');
  }catch{}
  const fill=async symbol=>{
    const stats=await remote('https://api.exchange.coinbase.com/products/'+symbol+'-USD/stats');
    const last=Number(stats.last),open=Number(stats.open);
    if(!(last>0)) return null;
    let spark=[];
    try{
      const candles=await remote('https://api.exchange.coinbase.com/products/'+symbol+'-USD/candles?granularity=3600');
      if(Array.isArray(candles)) spark=candles.slice().sort((a,b)=>a[0]-b[0]).map(r=>Number(r[4])).filter(Number.isFinite);
    }catch{}
    return {price:last,change:(open>0?(last/open-1)*100:null),spark,source:'Coinbase'};
  };
  try{ if(!out.eth) out.eth=await fill('ETH'); }catch{}
  try{ if(!out.btc) out.btc=await fill('BTC'); }catch{}
  return out;
}

function bitcoinPanel(ctx,coin){
  const price=Number(coin.current_price),num=new Intl.NumberFormat(ctx.lang,{notation:'compact',maximumFractionDigits:2});
  const digits=x=>Number.isFinite(x)?num.format(x):'—';
  const values=coin.sparkline_in_7d?.price?.filter(Number.isFinite)||[];
  const min=Math.min(...values),max=Math.max(...values);
  const points=values.map((v,i)=>(i*600/Math.max(values.length-1,1)).toFixed(1)+','+(88-(v-min)*82/(max-min||1)).toFixed(1)).join(' ');
  const metrics=[['Qiimaha suuqa','Market cap',coin.market_cap],['Qiimaynta buuxda','Fully diluted valuation',coin.fully_diluted_valuation],['Mugga 24 saac','24h trading volume',coin.total_volume],['Sahayda wareegaysa','Circulating supply',coin.circulating_supply],['Wadarta sahayda','Total supply',coin.total_supply],['Sahayda ugu badan','Max supply',coin.max_supply]];
  const returns=['1h','24h','7d','14d','30d','1y'].map(k=>{const n=coin['price_change_percentage_'+k+'_in_currency'];return '<div><small>'+k+'</small><b>'+(Number.isFinite(n)?(n>0?'+':'')+n.toFixed(2)+'%':'—')+'</b></div>';}).join('');
  return '<section class="market-block btc-overview" data-btc-overview data-btc-price="'+price+'"><h2>'+coinChartAnchor('BTC',coinIcon('btc')+'<span>'+t(ctx,'Dulmarka Bitcoin','Bitcoin overview')+'</span>')+'</h2><div class="btc-split"><div><strong class="btc-price">'+usd(price)+'</strong><p>'+t(ctx,'Qiimaha 7 maalmood · USD','7-day price · USD')+'</p><svg role="img" aria-label="'+t(ctx,'Qiimaha Bitcoin toddobaadkii','Bitcoin price over seven days')+'" viewBox="0 0 600 94"><polyline fill="none" stroke="#e67d12" stroke-width="3" points="'+points+'"/></svg><div class="btc-returns">'+returns+'</div></div><dl>'+metrics.map(([so,en,n],i)=>'<div><dt>'+t(ctx,so,en)+'</dt><dd>'+(i<3?'$':'')+digits(n)+(i>=3?' BTC':'')+'</dd></div>').join('')+'</dl></div><div class="btc-convert"><label>BTC <input type="number" min="0" step="any" value="1" data-btc-amount></label><span>⇄</span><label>USD <input type="number" min="0" step="any" value="'+price+'" data-usd-amount></label></div><p>'+publicLink('https://bitcoin.org/','Bitcoin.org')+' · '+publicLink('https://bitcoin.org/bitcoin.pdf','Whitepaper')+' · '+publicLink('https://mempool.space/','Mempool')+' · '+publicLink('https://bitcoin.org/en/choose-your-wallet','Wallets')+' · '+publicLink('https://github.com/bitcoin/bitcoin','GitHub')+' · '+publicLink('https://bitcointalk.org/','Bitcoin Forum')+'</p><p class="meta">'+t(ctx,'Isha','Source')+' · '+(coin.quoteSource==='Coinbase'?publicLink('https://www.coinbase.com/','Coinbase'):publicLink('https://www.coingecko.com/en/coins/bitcoin','CoinGecko'))+' · '+escape((coin.last_updated||'').slice(0,16).replace('T',' '))+' UTC</p></section>';
}
