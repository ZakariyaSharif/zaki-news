const lang = document.documentElement.lang;
const t = (so,en) => lang==='en'?en:so;
const usd = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:n<.01?6:n<1?4:2}).format(n);
const json = async url => {
  const res=await fetch(url);
  if(!res.ok) throw Error('Feed unavailable');
  return res.json();
};
const status = (panel, value) => { panel.querySelector('.feed-status').textContent=value; };
const unavailable = panel => status(panel,t('Xogta hadda lama heli karo.','Data is temporarily unavailable.'));
function element(tag,value){
  const node=document.createElement(tag);
  node.textContent=value;
  return node;
}
try {
  document.documentElement.dataset.theme=localStorage.getItem('zaki-theme') || 'light';
} catch {}
document.querySelectorAll('[data-theme-toggle]').forEach(button=>button.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='light'?'dark':'light';
  document.documentElement.dataset.theme=theme;
  try {localStorage.setItem('zaki-theme',theme);} catch {}
}));
const pricePanels=[...document.querySelectorAll('[data-feed="prices"]')];
async function updatePrices(){
  try {
    const {items,fetchedAt}=await json('/data/prices');
    for(const panel of pricePanels){
      for(const row of panel.querySelectorAll('[data-symbol]')){
        const item=items.find(x=>x.symbol===row.dataset.symbol);
        const price=row.querySelector('[data-price]');
        if(!item && row.dataset.quoteTime){
          const age=Date.now()-Number(row.dataset.quoteTime);
          if(age>=0 && age<300000){
            price.textContent=row.dataset.quoteValue+' · '+t('Hore','Last known')+' '+new Date(Number(row.dataset.quoteTime)).toLocaleTimeString();
            continue;
          }
        }
        if(item){
          row.dataset.quoteTime=String(Date.parse(fetchedAt));
          row.dataset.quoteValue=usd(item.last);
        }
        const change=row.querySelector('[data-change]');
        row.querySelector('[data-price]').textContent=item?usd(item.last):'—';
        change.textContent=item?(item.change>=0?'+':'')+item.change.toFixed(2)+'%':'';
        change.dataset.direction=item?(item.change>=0?'up':'down'):'';
      }
      status(panel,[...new Set(items.map(x=>x.source||'Coinbase'))].join(' + ')+' · '+new Date(fetchedAt).toLocaleTimeString());
    }
  }catch{pricePanels.forEach(unavailable);}
}
if(pricePanels.length){updatePrices();setInterval(()=>{if(!document.hidden)updatePrices();},45000);}
for(const panel of document.querySelectorAll('[data-feed]:not([data-feed="prices"])')){
  const key=panel.dataset.feed;
  if(key==='calendar'){
    const list=panel.querySelector('.calendar-releases');
    const empty=panel.querySelector('.calendar-empty');
    const filterButtons=[...panel.querySelectorAll('[data-agency-filter]')];
    const days=[...panel.querySelectorAll('[data-week-day]')];
    let filter='all';
    const fields=[...panel.querySelectorAll('[data-cal-field]')];
    const query=new URL(location.href);
    fields.forEach(field=>{
      const requested=query.searchParams.get(field.dataset.calField);
      if([...field.options].some(opt=>opt.value===requested))field.value=requested;
      field.addEventListener('change',()=>{organize();});
    });
    function organize(){
      for(const field of fields){
        const key=field.dataset.calField;
        if(field.value==='all')query.searchParams.delete(key);else query.searchParams.set(key,field.value);
        for(const a of document.querySelectorAll('.calendar-range-controls a')){
          const link=new URL(a.href);
          if(field.value==='all')link.searchParams.delete(key);else link.searchParams.set(key,field.value);
          a.href=link.href;
        }
        const form=document.querySelector('.calendar-date-form');
        if(form){let input=form.querySelector('input[name="'+key+'"]');if(!input){input=document.createElement('input');input.type='hidden';input.name=key;form.append(input);}input.value=field.value;}
      }
      history.replaceState(null,'',query);
      const rows=[...list.children].sort((a,b)=>a.dataset.date.localeCompare(b.dataset.date)||(a.dataset.time||'99').localeCompare(b.dataset.time||'99'));
      let last='',visible=0;
      const counts={};
      for(const card of rows){
        card.hidden=(filter!=='all'&&filter!==card.dataset.agency)||fields.some(f=>f.value!=='all'&&f.value!==(f.dataset.calField==='impact'?card.querySelector('[data-impact]')?.dataset.impact:card.dataset.country));
        card.removeAttribute('id');
        if(!card.hidden){
          visible++;
          const day=card.dataset.date;
          counts[day]=(counts[day]||0)+1;
          if(last!==day)card.id='day-'+day;
          last=day;
        }
      }
      list.replaceChildren(...rows);
      empty.hidden=visible>0;
      for(const a of days){
        const count=counts[a.dataset.weekDay]||0;
        a.querySelector('[data-count]').textContent=count;
        if(count)a.setAttribute('href','#day-'+a.dataset.weekDay);else a.removeAttribute('href');
      }
    }
    filterButtons.forEach(button=>button.addEventListener('click',()=>{
      filter=button.dataset.agencyFilter;
      filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      organize();
    }));
    organize();
    json('/data/calendar').then(({events,snapshot})=>{
      if(snapshot||!events.length)return;
      const reported=[...list.querySelectorAll('[data-agency="bls"][data-reported]')];
      const matches=events.filter(e=>e.date>=panel.dataset.firstDate&&(!panel.dataset.lastDate||e.date<panel.dataset.lastDate)&&!reported.some(card=>card.dataset.date===e.date&&(card.dataset.title.toLowerCase()===e.title.toLowerCase()||(e.date==='2026-11-17'&&/Import and Export Price Indexes/i.test(e.title)))));
      const rows=matches.map(e=>{
        const card=element('article','');
        card.className='calendar-release';
        card.dataset.date=e.date;card.dataset.time=e.time||'';card.dataset.agency='bls';card.dataset.country='US';
        const date=element('div','');date.className='calendar-date';
        date.append(element('strong',e.date.slice(-2)),element('span',new Date(e.date+'T00:00:00Z').toLocaleDateString(lang,{month:'short',timeZone:'UTC'})));
        const title=element('div','');title.className='calendar-event';
        const badge=element('span','BLS');badge.className='calendar-badge';
        const medium=/Job Openings|Producer Price|Productivity|Wages|Import and Export/i.test(e.title);
        const high=/Consumer Price Index|^Employment Situation$/i.test(e.title);
        const impact=element('span',high?t('●●● Sare','●●● High'):medium?t('●● Dhexe','●● Medium'):t('● Hoose','● Low'));
        impact.className='calendar-impact';impact.dataset.impact=high?'high':medium?'medium':'low';
        const country=element('span',t('Maraykanka','United States'));
        country.className='calendar-country';
        title.append(badge,country,impact,element('h2',e.title));
        const right=element('div','');right.className='calendar-event-time';
        const source=element('a','');source.className='ed-ext-link';source.href='https://www.bls.gov/schedule/';source.target='_blank';source.rel='noopener noreferrer';source.innerHTML=t('Isha','Source')+' <svg class="ed-ext-arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 8.8L8.8 3.2"/><path d="M5 3.2h3.8V7"/></svg>';
        right.append(element('span',e.time?e.time+' ET':'—'),source);
        const results=element('dl','');results.className='calendar-results';
        for(const [name,label] of [['actual',t('Dhabta','Actual')],['forecast',t('Saadaasha','Forecast')],['previous',t('Hore','Previous')]]){
          const item=element('div','');item.dataset.result=name;
          item.append(element('dt',label),element('dd','—'));results.append(item);
        }
        card.append(date,title,right,results);
        return card;
      });
      list.querySelectorAll('[data-agency="bls"]:not([data-reported])').forEach(e=>e.remove());
      list.append(...rows);organize();status(panel,'');
    }).catch(()=>{});
  }
  if(key==='forex')json('/data/forex').then(rates=>{
    for(const quote of rates.items){
      const row=[...panel.querySelectorAll('[data-fx]')].find(e=>e.dataset.fx===quote.symbol);
      if(!row)continue;
      row.querySelector('[data-rate]').textContent=quote.value.toFixed(quote.symbol.endsWith('JPY')?3:4);
      const change=row.querySelector('[data-change]');
      change.dataset.direction=quote.change>=0?'up':'down';
      change.textContent=(quote.change>=0?'+':'')+quote.change.toFixed(2)+'%';
    }
    status(panel,(rates.snapshot?t('Xogta kaydsan','Saved data'):t('Heerka tixraaca','Reference date'))+' · '+rates.date);
  }).catch(()=>{});
  if(key==='sentiment')json('/data/fear-greed').then(({items,snapshot})=>{
    if(!items?.length)return;
    const labels={'Extreme Fear':'Cabsi aad u daran',Fear:'Cabsi',Neutral:'Dhexdhexaad',Greed:'Damac','Extreme Greed':'Damac aad u badan'};
    const [latest,...prior]=items;
    panel.querySelector('[data-sentiment-value]').textContent=latest.value;
    panel.querySelector('[data-sentiment-level]').textContent=t(labels[latest.level],latest.level);
    panel.querySelector('[data-sentiment-marker]').style.left=latest.value+'%';
    panel.querySelector('[data-sentiment-history]').replaceChildren(...prior.map(item=>{
      const row=element('tr','');
      row.append(element('td',item.date),element('td',item.value),element('td',t(labels[item.level],item.level)));
      return row;
    }));
    status(panel,(snapshot?t('Xogta kaydsan','Saved data'):t('Taariikhda xogta','Index date'))+' · '+latest.date);
  }).catch(()=>{});
  if(key==='chart')chartWorkbench(panel);
  if(key==='highlights')startHighlights(panel);
}
const stockWidget=document.querySelector('[data-stock-widget]');
if(stockWidget){
  function updateStockTheme(){
    const theme=document.documentElement.dataset.theme==='dark'?'dark':'light';
    const previous=new URL(stockWidget.getAttribute('src'),location.origin);
    if(previous.searchParams.get('theme')===theme)return;
    previous.searchParams.set('theme',theme);
    stockWidget.setAttribute('src',previous.pathname+previous.search);
  }
  updateStockTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',updateStockTheme));
}

