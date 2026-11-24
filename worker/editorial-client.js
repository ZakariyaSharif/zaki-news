(function(){
  const header=document.querySelector('[data-ed-header]');
  if(!header) return;

  const more=header.querySelector('[data-ed="more"]');
  const mega=header.querySelector('#ed-mega');
  const menu=header.querySelector('[data-ed="menu"]');
  const sheet=document.querySelector('#ed-sheet');
  const searchBtn=header.querySelector('[data-ed="search"]');
  const searchBox=header.querySelector('.ed-search');
  const searchInput=searchBox?.querySelector('input[name="q"]');

  function closeMega(){
    header.classList.remove('mega-open');
    if(more) more.setAttribute('aria-expanded','false');
    if(mega) mega.hidden=true;
  }
  function openMega(){
    closeSheet();
    closeSearch();
    header.classList.add('mega-open');
    if(more) more.setAttribute('aria-expanded','true');
    if(mega) mega.hidden=false;
  }
  function closeSheet(){
    header.classList.remove('sheet-open');
    if(menu) menu.setAttribute('aria-expanded','false');
    if(sheet) sheet.hidden=true;
    document.documentElement.classList.remove('ed-locked');
  }
  function openSheet(){
    closeMega();
    closeSearch();
    header.classList.add('sheet-open');
    if(menu) menu.setAttribute('aria-expanded','true');
    if(sheet) sheet.hidden=false;
    document.documentElement.classList.add('ed-locked');
  }
  function closeSearch(){
    header.classList.remove('search-open');
    if(searchBtn) searchBtn.setAttribute('aria-expanded','false');
  }
  function openSearch(){
    closeMega();
    header.classList.add('search-open');
    if(searchBtn) searchBtn.setAttribute('aria-expanded','true');
    searchInput?.focus();
  }

  more?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('mega-open')?closeMega():openMega();});
  menu?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('sheet-open')?closeSheet():openSheet();});
  sheet?.querySelector('[data-ed="close-sheet"]')?.addEventListener('click',closeSheet);
  searchBtn?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('search-open')?closeSearch():openSearch();});
  document.addEventListener('click',e=>{
    if(header.classList.contains('mega-open') && !header.contains(e.target)) closeMega();
    if(header.classList.contains('search-open') && !header.contains(e.target)) closeSearch();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeMega();closeSheet();closeSearch();}
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
  });

  const market=document.querySelector('[data-ed-market]');
  if(market){
    const buttons=[...market.querySelectorAll('[data-coin]')];
    const select=coin=>{
      buttons.forEach(b=>b.setAttribute('aria-selected', String(b.dataset.coin===coin)));
      market.querySelectorAll('[data-panel]').forEach(p=>{p.hidden=p.dataset.panel!==coin;});
    };
    buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.coin)));
    market.querySelectorAll('.ed-spark').forEach(svg=>bindTooltip(svg));
  }

  function bindTooltip(svg){
    const tip=svg.parentElement.querySelector('.ed-tip');
    if(!tip) return;
    let pts=[];
    try{pts=JSON.parse(svg.dataset.points||'[]');}catch{return;}
    if(pts.length<2) return;
    const dot=svg.querySelector('.ed-spark-hover');
    const move=e=>{
      const box=svg.getBoundingClientRect();
      const t=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));
      const i=Math.round(t*(pts.length-1));
      const x=8+(i*(320-16)/Math.max(pts.length-1,1));
      const min=Math.min(...pts),max=Math.max(...pts);
      const y=8+(140-16)*(1-(pts[i]-min)/(max-min||1));
      if(dot){dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.style.opacity=1;}
      tip.hidden=false;
      tip.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:pts[i]<10?4:2}).format(pts[i]);
      tip.style.left=Math.max(8,Math.min(box.width-80,(e.clientX-box.left)+8))+'px';
    };
    const hide=()=>{tip.hidden=true;if(dot)dot.style.opacity=0;};
    svg.addEventListener('mousemove',move);
    svg.addEventListener('mouseleave',hide);
  }

  const tickers=[...document.querySelectorAll('[data-ed-ticker], [data-ed-price-ticker]')];
  async function fillPrices(){
    try{
      const res=await fetch('/data/prices');
      if(!res.ok) return;
      const {items}=await res.json();
      const usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:n<1?4:2}).format(n);
      for(const ticker of tickers){
        for(const row of ticker.querySelectorAll('[data-symbol]')){
          const item=items.find(x=>x.symbol===row.dataset.symbol);
          if(!item) continue;
          const price=row.querySelector('[data-price]');
          const change=row.querySelector('[data-change]');
          if(price) price.textContent=usd(item.last);
          if(change){
            change.textContent=(item.change>=0?'+':'')+item.change.toFixed(2)+'%';
            change.dataset.direction=item.change>=0?'up':'down';
          }
        }
      }
    }catch{}
  }
  fillPrices();
  setInterval(()=>{if(!document.hidden)fillPrices();},45000);
  const strip=document.querySelector('[data-ed-price-ticker]');
  if(strip){
    const pause=()=>strip.classList.add('is-paused');
    const resume=()=>strip.classList.remove('is-paused');
    strip.addEventListener('mouseenter',pause);
    strip.addEventListener('mouseleave',resume);
    strip.addEventListener('pointerdown',pause);
    strip.addEventListener('pointerup',resume);
  }
})();
