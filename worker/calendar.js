const unlockSource='https://toolz.trade/token-unlocks/';
const unlockReference=[
  ['SOLV · Solv Protocol','2026-11-17',186580000,845320,3.3],
  ['KAITO · Kaito','2026-11-20',17600000,3140000,3.6],
  ['ZRO · LayerZero','2026-11-20',23630000,35560000,3.5],
  ['H · Humanity','2026-11-23',292860000,4600000,6.8],
  ['XPL · Plasma','2026-11-25',227780000,10320000,4.8],
  ['WAL · Walrus','2026-11-25',32710000,782450,1.2],
  ['KNTQ · Kinetiq','2026-11-27',12920000,2850000,4.5],
  ['GRVT · GRVT','2026-11-29',73630000,11980000,41.3],
  ['EIGEN · EigenCloud','2026-11-30',36820000,4820000,3.9],
  ['OP · Optimism','2026-12-01',4470000,350760,.2],
  ['KAITO · Kaito','2026-12-19',17600000,3140000,3.6]
].map(([title,event_date,amount,usd,supply])=>({title,event_date,amount,usd,supply,source:unlockSource}));
const blsSchedule='https://www.bls.gov/schedule/';
const fedSchedule='https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm';
const beaSchedule='https://www.bea.gov/news/schedule/full';
const macroDates=[
  ['2026-11-18','14:00','FOMC meeting minutes','Qoraalka kulanka FOMC','Fed','https://www.federalreserve.gov/newsevents/2026-November.htm'],
  ['2026-11-25','08:30','GDP, second estimate','Qiyaasta labaad ee GDP-ga','BEA',beaSchedule],
  ['2026-11-25','08:30','Personal income and outlays (PCE)','Dakhliga iyo kharashka shaqsiga (PCE)','BEA',beaSchedule],
  ['2026-11-25','14:00','Beige Book','Warbixinta Beige Book','Fed','https://www.federalreserve.gov/newsevents/2026-November.htm'],
  ['2026-12-08','08:30','U.S. international trade','Ganacsiga caalamiga ah ee Maraykanka','BEA',beaSchedule],
  ['2026-12-09','14:00','FOMC rate decision','Go’aanka dulsaarka FOMC','Fed','https://www.federalreserve.gov/newsevents/2026-december.htm'],
  ['2026-12-23','08:30','GDP, third estimate','Qiyaasta saddexaad ee GDP-ga','BEA',beaSchedule],
  ['2026-12-23','08:30','Personal income and outlays (PCE)','Dakhliga iyo kharashka shaqsiga (PCE)','BEA',beaSchedule],
  ['2026-12-30','14:00','FOMC meeting minutes','Qoraalka kulanka FOMC','Fed','https://www.federalreserve.gov/newsevents/2026-december.htm'],
  ...['01-27','03-17','04-28','06-09','07-28','09-15','10-27','11-17'].map(day=>['2027-'+day,'','FOMC meeting concludes (scheduled)','Dhammaadka kulanka FOMC (jadwalaysan)','Fed',fedSchedule])
].map(([date,time,title,so,agency,source])=>({date,time,title,so,agency,source}));
const calendarToday = zone => new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const daysAfter=(day,count)=>new Date(Date.parse(day+'T00:00:00Z')+count*86400000).toISOString().slice(0,10);
async function unlockRows(db,start,end='',limit=200){
  const saved=await dbAll(db,"SELECT * FROM schedules WHERE kind='unlocks' AND event_date>=? AND (?='' OR event_date<?) ORDER BY event_date,id LIMIT 200",start,end,end);
  const matching=unlockReference.filter(x=>x.event_date>=start&&(!end||x.event_date<end)&&!saved.some(r=>r.event_date===x.event_date&&(r.title.toUpperCase().split(/\W+/)[0]===x.title.split(' ')[0]||r.title.toLowerCase()===x.title.split(' · ')[1].toLowerCase())));
  return [...saved,...matching].sort((a,b)=>a.event_date.localeCompare(b.event_date)).slice(0,limit);
}
const novemberRelease='https://www.bls.gov/news.release/archives/ximpim_11172026.htm';
const pncForecast='https://www.pnc.com/content/dam/pnc-com/pdf/aboutpnc/EconomicReports/neoandrounduparchives/PNC_Economics_Research_Weekly_Economic_Roundup_16_November_2026.pdf';
const publishedMacro=[
  ['08:30','Import prices (MoM)','Qiimaha wax soo dejinta (bil kasta)','BLS','+1.1%','+0.7%','+1.1%',novemberRelease],
  ['08:30','Export prices (MoM)','Qiimaha wax dhoofinta (bil kasta)','BLS','+1.1%','+0.4%','+2.4%',novemberRelease],
  ['09:15','Industrial production (MoM)','Wax-soo-saarka warshadaha (bil kasta)','Fed','−0.4%','+0.1%','+0.7%','https://www.federalreserve.gov/releases/g17/20261117/default.htm']
].map(([time,title,so,agency,actual,forecast,previous,source])=>({date:'2026-11-17',time,title,so,agency,actual,forecast,previous,source,forecastSource:pncForecast,importance:'medium'}));
function importanceFor(event){
  if(event.importance)return event.importance;
  if(/FOMC|\bGDP\b|\bPCE\b|Consumer Price Index|^Employment Situation$/i.test(event.title))return 'high';
  if(/Job Openings|Producer Price|Beige Book|International Trade|Import and Export|Productivity|Wages/i.test(event.title))return 'medium';
  return 'low';
}
function resultFields(ctx,event){
  const columns=[['actual','Dhabta','Actual'],['forecast','Saadaasha','Forecast'],['previous','Hore','Previous']];
  return '<dl class="calendar-results">'+columns.map(([name,so,en])=>'<div data-result="'+name+'"><dt>'+t(ctx,so,en)+'</dt><dd>'+escape(event[name]||'—')+(name==='forecast'&&event.forecastSource?' '+publicLink(event.forecastSource,t(ctx,'Isha','Source')+' ↗'):'')+'</dd></div>').join('')+'</dl>';
}
function importanceBadge(ctx,level){
  const label={high:['Sare','High'],medium:['Dhexe','Medium'],low:['Hoose','Low']}[level];
  const count={high:3,medium:2,low:1}[level];
  return '<span class="calendar-impact" data-impact="'+level+'"><span aria-hidden="true">'+'●'.repeat(count)+'</span> '+t(ctx,...label)+'</span>';
}
function calendarRange(ctx,today){
  const view=ctx.url.searchParams.get('view');
  const date=ctx.url.searchParams.get('date')||'';
  const exact=/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
  if(view==='yesterday')return {mode:view,start:daysAfter(today,-1),end:today,size:1};
  if(view==='today')return {mode:view,start:today,end:daysAfter(today,1),size:1};
  if(view==='next-week'){
    const weekday=new Date(today+'T00:00:00Z').getUTCDay();
    const start=daysAfter(today,(8-weekday)%7||7);
    return {mode:view,start,end:daysAfter(start,7),size:7};
  }
  if(view==='week')return {mode:view,start:today,end:daysAfter(today,7),size:7};
  if(view==='date'&&exact)return {mode:view,start:date,end:daysAfter(date,1),size:1};
  return {mode:'',start:today,end:'',size:7};
}
function calendarFilters(ctx,range){
  const links=[['',t(ctx,'Dhammaan','All upcoming')],['yesterday',t(ctx,'Shalay','Yesterday')],['today',t(ctx,'Maanta','Today')],['week',t(ctx,'7 maalmood','Next 7 days')],['next-week',t(ctx,'Toddobaadka dambe','Next week')]];
  const dates='<form action="/calendar" method="get" class="calendar-date-form">'+(ctx.lang==='en'?'<input type="hidden" name="lang" value="en">':'')+'<input type="hidden" name="view" value="date"><label for="calendar-date">'+t(ctx,'Dooro taariikh','Custom date')+'</label><input id="calendar-date" type="date" name="date" required value="'+range.start+'"><button>'+t(ctx,'Eeg','Go')+'</button></form>';
  return '<div class="calendar-range-controls"><nav class="calendar-tabs">'+links.map(([mode,label])=>'<a href="'+editionHref(ctx,'/calendar'+(mode?'?view='+mode:''))+'"'+(range.mode===mode?' aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>'+dates+'</div>';
}
function countryLabel(ctx,code){
  if(!code)return t(ctx,'Dal lama cayimin','Country unspecified');
  if(code==='EU')return t(ctx,'Aagga euro','Euro area');
  if(code==='US')return t(ctx,'Maraykanka','United States');
  return new Intl.DisplayNames([ctx.lang],{type:'region'}).of(code);
}
function macroTable(ctx,rows,start,end,size){
  const fits=x=>x.date>=start&&(!end||x.date<end);
  const primary=rows.map(r=>({date:r.event_date,title:r.title,agency:'Zaki News',source:r.source,time:r.release_time,actual:r.actual,forecast:r.forecast,previous:r.previous,importance:r.importance,country:r.country,edited:true}));
  const bls=blsSnapshot.filter(e=>!(e.date==='2026-11-17'&&/Import and Export Price Indexes/.test(e.title))).map(e=>({...e,agency:'BLS',source:blsSchedule}));
  const timeline=[...macroDates,...publishedMacro,...foreignReleases,...bls];
  for(const entry of primary){
    const index=timeline.findIndex(e=>e.date===entry.date&&[e.title,e.so].some(name=>name?.toLowerCase()===entry.title.toLowerCase()));
    if(index<0)timeline.push(entry);
    else {
      const original=timeline[index];
      timeline[index]={...original,...entry,agency:original.agency,country:entry.country||original.country||'US',title:original.title,time:entry.time||original.time,forecastSource:undefined};
    }
  }
  const known=timeline.filter(fits).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'99').localeCompare(b.time||'99'));
  const localized=(day,options)=>new Intl.DateTimeFormat(ctx.lang,{timeZone:'UTC',...options}).format(new Date(day+'T00:00:00Z'));
  const tag = label => label==='Fed'?'fed':label==='BEA'?'bea':label==='BLS'?'bls':'news';
  const week=Array.from({length:size},(_,i)=>{
    const day=daysAfter(start,i);
    const count=known.filter(e=>e.date===day).length;
    return '<a href="#day-'+day+'" data-week-day="'+day+'"'+(day===calendarToday('America/New_York')?' class="calendar-today"':'')+'><span>'+escape(localized(day,{weekday:'short'}))+'</span><strong>'+day.slice(-2)+'</strong><small data-count>'+count+'</small></a>';
  }).join('');
  const list=known.map(e=>'<article class="calendar-release" data-date="'+e.date+'" data-time="'+(e.time||'')+'" data-country="'+escape(e.country||(e.agency==='Zaki News'?'':'US'))+'" data-agency="'+tag(e.agency)+'" data-title="'+escape(e.title)+'"'+(e.actual||e.edited?' data-reported':'')+'><div class="calendar-date"><strong>'+e.date.slice(-2)+'</strong><span>'+escape(localized(e.date,{month:'short'}))+'</span></div><div class="calendar-event"><span class="calendar-badge">'+escape(e.agency)+'</span><span class="calendar-country">'+escape(countryLabel(ctx,e.country||(e.agency==='Zaki News'?'':'US')))+'</span>'+importanceBadge(ctx,importanceFor(e))+'<h2>'+escape(t(ctx,e.so||e.title,e.title))+'</h2></div><div class="calendar-event-time"><span>'+escape(e.time||'—')+(e.time?' ET':'')+'</span>'+publicLink(e.source,t(ctx,'Isha','Source')+' ↗')+'</div>'+resultFields(ctx,e)+'</article>').join('');
  return '<section data-feed="calendar" data-last-date="'+end+'" data-first-date="'+start+'" class="visual-calendar"><p class="feed-status calendar-status">'+t(ctx,'Jadwalka BLS ee la kaydiyay · 17 Nofeembar 2026','BLS schedule snapshot · Nov 17, 2026')+'</p><div class="calendar-overview"><div><h2>'+(size===1?escape(localized(start,{dateStyle:'long'})):t(ctx,'Toddobaadka muuqda','Seven-day overview'))+'</h2><p>'+t(ctx,'Dooro maalin si aad u eegto dhacdooyinka. Waqtiyada waa ET.','Choose a day to jump to its releases. Times are Eastern.')+'</p></div><nav class="calendar-week" aria-label="'+(size===1?escape(localized(start,{dateStyle:'long'})):t(ctx,'Toddobaadka muuqda','Seven-day overview'))+'">'+week+'</nav></div><p class="meta calendar-impact-note">'+t(ctx,'Muhiimaddu waa qiimaynta tifaftirka Zaki News.','Importance is a Zaki News editorial rating.')+'</p>'+releaseFilter(ctx,rows)+'<div class="calendar-filter"><button type="button" data-agency-filter="all" aria-pressed="true">'+t(ctx,'Dhammaan ilaha','All agencies')+'</button><button type="button" data-agency-filter="fed" aria-pressed="false">Federal Reserve</button><button type="button" data-agency-filter="bea" aria-pressed="false">BEA</button><button type="button" data-agency-filter="bls" aria-pressed="false">BLS</button></div><p class="meta calendar-empty" hidden>'+t(ctx,'Dhacdooyin lagama helin xulashadan.','No releases match this selection.')+'</p><div class="feed-output calendar-releases">'+list+'</div></section><p class="calendar-sources">'+publicLink(blsSchedule,'BLS')+' · '+publicLink(beaSchedule,'BEA')+' · '+publicLink(fedSchedule,'Federal Reserve')+'</p>';
}