function chartWorkbench(panel){
  const canvas=panel.querySelector('canvas'),c=canvas.getContext('2d');
  const price=panel.querySelector('[data-chart-price]'),symbol=panel.querySelector('[data-chart-symbol]');
  const readout=panel.querySelector('[data-chart-readout]'),change=panel.querySelector('[data-chart-change]');
  const rsiCanvas=panel.querySelector('.chart-rsi');
  const macdCanvas=panel.querySelector('.chart-macd');
  const enabled=new Set(['volume']);
  const viewButtons=Object.fromEntries(Array.from(panel.querySelectorAll('[data-view]'),button=>[button.dataset.view,button]));
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  let start=0,count=0;
  function initialCount(){return Math.min(95,Math.ceil(data.length*.7));}
  function minCount(){return Math.min(8,data.length);}
  function setView(first,size){
    count=clamp(Math.round(size),minCount(),data.length);
    start=clamp(Math.round(first),0,data.length-count);
    selected=-1;
  }
  function resetView(){
    const size=Math.max(minCount(),initialCount());
    setView(data.length-size,size);
  }
  function zoom(factor,fraction=.5){
    if(!count)return;
    const next=clamp(Math.round(count*factor),minCount(),data.length);
    setView(start+fraction*(count-next),next);
    draw();
  }
  let indicators={},data=[],coin='btc',range='1w',mode='candles',selected=-1,attempt=0;
  const longDate=new Intl.DateTimeFormat(lang,{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'});
  const axisDay=new Intl.DateTimeFormat(lang,{month:'short',day:'numeric',timeZone:'UTC'});
  const axisMonth=new Intl.DateTimeFormat(lang,{year:'numeric',month:'short',timeZone:'UTC'});
  const historyButtons=[...panel.querySelectorAll('[data-history]')];
  const windowLabel=panel.querySelector('[data-window]');
  function historyCount(key){
    if(key==='max')return data.length;
    const threshold=new Date(data.at(-1)[0]*1000);
    threshold.setUTCFullYear(threshold.getUTCFullYear()-Number(key));
    const index=data.findIndex(row=>row[0]*1000>=threshold);
    return data.length-index;
  }
  function showHistory(key){
    const size=historyCount(key);
    setView(data.length-size,size);draw();
  }
  const drawingHint=panel.querySelector('[data-draw-hint]');
  const drawings=new Map();
  const storageKey='zaki-chart-drawings-v1';
  try {
    for(const [key,items] of JSON.parse(localStorage.getItem(storageKey)||'[]')){
      if(Array.isArray(items))drawings.set(key,items.filter(item=>['level','trend','measure','fib'].includes(item?.tool)&&[item.a,item.b].every(p=>Number.isFinite(p?.time)&&Number.isFinite(p?.price))));
    }
  } catch {}
  function saveDrawings(){try{localStorage.setItem(storageKey,JSON.stringify([...drawings]));}catch{}}
  let editing=null,dragOrigin=null;
  let tool='',anchor=null,cursor=null,plot=null;
  const drawingKey=()=>coin+':'+range;
  const pins=panel.querySelector('[data-drawing-pins]');
  const stars=[...panel.querySelectorAll('[data-star-drawing]')];
  let favorites=new Set();
  try{favorites=new Set(JSON.parse(localStorage.getItem('zaki-drawing-favorites')||'[]'));}catch{}
  const pinIcons={level:'<path d="M2 12h20"/><circle cx="12" cy="12" r="2"/>',trend:'<path d="m5 19 14-14"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="4" r="2"/>',measure:'<path d="M4 3h16M4 21h16M12 5v14m-3-11 3-3 3 3m-6 8 3 3 3-3"/>',fib:'<path d="M3 4h18M3 10h13M3 15h16M3 21h18"/>'};
  function savePins(){try{localStorage.setItem('zaki-drawing-favorites',JSON.stringify([...favorites]));}catch{}}
  function renderPins(){
    pins.replaceChildren();
    for(const star of stars){
      const key=star.dataset.starDrawing,active=favorites.has(key);
      star.textContent=active?'★':'☆';
      star.setAttribute('aria-pressed',String(active));
      if(active){
        const pin=star.previousElementSibling.cloneNode(false);
        pin.title=star.previousElementSibling.textContent;
        pin.setAttribute('aria-label',pin.title);
        pin.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24">'+pinIcons[key]+'</svg>';
        pins.append(pin);
      }
    }
    pins.hidden=!pins.childElementCount;
  }
  renderPins();
  function drawingState(next){
    editing=null;dragOrigin=null;tool=next;anchor=null;cursor=null;
    const label=panel.querySelector('[data-tools-label]');
    const active=Array.from(panel.querySelectorAll('[data-draw-tool]')).find(button=>button.dataset.drawTool===tool);
    label.textContent=active?active.textContent:t('Sawir','Draw');
    canvas.classList.toggle('drawing-active',Boolean(tool));
    panel.querySelectorAll('[data-draw-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.drawTool===tool)));
    drawingHint.textContent=tool?t('Guji jaantuska si aad u doorato barta.','Click the chart to place a point.'):'';
  }
  function drawAnnotations(left,right,top,bottom,x,y){
    const items=[...(drawings.get(drawingKey())||[])];
    if(anchor&&cursor)items.push({tool,a:anchor,b:cursor});
    const position=p=>{const index=data.findIndex(row=>row[0]===p.time);return index<0?NaN:x(index);};
    c.save();c.beginPath();c.rect(left,top,right-left,bottom-top);c.clip();
    c.strokeStyle='#8b65d5';c.fillStyle='#8651d0';c.lineWidth=1.5;
    function segment(x1,y1,x2,y2){
      c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    }
    function handle(px,py){
      c.save();c.fillStyle= getComputedStyle(panel).getPropertyValue('--panel');c.beginPath();c.arc(px,py,4,0,2*Math.PI);c.fill();c.stroke();c.restore();
    }
    for(const item of items){
      const {a,b}=item,ay=y(a.price),ax=position(a);
      c.strokeStyle=({level:'#387dbb',trend:'#4675cf',fib:'#8758b7',measure:'#238582'})[item.tool];c.fillStyle=c.strokeStyle;
      if(Number.isFinite(ax))handle(ax,ay);
      if(item.tool==='level'){segment(left,ay,right,ay);c.fillText(usd(a.price),left+6,ay-5);continue;}
      const bx=position(b),by=y(b.price);
      if(!Number.isFinite(ax)||!Number.isFinite(bx))continue;
      handle(bx,by);
      if(item.tool==='measure'||item.tool==='fib'){
        c.save();c.globalAlpha=.09;c.fillRect(Math.min(ax,bx),Math.min(ay,by),Math.abs(bx-ax),Math.abs(by-ay));c.restore();
      }
      if(item.tool==='fib'){
        for(const ratio of [0,.236,.382,.5,.618,.786,1]){
          const py=y(a.price+(b.price-a.price)*ratio);
          segment(Math.min(ax,bx),py,Math.max(ax,bx),py);
          c.fillText((ratio*100).toFixed(1)+'% · '+usd(a.price+(b.price-a.price)*ratio),Math.min(ax,bx)+4,py-4);
        }
      }else{
        segment(ax,ay,bx,by);
        if(item.tool==='measure'){
          const delta=b.price-a.price;
          const minutes=Math.round(Math.abs(b.time-a.time)/60);
          c.fillText((delta>=0?'+':'−')+usd(Math.abs(delta))+' · '+(100*delta/a.price).toFixed(2)+'% · '+(minutes>=1440?(minutes/1440).toFixed(1)+'d':minutes>=60?(minutes/60).toFixed(1)+'h':minutes+'m'),Math.min(ax,bx),Math.min(ay,by)-7);
        }
      }
    }
    c.restore();
  }
  function exponentialAverage(values,period){
    let seen=0,seed=0,value=0;
    return values.map(sample=>{
      if(sample===null)return null;
      seen++;
      if(seen<=period){seed+=sample;value=seed/seen;}
      else value+=(sample-value)*2/(period+1);
      return seen>=period?value:null;
    });
  }
  function calculate(rows){
    const closes=rows.map(r=>r[4]);
    let ema=0,sum=0,gain=0,loss=0;
    const fast=exponentialAverage(closes,12),slow=exponentialAverage(closes,26);
    const macd=slow.map((value,i)=>value===null?null:fast[i]-value);
    const signal=exponentialAverage(macd,9);
    return closes.reduce((out,p,i)=>{
      sum+=p;
      if(i>=50)sum-=closes[i-50];
      out.sma.push(i>=49?sum/50:null);
      if(i<20)ema+=p/20;else ema+=(p-ema)*2/21;
      out.ema.push(i>=19?ema:null);
      if(i){
        const delta=p-closes[i-1],up=Math.max(delta,0),down=Math.max(-delta,0);
        if(i<=14){gain+=up/14;loss+=down/14;}
        else{gain=(gain*13+up)/14;loss=(loss*13+down)/14;}
      }
      out.rsi.push(i<14?null:loss===0?(gain===0?50:100):100-100/(1+gain/loss));
      return out;
    },{ema:[],sma:[],rsi:[],macd,signal});
  }
  function drawRsi(w,dpr,x,index,theme){
    rsiCanvas.hidden=!enabled.has('rsi');
    if(rsiCanvas.hidden)return;
    const h=rsiCanvas.clientHeight;
    rsiCanvas.width=w*dpr;rsiCanvas.height=h*dpr;
    const r=rsiCanvas.getContext('2d');
    r.scale(dpr,dpr);
    const y=v=>h-7-v*(h-14)/100;
    r.fillStyle=theme.getPropertyValue('--dim');r.font='11px Inter, sans-serif';
    r.strokeStyle=theme.getPropertyValue('--line');r.setLineDash([4,4]);
    for(const v of [30,70]){
      r.beginPath();r.moveTo(7,y(v));r.lineTo(w-71,y(v));r.stroke();r.fillText(String(v),w-66,y(v)+4);
    }
    r.setLineDash([]);r.strokeStyle='#9b70d9';r.lineWidth=1.6;r.beginPath();
    let started=false;
    indicators.rsi.slice(start,start+count).forEach((v,offset)=>{const i=start+offset;if(v===null)return;if(started)r.lineTo(x(i),y(v));else{r.moveTo(x(i),y(v));started=true;}});
    r.stroke();
    if(selected>=0){r.strokeStyle=theme.getPropertyValue('--dim');r.beginPath();r.moveTo(x(index),3);r.lineTo(x(index),h);r.stroke();}
  }
  function drawMacd(w,dpr,x,theme){
    macdCanvas.hidden=!enabled.has('macd');
    if(macdCanvas.hidden)return;
    const h=macdCanvas.clientHeight;
    macdCanvas.width=w*dpr;macdCanvas.height=h*dpr;
    const m=macdCanvas.getContext('2d');
    m.scale(dpr,dpr);
    const series=indicators.macd.slice(start,start+count);
    const signal=indicators.signal.slice(start,start+count);
    const histogram=series.map((v,i)=>signal[i]===null?null:v-signal[i]);
    const observations=[...series,...signal,...histogram].filter(Number.isFinite);
    const top=Math.max(0,...observations),bottom=Math.min(0,...observations);
    const y=value=>h-7-(value-bottom)/(top-bottom||1)*(h-23);
    const right=w-71,step=(right-7)/count;
    m.font='11px Inter, sans-serif';m.fillStyle=theme.getPropertyValue('--dim');
    m.fillText('MACD (12, 26, 9)',7,11);
    m.strokeStyle=theme.getPropertyValue('--line');m.beginPath();m.moveTo(7,y(0));m.lineTo(right,y(0));m.stroke();
    m.fillText('0',right+5,y(0)+3);
    histogram.forEach((v,i)=>{
      if(v===null)return;
      m.fillStyle=v>=0?'#208674':'#bf565d';
      m.fillRect(x(start+i)-step*.3,Math.min(y(v),y(0)),Math.max(1,step*.6),Math.max(1,Math.abs(y(v)-y(0))));
    });
    for(const [values,color] of [[series,'#3286d3'],[signal,'#df742c']]){
      m.strokeStyle=color;m.lineWidth=1.5;m.beginPath();
      let first=true;
      values.forEach((v,i)=>{if(v===null)return;if(first)m.moveTo(x(start+i),y(v));else m.lineTo(x(start+i),y(v));first=false;});
      m.stroke();
    }
  }
  const labels=new Intl.DateTimeFormat(lang,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'});
  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight,dpr=devicePixelRatio||1;
    plot=null;
    viewButtons.in.disabled=!count||count<=minCount();
    viewButtons.out.disabled=!count||count>=data.length;
    viewButtons.reset.disabled=!count;
    if(!w||!h)return;
    canvas.width=w*dpr;canvas.height=h*dpr;c.scale(dpr,dpr);
    if(data.length<2)return;
    const theme=getComputedStyle(panel);
    const left=7,right=w-71,top=10,bottom=enabled.has('volume')?h-82:h-34,volumeTop=h-66,base=h-29;
    const visible=data.slice(start,start+count);
    const first=visible[0],last=visible.at(-1);
    const movement=(last[4]/first[3]-1)*100;
    change.textContent=(movement>=0?'+':'')+movement.toFixed(2)+'%';
    change.dataset.direction=movement>=0?'up':'down';
    change.title=t('Isbeddelka muddada muuqata','Change over visible range');
    windowLabel.textContent=longDate.format(first[0]*1000)+' – '+longDate.format(last[0]*1000)+' · '+count+' '+t('shumac','candles');
    for(const button of historyButtons)button.setAttribute('aria-pressed',String(range==='1w'&&start+count===data.length&&count===historyCount(button.dataset.history)&&(button.dataset.history==='max'||count<data.length)));
    const lows=visible.map(x=>x[1]),highs=visible.map(x=>x[2]);
    for(const key of ['ema','sma']){
      if(enabled.has(key)){
        const line=indicators[key].slice(start,start+count).filter(Number.isFinite);
        if(line.length){lows.push(Math.min(...line));highs.push(Math.max(...line));}
      }
    }
    const min=Math.min(...lows),max=Math.max(...highs),pad=(max-min||max*.01)*.07;
    const y=n=>bottom-(n-min+pad)/(max-min+2*pad)*(bottom-top);
    const step=(right-left)/count,x=i=>left+(i-start+.5)*step;
    plot={left,right,top,bottom,step,min,max,pad};
    const maxVolume=Math.max(1,...visible.map(r=>r[5]));
    c.font='11px Inter, sans-serif';c.fillStyle=theme.getPropertyValue('--dim');c.strokeStyle=theme.getPropertyValue('--line');
    for(let i=0;i<=5;i++){
      const at=min-pad+(max-min+2*pad)*i/5,py=y(at);
      c.beginPath();c.moveTo(left,py);c.lineTo(right,py);c.stroke();
      c.fillText(usd(at),right+5,py+4);
    }
    for(let i=0;i<(w>650?6:3);i++){
      const ticks=w>650?5:2;
      const n=start+Math.floor((count-1)*i/ticks);
      c.fillText((last[0]-first[0]>365*86400?axisMonth:(range==='1d'||range==='1w'?axisDay:labels)).format(data[n][0]*1000),Math.min(w-90,x(n)),h-8);
    }
    visible.forEach((row,offset)=>{
      const i=offset+start;
      const [,low,high,open,close,volume]=row;
      const ink=close>=open?'#118575':'#d44c62';
      c.fillStyle=ink+'70';
      const bar=(base-volumeTop)*volume/maxVolume;
      if(enabled.has('volume'))c.fillRect(x(i)-step*.26,base-bar,Math.max(1,step*.52),bar);
      if(mode!=='candles')return;
      c.strokeStyle=ink;c.beginPath();c.moveTo(x(i),y(low));c.lineTo(x(i),y(high));c.stroke();
      c.fillStyle=ink;c.fillRect(x(i)-step*.32,Math.min(y(open),y(close)),Math.max(1,step*.64),Math.max(1,Math.abs(y(open)-y(close))));
    });
    if(mode==='line'){
      c.strokeStyle=theme.getPropertyValue('--chart-orange').trim()||'#eb7b27';c.lineWidth=2;c.beginPath();
      visible.forEach((r,i)=>i?c.lineTo(x(start+i),y(r[4])):c.moveTo(x(start+i),y(r[4])));
      c.stroke();c.lineWidth=1;
    }
    if(start+count===data.length){
      const close=last[4],py=y(close),tag=usd(close);
      c.save();
      c.strokeStyle=last[4]>=last[3]?'#118575':'#bd3e53';c.fillStyle=c.strokeStyle;
      c.setLineDash([3,5]);c.beginPath();c.moveTo(left,py);c.lineTo(right,py);c.stroke();
      c.fillRect(right,py-9,w-right,18);c.fillStyle='white';c.fillText(tag,right+4,py+4);c.restore();
    }
    for(const [indicator,color] of [['ema','#3184da'],['sma','#a066cf']]){
      if(!enabled.has(indicator))continue;
      c.strokeStyle=color;c.lineWidth=1.5;c.beginPath();
      let first=true;
      indicators[indicator].slice(start,start+count).forEach((v,offset)=>{const i=start+offset;if(v===null)return;if(first){c.moveTo(x(i),y(v));first=false;}else c.lineTo(x(i),y(v));});
      c.stroke();
    }
    drawAnnotations(left,right,top,bottom,x,y);
    c.lineWidth=1;
    const index=selected<start||selected>=start+count?start+count-1:selected;
    drawRsi(w,dpr,x,index,theme);
    drawMacd(w,dpr,x,theme);
    const [time,low,high,open,close,volume]=data[index];
    if(selected>=0){
      c.strokeStyle=theme.getPropertyValue('--dim');c.setLineDash([4,4]);c.beginPath();c.moveTo(x(index),top);c.lineTo(x(index),base);c.stroke();c.setLineDash([]);
    }
    const compact=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:2});
    readout.textContent=labels.format(time*1000)+' UTC · O '+usd(open)+' · H '+usd(high)+' · L '+usd(low)+' · C '+usd(close)+(enabled.has('volume')?' · Vol '+compact.format(volume):'')+[...enabled].filter(name=>name!=='volume').map(name=>{const v=indicators[name][index];return ' · '+({ema:'EMA 20',sma:'SMA 50',rsi:'RSI 14',macd:'MACD'}[name])+' '+(v===null?'—':name==='rsi'?v.toFixed(1):usd(v));}).join('');
  }
  async function update(historyKey){
    const generation=++attempt;
    windowLabel.textContent='';
    panel.querySelectorAll('[data-chart-map]').forEach(link=>{
      const target=new URL(link.href);
      target.searchParams.set('asset',coin.toUpperCase());
      link.href=target.href;
    });
    historyButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
    const src=panel.querySelector('[data-chart-source]');
    src.textContent=range==='1w'?'Kraken':'Coinbase Exchange';
    src.href=range==='1w'?'https://www.kraken.com/prices':'https://exchange.coinbase.com/';
    const observation=panel.querySelector('[data-observation]');
    observation.textContent='';
    drawingState('');
    panel.querySelectorAll('[data-coin]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.coin===coin)));
    panel.querySelectorAll('[data-range]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.range===range)));
    const icon=panel.querySelector('[data-coin="'+coin+'"] img');
    panel.querySelector('[data-chart-logo]').replaceChildren(...(icon?[icon.cloneNode()]:[]));
    symbol.textContent=coin.toUpperCase()+' / USD';
    price.textContent='—';change.textContent='';readout.textContent='';
    data=[];selected=-1;count=0;start=0;rsiCanvas.hidden=true;macdCanvas.hidden=true;draw();
    status(panel,t('Xogta waa la soo raraya…','Loading candles…'));
    try{
      const payload=await json('/data/chart?coin='+coin+'&interval='+range);
      if(generation!==attempt)return;
      if(!Array.isArray(payload.candles)||payload.candles.length<2)throw Error('No candles');
      data=payload.candles;indicators=calculate(data);resetView();
      if(historyKey)showHistory(historyKey);
      if(payload.checked)observation.textContent=' · '+t('Xogtii','As of')+' '+new Date(payload.checked*1000).toISOString().slice(0,16).replace('T',' ')+' UTC';
      const close=data.at(-1)[4],pct=(close/data[0][3]-1)*100;
      price.textContent=usd(close);
      change.textContent=(pct>=0?'+':'')+pct.toFixed(2)+'%';
      change.dataset.direction=pct>=0?'up':'down';
      status(panel,'');draw();
    }catch{if(generation===attempt)unavailable(panel);}
  }
  panel.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.dataset.starDrawing){
      const key=button.dataset.starDrawing;
      if(favorites.has(key))favorites.delete(key);else favorites.add(key);
      savePins();
      renderPins();return;
    }
    if(button.dataset.drawTool){if(!favorites.has(button.dataset.drawTool)){favorites.add(button.dataset.drawTool);savePins();renderPins();}const menu=button.closest('details');if(menu)menu.open=false;drawingState(tool===button.dataset.drawTool?'':button.dataset.drawTool);draw();}
    if(button.dataset.drawAction){
      const items=drawings.get(drawingKey())||[];
      if(button.dataset.drawAction==='clear')items.length=0;else items.pop();
      saveDrawings();drawingState(tool);draw();
    }
    if(button.dataset.history){
      if(range==='1w'&&data.length)showHistory(button.dataset.history);
      else{range='1w';update(button.dataset.history);}
    }
    if(button.dataset.coin){coin=button.dataset.coin;update();}
    if(button.dataset.range){range=button.dataset.range;update();}
    if(button.dataset.view){
      if(button.dataset.view==='reset'){resetView();draw();}
      else zoom(button.dataset.view==='in'?.75:4/3);
    }
    if(button.dataset.chartMode){
      mode=button.dataset.chartMode;
      panel.querySelectorAll('[data-chart-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      draw();
    }
  });
  const menus=[...panel.querySelectorAll('.chart-indicator-menu')];
  menus.forEach(menu=>menu.addEventListener('toggle',()=>{if(menu.open)menus.filter(other=>other!==menu).forEach(other=>other.open=false);}));
  document.addEventListener('pointerdown',e=>menus.forEach(menu=>{if(!menu.contains(e.target))menu.open=false;}));
  panel.addEventListener('keydown',e=>{if(e.key==='Escape')menus.forEach(menu=>{if(menu.open){menu.open=false;menu.querySelector('summary').focus();}});});
  panel.addEventListener('change',event=>{
    const input=event.target.closest('[data-chart-indicator]');
    if(!input)return;
    if(input.checked)enabled.add(input.dataset.chartIndicator);else enabled.delete(input.dataset.chartIndicator);
    draw();
  });
  function point(event){
    if(!plot)return null;
    const {left,right,top,bottom,step,min,max,pad}=plot;
    const {offsetX:px,offsetY:py}=event;
    if(px<left||px>=right||py<top||py>bottom)return null;
    const index=start+clamp(Math.floor((px-left)/step),0,count-1);
    return {time:data[index][0],price:Math.max(Number.EPSILON,min-pad+(bottom-py)/(bottom-top)*(max-min+2*pad))};
  }
  function placeAnnotation(event){
    if(!tool)return;
    const placed=point(event);
    if(!placed)return;
    if(tool!=='level'&&!anchor){
      anchor=placed;cursor=placed;
      drawingHint.textContent=t('Dooro barta labaad.','Place the second point.');
    }else{
      const items=drawings.get(drawingKey())||[];
      items.push({tool,a:anchor||placed,b:placed});
      drawings.set(drawingKey(),items);
      saveDrawings();drawingState('');
    }
    draw();
  }
  const pointers=new Map();
  let gesture=null;
  function beginGesture(){
    const points=[...pointers.values()];
    if(!points.length){gesture=null;return;}
    const [a,b]=points;
    gesture=b?{start,count,center:(a+b)/2,distance:Math.max(1,Math.abs(a-b)),pinch:true}
      :{start,count,center:a,dragged:false};
  }
  canvas.addEventListener('pointerdown',event=>{
    if(!plot||event.button!==0)return;
    if(!pointers.size){
      if(!tool){
        const items=drawings.get(drawingKey())||[];
        for(const item of [...items].reverse()){
          for(const key of (item.tool==='level'?['a']:['b','a'])){
            const p=item[key],i=data.findIndex(row=>row[0]===p.time);
            if(i<0)continue;
            const x=plot.left+(i-start+.5)*plot.step,y=plot.bottom-(p.price-plot.min+plot.pad)/(plot.max-plot.min+2*plot.pad)*(plot.bottom-plot.top);
            if(Math.hypot(event.offsetX-x,event.offsetY-y)<=10){editing={item,key,original:p,id:event.pointerId};break;}
          }
          if(editing)break;
        }
      }else if(tool!=='level'&&!anchor){dragOrigin={p:point(event),x:event.offsetX,y:event.offsetY};}
    }else{dragOrigin=null;}
    pointers.set(event.pointerId,event.offsetX);
    canvas.setPointerCapture(event.pointerId);
    beginGesture();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!plot)return;
    if(editing?.id===event.pointerId){
      const p=point(event);if(p)editing.item[editing.key]=p;
      draw();return;
    }
    if(dragOrigin?.p && pointers.size===1 && pointers.has(event.pointerId) && Math.hypot(event.offsetX-dragOrigin.x,event.offsetY-dragOrigin.y)>5)anchor=dragOrigin.p;
    if(pointers.has(event.pointerId)){
      pointers.set(event.pointerId,event.offsetX);
      const [a,b]=pointers.values(),width=plot.right-plot.left;
      if(gesture.pinch&&b!==undefined){
        const distance=Math.max(1,Math.abs(a-b));
        const size=clamp(Math.round(gesture.count*gesture.distance/distance),minCount(),data.length);
        const held=gesture.start+gesture.count*clamp((gesture.center-plot.left)/width,0,1);
        setView(held-size*clamp(((a+b)/2-plot.left)/width,0,1),size);
        draw();return;
      }
      if(!tool&&(gesture.dragged||Math.abs(a-gesture.center)>3)){
        gesture.dragged=true;
        setView(gesture.start-(a-gesture.center)*gesture.count/width,gesture.count);
        draw();return;
      }
    }
    cursor=point(event);
    selected=clamp(start+Math.floor((event.offsetX-plot.left)/plot.step),start,start+count-1);draw();
  });
  function endPointer(event){
    if(!pointers.has(event.pointerId))return;
    if(editing?.id===event.pointerId){
      if(event.type==='pointerup')saveDrawings();else editing.item[editing.key]=editing.original;
      editing=null;pointers.delete(event.pointerId);beginGesture();draw();return;
    }
    if(dragOrigin && event.type!=='pointerup'){anchor=null;cursor=null;}
    dragOrigin=null;
    const tap=event.type==='pointerup'&&!gesture?.pinch&&!gesture?.dragged;
    pointers.delete(event.pointerId);
    beginGesture();
    if(gesture)gesture.dragged=true;
    if(tap&&tool)placeAnnotation(event);
  }
  for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,endPointer);
  canvas.addEventListener('pointerleave',()=>{if(!pointers.size){selected=-1;cursor=null;draw();}});
  let wheelSize=null,lastWheel=0,wheelCount=0;
  canvas.addEventListener('wheel',event=>{
    if(!plot||!event.deltaY)return;
    event.preventDefault();
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?canvas.clientHeight:1);
    const now=Date.now();
    if(wheelSize===null||count!==wheelCount||now-lastWheel>350)wheelSize=count;
    wheelSize=clamp(wheelSize*Math.exp(clamp(delta,-600,600)*.0025),minCount(),data.length);
    const fraction=clamp((event.offsetX-plot.left)/(plot.right-plot.left),0,1);
    zoom(wheelSize/count,fraction);
    wheelCount=count;lastWheel=now;
  },{passive:false});
  canvas.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&tool){drawingState('');draw();return;}
    if(!count)return;
    if(['+','=','-','0','Home'].includes(event.key)){
      event.preventDefault();
      if(event.key==='0'||event.key==='Home'){resetView();draw();}else zoom(event.key==='-'?4/3:.75);
      return;
    }
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    const current=selected<0?start+count-1:selected;
    selected=clamp(current+(event.key==='ArrowLeft'?-1:1),0,data.length-1);
    if(selected<start)start=selected;
    if(selected>=start+count)start=selected-count+1;
    draw();
  });
  new ResizeObserver(draw).observe(canvas);
  document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',draw));
  update();
}

