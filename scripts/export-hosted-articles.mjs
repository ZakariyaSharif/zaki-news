import {writeFileSync} from 'node:fs';
import {hostedDatabase} from '../runtime/database.mjs';
const db=hostedDatabase(process.env);
const articles=[];
let after='';
while(true){
  const page=(await db.prepare('SELECT * FROM articles WHERE slug > ? ORDER BY slug LIMIT 25').bind(after).all()).results;
  articles.push(...page);
  if(page.length<25)break;
  after=page.at(-1).slug;
}
writeFileSync('data/newsroom-articles.json',JSON.stringify(articles,null,2)+'\n');
console.log('Exported '+articles.length+' newsroom articles, including drafts.');
