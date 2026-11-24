const futuresInstruments = {
  GC:['Gold','Dahab','USD/troy oz'],
  SI:['Silver','Qalin','USD/troy oz'],
  CL:['WTI crude oil','Saliidda WTI','USD/bbl'],
  NG:['Natural gas','Gaaska dabiiciga ah','USD/MMBtu'],
  ES:['E-mini S&P 500','E-mini S&P 500','pts'],
  NQ:['E-mini Nasdaq 100','E-mini Nasdaq 100','pts'],
  ZC:['Corn','Galley','¢/bu']
};
const futuresBoards = {commodities:['GC','SI','CL','NG'],futures:['ES','NQ','ZC','GC','CL']};
const futuresLatest = new Map();
const futuresRequests = new Map();

function readContractQuote(id, payload){
  const record=payload?.chart?.result?.[0], meta=record?.meta, bars=record?.indicators?.quote?.[0]?.close;
  if(meta?.symbol!==id+'=F' || !Array.isArray(bars) || !Array.isArray(record.timestamp)) throw Error('Invalid futures series');
  const valid=bars.map((price,i)=>({price,time:record.timestamp[i]})).filter(bar=>Number.isFinite(bar.price)&&Number.isFinite(bar.time)&&bar.time>0);
  if(valid.length<2) throw Error('Incomplete futures history');
  const last=valid.at(-1);
  const recent=Number.isFinite(meta.regularMarketPrice)&&Number.isFinite(meta.regularMarketTime)&&meta.regularMarketTime>=last.time&&meta.regularMarketTime-last.time<36*3600;
  const price=recent?meta.regularMarketPrice:last.price;
  const previous=recent&&Number.isFinite(meta.fulldayChange)?Number((price-meta.fulldayChange).toFixed(6)):valid.at(-2).price;
  const time=recent?meta.regularMarketTime:last.time;
  const history=valid.slice(-20).map(bar=>Number(bar.price.toFixed(4)));
  history[history.length-1]=price;
  const [name,so,unit]=futuresInstruments[id],symbol=id+'=F';
  return {name,so,symbol,unit,contract:String(meta.shortName||symbol),price,previous,asOf:new Date(time*1000).toISOString(),source:'Yahoo Finance',url:'https://finance.yahoo.com/quote/'+encodeURIComponent(symbol)+'/',history};
}
function initialBoardQuotes(key){
  return (futuresBoards[key]||[]).map(id=>futuresLatest.get(id)?.row||futuresSeed[id]);
}
async function loadContractQuote(id){
  const cached=futuresLatest.get(id);
  if(cached?.until>Date.now())return cached.row;
  if(futuresRequests.has(id))return futuresRequests.get(id);
  const request=(async()=>{
    let row=cached?.row||futuresSeed[id],ttl=60000;
    try{
      const url='https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(id+'=F')+'?interval=1d&range=1mo';
      const response=await fetch(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(3200)});
      if(!response.ok)throw Error('Futures feed unavailable');
      const fresh=readContractQuote(id,await response.json());
      if(fresh.asOf>=row.asOf)row=fresh;
      ttl=300000;
    }catch{}
    futuresLatest.set(id,{row,until:Date.now()+ttl});
    return row;
  })().finally(()=>futuresRequests.delete(id));
  futuresRequests.set(id,request);
  return request;
}
function loadBoardQuotes(key){
  return Promise.all((futuresBoards[key]||[]).map(loadContractQuote));
}

const futuresSeed={"GC":{"name":"Gold","so":"Dahab","symbol":"GC=F","unit":"USD/troy oz","contract":"Gold Dec 26","price":3726.3,"previous":3864.2,"asOf":"2026-11-18T20:18:54.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/GC%3DF/","history":[4060.3999,4007.8999,4038.3999,4074.6001,4051.6001,4031.3999,3898.8999,3969.6001,3940.3999,4073,4113.5,4074.8999,4114.5,4030.2,4000.5,3885.3,3886.3,3853,3864.2,3726.3]},"SI":{"name":"Silver","so":"Qalin","symbol":"SI=F","unit":"USD/troy oz","contract":"Silver Dec 26","price":44.91,"previous":47.357,"asOf":"2026-11-18T20:19:00.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/SI%3DF/","history":[54.764,53.711,54.108,54.293,53.457,52.191,49.097,50.72,49.587,52.12,52.233,51.803,52.564,51.101,51.881,49.972,49.031,46.785,47.288,44.91]},"CL":{"name":"WTI crude oil","so":"Saliidda WTI","symbol":"CL=F","unit":"USD/bbl","contract":"Crude Oil Dec 26","price":82.15,"previous":84.65,"asOf":"2026-11-18T20:18:58.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/CL%3DF/","history":[99.47,103.27,101.76,99.9,102.78,102,104.12,96.46,96.09,88.12,90.52,90.83,86.85,86.04,86.53,88.74,88.56,85.72,86.01,82.15]},"NG":{"name":"Natural gas","so":"Gaaska dabiiciga ah","symbol":"NG=F","unit":"USD/MMBtu","contract":"Natural Gas Dec 26","price":3.402,"previous":3.208,"asOf":"2026-11-18T20:19:02.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/NG%3DF/","history":[2.796,2.64,2.602,2.697,2.817,2.952,2.898,2.856,2.895,2.959,2.947,2.998,3.218,3.296,3.215,3.34,3.23,3.122,3.208,3.402]},"ES":{"name":"E-mini S&P 500","so":"E-mini S&P 500","symbol":"ES=F","unit":"pts","contract":"E-Mini S&P 500 Dec 26","price":7344.75,"previous":7359,"asOf":"2026-11-18T20:19:03.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/ES%3DF/","history":[7704.5,7659.75,7714.5,7758.25,7783.25,7754.25,7614,7574.5,7596.75,7720.5,7383,7402,7574.25,7544.25,7640.5,7615.25,7583,7439,7359,7344.75]},"NQ":{"name":"E-mini Nasdaq 100","so":"E-mini Nasdaq 100","symbol":"NQ=F","unit":"pts","contract":"Nasdaq 100 Dec 26","price":27159.5,"previous":27075.5,"asOf":"2026-11-18T20:19:01.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/NQ%3DF/","history":[29142,29117.75,29437.25,29812,29979.5,29562,28534,28127.5,28305.75,28566.75,26752,27085.25,28014.5,27835.25,28473.25,28384.5,28034.75,27284.25,27075.5,27159.5]},"ZC":{"name":"Corn","so":"Galley","symbol":"ZC=F","unit":"¢/bu","contract":"Corn Futures,Dec-2026","price":448.25,"previous":459.25,"asOf":"2026-11-18T19:19:59.000Z","source":"Yahoo Finance","url":"https://finance.yahoo.com/quote/ZC%3DF/","history":[460.5,456,455,448.75,451.75,451.25,447.75,448.25,442.5,444.25,440,441.5,439.25,449,448,442.5,445.5,448.75,446.75,448.25]}};
