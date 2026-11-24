function optionsPanel(ctx) {
  const names = { SPX:'S&P 500 Index', SPY:'SPDR S&P 500 ETF', NDX:'Nasdaq-100 Index', QQQ:'Invesco QQQ Trust' };
  const requested = ctx.url.searchParams.get('underlying');
  const symbol = Object.hasOwn(names, requested) ? requested : 'SPX';
  const tt = (so,en) => t(ctx,so,en);
  const buttons = Object.keys(names).map(key => '<a href="'+editionHref(ctx,'/markets?asset=options&underlying='+key)+'"'+(key===symbol?' aria-current="page"':'')+'>'+key+'</a>').join('');
  const definitions = [
    ['Call wall','Qiimaha fulinta ee leh isku-ururka gamma ee call-yada.','A strike with a concentration of call gamma.'],
    ['Put wall','Qiimaha fulinta ee leh isku-ururka gamma ee put-yada.','A strike with a concentration of put gamma.'],
    ['Gamma flip','Heerka ay qiyaasta gamma guud calaamadda ku beddesho.','The level where estimated net gamma changes sign.']
  ].map(([term,so,en])=>'<div><dt>'+term+'</dt><dd>'+tt(so,en)+'</dd></div>').join('');
  const chain = 'https://www.cboe.com/delayed_quotes/'+symbol.toLowerCase()+'/quote_table';
  const src = 'https://zerogex.io/embed/image/'+symbol+'.png';
  return '<section class="opt-board"><header><div><h2>'+tt('Suuqa options-ka','Options market')+'</h2><p>'+names[symbol]+'</p></div><nav class="calendar-tabs" aria-label="'+tt('Dooro suuqa','Choose underlying')+'">'+buttons+'</nav></header><div class="opt-layout"><figure><img src="/images/options-'+symbol.toLowerCase()+'.webp" data-options-image="'+src+'" width="1200" height="630" alt="'+symbol+' · '+tt('Jaantuska gamma iyo heerarka call iyo put','Gamma profile with call and put levels')+'"><figcaption>'+publicLink('https://zerogex.io/embed/'+symbol,'ZeroGEX ↗')+' · '+tt('Waqtiga xogtu wuxuu ku qoran yahay jaantuska.','Observation time is printed on the chart.')+'</figcaption></figure><aside><h3>'+tt('Heerarka gamma','Gamma levels')+'</h3><dl>'+definitions+'</dl><h3>'+tt('Silsiladda qandaraasyada','Options chain')+'</h3><p>'+tt('Ka dooro Cboe taariikhda dhicitaanka si aad u aragto qiimaha fulinta iyo dalabyada iibka iyo iibinta.','Choose an expiration on Cboe to see strikes, bids and asks.')+'</p>'+publicLink(chain,tt('Eeg silsiladda','View chain')+' · '+symbol+' ↗')+'</aside></div></section>';
}
