const ipoNovember=[{"date":"2026-11-02","stage":"withdrawn","name":"GLAMOORE Capital Group Co Ltd.","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-02","stage":"priced","name":"Narragansett Bancorp, Inc.","symbol":"NARA","exchange":"NASDAQ Capital","price":"10.00","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-04","stage":"filed","name":"Churchill Capital Corp XIV","symbol":"CXIVU","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-04","stage":"withdrawn","name":"DT House Ltd","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-05","stage":"filed","name":"Guitar Group Ltd","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-05","stage":"filed","name":"Kartoon Studios Acquisition Corp","symbol":"KACQU","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-06","stage":"filed","name":"AParadise III Acquisition Corp.","symbol":"APCDU","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-06","stage":"filed","name":"BEHNEH Ltd","symbol":"BENE","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-06","stage":"filed","name":"UC Automotive Holdings Inc.","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-09","stage":"withdrawn","name":"Bitari Inc","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-09","stage":"filed","name":"Research Alliance Corp V","symbol":"RACV","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-09","stage":"filed","name":"ZA Acquisition Corp. I","symbol":"ZACAU","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-10","stage":"filed","name":"American Barrick Gold Corp","symbol":"ABGC","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-13","stage":"filed","name":"CloudDepots Holdings Inc.","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-13","stage":"filed","name":"Compute AI Acquisition Corp.","symbol":"AICPU","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-13","stage":"priced","name":"Modern Mining Technology Corp.","symbol":"MDRN","exchange":"NYSE MKT","price":"4.25","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-13","stage":"priced","name":"vVARDIS Holding AG","symbol":"VVVV","exchange":"NYSE","price":"18.00","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-13","stage":"priced","name":"WINDWARD BIO GROUP AG","symbol":"WWB","exchange":"NASDAQ Global","price":"17.00","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-16","stage":"filed","name":"Core Specialty Insurance Holdings, Inc.","symbol":"CORE","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-16","stage":"withdrawn","name":"EIR Biopharma, Inc.","symbol":"","exchange":"","price":"","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-19","stage":"expected","name":"ANTHROPIC, PBC","symbol":"ANT","exchange":"NASDAQ Global Select","price":"70.00-78.00","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"},{"date":"2026-11-20","stage":"expected","name":"Football Manager SPAC Inc.","symbol":"FBLLU","exchange":"NASDAQ Global","price":"10.00","source":"Nasdaq","url":"https://www.nasdaq.com/market-activity/ipos?date=2026-11"}];
function ipoRows(payload,month) {
  const data=payload?.data;
  if(!data || (payload.status?.rCode && payload.status.rCode!==200)) throw Error('IPO calendar unavailable');
  const groups=[
    [data.upcoming?.upcomingTable || data.upcoming,'expected','expectedPriceDate'],
    [data.priced,'priced','pricedDate'],[data.filed,'filed','filedDate'],[data.withdrawn,'withdrawn','withdrawDate']
  ];
  if(!groups.some(([g])=>g && (Array.isArray(g.rows)||g.rows===null)))throw Error('Invalid IPO calendar');
  const events=new Map();
  for(const [group,stage,field] of groups) {
    for(const r of group?.rows || []) {
      const date=fcDate(r[field]);
      if(!date.startsWith(month+'-') || !r.companyName)continue;
      const key=[date,stage,r.dealID || r.companyName].join('/');
      events.set(key,{date,stage,name:r.companyName,symbol:r.proposedTickerSymbol||r.tickerSymbol||'',exchange:r.proposedExchange||r.exchange||'',price:stage==='priced'||stage==='expected'?r.proposedSharePrice||r.sharePrice||'':'',source:'Nasdaq',url:fcNasdaq+'ipos?date='+month});
    }
  }
  return [...events.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.name.localeCompare(b.name));
}
const ipoMonths=[
  ['Janaayo','Febraayo','Maarso','Abriil','Maajo','Juun','Luulyo','Agoosto','Sebteembar','Oktoobar','Nofeembar','Diseembar'],
  ['January','February','March','April','May','June','July','August','September','October','November','December']
];
function ipoMonth(ctx,month) {
  return ipoMonths[ctx.lang==='en'?1:0][Number(month.slice(5,7))-1]+' '+month.slice(0,4);
}
async function ipoCalendarPage(ctx,work) {
  const tr=(so,en)=>t(ctx,so,en), q=ctx.url.searchParams, today=fcToday();
  const month=/^(?:19|20)\d\d-(?:0[1-9]|1[0-2])$/.test(q.get('month')||'')?q.get('month'):today.slice(0,7);
  const labels={expected:tr('La filayo','Expected'),priced:tr('La qiimeeyey','Priced'),filed:tr('La diiwaangeliyey','Filed'),withdrawn:tr('Laga noqday','Withdrawn')};
  const stage=Object.hasOwn(labels,q.get('status'))?q.get('status'):'';
  const day=fcDate(q.get('day')).startsWith(month+'-')?q.get('day'):'';
  const descending=q.get('sort')==='desc';
  function link(values) {
    const p=new URLSearchParams({month,status:stage,day,sort:descending?'desc':''});
    for(const [k,v] of Object.entries(values))p.set(k,v);
    for(const k of ['status','day','sort'])if(!p.get(k))p.delete(k);
    return escape(editionHref(ctx,'/ipo-calendar?'+p.toString()));
  }
  const seed=(month==="2026-11"?ipoNovember:fcIpoSeeds).filter(r=>r.date.startsWith(month));
  const data=await fcData(ctx,'ipo/v3/'+month,fcFallback(seed),async()=>ipoRows(await fcRead(fcNasdaqApi+'ipo/calendar?date='+month,false,6500),month),work);
  const filtered=data.rows.filter(r=>!stage||r.stage===stage), counts=new Map();
  for(const r of filtered)counts.set(r.date,(counts.get(r.date)||0)+1);
  const rows=filtered.filter(r=>!day||day===r.date).sort((a,b)=>(descending?-1:1)*a.date.localeCompare(b.date)||a.name.localeCompare(b.name));
  const first=new Date(month+'-01T12:00:00Z'),last=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  const weekdays=ctx.lang==='en'?['Mo','Tu','We','Th','Fr','Sa','Su']:['Isn','Tal','Arb','Kha','Jim','Sab','Axa'];
  let grid=weekdays.map(w=>'<span class="ipo-weekday">'+w+'</span>').join('')+'<i></i>'.repeat((first.getUTCDay()+6)%7);
  for(let n=1;n<=last;n++) {
    const iso=month+'-'+String(n).padStart(2,'0'),count=counts.get(iso)||0;
    grid+='<a href="'+link({day:day===iso?'':iso})+'" aria-label="'+n+' '+ipoMonth(ctx,month)+' · '+count+' '+tr('dhacdo','events')+'" class="ipo-day'+(count?' has-events':'')+(today===iso?' is-today':'')+'"'+(day===iso?' aria-current="date"':'')+'>'+n+'</a>';
  }
  const tabs=[['',tr('Dhammaan','All')],...Object.entries(labels)].map(([k,v])=>'<a href="'+link({status:k,day:''})+'"'+(stage===k?' aria-current="page"':'')+'>'+v+' <b>'+data.rows.filter(r=>!k||r.stage===k).length+'</b></a>').join('');
  const list=rows.map(r=>'<li><time datetime="'+r.date+'"><strong>'+Number(r.date.slice(8,10))+'</strong>'+ipoMonths[ctx.lang==='en'?1:0][first.getUTCMonth()].slice(0,3)+'</time><div class="ipo-company"><span class="ipo-status '+r.stage+'">'+labels[r.stage]+'</span><strong>'+escape(r.name)+'</strong><small>'+[r.symbol,r.exchange].filter(Boolean).map(escape).join(' · ')+'</small></div><div class="ipo-value">'+(r.price?'<strong>'+escape(r.price)+' USD</strong>':'')+publicLink(r.url,r.source)+'</div></li>').join('');
  const clear=day?'<a href="'+link({day:''})+'">'+tr('Bisha oo dhan','Full month')+' →</a>':'';
  const summary=data.mode==='unknown'?tr('Jadwalka bisha lama helin.','The monthly schedule is currently unavailable.'):tr('Ma jiraan dhacdooyin ku jira xulashadan.','No events match this selection.');
  const checked=data.mode==='unknown'?'':tr('Xogtii la hubiyey','Snapshot checked')+' '+Number(data.checked.slice(8,10))+' '+ipoMonth(ctx,data.checked.slice(0,7))+' · ';
  const title=tr('Jadwalka IPO-yada','IPO calendar');
  const body='<header class="calendar-intro"><h1>'+title+'</h1><p>'+tr('La soco IPO-yada Maraykanka laga bilaabo diiwaangelinta ilaa qiimaynta. Taariikhaha la filayo way isbeddeli karaan.','Track U.S. IPOs from filing through pricing. Expected dates may change.')+'</p></header>'+fcDateControls(ctx,'ipo',month)+'<div class="ipo-layout"><section class="ipo-panel"><h2>'+ipoMonth(ctx,month)+'</h2><div class="ipo-grid">'+grid+'</div><small class="ipo-key">'+tr('Maalin leh dhacdo','Day with an event')+'</small></section><section class="ipo-panel"><h2>'+tr('Dhacdooyinka IPO-yada','IPO activity')+'</h2><nav class="ipo-tabs">'+tabs+'</nav><div class="ipo-controls">'+(day?'<strong>'+Number(day.slice(8))+' '+ipoMonth(ctx,month)+'</strong>':'')+clear+'<a class="ipo-sort" href="'+link({sort:descending?'':'desc'})+'">'+(descending?tr('Ugu dambeeyey ↓','Latest first ↓'):tr('Ugu horreeyey ↑','Earliest first ↑'))+'</a></div>'+(list?'<ul class="ipo-list">'+list+'</ul>':'<p>'+summary+'</p>')+'<p class="meta">'+checked+publicLink(fcNasdaq+'ipos?date='+month,'Nasdaq IPO Calendar')+'</p></section></div>';
  return layout(ctx,title,terminalShell(ctx,body),{terminal:'ipo-calendar'});
}
