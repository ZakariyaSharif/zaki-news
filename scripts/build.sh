#!/usr/bin/env bash
set -euo pipefail
rm -rf dist
mkdir -p dist/server dist/.openai
cp .openai/hosting.json dist/.openai/
python3 - <<'PY'
import base64,json,pathlib,hashlib
w=pathlib.Path('worker')
images={p.name:base64.b64encode(p.read_bytes()).decode() for p in (w/'images').glob('*.webp')}
assets='const css='+json.dumps((w/'style.css').read_text())+';\nconst images='+json.dumps(images)+';\n'
assets+='const styleVersion='+json.dumps(hashlib.sha256((w/'style.css').read_bytes()).hexdigest()[:12])+';\n'
assets+='const coinAssets='+json.dumps({p.name:base64.b64encode(p.read_bytes()).decode() for p in (w/'coins').glob('*') if p.suffix in ('.svg','.png')})+';\n'
assets+='const brandAssets='+json.dumps({p.name:base64.b64encode(p.read_bytes()).decode() for p in (w/'brands').glob('*') if p.suffix in ('.svg','.png')})+';\n'
assets+='const studioScript='+json.dumps((w/'studio-preview.js').read_text())+';\n'
assets+='const etfClient='+json.dumps((w/'etf-client.js').read_text())+';\n'
tv_links=(w/'tv-links.js').read_text()+'\n'
assets+='const marketScript='+json.dumps(tv_links+(w/'market-client.js').read_text())+';\n'
assets+='const editorialScript='+json.dumps(tv_links+(w/'editorial-client.js').read_text())+';\n'
assets+='const socialAssets='+json.dumps({p.stem:base64.b64encode(p.read_bytes()).decode() for p in (w/'social').glob('*.svg')})+';\n'
liquidation_logos={p.stem.upper():'/coin-logo/'+p.name for p in sorted((w/'coins').glob('*'),key=lambda p:p.suffix) if p.suffix in ('.svg','.png')}
assets+='const terminalScript='+json.dumps('const liquidationLogos='+json.dumps(liquidation_logos)+';\n'+tv_links+(w/'terminal-client.js').read_text()+'\n'+(w/'scenario-client.js').read_text())+';\n'
assets+='const historicDebt='+str((w/'debt-history.json').read_text()).strip()+';\n'
assets+='const liquidationSeed='+(w/'liquidation-seed.json').read_text().strip()+';\n'
assets+='const fxSnapshot='+(w/'fx-snapshot.json').read_text().strip()+';\n'
assets+='const sentimentSnapshot='+(w/'sentiment-snapshot.json').read_text().strip()+';\n'
assets+='const scenarioSeed='+(w/'scenario-seed.json').read_text()+';\n'
assets+='const flowReference='+(w/'flow-reference.json').read_text()+';\n'
assets+='const weeklyHistory='+(w/'weekly-history.json').read_text().strip()+';\n'
stories=(w/'stories.js').read_text().replace('export const','const')
entry='\n'.join((w/'index.js').read_text().splitlines()[2:])
pathlib.Path('dist/server/index.js').write_text(assets+stories+'\n'+entry+'\n'+(w/'publisher.js').read_text()+'\n'+(w/'tv-links.js').read_text()+'\n'+(w/'editions.js').read_text()+'\n'+(w/'markets.js').read_text()+'\n'+(w/'terminal.js').read_text()+'\n'+(w/'calendar.js').read_text()+'\n'+(w/'liquidation-history.js').read_text()+'\n'+(w/'traditional-markets.js').read_text()+'\n'+(w/'market-directory.js').read_text()+'\n'+(w/'education-stories.js').read_text()+'\n'+'\n'.join((w/f).read_text() for f in ['flows-calendars.js','ipo.js','contract-quotes.js','sovereign-quotes.js','quote-board.js','options.js','beginner.js','news-nov21.js'])+'\n')
PY
