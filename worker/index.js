import { categories, categoryLabels, imageNames, samples, screeningStories } from './stories.js';
import { css, images } from './assets.js';

const channel = 'https://www.youtube.com/channel/UC9V8zhKpqkovV0ZBrWLXGOg';
const brand = 'Zaki News';
const desc = 'Zaki News waa bog warar crypto oo Af-Soomaali ah. Ka akhri Bitcoin, Ethereum, Solana, falanqaynta suuqyada iyo hagayaasha blockchain-ka.';
const defaultAlt = {
  'regulation-capitol':'Dhismaha Capitol-ka Maraykanka xilliga fiidkii',
  bitcoin: 'Qadaadiic Bitcoin ah oo la sawiray',
  ethereum: 'Gacan haysa qadaadiic Bitcoin ah',
  security: 'Qadaadiic Bitcoin ah oo quful la ag dhigay',
  markets: 'Dhismaha New York Stock Exchange'
};
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const catUrl = name => '/topic/' + canonicalCategory(name).toLowerCase().replaceAll(' ','-');
const storyUrl = a => '/article/' + a.slug;
const date = (value, lang='so') => new Intl.DateTimeFormat(lang==='en'?'en-GB':'so', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
const text = (body,status=200) => new Response(body,{status,headers:{'content-type':'text/plain; charset=utf-8','x-content-type-options':'nosniff'}});
const xml = body => new Response(body,{headers:{'content-type':'application/xml; charset=utf-8'}});
const dbAll = async (db, sql, ...values) => (await db.prepare(sql).bind(...values).all()).results;
const dbFirst = (db, sql, ...values) => db.prepare(sql).bind(...values).first();
const dbRun = (db, sql, ...values) => db.prepare(sql).bind(...values).run();
const https = value => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; } catch { return ''; } };
const wordCount = a => Math.max(1,Math.ceil(a.body.trim().split(/\s+/).length/220));
const storyImage = (a, attributes='loading="lazy"') => '<img src="'+escape(a.image)+'" alt="'+escape(a.image_alt)+'" '+attributes+'>';
const section = (title, href='', label='Dhammaan eeg →') => '<div class="section-title"><h2>'+escape(title)+'</h2>'+(href ? '<a href="'+href+'">'+label+'</a>':'')+'</div>';
const readingLabel = (ctx,a) => { const n=wordCount(a); return t(ctx, n+' daqiiqo oo akhris ah', n===1?'1-minute read':n+'-minute read'); };
const meta = (a,profile,ctx) => '<div class="meta">'+(profile?.author===a.author?'<a class="text-link" href="/author">'+escape(a.author)+'</a>':escape(a.author))+' · '+(a.sample ? t(ctx,'Maqaal tusaale ah','Sample article') : '<time datetime="'+escape(a.published_at)+'">'+date(a.published_at,ctx.lang)+'</time>')+' · '+readingLabel(ctx,a)+'</div>';
const card = (a,ctx) => '<article class="card"><a href="'+storyUrl(a)+'">'+storyImage(a)+'</a><div class="card-body"><a class="eyebrow" href="'+catUrl(canonicalCategory(a.category))+'">'+escape(categoryName(ctx,a.category))+'</a><h3><a href="'+storyUrl(a)+'">'+escape(a.title)+'</a></h3><p>'+escape(a.summary)+'</p></div></article>';
const grid = (list,ctx,extra='') => '<div class="grid">'+list.map(a=>card(a,ctx)).join('')+extra+'</div>';
function featuredVideo(ctx,{id,title}){
  return '<article class="card featured-video"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" title="'+escape(title)+'" loading="lazy" width="560" height="315" allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><div class="card-body"><span class="eyebrow">Zakariya Academy</span><h3>'+escape(title)+'</h3><a class="text-link" href="https://youtu.be/'+id+'" rel="noopener noreferrer">'+t(ctx,'Ka daawo YouTube','Watch on YouTube')+' ↗</a></div></article>';
}
const teaser = (a,ctx) => '<article class="teaser"><a href="'+storyUrl(a)+'">'+storyImage(a)+'</a><div><span class="eyebrow">'+escape(categoryName(ctx,a.category))+'</span><h3><a href="'+storyUrl(a)+'">'+escape(a.title)+'</a></h3><span class="meta">'+readingLabel(ctx,a)+'</span></div></article>';
const links = s => escape(s).replace(/\[([^\]\n]+)\]\((https:\/\/[^\s)]+)\)/g,(_,label,url) => '<a href="'+url+'" rel="noopener noreferrer">'+label+'</a>');
const body = s => s.trim().split(/\n\s*\n/).map(p=>p.startsWith('## ') ? '<h2>'+links(p.slice(3))+'</h2>' : '<p>'+links(p)+'</p>');

