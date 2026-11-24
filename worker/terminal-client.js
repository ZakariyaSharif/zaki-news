(() => {
  const panel=document.querySelector('[data-terminal]');
  if(!panel)return;
  const lang=document.documentElement.lang;
  const t=(so,en)=>lang==='en'?en:so;
  const number=n=>Number(n).toLocaleString('en-US');
  const money=(n,decimals=0)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:decimals,minimumFractionDigits:decimals}).format(n);
  const short=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2}).format(n);
  const set=(attribute,name,value)=>{const node=panel.querySelector('[data-'+attribute+'="'+name+'"]');if(node)node.textContent=value;};
  const value=(name,text)=>set('value',name,text);
  const note=(name,text)=>set('note',name,text);
  const status=text=>{panel.querySelector('[data-status]').textContent=text;};
  const unavailable=()=>status(t('Xogta hadda lama heli karo.','Data is temporarily unavailable.'));
  async function fetchData(path){
    const response=await fetch(path);
    if(!response.ok)throw Error('Data unavailable');
    return response.json();
  }
  function make(tag,text=''){
    const el=document.createElement(tag);
    el.textContent=text;
    return el;
  }
  function table(target,rows){
    const body=panel.querySelector(target);
    body.replaceChildren(...rows.map(items=>{
      const row=make('tr');
      const first=items[0];
      if(first&&first.tagName==='A'&&first.href){
        row.className='ed-chart-row';
        row.dataset.chartHref=first.href;
        row.addEventListener('click',e=>{
          if(e.target.closest('a,button,input')) return;
          window.open(first.href,'_blank','noopener,noreferrer');
        });
      }
      for(const item of items){
        const cell=make('td');
        cell.append(item);
        row.append(cell);
      }
      return row;
    }));
  }
  const canvas=panel.querySelector('canvas');
  let plot,hover;
  function draw(){
    if(!canvas||!plot)return;
    const {points,projection,axis,paint}=plot;
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(w<100||h<100||points.length<2)return;
    const ratio=devicePixelRatio||1;
    canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    const c=canvas.getContext('2d');
    c.scale(ratio,ratio);
    const a=points[0][0],b=projection?.[0]||points.at(-1)[0];
    const ys=[...points.map(p=>p[1]),...(projection?[projection[1]]:[])];
    const lo=Math.floor(Math.min(...ys)/axis.step)*axis.step;
    const hi=Math.ceil(Math.max(...ys)/axis.step)*axis.step;
    const left=12,right=w-72,top=17,bottom=h-32;
    const x=n=>left+(right-left)*(n-a)/(b-a||1);
    const y=n=>bottom-(bottom-top)*(n-lo)/(hi-lo||1);
    const style=getComputedStyle(panel);
    const muted=style.getPropertyValue('--dim');
    c.font='11px Inter, sans-serif';c.fillStyle=muted;c.strokeStyle=style.getPropertyValue('--line');
    const lines=Math.min(8,Math.max(4,Math.round((hi-lo)/axis.step)));
    for(let i=0;i<=lines;i++){
      const current=lo+(hi-lo)*i/lines;
      const at=y(current);
      c.beginPath();c.moveTo(left,at);c.lineTo(right,at);c.stroke();
      c.fillText(axis.format(current),right+8,at+4);
    }
    const labels=w>700?9:5;
    for(let i=0;i<labels;i++){
      const time=a+(b-a)*i/(labels-1);
      c.textAlign=i===labels-1?'right':'left';
      c.fillText(String(new Date(time).getUTCFullYear()),x(time),h-10);
    }
    const last=points.at(-1);
    const gradient=c.createLinearGradient(0,top,0,bottom);
    gradient.addColorStop(0,paint+'75');gradient.addColorStop(1,paint+'06');
    c.beginPath();c.moveTo(x(a),bottom);
    for(const p of points)c.lineTo(x(p[0]),y(p[1]));
    if(projection)c.lineTo(x(projection[0]),y(projection[1]));
    c.lineTo(right,bottom);c.closePath();c.fillStyle=gradient;c.fill();
    c.beginPath();points.forEach(([px,py],i)=>i?c.lineTo(x(px),y(py)):c.moveTo(x(px),y(py)));
    c.strokeStyle=paint;c.lineWidth=2;c.stroke();
    if(projection){
      c.setLineDash([4,5]);c.beginPath();c.moveTo(x(last[0]),y(last[1]));c.lineTo(x(projection[0]),y(projection[1]));c.stroke();c.setLineDash([]);
    }
    c.beginPath();c.arc(x(last[0]),y(last[1]),4,0,Math.PI*2);c.fillStyle=paint;c.fill();
    if(hover!=null){
      const at=a+(b-a)*Math.max(0,Math.min(1,(hover-left)/(right-left)));
      const point=points.reduce((nearest,p)=>Math.abs(p[0]-at)<Math.abs(nearest[0]-at)?p:nearest);
      const px=x(point[0]),py=y(point[1]);
      c.strokeStyle=muted;c.lineWidth=1;c.setLineDash([3,4]);c.beginPath();c.moveTo(px,top);c.lineTo(px,bottom);c.stroke();c.setLineDash([]);
      c.fillStyle=paint;c.beginPath();c.arc(px,py,4,0,Math.PI*2);c.fill();
      const label=new Date(point[0]).toLocaleDateString(lang,{dateStyle:'medium'})+' · '+axis.format(point[1]);
      const size=c.measureText(label).width+18;
      const tx=Math.max(3,Math.min(w-size-3,px+9)),ty=Math.max(5,py-32);
      c.fillStyle=style.getPropertyValue('--terminal-panel');c.fillRect(tx,ty,size,23);
      c.strokeStyle=muted;c.strokeRect(tx,ty,size,23);
      c.textAlign='left';c.fillStyle=style.getPropertyValue('--white');c.fillText(label,tx+9,ty+15);
    }
  }
  if(canvas){
    new ResizeObserver(draw).observe(canvas);
    canvas.addEventListener('pointermove',e=>{hover=e.offsetX;draw();});
    canvas.addEventListener('pointerleave',()=>{hover=null;draw();});
    document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',draw));
  }
  if(panel.dataset.terminal==='debt'){
    fetchData('/data/debt').then(d=>{
      value('debt',money(d.total));
      note('debt',t('La daabacay','Reported')+' · '+d.date);
      value('spending',money(d.spending.value));
      note('spending','FY '+d.spending.year+' · '+d.spending.date);
      status(d.snapshot||d.spending.snapshot?t('Waxaa la muujinayaa tiradii rasmiga ahayd ee ugu dambaysay ee la kaydiyay.','Showing the latest saved official release.'):'');
      plot={points:d.history.map(([date,n])=>[Date.parse(date),n]),axis:{step:5e12,format:n=>'$'+(n/1e12).toFixed(0)+'T'},paint:'#12ca83'};
      draw();
    }).catch(unavailable);
  }
  if(panel.dataset.terminal==='halving'){
    let state;
    const estimated=d=>new Date(d.targetTime).toLocaleDateString(lang,{dateStyle:'medium'});
    function timer(){
      if(!state)return;
      const seconds=Math.max(0,Math.floor((state.targetTime-Date.now())/1000));
      value('remaining',[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(' : '));
    }
    async function update(){
      try{
        const d=await fetchData('/data/halving');state=d;
        value('date',estimated(d));note('date',new Date(d.targetTime).toLocaleTimeString(lang,{hour:'numeric',minute:'2-digit',timeZoneName:'short'}));
        value('blocks',number(d.next-d.height));note('blocks',t('Bartilmaameed','Target')+' #'+number(d.next));
        if(d.price)value('price',money(d.price,2));
        table('[data-blocks]',d.blocks.map(b=>{
          const link=make('a','#'+number(b.height));link.href='https://mempool.space/block/'+b.id;link.rel='noopener noreferrer';
          return [link,new Date(b.time*1000).toLocaleString(lang,{dateStyle:'medium',timeStyle:'short'})];
        }));
        status(d.blocks.length?'':t('Liiska blocks-ka hadda lama heli karo.','The latest blocks list is temporarily unavailable.'));
        plot={points:[[Date.UTC(2024,3,20),840000],[d.blocks[0]?.time*1000||d.observed,d.height]],projection:[d.targetTime,d.next],axis:{step:25000,format:number},paint:'#ff911c'};
        draw();timer();
      }catch{unavailable();}
    }
    update();setInterval(timer,1000);setInterval(()=>{if(!document.hidden)update();},45000);
  }
  
  if(panel.dataset.terminal==='liquidations') liquidationPanel({panel,t,value,note,table,make,status,short});
})();

