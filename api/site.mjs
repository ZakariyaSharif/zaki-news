import {resolveDatabase} from '../runtime/database.mjs';
import {requestSiteOrigin} from '../runtime/origin.mjs';
import {serve} from '../runtime/serve.mjs';
export const config={api:{bodyParser:false}};
export default function handler(req,res) {
  const origin=requestSiteOrigin(req,process.env);
  const route=new URL(req.url,origin);
  const path=route.searchParams.get('__zaki_path');
  if(path!==null){
    route.searchParams.delete('__zaki_path');
    if(!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {res.writeHead(400).end();return;}
    route.pathname=path;
    req.url=route.pathname+route.search;
  }
  return serve(req,res,resolveDatabase(process.env),origin);
}