function articleSlugForLang(article,lang){
  const articleLang=article.language||'so';
  if(articleLang===lang) return article.slug;
  return article.translationSlug||'';
}
function languageHref(origin,pathname,lang,article){
  if(article){
    const slug=articleSlugForLang(article,lang);
    return slug?origin+'/article/'+slug:'';
  }
  return origin+pathname+(lang==='en'?'?lang=en':'');
}
function hrefLangTags(ctx,opts){
  if(opts.noindex) return '';
  const so=languageHref(ctx.origin,ctx.url.pathname,'so',ctx.article);
  const en=languageHref(ctx.origin,ctx.url.pathname,'en',ctx.article);
  let tags='';
  if(so) tags+='<link rel="alternate" hreflang="so" href="'+escape(so)+'">';
  if(en) tags+='<link rel="alternate" hreflang="en" href="'+escape(en)+'">';
  if(so||en) tags+='<link rel="alternate" hreflang="x-default" href="'+escape(so||en)+'">';
  return tags;
}
function canonicalUrl(ctx){
  if(ctx.article) return ctx.origin+storyUrl(ctx.article);
  return ctx.origin+ctx.url.pathname+(ctx.lang==='en'?'?lang=en':'');
}
function layout(ctx,title,content,opts={}) {
  const fullTitle = opts.seoTitle || (title === brand ? brand+' | '+t(ctx,'Wararka Crypto iyo Suuqyada','Crypto and Market News') : title+' | '+brand);
  const description = opts.description || t(ctx,desc,'Crypto, stocks, markets and economic news from Zaki News, in English and Somali.');
  const canonical = canonicalUrl(ctx);
  const image = new URL(opts.image || '/images/bitcoin.webp',ctx.origin).href;
  const schema = opts.schema ? '<script type="application/ld+json">'+JSON.stringify(opts.schema).replace(/</g,'\\u003c')+'</script>' : '';
  const ads = opts.ads && ctx.publisher && ctx.mode === 'auto' ? '<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+ctx.publisher+'"></script>' : '';
  const nav = (path,label) => '<a href="'+editionHref(ctx,path)+'"'+(ctx.url.pathname===path?' class="active" aria-current="page"':'')+'>'+label+'</a>';
  return new Response(`<!doctype html><html lang="${ctx.lang}"><head><meta charset="utf-8">${ctx.url.pathname==="/etf-flows"?'<meta http-equiv="refresh" content="900">':""}<meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(fullTitle)}</title><meta name="description" content="${escape(description)}">${hrefLangTags(ctx,opts)}<link rel="canonical" href="${escape(canonical)}"><meta name="robots" content="${opts.noindex?'noindex,follow':'index,follow,max-image-preview:large'}"><meta property="og:locale" content="${t(ctx,'so_SO','en_US')}"><meta property="og:type" content="${opts.schema?'article':'website'}"><meta property="og:site_name" content="Zaki News"><meta property="og:title" content="${escape(fullTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(fullTitle)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${escape(image)}"><link rel="alternate" type="application/rss+xml" title="Zaki News RSS" href="/rss.xml"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/style.css?v=${styleVersion}"><script defer src="/market-client.js?v=22"></script><script defer src="/editorial-client.js?v=1"></script>${opts.terminal?'<script defer src="/terminal-client.js?v=13"></script>':''}<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,800;0,900;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">${ctx.publisher?'<meta name="google-adsense-account" content="'+ctx.publisher+'">':''}${schema}${ads}</head><body class="${opts.terminal?'terminal-page terminal-'+opts.terminal:''}"><a class="skip" href="#main">${t(ctx,'U gudub nuxurka','Skip to content')}</a>${editorialHeader(ctx)}<main id="main" class="wrap">${content}</main>${siteFooter(ctx)}</body></html>`,{status:opts.status||200,headers:{'content-type':'text/html; charset=utf-8','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','cache-control':opts.noindex?'private, no-store':'no-cache'}});
}

function home(ctx,list,snapshot){
  const lead=list[0];
  return layout(ctx,brand,editorialHome(ctx,list,snapshot),{ads:lead&&!lead.sample});
}

function lessonContent(ctx,text){
  const sections=[];
  const fragments=text.trim().replace(/^(## [^\n]+)\n(?!\n)/gm,'$1\n\n').split(/\n\s*\n/).map(paragraph=>{
    if(!paragraph.startsWith('## '))return '<p>'+links(paragraph)+'</p>';
    const title=paragraph.slice(3),id='lesson-'+(sections.length+1);
    sections.push('<li><a href="#'+id+'">'+escape(title)+'</a></li>');
    return '<h2 id="'+id+'">'+links(title)+'</h2>';
  });
  const opening=fragments[0]?.startsWith('<p>')?'<div class="lesson-opening">'+fragments.shift()+'</div>':'';
  const contents=sections.length>1?'<nav class="lesson-contents" aria-label="'+t(ctx,'Qaybaha casharka','Lesson contents')+'"><strong>'+t(ctx,'Casharkan dhexdiisa','In this guide')+'</strong><ul>'+sections.join('')+'</ul></nav>':'';
  return opening+contents+fragments.join('');
}
function article(ctx,a,list,preview=false) {
  const readingBody=lessonContent(ctx,a.body);
  const schema = !a.sample && !preview ? {'@context':'https://schema.org','@type':'NewsArticle',inLanguage:a.language||'so',headline:a.title,description:a.summary,image:[new URL(a.image,ctx.origin).href],datePublished:a.published_at,dateModified:a.updated_at,author:{'@type':'Person',name:a.author,...(ctx.profile.author===a.author?{url:ctx.origin+'/author'}:{})},publisher:{'@type':'Organization',name:brand},mainEntityOfPage:ctx.origin+storyUrl(a)} : null;
  const related = list.filter(b=>b.slug!==a.slug).sort((x,y)=>Number(y.category===a.category)-Number(x.category===a.category)).slice(0,3);
  return layout(ctx,a.title,'<article class="reading learn-article ed-article"><a class="eyebrow" href="'+editionHref(ctx,catUrl(a.category))+'">'+escape(categoryName(ctx,a.category))+'</a><h1>'+escape(a.title)+'</h1><p class="dek">'+escape(a.summary)+'</p>'+(preview?'<p class="status">Horudhaca qabyo-qoraalka</p>':meta(a,ctx.profile,ctx))+storyImage(a,'class="cover" fetchpriority="high"')+'<div class="copy">'+readingBody+'</div>'+(!preview?shareLinks(ctx,a):'')+'</article>'+(related.length?section(t(ctx,'Maqaallo la xiriira','Related reading'))+grid(related,ctx):''),{seoTitle:a.seo_title,description:a.seo_description||a.summary,image:a.image,schema,noindex:a.sample||preview,ads:!a.sample&&!preview});
}

