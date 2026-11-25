const nansenNetflowUrl='https://api.nansen.ai/api/v1/smart-money/netflow';
const smartMoneyChains=['ethereum','solana','base'];
const smartMoneyChainNames={ethereum:'Ethereum',solana:'Solana',base:'Base'};
const smartMoneyTtl=12*60;
const smartMoneyFailTtl=120;
const smartMoneyCache=new Map();
const smartMoneyNames={CFG:'Centrifuge',HASHAI:'HashAI',REKT:'REKT',NKP:'NKP',TAC:'TAC'};
const smartMoneySnapshotAsOf='2026-11-24T09:23:00Z';
const smartMoneySnapshot={
  source:'snapshot',
  asOf:smartMoneySnapshotAsOf,
  chain:'ethereum',
  inflows:[
    {symbol:'NKP',name:'NKP',net24:6893,net7d:null,traders:null,change24:null},
    {symbol:'TAC',name:'TAC',net24:1723,net7d:null,traders:null,change24:null},
    {symbol:'REKT',name:'REKT',net24:501,net7d:null,traders:null,change24:null},
    {symbol:'CFG',name:'Centrifuge',net24:0,net7d:null,traders:null,change24:null},
    {symbol:'HASHAI',name:'HashAI',net24:0,net7d:null,traders:null,change24:null}
  ],
  outflows:[]
};

function smartMoneyChain(value){
  const chain=String(value||'').toLowerCase();
  return smartMoneyChains.includes(chain)?chain:'ethereum';
}

function snapshotFor(chain,failed=false){
  if(chain==='ethereum') return {...smartMoneySnapshot,failed:!!failed};
  return {source:'snapshot',asOf:smartMoneySnapshotAsOf,chain,inflows:[],outflows:[],failed:!!failed,ethereumOnly:true};
}

function smNormalize(item){
  const symbol=String(item.token_symbol||'').replace(/^\$/,'').toUpperCase();
  const traders=Number(item.trader_count);
  const net24=Number(item.net_flow_24h_usd);
  const net7d=Number(item.net_flow_7d_usd);
  return {
    symbol,
    name:smartMoneyNames[symbol]||'',
    address:item.token_address||'',
    net24:Number.isFinite(net24)?net24:0,
    net7d:Number.isFinite(net7d)?net7d:null,
    traders:Number.isFinite(traders)?traders:null,
    change24:null
  };
}

async function nansenNetflow(apiKey,chain,direction,perPage){
  const response=await fetch(nansenNetflowUrl,{
    method:'POST',
    headers:{
      'content-type':'application/json',
      accept:'application/json',
      apikey:apiKey
    },
    body:JSON.stringify({
      chains:[chain],
      filters:{
        include_smart_money_labels:['Smart Trader'],
        include_stablecoins:false,
        include_native_tokens:false
      },
      pagination:{page:1,per_page:perPage},
      order_by:[{field:'net_flow_24h_usd',direction}]
    }),
    signal:AbortSignal.timeout(8000)
  });
  if(!response.ok) throw Error('Nansen netflow unavailable');
  const json=await response.json();
  return Array.isArray(json?.data)?json.data:[];
}

async function attachPriceChanges(chain,rows){
  const platform={ethereum:'ethereum',solana:'solana',base:'base'}[chain];
  const addresses=[...new Set(rows.map(r=>r.address).filter(Boolean))];
  if(!platform||!addresses.length) return;
  try{
    const json=await remote('https://api.coingecko.com/api/v3/simple/token_price/'+platform+'?contract_addresses='+encodeURIComponent(addresses.join(','))+'&vs_currencies=usd&include_24hr_change=true');
    const map=new Map(Object.entries(json||{}).map(([k,v])=>[k.toLowerCase(),v]));
    for(const row of rows){
      const change=Number(map.get(String(row.address).toLowerCase())?.usd_24h_change);
      if(Number.isFinite(change)) row.change24=change;
    }
  }catch{}
}

async function fetchLiveSmartMoney(apiKey,chain){
  const [inRaw,outRaw]=await Promise.all([
    nansenNetflow(apiKey,chain,'DESC',25),
    nansenNetflow(apiKey,chain,'ASC',15)
  ]);
  const seenIn=new Set();
  const inflows=inRaw.map(smNormalize).filter(row=>{
    if(!row.symbol||row.net24<0||seenIn.has(row.symbol)) return false;
    seenIn.add(row.symbol);
    return true;
  }).slice(0,10);
  const seenOut=new Set();
  const outflows=outRaw.map(smNormalize).filter(row=>{
    if(!row.symbol||!(row.net24<0)||seenOut.has(row.symbol)) return false;
    seenOut.add(row.symbol);
    return true;
  }).slice(0,5);
  await attachPriceChanges(chain,[...inflows,...outflows]);
  return {source:'live',fetchedAt:Date.now(),chain,inflows,outflows};
}

