// Farside's fund-level observations are net subscriptions or redemptions in USD millions.
const fcFunds = {
  BTC: ['Bitcoin', 'btc', [[4,243.9,-239.9],[76.5,68.6,7.9],[0,185.4,-185.4],[3.3,287.4,-284.1],[9,308.8,-299.8]]],
  ETH: ['Ethereum', 'eth', [[1.3,30.4,-29.1],[1,9.4,-8.4],[11.6,9.3,2.3],[1.6,72.1,-70.5],[0,144.8,-144.8]]],
  SOL: ['Solana', 'sol', [[0,0,0],[11.7,0,11.7],[0,3.1,-3.1],[1.7,3.6,-1.9],[0,5.9,-5.9]]],
  HYPE: ['Hyperliquid', 'hyp', [[0,1.5,-1.5],[0,7.9,-7.9],[0,0,0],[0,0,0],[0,1.7,-1.7]]],
  ZEC: ['Zcash', 'zec', [[0,0,0],[0,9,-9],[0,4.1,-4.1],[0,9.9,-9.9],[0,14.6,-14.6]]]
};
const fcFlowDates = ['2026-11-17','2026-11-16','2026-11-13','2026-11-12','2026-11-11'];
const fcNasdaq = 'https://www.nasdaq.com/market-activity/';
const fcNasdaqApi = 'https://api.nasdaq.com/api/';
const fcChecked = '2026-11-18';
const fcEarningsSeeds = [
  {date:'2026-11-17', symbol:'NVDA', name:'NVIDIA', when:'after', actual:'$2.70', source:'NVIDIA', url:'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/'},
  {date:'2026-11-18', symbol:'TGT', name:'Target', when:'before', actual:'$2.65', previous:'$1.51', source:'Target', url:'https://corporate.target.com/news-features/article/2026/11/q3-2026-earnings'},
  {date:'2026-11-18', symbol:'PANW', name:'Palo Alto Networks', when:'after', source:'Palo Alto Networks', url:'https://investors.paloaltonetworks.com/news-releases/news-release-details/palo-alto-networks-announce-fiscal-first-quarter-2027-financial'},
  {date:'2026-11-19', symbol:'WMT', name:'Walmart', when:'before', source:'Walmart', url:'https://corporate.walmart.com/news/2026/11/Walmart-To-Host-Q3-Earnings-Call-Nov-19-2026'}
];
const fcIpoSeeds = [
  {date:'2026-11-18', symbol:'ANT', name:'Anthropic, PBC', price:'70.00–78.00', exchange:'Nasdaq Global Select', stage:'expected', source:'Issuer filing',url:'https://www.fidelity.com/bin-public/600_Fidelity_Institutional/fidelityinstitutional/Application/AP154833/documents/clients/ANTLLV/ANTLLVfwp_4.pdf'},
  {date:'2026-11-02', symbol:'NARA', name:'Narragansett Bancorp', price:'10.00',exchange:'Nasdaq Capital',stage:'priced',source:'Flash Finance',url:'https://flashfinanceusa.com/ipos/'},
  {date:'2026-10-22', symbol:'LYCA', name:'Lycia Therapeutics', price:'18.00',exchange:'Nasdaq',stage:'priced',source:'Lycia Therapeutics',url:'https://ir.lyciatx.com/news-releases/news-release-details/lycia-therapeutics-announces-pricing-upsized-initial-public'}
];
const fcMemory = new Map(), fcInFlight = new Map();
function fcRemember(key, record) {
  fcMemory.delete(key);
  fcMemory.set(key, record);
  if (fcMemory.size > 100) fcMemory.delete(fcMemory.keys().next().value);
}
function fcFallback(rows) {
  return {rows, checked:fcChecked, mode:rows.length ? 'reference' : 'unknown'};
}
async function fcData(ctx,key,initial,fetchRows,work) {
  const now = Date.now();
  const address = new URL('/__market-cache/v3/'+key,ctx.url.origin).href;
  const cloud = globalThis.caches?.default;
  let entry = fcMemory.get(address);
  if (!entry && cloud) {
    try {
      const saved = await cloud.match(address);
      if(saved) { entry = await saved.json(); fcRemember(address,entry); }
    } catch {}
  }
  if (entry && entry.refreshAfter > now) return entry;
  const fallback = entry || initial;
  let update = fcInFlight.get(address);
  if (!update) {
    update = (async()=>{
      try {
        const rows = await fetchRows();
        const result = {rows, checked:new Date().toISOString(), mode:'source', refreshAfter:now+15*60000};
        fcRemember(address,result);
        if(cloud) {
          try { await cloud.put(address,Response.json(result,{headers:{'cache-control':'public, max-age=604800'}})); } catch {}
        }
        return result;
      } catch {
        const result = {...fallback,mode:key.startsWith('flows-')?'reference':fallback.mode,refreshAfter:now+90000};
        fcRemember(address,result);
        return result;
      }
    })().finally(()=>fcInFlight.delete(address));
    fcInFlight.set(address,update);
  }
  return update;
}
async function fcRead(url,html=false) {
  const response=await fetch(url,{signal:AbortSignal.timeout(6500),headers:{accept:html?'text/html':'application/json'}});
  if(!response.ok) throw Error('Provider unavailable');
  return html?response.text():response.json();
}
function fcDate(input) {
  if(typeof input!=='string')return '';
  const iso=input.match(/^\d{4}-\d{2}-\d{2}$/), us=input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const s=iso?input:us?us[3]+'-'+us[1].padStart(2,'0')+'-'+us[2].padStart(2,'0'):'';
  if(!s) return '';
  const d=new Date(s+'T12:00:00Z');
  return Number.isFinite(+d)&&d.toISOString().startsWith(s)?s:'';
}
function fcFlowNumber(cell) {
  const raw=cell.replace(/,/g,'').trim();
  if(!/^(?:-?\d+(?:\.\d+)?|\(\d+(?:\.\d+)?\))$/.test(raw))return null;
  return raw[0]==='('?-Number(raw.slice(1,-1)):Number(raw);
}
function fcParseFlow(markup) {
  const rows=new Map(), months='Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  for(const [,row] of markup.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells=[...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(x=>x[1].replace(/<[^>]*>/g,'').replace(/&nbsp;|&#160;|&#xa0;/gi,' ').trim());
    const date=cells[0]?.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
    const month=date ? months.indexOf(date[2])+1 : 0;
    if(!month||cells.length<3)continue;
    const day=fcDate(date[3]+'-'+String(month).padStart(2,'0')+'-'+date[1].padStart(2,'0'));
    const data=cells.slice(1,-1).map(fcFlowNumber), total=fcFlowNumber(cells.at(-1));
    if(!day||total==null||!data.some(n=>n!==null)||cells.slice(1,-1).some((v,i)=>data[i]===null&&!/^(?:-|–|—|)$/.test(v)))continue;
    rows.set(day,{date:day,partial:data.includes(null),inflow:data.reduce((s,v)=>s+Math.max(v,0),0),outflow:data.reduce((s,v)=>s+Math.max(-v,0),0),net:total});
  }
  if(!rows.size)throw Error('No complete sessions');
  return [...rows.values()].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,15);
}
function fcNasdaqRows(payload,type,date) {
  const data=payload?.data;
  if(!data||payload.status?.rCode && payload.status.rCode!==200) throw Error('Calendar unavailable');
  if(type==='earnings') {
    if(!Object.hasOwn(data,'rows') || !(data.rows===null || Array.isArray(data.rows)))throw Error('Invalid calendar');
    if(data.asOf) {
      const stamp=Date.parse(data.asOf);
      if(Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)!==date)throw Error('Calendar date mismatch');
    }
    return (data.rows||[]).filter(r=>r.name && r.symbol).map(r=>({date,symbol:r.symbol,name:r.name,when:/after/.test(r.time)?'after':/pre-market/.test(r.time)?'before':'unknown',forecast:r.epsForecast,previous:r.lastYearEPS,source:'Nasdaq',url:fcNasdaq+'earnings?date='+date}));
  }
  const upcoming=data.upcoming?.upcomingTable?.rows ?? data.upcoming?.rows, priced=data.priced?.rows;
  if(!data.upcoming&&!data.priced || (!Array.isArray(upcoming)&&!Array.isArray(priced)))throw Error('Invalid calendar');
  const entries=[];
  for(const [list,stage] of [[upcoming,'expected'],[priced,'priced']]) {
    for(const r of list||[]) {
      const day=fcDate(stage==='priced'?r.pricedDate:r.expectedPriceDate);
      if(!day.startsWith(date+'-')||!r.companyName)continue;
      entries.push({date:day,name:r.companyName,symbol:r.proposedTickerSymbol || r.tickerSymbol || '—',exchange:r.proposedExchange || r.exchange || '—',stage,price:r.proposedSharePrice || r.sharePrice || '—',source:'Nasdaq',url:fcNasdaq+'ipos'});
    }
  }
  return entries.sort((a,b)=>a.stage===b.stage?(a.stage==='expected'?a.date.localeCompare(b.date):b.date.localeCompare(a.date)):(a.stage==='expected'?-1:1));
}
function fcFmt(ctx,date) {
  if(ctx.lang!=='en')return Number(date.slice(8,10))+' '+ipoMonth(ctx,date.slice(0,7));
  return new Intl.DateTimeFormat('en-US' ,{dateStyle:'medium',timeZone:'UTC'}).format(new Date(date.slice(0,10)+'T12:00:00Z'));
}
function fcToday() {
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
function fcLabel(ctx,status) {
  return status==='source'?t(ctx,'Isha la hubiyey','Source checked'):t(ctx,'Xog kaydsan oo la hubiyey','Verified reference snapshot');
}
function fcTable(headers,rows) {
  return '<div class="fc-scroll"><table class="fc-table"><thead><tr>'+headers.map(x=>'<th scope="col">'+escape(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(cols=>'<tr>'+cols.map(s=>'<td>'+s+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function fcMillions(n,sign=false) {
  return (n<0?'−':sign&&n>0?'+':'')+'$'+new Intl.NumberFormat('en-US',{minimumFractionDigits:1,maximumFractionDigits:1}).format(Math.abs(n))+'M';
}
function fcRate(n) {
  return '<span class="'+(n>0?'fc-plus':n<0?'fc-minus':'')+'">'+fcMillions(n,true)+'</span>';
}
function fcChip(ctx,path,label,selected) {
  return '<a href="'+escape(editionHref(ctx,path))+'"'+(selected?' aria-current="page"':'')+'>'+escape(label)+'</a>';
}
async function fcPublishedFlows(slug, url, earliest) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  async function read(address, json) {
    const response = await fetch(address, {signal:controller.signal, headers:{accept:json?'application/json':'text/html'}});
    if (!response.ok) throw Error('ETF source unavailable');
    const html = json ? (await response.json())[0]?.content?.rendered : await response.text();
    const rows = fcParseFlow(html);
    if (rows[0].date < earliest) throw Error('Older ETF report');
    return rows;
  }
  try {
    const api = 'https://farside.co.uk/wp-json/wp/v2/pages?slug='+slug+'&_fields=content';
    return await Promise.any([read(api,true),read(url,false)]);
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}
async function fcFlowPage(ctx,work) {
  const query=ctx.url.searchParams.get('asset')||'BTC';
  const ticker=Object.hasOwn(fcFunds,query)?query:'BTC', [name,slug,values]=fcFunds[ticker];
  const url='https://farside.co.uk/'+slug+'/';
  const initial=fcFallback(values.map(([inflow,outflow,net],i)=>({date:fcFlowDates[i],inflow,outflow,net})));
  if(flowReference[slug]?.length){initial.rows=flowReference[slug];initial.checked='2026-11-24';}
  const data=await fcData(ctx,'flows-v4/'+ticker,initial,()=>fcPublishedFlows(slug,url,initial.rows[0].date),work);
  const first=data.rows[0],title=t(ctx,'Qulqulka ETF-yada crypto','Crypto ETF flows');
  const instruments=Object.entries(fcFunds).map(([k,[label]])=>('<a class="flow-asset" href="'+escape(editionHref(ctx,'/etf-flows?asset='+k))+'"'+(k===ticker?' aria-current="page"':'')+'>'+coinIcon(k.toLowerCase())+escape(label)+'</a>')).join('');
  const sideIn=t(ctx,'Lacagta soo gashay','Fund inflows'),sideOut=t(ctx,'Lacagta baxday','Fund outflows'),balance=t(ctx,'Farqiga saafiga ah','Net flow');
  const rows=data.rows.map(r=>[fcFmt(ctx,r.date)+(r.partial?' · '+t(ctx,'Qayb ahaan','Partial') : ''),fcMillions(r.inflow),fcMillions(r.outflow),fcRate(r.net)]);
  const figures=[[sideIn,'fc-plus',fcMillions(first.inflow)],[sideOut,'fc-minus',fcMillions(first.outflow)],[balance,first.net>=0?'fc-plus':'fc-minus',fcMillions(first.net,true)]].map(([label,cls,value])=>'<div><span>'+label+'</span><strong class="'+cls+'">'+value+'</strong></div>').join('');
  const body='<header class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Lacagta maalin kasta soo gasha ama ka baxda sanduuqyada crypto ee Maraykanka.','Daily subscriptions and redemptions across U.S. crypto funds.')+'</p></header><nav class="calendar-tabs" aria-label="'+t(ctx,'Hantida','Assets')+'">'+instruments+'</nav><script defer src="/etf-client.js"></script><section class="fc-board" data-etf="'+slug+'" data-session="'+first.date+'"><h2 class="flow-name">'+coinIcon(ticker.toLowerCase())+name+' · '+fcFmt(ctx,first.date)+(first.partial?' · '+t(ctx,'Qayb ahaan','Partial'):'')+'</h2><div class="fc-figures">'+figures+'</div><p class="meta">'+t(ctx,'Gelitaanka iyo bixitaanku waa wadarta dhaqdhaqaaqa saafiga ah ee sanduuq kasta. Qiimayaashu waa malaayiin doolar.','Inflows sum funds with positive net flow. Outflows sum the redemptions of funds with negative net flow. Figures are in millions of U.S. dollars.')+'</p>'+fcTable([t(ctx,'Maalinta suuqa','Trading session'),sideIn,sideOut,balance],rows)+'<p class="meta">'+fcLabel(ctx,data.mode)+' · '+fcFmt(ctx,data.checked)+' · '+publicLink(url,'Farside Investors')+'</p></section>';
  return layout(ctx,title,terminalShell(ctx,body),{terminal:'etf-flows'});
}
function fcDateControls(ctx,type,selected) {
  const monthly=type==='ipo',path=monthly?'/ipo-calendar':'/earnings-calendar',field=monthly?'month':'date';
  const d=new Date((monthly?selected+'-01':selected)+'T12:00:00Z');
  function shifted(step) {
    const n=new Date(d);
    if(monthly)n.setUTCMonth(n.getUTCMonth()+step);else n.setUTCDate(n.getUTCDate()+step);
    return n.toISOString().slice(0,monthly?7:10);
  }
  const hidden=ctx.lang==='en'?'<input type="hidden" name="lang" value="en">':'';
  return '<div class="calendar-range-controls"><nav class="calendar-tabs">'+(monthly?'':fcWeekTabs(ctx,''))+fcChip(ctx,path+'?'+field+'='+shifted(-1),t(ctx,'← Hore','← Previous'),false)+fcChip(ctx,path,monthly?t(ctx,'Bishan','This month'):t(ctx,'Maanta','Today'),selected===fcToday().slice(0,monthly?7:10))+fcChip(ctx,path+'?'+field+'='+shifted(1),t(ctx,'Xiga →','Next →'),false)+'</nav><form class="calendar-date-form" method="get" action="'+path+'">'+hidden+'<label for="fc-date">'+(monthly?t(ctx,'Bisha','Month'):t(ctx,'Taariikhda','Date'))+'</label><input required type="'+field+'" name="'+field+'" id="fc-date" value="'+selected+'"><button>'+t(ctx,'Eeg','Show')+'</button></form></div>';
}
async function fcCorporatePage(ctx,type,work) {
  const week=ctx.url.searchParams.get('week');
  if(type==='earnings' && ['this','next'].includes(week)) return fcWeekPage(ctx,week,work);
  const monthly=type==='ipo',field=monthly?'month':'date',requested=ctx.url.searchParams.get(field);
  const selected=(monthly && /^\d{4}-(?:0[1-9]|1[0-2])$/.test(requested||'')?requested:!monthly?fcDate(requested):'')||fcToday().slice(0,monthly?7:10);
  const title=monthly?t(ctx,'Jadwalka IPO-yada','IPO calendar'):t(ctx,'Jadwalka natiijooyinka shirkadaha','Earnings calendar');
  const seed=(monthly?fcIpoSeeds:fcEarningsSeeds).filter(r=>r.date.startsWith(selected));
  const endpoint=fcNasdaqApi+(monthly?'ipo/calendar':'calendar/earnings')+'?date='+selected;
  const data=await fcData(ctx,type+'/'+selected,fcFallback(seed),async()=>fcNasdaqRows(await fcRead(endpoint),type,selected),work);
  const official=fcNasdaq+(monthly?'ipos':'earnings?date='+selected);
  const headings=monthly?[t(ctx,'Taariikhda qiimaynta','Pricing date'),t(ctx,'Shirkadda','Company'),t(ctx,'Heerka','Status'),t(ctx,'Suuqa','Exchange'),t(ctx,'Qiimaha (USD)','Offer price (USD)'),t(ctx,'Isha','Source')]:[t(ctx,'Shirkadda','Company'),t(ctx,'Waqtiga (ET)','U.S. market session'),t(ctx,'EPS la sheegay','Reported EPS'),t(ctx,'Qiyaasta EPS','EPS forecast'),t(ctx,'EPS sanadkii hore','Year-ago EPS'),t(ctx,'Isha','Source')];
  const rows=data.rows.map(r=>{
    const name='<b>'+escape(r.symbol)+'</b> '+escape(r.name),source=publicLink(r.url,r.source);
    if(monthly)return [fcFmt(ctx,r.date),name,r.stage==='expected'?t(ctx,'La filayo','Expected'):t(ctx,'La qiimeeyey','Priced'),escape(r.exchange),escape(r.price),source];
    const when=r.when==='before'?t(ctx,'Ka hor furitaanka','Before open'):r.when==='after'?t(ctx,'Ka dib xiritaanka','After close'):'—';
    return [name,when,escape(r.actual||'—'),escape(r.forecast||'—'),escape(r.previous||'—'),source];
  });
  const intro=monthly?t(ctx,'Soo-bandhigyada saamiyada ee Maraykanka. Taariikhda qiimaynta ee la filayo way isbeddeli kartaa.','U.S. initial public offerings, with expected and completed pricing dates. Expected dates may change.'):t(ctx,'Warbixinnada dakhliga shirkadaha suuqa Maraykanka, maalinta ay shaaciyaan.','Companies reporting earnings in the U.S. market on the selected day.');
  const selectedLabel=monthly?new Intl.DateTimeFormat(ctx.lang==='en'?'en-US':'so-SO',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(selected+'-01T12:00:00Z')):fcFmt(ctx,selected);
  const empty=data.mode==='source'?t(ctx,'Ishu wax dhacdo ah uma qorin muddadan.','The source lists no events for this period.'):t(ctx,'Xog la xaqiijiyey oo muddadan ah lama hayo. Ka eeg jadwalka Nasdaq.','A verified schedule is unavailable for this period. Check the Nasdaq calendar.');
  const status=data.mode==='unknown'?'':fcLabel(ctx,data.mode)+' · '+fcFmt(ctx,data.checked)+' · ';
  const body='<header class="calendar-intro"><h1>'+title+'</h1><p>'+intro+'</p></header>'+fcDateControls(ctx,type,selected)+'<section class="fc-board"><h2>'+selectedLabel+'</h2>'+(rows.length?fcTable(headings,rows):'<p>'+empty+'</p>')+'<p class="meta">'+status+publicLink(official,'Nasdaq')+'</p></section>';
  return layout(ctx,title,terminalShell(ctx,body),{terminal:monthly?'ipo-calendar':'earnings-calendar'});
}

function fcWeekTabs(ctx,week) {
  return fcChip(ctx,'/earnings-calendar?week=this',t(ctx,'Toddobaadkan','This week'),week==='this')
    +fcChip(ctx,'/earnings-calendar?week=next',t(ctx,'Toddobaadka dambe','Next week'),week==='next');
}
async function fcWeekPage(ctx,week,work) {
  const monday=new Date(fcToday()+'T12:00:00Z');
  monday.setUTCDate(monday.getUTCDate()-(monday.getUTCDay()+6)%7+(week==='next'?7:0));
  const dates=Array.from({length:7},(_,i)=>new Date(+monday+i*86400000).toISOString().slice(0,10));
  const days=await Promise.all(dates.map(async date=>{
    const initial=fcFallback(fcEarningsSeeds.filter(r=>r.date===date));
    const data=await fcData(ctx,'earnings/'+date,initial,async()=>fcNasdaqRows(await fcRead(fcNasdaqApi+'calendar/earnings?date='+date),'earnings',date),work);
    const daily=editionHref(ctx,'/earnings-calendar?date='+date);
    const rows=data.rows.map(r=>['<b>'+escape(r.symbol)+'</b>',escape(r.name),escape(r.forecast||'—')]);
    const message=data.mode==='source'?t(ctx,'Wax warbixin ah laguma qorin.','No earnings listed.'):t(ctx,'Xogta lama heli karo.','Schedule unavailable.');
    return '<section class="fc-board"><h2><a href="'+escape(daily)+'">'+fcFmt(ctx,date)+'</a></h2>'+
      (rows.length?fcTable([t(ctx,'Astaanta','Ticker'),t(ctx,'Shirkadda','Company'),t(ctx,'Qiyaasta EPS','EPS forecast')],rows):'<p>'+message+'</p>')+
      '<p class="meta">'+(data.mode==='unknown'?'':fcLabel(ctx,data.mode)+' · '+fcFmt(ctx,data.checked)+' · ')+publicLink(fcNasdaq+'earnings?date='+date,'Nasdaq')+'</p></section>';
  }));
  const title=t(ctx,'Jadwalka natiijooyinka shirkadaha','Earnings calendar');
  const body='<header class="calendar-intro"><h1>'+title+'</h1><p>'+fcFmt(ctx,dates[0])+' – '+fcFmt(ctx,dates[6])+'</p></header><nav class="calendar-tabs">'+fcWeekTabs(ctx,week)+fcChip(ctx,'/earnings-calendar',t(ctx,'Maanta','Today'),false)+'</nav>'+days.join('');
  return layout(ctx,title,terminalShell(ctx,body),{terminal:'earnings-calendar'});
}