function liquidationPanel({panel,t,value,note,table,make,status,short}){
  const heat=panel.querySelector('[data-heat]');
  const activity=panel.querySelector('[data-activity]');
  const ratio=panel.querySelector('.terminal-ratio span');
  const start=Date.now();
  const storageKey='zaki-liquidations-v1';
  const events=[];
  const seen=new Map();
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
    if(Array.isArray(saved)) for(const item of saved.slice(-24000)){
      if(typeof item?.id!=='string'||!/^\w{1,25}$/.test(item.asset)||!['long','short'].includes(item.side)||!Number.isFinite(item.time)||item.time<start-86400000||!Number.isFinite(item.amount)||item.amount<=0)continue;
      if(!Number.isFinite(item.price)){
        const fields=item.id.split(':');
        const historical=fields[0]==='okx'?Number(fields[5]):Number(fields[3]);
        if(Number.isFinite(historical)&&historical>0)item.price=historical;
      }
      events.push(item);seen.set(item.id,item.time);
    }
  }catch{}
  function persist(){
    try {localStorage.setItem(storageKey,JSON.stringify(events.slice(-24000)));} catch {}
  }

  const rangeButtons=[...panel.querySelectorAll('[data-window]')];
  let windowMinutes=Number(rangeButtons.find(b=>b.getAttribute('aria-pressed')==='true')?.dataset.window)||60,retries=0,socket,closed=false,connection='connecting',historyState='loading';
  function addHistory(rows){
    if(!Array.isArray(rows))return;
    for(const r of rows){
      if(!Array.isArray(r))continue;
      const [id,asset,side,time,amount]=r;
      if(typeof id!=='string'||!id.startsWith('okx:')||seen.has(id)||!/^[A-Z0-9]{1,25}$/.test(asset)||!['long','short'].includes(side)||!Number.isFinite(time)||time<Date.now()-86400000||!Number.isFinite(amount)||amount<=0)continue;
      events.push({id,asset,side,time,amount,source:'OKX',price:Number(r[5]??id.split(':')[5])});
      seen.set(id,time);
    }
  }
  try {addHistory(JSON.parse(document.getElementById('liquidation-seed')?.textContent||'[]'));}catch{}
  async function refreshHistory(){
    try{
      const res=await fetch('/data/liquidations');
      if(!res.ok)throw Error('History unavailable');
      const data=await res.json();
      addHistory(data.events);
      historyState=data.available?.length?'recent':'snapshot';
      displayStatus();render();
    }catch{
      historyState=events.some(e=>e.source==='OKX')?'snapshot':'unavailable';
      displayStatus();
    }
  }
  const updatePriceView=vzPriceView(panel,t,make,short,render);
  const aliases={XBT:'BTC',XDG:'DOGE','1000SHIB':'SHIB','1000PEPE':'PEPE','1000BONK':'BONK','1000FLOKI':'FLOKI'};
  function localLogo(symbol){
    const key=String(symbol||'').toUpperCase().replace(/^1000/,'');
    return liquidationLogos[key]||liquidationLogos[String(symbol||'').toUpperCase()]||null;
  }
  function logo(asset){
    const symbol=Object.hasOwn(aliases,asset)?aliases[asset]:asset;
    const badge=make('span');
    badge.className='liquidation-logo';
    badge.setAttribute('aria-hidden','true');
    const path=localLogo(symbol);
    if(path){
      const img=make('img');
      img.src=path;
      img.alt='';
      img.width=32;
      img.height=32;
      img.addEventListener('error',()=>{
        img.remove();
        const fallback=make('span');
        fallback.className='coin-fallback';
        fallback.textContent=String(symbol||'?').replace(/^1000/,'').slice(0,3);
        badge.append(fallback);
      },{once:true});
      badge.append(img);
      return badge;
    }
    const fallback=make('span');
    fallback.className='coin-fallback';
    fallback.textContent=String(symbol||'?').replace(/^1000/,'').slice(0,3);
    badge.append(fallback);
    return badge;
  }
  function eventAsset(asset){
    const label=make('a');
    label.className='ed-coin-link liquidation-asset';
    label.href=tradingViewChartHref('crypto',asset);
    label.target='_blank';
    label.rel='noopener noreferrer';
    const afford=make('span');
    afford.className='ed-row-affordance';
    afford.setAttribute('aria-hidden','true');
    afford.innerHTML=chartArrowIcon();
    label.append(logo(asset),make('strong',asset),afford);
    return label;
  }
  function tiles(rows,box,nodes){
    if(!rows.length)return;
    if(rows.length===1){
      const [name,record]=rows[0];
      const tile=make('div');
      const share=record.long/record.total;
      tile.className='heat-tile';
      tile.style.cssText='left:'+box.x+'%;top:'+box.y+'%;width:'+box.w+'%;height:'+box.h+'%;--tile:'+ (share>.65?'#11775e':share<.35?'#9b4050':'#47516a');
      tile.title=name+' · '+short(record.total)+' · '+Math.round(share*100)+'% longs';
      if(name&&name!==t('Kale','Other')){
        tile.style.cursor='pointer';
        tile.dataset.chartHref=tradingViewChartHref('crypto',name);
        tile.addEventListener('click',()=>window.open(tile.dataset.chartHref,'_blank','noopener,noreferrer'));
      }

      if(box.w>7&&box.h>9){
        if(box.w>13&&box.h>18&&name!==t('Kale','Other'))tile.append(logo(name));
        tile.append(make('strong',name),make('span',short(record.total)));
      }else tile.setAttribute('aria-label',tile.title);
      nodes.push(tile);return;
    }
    const total=rows.reduce((sum,[,r])=>sum+r.total,0);
    let slice=0, i=0;
    const horizontal=box.w*heat.clientWidth>=box.h*heat.clientHeight;
    do {slice+=rows[i++][1].total;}while(i<rows.length-1&&slice<total/2);
    const split=slice/total;
    if(horizontal){
      const w=box.w*split;
      tiles(rows.slice(0,i),{...box,w},nodes);
      tiles(rows.slice(i),{...box,x:box.x+w,w:box.w-w},nodes);
    }else{
      const h=box.h*split;
      tiles(rows.slice(0,i),{...box,h},nodes);
      tiles(rows.slice(i),{...box,y:box.y+h,h:box.h-h},nodes);
    }
  }
  let spotQuotes={},polling=false;
  const coinsDetails=panel.querySelector('.liq-coins');
  async function pollTrade(){
    if(closed||document.hidden||polling||!coinsDetails.open)return;
    polling=true;
    try{
      const response=await fetch('/data/liquidation-spot-prices',{cache:'no-store'});
      if(response.ok)spotQuotes=await response.json();
    }catch{}finally{polling=false;}
  }
  coinsDetails.addEventListener('toggle',pollTrade);
  const totalsCards=[...panel.querySelectorAll('[data-liq-hours]')];
  function updateTotals(now){
    const venues=new Map(),coins=new Map();
    let largest=null;
    const sums=totalsCards.map(()=>({long:0,short:0}));
    for(const event of events){
      if(event.time>now)continue;
      const coin=coins.get(event.asset)||{long:0,short:0};
      coin[event.side]+=event.amount;
      coins.set(event.asset,coin);
      const venue=event.source||'Binance';
      venues.set(venue,(venues.get(venue)||0)+event.amount);
      if(!largest||event.amount>largest.amount)largest=event;
      totalsCards.forEach((card,i)=>{
        if(event.time>=now-Number(card.dataset.liqHours)*3600000)sums[i][event.side]+=event.amount;
      });
    }
    totalsCards.forEach((card,i)=>{
      const {long,short:sold}=sums[i],total=long+sold;
      card.querySelector('[data-sum]').textContent=total?short(total):'—';
      card.querySelector('[data-longs]').textContent=total?short(long):'—';
      card.querySelector('[data-shorts]').textContent=total?short(sold):'—';
      const meter=card.querySelector('.liq-meter');
      meter.classList.toggle('populated',total>0);
      meter.firstElementChild.style.width=(total?100*long/total:0)+'%';
    });
    panel.querySelector('[data-liq-count]').textContent=coins.size+' '+t('coin oo leh dhacdooyin 24 saac gudahood','coins with reported liquidations in 24h')+' · OKX + Binance';
    if(coinsDetails.open){
      const ranked=[...coins].sort(([,a],[,b])=>(b.long+b.short)-(a.long+a.short));
      table('[data-liq-coins]',ranked.map(([asset,amount])=>{
        const q=spotQuotes[asset];
        return [eventAsset(asset),short(amount.long),short(amount.short),short(amount.long+amount.short),
          q?q.price.toLocaleString('en-US',{maximumSignificantDigits:7}):'—',
          q?new Date(q.time).toISOString().slice(0,19).replace('T',' '):'—'];
      }));
    }
    const day=sums.at(-1),total=day.long+day.short;
    const pct=n=>(100*n/total).toFixed(1)+'%';
    const venue=[...venues].sort((a,b)=>b[1]-a[1])[0];
    panel.querySelector('[data-day-split]').textContent=total?'Long '+pct(day.long)+' · Short '+pct(day.short)+' · '+events.filter(e=>e.time<=now).length.toLocaleString()+' '+t('dhacdo oo la arkay','observed events'):t('Weli xog lama helin.','No events received yet.');
    panel.querySelector('[data-exchange-share]').textContent=t('Suuqa saamiga ugu weyn leh','Largest exchange share')+' · '+(venue?venue[0]+' '+pct(venue[1]):'—');
    panel.querySelector('[data-big-order]').textContent=t('Amarkii ugu weynaa ee la arkay','Largest observed order')+' · '+(largest?[short(largest.amount),largest.source||'Binance',largest.asset,largest.side,Number.isFinite(largest.price)?'$'+largest.price.toLocaleString('en-US',{maximumSignificantDigits:7}):'',new Date(largest.time).toISOString().slice(11,19)+' UTC'].filter(Boolean).join(' · '):'—');
  }
  function render(){
    const now=Date.now();
    const since=now-windowMinutes*60000;
    events.sort((a,b)=>a.time-b.time);
    while(events.length&&(events[0].time<now-86400000||events.length>24000))events.shift();
    for(const [id,time] of seen){if(time<now-86400000||seen.size>25000)seen.delete(id);}
    const recent=events.filter(e=>e.time>=since);
    const latestEvent=events.at(-1);
    panel.querySelector('[data-liq-event-time]').textContent=latestEvent?t('Xiritaankii ugu dambeeyey','Latest reported liquidation')+' · '+(latestEvent.source||'Binance')+' · '+new Date(latestEvent.time).toISOString().slice(0,19).replace('T',' ')+' UTC':t('Dhacdo ayaa la sugayaa','Waiting for liquidation reports');
    updateTotals(now);
    updatePriceView(recent,since,now);
    const groups=new Map();
    const bucketMinutes=Math.max(1,Math.ceil(windowMinutes/60));
    const buckets=Array.from({length:Math.ceil(windowMinutes/bucketMinutes)},()=>({long:0,short:0}));
    let long=0,shorts=0;
    for(const e of recent){
      if(e.side==='long')long+=e.amount;else shorts+=e.amount;
      const group=groups.get(e.asset)||{total:0,long:0};
      group.total+=e.amount;
      if(e.side==='long')group.long+=e.amount;
      groups.set(e.asset,group);
      const i=Math.max(0,Math.min(buckets.length-1,Math.floor((e.time-since)/(bucketMinutes*60000))));
      buckets[i][e.side]+=e.amount;
    }
    const total=long+shorts;
    const ready=recent.length>0||historyState==='recent';
    value('total',ready?short(total):'—');value('long',ready?short(long):'—');value('short',ready?short(shorts):'—');value('count',ready?recent.length.toLocaleString():'—');
    note('total',recent.length?t('Dhacdadii ugu horreysay: ','First received: ')+new Date(Math.min(...recent.map(e=>e.time))).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}):'Binance');
    if(total){ratio.style.width=(100*long/total)+'%';ratio.parentElement.classList.add('has-data');}else{ratio.style.width='0%';ratio.parentElement.classList.remove('has-data');}
    const nodes=[];
    const top=[...groups].sort((a,b)=>b[1].total-a[1].total);
    const displayed=top.slice(0,32);
    if(top.length>32)displayed.push([t('Kale','Other'),top.slice(32).reduce((all,[,v])=>({total:all.total+v.total,long:all.long+v.long}),{total:0,long:0})]);
    tiles(displayed,{x:0,y:0,w:100,h:100},nodes);
    heat.replaceChildren(...(nodes.length?nodes:[make('p',ready?t('Weli wax dhacdo ah lama helin muddadan.','No events received in this window yet.'):t('Waxaa la sugayaa xogta suuqa.','Waiting for market data.'))]));
    table('[data-events]',recent.slice(-25).reverse().map(e=>[eventAsset(e.asset),e.side==='long'?'Long':'Short',short(e.amount),e.source||'Binance',new Date(e.time).toISOString().slice(11,19)]));
    const max=Math.max(1,...buckets.map(x=>x.long+x.short));
    activity.replaceChildren(...buckets.map((b,i)=>{
      const el=make('div');el.title=Math.min(0,(i+1)*bucketMinutes-windowMinutes)+'m · '+short(b.long)+' longs · '+short(b.short)+' shorts';
      for(const side of ['long','short']){const bar=make('span');bar.dataset.side=side;bar.style.height=(100*b[side]/max)+'%';el.append(bar);}
      return el;
    }));
  }
  rangeButtons.forEach(button=>button.addEventListener('click',()=>{
    windowMinutes=Number(button.dataset.window);
    rangeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const url=new URL(location.href);
    url.searchParams.set('range',button.textContent.trim());
    history.replaceState(history.state,'',url);
    render();
  }));
  const displayStatus=()=>{
    const historical={loading:t('OKX: xogtii dhowayd ayaa la soo raraya','OKX: loading recent events'),recent:t('OKX: xogtii dhowayd','OKX: recent events'),snapshot:t('OKX: nuqul hore','OKX: saved snapshot'),unavailable:t('OKX: xog lama heli karo','OKX: history unavailable')};
    const binance=connection==='open'?t('Binance: waa ku xiran yahay','Binance: connected'):connection==='connecting'?t('Binance: isku xirka','Binance: connecting'):t('Binance: lama heli karo','Binance: unavailable');
    status(historical[historyState]+' · '+binance+' · '+t('Wadartu waxay ku salaysan tahay xogta la helay.','Totals cover the reported events available.'));
  };
  function connect(){
    if(closed)return;
    connection='connecting';displayStatus();
    socket=new WebSocket('wss://fstream.binance.com/market/ws/!forceOrder@arr');
    const timeout=setTimeout(()=>{if(socket.readyState===WebSocket.CONNECTING)socket.close();},12000);
    socket.onopen=()=>{clearTimeout(timeout);connection='open';retries=0;displayStatus();render();};
    socket.onmessage=event=>{
      try{
        const o=JSON.parse(event.data).o;
        if(!o||(o.st&&Number(o.st)!==1)||!['BUY','SELL'].includes(o.S))return;
        const symbol=String(o.s).match(/^([A-Z0-9]+?)(USDT|USDC)$/);
        const amount=Number(o.ap)*Number(o.z),time=Number(o.T);
        if(!symbol||!Number.isFinite(amount)||amount<=0||!Number.isFinite(time)||time<Date.now()-3600000||time>Date.now()+60000)return;
        const id=[o.s,o.S,time,o.ap,o.z].join(':');
        if(seen.has(id))return;
        seen.set(id,time);
        events.push({id,asset:symbol[1],source:'Binance',side:o.S==='SELL'?'long':'short',time,amount,price:Number(o.ap)});
      }catch{}
    };
    socket.onclose=()=>{clearTimeout(timeout);connection='closed';displayStatus();if(!closed)setTimeout(connect,Math.min(60000,2000*2**Math.min(retries++,5)));};
  }
  window.addEventListener('pagehide',()=>{closed=true;persist();socket?.close();});
  window.addEventListener('pageshow',e=>{if(e.persisted){closed=false;connect();pollTrade();refreshHistory();}});
  pollTrade();setInterval(pollTrade,10000);
  render();connect();refreshHistory();setInterval(render,1500);setInterval(persist,15000);setInterval(()=>{if(!document.hidden)refreshHistory();},35000);
}


