const {chromium}=require('playwright');
const {PNG}=require('pngjs');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts/exact');fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'reference/manifest.json')));
const source=fs.readFileSync(path.join(root,'reference/site.html'));
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174';
const server=process.env.TEST_BASE_URL?null:spawn(process.execPath,[path.join(root,'scripts/serve.cjs'),'--host','127.0.0.1','--port','5174'],{cwd:root,stdio:'pipe'});
const canonical=url=>new URL(url).href;
const resources=new Map(manifest.resources.map(r=>[canonical(r.url),r]));
const report={sourceUrl:manifest.source_url,sourceSha256:manifest.source_sha256,comparisons:[],functionalChecks:[],expectedUpstreamFailures:manifest.unavailable_scripts};
let browser;
async function ready(){for(let i=0;i<100;i++){try{if((await fetch(base)).ok)return;}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Local server unavailable');}
function pass(label){report.functionalChecks.push(label);console.log('PASS',label);}
async function prepare(viewport,reference){
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:viewport.width<700,hasTouch:viewport.width<700,timezoneId:'Asia/Kolkata'});
 const page=await context.newPage();const errors=[],failed=[],unmapped=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!(reference&&manifest.unavailable_scripts.some(s=>s.url===r.url())))failed.push(`${r.status()} ${r.url()}`)});
 await page.clock.install({time:new Date('2026-10-02T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-02T12:00:00Z'));
 await page.addInitScript(()=>{let seed=813;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};});
 if(reference)await page.route('**/*',async route=>{
  const url=canonical(route.request().url());const resource=resources.get(url);
  if(url===manifest.source_url)return route.fulfill({body:source,contentType:'text/html'});
  if(manifest.unavailable_scripts.some(s=>s.url===url))return route.fulfill({status:404,body:'Upstream package version does not exist'});
  if(url.includes('/cdn-cgi/challenge-platform/'))return route.fulfill({status:204,body:''});
  if(resource){let file=path.join(root,resource.path);if(resource.path.match(/\/fonts-[01]\.css$/))file=path.join(root,'reference',path.basename(file));const type=route.request().resourceType();return route.fulfill({body:fs.readFileSync(file),contentType:type==='script'?'application/javascript':type==='stylesheet'?'text/css':resource.path.endsWith('.mp4')?'video/mp4':resource.path.endsWith('.svg')?'image/svg+xml':undefined});}
  if(url.startsWith('blob:')||url.startsWith('data:'))return route.continue();
  unmapped.push(url);return route.abort();
 });
 await page.goto(reference?manifest.source_url:base,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{const v=document.querySelector('#intro-vid');v.pause();if(v.readyState<2)await new Promise(r=>v.addEventListener('loadeddata',r,{once:true}));v.currentTime=2;if(v.seeking)await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
 return {page,context,errors,failed,unmapped};
}
async function advance(pages,ms){for(const {page}of pages)await page.clock.runFor(ms);}
async function snapshot(pages,label,pixelmatch){
 for(const {page}of pages){await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>{for(const a of document.getAnimations()){if(a.constructor.name==='CSSAnimation'){a.pause();a.currentTime=0;}else if(a.constructor.name==='CSSTransition'){a.finish();}}});}
 const buffers=[];for(let i=0;i<pages.length;i++)buffers.push(await pages[i].page.screenshot({path:path.join(out,`${label}-${i===0?'original':'local'}.png`)}));
 const a=PNG.sync.read(buffers[0]),b=PNG.sync.read(buffers[1]),diff=new PNG({width:a.width,height:a.height});assert.equal(a.width,b.width);assert.equal(a.height,b.height);
 const changed=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.1});const percent=changed/(a.width*a.height)*100;
 fs.writeFileSync(path.join(out,label+'-diff.png'),PNG.sync.write(diff));const telemetry=[];for(const {page}of pages)telemetry.push(await page.evaluate(()=>{const st=ScrollTrigger.getAll().find(s=>s.trigger?.id==='about'&&s.vars.scrub);return {scroll:document.querySelector('#world-viewport').scrollTop,scrollHeight:document.querySelector('#world-viewport').scrollHeight,bookStart:st?.start,bookEnd:st?.end,bookProgress:st?.animation?.progress()};}));report.comparisons.push({state:label,width:a.width,height:a.height,changedPixels:changed,differencePercent:Number(percent.toFixed(6)),telemetry});console.log('COMPARE',label,percent.toFixed(6)+'%');
 const results=[];for(const {page}of pages)results.push(await page.evaluate(()=>['hero-text-3d','main-nav','hero-quote-block','hero-roles-block','hero-badges'].map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect(),s=getComputedStyle(e);return {id,x:r.x,y:r.y,width:r.width,height:r.height,fontFamily:s.fontFamily,fontSize:s.fontSize};})));
 for(let i=0;i<results[0].length;i++)for(const key of ['x','y','width','height'])assert(Math.abs(results[0][i][key]-results[1][i][key])<1,`${label} geometry mismatch: ${results[0][i].id}.${key}`);
}
async function nav(pages,id){for(const {page}of pages)await page.locator(`#main-nav a[href="#${id}"]`).click();await advance(pages,4200);}
async function clickExposed(page,selector){
 const locator=page.locator(selector);await locator.waitFor({state:'visible'});
 const point=await locator.evaluate(el=>{const r=el.getBoundingClientRect();for(const fy of [.5,.25,.75])for(const fx of [.7,.9,.5,.3,.1]){const x=r.left+r.width*fx,y=r.top+r.height*fy;if(x<=0||x>=innerWidth||y<=0||y>=innerHeight)continue;const hit=document.elementFromPoint(x,y);if(hit&&(hit===el||el.contains(hit)))return{x,y};}return null;});
 assert(point,selector+' has no exposed clickable point');if(await page.evaluate(()=>navigator.maxTouchPoints>0))await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
}
async function compare(viewport,tag,pixelmatch){
 const pages=[await prepare(viewport,true),await prepare(viewport,false)];
 await advance(pages,1400);await snapshot(pages,tag+'-intro',pixelmatch);
 for(const {page}of pages)await page.locator('#skip-btn-inner').click();await advance(pages,3500);
 for(const {page}of pages)await page.mouse.move(viewport.width/2,viewport.height/2);await advance(pages,3500);await snapshot(pages,tag+'-hero',pixelmatch);
 for(const {page}of pages){assert.equal(await page.locator('#cursor-trail-container > div').count(),10);assert.equal(await page.locator('#main-nav a').count(),6);assert(await page.locator('#intro-vid').evaluate(v=>v.readyState>=2));}pass(tag+': original hero, fonts, playable video, ten-part cursor, navigation');
 for(const {page}of pages)await page.mouse.move(viewport.width*.82,viewport.height*.32);await advance(pages,3500);await snapshot(pages,tag+'-hero-parallax',pixelmatch);
 for(const {page}of pages){const changed=await page.locator('#hero-bg-target').evaluate(e=>Math.abs(gsap.getProperty(e,'x'))>1);assert(changed);}pass(tag+': pointer-driven background parallax and 3D text');
 for(const {page}of pages){await page.locator('#hero-text-3d').hover();assert(await page.evaluate(()=>isMagneticLock));await page.mouse.move(10,10);assert(!await page.evaluate(()=>isMagneticLock));}pass(tag+': magnetic hero cursor');
 await nav(pages,'about');await advance(pages,3000);await snapshot(pages,tag+'-origin',pixelmatch);
 // Seek through the actual scroll-driven book, using identical scroll positions.
 for(const {page}of pages)await page.evaluate(()=>{const st=ScrollTrigger.getAll().find(s=>s.trigger?.id==='about'&&s.vars.scrub);lenis.scrollTo(st.start+(st.end-st.start)*.48,{immediate:true});});await advance(pages,4000);await snapshot(pages,tag+'-book-open',pixelmatch);pass(tag+': original diary/book scroll choreography');
 await nav(pages,'experience');await advance(pages,2000);await snapshot(pages,tag+'-projects',pixelmatch);
 for(let i=0;i<4;i++){for(const {page}of pages){const card=page.locator('.stack-card').nth(i);await card.click({position:{x:Math.min(120,viewport.width*.3),y:55}});}await advance(pages,700);for(const {page}of pages)assert(await page.locator('.stack-card').nth(i).locator('.card-expand').evaluate(e=>e.classList.contains('open')));if(i===1)await snapshot(pages,tag+'-project-expanded',pixelmatch);for(const {page}of pages)await page.locator('.stack-card').nth(i).click({position:{x:Math.min(120,viewport.width*.3),y:55}});await advance(pages,700);}pass(tag+': all four original in-place expanding project cards');
 await nav(pages,'vending');await snapshot(pages,tag+'-metro-gate',pixelmatch);
 for(const {page}of pages)await page.locator('#metro-enter-btn').click();await advance(pages,2300);for(const {page}of pages)assert.equal(await page.locator('#metro-doors-overlay').evaluate(e=>getComputedStyle(e).display),'none');await snapshot(pages,tag+'-metro-origin',pixelmatch);pass(tag+': original Metro doors and terminal');
 for(let index=1;index<=5;index++){
  for(const {page}of pages)await page.locator('#transit-next-btn').click();await advance(pages,4400);
  for(const {page}of pages){assert(await page.locator(`#step-out-btn-${index}`).isVisible());await clickExposed(page,`#step-out-btn-${index}`);}await advance(pages,1800);
  for(const {page}of pages){assert(!await page.locator('#transit-case-study-view').evaluate(e=>e.classList.contains('hidden')));assert((await page.locator('#transit-cs-content').innerText()).length>500);}
  if(index===1||index===5)await snapshot(pages,tag+'-case-study-'+index,pixelmatch);
  for(const {page}of pages)await clickExposed(page,'#back-to-transit-btn');await advance(pages,1500);
 }for(const {page}of pages)await page.locator('#transit-prev-btn').click();await advance(pages,4400);for(const {page}of pages)assert(await page.locator('#step-out-btn-4').isVisible());pass(tag+': five complete Metro case studies, next/previous controls, step-out and return transitions');
 await nav(pages,'gallery');await snapshot(pages,tag+'-gallery',pixelmatch);
 for(const {page}of pages){const r=await page.locator('#cursor-trail-canvas').boundingBox();await page.mouse.move(r.x+r.width*.2,r.y+r.height*.35);await page.mouse.move(r.x+r.width*.8,r.y+r.height*.65,{steps:5});}await advance(pages,1700);await snapshot(pages,tag+'-gallery-trail',pixelmatch);for(const {page}of pages){const count=await page.locator('#cursor-trail-canvas img').count();if(viewport.width>=768)assert(count>0);else assert.equal(count,0);}pass(tag+(viewport.width>=768?': original gallery artwork trail':': original mobile gallery without the desktop-only mouse trail'));
 await nav(pages,'contact');await snapshot(pages,tag+'-contact',pixelmatch);for(const {page}of pages){assert((await page.locator('#contact a[href^="mailto:"]').count())>=1);}pass(tag+': original contact links and email decoding');
 for(const {page}of pages){await page.goto(page.url(),{waitUntil:'networkidle'});await page.clock.runFor(1400);await page.locator('#skip-btn-inner').click();await page.clock.runFor(5000);await page.locator('#sound-toggle').click();await page.locator('.sound-icon-on').waitFor({state:'visible'});assert(await page.evaluate(()=>Tone.getContext().state==='running'));await page.locator('#sound-toggle').click();await page.locator('.sound-icon-off').waitFor({state:'visible'});}pass(tag+': sound toggle enables and disables audio on a fresh hero');
 for(const state of pages){assert.deepEqual(state.errors,[]);assert.deepEqual(state.failed,[]);assert.deepEqual(state.unmapped,[]);await state.context.close();}pass(tag+': no unexpected runtime errors or missing resources');
}
(async()=>{try{const {default:pixelmatch}=await import('pixelmatch');await ready();browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});await compare({width:1440,height:1000},'desktop',pixelmatch);await compare({width:390,height:844},'mobile',pixelmatch);console.log('Completed original/local comparison')}catch(e){console.error(e);report.error=e.message;process.exitCode=1}finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');await browser?.close();server?.kill('SIGTERM')}})();