async function loadSmartMoney(env,chain){
  const apiKey=String(env?.NANSEN_API_KEY||'').trim();
  if(!apiKey) return snapshotFor(chain);
  const cacheKey='nansen-netflow-'+chain;
  const now=Date.now();
  const hit=smartMoneyCache.get(cacheKey);
  if(hit&&hit.expires>now){
    try{return await hit.value;}catch{smartMoneyCache.delete(cacheKey);}
  }
  const pending=fetchLiveSmartMoney(apiKey,chain).catch(()=>snapshotFor(chain,true));
  smartMoneyCache.set(cacheKey,{expires:now+smartMoneyTtl*1000,value:pending});
  const data=await pending;
  if(data.source!=='live'){
    smartMoneyCache.set(cacheKey,{expires:now+smartMoneyFailTtl*1000,value:Promise.resolve(data)});
  }
  return data;
}

function smartMoneyHref(ctx,chain){
  const params=new URLSearchParams();
  if(ctx.lang==='en') params.set('lang','en');
  if(chain&&chain!=='ethereum') params.set('chain',chain);
  const query=params.toString();
  return '/smart-money'+(query?'?'+query:'');
}

function compactFlow(n){
  if(!Number.isFinite(n)) return '—';
  if(n===0) return '$0';
  const sign=n>0?'+':'-';
  const abs=Math.abs(n);
  if(abs<1000) return sign+'$'+abs.toLocaleString('en-US',{maximumFractionDigits:abs>=100?0:2});
  return sign+compactUsd(abs);
}

function flowClass(n){
  if(!Number.isFinite(n)||n===0) return 'is-flat';
  return n>0?'is-in':'is-out';
}

function formatChange(n){
  if(!Number.isFinite(n)) return '—';
  const sign=n>0?'+':n<0?'-':'';
  return sign+Math.abs(n).toLocaleString('en-US',{maximumFractionDigits:1,minimumFractionDigits:1})+'%';
}

function updatedLabel(ctx,fetchedAt,now=Date.now()){
  const minutes=Math.max(0,Math.floor((now-fetchedAt)/60000));
  if(minutes<=0) return t(ctx,'Hadda la cusboonaysiiyay','Updated just now');
  if(minutes===1) return t(ctx,'Waa la cusboonaysiiyay 1 daqiiqo kahor','Updated 1 min ago');
  return t(ctx,'Waa la cusboonaysiiyay '+minutes+' daqiiqo kahor','Updated '+minutes+' min ago');
}

function snapshotStamp(ctx){
  return t(ctx,'Xogta Nansen ee 24 saac · 24 Nofeembar 2026, 09:23 UTC','Nansen 24-hour snapshot · November 24, 2026, 09:23 UTC');
}

function statusLine(ctx,data){
  if(data.source==='live') return '<p class="sm-updated">'+escape(updatedLabel(ctx,data.fetchedAt))+'</p>';
  if(data.ethereumOnly){
    return '<p class="sm-updated sm-note">'+t(ctx,'Xogta tooska ah lama heli karo silsiladan. Sawirka la keydiyay wuxuu ku saabsan yahay Ethereum oo keliya.','Live data is unavailable for this chain. The bundled snapshot covers Ethereum only.')+'</p>';
  }
  if(data.failed){
    return '<p class="sm-updated sm-note">'+t(ctx,'Xogta tooska ah ee Nansen lama heli karin. Waxaa la muujinayaa sawirka 24-saac · 24 Nofeembar 2026, 09:23 UTC','Live Nansen data is unavailable. Showing the 24-hour snapshot · November 24, 2026, 09:23 UTC')+'</p>';
  }
  return '<p class="sm-updated sm-note">'+snapshotStamp(ctx)+'</p>';
}

function smTokenCell(row){
  const name=row.name&&row.name!==row.symbol?escape(row.name):'';
  const inner='<span class="sm-token"><span class="sm-token-mark">'+coinIcon(row.symbol.toLowerCase())+'</span><span class="sm-token-text"><span class="sm-sym">'+escape(row.symbol)+'</span>'+(name?'<span class="sm-name">'+name+'</span>':'')+'</span></span>';
  return coinChartAnchor(row.symbol,inner,'sm-token-link');
}