function vzProfitEstimate({capital,entry,exit,entryFee,exitFee}){
  const inputs=[capital,entry,exit,entryFee,exitFee];
  if(!inputs.every(Number.isFinite)||capital<=0||entry<=0||exit<0||entryFee<0||exitFee<0||entryFee>=100||exitFee>=100)return null;
  const units=capital/(1+entryFee/100)/entry;
  const gross=units*exit;
  const proceeds=gross*(1-exitFee/100);
  const profit=proceeds-capital;
  const fees=(units*entry)*(entryFee/100)+gross*(exitFee/100);
  const breakEven=entry*(1+entryFee/100)/(1-exitFee/100);
  const result={units,proceeds,profit,roi:profit/capital*100,fees,breakEven};
  return Object.values(result).every(Number.isFinite)?result:null;
}

function vzPriceGrid(events,asset,since,now){
  const rows=events.filter(e=>e.asset===asset&&Number.isFinite(e.price)&&e.price>0&&e.time>=since&&e.time<=now);
  if(!rows.length)return null;
  let min=Infinity,max=-Infinity;
  for(const row of rows){min=Math.min(min,row.price);max=Math.max(max,row.price);}
  const nPrice=min===max?1:8,nTime=12;
  const step=(max-min)/nPrice||1;
  const timeStep=(now-since)/nTime;
  const cells=Array.from({length:nPrice},()=>Array.from({length:nTime},()=>({total:0,long:0,short:0,count:0})));
  let peak=0;
  for(const row of rows){
    const p=Math.min(nPrice-1,Math.floor((row.price-min)/step));
    const col=Math.min(nTime-1,Math.floor((row.time-since)/timeStep));
    const cell=cells[p][col];
    cell.total+=row.amount;cell[row.side]+=row.amount;cell.count++;
    peak=Math.max(peak,cell.total);
  }
  return {cells,min,max,step,timeStep,peak};
}

