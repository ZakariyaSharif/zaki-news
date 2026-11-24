import {readFileSync,writeFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const source=readFileSync('dist/server/index.js','utf8');
const code=source+'\nexport const editorial=[...novemberMarketStories,...educationStories,...screeningStories,...samples,...englishSamples];';
const {editorial}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
writeFileSync('data/bundled-articles.json',JSON.stringify(editorial,null,2)+'\n');
if(process.argv.includes('--local')){
  const db=new DatabaseSync('.local/news.sqlite',{readOnly:true});
  writeFileSync('data/newsroom-articles.json',JSON.stringify(db.prepare('SELECT * FROM articles ORDER BY slug').all(),null,2)+'\n');
}
console.log(editorial.length+' bundled articles');
