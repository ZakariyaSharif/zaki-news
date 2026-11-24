import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readdirSync,readFileSync} from 'node:fs';
import {serve} from './serve.mjs';
import {database} from './database.mjs';
mkdirSync('.local',{recursive:true});
const sqlite=new DatabaseSync('.local/news.sqlite');
sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const file of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){
  if(sqlite.prepare('SELECT name FROM local_migrations WHERE name=?').get(file)) continue;
  sqlite.exec('BEGIN');
  try{
    sqlite.exec(readFileSync('drizzle/'+file,'utf8'));
    sqlite.prepare('INSERT INTO local_migrations VALUES (?)').run(file);
    sqlite.exec('COMMIT');
  }catch(error){sqlite.exec('ROLLBACK');throw error;}
}
const db=database(async(sql,params)=>{
  const statement=sqlite.prepare(sql);
  if(statement.columns().length) return {results:statement.all(...params),meta:{changes:0}};
  return {results:[],meta:{changes:statement.run(...params).changes}};
});
const port=Number(process.env.PORT||3000);
createServer((req,res)=>serve(req,res,db,process.env.SITE_ORIGIN||'http://localhost:'+port)).listen(port,'127.0.0.1',()=>console.log('http://localhost:'+port));