function vzPriceView(panel,t,make,short,rerender){
  const sel=panel.querySelector('[data-vz-asset]');
  const matrix=panel.querySelector('[data-vz-matrix]');
  const status=panel.querySelector('[data-vz-readout]');
  const price=n=>n.toLocaleString('en-US',{maximumSignificantDigits:7});
  const formatTime=ms=>new Date(ms).toISOString().slice(11,19);
  const profile=panel.querySelector('[data-price-profile]');
  const requested=new URLSearchParams(location.search).get('asset')||'BTC';
  let lastSignature='',selected=/^[A-Z0-9]{1,18}$/.test(requested)?requested:'BTC',interval=0,available='';
  sel.addEventListener('change',()=>{selected=sel.value;lastSignature='';status.textContent='';rerender();});
  return (events,since,now)=>{
    const symbols=[...new Set([selected,'BTC','ETH','SOL',...events.filter(e=>e.price>0).map(e=>e.asset)])].sort();
    const menu=symbols.join('|');
    if(menu!==available){
      available=menu;
      sel.replaceChildren(...symbols.map(s=>{const opt=make('option',s);opt.value=s;return opt;}));sel.value=selected;
    }
    const duration=now-since;
    const anchor=Math.floor(now/Math.max(1000,Math.floor(duration/120)));
    const signature=[selected,duration,anchor,events.length,events.at(-1)?.id].join('|');
    if(lastSignature===signature)return;
    const keepFocus=matrix.contains(document.activeElement)?document.activeElement?.dataset?.coord:null;
    lastSignature=signature;
    if(interval!==duration){status.textContent='';interval=duration;}
    const grid=vzPriceGrid(events,selected,since,now);
    if(!grid){profile.textContent=t('Ma jiraan dhacdooyin muddadan.','No reported events in this window.');matrix.replaceChildren(make('p',t('Muddadan wax dhacdo qiime leh looma helin ','No priced events in this window for ')+selected+'.'));status.textContent='';return;}
    const table=make('table');table.className='vz-heat-grid';
    table.setAttribute('aria-label',selected+' · '+t('Heerarka qiimaha iyo waqtiga UTC','Price bands by UTC time'));
    const thead=table.createTHead().insertRow();thead.append(make('th','USDT / USDⓈ'));
    for(let col=0;col<12;col++){const th=make('th',col%3===0?formatTime(since+col*grid.timeStep).slice(0,5):'');th.scope='col';thead.append(th);}
    const body=table.createTBody();
    for(let p=grid.cells.length-1;p>=0;p--){
      const row=body.insertRow();
      const low=grid.min+p*grid.step,high=p===grid.cells.length-1?grid.max:low+grid.step;
      const label=low===high?price(low):price(low)+'–'+price(high);
      const th=make('th',label);th.scope='row';row.append(th);
      for(const [col,cell] of grid.cells[p].entries()){
        const td=row.insertCell();
        if(!cell.count){td.className='vz-empty';continue;}
        const btn=make('button');btn.type='button';btn.dataset.coord=p+'-'+col;
        const detail=selected+' · '+label+' · '+formatTime(since+col*grid.timeStep)+'–'+formatTime(since+(col+1)*grid.timeStep)+' UTC · '+short(cell.total)+' · '+cell.count+' '+t('dhacdo','events')+' · Long '+short(cell.long)+' / Short '+short(cell.short);
        btn.style.setProperty('--vz-strength',(0.26+0.74*Math.sqrt(cell.total/grid.peak)).toFixed(3));
        btn.title=detail;btn.setAttribute('aria-label',detail);
        btn.addEventListener('click',()=>{status.textContent=detail;});
        td.append(btn);
      }
    }
    const bands=grid.cells.map(cells=>cells.reduce((s,c)=>({long:s.long+c.long,short:s.short+c.short}),{long:0,short:0}));
    const peak=Math.max(1,...bands.map(b=>b.long+b.short));
    const list=make('table');list.className='liq-band-table';
    const head=list.createTHead().insertRow();
    for(const title of [t('Heerka qiimaha','Price band'),'Long','Short',t('Qaddarka','Relative size')])head.append(make('th',title));
    const bodyBands=list.createTBody();
    for(let i=bands.length-1;i>=0;i--){
      const band=bands[i],row=bodyBands.insertRow();
      row.append(make('th',table.tBodies[0].rows[bands.length-1-i].cells[0].textContent));
      row.insertCell().textContent=short(band.long);row.insertCell().textContent=short(band.short);
      const bar=make('div');bar.className='liq-band-bar';
      for(const side of ['long','short']){
        const segment=make('i');segment.className=side;segment.style.width=(100*band[side]/peak)+'%';bar.append(segment);
      }
      row.insertCell().append(bar);
    }
    profile.replaceChildren(list);
    matrix.replaceChildren(table);
    if(keepFocus)matrix.querySelector('[data-coord="'+keepFocus+'"]')?.focus({preventScroll:true});
  };
}

