const shariaTitles=['Xalaal iyo Xaaraan','Halal & Haram'];
const toolsNav = {
  'crypto-bubbles':['Goobooyinka crypto','Crypto bubbles'],'profit-calculator':['Xisaabiyaha faa’iidada','Profit calculator'],
  'smart-money':['Smart Money','Smart Money'],markets:['Suuqyada','Markets'], highlights:['Muuqaalka suuqa','Crypto highlights'], unlocks:['Furitaanka tokennada','Token unlocks'],
  calendar:['Jadwalka dhaqaalaha','Economic calendar'], halving:['Bitcoin halving','Bitcoin halving'],
  debt:['Deynta Maraykanka','US debt'], charts:['Jaantusyada','Charts'], liquidations:['Likwideeynta','Liquidations']
};
const switchLabels={...toolsNav,ticker:['Qiimaha tooska ah','Price ticker'],newsletter:['Warsidaha','Newsletter']};
const t = (ctx,so,en) => ctx.lang==='en'?en:so;
const enabled = (ctx,key) => ctx.sections?.[key]!==false;
const editionHref = (ctx,path) => path==='/' ? '/'+ctx.lang : ctx.lang==='en' ? path+(path.includes('?')?'&':'?')+'lang=en' : path;
const marketCoins = coins;
const tickerCoins = marketCoins.concat([
  ['link','Chainlink'],['avax','Avalanche'],['sui','Sui'],['trx','TRON'],
  ['near','NEAR'],['ltc','Litecoin'],['atom','Cosmos'],['dot','Polkadot']
].filter(([symbol])=>!marketCoins.some(([key])=>key===symbol)));
function editorialTicker(ctx){
  const item=([symbol,name])=>'<a class="ed-tick-item" data-symbol="'+symbol+'" href="'+editionHref(ctx,'/chart/crypto/'+symbol.toUpperCase())+'">'+
    coinIcon(symbol)+
    '<span class="ed-tick-name">'+escape(name)+'</span>'+
    '<span class="ed-tick-sym">'+symbol.toUpperCase()+'</span>'+
    '<span class="ed-tick-price" data-price>—</span>'+
    '<span class="ed-tick-chg" data-change></span>'+
  '</a>';
  const row=tickerCoins.map(item).join('');
  return '<div class="ed-ticker" data-ed-price-ticker data-ed-ticker aria-label="'+t(ctx,'Qiimaha crypto tooska ah','Live crypto prices')+'">'+
    '<div class="ed-ticker-track">'+row+row+'</div></div>';
}
const coinIconAliases={xbt:'btc',xdg:'doge',matic:'pol',rndr:'render',polygon:'pol',weth:'eth',toncoin:'ton'};
function coinFile(symbol){
  const raw=String(symbol||'').trim().toLowerCase();
  const compact=raw.replace(/[^a-z0-9]/g,'');
  const stripped=raw.replace(/^1000/,'').replace(/[^a-z0-9]/g,'');
  const candidates=[raw,compact,raw.replace(/^1000/,''),stripped,coinIconAliases[raw],coinIconAliases[compact],coinIconAliases[stripped]].filter(Boolean);
  const names=Object.keys(coinAssets);
  for(const key of candidates){
    const file=names.find(name=>name.toLowerCase().startsWith(key+'.'));
    if(file) return file;
  }
  return null;
}
function coinFallbackGlyph(symbol){
  const letters=escape(String(symbol||'?').replace(/^1000/i,'').replace(/[^a-z0-9]/gi,'').slice(0,3).toUpperCase()||'?');
  return '<span class="coin-fallback" aria-hidden="true">'+letters+'</span>';
}
function coinIcon(symbol){
  const file=coinFile(symbol);
  const letters=escape(String(symbol||'?').replace(/^1000/i,'').replace(/[^a-z0-9]/gi,'').slice(0,3).toUpperCase()||'?');
  if(!file) return coinFallbackGlyph(symbol);
  return '<img class="coin-logo" src="/coin-logo/'+file+'" alt="" width="25" height="25" loading="lazy" onerror="this.outerHTML=\'<span class=coin-fallback aria-hidden=true>'+letters+'</span>\'">';
}
function sectionNav(ctx){
  return '<nav class="wrap nav market-nav" aria-label="'+t(ctx,'Xogta suuqa','Market data')+'"><a href="'+editionHref(ctx,'/etf-flows')+'">'+t(ctx,'Qulqulka ETF-yada crypto','Crypto ETF flows')+'</a>'+Object.entries(toolsNav).filter(([k])=>enabled(ctx,k)).map(([k,v])=>'<a href="'+editionHref(ctx,'/'+k)+'">'+t(ctx,...v)+'</a>').join('')+'<a href="'+editionHref(ctx,'/etfs')+'">'+t(ctx,'ETF-yada','ETFs')+'</a><a href="'+editionHref(ctx,'/fear-greed')+'">'+t(ctx,'Cabsi iyo Damac','Fear &amp; Greed')+'</a></nav>';
}
function newsletter(ctx,compact=false){
  if(!enabled(ctx,'newsletter')) return '';
  return '<section class="newsletter'+(compact?' newsletter-compact':'')+'"><h2>'+t(ctx,'Warsidaha Zaki News','Zaki News newsletter')+'</h2><form method="post" action="/newsletter"><input type="hidden" name="lang" value="'+ctx.lang+'"><label>'+t(ctx,'Iimaylkaaga','Your email')+'<input name="email" type="email" maxlength="254" autocomplete="email" required></label><label class="consent"><input type="checkbox" name="consent" value="yes" required>'+t(ctx,'Waxaan rabaa inaan helo warsidaha.','I want to receive the newsletter.')+'</label><button>'+t(ctx,'Isdiiwaangeli','Subscribe')+'</button></form></section>';
}
async function subscribe(ctx,req,db){
  if(!enabled(ctx,'newsletter')) return text('Not found',404);
  if(req.headers.get('origin')!==ctx.url.origin||!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return text('Request rejected',403);
  const form=await req.formData();
  ctx.lang=form.get('lang')==='en'?'en':'so';
  const email=String(form.get('email')||'').trim().toLowerCase();
  if(email.length>254||!validEmail(email)||form.get('consent')!=='yes') return publisherPage(ctx,t(ctx,'Hubi xogtaada','Check your details'),newsletter(ctx),{status:400,noindex:true});
  await dbRun(db,'INSERT OR IGNORE INTO subscribers (email,created_at) VALUES (?,?)',email,new Date().toISOString());
  return publisherPage(ctx,t(ctx,'Waad isdiiwaangelisay','You’re subscribed'),'<p>'+t(ctx,'Waad ku mahadsan tahay isdiiwaangelinta.','Thank you for subscribing.')+'</p>',{noindex:true});
}
const editionAdminNav='<nav class="publisher-nav"><a href="/admin?panel=subscribers">Isdiiwaangeliyeyaasha</a><a href="/admin?panel=sections">Qaybaha bogga</a><a href="/admin?panel=calendar">Jadwalka iyo unlocks</a></nav>';
async function editionAdmin(ctx,req,db,panel){
  if(panel==='subscribers'){
    if(ctx.url.searchParams.has('export')){
      const rows=await dbAll(db,'SELECT * FROM subscribers ORDER BY created_at DESC');
      const cell=s=>'"'+(/^[=+@\-]/.test(s)?"'":"")+s.replace(/"/g,'""')+'"';
      return new Response('email,subscribed_at\r\n'+rows.map(r=>[cell(r.email),cell(r.created_at)].join(',')).join('\r\n'),{headers:{'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="zaki-news-subscribers.csv"','cache-control':'private, no-store'}});
    }
    if(req.method==='POST'){
      const form=await req.formData();
      await dbRun(db,'DELETE FROM subscribers WHERE email=?',String(form.get('email')||''));
      return redirect('/admin?panel=subscribers');
    }
    const total=(await dbFirst(db,'SELECT COUNT(*) AS n FROM subscribers')).n;
    const pages=Math.max(1,Math.ceil(total/50));
    const page=Math.min(pages,Math.max(1,parseInt(ctx.url.searchParams.get('page'),10)||1));
    const rows=await dbAll(db,'SELECT * FROM subscribers ORDER BY created_at DESC,email LIMIT 50 OFFSET ?',(page-1)*50);
    return studioPage(ctx,publisherNav+editionAdminNav+'<h2>Isdiiwaangeliyeyaasha ('+total+')</h2><a class="btn" href="/admin?panel=subscribers&amp;export=1">Soo dejiso CSV</a><div class="studio-table"><table><thead><tr><th>Iimayl</th><th>Taariikh</th><th></th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+escape(r.email)+'</td><td>'+date(r.created_at)+'</td><td><form method="post" action="/admin?panel=subscribers"><button class="secondary" name="email" value="'+escape(r.email)+'">Ka saar</button></form></td></tr>').join('')+'</tbody></table></div><div class="studio-pages">'+(page>1?'<a href="/admin?panel=subscribers&amp;page='+(page-1)+'">← Hore</a>':'')+(page<pages?'<a href="/admin?panel=subscribers&amp;page='+(page+1)+'">Xiga →</a>':'')+'</div>');
  }
  if(panel==='sections'){
    if(req.method==='POST'){
      const form=await req.formData();
      const settings=Object.fromEntries(Object.keys(switchLabels).map(k=>[k,form.get(k)==='on']));
      await dbRun(db,"INSERT INTO settings (key,value) VALUES ('sections',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(settings));
      return redirect('/admin?panel=sections&saved=1');
    }
    return studioPage(ctx,publisherNav+editionAdminNav+message(ctx.url.searchParams.has('saved')?'Waa la kaydiyay.':'')+'<form class="form studio-editor" method="post"><h2>Qaybaha bogga</h2>'+Object.entries(switchLabels).map(([k,v])=>'<label class="consent"><input type="checkbox" name="'+k+'"'+(enabled(ctx,k)?' checked':'')+'>'+v[0]+'</label>').join('')+'<button>Kaydi</button></form>');
  }
  let notice='';
  const editId=ctx.url.searchParams.get('edit_event');
  const current=editId?await dbFirst(db,'SELECT * FROM schedules WHERE id=?',editId):null;
  if(req.method==='POST'){
    const form=await req.formData();
    const read=k=>String(form.get(k)||'').trim();
    if(read('delete')){
      await dbRun(db,'DELETE FROM schedules WHERE id=?',read('delete'));
      return redirect('/admin?panel=calendar');
    }
    const kind=read('kind'),title=read('title'),when=read('when'),source=https(read('source'));
    const nums=['amount','usd','supply'].map(k=>read(k)===''?null:Number(read(k)));
    const results=['actual','forecast','previous','importance','release_time','country'].map(k=>kind==='calendar'?read(k):'');
    results[5]=results[5].toUpperCase();
    const validResults=(!results[5]||/^[A-Z]{2}$/.test(results[5]))&&results.slice(0,3).every(v=>v.length<=40)&&['','high','medium','low'].includes(results[3])&&(!results[4]||/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(results[4]));
    const validDate=/^\d{4}-\d{2}-\d{2}$/.test(when)&&Number.isFinite(Date.parse(when))&&new Date(when).toISOString().slice(0,10)===when;
    if(['calendar','unlocks'].includes(kind)&&title&&title.length<=140&&validDate&&source&&source.length<=1000&&nums.every(n=>n===null||Number.isFinite(n)&&n>=0)&& (nums[2]===null||nums[2]<=100)&&validResults){
      const columns=[kind,title,when,...nums,source,...results];
      if(current)await dbRun(db,'UPDATE schedules SET kind=?,title=?,event_date=?,amount=?,usd=?,supply=?,source=?,actual=?,forecast=?,previous=?,importance=?,release_time=?,country=? WHERE id=?',...columns,current.id);
      else await dbRun(db,'INSERT INTO schedules (kind,title,event_date,amount,usd,supply,source,actual,forecast,previous,importance,release_time,country) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',...columns);
      return redirect('/admin?panel=calendar');
    }
    notice='Hubi taariikhda, cinwaanka, qaddarka iyo xiriirka isha.';
  }
  const rows=await dbAll(db,'SELECT * FROM schedules ORDER BY event_date DESC,id DESC LIMIT 100');
  const value=current||{};
  const controls='<form class="form studio-editor" method="post"><label>Nooca<select name="kind">'+options(['calendar','unlocks'],value.kind||'calendar',{calendar:'Dhacdo dhaqaale',unlocks:'Token unlock'})+'</select></label>'+field('title','Dhacdada ama token-ka',value.title,'required maxlength="140"')+field('when','Taariikhda',value.event_date,'type="date" required')+field('source','Isha rasmiga ah',value.source,'type="url" required maxlength="1000"')+'<h3>Natiijooyinka dhaqaalaha</h3>'+field('country','Dalka (ISO: US, GB, DE)',value.country,'maxlength="2" pattern="[A-Za-z]{2}"')+field('release_time','Waqtiga ET',value.release_time,'type="time"')+field('actual','Actual',value.actual,'maxlength="40"')+field('forecast','Forecast',value.forecast,'maxlength="40"')+field('previous','Previous',value.previous,'maxlength="40"')+'<label>Muhiimadda<select name="importance">'+options(['','high','medium','low'],value.importance||'',{'':'Otomaatig',high:'Sare',medium:'Dhexe',low:'Hoose'})+'</select></label><h3>Token unlocks</h3>'+field('amount','Tirada tokennada',value.amount,'type="number" min="0" step="any"')+field('usd','Qiimaha USD',value.usd,'type="number" min="0" step="any"')+field('supply','Saamiga sahayda (%)',value.supply,'type="number" min="0" max="100" step="any"')+'<button>'+(current?'Kaydi isbeddellada':'Ku dar')+'</button></form>';
  return studioPage(ctx,publisherNav+editionAdminNav+message(notice)+controls+'<ul class="admin-list">'+rows.map(r=>'<li><form method="post"><span>'+escape(r.title)+' · '+escape(r.event_date)+'</span> <a href="/admin?panel=calendar&amp;edit_event='+r.id+'">Wax ka beddel</a> <button class="secondary" name="delete" value="'+r.id+'">Tirtir</button></form></li>').join('')+'</ul>',{status:notice?400:200});
}

const mainCategories=['Crypto','Stocks','Forex','Economy','Central Banks','Tech','Politics','Education'];
function canonicalCategory(key){
  return key==='Technology'?'Tech':key;
}
function categoryName(ctx,key){
  const canon=canonicalCategory(key);
  if(ctx.lang==='en') return canon==='Tech'?'Technology':canon;
  return categoryLabels[canon]||categoryLabels[key]||canon;
}
function languageLink(ctx){
  const next=new URL(ctx.url);
  if(ctx.lang==='en') next.searchParams.delete('lang'); else next.searchParams.set('lang','en');
  if(ctx.article?.translationSlug){next.pathname='/article/'+ctx.article.translationSlug;}else if(ctx.article?.sample){
    next.pathname = storyUrl({slug:ctx.lang==='en'?ctx.article.slug.replace(/-en$/,''):ctx.article.slug+'-en'});
  }else if(ctx.article){
    next.pathname='/';
    next.search=ctx.lang==='en'?'':'?lang=en';
  }
  const target=ctx.lang==='en'?'so':'en';
  const href=next.pathname==='/'?'/'+target:next.pathname+next.search;
  const labels={so:'Af-Soomaali',en:'English'}, flags={so:'🇸🇴',en:'🇬🇧'};
  const option=lang=>'<a lang="'+lang+'" hreflang="'+lang+'" href="'+escape(lang===target?href:ctx.url.pathname+ctx.url.search)+'"'+(lang===ctx.lang?' aria-current="true"':'')+'><span aria-hidden="true">'+flags[lang]+'</span> '+labels[lang]+'</a>';
  return '<details class="z-language"><summary aria-label="'+t(ctx,'Dooro luqadda','Choose language')+'"><span aria-hidden="true">'+flags[ctx.lang]+'</span> '+labels[ctx.lang]+' ▾</summary><div>'+option('so')+option('en')+'</div></details>';

}
const photoCredits=[
  ['Capitol_at_Dusk_2.jpg','Martin Falbisoner','by-sa/3.0'],
  ['Bitcoins.jpg','Jorge Franganillo','by/2.0'],
  ['Holding_Bitcoin_cryptocurrency_coin.jpg','Satheesh Sankaran','by/2.0'],
  ['Bitcoin_Cryptocurrency_Security.jpg','Edwin.images','by-sa/4.0'],
  ['New_York_Stock_Exchange,_Wall_Street_1.jpg','Mike Peel','by-sa/4.0']
];
function credits(ctx){
  return publisherPage(ctx,t(ctx,'Ilaha sawirrada','Photo credits'),'<p>'+t(ctx,'Sawirrada tifaftirka waxaa laga soo qaatay Wikimedia Commons. Waxaa loo yareeyay webka.','Editorial photographs are sourced from Wikimedia Commons and resized for the web.')+'</p><ul>'+[...photoCredits,...screeningPhotos].map(([file,name,license])=>'<li>'+publicLink('https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file),name)+' · '+publicLink('https://creativecommons.org/licenses/'+license+'/', 'Creative Commons '+license)+'</li>').join('')+'</ul>');
}
const englishPolicies={
  '/terms':['Terms of use','<h2>Using Zaki News</h2><p>Zaki News provides reporting and educational material. Use this website lawfully and respect copyrights and trademarks.</p><h2>Corrections and external links</h2><p>We may update or correct stories as new facts emerge. External sites have their own terms. <a href="/contact?lang=en">Contact us</a> with questions or corrections.</p>'],
  '/disclaimer':['Disclaimer','<h2>Information and education</h2><p>Our coverage is for information and education. It does not constitute investment, financial, tax, or legal advice. Cryptocurrency prices can change rapidly and you may lose some or all of your investment. Past performance does not guarantee future results.</p><p>Asset logos are used to identify their respective assets.</p>'],
  '/privacy':['Privacy','<h2>Newsletter and contact</h2><p>We store your email and signup date when you subscribe. If you contact us through the form, we store your name, email, and message so we can reply. <a href="/contact?lang=en">Contact us</a> to request access, correction, or deletion of your information or to leave the newsletter list.</p><h2>Site features</h2><p>Search terms are included in search URLs. Your theme preference is stored on this device. Newsroom sign-in is handled by ChatGPT. External services have their own privacy policies.</p>']
};

function footerLangHref(ctx, lang){
  const next=new URL(ctx.url);
  if(lang==='en') next.searchParams.set('lang','en'); else next.searchParams.delete('lang');
  if(lang!==ctx.lang){
    if(ctx.article?.translationSlug){next.pathname='/article/'+ctx.article.translationSlug;}
    else if(ctx.article?.sample){
      next.pathname=storyUrl({slug:lang==='en'?(ctx.article.slug.replace(/-en$/,'')+'-en'):ctx.article.slug.replace(/-en$/,'')});
    }else if(ctx.article){
      next.pathname='/';
      next.search=lang==='en'?'?lang=en':'';
    }
  }
  if(next.pathname==='/') return '/'+lang;
  return next.pathname+next.search;
}
function footerLangPills(ctx){
  const label=t(ctx,'Dooro luqadda','Choose language');
  const item=lang=>'<a lang="'+lang+'" hreflang="'+lang+'" href="'+escape(footerLangHref(ctx,lang))+'"'+(lang===ctx.lang?' aria-current="true"':'')+'>'+lang.toUpperCase()+'</a>';
  return '<nav class="footer-langs" aria-label="'+label+'">'+item('so')+item('en')+'</nav>';
}
function footerSocials(profile){
  const order=['youtube','x','instagram','facebook','tiktok','telegram','substack','discord'];
  return '<nav class="footer-socials" aria-label="Social">'+order.filter(key=>profile[key]).map(key=>{
    const label=socialLabels[key]||key;
    const icon=socialAssets[key]?'<img src="/social-logo/'+key+'.svg" width="20" height="20" alt="">':'';
    return '<a href="'+escape(profile[key])+'" rel="noopener noreferrer" target="_blank" aria-label="'+escape(label)+'">'+icon+'</a>';
  }).join('')+'</nav>';
}
function footerNewsletter(ctx){
  if(!enabled(ctx,'newsletter')) return '';
  return '<form class="footer-signup" method="post" action="/newsletter">'+
    '<input type="hidden" name="lang" value="'+ctx.lang+'">'+
    '<p class="footer-signup-title">'+t(ctx,'Warsidaha','Newsletter')+'</p>'+
    '<label class="footer-signup-email"><span>'+t(ctx,'Iimaylkaaga','Your email')+'</span>'+
    '<input name="email" type="email" maxlength="254" autocomplete="email" required placeholder="'+t(ctx,'magaca@email.com','you@email.com')+'"></label>'+
    '<label class="consent"><input type="checkbox" name="consent" value="yes" required> '+t(ctx,'Waxaan rabaa inaan helo warsidaha.','I want to receive the newsletter.')+'</label>'+
    '<button type="submit">'+t(ctx,'Isdiiwaangeli','Subscribe')+'</button></form>';
}
function footerCol(ctx, id, heading, links){
  const items=links.map(([href,label,external])=>{
    const extra=external?' rel="noopener noreferrer" target="_blank"':'';
    return '<a href="'+escape(href)+'"'+extra+'>'+label+(external?' <span aria-hidden="true">↗</span>':'')+'</a>';
  }).join('');
  return '<details class="footer-col" open>'+
    '<summary>'+heading+'<span class="footer-caret" aria-hidden="true"></span></summary>'+
    '<nav aria-label="'+heading+'">'+items+'</nav></details>';
}
function siteFooter(ctx){
  const news=[
    ['/latest',t(ctx,'Wararkii u dambeeyay','Latest')],
    [catUrl('Crypto'),'Crypto'],
    [catUrl('Stocks'),categoryName(ctx,'Stocks')],
    [catUrl('Forex'),categoryName(ctx,'Forex')],
    [catUrl('Economy'),categoryName(ctx,'Economy')],
    [catUrl('Central Banks'),categoryName(ctx,'Central Banks')],
    [catUrl('Tech'),categoryName(ctx,'Tech')],
    [catUrl('Regulation'),categoryName(ctx,'Regulation')],
    ['/sharia',t(ctx,...shariaTitles)]
  ].map(([path,label])=>[editionHref(ctx,path),label]);
  const toolDefs=[
    ['/charts',['Jaantusyada','Charts']],
    ['/etf-flows',['Qulqulka ETF-yada crypto','Crypto ETF flows']],
    ['/smart-money',['Smart Money','Smart Money']],
    ['/liquidations',['Likwideeynta','Liquidations']],
    ['/unlocks',['Furitaanka tokennada','Token unlocks']],
    ['/fear-greed',['Cabsi iyo Damac','Fear &amp; Greed']],
    ['/profit-calculator',['Xisaabiyaha faa’iidada','Profit calculator']],
    ['https://zakibubble.zakariyaacademy.com',['Goobooyinka crypto','Crypto bubbles'],true],
    ['/halving',['Bitcoin halving','Bitcoin halving']],
    ['/calendar',['Jadwalka dhaqaalaha','Economic calendar']]
  ].filter(([path, , ext])=>{
    if(ext) return true;
    const key=path.slice(1);
    return !Object.hasOwn(toolsNav,key) || enabled(ctx,key);
  });
  const tools=toolDefs.map(([path,labels,ext])=>[ext?path:editionHref(ctx,path),t(ctx,...labels),!!ext]);
  const learn=[
    [editionHref(ctx,'/topic/education'),t(ctx,'Hagayaasha','Guides')],
    [editionHref(ctx,'/videos'),t(ctx,'Muuqaallada','Videos')],
    [ctx.profile.website||academy,t(ctx,'Koorsada Zakariya Academy','Zakariya Academy courses'),true]
  ];
  const about=[
    [editionHref(ctx,'/about'),t(ctx,'Nagu saabsan','About')],
    [editionHref(ctx,'/contact'),t(ctx,'Xiriir','Contact')],
    [editionHref(ctx,'/disclaimer'),t(ctx,'Afeef','Disclaimer')],
    [editionHref(ctx,'/privacy'),t(ctx,'Asturnaanta','Privacy')],
    [editionHref(ctx,'/terms'),t(ctx,'Shuruudaha','Terms')],
    [editionHref(ctx,'/photo-credits'),t(ctx,'Ilaha sawirrada','Photo credits')]
  ];
  const year=new Date().getUTCFullYear();
  const independence=t(
    ctx,
    'Zaki News waa warar crypto iyo suuqyo oo madax-bannaan, Af-Soomaali iyo English ah. Akhri <a href="'+editionHref(ctx,'/about')+'">siyaasadda tifaftirka</a>. Tani ma aha talo maaliyadeed — samee cilmi-baaristaada (DYOR).',
    'Zaki News is independent crypto and market news in Somali and English. Read our <a href="'+editionHref(ctx,'/about')+'">editorial policy</a>. Not financial advice — DYOR.'
  );
  return '<footer class="footer site-footer">'+
    '<div class="wrap"><div class="footer-main">'+
      footerCol(ctx,'news',t(ctx,'Wararka','News'),news)+
      footerCol(ctx,'tools',t(ctx,'Qalabka','Tools'),tools)+
      footerCol(ctx,'learn',t(ctx,'Waxbarasho','Learn'),learn)+
      footerCol(ctx,'about',t(ctx,'Nagu saabsan','About'),about)+
      '<div class="footer-aside">'+
        '<a class="footer-brand" href="'+editionHref(ctx,'/')+'">'+mark+'<span>Zaki <i>News</i></span></a>'+
        footerSocials(ctx.profile)+
        footerNewsletter(ctx)+
      '</div></div></div>'+
    '<div class="wrap footer-note"><p>'+independence+'</p></div>'+
    '<div class="wrap footer-base">'+
      '<p>© '+year+' Zaki News · by <a href="'+escape(ctx.profile.website||academy)+'" rel="noopener noreferrer" target="_blank">Zakariya Academy</a></p>'+
      footerLangPills(ctx)+
    '</div>'+
    '<script>(function(){const q=matchMedia("(max-width:640px)");const sync=()=>document.querySelectorAll("footer.site-footer details.footer-col").forEach(d=>d.open=!q.matches);sync();q.addEventListener("change",sync);})();</script>'+
  '</footer>';
}


const edToolMeta={
  '/charts':[['Jaantusyada','Charts'],['Jaantusyo qiime oo interaktif ah','Interactive price charts'],'<polyline points="3 17 9 11 13 15 21 7"/><polyline points="16 7 21 7 21 12"/>'],
  '/etf-flows':[['Qulqulka ETF-yada crypto','Crypto ETF flows'],['Qulqulka lacagta ETF-yada crypto','Daily crypto ETF inflows and outflows'],'<path d="M4 17h4v3H4zM10 11h4v9h-4zM16 7h4v13h-4z"/>'],
  '/crypto-bubbles':[['Goobooyinka crypto','Crypto bubbles'],['Khariidad dhaqdhaqaaqa lacagaha','Visual map of moving coins'],'<circle cx="8" cy="14" r="4"/><circle cx="16" cy="9" r="3.2"/><circle cx="18" cy="17" r="2.2"/>'],
  '/smart-money':[['Smart Money','Smart Money'],['Dhaqdhaqaaqa lacagta Ethereum','Ethereum smart-money flows'],'<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 11h18"/>'],
  '/profit-calculator':[['Xisaabiyaha faa’iidada','Profit calculator'],['Xisaabi faa’iidada iibka','Work out a trade’s return'],'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>'],
  '/unlocks':[['Furitaanka tokennada','Token unlocks'],['Furitaanka tokennada soo socda','Upcoming token unlocks'],'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'],
  '/liquidations':[['Likwideeynta','Liquidations'],['Khariidadda likwideynta','Exchange liquidation map'],'<path d="M12 3v10"/><path d="M8 9l4 4 4-4"/><path d="M5 21h14"/>'],
  '/fear-greed':[['Cabsi iyo Damac','Fear &amp; Greed'],['Tusaha cabsi iyo damac','Market sentiment index'],'<circle cx="12" cy="12" r="8"/><path d="M8 14c1.2 1.6 2.6 2.3 4 2.3s2.8-.7 4-2.3"/>'],
  '/calendar':[['Jadwalka dhaqaalaha','Economic calendar'],['Jadwalka warbixinnada dhaqaalaha','Economic release calendar'],'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'],
  '/halving':[['Bitcoin halving','Bitcoin halving'],['Jadwalka soo saarista Bitcoin','Bitcoin issuance schedule'],'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'],
  '/highlights':[['Muuqaalka suuqa','Crypto highlights'],['Lammaanaha ugu dhaqsaha badan','Fast-moving crypto pairs'],'<polygon points="12 3 14.5 9 21 9.5 16 14 17.5 21 12 17.5 6.5 21 8 14 3 9.5 9.5 9"/>'],
  '/commodities':[['Badeecadaha','Commodities'],['Sabuuradda badeecadaha','Commodity price board'],'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/>']
};
const edFeaturedTools=['/charts','/etf-flows','/crypto-bubbles','/smart-money','/profit-calculator','/unlocks','/liquidations','/fear-greed','/calendar','/halving','/highlights','/commodities'];
function edIcon(d){
  return '<span class="ed-tool-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg></span>';
}
function edActive(ctx, path){
  const here=ctx.url.pathname.replace(/\/$/,'')||'/';
  return path==='/'?here==='/':here===path;
}
function edA(ctx, path, label){
  const on=edActive(ctx,path);
  return '<a href="'+editionHref(ctx,path)+'"'+(on?' class="is-active" aria-current="page"':'')+'>'+label+'</a>';
}
function edLangPills(ctx){
  const label=t(ctx,'Dooro luqadda','Choose language');
  const item=lang=>'<a lang="'+lang+'" hreflang="'+lang+'" href="'+escape(footerLangHref(ctx,lang))+'"'+(lang===ctx.lang?' aria-current="true"':'')+'>'+lang.toUpperCase()+'</a>';
  return '<nav class="ed-langs" aria-label="'+label+'">'+item('so')+item('en')+'</nav>';
}
function edSpark(values){
  const nums=(values||[]).filter(Number.isFinite);
  if(nums.length<2) return '<div class="ed-spark-empty"></div>';
  const w=320,h=140,p=8;
  const min=Math.min(...nums),max=Math.max(...nums);
  const xs=nums.map((_,i)=>p+i*(w-2*p)/Math.max(nums.length-1,1));
  const ys=nums.map(v=>p+(h-2*p)*(1-(v-min)/(max-min||1)));
  const line=xs.map((x,i)=>x.toFixed(1)+','+ys[i].toFixed(1)).join(' ');
  const last=nums.length-1;
  const d='M '+xs[0].toFixed(1)+' '+ys[0].toFixed(1)+' L '+xs.slice(1).map((x,i)=>x.toFixed(1)+' '+ys[i+1].toFixed(1)).join(' ')+' L '+xs[last].toFixed(1)+' '+(h-p)+' L '+xs[0].toFixed(1)+' '+(h-p)+' Z';
  return '<svg class="ed-spark" viewBox="0 0 '+w+' '+h+'" data-points="'+escape(JSON.stringify(nums))+'" preserveAspectRatio="none" role="img">'+
    '<path class="ed-spark-fill" d="'+d+'"></path>'+
    '<polyline class="ed-spark-line" points="'+line+'" fill="none"></polyline>'+
    '<circle class="ed-spark-dot" cx="'+xs[last].toFixed(1)+'" cy="'+ys[last].toFixed(1)+'" r="3.5"></circle>'+
    '<circle class="ed-spark-hover" cx="'+xs[last].toFixed(1)+'" cy="'+ys[last].toFixed(1)+'" r="4.5" style="opacity:0"></circle>'+
  '</svg><div class="ed-tip" hidden></div>';
}
function edMoney(n){
  if(!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:n<1?4:2}).format(n);
}
function todayMarket(ctx, snapshot){
  const pane=(key,label,icon)=>{
    const row=snapshot?.[key];
    const change=Number.isFinite(row?.change)?row.change:null;
    const dir=change==null?'':(change>=0?'up':'down');
    const pct=change==null?'—':((change>=0?'+':'')+change.toFixed(2)+'%');
    return '<a class="ed-market-pane" href="'+editionHref(ctx,'/chart/crypto/'+key.toUpperCase())+'" data-panel="'+key+'"'+(key==='eth'?' hidden':'')+'>'+
      '<div class="ed-market-quote">'+
        '<span class="ed-coin">'+icon+'<strong>'+label+'</strong></span>'+
        '<span class="ed-last">'+edMoney(row?.price)+'</span>'+
        '<span class="ed-chg" data-direction="'+dir+'">'+pct+'</span>'+
      '</div>'+
      '<div class="ed-spark-wrap">'+edSpark(row?.spark)+'</div>'+
    '</a>';
  };
  return '<aside class="ed-market" data-ed-market>'+
    '<div class="ed-market-head">'+
      '<h2>'+t(ctx,'Suuqa maanta','Today’s market')+'</h2>'+
      '<div class="ed-coin-toggle" role="tablist" aria-label="BTC ETH">'+
        '<button type="button" data-coin="btc" aria-selected="true">BTC</button>'+
        '<button type="button" data-coin="eth" aria-selected="false">ETH</button>'+
      '</div>'+
    '</div>'+
    pane('btc','Bitcoin',coinIcon('btc'))+
    pane('eth','Ethereum',coinIcon('eth'))+
  '</aside>';
}
function editorialHeader(ctx){
  const primary=[
    ['/',t(ctx,'Bogga hore','Home')],
    ['/latest',t(ctx,'Wararkii u dambeeyay','Latest')],
    [catUrl('Crypto'),'Crypto'],
    ['/markets',t(ctx,'Suuqyada','Markets')],
    [catUrl('Forex'),'Forex'],
    ['/etfs',t(ctx,'ETF-yada','ETFs')],
    [catUrl('Economy'),t(ctx,'Dhaqaalaha','Economy')],
    [catUrl('Stocks'),categoryName(ctx,'Stocks')],
    [catUrl('Central Banks'),categoryName(ctx,'Central Banks')],
    [catUrl('Tech'),categoryName(ctx,'Tech')],
    [catUrl('Politics'),categoryName(ctx,'Politics')],
    ['/sharia',t(ctx,...shariaTitles)]
  ];
  const topics=[
    ['/resources',t(ctx,'Xiriiriyeyaasha','Resources')],
    ['/about',t(ctx,'Nagu saabsan','About')]
  ];
  const bubbleUrl='https://zakibubble.zakariyaacademy.com';
  const tools=edFeaturedTools.map(path=>{
    const [title,blurb,d]=edToolMeta[path];
    const href=path==='/crypto-bubbles'?bubbleUrl:editionHref(ctx,path);
    const ext=path==='/crypto-bubbles'?' rel="noopener noreferrer" target="_blank"':'';
    return '<a class="ed-tool" href="'+escape(href)+'"'+ext+'>'+edIcon(d)+'<span><strong>'+t(ctx,...title)+'</strong><small>'+t(ctx,...blurb)+'</small></span></a>';
  }).join('');
  const follow=[
    (ctx.profile.website||academy)?'<a href="'+escape(ctx.profile.website||academy)+'" rel="noopener noreferrer" target="_blank">Zakariya Academy ↗</a>':'',
    ctx.profile.youtube?'<a href="'+escape(ctx.profile.youtube)+'" rel="noopener noreferrer" target="_blank">YouTube ↗</a>':'',
    ctx.profile.discord?'<a href="'+escape(ctx.profile.discord)+'" rel="noopener noreferrer" target="_blank">Discord ↗</a>':''
  ].filter(Boolean).join('');
  const kicker=t(ctx,'Warbaahinta maaliyadeedka Soomaaliyeed','Somali financial journalism');
  const searchIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const chevron='<svg class="ed-chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
  const searchFields=
    (ctx.lang==='en'?'<input type="hidden" name="lang" value="en">':'')+
    '<label class="ed-search-field"><span class="visually-hidden">'+t(ctx,'Raadi maqaallo','Search articles')+'</span>'+
    '<input type="text" name="q" maxlength="100" enterkeyhint="search" autocomplete="off" spellcheck="false" placeholder="'+t(ctx,'Raadi maqaallo, tusaale Bitcoin ama btc','Search articles, for example Bitcoin or btc')+'" aria-label="'+t(ctx,'Raadi maqaallo','Search articles')+'"></label>'+
    '<button type="submit" class="ed-search-submit">'+t(ctx,'Raadi','Search')+'</button>';
  const searchForm='<div class="ed-search-panel" id="ed-search">'+
    '<form class="ed-search wrap" role="search" method="get" action="'+editionHref(ctx,'/search')+'">'+searchFields+'</form></div>';
  const sheetSearch='<form class="ed-sheet-search" role="search" method="get" action="'+editionHref(ctx,'/search')+'">'+searchFields+'</form>';
  const mega='<div class="ed-mega" id="ed-mega" hidden>'+
    '<div class="ed-mega-topics"><h2>'+t(ctx,'Mawduucyada','Topics')+'</h2><nav data-ed-more-topics>'+topics.map(([p,l])=>edA(ctx,p,l)).join('')+'</nav></div>'+
    '<div class="ed-mega-tools"><h2>'+t(ctx,'Qalabka','Tools')+'</h2><div class="ed-tool-grid">'+tools+'</div></div>'+
    (follow?'<div class="ed-mega-follow">'+follow+'</div>':'')+
  '</div>';
  const sheet='<div class="ed-sheet" id="ed-sheet" hidden role="dialog" aria-modal="true" aria-label="'+t(ctx,'Liiska','Menu')+'">'+
    '<div class="ed-sheet-head"><strong>Zaki <i>News</i></strong><div class="ed-sheet-actions">'+edLangPills(ctx)+
    '<button type="button" class="ed-icon-btn" data-theme-toggle aria-label="'+t(ctx,'Beddel muuqaalka','Toggle theme')+'">◐</button>'+
    '<button type="button" class="ed-icon-btn" data-ed="close-sheet" aria-label="'+t(ctx,'Xir','Close')+'">'+
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div></div>'+
    sheetSearch+
    '<nav class="ed-sheet-nav">'+primary.map(([p,l])=>edA(ctx,p,l)).join('')+'</nav>'+
    '<div class="ed-sheet-block"><h2>'+t(ctx,'Mawduucyada','Topics')+'</h2><nav>'+topics.map(([p,l])=>edA(ctx,p,l)).join('')+'</nav></div>'+
    '<div class="ed-sheet-block"><h2>'+t(ctx,'Qalabka','Tools')+'</h2><div class="ed-tool-grid">'+tools+'</div></div>'+
    (follow?'<div class="ed-mega-follow">'+follow+'</div>':'')+
  '</div>';
  return '<header class="standard-header ed-header" data-ed-header>'+
    '<div class="wrap ed-top">'+
      '<a class="ed-logo" href="'+editionHref(ctx,'/')+'">'+mark+'<span>Zaki News</span></a>'+
      '<span class="ed-rule" aria-hidden="true"></span>'+
      '<span class="ed-kicker">'+kicker+'</span>'+
      '<div class="ed-actions">'+
        '<button type="button" class="ed-icon-btn ed-wide" data-ed="search" aria-expanded="false" aria-label="'+t(ctx,'Raadi','Search')+'">'+searchIcon+'</button>'+
        '<button type="button" class="ed-icon-btn ed-desk" data-theme-toggle aria-label="'+t(ctx,'Beddel muuqaalka','Toggle theme')+'">◐</button>'+
        edLangPills(ctx)+
        '<button type="button" class="ed-icon-btn ed-menu" data-ed="menu" aria-expanded="false" aria-controls="ed-sheet" aria-label="'+t(ctx,'Fur liiska','Open menu')+'">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'+
        '</button>'+
      '</div>'+
    '</div>'+searchForm+
    '<nav class="wrap ed-nav" data-ed-nav aria-label="'+t(ctx,'Qaybaha','Sections')+'">'+
      primary.map(([p,l],i)=>edA(ctx,p,l).replace('<a ','<a data-nav-item="'+i+'" ')).join('')+
      '<button type="button" class="ed-more" data-ed="more" aria-expanded="false" aria-controls="ed-mega">'+t(ctx,'Dheeraad','More')+' '+chevron+'</button>'+
    '</nav>'+mega+
  '</header>'+editorialTicker(ctx)+sheet;
}
function editorialHome(ctx, list, snapshot){
  const lead=list[0];
  if(!lead) return '<p>'+t(ctx,'Wax maqaal ah lama helin.','No articles found.')+'</p>';
  const rest=list.slice(1,7);
  const clock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>';
  const markIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v16l-5-3-5 3z"/></svg>';
  const minutes=t(ctx, wordCount(lead)+' daqiiqo', wordCount(lead)==1?'1 minute':wordCount(lead)+' minutes');
  const cat=lead.sample?t(ctx,'Falanqayn','Analysis'):categoryName(ctx,lead.category);
  const items=rest.map(a=>{
    const when=a.sample?'':date(a.published_at,ctx.lang);
    const mins=t(ctx, wordCount(a)+' daqiiqo', wordCount(a)==1?'1 min':wordCount(a)+' min');
    const thumb=a.image
      ? '<img class="ed-item-thumb" src="'+escape(a.image)+'" alt="'+escape(a.image_alt||'')+'" width="96" height="72" loading="lazy">'
      : '<span class="ed-item-thumb ed-item-thumb-empty" aria-hidden="true"></span>';
    return '<li><a href="'+storyUrl(a)+'">'+thumb+'<span class="ed-item-copy"><h3>'+escape(a.title)+'</h3><span class="ed-item-meta">'+clock+' '+mins+(when?' <i>·</i> '+when:'')+'</span></span></a></li>';
  }).join('');
  return '<div class="ed-home">'+
    '<section class="ed-hero">'+
      '<div class="ed-hero-copy">'+
        '<a class="ed-cat" href="'+editionHref(ctx,catUrl(canonicalCategory(lead.category)))+'"><i></i> '+escape(cat)+'</a>'+
        '<h1><a href="'+storyUrl(lead)+'">'+escape(lead.title)+'</a></h1>'+
        '<p class="ed-dek">'+escape(lead.summary)+'</p>'+
        '<div class="ed-byline">'+clock+'<span>'+minutes+'</span><span class="ed-byline-rule"></span>'+markIcon+
      '</div></div>'+
      '<a class="ed-hero-media" href="'+storyUrl(lead)+'">'+storyImage(lead,'fetchpriority="high"')+'</a>'+
    '</section>'+
    '<section class="ed-split">'+
      '<div class="ed-latest">'+
        '<div class="ed-section-head"><h2>'+t(ctx,'Wararkii u dambeeyay','Latest')+'</h2><a href="'+editionHref(ctx,'/latest')+'">'+t(ctx,'Dhammaan','See all')+'</a></div>'+
        '<ul class="ed-story-list">'+items+'</ul>'+
      '</div>'+
      todayMarket(ctx, snapshot)+
    '</section>'+
  '</div>';
}

function coinSearchAliasMap(){
  const map={
    btc:['bitcoin','btc','xbt'],eth:['ethereum','eth','ether'],sol:['solana','sol'],
    xrp:['xrp','ripple'],bnb:['bnb','binance coin','binance'],ada:['cardano','ada'],
    doge:['dogecoin','doge','xdg'],usdt:['tether','usdt'],link:['chainlink','link'],
    avax:['avalanche','avax'],sui:['sui'],trx:['tron','trx'],near:['near'],
    ltc:['litecoin','ltc'],atom:['cosmos','atom'],dot:['polkadot','dot']
  };
  const list=typeof tickerCoins!=='undefined'?tickerCoins:(typeof coins!=='undefined'?coins:[]);
  for(const [sym,name] of list){
    const key=String(sym).toLowerCase();
    map[key]=[...new Set([...(map[key]||[]),key,String(name||'').toLowerCase()].filter(Boolean))];
  }
  return map;
}
function searchTokens(q){
  const raw=String(q||'').trim().toLowerCase();
  if(!raw) return [];
  const parts=raw.split(/[\s,+/|]+/).filter(Boolean);
  const tokens=new Set(parts);
  tokens.add(raw);
  const aliases=coinSearchAliasMap();
  for(const names of Object.values(aliases)){
    if(names.some(n=>n && (raw===n || parts.includes(n) || (n.length>2 && raw.includes(n))))){
      names.forEach(n=>tokens.add(n));
    }
  }
  return [...tokens];
}
function storySearchHaystack(a){
  const labels=[
    a.category,
    categoryLabels[a.category],
    categoryName({lang:'so'},a.category),
    categoryName({lang:'en'},a.category)
  ];
  const parts=[a.title,a.summary,a.seo_title,a.seo_description,a.body,a.slug,a.author,a.tags,...labels];
  if(Array.isArray(a.tags)) parts.push(a.tags.join(' '));
  let hay=parts.filter(Boolean).join(' ').toLowerCase();
  for(const names of Object.values(coinSearchAliasMap())){
    if(names.some(n=>n && hay.includes(n))) hay+=' '+names.join(' ');
  }
  return hay;
}
function searchStories(stories,q){
  const tokens=searchTokens(q).filter(tok=>tok.length>=2);
  if(!tokens.length) return [];
  return (stories||[]).filter(a=>tokens.some(tok=>storySearchHaystack(a).includes(tok)));
}
function rankedSearchStories(ctx,stories,q){
  const lang=ctx.lang||'so';
  return searchStories(stories,q).sort((a,b)=>{
    const al=(a.language||'so')===lang?0:1;
    const bl=(b.language||'so')===lang?0:1;
    if(al!==bl) return al-bl;
    return String(b.published_at||'').localeCompare(String(a.published_at||''));
  });
}
function searchResultItem(ctx,a){
  const href=editionHref(ctx,storyUrl(a));
  const thumb=a.image
    ? '<img class="ed-search-thumb" src="'+escape(a.image)+'" alt="" width="160" height="100" loading="lazy">'
    : '<span class="ed-search-thumb is-empty" aria-hidden="true"></span>';
  const langNote=(a.language||'so')!==ctx.lang?'<span class="ed-search-lang">'+(a.language||'so').toUpperCase()+'</span>':'';
  const when=a.sample||!a.published_at?'':date(a.published_at,ctx.lang);
  return '<li class="ed-search-item"><a href="'+href+'">'+thumb+
    '<span class="ed-search-copy"><span class="ed-search-meta"><span class="ed-cat">'+escape(categoryName(ctx,a.category))+'</span>'+
    (when?'<time>'+escape(when)+'</time>':'')+langNote+'</span>'+
    '<h2>'+escape(a.title)+'</h2>'+
    (a.summary?'<p>'+escape(a.summary)+'</p>':'')+
    '</span></a></li>';
}
function searchPage(ctx,stories,q){
  const query=String(q||'').trim().slice(0,100);
  const results=query?rankedSearchStories(ctx,stories,query):[];
  const title=query?t(ctx,'Natiijooyinka “'+query+'”','Results for “'+query+'”'):t(ctx,'Raadi maqaallo','Search articles');
  const form='<form class="ed-search-page-form" role="search" method="get" action="/search">'+
    (ctx.lang==='en'?'<input type="hidden" name="lang" value="en">':'')+
    '<label class="ed-search-field"><span class="visually-hidden">'+t(ctx,'Raadi maqaallo','Search articles')+'</span>'+
    '<input type="text" name="q" maxlength="100" enterkeyhint="search" autocomplete="off" spellcheck="false" value="'+escape(query)+'" placeholder="'+t(ctx,'Raadi maqaallo, tusaale Bitcoin ama btc','Search articles, for example Bitcoin or btc')+'"></label>'+
    '<button type="submit" class="ed-search-submit">'+t(ctx,'Raadi','Search')+'</button></form>';
  let body;
  if(!query){
    body='<div class="ed-empty-state"><p>'+t(ctx,'Qor magaca coin, cinwaan, ama mawduuc si aad u raadiso maqaallada Zaki News.','Type a coin name, headline, or topic to search Zaki News articles.')+'</p></div>';
  }else if(!results.length){
    body='<div class="ed-empty-state">'+
      '<p class="ed-empty-kicker">'+t(ctx,'Waxba lama helin','No matches')+'</p>'+
      '<h2>'+t(ctx,'Ma jiraan maqaallo ku habboon “'+query+'”.','No articles match “'+query+'”.')+'</h2>'+
      '<p>'+t(ctx,'Isku day magac kale, calaamad coin ah sida btc, ama ka fiiri qaybaha Crypto iyo Suuqyada.','Try another name, a coin symbol such as btc, or browse Crypto and Markets.')+'</p>'+
      '<p class="ed-empty-links"><a href="'+editionHref(ctx,'/latest')+'">'+t(ctx,'Wararkii u dambeeyay','Latest')+'</a>'+
      '<a href="'+editionHref(ctx,catUrl('Crypto'))+'">Crypto</a>'+
      '<a href="'+editionHref(ctx,'/markets')+'">'+t(ctx,'Suuqyada','Markets')+'</a></p></div>';
  }else{
    body='<p class="ed-search-count">'+t(ctx,results.length+' natiijo',results.length===1?'1 result':results.length+' results')+'</p>'+
      '<ul class="ed-search-list">'+results.map(a=>searchResultItem(ctx,a)).join('')+'</ul>';
  }
  const page='<article class="ed-search-page wrap">'+
    '<header class="ed-search-hero"><p class="about-kicker">'+t(ctx,'Raadinta','Search')+'</p>'+
    '<h1>'+escape(title)+'</h1>'+form+'</header>'+body+'</article>';
  return layout(ctx,title,page,{description:t(ctx,'Raadi maqaallada Zaki News.','Search Zaki News articles.'),noindex:true});
}
function relatedTopicArticles(ctx,stories,category){
  if(category!=='Forex') return '';
  const related=(stories||[]).filter(a=>['Economy','Central Banks'].includes(canonicalCategory(a.category)));
  if(!related.length){
    return '<div class="ed-empty-state">'+
      '<p class="ed-empty-kicker">Forex</p>'+
      '<h2>'+t(ctx,'Weli ma jiraan maqaallo Forex ah.','No Forex articles yet.')+'</h2>'+
      '<p>'+t(ctx,'Isticmaal shaxda qiimayaasha tixraaca ee kor ku xusan, ama akhri qaybaha Dhaqaalaha iyo Bangiyada Dhexe.','Use the daily reference rates table above, or read Economy and Central Banks.')+'</p>'+
      '<p class="ed-empty-links"><a href="'+editionHref(ctx,catUrl('Economy'))+'">'+categoryName(ctx,'Economy')+'</a>'+
      '<a href="'+editionHref(ctx,catUrl('Central Banks'))+'">'+categoryName(ctx,'Central Banks')+'</a></p></div>';
  }
  return '<section class="ed-empty-related">'+
    '<div class="ed-section-head"><h2>'+t(ctx,'Akhri sidoo kale','Related coverage')+'</h2></div>'+
    '<p class="meta">'+t(ctx,'Weli ma jiraan maqaallo Forex gaar ah. Halkan waa wararka Dhaqaalaha iyo Bangiyada Dhexe ee la xiriira.','No Forex stories yet. Here is related Economy and Central Banks coverage.')+'</p>'+
    grid(related,ctx)+'</section>';
}

function forexPairList(){
  return [['EUR','USD'],['GBP','USD'],['USD','JPY'],['USD','CHF'],['USD','CAD'],['AUD','USD'],['NZD','USD'],['EUR','GBP']];
}
function forexPairLabel(slug){
  const key=String(slug||'').toUpperCase().replace(/[^A-Z]/g,'');
  const found=forexPairList().find(([a,b])=>a+b===key);
  return found?found[0]+'/'+found[1]:'';
}
function cryptoChartSymbol(slug){
  const raw=String(slug||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const base=raw.replace(/USDT$/,'').replace(/USD$/,'')||raw;
  const list=typeof tickerCoins!=='undefined'?tickerCoins:(typeof marketCoins!=='undefined'?marketCoins:coins||[]);
  const known=new Map(list.map(([s,n])=>[String(s).toUpperCase(),n]));
  if(base==='USDT') return {ok:true,tv:'BINANCE:USDTUSDC',base:'USDT',name:known.get('USDT')||'Tether'};
  if(known.has(base)) return {ok:true,tv:'BINANCE:'+base+'USDT',base,name:known.get(base)};
  return {ok:false};
}
function chartArrowIcon(){
  return '<svg class="ed-chart-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4-5 3 2.5 5-7"/><path d="M14 6h5v5"/></svg>';
}
function instrumentChartPage(ctx,market,slug){
  const key=String(slug||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  let tv='',display='',back='/',backLabel='',kicker='',desc='';
  if(market==='forex'){
    const pair=forexPairLabel(key);
    if(!pair) return layout(ctx,t(ctx,'Bogga lama helin','Page not found'),'<h1>'+t(ctx,'Bogga lama helin','Page not found')+'</h1><p><a class="text-link" href="'+editionHref(ctx,catUrl('Forex'))+'">'+t(ctx,'Ku laabo Forex','Back to Forex')+'</a></p>',{status:404,noindex:true});
    tv='FX:'+key;
    display=pair;
    back=catUrl('Forex');
    backLabel=t(ctx,'Ku laabo Forex','Back to Forex');
    kicker=t(ctx,'Jaantuska Forex','Forex chart');
    desc=t(ctx,'Jaantuska qiimaha '+pair+' ee TradingView.','TradingView price chart for '+pair+'.');
  }else if(market==='crypto'){
    const info=cryptoChartSymbol(key);
    if(!info.ok) return layout(ctx,t(ctx,'Bogga lama helin','Page not found'),'<h1>'+t(ctx,'Bogga lama helin','Page not found')+'</h1><p><a class="text-link" href="'+editionHref(ctx,'/markets')+'">'+t(ctx,'Ku laabo Suuqyada','Back to Markets')+'</a></p>',{status:404,noindex:true});
    tv=info.tv;
    display=info.name+' ('+info.base+')';
    back='/markets';
    backLabel=t(ctx,'Ku laabo Suuqyada','Back to Markets');
    kicker=t(ctx,'Jaantuska crypto','Crypto chart');
    desc=t(ctx,'Jaantuska qiimaha '+info.name+' ee TradingView.','TradingView price chart for '+info.name+'.');
  }else{
    return layout(ctx,t(ctx,'Bogga lama helin','Page not found'),'<h1>'+t(ctx,'Bogga lama helin','Page not found')+'</h1>',{status:404,noindex:true});
  }
  const tvUrl='https://www.tradingview.com/chart/?symbol='+encodeURIComponent(tv);
  const widget='<section class="ed-tv-stage" aria-label="'+escape(display)+'">'+
    '<div class="tradingview-widget-container" id="ed-tv-widget">'+
    '<div class="tradingview-widget-container__widget"></div>'+
    '<div class="tradingview-widget-copyright">'+(typeof publicLink==='function'?publicLink(tvUrl,'TradingView'):'<a href="'+escape(tvUrl)+'" rel="noopener noreferrer" target="_blank">TradingView</a>')+'</div></div></section>'+
    '<script>(function(){var dark=document.documentElement.getAttribute("data-theme")==="dark";var box=document.getElementById("ed-tv-widget");if(!box)return;var config={autosize:true,symbol:'+JSON.stringify(tv)+',interval:"D",timezone:"Europe/Brussels",theme:dark?"dark":"light",style:"1",locale:"en",backgroundColor:dark?"#14110F":"#FBF5EE",gridColor:dark?"rgba(255,255,255,0.08)":"rgba(228,216,204,0.7)",hide_side_toolbar:false,allow_symbol_change:true,withdateranges:true,calendar:false,support_host:"https://www.tradingview.com"};var s=document.createElement("script");s.async=true;s.type="text/javascript";s.src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";s.text=JSON.stringify(config);box.appendChild(s);})();</script>';
  const page='<article class="ed-chart-page wrap">'+
    '<p class="ed-chart-back"><a href="'+editionHref(ctx,back)+'">'+backLabel+'</a></p>'+
    '<header class="ed-chart-hero"><p class="about-kicker">'+kicker+'</p><h1>'+escape(display)+'</h1>'+
    '<p class="dek">'+t(ctx,'Jaantuska qiimaha ee TradingView. Xogtu waa mid tixraac ah, ma aha talo maalgashi.','TradingView price chart. This is reference data, not investment advice.')+'</p></header>'+
    widget+'</article>';
  return layout(ctx,display,page,{description:desc});
}

function aboutToolCount(ctx){
  const ids=new Set([...Object.keys(toolsNav).filter(k=>enabled(ctx,k)),'etf-flows','etfs','fear-greed','sharia','commodities','ipo-calendar','earnings-calendar']);
  return ids.size;
}
function aboutPage(ctx,stories){
  const published=(stories||[]).filter(a=>!a.sample && a.published_at);
  const storyCount=published.length;
  const tools=aboutToolCount(ctx);
  const kicker=t(ctx,'Ku saabsan','About');
  const headline=t(ctx,'Warbixin maaliyadeed oo madax bannaan, Af Soomaali iyo English','Independent financial news in Somali and English');
  const dek=t(ctx,
    'Zaki News waa warbaahin maaliyadeed oo madax bannaan oo Af Soomaali ku qorta, laguna daabaco Af Soomaali iyo English. Waa qayb ka mid ah Zakariya Academy, oo ah aasaaska ugu horreeyay ee waxbarashada crypto ee Af Soomaali, oo bilaabmay horraantii 2026.',
    'Zaki News publishes independent Somali language financial news in Somali and English. It is part of Zakariya Academy, the first Af Soomaali crypto education platform, which opened in early 2026.'
  );
  const stats=[
    storyCount? [String(storyCount), t(ctx,'Maqaallo la daabacay','Published stories')]:null,
    [String(tools), t(ctx,'Qalab iyo bogag xogeed','Tools and data pages')],
    ['100K+', t(ctx,'Bulshada Zakariya Academy','Zakariya Academy community')]
  ].filter(Boolean).map(([n,l])=>'<li><strong>'+escape(n)+'</strong><span>'+escape(l)+'</span></li>').join('');
  const coverCards=[
    ['<a class="about-cover" href="'+editionHref(ctx,catUrl('Crypto'))+'"><strong>Crypto</strong><span>'+t(ctx,'Bitcoin, Ethereum, iyo suuqa crypto.','Bitcoin, Ethereum, and the crypto market.')+'</span></a>'],
    ['<a class="about-cover" href="'+editionHref(ctx,catUrl('Stocks'))+'"><strong>'+escape(categoryName(ctx,'Stocks'))+'</strong><span>'+t(ctx,'Saamiyada iyo ETF-yada suuqa guud.','Stocks and broad market ETFs.')+'</span></a>'],
    ['<a class="about-cover" href="'+editionHref(ctx,catUrl('Forex'))+'"><strong>Forex</strong><span>'+t(ctx,'Lammaanayaasha lacagaha iyo qiimayaasha tixraaca.','Currency pairs and reference rates.')+'</span></a>'],
    ['<div class="about-cover is-split"><strong>'+t(ctx,'Dhaqaalaha iyo bangiyada dhexe','Economy and central banks')+'</strong><span>'+t(ctx,'Siyaasadda lacagta, sicir bararka, iyo bangiyada dhexe.','Monetary policy, inflation, and central banks.')+'</span><span class="about-cover-extra"><a href="'+editionHref(ctx,catUrl('Economy'))+'">'+escape(categoryName(ctx,'Economy'))+'</a><a href="'+editionHref(ctx,catUrl('Central Banks'))+'">'+escape(categoryName(ctx,'Central Banks'))+'</a></span></div>'],
    ['<a class="about-cover" href="'+editionHref(ctx,catUrl('Tech'))+'"><strong>'+escape(categoryName(ctx,'Tech'))+'</strong><span>'+t(ctx,'Tignoolajiyada iyo wararka dhijitaalka ah.','Technology and digital industry news.')+'</span></a>'],
    ['<a class="about-cover" href="'+editionHref(ctx,catUrl('Politics'))+'"><strong>'+escape(categoryName(ctx,'Politics'))+'</strong><span>'+t(ctx,'Siyaasadda iyo go\'aannada saameeya suuqyada.','Politics and decisions that move markets.')+'</span></a>'],
    ['<a class="about-cover" href="'+editionHref(ctx,'/sharia')+'"><strong>'+t(ctx,...shariaTitles)+'</strong><span>'+t(ctx,'Shaashadda Xalaal, Xaaraan, iyo Mashbooh.','Halal, Haram, and Mashbooh screening.')+'</span></a>']
  ].map(x=>x[0]).join('');

  const standards=[
    [t(ctx,'Ilaha waa la xiriiriyaa','Sources are linked'),t(ctx,'Marka ilaha la heli karo, waxaan ku xirnaa warbixinta asalka ah si akhristuhu u hubin karo xaqiiqda.','When sources are available, we link to the original reporting so readers can verify the facts.')],
    [t(ctx,'Qorayaasha iyo taariikhaha','Authors and dates'),t(ctx,'Maqaalladu waxay muujiyaan qoraaga iyo taariikhda daabacaadda.','Articles identify the author and the publication date.')],
    [t(ctx,'Sixitaannada','Corrections'),t(ctx,'Haddii khalad la ogaado, nala soo xiriir si aan u saxno diiwaanka.','If an error is found, contact us so we can correct the record.')],
    [t(ctx,'Madax bannaanida','Independence'),t(ctx,'Go\'aannada tifaftirka waa kuwo madax bannaan. Ma jiro xayeysiis lacag ah oo loo soo bandhigayo sidii war.','Editorial decisions are independent. We do not present paid promotion as news.')],
    [t(ctx,'Ma aha talo maalgashi','Not financial advice'),t(ctx,'Warbixintu waa xog iyo falanqayn. Ma aha talo maalgashi. Samee baaritaankaaga (DYOR).','Coverage is information and analysis. It is not investment advice. Do your own research (DYOR).')]
  ].map(([h,p])=>'<li><strong>'+h+'</strong><p>'+p+'</p></li>').join('');

  const sharia=t(ctx,
    'Habka tifaftirka Zaki News wuxuu tokennada mashruucyada DeFi geliyaa Xaaraan, meme coins-na Mashbooh. Tusaalooyinka Xalaal waxay raacaan isha baaritaanka ee ku lifaaqan. Calaamadahani waa waxbarasho, mana caddaynayaan isticmaalka token kasta.',
    'The Zaki News editorial policy places DeFi protocol tokens under Haram and meme coins under Mashbooh. The Halal examples are classified by the linked screener. These labels are educational and do not certify every use of a token.'
  );

  const socials=footerSocials(ctx.profile||{});
  const page='<article class="about-page wrap">'+
    '<header class="about-hero"><p class="about-kicker">'+kicker+'</p>'+
    '<h1>'+headline+'</h1><p class="about-dek">'+dek+'</p>'+
    (stats?'<ul class="about-stats">'+stats+'</ul>':'')+
    '</header>'+
    '<section class="about-section"><h2>'+t(ctx,'Waxaan ka hadalnaa','What we cover')+'</h2>'+
    '<div class="about-covers">'+coverCards+'</div></section>'+
    '<section class="about-section" id="editorial-policy"><h2>'+t(ctx,'Sida aan u shaqeyno','How we work')+'</h2>'+
    '<ol class="about-standards">'+standards+'</ol></section>'+
    '<section class="about-section about-sharia"><h2>'+t(ctx,'Habka Xalaal iyo Xaaraan','Sharia approach')+'</h2>'+
    '<p>'+sharia+'</p>'+
    '<p><a class="text-link" href="'+editionHref(ctx,'/sharia')+'">'+t(ctx,'Fur hagaha Xalaal iyo Xaaraan','Open the Halal and Haram guide')+'</a></p></section>'+
    '<section class="about-section about-founder"><h2>'+t(ctx,'Ka dambeysa Zaki News','Behind Zaki News')+'</h2>'+
    '<div class="about-founder-card">'+
      '<span class="about-mono" aria-hidden="true">ZS</span>'+
      '<div><h3>Zakariya Sharif (Zaki)</h3>'+
      '<p>'+t(ctx,
        'Aasaasaha Zakariya Academy. CQVA certified, qoraa la xaqiijiyey ee CoinMarketCap, kuna nool Ghent, Belgium.',
        'Founder of Zakariya Academy. CQVA certified, a verified CoinMarketCap author, based in Ghent, Belgium.'
      )+'</p></div>'+
    '</div></section>'+
    '<section class="about-section about-follow"><h2>'+t(ctx,'Na raac, nala soo xiriir','Follow and contact')+'</h2>'+
    socials+
    '<p class="about-follow-links">'+
      '<a href="'+editionHref(ctx,'/contact')+'">'+t(ctx,'Xiriir','Contact')+'</a>'+
      '<a href="'+editionHref(ctx,'/about')+'#editorial-policy">'+t(ctx,'Siyaasadda tifaftirka','Editorial policy')+'</a>'+
      '<a href="'+editionHref(ctx,'/contact')+'">'+t(ctx,'Sixitaannada iyo tilmaamaha','Corrections and tips')+'</a>'+
    '</p></section>'+
  '</article>';
  return layout(ctx,t(ctx,'Ku saabsan Zaki News','About Zaki News'),page,{
    description:t(ctx,'Zaki News waa warbaahin maaliyadeed oo madax bannaan, Af Soomaali iyo English, qayb ka mid ah Zakariya Academy.','Zaki News is independent financial news in Somali and English, and is part of Zakariya Academy.')
  });
}
