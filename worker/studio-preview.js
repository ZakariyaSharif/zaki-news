const form = document.querySelector('.studio-editor form');
const read = key => form.elements.namedItem(key).value.trim();
const set = (id, value) => { document.getElementById(id).textContent = value; };
const slugify = title => title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,'');
function refresh() {
  const title = read('seo_title') || (read('title') || 'Cinwaanka maqaalka') + ' | Zaki News';
  const description = read('seo_description') || read('summary');
  set('seo-title', title);
  set('seo-description', description || 'Sharraxaadda maqaalka ayaa halkan ka muuqanaysa.');
  set('seo-url', location.origin+'/article/'+(read('slug') || slugify(read('title')) || 'cinwaanka-maqaalka'));
  set('seo-length', 'Cinwaanka raadinta: '+title.length+' xaraf. Isku day 30–60 xaraf.');
  set('seo-summary', 'Sharraxaadda: '+description.length+' xaraf. Isku day 110–160 xaraf.');
  set('seo-heading', /^##\s+\S/m.test(read('body')) ? '✓ Qoraalku wuxuu leeyahay cinwaanno-hoosaadyo.' : 'Ku dar cinwaanno-hoosaadyo halka ay akhriska fududaynayaan.');
}
form.addEventListener('input', refresh);
refresh();
