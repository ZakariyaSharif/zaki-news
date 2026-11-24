const quoteBoardCache=new Map();
const boardKeys=['commodities','bonds','futures'];
function initialBoard(key){
  return quoteBoardCache.get(key)?.rows||(key==='bonds'?initialBondQuotes():initialBoardQuotes(key));
}
async function refreshedBoard(key){
  let cache=quoteBoardCache.get(key);
  if(!cache){cache={rows:initialBoard(key),expires:0};quoteBoardCache.set(key,cache);}
  if(cache.expires>Date.now())return cache.rows;
  if(!cache.pending){
    cache.pending=(async()=>{
      try{
        const fresh=await(key==='bonds'?loadBondQuotes():loadBoardQuotes(key));
        cache.rows=cache.rows.map(old=>{
          const row=fresh.find(x=>x.symbol===old.symbol);
          return row&&Number.isFinite(row.price)&&Date.parse(row.asOf)>=Date.parse(old.asOf)?row:old;
        });
        cache.expires=Date.now()+300000;
      }catch{cache.expires=Date.now()+60000;}
      finally{cache.pending=null;}
      return cache.rows;
    })();
  }
  return cache.pending;
}
function boardTrend(values){
  const series=(values||[]).filter(Number.isFinite);
  if(series.length<2)return '—';
  const low=Math.min(...series),range=Math.max(...series)-low;
  const pts=series.map((n,i)=>[(2+96*i/(series.length-1)).toFixed(1),(range?28-24*(n-low)/range:16).toFixed(1)].join(',')).join(' ');
  return '<svg viewBox="0 0 100 32" class="quote-trend" aria-hidden="true"><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}
const bullionMark='<path d="M5 11.5 8.5 6h10l3 5.5-4 2H8z" fill="currentColor"/><path d="m3 13 3 1.4h11l4.8-2.2 1.4 4.2-5 2.6H5l-3.2-1.7z" fill="currentColor" opacity=".72"/>';
const contractMarks={
  GC:['#805406','#fff0c6',bullionMark],
  SI:['#526479','#edf1f7',bullionMark],
  CL:['#364252','#e8edf2','<path fill="currentColor" d="M12 2C10 6 4.8 11 4.8 15a7.2 7.2 0 0 0 14.4 0C19.2 11 14 5.4 12 2Z"/><path d="M8 15a4 4 0 0 0 3 4" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>'],
  NG:['#116a93','#ddf4ff','<path fill="currentColor" d="M13 2c1.8 6.4-1.4 7.2-.7 10.3 1.7-.9 2.8-2.3 3.5-4.5C23 16 18.7 22 12 22 5 22 2 16 6.2 10c.4 2.2 1 3.2 2.2 3.8C7.7 8.7 12 7 13 2Z"/>'],
  ZC:['#7c591c','#fbefcd','<path d="M6 18C4 10 13 2 17 5s0 14-9 15z" fill="currentColor"/><path d="m9 11 6 4m-5-7 7 4m-6 5 5-10" stroke="#fff0bd" fill="none"/>']
};
function instrumentMark(symbol){
  const code=symbol.replace(/=F$/,'');
  const flags={US:'🇺🇸',DE:'🇩🇪',GB:'🇬🇧',JP:'🇯🇵'};
  const mark=contractMarks[code];
  if(!mark)return '<span aria-hidden="true" class="instrument-mark">'+(flags[code.slice(0,2)]||escape(code))+'</span>';
  return '<span aria-hidden="true" class="instrument-mark" style="background:'+mark[1]+';color:'+mark[0]+'"><svg viewBox="0 0 24 24">'+mark[2]+'</svg></span>';
}
function quoteBoard(ctx,key,rows){
  const tr=(so,en)=>t(ctx,so,en),bonds=key==='bonds';
  const title=t(ctx,...marketViews.find(v=>v[0]===key).slice(1));
  const columns=[tr('Hantida','Instrument'),bonds?tr('Heerka dulsaarka','Yield'):tr('Qiimaha','Price'),tr('Isbeddel','Change'),tr('Taariikhda qiimaha','Recent trend'),tr('Taariikhda iyo isha','As of / source')];
  const body=rows.map(row=>{
    const {price,previous}=row;
    const delta=Number.isFinite(previous)&&previous!==0?(bonds?(price-previous)*100:(price/previous-1)*100):null;
    const n=new Intl.NumberFormat(ctx.lang,{minimumFractionDigits:2,maximumFractionDigits:bonds?3:price<10?3:2});
    const change=delta===null?'—':(delta>0?'+':'')+n.format(delta)+(bonds?' bp':'%');
    const month=row.frequency?.toLowerCase().includes('month');
    const stamp=new Date(row.asOf);
    const date=new Intl.DateTimeFormat(ctx.lang,{timeZone:'UTC',year:'numeric',month:'short',...(month?{}:{day:'numeric'})}).format(stamp);
    return '<tr><th scope="row"><div class="instrument-name">'+instrumentMark(row.symbol)+'<div><strong>'+escape(t(ctx,row.so||row.name,row.name))+'</strong><small>'+escape(row.contract||row.symbol)+'</small></div></div></th><td><strong>'+n.format(price)+(bonds?'%':'')+'</strong><small>'+escape(bonds?(month?tr('Bille','Monthly'):tr('Maalinle','Daily')):row.unit)+'</small></td><td><span class="quote-change" data-dir="'+(delta>0?'up':delta<0?'down':'flat')+'">'+change+'</span></td><td>'+boardTrend(row.history)+'</td><td><time datetime="'+escape(row.asOf)+'">'+escape(date)+'</time><small>'+publicLink(row.url,row.source+' ↗')+'</small></td></tr>';
  }).join('');
  const note=bonds?tr('Isbeddelka waxaa lagu cabbiraa dhibco saldhig ah (bp), marka loo eego xogtii hore ee isla taxanaha.','Change is in basis points versus the preceding observation in each series.'):tr('Qiimayaashu waa qandaraasyo futures ah oo dib u dhici kara. Isbeddelku wuxuu ku salaysan yahay xiritaankii hore.','Delayed futures contract quotes. Change is measured against the previous close.');
  return '<section class="asset-board quote-board" data-quote-board="'+key+'"><header><h2>'+escape(title)+'</h2><p>'+note+'</p></header><div class="quote-scroll"><table><thead><tr>'+columns.map(s=>'<th scope="col">'+s+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table></div></section>';
}
