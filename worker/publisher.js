const academy = 'https://zakariyaacademy.com/';
const socialLabels = {youtube:'YouTube',x:'X',instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',telegram:'Telegram',substack:'Substack',linkedin:'LinkedIn',discord:'Discord',whatsapp:'WhatsApp',threads:'Threads'};
const profileFields = {
  author:['Magaca qoraaga',90], bio:['Taariikh nololeedka kooban',600], photo:['Xiriirka sawirka qoraaga',1000],
  email:['Iimaylka dadweynaha',254], phone:['Telefoonka dadweynaha',40], legalName:['Magaca ganacsiga ama daabacaha',150],
  address:['Cinwaanka ganacsiga',250], registration:['Lambarka diiwaangelinta ama VAT',100], website:['Bogga internetka',1000]
};
const defaultProfile = {author:'',bio:'',photo:'',email:'info@zakariyaacademy.com',website:academy,youtube:channel,x:'https://x.com/zakariyasharif9',instagram:'https://www.instagram.com/zakariya__sharif/',facebook:'https://www.facebook.com/official.zakariya.sharif',tiktok:'https://www.tiktok.com/@zakariyaacademy',telegram:'https://t.me/ZakariyaAcademy1',substack:'https://substack.com/@zakariyasharif',discord:'https://discord.gg/g2kBMMA9TC'};
const validEmail = value => /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/.test(value);
const publisherNav = '<nav class="publisher-nav" aria-label="Maamulka"><a href="/studio">Maqaallada</a><a href="/studio?panel=videos">Muuqaallada · Videos</a><a href="/studio?panel=profile">Qoraaga iyo xiriirrada</a><a href="/studio?panel=inbox">Farriimaha</a><a href="/signout-with-chatgpt?returnTo=%2F" target="_top">Ka bax</a></nav>';
function externalArrowIcon(){
  return '<svg class="ed-ext-arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 8.8L8.8 3.2"/><path d="M5 3.2h3.8V7"/></svg>';
}
function brandLogo(file,size){
  const name=String(file||'');
  const s=Number(size)||22;
  if(!name||typeof brandAssets==='undefined'||!Object.hasOwn(brandAssets,name)) return '';
  return '<img class="ed-brand-logo" src="/brand-logo/'+name+'" alt="" width="'+s+'" height="'+s+'" loading="lazy">';
}
function brandTextLink(href,label,file,external,size){
  const extra=external?' rel="noopener noreferrer" target="_blank"':'';
  return '<a class="ed-brand-link" href="'+escape(href)+'"'+extra+'>'+brandLogo(file,size||22)+'<span>'+label+'</span>'+(external?externalArrowIcon():'')+'</a>';
}
const publicLink = (url,label) => {
  const raw=String(label??'');
  const hasArrow=raw.includes('↗');
  const text=escape(raw.replace(/\s*↗\s*/g,' ').replace(/\s+/g,' ').trim());
  return '<a'+(hasArrow?' class="ed-ext-link"':'')+' href="'+escape(url)+'" rel="noopener noreferrer"'+(hasArrow?' target="_blank"':'')+'>'+text+(hasArrow?' '+externalArrowIcon():'')+'</a>';
};
const socials = profile => Object.entries(socialLabels).filter(([key])=>profile[key]).map(([key,label])=>'<a href="'+escape(profile[key])+'" rel="noopener noreferrer">'+(socialAssets[key]?'<img src="/social-logo/'+key+'.svg" width="16" height="16" alt=""> ':'')+escape(label)+'</a>').join('');
const replyTo = email => 'mailto:'+escape(email);
const redirect = location => new Response(null,{status:303,headers:{location}});
function publisherPage(ctx,title,body,opts={}) {
  return layout(ctx,title,'<article class="reading policy'+(opts.wide?' reading-wide':'')+'"><h1>'+escape(title)+'</h1><div class="copy">'+body+'</div></article>',opts);
}
async function publisherSettings(ctx,req,db) {
  let data = ctx.profile;
  let notice = ctx.url.searchParams.has('saved') ? 'Xogta waa la kaydiyay.' : '';
  let status = 200;
  if (req.method==='POST') {
    const form = await req.formData();
    data = Object.fromEntries([...Object.keys(profileFields),...Object.keys(socialLabels)].map(key=>[key,String(form.get(key)||'').trim()]));
    const invalidLink = ['photo','website',...Object.keys(socialLabels)].some(key=>data[key] && !https(data[key]));
    if (invalidLink || (data.email && !validEmail(data.email)) || Object.entries(profileFields).some(([key,[,max]])=>data[key].length>max) || Object.keys(socialLabels).some(key=>data[key].length>1000)) {
      notice='Hubi iimaylka, dhererka qoraalka iyo xiriiriyeyaasha HTTPS.';
      status=400;
    } else {
      await dbRun(db,"INSERT INTO settings (key,value) VALUES ('publisher',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(data));
      return redirect('/studio?panel=profile&saved=1');
    }
  }
  const detailFields = Object.entries(profileFields).map(([key,[label,max]])=>key==='bio'?'<label>'+label+'<textarea name="bio" maxlength="600">'+escape(data.bio)+'</textarea></label>':field(key,label,data[key],(key==='email'?'type="email" ':['website','photo'].includes(key)?'type="url" ':'')+'maxlength="'+max+'"')).join('');
  const socialFields = Object.entries(socialLabels).map(([key,label])=>field(key,label,data[key],'type="url" maxlength="1000" placeholder="https://"')).join('');
  return studioPage(ctx,publisherNav+message(notice)+'<form method="post" action="/studio?panel=profile" class="form studio-editor"><h2>Xogta qoraaga iyo daabacaha</h2><p class="meta">Xogtan waxay ka muuqanaysaa bogagga qoraaga, xiriirka iyo asturnaanta.</p>'+detailFields+'<h2>Baraha bulshada</h2><div class="profile-fields">'+socialFields+'</div><button>Kaydi xogta</button></form>',{status});
}
async function inbox(ctx,req,db) {
  if(req.method==='POST'){
    const form=await req.formData();
    const id=Number(form.get('delete'));
    if(!Number.isSafeInteger(id)||id<1) return text('Farriinta lama helin.',400);
    await dbRun(db,'DELETE FROM contacts WHERE id=?',id);
    return redirect('/studio?panel=inbox');
  }
  const list=await dbAll(db,'SELECT * FROM contacts ORDER BY id DESC LIMIT 100');
  const messages=list.map(m=>'<details class="inbox-item"><summary>'+escape(m.subject)+' <span class="meta">· '+escape(m.name)+' · '+date(m.created_at)+'</span></summary><p class="meta">Jawaab: <a href="'+replyTo(m.email)+'">'+escape(m.email)+'</a></p><p class="inbox-body">'+escape(m.body)+'</p><form method="post" action="/studio?panel=inbox"><button class="secondary" name="delete" value="'+m.id+'">Tirtir farriinta</button></form></details>').join('');
  return studioPage(ctx,publisherNav+'<h2>Farriimaha soo galay</h2>'+(messages||'<p>Weli farriimo ma jiraan.</p>'));
}
async function contact(ctx,req,db) {
  const p=ctx.profile;
  let notice=ctx.url.searchParams.has('sent')?'Farriinta waa la diray. Mahadsanid.':'';
  let status=200;
  let values={};
  if(req.method==='POST'){
    if(req.headers.get('origin')!==ctx.url.origin||!req.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return text('Codsiga lama aqbalin.',403);
    if(Number(req.headers.get('content-length'))>16000) return text('Farriintu way dheer tahay.',413);
    const form=await req.formData();
    if(form.get('website_confirm')) return redirect(editionHref(ctx,'/contact?sent=1'));
    values=Object.fromEntries(['name','email','subject','body'].map(key=>[key,String(form.get(key)||'').trim()]));
    const {name,email,subject,body}=values;
    if(!name||name.length>100||!validEmail(email)||email.length>254||!subject||subject.length>140||!body||body.length>3000){
      notice='Hubi magaca, iimaylka, cinwaanka iyo farriinta.';
      status=400;
    } else {
      const now=new Date().toISOString();
      const result=await dbRun(db,'INSERT INTO contacts (name,email,subject,body,created_at) SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM contacts WHERE created_at>=?)<100',name,email,subject,body,now,now.slice(0,10));
      if(result.meta.changes) return redirect(editionHref(ctx,'/contact?sent=1'));
      notice='Foomku hadda wuu mashquulsan yahay. Fadlan mar kale isku day ama noo soo dir iimayl.';
      status=429;
    }
  }
  const details=[p.legalName,p.address,p.registration,p.phone].filter(Boolean).map(x=>'<p>'+escape(x)+'</p>').join('');
  const form='<form method="post" action="'+editionHref(ctx,'/contact')+'" class="form">'+field('name',t(ctx,'Magaca','Name'),values.name,'required maxlength="100"')+field('email',t(ctx,'Iimaylka','Email'),values.email,'type="email" required maxlength="254"')+field('subject',t(ctx,'Cinwaanka farriinta','Subject'),values.subject,'required maxlength="140"')+'<div hidden><label>Website<input name="website_confirm" autocomplete="off"></label></div><label>'+t(ctx,'Farriinta','Message')+'<textarea name="body" required maxlength="3000">'+escape(values.body)+'</textarea></label><p class="meta">Waxaan xogtan u adeegsannaa inaan ka jawaabno farriintaada. Akhri <a href="/privacy">siyaasadda asturnaanta</a>.</p><button>'+t(ctx,'Dir farriinta','Send message')+'</button></form>';
  return publisherPage(ctx,t(ctx,'Nala soo xiriir','Contact us'),'<p>'+t(ctx,'Noo soo dir talo war, codsi sixid ama su’aal ku saabsan Zaki News.','Send a news tip, correction, or question for Zaki News.')+'</p>'+(p.email?'<p><a href="'+replyTo(p.email)+'">'+escape(p.email)+'</a></p>':'')+details+message(notice)+form,{status});
}
const policyPages = {
  '/terms':['Shuruudaha isticmaalka','<h2>Isticmaalka bogga</h2><p>Zaki News wuxuu soo bandhigaa warar iyo qoraallo waxbarasho. Fadlan si sharci ah u isticmaal bogga, una tixgeli xuquuqda qoraaga iyo astaamaha ganacsiga.</p><h2>Nuxurka iyo xiriiriyeyaasha</h2><p>Waxaan cusboonaysiin karnaa ama sixi karnaa maqaallada marka xog cusub soo baxdo. Bogagga dibadda waxay leeyihiin shuruudo u gaar ah.</p><p>Wixii su’aal ah, <a href="/contact">nala soo xiriir</a>.</p>'],
  '/disclaimer':['Afeef','<h2>War iyo waxbarasho</h2><p>Nuxurka Zaki News waxaa loogu talagalay xog-bixin iyo waxbarasho. Maqaalladu ma aha talo maaliyadeed, sharci ama canshuureed, mana aha amar lagu iibsado ama lagu iibiyo hanti.</p><h2>Khatarta suuqa</h2><p>Qiimaha crypto si degdeg ah ayuu isu beddeli karaa. Waxaad waayi kartaa qayb ama dhammaan lacagta aad geliso. Xogta suuqa iyo waxqabadkii hore ma dammaanad qaadaan natiijo mustaqbal.</p><h2>Astaamaha</h2><p>Astaamaha hantida waxaa loo adeegsadaa aqoonsi. Muuqashadoodu ma muujinayso iskaashi ama oggolaansho.</p>']
};

const coins = [
  ['btc','Bitcoin'],['eth','Ethereum'],['sol','Solana'],['xrp','XRP'],
  ['bnb','BNB'],['ada','Cardano'],['doge','Dogecoin'],['usdt','Tether']
];
const mark = '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#ff854a"/><path d="M10 11h21L17 27h13v4H9l14-16H10z" fill="#171312"/><path d="M29 7h4v4h-4z" fill="#171312"/></svg>';
function coinStrip() {
  return '<nav class="coin-strip" aria-label="Wararka lacagaha crypto">'+coins.map(([symbol,name])=>{
    return coinChartAnchor(symbol,coinIcon(symbol)+'<span>'+name+'<small>'+symbol.toUpperCase()+'</small></span>');
  }).join('')+'</nav>';
}
function authorPage(ctx) {
  const p = ctx.profile;
  return publisherPage(ctx,p.author||'Qoraaga Zaki News',(p.photo?'<img class="author-photo" src="'+escape(p.photo)+'" alt="'+escape(p.author||'Qoraaga Zaki News')+'">':'')+(p.bio?'<p>'+escape(p.bio)+'</p>':'<p>Qolka wararka ee Zaki News.</p>')+'<nav class="footer-links">'+socials(p)+'</nav><p><a href="/contact">La xiriir qoraaga</a></p>',{noindex:!p.author});
}

function shareLinks(ctx,a) {
  const url = ctx.origin+storyUrl(a);
  const share = encodeURIComponent(a.title+' '+url);
  return '<nav class="footer-links share-links" aria-label="La wadaag maqaalka"><strong>La wadaag</strong>'+publicLink('https://wa.me/?text='+share,'WhatsApp')+publicLink('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(a.title),'Telegram')+publicLink('https://x.com/intent/post?text='+share,'X')+'</nav>';
}

const initialVideos = [{id:'ycoEPHADn28',title:'Suuqa Crypto Ma Soo Kabanayaa Mise Hoos-u-dhac Kale Ayaa Inoo Socda?'}];
const novemberVideoSelection = [
  {
    "id": "3L81B4MQC4k",
    "title": "Sida crypto loga trade gareeyo 🔥😍📈📉#crypto #trading #trader"
  },
  {
    "id": "Fx8bb5ouEAs",
    "title": "FREE CRYPTOCURRENCY COURSE AF SOMALI(FOR BEGINNERS)"
  },
  {
    "id": "6PAQ_QB47Yc",
    "title": "Sidaan lacag uga sameeyay Fomo app (Meme coins trading) 😱"
  },
  {
    "id": "hgE0LSpjCX8",
    "title": "The Ultimate TradingView Tutorial for (Beginners 2025) Af Somali 🎯💡"
  },
  {
    "id": "JHcBXVOcY3c",
    "title": "🔥 Sida Lacag Looga Sameeyo Crypto Adigoo Isticmaalaya Copy Trading"
  },
  {
    "id": "xP7WkThQS0Q",
    "title": "📊 FULL NANSEN TUTORIAL: Sida Loo Raad-raaco Smart money iyo Whales-ka! 🐋(before the pump👀)"
  },
  {
    "id": "PY1GHN0L_cE",
    "title": "SIDA LOO ISTACMALO COINBASE (FOR BEGINNERS)"
  },
  {
    "id": "a45VlAff6ts",
    "title": "Claude AI Course: Baro Sida Loo Isticmaalo Claude AI, Claude Code & Claude Design (A–Z Guide)"
  },
  {
    "id": "lo4ESipDaUw",
    "title": "Sidee Loo Sameeyaa Phantom Wallet: Tallaabo-tallaabo(for beginners)"
  },
  {
    "id": "TM56GLVktPM",
    "title": "Sida Loogu Sameeyo Akoon Cusub Trust Wallet😍"
  },
  {
    "id": "HWjUx7Wve4w",
    "title": "Sida Loo Isticmaalo Ledger Nano X – Cashar Af-Somali (2025 Guide)"
  }
];
async function videoList(db){
  const saved=await dbFirst(db,"SELECT value FROM settings WHERE key='videos-nov19'");
  if(saved)return JSON.parse(saved.value);
  const previous=await dbFirst(db,"SELECT value FROM settings WHERE key='videos'");
  const existing=previous?JSON.parse(previous.value):initialVideos;
  const ids=new Set(novemberVideoSelection.map(video=>video.id));
  return [...novemberVideoSelection,...existing.filter(video=>!ids.has(video.id))];
}
function videosPage(ctx,videos){
  const title=t(ctx,'Muuqaallada','Videos');
  return layout(ctx,title,'<header class="section-title"><h1>'+title+'</h1>'+brandTextLink(ctx.profile.youtube||channel,'Zakariya Academy','academy.png',true,20)+'</header>'+(videos.length?'<section class="video-gallery">'+videos.map(video=>featuredVideo(ctx,video)).join('')+'</section>':'<p>'+t(ctx,'Muuqaallada la xushay halkan ayay ka soo muuqan doonaan.','Selected videos will appear here.')+'</p>'));
}
function youtubeId(raw){
  try{
    const u=new URL(raw);
    if(u.protocol!=='https:')return '';
    const host=u.hostname.replace(/^www\.|^m\./,'');
    const parts=u.pathname.split('/').filter(Boolean);
    const id=host==='youtu.be'?parts[0]:host==='youtube.com'?(u.pathname==='/watch'?u.searchParams.get('v'):['shorts','embed','live'].includes(parts[0])?parts[1]:''):'';
    return /^[\w-]{11}$/.test(id||'')?id:'';
  }catch{return '';}
}
async function videoEditor(ctx,req,db){
  const list=await videoList(db);
  const lines=list.map(video=>video.title+' | https://youtu.be/'+video.id).join('\n');
  let draft=lines;
  let error='';
  if(req.method==='POST'){
    const form=await req.formData();
    draft=String(form.get('videos')??'');
    const next=[];
    for(const line of draft.split(/\r?\n/).filter(line=>line.trim())){
      const split=line.lastIndexOf('|');
      const title=line.slice(0,split).trim();
      const id=youtubeId(line.slice(split+1).trim());
      if(split<1||!title||!id||next.some(video=>video.id===id)){error=t(ctx,'Hubi cinwaanka iyo xiriirka YouTube ee sadar kasta. Ka saar xiriirrada soo noqnoqda.','Each line needs a title and a unique YouTube link.');break;}
      next.push({id,title});
    }
    if(!error){
      await dbRun(db,"INSERT INTO settings (key,value) VALUES ('videos-nov19',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(next));
      return redirect(editionHref(ctx,'/studio?panel=videos&saved=1'));
    }
  }
  return studioPage(ctx,publisherNav+'<form class="form studio-editor" method="post"><h2>'+t(ctx,'Muuqaallada YouTube','YouTube videos')+'</h2>'+message(error||(ctx.url.searchParams.has('saved')?t(ctx,'Waa la daabacay.','Collection published.') : ''))+'<label>'+t(ctx,'Sadar kasta geli cinwaanka iyo xiriirka YouTube, adigoo u kala saaraya |. Muuqaalka ugu horreeya wuxuu ka soo muuqanayaa bogga hore.','Enter one video per line as Title | YouTube link. The first video appears on the homepage.')+'<textarea name="videos" rows="10">'+escape(draft)+'</textarea></label><button>'+t(ctx,'Daabac muuqaallada','Publish videos')+'</button><a href="'+editionHref(ctx,'/videos')+'">'+t(ctx,'Eeg muuqaallada','View videos')+'</a></form>',{status:error?400:200});
}

const resourceGroups = [
  [
    "Wallets and security",
    "Boorsada iyo amniga",
    [
      [
        "Ledger Nano X",
        "https://shop.ledger.com/pages/referral-program?referral_code=9XMZSAM98WHH4",
        "https://ugc.production.linktr.ee/Y52WKnOSPaI78peFJRy1_60262497-D04B-4B73-922C-9956E6BC8507.webp"
      ],
      [
        "Trezor",
        "https://trezor.io/",
        "https://www.google.com/s2/favicons?domain=trezor.io&sz=64"
      ],
      [
        "MetaMask",
        "https://metamask.io/",
        "https://ugc.production.linktr.ee/92ee42f8-2305-4f77-a622-4033ca90c467_IMG-4983.png"
      ],
      [
        "Google Authenticator",
        "https://apps.apple.com/be/app/google-authenticator/id388497605?l=nlAuthenticator",
        "https://ugc.production.linktr.ee/DgiXzRRTubopHdMbUugn_CBB70331-DA1C-401F-8ACF-7A4B2626CCB0.png"
      ],
      [
        "NordVPN",
        "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=124732&url_id=902",
        "https://ugc.production.linktr.ee/8e433494-55c4-407b-92b2-561c8fc68a33_main.png"
      ],
      [
        "Brave",
        "https://brave.com/",
        "https://ugc.production.linktr.ee/eFjjxkYQkynH2QIf0c7N_85CDDC18-469C-47D1-9EF4-35A4D8992A37.png"
      ]
    ]
  ],
  [
    "Trading and analytics",
    "Ganacsiga iyo falanqaynta",
    [
      [
        "FOMO",
        "https://fomo.family/r/zakariyasharif9",
        "https://ugc.production.linktr.ee/d6bd1ee6-7e65-4a1e-8dbb-86d15637a2cd_og-image.png"
      ],
      [
        "Nansen",
        "https://nsn.ai/zakariya",
        "https://ugc.production.linktr.ee/07db43c3-bbe3-4ea9-85bc-1dfe2c7ca0c1_smart-money-og-min.jpeg"
      ],
      [
        "TradingView",
        "https://www.tradingview.com/pricing/?share_your_love=aliveLeopard62948&mobileapp=true",
        "https://ugc.production.linktr.ee/db003026-a24c-418c-9b20-d2ebe0a626ab_image.png"
      ],
      [
        "Axiom",
        "https://axiom.trade/@zakariya1",
        "https://ugc.production.linktr.ee/e3c30833-0862-4bad-be69-dfafeef777b8_social-preview.jpeg"
      ],
      [
        "Padre Terminal",
        "https://trade.padre.gg/rk/zaki",
        "https://ugc.production.linktr.ee/b26a4893-be33-4073-931b-3fd4288c3b3f_built-for-winning.png"
      ],
      [
        "GMGN",
        "https://gmgn.ai/?ref=35Ndq46f&chain=sol",
        "https://ugc.production.linktr.ee/167572d4-0737-469a-81db-a1b5bb1697ae_image.png"
      ],
      [
        "BullX Neo",
        "https://neo.bullx.io/",
        "https://ugc.production.linktr.ee/5251a948-82dd-4318-a564-055898d19523_default.png"
      ],
      [
        "Mofo Bot",
        "https://t.me/mofocopytradingbot?start=ref_ZAKI",
        "https://ugc.production.linktr.ee/e9576533-3bdd-401a-96b0-d9570403150f_iCIUPDmeuqQDyfBnh6E4cWj-e3nl-oOcrJn2dv-NEj7JpaoIsedExF4N2-n9K3QRg8Rp1Gd7GF61ugYE9w76l7ko-XuEDeWEqWtW.jpeg"
      ],
      [
        "Trojan on Solana",
        "https://t.me/solana_trojanbot?start=r-ziiko5",
        "https://ugc.production.linktr.ee/a3ea1542-31ff-4cf0-a165-e3473eeacde2_TVIxUuT2fuhHST6osQ9m0---3VOEIZehVJHE8cQ3zE7NRY-JFeyhUGsqbOA9WFCbg-t4B-wzsj3B71RCXpNSKgU58K--x9KLrz3P.jpeg"
      ],
      [
        "BONKbot",
        "https://t.me/bonkbot_bot?start=ref_qgpf9",
        "https://ugc.production.linktr.ee/224cb203-602f-4112-90ac-526a47d0fe31_image.png"
      ],
      [
        "Nova Bot",
        "https://t.me/TradeonNovaBot?start=r-DNE5JW",
        "https://ugc.production.linktr.ee/ba370dc6-36a1-4113-9356-132ba1d8b5b3_BnAitaegw2MMOHsKWEyssh3jk49XJxO59ZSrOgWPj0n-vweRkYzYOVVrRUEWfxr1tUUioNtkAZngqN-QQojSFL9C-CmmE2fZs5tt.jpeg"
      ],
      [
        "BullX Bot",
        "https://t.me/BullxBetaBot?start=access_4SDNFOH80W5",
        "https://ugc.production.linktr.ee/24e7efef-2449-4fce-b784-53fda1398407_WynGphda6ATSxG6f4EF39nEBk3fqStcP5tu2nqG-tHHU7DFepl0KtNhM3IEskehj7ar3Oc2--K-BtmmVkhomdnYaUBh7Qrv93EZN.jpeg"
      ]
    ]
  ],
  [
    "Exchanges",
    "Sarriflayaasha",
    [
      [
        "Binance",
        "https://accounts.binance.com/register?ref=174394813",
        "https://ugc.production.linktr.ee/IzT3tHx1TCKBwmhUVJo3_3342DF62-7A10-48E8-A57A-6C208BDC2237.png"
      ],
      [
        "Coinbase",
        "https://www.coinbase.com/join/sharif_tp4?src=ios-link",
        "https://ugc.production.linktr.ee/2BMVudvcT7iQ9S1Q8qkc_ECE80ADD-6D80-4447-823A-17CB70B88C27.jpeg"
      ],
      [
        "Bybit",
        "https://partner.bybit.com/b/100664",
        "https://ugc.production.linktr.ee/0HUxoiY7RvKPmVuuc7OF_166D87FD-89CC-4091-A214-429176A43DA0.jpeg"
      ],
      [
        "OKX",
        "https://www.okx.com/join/10464529",
        "https://ugc.production.linktr.ee/L0X2gHLwSsGyOIMzjtd5_41DA863B-84A0-42D1-8A3F-3E933A28C945.png"
      ],
      [
        "Crypto.com",
        "https://crypto.com/app/3nmq3gbgqj",
        "https://ugc.production.linktr.ee/rN5OOv6AS7qsxMR92tlg_0F307B76-2407-44FE-B64A-C0FF366FB92B.png"
      ],
      [
        "Bitvavo",
        "https://bitvavo.com/?a=11CE00C354",
        "https://ugc.production.linktr.ee/ocsZ89D6RLWlqAwz3eTQ_B7B405D7-C0AC-45F6-BFA1-9213594022B4.png"
      ],
      [
        "KuCoin",
        "https://www.kucoin.com/land/register/r/r3PNAPS",
        "https://ugc.production.linktr.ee/mZwwD7sVTh2qOHBPy401_05DB42E8-62F3-47E1-A57B-B1CF41D0F1DE.png"
      ],
      [
        "MEXC",
        "https://www.mexc.com/en-GB/acquisition/custom-sign-up?shareCode=mexc-1aheN",
        "https://ugc.production.linktr.ee/b00dca1b-b85b-4486-adf3-cb58ecc15ef1_IMG-4984.png"
      ],
      [
        "BingX",
        "https://bingx.com/invite/HPAURD",
        "https://ugc.production.linktr.ee/0fb271fa-c722-4d41-b4fd-308b1714305f_IMG-4982.png"
      ],
      [
        "Coinmerce",
        "https://coinmerce.io/r/RM1EFTd1LI",
        "https://ugc.production.linktr.ee/WcooBFJhSXOjuDJvdJgg_C803B4B5-7977-4500-AB55-EB83CD685658.png"
      ],
      [
        "Gate.io",
        "https://www.gate.io/signup/6798054",
        "https://ugc.production.linktr.ee/mHknXb7T4qObFIuTTsA4_5CBCE093-BE32-470E-848E-72CA4496B2C8.png"
      ],
      [
        "CoinEx",
        "https://www.coinex.com/register?refer_code=xtghn",
        "https://ugc.production.linktr.ee/893f079f-db15-4601-a9a9-9357c658f6e6_IMG-5753.png"
      ],
      [
        "LBank",
        "https://www.lbank.com/en-US/login/?icode=KHDU",
        "https://ugc.production.linktr.ee/72c24dfc-9809-4425-9126-3b7907c6a5fa_lbank-2022101119.png"
      ],
      [
        "Rain",
        "https://rain.com/en-be/?ref=NEZEBBX",
        "https://ugc.production.linktr.ee/HMw3b0eoT42RbTE2r1hQ_3B9DF7BC-F69F-4454-949F-942102634AA1.png"
      ]
    ]
  ],
  [
    "Payments and other tools",
    "Lacag-bixinta iyo qalab kale",
    [
      [
        "KAST",
        "https://kastfinance.app.link/TJU0EP3G",
        "https://ugc.production.linktr.ee/147ff83e-76f1-487b-95e1-078454ef00eb_image.png"
      ],
      [
        "RedotPay",
        "https://url.hk/i/en/f1qra",
        "https://ugc.production.linktr.ee/04e423e4-9572-4243-8072-2fad4438f91a_IMG-5569.jpeg"
      ],
      [
        "eToro",
        "https://etoro.tw/3hOEHQn",
        "https://ugc.production.linktr.ee/1R4zGwqROSAs89K4jYGa_C6473F3F-9D58-451B-B378-B8E41DA73F07.png"
      ],
      [
        "Wise",
        "https://wise.com/invite/ih/zakariyaz7",
        "https://ugc.production.linktr.ee/EgEvSXkpRDmi6XLS971M_74C367E0-D4B2-4FD1-8D71-0CE202854174.png"
      ],
      [
        "Revolut",
        "https://revolut.com/referral/zakarihu9z",
        "https://ugc.production.linktr.ee/yAPIVNtGQ6To6JponoGw_revolut-share-preview.jpg"
      ],
      [
        "Unstoppable Domains",
        "https://unstoppabledomains.com/?ref=422bb7ad257d4cf",
        "https://ugc.production.linktr.ee/Lq5Lc5Y9R2ciDK39hgwg_716A149D-B021-43DE-A7C3-2616DA008500.png"
      ],
      [
        "Nexo",
        "https://nexo.io/ref/vboibzmq8k?src=ios-link",
        "https://ugc.production.linktr.ee/g2V9iGCnSQiktPHSq5gl_08D2CFEF-9663-483E-B15E-4AE3D13182FE.jpeg"
      ],
      [
        "Sweatcoin",
        "https://sweatco.in/i/zakariya10",
        "https://ugc.production.linktr.ee/IMI2Jy4SeiYzpq1K7qPJ_98B5FF1A-64F5-4502-9DBF-33346116A63D.jpeg"
      ]
    ]
  ],
  [
    "Zakariya Academy and community",
    "Zakariya Academy iyo bulshada",
    [
      [
        "Zakariya Academy",
        "https://zakariyaacademy.com",
        "https://ugc.production.linktr.ee/76c25b0e-0675-47bd-b860-216f0236a2a9_WhatsApp-Image-2025-02-24-at-00.22.51.jpeg"
      ],
      [
        "YouTube",
        "https://www.youtube.com/@ZakariyaAcademy1?sub_confirmation=1",
        "https://ugc.production.linktr.ee/hYCkLQGzSe4cYIsvPgij_0EC4F20B-F588-4EFC-8D0F-7B3AB676C9E0.png"
      ],
      [
        "X",
        "https://mobile.twitter.com/zakariyasharif9",
        "https://ugc.production.linktr.ee/05214e9f-05f0-4f70-9967-14b8d52e7e4a_IMG-4980.png"
      ],
      [
        "Telegram",
        "https://t.me/+Lcls6GO-X7Q5ZDQ0",
        "https://ugc.production.linktr.ee/wOgc4EjBT3GmjR35y72W_746A856F-FB55-4A70-8FB3-4AF19922397F.jpeg"
      ],
      [
        "Snapchat",
        "https://snapchat.com/t/opFLTdXE",
        "https://assets.production.linktr.ee/tabler-icons/outline/brand-snapchat.svg"
      ],
      [
        "Instagram",
        "https://www.instagram.com/zakariya__sharif/",
        "https://ugc.production.linktr.ee/aKzi1NSORKIXbtkOPpCW_14196AC0-3A6C-4C6E-BFD1-A803CB51A34D.png"
      ],
      [
        "LinkedIn",
        "https://be.linkedin.com/in/zakariyasharif",
        "https://ugc.production.linktr.ee/30d064d9-272a-4c86-933b-809f398fe040_image.png"
      ],
      [
        "Facebook",
        "Https://m.facebook.com/official.zakariya.sharif?ref=bookmarks",
        "https://ugc.production.linktr.ee/Ms7stRoZRDK09oWNgFlA_4525F2F8-312B-4B3B-9B94-45D7FD7B7080.png"
      ]
    ]
  ]
];
function resourceDirectory(ctx){
  const title=t(ctx,'Xiriiriyeyaasha Zakariya','Zakariya’s resource links');
  const sections=resourceGroups.map(([en,so,rows])=>{
    const cards=rows.map(([name,url,icon])=>'<a class="resource-card" href="'+escape(url)+'" rel="sponsored noopener noreferrer"><img src="'+escape(icon)+'" alt="" width="38" height="38" loading="lazy"><span><strong>'+escape(name)+'</strong><small>'+escape(new URL(url).hostname)+'</small></span>'+externalArrowIcon()+'</a>').join('');
    return '<section class="resource-section"><h2>'+escape(t(ctx,so,en))+'</h2><div class="resource-grid">'+cards+'</div></section>';
  }).join('');
  return layout(ctx,title,'<header class="calendar-intro"><h1>'+title+'</h1><p>'+t(ctx,'Qaar ka mid ah xiriiriyeyaashan waa tixraacyo ay Zakariya Academy gunno ka heli karto.','Some links are referrals and may earn Zakariya Academy a commission.')+'</p>'+brandTextLink('https://linktr.ee/Official.zakariya','Zakariya Academy · Linktree','academy.png',true,20)+'</header>'+sections);
}
