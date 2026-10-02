const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174';
const server=process.env.TEST_BASE_URL?null:spawn(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','5174','--strictPort'],{cwd:root,stdio:'pipe'});
let serverLog='';server?.stdout.on('data',s=>serverLog+=s);server?.stderr.on('data',s=>serverLog+=s);
const artifactDir=path.join(root,'.artifacts');fs.mkdirSync(artifactDir,{recursive:true});
let browser;let checks=0;
const pass=message=>{checks++;console.log(`PASS ${message}`)};
async function ready(){for(let i=0;i<100;i++){try{const r=await fetch(base);if(r.ok)return}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Server did not start: '+serverLog)}
async function nav(page,id){await page.locator(`.bottom-nav a[href="#${id}"]`).click();await page.waitForTimeout(1400);}
async function runView(viewport,mobile=false){
 const page=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile});const errors=[];const broken=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)broken.push(r.url()+': '+r.status())});
 await page.goto(base,{waitUntil:'networkidle'});await page.locator('.opening').waitFor({state:'detached'});await page.waitForTimeout(1000);
 assert.equal(await page.title(),'Baaz | Structured Arts');assert.equal(await page.locator('main > section').count(),6);assert(await page.evaluate(()=>document.fonts.check('24px Schoolbell')));assert(await page.locator('.hero-video').evaluate(v=>v.readyState>=2));pass(`${mobile?'Mobile':'Desktop'}: portfolio, local fonts, and playable hero video`);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('No horizontal page overflow');
 await page.screenshot({path:path.join(artifactDir,`${mobile?'mobile':'desktop'}-hero.png`)});
 await nav(page,'origin');const coverBefore=await page.locator('.book-cover').evaluate(el=>getComputedStyle(el).transform);await page.mouse.wheel(0,850);await page.waitForTimeout(1600);assert.notEqual(await page.locator('.book-cover').evaluate(el=>getComputedStyle(el).transform),coverBefore);await page.screenshot({path:path.join(artifactDir,`${mobile?'mobile':'desktop'}-origin.png`)});pass('Scroll-driven book opening');
 await nav(page,'projects');
 for(let i=0;i<4;i++){const card=page.locator(`[data-project="${i}"]`);await card.click({position:{x:75,y:55}});assert(await page.locator('#detail-dialog').evaluate(d=>d.open));assert(await page.locator('#dialog-title').innerText());assert.equal(await page.locator('.project-detail .stats > div').count(),3);await page.keyboard.press('Escape');assert.equal(await page.locator('#detail-dialog').evaluate(d=>d.open),false);}
 pass('All four project details open; Escape closes each dialog');await page.screenshot({path:path.join(artifactDir,`${mobile?'mobile':'desktop'}-projects.png`)});
 await nav(page,'best-work');await page.screenshot({path:path.join(artifactDir,`${mobile?'mobile':'desktop'}-metro-gate.png`)});assert(await page.locator('.metro-interior').evaluate(el=>el.inert));await page.locator('#metro-enter').click();await page.waitForTimeout(1100);assert.equal(await page.locator('.metro-gate').evaluate(el=>getComputedStyle(el).visibility),'hidden');
 for(let i=0;i<5;i++){await page.locator(`[data-station="${i}"]`).click();assert.equal(await page.locator('#station-counter').innerText(),`${String(i+1).padStart(2,'0')} / 05`);assert.equal(await page.locator('[data-station][aria-pressed="true"]').count(),1);assert.equal(await page.locator('#station-content .stats > div').count(),3);await page.locator('.station-detail').click();assert.equal(await page.locator('.case-point').count(),3);await page.locator('.dialog-close').click();}
 await page.locator('#station-next').click();assert.equal(await page.locator('#station-counter').innerText(),'01 / 05');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#station-counter').innerText(),'02 / 05');pass('Metro doors, five stations, case studies, cyclic controls, and arrow keys');await nav(page,'best-work');await page.waitForTimeout(600);await page.screenshot({path:path.join(artifactDir,`${mobile?'mobile':'desktop'}-metro-interior.png`)});
 await page.locator('#metro-exit').click();assert(await page.locator('.metro-interior').evaluate(el=>el.inert));pass('Return to platform restores the Metro entrance');
 await nav(page,'visuals');if(!mobile){const r=await page.locator('.visuals').boundingBox();await page.mouse.move(r.x+200,r.y+220);await page.mouse.move(r.x+430,r.y+350);assert(await page.locator('#image-trail img').count()>0);pass('Artwork cursor trail renders images');}
 await page.locator('#gallery-open').click();assert.equal(await page.locator('.art-grid figure').count(),12);await page.locator('#detail-dialog').hover();await page.mouse.wheel(0,600);await page.waitForTimeout(400);assert(await page.locator('#detail-dialog').evaluate(d=>d.scrollTop>0));await page.keyboard.press('Escape');pass('Twelve-piece artwork gallery opens, scrolls, and closes');
 await nav(page,'contact');assert.equal(await page.locator('.email-link').getAttribute('href'),'mailto:bajkamalsingh1@gmail.com');assert.equal(await page.locator('.social-links a[target="_blank"]').count(),2);await page.locator('#sound-toggle').click();assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'),'true');await page.locator('#sound-toggle').click();assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'),'false');pass('Contact links and opt-in sound controls');
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);pass('No browser runtime errors or failed asset responses');await page.close();
}
(async()=>{try{await ready();browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});await runView({width:1440,height:1000});await runView({width:390,height:844},true);const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.goto(base,{waitUntil:'networkidle'});assert.equal(await p.locator('.opening').count(),0);assert.equal(await p.locator('.cursor').evaluate(e=>getComputedStyle(e).display),'none');await nav(p,'projects');await p.locator('[data-project="0"]').click({position:{x:75,y:55}});assert(await p.locator('#detail-dialog').evaluate(d=>d.open));pass('Reduced-motion mode keeps project interactions available');await p.close();console.log(`\n${checks} functional checks passed. Screenshots: .artifacts/`)}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server?.kill('SIGTERM')}})();