const field = (name,label,value,attrs='') => '<label>'+label+'<input name="'+name+'" value="'+escape(value)+'" '+attrs+'></label>';
const imageLabels = {bitcoin:'Bitcoin',ethereum:'Ethereum',security:'Amniga',markets:'Suuqyada','regulation-capitol':'Capitol-ka Maraykanka'};
const options = (values,current,labels) => values.map(v=>'<option value="'+escape(v)+'"'+(v===current?' selected':'')+'>'+escape(labels[v])+'</option>').join('');
const message = value => value?'<p class="status">'+escape(value)+'</p>':'';
const studioPage = (ctx,content,opts={}) => layout(ctx,'Qolka wararka','<h1>Qolka wararka</h1>'+content,{noindex:true,...opts});

async function studio(ctx,req,env) {
  const db = env.DB;
  const uid = req.headers.get('oai-authenticated-user-id');
  if (Number(req.headers.get('content-length'))>300000) return text('Codsigu aad buu u dheer yahay.',413);
  const owner = (await dbFirst(db,"SELECT value FROM settings WHERE key='owner'"))?.value;
  if (!uid) return studioPage(ctx,'<p><a class="btn" href="/signin-with-chatgpt?returnTo=%2Fadmin" target="_top">Ku gal ChatGPT</a></p>');
  if (req.method==='POST' && (req.headers.get('origin')!==ctx.url.origin || !req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))) return text('Codsiga lama aqbalin.',403);
  const email = req.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const ownerEmail = env.NEWSROOM_OWNER_EMAIL?.trim().toLowerCase();
  if (owner !== uid && (!ownerEmail || email !== ownerEmail)) {
    return studioPage(ctx,'<p>Qolka wararka waxaa geli kara oo keliya mulkiilaha bogga.</p>',{status:403});
  }
  const panel = ctx.url.searchParams.get('panel');
  if (['subscribers','sections','calendar'].includes(panel)) return editionAdmin(ctx,req,db,panel);
  if (panel==='videos') return videoEditor(ctx,req,db);
  if (panel==='profile') return publisherSettings(ctx,req,db);
  if (panel==='inbox') return inbox(ctx,req,db);
  const slug = ctx.url.searchParams.get('edit') || ctx.url.searchParams.get('preview');
  const previous = slug ? await dbFirst(db,'SELECT * FROM articles WHERE slug=?',slug) : null;
  if (slug && !previous) return studioPage(ctx,'<p>Maqaalka lama helin.</p>',{status:404});
  if (req.method==='GET' && previous && ctx.url.searchParams.has('preview')) {ctx.lang=previous.language||'so';return article(ctx,previous,[],true);}
  let current = previous || {author:ctx.profile.author};
  let notice = ctx.url.searchParams.get('saved') ? 'Isbeddellada waa la kaydiyay.' : '';
  let status = 200;
  if (req.method==='POST') {
    if (Number(req.headers.get('content-length'))>300000) return text('Maqaalku aad buu u dheer yahay.',413);
    const f = await req.formData();
    const action = f.get('action');
    if (action==='unpublish' && previous) {
      await dbRun(db,'UPDATE articles SET published_at=NULL, updated_at=? WHERE slug=?',new Date().toISOString(),slug);
      return new Response(null,{status:303,headers:{location:ctx.url.pathname+'?edit='+slug+'&saved=1'}});
    }
    if (!['save','publish'].includes(action)) return text('Tallaabada lama aqoonsan.',400);
    const read = name => String(f.get(name)||'').trim();
    const title=read('title'), summary=read('summary'), category=read('category'), author=read('author'), copy=read('body'), theme=read('theme');
    const seoTitle=read('seo_title'), seoDescription=read('seo_description');
    const language=read('language')==='en'?'en':'so';
    const customImage = read('image');
    const customUrl=customImage&&https(customImage);
    const builtIn=customUrl&&[ctx.origin,ctx.url.origin,'https://zaki-news-preview.vercel.app'].includes(new URL(customUrl).origin)&&Object.hasOwn(images,new URL(customUrl).pathname.slice(8))&&new URL(customUrl).pathname.startsWith('/images/');
    const image = customImage ? (builtIn?new URL(customUrl).pathname:customUrl) : '/images/'+theme+'.webp';
    const alt = read('image_alt') || (customImage?'':defaultAlt[theme]);
    const identifier = slug || (read('slug') || title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,''));
    current = {...current, title, summary, category, author, body:copy, image:customImage||image, image_alt:read('image_alt'), slug:identifier, seo_title:seoTitle, seo_description:seoDescription, language};
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identifier) || identifier.length>100 || seoTitle.length>70 || seoDescription.length>170 || !title || title.length>140 || !summary || summary.length>240 || !author || author.length>90 || !copy || copy.length>60000 || !categories.includes(category) || !imageNames.includes(theme) || !image || !alt || alt.length>180 || image.length>1000 || [...samples,...englishSamples,...screeningStories].some(a=>a.slug===identifier)) {
      notice='Buuxi meelaha loo baahan yahay. Sawirka gaarka ah geli xiriir HTTPS ah iyo sharraxaad. Dooro cinwaan URL oo gaar ah.';
      status=400;
    } else {
      const now = new Date().toISOString();
      const published = previous?.published_at || (action==='publish'?now:null);
      const reserved=[...samples,...englishSamples,...educationStories,...screeningStories,...novemberMarketStories].some(article=>article.image===image);
      const clearCover="NOT EXISTS (SELECT 1 FROM articles AS used WHERE used.image=? AND used.published_at IS NOT NULL AND used.slug<>?)";
      const duplicateNotice='Sawirkan maqaal kale ayaa isticmaalaya. Geli xiriirka sawir kale.';
      if (previous) {
        const result=await dbRun(db,"UPDATE articles SET title=?,summary=?,category=?,author=?,body=?,image=?,image_alt=?,seo_title=?,seo_description=?,language=?,updated_at=?,published_at=CASE WHEN ?='publish' THEN COALESCE(published_at,?) ELSE published_at END WHERE slug=? AND ((published_at IS NULL AND ?<>'publish') OR (?=0 AND "+clearCover+"))",title,summary,category,author,copy,image,alt,seoTitle,seoDescription,language,now,action,now,identifier,action,Number(reserved),image,identifier);
        if(result.meta.changes) return new Response(null,{status:303,headers:{location:ctx.url.pathname+'?edit='+identifier+'&saved=1'}});
      } else {
        const result=await dbRun(db,'INSERT OR IGNORE INTO articles (slug,title,summary,category,author,body,image,image_alt,seo_title,seo_description,language,published_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE (? IS NULL OR (?=0 AND '+clearCover+'))',identifier,title,summary,category,author,copy,image,alt,seoTitle,seoDescription,language,published,now,published,Number(reserved),image,identifier);
        if(result.meta.changes) return new Response(null,{status:303,headers:{location:ctx.url.pathname+'?edit='+identifier+'&saved=1'}});
      }
      const duplicateSlug=!previous&&await dbFirst(db,'SELECT slug FROM articles WHERE slug=?',identifier);
      notice=duplicateSlug?'Cinwaanka URL-kaas hore ayaa loo isticmaalay.':duplicateNotice;
      status=409;
    }
  }
  const view = ctx.url.searchParams.get('status') || 'all';
  const query = (ctx.url.searchParams.get('q') || '').trim().slice(0,100);
  const counts = await dbFirst(db,'SELECT COUNT(*) AS total, COUNT(published_at) AS live FROM articles');
  const conditions = "WHERE (? != 'live' OR published_at IS NOT NULL) AND (? != 'draft' OR published_at IS NULL) AND (? = '' OR instr(lower(title),lower(?)) > 0)";
  const resultCount = await dbFirst(db,'SELECT COUNT(*) AS total FROM articles '+conditions,view,view,query,query);
  const pages = Math.max(1,Math.ceil(resultCount.total/15));
  const page = Math.min(pages,Math.max(1,parseInt(ctx.url.searchParams.get('page'),10)||1));
  const rows = await dbAll(db,'SELECT slug,title,category,published_at,updated_at FROM articles '+conditions+' ORDER BY updated_at DESC,slug LIMIT 15 OFFSET ?',view,view,query,query,(page-1)*15);
  const pageLink = n => '/studio?'+new URLSearchParams({status:view,q:query,page:n});
  const dashboard = `<section class="studio-head"><div><span class="eyebrow">Zaki News</span><h2>Maamulka maqaallada</h2></div><a class="btn" href="/studio?new=1">+ Maqaal cusub</a></section>
    <div class="studio-stats"><div><strong>${counts.total}</strong><span>Dhammaan</span></div><div><strong>${counts.live}</strong><span>La daabacay</span></div><div><strong>${counts.total-counts.live}</strong><span>Qabyo-qoraal</span></div></div>
    <section class="studio-library"><form class="studio-filter" method="get" action="/studio"><label>Raadi cinwaan<input type="search" name="q" maxlength="100" value="${escape(query)}"></label><label>Xaaladda<select name="status">${options(['all','live','draft'],view,{all:'Dhammaan',live:'La daabacay',draft:'Qabyo-qoraal'})}</select></label><button>Raadi</button></form>
    ${rows.length ? '<div class="studio-table"><table><thead><tr><th>Maqaalka</th><th>Qaybta</th><th>Xaaladda</th><th>La cusboonaysiiyay</th></tr></thead><tbody>'+rows.map(a=>'<tr><td><a href="/studio?edit='+a.slug+'">'+escape(a.title)+'</a></td><td>'+escape(categoryLabels[a.category])+'</td><td>'+(a.published_at?'La daabacay':'Qabyo-qoraal')+'</td><td>'+date(a.updated_at)+'</td></tr>').join('')+'</tbody></table></div>' : '<p class="meta">Wax maqaal ah lama helin.</p>'}
    ${pages>1?'<nav class="studio-pages" aria-label="Bogagga">'+(page>1?'<a href="'+escape(pageLink(page-1))+'">← Hore</a>':'')+'<span>'+page+' / '+pages+'</span>'+(page<pages?'<a href="'+escape(pageLink(page+1))+'">Xiga →</a>':'')+'</nav>':''}</section>`;
  if (req.method==='GET' && !previous && !ctx.url.searchParams.has('new')) return studioPage(ctx,publisherNav+editionAdminNav+dashboard);
  const theme = imageNames.find(n=>current.image==='/images/'+n+'.webp') || 'bitcoin';
  const previewUrl = ctx.origin+'/article/'+(current.slug||'cinwaanka-maqaalka');
  const seoPanel = '<fieldset class="seo-panel"><legend>SEO iyo horudhaca raadinta</legend>'+field('seo_title','Cinwaanka raadinta',current.seo_title,'maxlength="70"')+field('seo_description','Sharraxaadda raadinta',current.seo_description,'maxlength="170"')+'<p class="meta">Haddii aad ka tagto meelahan bannaan, cinwaanka iyo soo koobidda maqaalka ayaa la adeegsanayaa.</p><div class="seo-preview"><span id="seo-url">'+escape(previewUrl)+'</span><strong id="seo-title">'+escape(current.seo_title||(current.title?current.title+' | Zaki News':'Cinwaanka maqaalka | Zaki News'))+'</strong><p id="seo-description">'+escape(current.seo_description||current.summary||'Sharraxaadda maqaalka ayaa halkan ka muuqanaysa.')+'</p></div><ul class="seo-check"><li id="seo-length"></li><li id="seo-summary"></li><li id="seo-heading"></li></ul></fieldset>';
  return studioPage(ctx,publisherNav+editionAdminNav+message(notice)+'<div class="studio-editor"><a class="text-link" href="/studio">← Dhammaan maqaallada</a><script defer src="/studio-preview.js"></script><form method="post" class="form"><h2>'+ (previous?'Wax ka beddel maqaalka':'Maqaal cusub')+'</h2>'+field('title','Cinwaanka maqaalka',current.title,'required maxlength="140"')+field('slug','Qaybta URL-ka',current.slug,previous?'disabled':'maxlength="100" placeholder="Cinwaanka ayaa laga samaynayaa haddii ay bannaan tahay"')+field('summary','Soo koobidda maqaalka',current.summary,'required maxlength="240"')+'<label>Qaybta<select name="category">'+options([...mainCategories,...categories.filter(c=>!mainCategories.includes(c))],current.category||'Crypto',categoryLabels)+'</select></label>'+'<label>Luqadda maqaalka<select name="language">'+options(['so','en'],current.language||'so',{so:'Af-Soomaali',en:'English'})+'</select></label>'+field('author','Magaca qoraaga',current.author,'required maxlength="90"')+'<label>Qoraalka maqaalka<textarea name="body" required maxlength="60000">'+escape(current.body)+'</textarea><span class="meta">Sadar bannaan ku kala saar tuducyada. Cinwaannada ku bilow ##, xiriiriyeyaashana u qor [isha](https://…).</span></label><label>Sawirrada diyaarsan<select name="theme">'+options(imageNames,theme,imageLabels)+'</select></label>'+field('image','Xiriirka sawir gaar u ah maqaalka',current.image?.startsWith('/images/')?'':current.image,'type="url" maxlength="1000"')+field('image_alt','Sharraxaadda sawirka (waa qasab haddii aad geliso sawirkaaga)',current.image_alt,'maxlength="180"')+seoPanel+'<div class="actions"><button name="action" value="save" class="secondary">'+(previous?.published_at?'Kaydi isbeddellada maqaalka la daabacay':'Kaydi qabyo-qoraalka')+'</button>'+(!previous?.published_at?'<button name="action" value="publish">Daabac maqaalka</button>':'<button class="secondary" name="action" value="unpublish" formnovalidate>Ka saar daabacaadda</button>')+(previous?'<a class="btn secondary" href="/studio?preview='+slug+'">Eeg horudhaca</a>':'')+(previous?.published_at?'<a class="btn secondary" href="'+storyUrl(previous)+'">Akhri maqaalka</a>':'')+'</div></form></div>',{status});
}

