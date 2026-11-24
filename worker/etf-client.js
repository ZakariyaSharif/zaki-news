(async function refreshFlows() {
  const board = document.querySelector('[data-etf]');
  if (!board) return;
  const en = document.documentElement.lang === 'en';
  try {
    const response = await fetch('https://farside.co.uk/wp-json/wp/v2/pages?slug='+board.dataset.etf+'&_fields=content',{credentials:'omit',cache:'no-store'});
    if (!response.ok) return;
    const rows = fcParseFlow((await response.json())[0].content.rendered);
    if (rows[0].date < board.dataset.session) return;
    const fmt = new Intl.DateTimeFormat(en?'en-US':'so-SO',{dateStyle:'medium',timeZone:'UTC'});
    const dateLabel = r => fmt.format(new Date(r.date+'T12:00:00Z'))+(r.partial?(en?' · Partial':' · Qayb ahaan'):'');
    const first = rows[0];
    const heading = board.querySelector('h2');
    heading.lastChild.textContent = heading.textContent.split(' · ')[0]+' · '+dateLabel(first);
    const figures = board.querySelectorAll('.fc-figures strong');
    figures[0].textContent=fcMillions(first.inflow);
    figures[1].textContent=fcMillions(first.outflow);
    figures[2].textContent=fcMillions(first.net,true);
    figures[2].className=first.net>=0?'fc-plus':'fc-minus';
    board.querySelector('tbody').innerHTML=rows.map(r=>'<tr><td>'+dateLabel(r)+'</td><td>'+fcMillions(r.inflow)+'</td><td>'+fcMillions(r.outflow)+'</td><td>'+fcRate(r.net)+'</td></tr>').join('');
    board.querySelector('p:last-child').firstChild.textContent=(en?'Source checked':'Isha la hubiyey')+' · '+new Date().toISOString().slice(0,16).replace('T',' ')+' UTC · ';
  } catch {}
})();
