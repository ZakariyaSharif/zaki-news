import {createHash,timingSafeEqual} from 'node:crypto';
import app from '../dist/server/index.js';
const digest = value => createHash('sha256').update(value).digest();
export async function serve(req,res,db,origin) {
  try {
    const url = new URL(req.url,origin);
    if (url.origin !== new URL(origin).origin) {res.writeHead(400).end();return;}
    const headers = new Headers();
    for (const [key,value] of Object.entries(req.headers)) {
      if (value && !key.startsWith('oai-') && !['host','authorization','transfer-encoding','content-length'].includes(key)) headers.set(key,String(value));
    }
    if (['/admin','/studio'].includes(url.pathname)) {
      const email = process.env.NEWSROOM_OWNER_EMAIL;
      const password = process.env.NEWSROOM_ADMIN_PASSWORD;
      if (!email || !password) {res.writeHead(403).end('Newsroom is disabled');return;}
      const expected = 'Basic '+Buffer.from(email+':'+password).toString('base64');
      if (!timingSafeEqual(digest(req.headers.authorization||''),digest(expected))) {
        res.writeHead(401,{'WWW-Authenticate':'Basic realm="Zaki News newsroom", charset="UTF-8"','Cache-Control':'no-store'}).end();return;
      }
      headers.set('oai-authenticated-user-id','newsroom-owner');
      headers.set('oai-authenticated-user-email',email);
    }
    let body;
    if (!['GET','HEAD'].includes(req.method)) {
      const chunks=[];let bytes=0;
      for await (const chunk of req) {
        bytes+=chunk.length;
        if (bytes>300000) {res.writeHead(413).end();return;}
        chunks.push(chunk);
      }
      body=Buffer.concat(chunks);
    }
    const response=await app.fetch(new Request(url,{method:req.method,headers,body}),{...process.env,DB:db},{});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('Zaki News request failed',error.name);
    if (!res.headersSent) res.writeHead(500);
    res.end('Request could not be completed');
  }
}
