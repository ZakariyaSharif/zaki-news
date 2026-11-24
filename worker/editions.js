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
const marketCoins = coins.filter(([symbol])=> symbol!=='bnb');
function coinIcon(symbol){
  const file=Object.keys(coinAssets).find(name=>name.startsWith(symbol+'.'));
  return file?'<img src="/coin-logo/'+file+'" alt="" width="25" height="25">':'';
}
function sectionNav(ctx){
  return '<nav class="wrap nav market-nav" aria-label="'+t(ctx,'Xogta suuqa','Market data')+'"><a href="'+editionHref(ctx,'/etf-flows')+'">'+t(ctx,'Qulqulka ETF-yada crypto','Crypto ETF flows')+'</a>'+Object.entries(toolsNav).filter(([k])=>enabled(ctx,k)).map(([k,v])=>'<a href="'+editionHref(ctx,'/'+k)+'">'+t(ctx,...v)+'</a>').join('')+'<a href="'+editionHref(ctx,'/etfs')+'">'+t(ctx,'ETF-yada','ETFs')+'</a><a href="'+editionHref(ctx,'/fear-greed')+'">'+t(ctx,'Cabsi iyo Hunguri','Fear &amp; Greed')+'</a></nav>';
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
  '/privacy':['Privacy','<h2>Newsletter and contact</h2><p>We store your email and signup date when you subscribe. If you contact us through the form, we store your name, email, and message so we can reply. <a href="/contact?lang=en">Contact us</a> to request access, correction, or deletion of your information or to leave the newsletter list.</p><h2>Site features</h2><p>Search terms are included in search URLs. Your theme preference is stored on this device. Newsroom sign-in is handled by ChatGPT. External services have their own privacy policies.</p>'],
  '/about':['About Zaki News','<p>Zaki News covers crypto, stocks, the economy, central banks, tech, and politics for Somali-speaking readers. The English edition shows articles published in English.</p><h2>Editorial policy</h2><p>We identify authors and publication dates, link to sources when available, and label sample guides. <a href="/contact?lang=en">Contact the newsroom</a> with tips or corrections.</p>']
};
