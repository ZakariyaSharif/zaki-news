#!/usr/bin/env node
// Verify that each article appears only once on the SO and EN homepages.
const origin = process.argv[2] || 'http://127.0.0.1:3061';

function homepageArticleCards(html){
  const cards=[];
  const hero=html.match(/class="ed-hero-copy"[\s\S]*?<h1><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  if(hero) cards.push({section:'hero', href:hero[1], title:hero[2].replace(/<[^>]+>/g,'').trim()});
  const latest=html.match(/class="ed-latest"[\s\S]*?<\/ul>/);
  if(latest){
    for(const m of latest[0].matchAll(/<li><a href="([^"]+)"[\s\S]*?<h3>([\s\S]*?)<\/h3>/g)){
      cards.push({section:'latest', href:m[1], title:m[2].replace(/<[^>]+>/g,'').trim()});
    }
  }
  for(const band of html.matchAll(/<section class="ed-cat-band"([^>]*)>([\s\S]*?)<\/section>/g)){
    const id=(band[1].match(/data-section="([^"]+)"/)||[])[1]||'section';
    const count=(band[1].match(/data-count="([^"]+)"/)||[])[1];
    const title=(band[2].match(/<h2>([^<]+)<\/h2>/)||[])[1]||id;
    for(const m of band[2].matchAll(/<a class="ed-(feature|mini)" href="([^"]+)"[\s\S]*?<h3>([\s\S]*?)<\/h3>/g)){
      cards.push({section:id, sectionTitle:title, count, role:m[1], href:m[2], title:m[3].replace(/<[^>]+>/g,'').trim()});
    }
  }
  return cards;
}

async function inspect(path){
  const res=await fetch(origin+path);
  if(!res.ok) throw new Error(path+' '+res.status);
  const html=await res.text();
  const cards=homepageArticleCards(html);
  const hrefs=cards.map(c=>c.href);
  const dupes=hrefs.filter((href,i)=>hrefs.indexOf(href)!==i);
  const hero=html.match(/<section class="ed-hero"[\s\S]*?<\/section>/);
  const heroHeadings=hero?[...hero[0].matchAll(/<h[1-3]\b/g)].length:0;
  const bands=[...html.matchAll(/<section class="ed-cat-band"([^>]*)>[\s\S]*?<h2>([^<]+)<\/h2>/g)].map(m=>({
    id:(m[1].match(/data-section="([^"]+)"/)||[])[1],
    count:Number((m[1].match(/data-count="([^"]+)"/)||[])[1]||0),
    title:m[2]
  }));
  return {path, cards, dupes:[...new Set(dupes)], heroHeadings, bands, total:cards.length};
}

const expectedSections=['crypto','markets','bitcoin','ethereum','stocks','economy','technology','sharia','guides'];
const reports=[];
for(const path of ['/','/?lang=en']){
  const report=await inspect(path);
  reports.push(report);
  console.log('\n==='+path+'===');
  console.log('cards', report.total, 'hero headings', report.heroHeadings);
  const by=new Map();
  for(const c of report.cards){
    const key=c.section;
    if(!by.has(key)) by.set(key, []);
    by.get(key).push(c.title);
  }
  for(const [section, titles] of by){
    console.log('  '+section+' ('+titles.length+'): '+titles.map(t=>t.slice(0,72)).join(' | '));
  }
  const present=new Set(report.bands.map(b=>b.id));
  const hidden=expectedSections.filter(id=>!present.has(id));
  const short=report.bands.filter(b=>b.count<5);
  if(hidden.length) console.log('  hidden:', hidden.join(', '));
  if(short.length) console.log('  fewer than 5:', short.map(b=>b.id+'='+b.count).join(', '));
  if(report.dupes.length) console.log('  DUPES', report.dupes);
  if(report.heroHeadings!==1) console.log('  HERO HEADING COUNT', report.heroHeadings);
}

const failed=reports.filter(r=>r.dupes.length||r.heroHeadings!==1);
if(failed.length){
  console.error('\nFAILED');
  process.exit(1);
}
console.log('\nOK: no repeated article hrefs, one hero headline per homepage');
