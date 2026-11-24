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

  document.addEventListener('click',e=>{
    const row=e.target.closest('.ed-chart-row');
    if(!row) return;
    if(e.target.closest('a,button,input,label')) return;
    const href=row.getAttribute('data-chart-href');
    if(!href) return;
    window.open(href,'_blank','noopener,noreferrer');
  });

  more?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('mega-open')?closeMega():openMega();});
  menu?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('sheet-open')?closeSheet():openSheet();});
  sheet?.querySelector('[data-ed="close-sheet"]')?.addEventListener('click',closeSheet);
  searchBtn?.addEventListener('click',e=>{e.stopPropagation();header.classList.contains('search-open')?closeSearch():openSearch();});
  document.addEventListener('click',e=>{
    if(header.classList.contains('mega-open') && !header.contains(e.target)) closeMega();
    if(header.classList.contains('search-open') && !header.contains(e.target) && !e.target.closest('.ed-suggest')) closeSearch();
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

  function fitNav(){
    const nav=document.querySelector('[data-ed-nav]');
    if(!nav) return;
    const items=[...nav.querySelectorAll('[data-nav-item]')];
    const overflowHost=document.querySelector('[data-ed-more-topics]');
    items.forEach(a=>{a.hidden=false;a.classList.remove('is-overflow');});
    if(overflowHost) overflowHost.querySelectorAll('[data-nav-overflow]').forEach(n=>n.remove());
    const overflowWrap=overflowHost?overflowHost.closest('.ed-mega-overflow'):null;
    if(overflowWrap) overflowWrap.hidden=true;
    if(getComputedStyle(nav).display==='none') return;
    const keep=3;
    const overflows=[];
    for(let i=items.length-1;i>=keep;i--){
      if(nav.scrollWidth<=nav.clientWidth+1) break;
      items[i].hidden=true;
      items[i].classList.add('is-overflow');
      overflows.unshift(items[i]);
    }
    if(overflowHost && overflows.length){
      const ref=overflowHost.firstChild;
      overflows.forEach(a=>{
        const clone=a.cloneNode(true);
        clone.hidden=false;
        clone.classList.remove('is-overflow');
        clone.removeAttribute('data-nav-item');
        clone.setAttribute('data-nav-overflow','');
        overflowHost.insertBefore(clone, ref);
      });
      if(overflowWrap) overflowWrap.hidden=false;
    }
  }
  fitNav();
  window.addEventListener('resize',fitNav);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitNav).catch(()=>{});
  if(typeof ResizeObserver==='function'){
    const nav=document.querySelector('[data-ed-nav]');
    if(nav) new ResizeObserver(fitNav).observe(nav);
  }


  const lang=document.documentElement.lang==='en'?'en':'so';
  const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
  const compactMoney=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumSignificantDigits:6});
  function formatSuggestPrice(n){
    if(!Number.isFinite(n)) return '';
    return (n>=10?money:compactMoney).format(n);
  }
  function tickerPrice(symbol){
    const row=document.querySelector('[data-ed-price-ticker] [data-symbol="'+symbol+'"]');
    if(!row) return {text:'',change:null};
    const price=row.querySelector('[data-price]')?.textContent?.trim()||'';
    const chg=row.querySelector('[data-change]');
    const text=price&&price!=='—'?price:'';
    const raw=chg?parseFloat(String(chg.textContent).replace('%','').replace('+','')):NaN;
    const change=Number.isFinite(raw)?raw:null;
    const signed=chg&&chg.textContent?chg.textContent.trim():'';
    return {text,change,signed};
  }
  function closeAllSuggest(except){
    document.querySelectorAll('.ed-suggest').forEach(menu=>{
      if(except&&menu===except) return;
      menu.hidden=true;
      menu.innerHTML='';
      const input=menu._suggestInput;
      if(input){
        input.setAttribute('aria-expanded','false');
        input.removeAttribute('aria-activedescendant');
      }
    });
  }
  function placeSuggest(input,menu){
    const r=(input.closest('.ed-search-field')||input).getBoundingClientRect();
    const vv=window.visualViewport;
    const vTop=vv?vv.offsetTop:0;
    const vH=vv?vv.height:window.innerHeight;
    const gap=6;
    const spaceBelow=vTop+vH-r.bottom-gap;
    const spaceAbove=r.top-vTop-gap;
    const openUp=spaceBelow<132&&spaceAbove>spaceBelow;
    const maxH=Math.max(120,Math.min(320,openUp?spaceAbove:spaceBelow));
    const width=Math.min(window.innerWidth-16, r.width>700?Math.min(Math.max(r.width,240),580):Math.max(r.width,160));
    const left=Math.max(8,Math.min(r.left,window.innerWidth-width-8));
    menu.style.position='fixed';
    menu.style.left=left+'px';
    menu.style.width=width+'px';
    menu.style.maxHeight=maxH+'px';
    menu.style.zIndex='240';
    if(openUp){
      menu.style.top='auto';
      menu.style.bottom=(window.innerHeight-r.top+gap)+'px';
    }else{
      menu.style.bottom='auto';
      menu.style.top=(r.bottom+gap)+'px';
    }
  }
  function suggestOptions(menu){
    return [...menu.querySelectorAll('[role="option"]')];
  }
  function setActiveSuggest(menu,index){
    const opts=suggestOptions(menu);
    const input=menu._suggestInput;
    opts.forEach((el,i)=>{
      const on=i===index;
      el.classList.toggle('is-active',on);
      el.setAttribute('aria-selected',on?'true':'false');
      if(on){
        if(input) input.setAttribute('aria-activedescendant',el.id);
        const m=menu.getBoundingClientRect();
        const o=el.getBoundingClientRect();
        if(o.bottom>m.bottom) menu.scrollTop+=o.bottom-m.bottom+8;
        if(o.top<m.top) menu.scrollTop-=m.top-o.top+8;
      }
    });
    if(index<0&&input) input.removeAttribute('aria-activedescendant');
    menu._activeIndex=index;
  }
  function activateSuggest(opt){
    if(!opt) return;
    const href=opt.getAttribute('data-href');
    const ext=opt.getAttribute('data-external')==='true';
    if(!href) return;
    closeAllSuggest();
    if(ext) window.open(href,'_blank','noopener,noreferrer');
    else location.href=href;
  }
  function renderSuggest(menu,data,q){
    const input=menu._suggestInput;
    menu.innerHTML='';
    let n=0;
    const frag=document.createDocumentFragment();
    for(const group of (data.groups||[])){
      const title=document.createElement('div');
      title.className='ed-suggest-label';
      title.textContent=group.label;
      frag.append(title);
      for(const item of group.items||[]){
        const opt=document.createElement('a');
        opt.className='ed-suggest-item ed-suggest-'+item.type;
        opt.id=menu.id+'-opt-'+n;
        opt.setAttribute('role','option');
        opt.setAttribute('aria-selected','false');
        opt.href=item.href;
        opt.setAttribute('data-href',item.href);
        if(item.external){
          opt.setAttribute('data-external','true');
          opt.target='_blank';
          opt.rel='noopener noreferrer';
        }
        if(item.type==='coin'){
          const live=tickerPrice(item.symbol);
          const price=live.text||formatSuggestPrice(item.price);
          const change=live.change!=null?live.change:item.change;
          const signed=live.signed||(Number.isFinite(change)?((change>0?'+':'')+change.toFixed(2)+'%'):'');
          const media=document.createElement('span');
          media.className='ed-suggest-media';
          if(item.logo){
            const img=document.createElement('img');
            img.src=item.logo; img.alt=''; img.width=22; img.height=22;
            media.append(img);
          }else{
            media.textContent=(item.ticker||'?').slice(0,3);
          }
          const copy=document.createElement('span');
          copy.className='ed-suggest-copy';
          copy.innerHTML='<strong></strong><small></small>';
          copy.querySelector('strong').textContent=item.name;
          copy.querySelector('small').textContent=item.ticker;
          const quote=document.createElement('span');
          quote.className='ed-suggest-quote';
          if(price){
            const p=document.createElement('span');
            p.className='ed-suggest-price';
            p.textContent=price;
            quote.append(p);
          }
          if(signed){
            const c=document.createElement('span');
            c.className='ed-suggest-chg';
            c.dataset.direction=change>0?'up':change<0?'down':'flat';
            c.textContent=signed;
            quote.append(c);
          }
          opt.append(media,copy,quote);
        }else if(item.type==='story'){
          const media=document.createElement('span');
          media.className='ed-suggest-media is-thumb';
          if(item.thumb){
            const img=document.createElement('img');
            img.src=item.thumb; img.alt=''; img.width=44; img.height=28;
            media.append(img);
          }
          const copy=document.createElement('span');
          copy.className='ed-suggest-copy';
          copy.innerHTML='<strong></strong><small></small>';
          copy.querySelector('strong').textContent=item.title;
          copy.querySelector('small').textContent=item.category||'';
          opt.append(media,copy);
        }else{
          const copy=document.createElement('span');
          copy.className='ed-suggest-copy';
          const strong=document.createElement('strong');
          strong.textContent=item.title;
          copy.append(strong);
          opt.append(copy);
        }
        opt.addEventListener('mousedown',e=>e.preventDefault());
        opt.addEventListener('click',e=>{
          if(item.external){e.preventDefault();activateSuggest(opt);}
        });
        opt.addEventListener('mousemove',()=>setActiveSuggest(menu,suggestOptions(menu).indexOf(opt)));
        frag.append(opt);
        n++;
      }
    }
    const all=document.createElement('a');
    all.className='ed-suggest-all';
    all.id=menu.id+'-all';
    all.setAttribute('role','option');
    all.setAttribute('aria-selected','false');
    all.href=data.allHref||('/search?q='+encodeURIComponent(q)+(lang==='en'?'&lang=en':''));
    all.setAttribute('data-href',all.href);
    all.textContent=data.seeAll||(lang==='en'?'See all results for “'+q+'”':'Eeg dhammaan natiijooyinka “'+q+'”');
    all.addEventListener('mousedown',e=>e.preventDefault());
    all.addEventListener('mousemove',()=>setActiveSuggest(menu,suggestOptions(menu).indexOf(all)));
    frag.append(all);
    menu.append(frag);
    menu.hidden=false;
    if(input) input.setAttribute('aria-expanded','true');
    placeSuggest(input,menu);
    setActiveSuggest(menu, n?0:-1);
    requestAnimationFrame(()=>placeSuggest(input,menu));
    setTimeout(()=>{ if(!menu.hidden) placeSuggest(input,menu); }, 200);
  }
  function wireSuggest(input){
    if(!input||input.dataset.suggestWired) return;
    input.dataset.suggestWired='1';
    input.setAttribute('role','combobox');
    input.setAttribute('aria-autocomplete','list');
    input.setAttribute('aria-expanded','false');
    input.setAttribute('autocomplete','off');
    input.setAttribute('autocorrect','off');
    input.setAttribute('autocapitalize','off');
    input.spellcheck=false;
    const menu=document.createElement('div');
    menu.className='ed-suggest';
    menu.hidden=true;
    menu.id='ed-suggest-'+Math.random().toString(36).slice(2,8);
    menu.setAttribute('role','listbox');
    menu._suggestInput=input;
    input.setAttribute('aria-controls',menu.id);
    document.body.append(menu);
    let timer=0,seq=0,lastQ='';
    const langParam=lang==='en'?'&lang=en':'';
    const run=(force)=>{ 
      const q=input.value.trim();
      if(!q){closeAllSuggest();return;}
      if(q===lastQ&&!menu.hidden){placeSuggest(input,menu);return;}
      const id=++seq;
      fetch('/data/suggest?q='+encodeURIComponent(q)+langParam,{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():null).then(data=>{
        if(id!==seq) return;
        if(!force&&document.activeElement!==input) return;
        lastQ=q;
        if(!data) return;
        renderSuggest(menu,data,q);
      }).catch(()=>{});
    };
    const schedule=()=>{
      clearTimeout(timer);
      timer=setTimeout(run,150);
    };
    input.addEventListener('input',schedule);
    input.addEventListener('focus',()=>{ if(input.value.trim()) {lastQ=''; run();} });
    input.addEventListener('ed-suggest-open',()=>{ lastQ=''; run(true); });
    input.addEventListener('keydown',e=>{
      const open=!menu.hidden;
      if(e.key==='Escape'){
        if(open){e.preventDefault();e.stopPropagation();closeAllSuggest();return;}
      }
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){
        if(!open){ if(input.value.trim()) run(); e.preventDefault(); return; }
        e.preventDefault();
        const opts=suggestOptions(menu);
        if(!opts.length) return;
        const cur=menu._activeIndex>=0?menu._activeIndex:(e.key==='ArrowDown'?-1:0);
        const next=e.key==='ArrowDown'?Math.min(opts.length-1,cur+1):Math.max(0,cur-1);
        setActiveSuggest(menu,next);
        return;
      }
      if(e.key==='Enter'){
        if(open){
          const opts=suggestOptions(menu);
          const opt=opts[menu._activeIndex];
          if(opt){e.preventDefault();activateSuggest(opt);}
        }
      }
    });
    input.addEventListener('blur',()=>{ setTimeout(()=>{ if(document.activeElement!==input) closeAllSuggest(null); },180); });
  }
  document.addEventListener('pointerdown',e=>{
    if(!e.target.closest('.ed-suggest') && !e.target.closest('.ed-search input[name="q"], .ed-sheet-search input[name="q"], .ed-search-page-form input[name="q"]')) closeAllSuggest();
  },true);
  document.querySelectorAll('.ed-search input[name="q"], .ed-sheet-search input[name="q"], .ed-search-page-form input[name="q"]').forEach(wireSuggest);
  const pageInput=document.querySelector('.ed-search-page-form input[name="q"]');
  if(pageInput&&pageInput.value.trim()){
    pageInput.dispatchEvent(new CustomEvent('ed-suggest-open'));
  }
  const vv=window.visualViewport;
  const relayout=()=>document.querySelectorAll('.ed-suggest:not([hidden])').forEach(menu=>{ if(menu._suggestInput) placeSuggest(menu._suggestInput,menu); });
  window.addEventListener('resize',relayout);
  if(vv){ vv.addEventListener('resize',relayout); vv.addEventListener('scroll',relayout); }
  document.addEventListener('scroll',relayout,true);


})();