const foreignReleases=[
['2026-11-18','GB','ONS','UK consumer prices (annual CPI)','Sicir-bararka UK (CPI sannadle)','https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/october2026','02:00','3.6%','3.5%'],
['2026-12-17','GB','BoE','UK monetary policy decision','Go’aanka siyaasadda lacagta UK','https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates'],
['2026-12-17','EU','ECB','Euro area monetary policy meeting','Kulanka siyaasadda lacagta ee aagga euro','https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html'],
['2026-12-09','CA','BoC','Bank of Canada rate announcement','Go’aanka dulsaarka Bangiga Kanada','https://www.bankofcanada.ca/press/upcoming-events/'],
['2026-12-08','AU','RBA','Reserve Bank monetary policy meeting concludes','Dhammaadka kulanka siyaasadda lacagta ee RBA','https://www.rba.gov.au/schedules-events/board-meeting-schedules.html'],
['2026-12-18','JP','BoJ','Bank of Japan monetary policy meeting concludes','Dhammaadka kulanka siyaasadda lacagta ee Bangiga Jabaan','https://www.boj.or.jp/en/mopo/mpmsche_minu/m_ref/mref250731a.pdf']
].map(([date,country,agency,title,so,source,time,actual,previous])=>({date,country,agency,title,so,source,time,actual,previous,importance:'high'}));
function releaseFilter(ctx,rows){
 const levels=[['all',t(ctx,'Dhammaan','All levels')],['high',t(ctx,'Sare oo keliya','High only')],['medium',t(ctx,'Dhexe oo keliya','Medium only')],['low',t(ctx,'Hoose oo keliya','Low only')]];
 const regions=[...new Set(['US',...foreignReleases.map(r=>r.country),...rows.map(r=>r.country).filter(Boolean)])];
 const select=(id,label,pairs)=>'<label>'+label+'<select data-cal-field="'+id+'">'+pairs.map(([v,l])=>'<option value="'+escape(v)+'">'+escape(l)+'</option>').join('')+'</select></label>';
 return '<div class="calendar-query">'+select('impact',t(ctx,'Muhiimadda','Importance'),levels)+select('country',t(ctx,'Dalka ama gobolka','Country or region'),[['all',t(ctx,'Dhammaan','All countries')],...regions.map(v=>[v,countryLabel(ctx,v)])])+'</div>';
}