function startHighlights(panel){
  const book=new Map();
  let socket,retry,paused=false,loading=false;
  const pairs=JSON.parse(panel.dataset.pairs);
  function connect(){
    if(paused)return;
    try{socket=new WebSocket('wss://api.gateio.ws/ws/v4/');}catch{retry=setTimeout(connect,5000);return;}
    socket.onopen=()=>socket.send(JSON.stringify({time:Math.floor(Date.now()/1000),channel:'spot.tickers',event:'subscribe',payload:Object.keys(pairs)}));
    socket.onmessage=e=>{
      try{
        const m=JSON.parse(e.data),q=m.result,asset=pairs[q?.currency_pair],time=Number(m.time_ms)||Number(m.time)*1000;
        if(m.event!=='update'||!asset||!(Number(q.last)>0)||!Number.isFinite(Number(q.change_percentage))||!(time>0)||time>Date.now()+60000)return;
        book.set(q.currency_pair,{...asset,time,unit:'USDT',price:Number(q.last),change:Number(q.change_percentage),pool:'https://www.gate.com/trade/'+encodeURIComponent(q.currency_pair)});
      }catch{}
    };
    socket.onclose=()=>{if(!paused)retry=setTimeout(connect,5000);};
  }
  function streamed(){
    return [...book.values()].filter(q=>Date.now()-q.time<30000).sort((a,b)=>b.change-a.change);
  }
  async function refresh(){
    if(loading||paused||document.hidden)return;
    loading=true;
    try{await populateHighlights(panel,streamed);}finally{loading=false;}
  }
  setInterval(()=>{
    const rows=streamed();
    if(document.hidden||paused||rows.length<10)return;
    for(const key of ['gainers','losers']){
      const items=key==='gainers'?rows.filter(q=>q.change>0).slice(0,8):rows.filter(q=>q.change<0).slice(-8).reverse();
      renderHighlight(panel,key,{items,source:'Gate',asOf:new Date(Math.max(...rows.map(q=>q.time))).toISOString(),live:true});
    }
  },2000);
  window.addEventListener('pagehide',()=>{paused=true;clearTimeout(retry);socket?.close();});
  window.addEventListener('pageshow',e=>{if(e.persisted){paused=false;connect();refresh();}});
  async function refreshSchedule(){
    if(paused||document.hidden)return;
    try{
      const rows=await json('/data/highlights?card=unlocks');
      if(!Array.isArray(rows))return;
      const body=panel.querySelector('[data-highlight="unlocks"]');
      const list=rows.map(r=>{
        const row=element('tr',''),name=element('th','');
        const icon=new DOMParser().parseFromString(r.icon,'text/html').querySelector('img');
        if(icon&&new URL(icon.src,location.origin).origin===location.origin)name.append(icon);
        name.append(' '+r.title);row.append(name,element('td',r.date));return row;
      });
      if(list.length)body.replaceChildren(...list);
      else{const row=element('tr',''),cell=element('td',t('Wax furitaan ah lama hayo.','No upcoming unlocks listed.'));cell.colSpan=2;row.append(cell);body.replaceChildren(row);}
    }catch{}
  }
  connect();refresh();setInterval(refresh,15000);setInterval(refreshSchedule,60000);
}
async function directHighlightPools(section){
  const path=section==='new'?'new_pools':'trending_pools';
  const response=await fetch('https://api.geckoterminal.com/api/v2/networks/'+path+'?include=base_token',{signal:AbortSignal.timeout(8000),cache:'no-store'});
  if(!response.ok)throw Error('Pool feed unavailable');
  const payload=await response.json(),tokens=new Map((payload.included||[]).map(r=>[r.id,r.attributes]));
  const items=(payload.data||[]).slice(0,8).map(r=>{
    const a=r.attributes,token=tokens.get(r.relationships?.base_token?.data?.id);
    const network=r.relationships?.network?.data?.id||r.id.split('_')[0];
    const numeric=v=>v!=null&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
    return {name:a.name,price:numeric(a.base_token_price_usd),change:numeric(a.price_change_percentage?.h24),image:token?.image_url,pool:'https://www.geckoterminal.com/'+encodeURIComponent(network)+'/pools/'+encodeURIComponent(a.address)};
  });
  if(!items.length)throw Error('No pools');
  return {items,source:'GeckoTerminal',asOf:response.headers.get('date')||new Date().toISOString(),retrieved:true};
}
async function populateHighlights(panel,streamed){
  await Promise.all([...panel.querySelectorAll('[data-highlight]:not([data-highlight="unlocks"])')].map(async body=>{
    const section=body.dataset.highlight;
    const note=panel.querySelector('[data-highlight-note="'+section+'"]');
    let card;
    try{
      card=await json('/data/highlights?card='+encodeURIComponent(section));
      if((section==='trending'||section==='new')&&(card.snapshot||Date.now()-Date.parse(card.asOf)>180000)){
        try{card=await directHighlightPools(section);}catch{}
      }
      if(!Array.isArray(card.items)||!Number.isFinite(Date.parse(card.asOf)))throw Error('No data');
    }catch{
      if(body.dataset.asOf)note.textContent=t('Xog kaydsan','Last known')+' · '+body.dataset.asOf;
      else body.rows[0].cells[0].textContent=t('Xogta hadda lama heli karo.','Data is temporarily unavailable.');
      return;
    }
    if(['gainers','losers'].includes(section)&&streamed().length>=10)return;
    renderHighlight(panel,section,card);
  }));
}
function renderHighlight(panel,section,card){
    const body=panel.querySelector('[data-highlight="'+section+'"]');
    const note=panel.querySelector('[data-highlight-note="'+section+'"]');
    if(Date.parse(card.asOf)<Date.parse(body.dataset.asOf)&&!card.snapshot)return;
    body.dataset.asOf=card.asOf;
    const market=['CoinGecko','CoinPaprika'].includes(card.source)?' · '+t('100-ka ugu waaweyn','Top 100 by market cap'):card.source==='Coinbase'?' · '+t('Coinnada la daboolay','Tracked USD pairs'):'';
    note.textContent=card.source+market+' · '+(card.live?t('Toos','Live'):card.snapshot||Date.now()-Date.parse(card.asOf)>180000?t('Xog kaydsan','Last known'):card.retrieved?t('La soo helay','Retrieved'):t('Xogtii','As of'))+' '+new Date(card.asOf).toISOString().slice(0,16).replace('T',' ')+' UTC';
    if(!card.items.length){
      const row=element('tr',''),cell=element('td',t('Ma jiraan lacagaha la raacay oo jihadan u dhaqaaqay 24-kii saac ee la soo dhaafay.','No tracked assets moved in this direction over the last 24 hours.'));
      cell.colSpan=3;row.append(cell);body.replaceChildren(row);return;
    }
    body.replaceChildren(...card.items.map(item=>{
      const row=element('tr',''),heading=element('th',''),link=element('a',item.name);
      heading.scope='row';
      const href=tradingViewChartHref('crypto',item.symbol||item.name);
      row.className='ed-chart-row';
      row.dataset.chartHref=href;
      link.href=href;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.className='ed-coin-link';
      if(item.image&&(/^\/coin-logo\/[a-z0-9-]+\.(?:svg|png)$/.test(item.image)||/^https:\/\/(?:coin-images\.coingecko\.com|assets\.coingecko\.com|assets\.geckoterminal\.com|s2\.coinmarketcap\.com|static\.coinpaprika\.com)\//.test(item.image))){
        const image=document.createElement('img');
        image.src=item.image;image.alt='';image.loading='lazy';
        link.prepend(image);
      }
      const afford=document.createElement('span');
      afford.className='ed-row-affordance';
      afford.setAttribute('aria-hidden','true');
      afford.innerHTML=chartArrowIcon();
      link.append(afford);
      heading.append(link);
      const priceText=Number.isFinite(item.price)?new Intl.NumberFormat('en-US',{style:item.unit?'decimal':'currency',currency:'USD',maximumSignificantDigits:7}).format(item.price)+(item.unit?' '+item.unit:''):'—';
      const changeText=Number.isFinite(item.change)?(item.change>0?'+':'')+item.change.toFixed(1)+'%':'—';
      const price=element('td',''),change=element('td','');
      const priceLink=element('a',priceText),changeLink=element('a',changeText);
      priceLink.href=changeLink.href=href;
      priceLink.target=changeLink.target='_blank';
      priceLink.rel=changeLink.rel='noopener noreferrer';
      priceLink.className=changeLink.className='ed-row-fill';
      price.append(priceLink);
      change.append(changeLink);
      change.dataset.direction=item.change>0?'up':item.change<0?'down':'';
      row.append(heading,price,change);return row;
    }));
}

{
 const btc=document.querySelector('[data-btc-overview]');
 function wire(panel){
   const from=panel.querySelector('[data-btc-amount]'),to=panel.querySelector('[data-usd-amount]'),price=Number(panel.dataset.btcPrice);
   for(const [field,other,rate,places] of [[from,to,price,2],[to,from,1/price,8]]){
     field.addEventListener('input',()=>{other.value=field.value!==''&&field.validity.valid&&Number.isFinite(field.valueAsNumber)?Number((field.valueAsNumber*rate).toFixed(places)):'';});
   }
 }
 if(btc){
   wire(btc);
   fetch('/bitcoin-panel'+location.search).then(r=>{if(!r.ok)throw Error();return r.text();}).then(html=>{
     if(btc.contains(document.activeElement)||btc.querySelector('[data-btc-amount]').value!=='1')return;
     const next=new DOMParser().parseFromString(html,'text/html').querySelector('[data-btc-overview]');
     if(next){btc.replaceWith(next);wire(next);}
   }).catch(()=>{});
 }
}

{
 const board=document.querySelector('[data-quote-board]');
 if(board){
   const params=new URLSearchParams({asset:board.dataset.quoteBoard,lang:document.documentElement.lang});
   const refreshBoard=()=>fetch('/data/quote-board?'+params).then(r=>{if(!r.ok)throw Error();return r.text();}).then(markup=>{
     const next=new DOMParser().parseFromString(markup,'text/html').querySelector('[data-quote-board]');
     if(next?.dataset.quoteBoard===board.dataset.quoteBoard&&!board.contains(document.activeElement))board.replaceChildren(...next.childNodes);
   }).catch(()=>{});
   refreshBoard();setInterval(()=>{if(!document.hidden)refreshBoard();},60000);
 }
}
(() => {
  const image = document.querySelector('[data-options-image]');
  if (!image) return;
  let pending = false;
  function refresh() {
    if (pending || document.hidden) return;
    pending = true;
    const candidate = new Image();
    candidate.onload = () => { image.src = candidate.src; pending = false; };
    candidate.onerror = () => { pending = false; };
    candidate.src = image.dataset.optionsImage + '?v=' + Math.floor(Date.now() / 300000);
  }
  refresh();
  setInterval(refresh, 300000);
})();

if(document.querySelector('[data-unlock-price]')){
  const cells=[...document.querySelectorAll('[data-unlock-price]')];
  const pairs=[...new Set(cells.filter(cell=>cell.dataset.stream==='gate').map(cell=>cell.dataset.unlockPrice+'_USDT'))];
  let socket,retry,stopped=false;
  function update(symbol,price,time,source){
    if(!(price>0)||!Number.isFinite(price)||!Number.isFinite(time)||time<=0||time>Date.now()+60000)return;
    const usd=source==='DefiLlama';
    for(const cell of cells){
      if(cell.dataset.unlockPrice!==symbol||time<Number(cell.dataset.time)*1000)continue;
      if(source!=='stream'&&cell.dataset.source==='stream'&&Date.now()-Number(cell.dataset.time)*1000<30000)continue;
      cell.dataset.time=String(time/1000);
      cell.dataset.source=source;
      const display=(n,opts)=> (usd?'$':'')+n.toLocaleString(document.documentElement.lang,opts)+(usd?'':' USDT');
      cell.textContent=display(price,{maximumSignificantDigits:6});
      const value=cell.closest('tr').querySelector('[data-unlock-amount]');
      if(value?.dataset.unlockAmount)value.textContent=display(Number(value.dataset.unlockAmount)*price,{maximumFractionDigits:2});
      cell.nextElementSibling.textContent=(usd?'DefiLlama':'Gate')+' · '+new Date(time).toISOString().slice(0,19).replace('T',' ')+' UTC';
    }
  }
  function connect(){
    if(stopped||!pairs.length)return;
    try{socket=new WebSocket('wss://api.gateio.ws/ws/v4/');}catch{retry=setTimeout(connect,5000);return;}
    socket.onopen=()=>socket.send(JSON.stringify({time:Math.floor(Date.now()/1000),channel:'spot.trades',event:'subscribe',payload:pairs}));
    socket.onmessage=e=>{
      try{
        const m=JSON.parse(e.data),q=m.result;
        if(m.channel==='spot.trades'&&m.event==='update'&&pairs.includes(q.currency_pair))
          update(q.currency_pair.split('_')[0],Number(q.price),Number(q.create_time_ms)||Number(q.create_time)*1000,'stream');
      }catch{}
    };
    socket.onclose=()=>{if(!stopped)retry=setTimeout(connect,5000);};
  }
  async function poll(url,source){
    if(stopped||document.hidden)return;
    try{
      const res=await fetch(url,{cache:'no-store'});
      if(res.ok)for(const [symbol,q] of Object.entries(await res.json()))update(symbol,q.price,q.timestamp*1000,source);
    }catch{}
  }
  const exchange=()=>poll('/data/unlock-exchange-prices','snapshot');
  const aggregate=()=>poll('/data/unlock-prices','DefiLlama');
  function start(){stopped=false;connect();exchange();aggregate();}
  window.addEventListener('pagehide',()=>{stopped=true;clearTimeout(retry);socket?.close();});
  window.addEventListener('pageshow',e=>{if(e.persisted)start();});
  start();setInterval(exchange,15000);setInterval(aggregate,60000);
}
