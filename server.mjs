import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const host=process.argv.includes('--network')?'0.0.0.0':'127.0.0.1';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const requested=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),absolute=path.resolve(root,requested);
    if(!absolute.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}
    const body=await readFile(absolute);res.writeHead(200,{'Content-Type':types[path.extname(absolute)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found')}
});
server.listen(4173,host,()=>console.log(`LiftLab available at http://${host==='127.0.0.1'?'localhost':host}:4173`));
