var tradingViewCryptoSymbols={
  BTC:'BINANCE:BTCUSDT',ETH:'BINANCE:ETHUSDT',SOL:'BINANCE:SOLUSDT',XRP:'BINANCE:XRPUSDT',
  BNB:'BINANCE:BNBUSDT',ADA:'BINANCE:ADAUSDT',DOGE:'BINANCE:DOGEUSDT',USDT:'BINANCE:USDTUSD',
  LINK:'BINANCE:LINKUSDT',AVAX:'BINANCE:AVAXUSDT',SUI:'BINANCE:SUIUSDT',TRX:'BINANCE:TRXUSDT',
  NEAR:'BINANCE:NEARUSDT',LTC:'BINANCE:LTCUSDT',ATOM:'BINANCE:ATOMUSDT',DOT:'BINANCE:DOTUSDT',
  XLM:'BINANCE:XLMUSDT',BCH:'BINANCE:BCHUSDT',HBAR:'BINANCE:HBARUSDT',TON:'COINBASE:TONUSD',
  ALGO:'BINANCE:ALGOUSDT',ICP:'BINANCE:ICPUSDT',VET:'BINANCE:VETUSDT',FIL:'BINANCE:FILUSDT',
  GRT:'BINANCE:GRTUSDT',ISLM:'CRYPTO:ISLMUSD',ICX:'HTX:ICXUSDT',QUAI:'MEXC:QUAIUSDT',
  GUN:'BINANCE:GUNUSDT',CYS:'MEXC:CYSUSDT',AAVE:'BINANCE:AAVEUSDT',UNI:'BINANCE:UNIUSDT',
  CRV:'BINANCE:CRVUSDT',COMP:'BINANCE:COMPUSDT',SNX:'BINANCE:SNXUSDT',SUSHI:'BINANCE:SUSHIUSDT',
  MKR:'CRYPTO:MKRUSD',CAKE:'BINANCE:CAKEUSDT','1INCH':'BINANCE:1INCHUSDT',LDO:'BINANCE:LDOUSDT',
  BAL:'HTX:BALUSDT',MORPHO:'BINANCE:MORPHOUSDT',PENDLE:'BINANCE:PENDLEUSDT',JUP:'BINANCE:JUPUSDT',
  RAY:'BINANCE:RAYUSDT',CVX:'BINANCE:CVXUSDT',JTO:'BINANCE:JTOUSDT',HYPE:'BINANCE:HYPEUSDT',
  ENA:'BINANCE:ENAUSDT',KMNO:'BINANCE:KMNOUSDT',GMX:'BINANCE:GMXUSDT',YFI:'BINANCE:YFIUSDT',
  OHM:'CRYPTO:OHMUSD',SHIB:'BINANCE:SHIBUSDT',PEPE:'BINANCE:PEPEUSDT',BONK:'BINANCE:BONKUSDT',
  WIF:'BINANCE:WIFUSDT',FLOKI:'BINANCE:FLOKIUSDT',PENGU:'BINANCE:PENGUUSDT',BRETT:'BYBIT:BRETTUSDT',
  FARTCOIN:'MEXC:FARTCOINUSDT',SPX:'BYBIT:SPXUSDT',MOG:'BYBIT:MOGUSDT',POPCAT:'BYBIT:POPCATUSDT',
  TURBO:'BINANCE:TURBOUSDT',BABYDOGE:'BYBIT:BABYDOGEUSDT',MEW:'BYBIT:MEWUSDT',TAC:'MEXC:TACUSDT',
  REKT:'KUCOIN:REKTUSDT',CFG:'BINANCE:CFGUSDT',HASHAI:'CRYPTO:HASHAIUSD',
  POL:'BINANCE:POLUSDT',MATIC:'BINANCE:POLUSDT',APT:'BINANCE:APTUSDT',ARB:'BINANCE:ARBUSDT',
  OP:'BINANCE:OPUSDT',INJ:'BINANCE:INJUSDT',SEI:'BINANCE:SEIUSDT',TIA:'BINANCE:TIAUSDT',
  WLD:'BINANCE:WLDUSDT',RENDER:'BINANCE:RENDERUSDT',RNDR:'BINANCE:RENDERUSDT'
};
function tvHtmlEscape(value){
  return String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function tradingViewBaseSymbol(code){
  const raw=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(raw==='USDT'||raw==='USD'||raw==='USDC') return raw;
  return raw.replace(/USDT$/,'').replace(/USD$/,'');
}
function tradingViewChartUrl(tvSymbol){
  return 'https://www.tradingview.com/chart/?symbol='+encodeURIComponent(tvSymbol);
}
function tradingViewSymbolsUrl(base){
  return 'https://www.tradingview.com/symbols/'+encodeURIComponent(base)+'USD/';
}
function tradingViewSearchUrl(query){
  return 'https://www.tradingview.com/search/?query='+encodeURIComponent(query);
}
function tradingViewCryptoTarget(code){
  const base=tradingViewBaseSymbol(code);
  if(!base) return {href:tradingViewSearchUrl('crypto'),tv:null,base:''};
  if(base==='USDT') return {href:tradingViewChartUrl('BINANCE:USDTUSD'),tv:'BINANCE:USDTUSD',base};
  const mapped=tradingViewCryptoSymbols[base];
  if(mapped) return {href:tradingViewChartUrl(mapped),tv:mapped,base};
  return {href:tradingViewSymbolsUrl(base),tv:null,base};
}
function tradingViewChartHref(kind,code){
  if(kind==='forex'){
    const slug=String(code||'').replace('/','').toUpperCase().replace(/[^A-Z]/g,'');
    return slug?tradingViewChartUrl('FX:'+slug):tradingViewSearchUrl('forex');
  }
  return tradingViewCryptoTarget(code).href;
}
function tradingViewLinkAttrs(kind,code,label){
  const href=tradingViewChartHref(kind,code);
  return 'href="'+tvHtmlEscape(href)+'" target="_blank" rel="noopener noreferrer"'+(label?' aria-label="'+tvHtmlEscape(label)+'"':'');
}
function chartArrowIcon(){
  return '<svg class="ed-chart-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4-5 3 2.5 5-7"/><path d="M14 6h5v5"/></svg>';
}
function coinChartAnchor(symbol,innerHtml,className){
  const href=tradingViewChartHref('crypto',symbol);
  const cls='ed-coin-link'+(className?' '+className:'');
  return '<a class="'+cls+'" href="'+tvHtmlEscape(href)+'" target="_blank" rel="noopener noreferrer" data-chart-href="'+tvHtmlEscape(href)+'">'+innerHtml+'<span class="ed-row-affordance" aria-hidden="true">'+chartArrowIcon()+'</span></a>';
}
