const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function option(name,fallback){const index=process.argv.indexOf(name);return index<0?fallback:process.argv[index+1];}
const host=option('--host','0.0.0.0'),port=Number(option('--port','5173'));
const directory=option('--dir',null);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Invalid URL');}
 const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
 const candidateRoots=directory?[path.resolve(root,directory)]:relative==='index.html'?[root]:[path.join(root,'public')];
 let file;
 for(const base of candidateRoots){const candidate=path.resolve(base,relative);if(candidate!==base&&!candidate.startsWith(base+path.sep))continue;if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile()){file=candidate;break;}}
 if(!file){res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Not found');}
 const stat=fs.statSync(file),type=mime[path.extname(file).toLowerCase()]||'application/octet-stream';
 let start=0,end=stat.size-1,status=200;
 if(req.headers.range){const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!match){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${stat.size}`);}
 res.writeHead(status,{'Content-Type':type,'Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-cache'});
 if(req.method==='HEAD')return res.end();
 const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,host,()=>console.log(`Serving ${directory||'the original page'} on ${host}:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