function smFlowCell(ctx,row){
  const seven=row.net7d!=null&&Number.isFinite(row.net7d)
    ?'<span class="sm-sub">7d '+compactFlow(row.net7d)+'</span>'
    :'';
  const traders=row.traders!=null?String(row.traders):'—';
  const change=row.change24!=null
    ?'<span class="sm-chg '+flowClass(row.change24)+'">'+formatChange(row.change24)+'</span>'
    :'—';
  const meta=(row.traders!=null||row.change24!=null)?'<span class="sm-mobile-meta">'+t(ctx,'Ganacsato','Traders')+' '+traders+' · '+t(ctx,'24 saac','24h')+' '+change+'</span>':'';
  return '<span class="sm-flow '+flowClass(row.net24)+'">'+compactFlow(row.net24)+'</span>'+seven+meta;
}

function smTable(ctx,headers,rows){
  if(!rows.length) return '<p class="sm-empty">'+t(ctx,'Xog lama helin muddadan.','No tokens in this window.')+'</p>';
  const head=headers.map(([label,cls])=>'<th'+(cls?' class="'+cls+'"':'')+'>'+label+'</th>').join('');
  const body=rows.map((row,i)=>{
    const change=row.change24!=null
      ?'<span class="sm-chg '+flowClass(row.change24)+'">'+formatChange(row.change24)+'</span>'
      :'—';
    const traders=row.traders!=null?String(row.traders):'—';
    return '<tr><td class="sm-num">'+(i+1)+'</td><td>'+smTokenCell(row)+'</td><td class="sm-num">'+smFlowCell(ctx,row)+'</td><td class="sm-num">'+traders+'</td><td class="sm-num">'+change+'</td></tr>';
  }).join('');
  return '<div class="sm-scroll"><table class="sm-table"><thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>';
}

async function smartMoneyPage(ctx,env){
  const chain=smartMoneyChain(ctx.url.searchParams.get('chain'));
  const data=await loadSmartMoney(env,chain);
  const title=smartMoneyChainNames[chain]+' Smart Money';
  const headers=[
    ['#','sm-num'],
    ['Token',''],
    [t(ctx,'Qulqulka saafiga ah (USD)','Net flow (USD)'),'sm-num'],
    [t(ctx,'Ganacsatada Smart Money','Smart-money traders'),'sm-num'],
    [t(ctx,'Isbedelka 24 saac','24h change'),'sm-num']
  ];
  const tabs='<nav class="sm-tabs" aria-label="'+t(ctx,'Silsiladaha','Chains')+'">'+smartMoneyChains.map(id=>{
    const active=id===chain;
    return '<a href="'+smartMoneyHref(ctx,id)+'"'+(active?' aria-current="page" class="is-active"':'')+'>'+smartMoneyChainNames[id]+'</a>';
  }).join('')+'</nav>';
  const story=t(ctx,'ethereum-smart-money-24-nofeembar','ethereum-smart-money-nov24');
  const inflowTitle=data.source==='snapshot'&&data.chain==='ethereum'&&!data.failed
    ?t(ctx,'Shanta token ee ugu sarreeya','Top five tokens')
    :t(ctx,'10-ka ugu sarreeya ee qulqulka soo gudaha','Top 10 by net inflow');
  const outflowTitle=t(ctx,'5-ta ugu sarreysa ee qulqulka baxa','Top 5 outflows');
  const outflows=data.outflows.length
    ?smTable(ctx,headers,data.outflows)
    :'<p class="sm-empty">'+t(ctx,data.source==='snapshot'?'Xogta qulqulka baxa kama jirto sawirkan.':'Xog lama helin muddadan.',data.source==='snapshot'?'No outflow data in this snapshot.':'No tokens in this window.')+'</p>';
  const body='<div class="sm-page"><h1>'+escape(title)+'</h1>'+tabs+statusLine(ctx,data)+'<section class="fc-board sm-board"><h2>'+inflowTitle+'</h2>'+smTable(ctx,headers,data.inflows)+'<h2>'+outflowTitle+'</h2>'+outflows+'<a class="sm-analysis" href="/article/'+story+'">'+t(ctx,'Akhri falanqaynta','Read the analysis')+'</a></section></div>';
  return layout(ctx,title,terminalShell(ctx,body),{terminal:'smart-money'});
}