function vzInitMarketTools(){
  const tr=(so,en)=>document.documentElement.lang==='en'?en:so;
  const panel=document.querySelector('[data-vz-profit]');
  const number=(n,digits)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:digits}).format(n);
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:n!==0&&Math.abs(n)<1?8:2}).format(n);
  if(panel){
    const fields=[...panel.querySelectorAll('input')];
    const outputs=[...panel.querySelectorAll('[data-vz-output]')];
    function showProfit(){
      const result=vzProfitEstimate(Object.fromEntries(fields.map(f=>[f.name,f.valueAsNumber])));
      for(const field of outputs){
        const key=field.dataset.vzOutput;
        field.textContent=!result?'—':key==='units'?number(result.units,10):key==='roi'?number(result.roi,2)+'%':money(result[key]);
        field.dataset.sign=result&&['profit','roi'].includes(key)?Math.sign(result[key]):'';
      }
      panel.querySelector('[data-vz-error]').textContent=result?'':tr('Geli raasamaal iyo qiime iibsi ka weyn eber, qiime iibin oo eber ama ka badan, iyo khidmad u dhexeysa 0% iyo wax ka yar 100%.','Enter positive capital and entry price, a nonnegative exit price, and fees from 0% to below 100%.');
    }
    const form=panel.querySelector('form');
    form.addEventListener('submit',event=>event.preventDefault());
    form.addEventListener('reset',()=>queueMicrotask(showProfit));
    panel.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{
      const entry=form.elements.entry.valueAsNumber;
      if(Number.isFinite(entry)&&entry>0){
        form.elements.exit.value=Number((entry*(1+Number(button.dataset.move)/100)).toPrecision(12));
        showProfit();
      }
    }));
    fields.forEach(f=>f.addEventListener('input',showProfit));showProfit();
  }
  const bubbles=document.querySelector('[data-vz-bubbles]');
  if(!bubbles)return;
  const field=bubbles.querySelector('[data-vz-field]');
  const detail=bubbles.querySelector('[data-vz-detail]');
  const asof=bubbles.querySelector('[data-vz-asof]');
  const direction=bubbles.querySelector('[name=direction]'),size=bubbles.querySelector('[name=size]');
  let rows=JSON.parse(bubbles.querySelector('[data-vz-seed]').textContent);
  let selected='bitcoin',stale=false,period='24h';
  const search=bubbles.querySelector('[data-bubble-search]'),rank=bubbles.querySelector('[data-bubble-rank]');
  const spot=new Map();
  const gatePairs=JSON.parse(bubbles.querySelector('[data-gate-pairs]').textContent);
  const dayMoves=new Map();
  const unit=x=>quote(x).source.startsWith('Gate')?'USDT':'USD';
  const priceText=x=>unit(x)==='USD'?currency.format(quote(x).price):number(quote(x).price,8)+' ₮';
  function changeFor(x){
    const day=dayMoves.get(x.id);
    return period==='24h'&&day&&(day.time>=x.time||Date.now()-day.time<30000)?day.value:x.moves[period];
  }
  const pairs={'BTC-USD':'bitcoin','ETH-USD':'ethereum','SOL-USD':'solana','XRP-USD':'ripple','DOGE-USD':'dogecoin','ADA-USD':'cardano','LINK-USD':'chainlink','LTC-USD':'litecoin','AVAX-USD':'avalanche-2','BCH-USD':'bitcoin-cash'};
  const currency=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumSignificantDigits:7});
  function quote(x){
    const latest=spot.get(x.id);
    return latest&&(latest.time>=x.time||(latest.source!=='DefiLlama'&&Date.now()-latest.time<30000))?latest:{price:x.last,time:x.time,source:'CoinGecko'};
  }
  function record(id,price,time,source,day){
    const now=Date.now(),previous=spot.get(id);
    if(!Number.isFinite(price)||price<=0||!Number.isFinite(time)||time<=0||time>now+60000)return;
    if(previous&&now-previous.time<30000&&(
      (source==='DefiLlama'&&previous.source!=='DefiLlama')||
      (source==='Gate snapshot'&&previous.source==='Gate stream')))return;
    if(Number.isFinite(day)&&time>=(dayMoves.get(id)?.time||0))dayMoves.set(id,{value:day,time});
    if(!previous||time>=previous.time)spot.set(id,{price,time,source});
  }
  let socket,stopped=false,retry;
  function connectSpot(){
    if(stopped)return;
    try{socket=new WebSocket('wss://ws-feed.exchange.coinbase.com');}
    catch{retry=setTimeout(connectSpot,10000);return;}
    socket.onopen=()=>socket.send(JSON.stringify({type:'subscribe',product_ids:Object.keys(pairs),channels:['ticker']}));
    socket.onmessage=message=>{
      try{
        const q=JSON.parse(message.data);
        if(q.type==='ticker'&&Object.hasOwn(pairs,q.product_id))record(pairs[q.product_id],Number(q.price),Date.parse(q.time),'Coinbase',Number(q.open_24h)>0?(Number(q.price)/Number(q.open_24h)-1)*100:null);
      }catch{}
    };
    socket.onclose=()=>{if(!stopped)retry=setTimeout(connectSpot,5000);};
  }
  let gateSocket,gateRetry;
  function connectGate(){
    if(stopped)return;
    try{gateSocket=new WebSocket('wss://api.gateio.ws/ws/v4/');}
    catch{gateRetry=setTimeout(connectGate,5000);return;}
    const ids=Object.entries(gatePairs).filter(([,id])=>!Object.values(pairs).includes(id)).map(([pair])=>pair);
    gateSocket.onopen=()=>gateSocket.send(JSON.stringify({time:Math.floor(Date.now()/1000),channel:'spot.tickers',event:'subscribe',payload:ids}));
    gateSocket.onmessage=e=>{
      try{
        const msg=JSON.parse(e.data),q=msg.result;
        if(msg.channel==='spot.tickers'&&msg.event==='update'&&Object.hasOwn(gatePairs,q.currency_pair))
          record(gatePairs[q.currency_pair],Number(q.last),Number(msg.time_ms)||Number(msg.time)*1000,'Gate stream',Number(q.change_percentage));
      }catch{}
    };
    gateSocket.onclose=()=>{if(!stopped)gateRetry=setTimeout(connectGate,5000);};
  }
  async function fetchGate(){
    try{
      const response=await fetch('/data/bubble-tickers',{cache:'no-store'});
      if(!response.ok)return;
      for(const [id,q] of Object.entries(await response.json())){
        if(Object.values(pairs).includes(id)&&spot.get(id)?.source==='Coinbase'&&Date.now()-spot.get(id).time<30000)continue;
        record(id,q.price,q.time,'Gate snapshot',q.day);
      }
      draw();paintSpot();
    }catch{}
  }
  async function fetchSpot(){
    try{
      const resp=await fetch('/data/bubble-spot',{cache:'no-store'});
      if(!resp.ok)return;
      const quotes=await resp.json();
      for(const [id,q] of Object.entries(quotes))record(id,q.price,q.time,'DefiLlama');
    }catch{}
  }
  window.addEventListener('pagehide',()=>{stopped=true;clearTimeout(retry);clearTimeout(gateRetry);gateSocket?.close();socket?.close();});
  window.addEventListener('pageshow',()=>{if(stopped){stopped=false;connectSpot();connectGate();fetchGate();fetchSpot();}});
  function detailFor(x){return x.symbol+' / '+unit(x)+' · '+priceText(x)+' · '+period+' '+(x.change>0?'+':'')+number(x.change,2)+'% · '+tr('Mugga','Volume')+' '+new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:2}).format(x.volume)+' USD';}
  function displayQuote(x){
    detail.replaceChildren();
    if(!x){detail.textContent=tr('Lammaane ku habboon ma jiro.','No pairs match this filter.');return;}
    const metrics=[[tr('Lammaane','Pair'),x.symbol+' / '+unit(x)],[tr('Qiime','Price'),priceText(x)],[period,(x.change>0?'+':'')+number(x.change,2)+'%'],[tr('Mugga 24h','24h volume'),new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:2}).format(x.volume)+' USD']];
    for(const [label,value] of metrics){
      const group=document.createElement('div'),caption=document.createElement('small'),figure=document.createElement('strong');
      caption.textContent=label;figure.textContent=value;group.append(caption,figure);detail.append(group);
    }
    const chart=document.createElement('a');
    chart.className='ed-coin-link';
    chart.href=tradingViewChartHref('crypto',x.symbol);
    chart.target='_blank';
    chart.rel='noopener noreferrer';
    chart.innerHTML=tr('Fur jaantuska TradingView','Open TradingView chart')+' '+chartArrowIcon();
    detail.append(chart);
  }
  function arrange(){
    const width=field.clientWidth;
    if(width<1)return;
    const placed=[];
    const scale=Math.max(.68,Math.min(1.1,width/960));
    for(const node of field.querySelectorAll('button')){
      const diameter=Math.min(width-10,Math.round((48+167*Number(node.dataset.weight))*scale));
      const r=diameter/2,edge=r+5;
      let best=null;
      for(let x=edge;x<=width-edge+.1;x+=3){
        let y=edge;
        for(const other of placed){
          const reach=r+other.r+5,dx=x-other.x;
          if(Math.abs(dx)<reach)y=Math.max(y,other.y+Math.sqrt(reach*reach-dx*dx));
        }
        const score=y+Math.abs(width/2-x)*.19;
        if(!best||score<best.score)best={x,y,r,score};
      }
      if(!best)continue;
      placed.push(best);
      node.style.width=node.style.height=diameter+'px';node.querySelector('[data-spot-price]').hidden=diameter<82;
      node.style.setProperty('--bubble-font',Math.min(diameter*.225,diameter*1.48/(node.dataset.label.length+1))+'px');
      node.style.left=(best.x-r)+'px';node.style.top=(best.y-r)+'px';
    }
    field.style.height=(placed.length?Math.ceil(Math.max(...placed.map(p=>p.y+p.r)))+6:50)+'px';
  }
  function draw(){
    const term=search.value.trim().toLowerCase();
    const universe=rows.filter(x=>x.rank<=Number(rank.value)&&(!term||(x.name+' '+x.symbol).toLowerCase().includes(term))&&Number.isFinite(changeFor(x))).map(x=>({...x,change:changeFor(x)}));
    const filtered=universe.filter(x=>direction.value==='all'||(direction.value==='gain'?x.change>0:x.change<0));
    const weight=x=>size.value==='volume'?x.volume:size.value==='cap'?x.cap:Math.abs(x.change);
    filtered.sort((a,b)=>weight(b)-weight(a));
    const max=weight(filtered[0]||{change:0,volume:0})||1;
    const nodes=filtered.map(x=>{
      const button=document.createElement('button');button.type='button';button.className='vz-bubble secondary';button.dataset.sign=Math.sign(x.change);button.dataset.symbol=x.id;button.dataset.label=x.symbol;
      const label=document.createElement('strong');label.textContent=x.symbol;
      const change=document.createElement('span');change.textContent=(x.change>0?'+':'')+number(x.change,2)+'%';
      const path=/^https:\/\/(coin-images|assets)\.coingecko\.com\//.test(x.image)?x.image:localLogo(x.symbol);
      if(path){
        const icon=document.createElement('img');
        icon.alt='';icon.src=path;icon.width=18;icon.height=18;
        let retried=false;
        icon.addEventListener('error',()=>{
          const local=localLogo(x.symbol);
          if(!retried&&local&&!icon.getAttribute('src').includes('/coin-logo/')){retried=true;icon.src=local;return;}
          const fb=document.createElement('span');
          fb.className='coin-fallback';
          fb.textContent=String(x.symbol||'?').replace(/^1000/,'').slice(0,3);
          icon.replaceWith(fb);
        });
        button.append(icon);
      }else{
        const fb=document.createElement('span');
        fb.className='coin-fallback';
        fb.textContent=String(x.symbol||'?').replace(/^1000/,'').slice(0,3);
        button.append(fb);
      }
      const price=document.createElement('small');price.dataset.spotPrice='';price.textContent=priceText(x);
      button.append(label,change,price);button.setAttribute('aria-label',detailFor(x));button.title=detailFor(x);
      button.dataset.weight=Math.sqrt(weight(x)/max);
      button.addEventListener('click',()=>{selected=x.id;field.querySelector('[aria-pressed=true]')?.setAttribute('aria-pressed','false');button.setAttribute('aria-pressed','true');displayQuote(x);});
      return button;
    });
    if(!filtered.some(r=>r.id===selected))selected=filtered[0]?.id;
    nodes.forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.symbol===selected)));
    const current=filtered.find(x=>x.id===selected);
    const focused=field.contains(document.activeElement)?document.activeElement.dataset.symbol:null;
    field.replaceChildren(...nodes);if(focused)nodes.find(n=>n.dataset.symbol===focused)?.focus({preventScroll:true});
    displayQuote(current);
    const legend=bubbles.querySelector('[data-vz-legend]');
    legend.replaceChildren(...[['gain',tr('Kacay','Gainers'),universe.filter(x=>x.change>0).length],['loss',tr('Dhacay','Losers'),universe.filter(x=>x.change<0).length],['flat',tr('Isma beddelin','Flat'),universe.filter(x=>x.change===0).length]].map(([key,label,count])=>{
      const item=document.createElement('span');item.dataset.dir=key;item.textContent=label+' '+count;return item;
    }));
    arrange();
    const newest=Math.max(...rows.map(x=>x.time));
    asof.textContent=(stale||Date.now()-newest>180000?tr('Xogtii la kaydiyey','Saved quotes'):tr('La cusboonaysiiyey','Updated'))+' · '+new Date(newest).toISOString().slice(0,19).replace('T',' ')+' UTC';
  }
  search.addEventListener('input',draw);
  for(const btn of bubbles.querySelectorAll('[data-period]'))btn.addEventListener('click',()=>{period=btn.dataset.period;for(const b of bubbles.querySelectorAll('[data-period]'))b.setAttribute('aria-pressed',String(b===btn));draw();});
  for(const input of [direction,size,rank])input.addEventListener('change',draw);
  async function refresh(){
    try{
      const response=await fetch('/data/crypto-bubbles');
      if(!response.ok)throw Error();
      const data=await response.json();
      if(!Array.isArray(data.rows)||!data.rows.length)throw Error();
      if(Math.max(...data.rows.map(x=>x.time))>=Math.max(...rows.map(x=>x.time)))rows=data.rows;
      stale=false;
    }catch{stale=true;}
    draw();
  }
  let previousWidth=0;
  new ResizeObserver(()=>{if(previousWidth!==field.clientWidth){previousWidth=field.clientWidth;arrange();}}).observe(field);
  function paintSpot(){
    const row=rows.find(r=>r.id===selected),status=bubbles.querySelector('[data-spot-status]');
    if(!row){status.textContent='';return;}
    const q=quote(row),age=Date.now()-q.time;
    const label=['Coinbase','Gate stream'].includes(q.source)&&age<30000?tr('Toos','Live'):age>180000?tr('Qiime kaydsan','Last known price'):tr('Qiimihii ugu dambeeyey','Latest quote');
    status.textContent=label+' · '+q.source+' · '+new Date(q.time).toISOString().slice(0,19).replace('T',' ')+' UTC';
    const price=detail.children[1]?.querySelector('strong');
    if(price){price.textContent=priceText(row);detail.children[0].querySelector('strong').textContent=row.symbol+' / '+unit(row);const move=changeFor(row);detail.children[2].querySelector('strong').textContent=(move>0?'+':'')+number(move,2)+'%';}
    const byId=new Map(rows.map(x=>[x.id,x]));
    for(const button of field.children){
      const x=byId.get(button.dataset.symbol);
      if(!x)continue;
      const move=changeFor(x);button.dataset.sign=Math.sign(move);button.querySelector('span').textContent=(move>0?'+':'')+number(move,2)+'%';
      const text=priceText(x),cell=button.querySelector('[data-spot-price]');
      if(cell.textContent!==text)cell.textContent=text;
      const info=detailFor({...x,change:changeFor(x)});
      if(button.title!==info){button.title=info;button.setAttribute('aria-label',info);}
    }
  }
  draw();paintSpot();connectSpot();connectGate();fetchGate();fetchSpot();refresh();
  setInterval(()=>{if(!document.hidden){fetchGate();draw();}},15000);
  setInterval(()=>{if(!document.hidden)paintSpot();},1000);
  setInterval(()=>{if(!document.hidden)fetchSpot();},20000);
  setInterval(()=>{if(!document.hidden)refresh();},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){fetchSpot();refresh();paintSpot();}});
}
vzInitMarketTools();