export default { async fetch(req,env,work) {
  const url = new URL(req.url);
  const edition = url.pathname.match(/^\/(en|so)(?:\/(.*))?$/);
  if (edition) {
    url.searchParams.set('lang',edition[1]);
    const rest=(edition[2]||'').split('/').filter(part=>part&&part!=='.'&&part!=='..').join('/');
    url.pathname=rest?'/'+rest:'/';
  }
  const path = url.pathname;
  const configuredOrigin = (url.hostname==='news.zakariyaacademy.com' ? url.origin : https(env.SITE_ORIGIN)||url.origin).replace(/\/$/,'');
  const origin = [url.hostname, new URL(configuredOrigin).hostname].includes('chain-desk-crypto.enjoyableginger.chatgpt.site')
    ? 'https://zaki-news.vercel.app' : configuredOrigin;
  const publisher = /^ca-pub-\d{16}$/.test(env.ADSENSE_PUBLISHER_ID||'') ? env.ADSENSE_PUBLISHER_ID : '';
  const ctx = {url,origin,publisher,lang:url.searchParams.get('lang')==='en'?'en':'so',mode:env.ADSENSE_MODE};
  if (path==='/data/coinglass-liquidations') return coinGlassReport(env);
  if (path==='/terminal-client.js') return new Response(terminalScript,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=300'}});
  if (path==='/market-client.js') return new Response(marketScript,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=300'}});
  if (path==='/editorial-client.js') return new Response(editorialScript,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=300'}});
  if(path.startsWith('/social-logo/')){
    const key=path.slice(13).replace(/\.svg$/,'');
    if(Object.hasOwn(socialAssets,key)) return new Response(atob(socialAssets[key]),{headers:{'content-type':'image/svg+xml','cache-control':'public, max-age=86400','x-content-type-options':'nosniff'}});
  }
  if (path==='/studio-preview.js') return new Response(studioScript,{headers:{'content-type':'text/javascript; charset=utf-8','cache-control':'public, max-age=300','x-content-type-options':'nosniff'}});
  if (path==='/style.css') return new Response(css,{headers:{'content-type':'text/css; charset=utf-8','cache-control':'public, max-age=3600'}});
  if (path==='/favicon.ico') return new Response(mark.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '),{headers:{'content-type':'image/svg+xml'}});
  if (path.startsWith('/images/')) {
    const img = Object.hasOwn(images,path.slice(8)) && images[path.slice(8)];
    if (img) return new Response(Uint8Array.from(atob(img),c=>c.charCodeAt(0)),{headers:{'content-type':'image/webp','cache-control':'public, max-age=86400'}});
  }
  if (path==='/ads.txt') return publisher?text('google.com, '+publisher.slice(3)+', DIRECT, f08c47fec0942fa0\n'):text('Iibiyeyaasha xayeysiiska weli lama dejin.\n',404);
  if (path==='/robots.txt') return text('User-agent: *\nDisallow: /studio\nDisallow: /admin\nSitemap: '+origin+'/sitemap.xml\n');
  if(path.startsWith('/coin-logo/')){
    const file=path.slice(11);
    if(Object.hasOwn(coinAssets,file)) return new Response(Uint8Array.from(atob(coinAssets[file]),c=>c.charCodeAt(0)),{headers:{'content-type':file.endsWith('.svg')?'image/svg+xml':'image/png','cache-control':'public, max-age=86400','x-content-type-options':'nosniff'}});
  }
  if (!['GET','HEAD'].includes(req.method) && !(['POST'].includes(req.method) && ['/studio','/admin','/contact','/newsletter'].includes(path))) return text('Habkan codsiga lama oggola.',405);
  const profile = await dbFirst(env.DB,"SELECT value FROM settings WHERE key='publisher'");
  ctx.profile = {...defaultProfile,...(profile?JSON.parse(profile.value):{})};
  const settings=await dbFirst(env.DB,"SELECT value FROM settings WHERE key='sections'");
  ctx.sections=settings?JSON.parse(settings.value):{};
  if(path==='/data/quote-board'){
    const key=url.searchParams.get('asset');
    if(!boardKeys.includes(key))return text('Unknown market',404);
    return new Response(quoteBoard(ctx,key,await refreshedBoard(key)),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public,max-age=120','x-robots-tag':'noindex'}});
  }
  if(path==='/bitcoin-panel'){
    return new Response(bitcoinPanel(ctx,await bitcoinOverviewCoin()),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public,max-age=120','x-robots-tag':'noindex'}});
  }
  if(path==='/newsletter' && req.method==='POST') return subscribe(ctx,req,env.DB);
  if(path.startsWith('/data/')) return feeds(ctx,path,env.DB);
  if(ctx.lang==='en'&&Object.hasOwn(englishPolicies,path)) return publisherPage(ctx,...englishPolicies[path]);
  if(path==='/contact') return contact(ctx,req,env.DB);
  if(path==='/commodities'){ctx.url.searchParams.set('asset','commodities');return marketDirectory(ctx);}
  if(path==='/smart-money') {
    const title='Ethereum Smart Money';
    const rows=[['NKP','+$6,893'],['TAC','+$1,723'],['REKT','+$501'],['CFG','$0'],['HASHAI','$0']];
    const story=t(ctx,'ethereum-smart-money-24-nofeembar','ethereum-smart-money-nov24');
    const tokenCell=symbol=>'<span class="fc-token">'+coinIcon(symbol.toLowerCase())+'<span>'+escape(symbol)+'</span></span>';
    const body='<h1>'+title+'</h1><section class="fc-board"><h2>'+t(ctx,'Shanta token ee ugu sarreeya','Top five tokens')+'</h2><p>'+t(ctx,'Xogta Nansen ee 24 saac · 24 Nofeembar 2026, 09:23 UTC','Nansen 24-hour snapshot · November 24, 2026, 09:23 UTC')+'</p>'+fcTable(['#','Token',t(ctx,'Qulqulka saafiga ah (USD)','Net flow (USD)')],rows.map(([token,value],i)=>{const href=tradingViewChartHref('crypto',token);return {attrs:' class="ed-chart-row" data-chart-href="'+escape(href)+'"',cells:['<a class="ed-row-fill" href="'+escape(href)+'" target="_blank" rel="noopener noreferrer">'+(i+1)+'</a>',coinChartAnchor(token,tokenCell(token)),'<a class="ed-row-fill" href="'+escape(href)+'" target="_blank" rel="noopener noreferrer">'+value+'</a>']};}))+'<a href="/article/'+story+'">'+t(ctx,'Akhri falanqaynta','Read the analysis')+'</a></section>';
    return layout(ctx,title,terminalShell(ctx,body),{terminal:'smart-money'});
  }
  if(Object.hasOwn(toolsNav,path.slice(1))) return marketPage(ctx,path.slice(1),env.DB);
  if(path==='/etf-client.js') return new Response([fcDate,fcFlowNumber,fcParseFlow,fcMillions,fcRate].map(fn=>fn.toString()).join('\n')+'\n'+etfClient,{headers:{'content-type':'text/javascript; charset=utf-8'}});
  if(path==='/etf-flows')return fcFlowPage(ctx,work);
  if(path==='/ipo-calendar')return ipoCalendarPage(ctx,work);
  if(path==='/earnings-calendar')return fcCorporatePage(ctx,'earnings',work);
  if(path==='/resources')return resourceDirectory(ctx);
  if(path==='/videos')return videosPage(ctx,await videoList(env.DB));
  if(path==='/education')return redirect(editionHref(ctx,'/topic/education'));
  if(path==='/etfs') return etfPage(ctx);
  if(path==='/fear-greed') return sentimentPage(ctx);
  if(path==='/sharia') return shariaPage(ctx);
  if(path==='/embed/stocks') return stockEmbed(ctx);
  if(path==='/photo-credits') return credits(ctx);
  if(path==='/author') return authorPage(ctx);
  if(Object.hasOwn(policyPages,path)) return publisherPage(ctx,...policyPages[path]);
  if (['/studio','/admin'].includes(path) && ['GET','POST'].includes(req.method)) return studio(ctx,req,env);
  if (!['GET','HEAD'].includes(req.method)) return text('Habkan codsiga lama oggola.',405);
  const published = [...novemberMarketStories,...educationStories,...screeningStories,...await dbAll(env.DB,'SELECT * FROM articles WHERE published_at IS NOT NULL')].sort((a,b)=>b.published_at.localeCompare(a.published_at)||a.slug.localeCompare(b.slug));
  const all = [...published,...samples,...englishSamples];
  const list = all.filter(a=>(a.language||'so')===ctx.lang);
  if (path==='/') return home(ctx,list,await marketSnapshot());
  if (path==='/sitemap.xml') {
    const pagePaths=['/','/resources','/videos','/latest','/topic/stocks','/topic/forex','/sharia','/etfs','/etf-flows','/crypto-bubbles','/ipo-calendar','/earnings-calendar','/profit-calculator','/commodities','/fear-greed','/about','/contact','/terms','/disclaimer','/privacy',...Object.keys(toolsNav).filter(k=>enabled(ctx,k)).map(k=>'/'+k),...(ctx.profile.author?['/author']:[]),...categories.filter(c=>!['Stocks','Forex'].includes(c)&&published.some(a=>canonicalCategory(a.category)===c)).map(catUrl)];
    const uniquePages=[...new Set(pagePaths)];
    const withEditions=uniquePages.flatMap(p=>[p, p==='/'?'/?lang=en':p+(p.includes('?')?'&':'?')+'lang=en']);
    return xml('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(withEditions)].map(p=>'<url><loc>'+escape(origin+p)+'</loc></url>').join('')+published.map(a=>'<url><loc>'+escape(origin+storyUrl(a))+'</loc><lastmod>'+a.updated_at+'</lastmod></url>').join('')+'</urlset>');
  }
  if (path==='/rss.xml') {
    const feedLang=ctx.lang;
    const items=published.filter(a=>(a.language||'so')===feedLang).slice(0,25);
    const feedDesc=feedLang==='en'?'Crypto, stocks, markets and economic news from Zaki News.':desc;
    const feedLink=origin+(feedLang==='en'?'/?lang=en':'/');
    return xml('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><language>'+feedLang+'</language><title>Zaki News</title><link>'+escape(feedLink)+'</link><description>'+escape(feedDesc)+'</description>'+items.map(a=>'<item><title>'+escape(a.title)+'</title><link>'+escape(origin+storyUrl(a))+'</link><guid>'+escape(origin+storyUrl(a))+'</guid><pubDate>'+new Date(a.published_at).toUTCString()+'</pubDate><description>'+escape(a.summary)+'</description></item>').join('')+'</channel></rss>');
  }
  if (path==='/about') return aboutPage(ctx, all);
  if (path==='/privacy') return layout(ctx,'Asturnaanta','<article class="reading"><h1>Asturnaanta</h1><div class="copy"><p>Ereyada aad raadiso waxaa boggan loogu diraa qayb ka mid ah URL-ka raadinta. Qolka wararku wuxuu adeegsadaa gelitaanka ChatGPT, wuxuuna kaydiyaa aqoonsiga koontada mulkiilaha si loo maamulo gelitaanka.</p><p>Xiriiriyeyaasha dibadda waxay kuu gudbiyaan adeegyo kale sida YouTube. Google Fonts ayaa bixiya farta boggan.</p><h2>Warsidaha</h2><p>Markaad isdiiwaangeliso, waxaan kaydinnaa iimaylkaaga iyo taariikhda isdiiwaangelinta. Nala soo xiriir haddii aad rabto in lagaa saaro liiska.</p><h2>Farriimaha xiriirka</h2><p>Markaad foomka soo dirto, waxaan kaydinnaa magaca, iimaylka iyo farriinta si aan u akhrino ugana jawaabno. Waxaad ka codsan kartaa inaad hesho, saxdo ama tirtirto xogtaada adigoo <a href="/contact">nala soo xiriiraya</a>.</p>'+(publisher?'<h2>Xayeysiis</h2><p>Marka Google AdSense shaqeeyo, Google iyo la-hawlgalayaashiisu waxay adeegsan karaan cookies ama farsamooyin la mid ah si ay xayeysiis u soo bandhigaan. Eeg <a href="https://policies.google.com/technologies/partner-sites">ogeysiiska asturnaanta ee Google ee bogagga la-hawlgalayaasha</a>.</p>':'')+'</div></article>');
  if (path.startsWith('/article/')) {
    const slug = path.slice(9);
    const a = all.find(item=>item.slug===slug);
    if (a) {
      ctx.article=a;ctx.lang=a.language||'so';
      return article(ctx,a,all.filter(item=>(item.language||'so')===ctx.lang));
    }
  }
  if (path==='/topic/technology') return new Response(null,{status:301,headers:{location:editionHref(ctx,'/topic/tech')}});
  const chartMatch=path.match(/^\/chart\/(forex|crypto)\/([A-Za-z0-9]+)$/i);
  if(chartMatch) return instrumentChartPage(ctx, chartMatch[1].toLowerCase(), chartMatch[2]);
  if (path==='/search') {
    const q=(url.searchParams.get('q')||'').trim().slice(0,100);
    return searchPage(ctx, all, q);
  }
  const category = categories.find(c=>catUrl(c)===path);

  if (category || path==='/latest') {
    const results = category?list.filter(a=>category==='Crypto'?![...mainCategories.slice(1),'Halal','Haram','Mashbooh'].includes(canonicalCategory(a.category)):canonicalCategory(a.category)===category):list;
    const title = categoryName(ctx,category) || t(ctx,'Maqaalladii u dambeeyay','Latest stories');
    const panel = category==='Forex'?forexPanel(ctx):category==='Stocks'?stockPanel(ctx):['Halal','Haram','Mashbooh'].includes(category)?'<p><a class="text-link" href="'+editionHref(ctx,'/sharia')+'">'+t(ctx,'Eeg hagaha qaybaha','Open the sector guide')+' →</a></p>':'';
    const articles = results.length?grid(results,ctx):(category==='Forex'?relatedTopicArticles(ctx,list,category):'<div class="ed-empty-state"><p>'+t(ctx,'Wax maqaal ah lama helin.','No articles found.')+'</p></div>');
    return layout(ctx,title,'<div class="section-title"><h1>'+escape(title)+'</h1></div>'+panel+articles,{description:category?t(ctx,'Akhri wararka iyo hagayaasha '+categoryName({lang:'so'},category)+' ee Zaki News!','Read Zaki News coverage of '+categoryName({lang:'en'},category)+'.'):desc,noindex:!!category&&!['Forex','Stocks'].includes(category)&&!results.some(a=>!a.sample),ads:results.some(a=>!a.sample)});
  }
  return layout(ctx,t(ctx,'Bogga lama helin','Page not found'),'<h1>'+t(ctx,'Bogga lama helin','Page not found')+'</h1><p><a class="text-link" href="'+editionHref(ctx,'/')+'">'+t(ctx,'Ku laabo bogga hore','Back to the homepage')+'</a></p>',{status:404,noindex:true});
}};