(() => {
  const section=document.querySelector('[data-cg]');
  if(!section)return;
  const english=document.documentElement.lang==='en';
  const status=section.querySelector('[data-cg-status]'),body=section.querySelector('[data-cg-body]');
  const usd=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2}).format(n):'—';
  function element(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
  function tiles(rows,x,y,w,h,chart){
    if(!rows.length)return;
    if(rows.length===1){
      const r=rows[0],node=element('div',w*h>200?r.symbol+' '+usd(r.amount):'');
      node.title=r.symbol+' '+usd(r.amount);
      Object.assign(node.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%',background:Number.isFinite(r.long)?(r.long>=r.amount/2?'#137b70':'#a63549'):'#455267'});
      chart.append(node);return;
    }
    const total=rows.reduce((s,r)=>s+r.amount,0);
    let i=1,sum=rows[0].amount;
    while(i<rows.length-1 && Math.abs(sum+rows[i].amount-total/2)<Math.abs(sum-total/2))sum+=rows[i++].amount;
    const f=sum/total;
    if(w>=h){tiles(rows.slice(0,i),x,y,w*f,h,chart);tiles(rows.slice(i),x+w*f,y,w*(1-f),h,chart);}
    else{tiles(rows.slice(0,i),x,y,w,h*f,chart);tiles(rows.slice(i),x,y+h*f,w,h*(1-f),chart);}
  }
  async function refresh(){
    try{
      const res=await fetch('/data/coinglass-liquidations',{cache:'no-store'});
      const data=await res.json();
      if(!res.ok || !Array.isArray(data.coins) || !['1h','4h','12h','24h'].every(period=>data.windows?.some(w=>w.period===period && [w.total,w.long,w.short].every(n=>Number.isFinite(n)&&n>=0)))) throw Error('unavailable');
      const cards=document.createElement('div'),chart=document.createElement('div');
      chart.className='cg-map';cards.className='cg-cards';
      for(const r of data.windows){const card=document.createElement('div');card.append(element('strong',r.period+' · '+usd(r.total)),element('p','Long '+usd(r.long)+' · Short '+usd(r.short)));cards.append(card);}
      tiles(data.coins,0,0,100,100,chart);
      body.replaceChildren(cards,element('h3',english?'Liquidations by coin · 24h':'Liquidations-ka coin kasta · 24h'),chart);
      status.textContent=(english?'Retrieved ':'La helay ')+new Date(data.time).toISOString().slice(11,19)+' UTC';
      section.hidden=false;
    }catch{section.hidden=true;body.replaceChildren();}
    setTimeout(refresh,60000);
  }
  refresh();
})();
