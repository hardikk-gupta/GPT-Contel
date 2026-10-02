import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import Lenis from '@studio-freight/lenis';
import {projects, stations, artworks} from './data';
gsap.registerPlugin(ScrollTrigger, Draggable);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const asset = name => `/assets/${encodeURIComponent(name)}`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>`;
const stats = items => `<div class="stats">${items.map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>`;
const navItems = [['hero','Home'],['origin','Origin'],['projects','Projects'],['best-work','Best Work'],['visuals','Visuals'],['contact','Contact']];
document.querySelector('#app').innerHTML = `
  <div class="opening" aria-hidden="true"><div class="opening-grid"></div><span class="opening-note">A LITTLE CHAOS. A LOT OF INTENTION.</span><div class="opening-title">I <i>Intentionally</i><br>make Misalignment<br>look <span>Intentional.</span></div><span class="opening-bottom"><b class="live-dot"></b> STRUCTURED ARTS — VOL.2026</span><button class="opening-skip" tabindex="-1">Skip intro ↗</button></div>
  <header class="status-bar"><a href="#hero">Bajkamal Singh AKA Baaz</a><p>Started as a designer. Ended up leading creative teams.</p><div class="read-progress"><span class="progress-fill"></span><span>You've seen</span><b id="progress-label">0%</b></div></header>
  <main>
    <section id="hero" class="hero">
      <video class="hero-video" src="${asset('1778536504558493.mp4')}" muted autoplay playsinline loop poster="${asset('diarypic.png')}"></video><div class="hero-shade"></div><div class="grain"></div>
      <div class="location-sticker tape"><strong>SRCC '27</strong><span>Delhi, India</span></div>
      <div class="night-note"><p>Creative by night,</p><div>more creative<br>by <mark>midnight.</mark></div><svg class="night-graph" viewBox="0 0 180 110" fill="none" aria-hidden="true"><path d="M12 15v68h110" stroke="currentColor"/><path d="M14 72c42 1 82-13 141-55" stroke="currentColor" stroke-width="4"/><circle cx="155" cy="17" r="6" fill="#f4efe6"/><text x="10" y="103" fill="#012ceb">20:00</text><text x="140" y="103" fill="#f4efe6">00:00</text></svg></div>
      <div class="hero-brand"><h1 class="hero-title" aria-label="Baaz">baaz</h1></div>
      <div class="career"><div><span>Started As</span><strong>Designer</strong></div><div><span>Became</span><strong>Artist Manager</strong></div><div><span>Currently</span><strong>Creative Director</strong></div></div>
      <a class="scroll-note" href="#origin">GO ON, SCROLL DOWN<span>↓</span></a>
      <span class="hero-volume">SELF PROCLAIMED ARTIST / NEW DELHI</span>
    </section>
    <section id="origin" class="origin">
      <div class="book-stage">
        <p class="origin-quote">“If I ever write a book on how I see creativity,<br><em>it will have infinite pages.</em><br>And I'll still be figuring it out.”</p>
        <div class="book">
          <div class="book-page book-left"><div class="page-header"><span>01 — ORIGIN</span><span>THE BEGINNING</span></div><p class="handwritten page-subtitle">how it all started.</p><h2>I STARTED MAKING<br><span>CREATIVE STUFF</span><br>FOUR YEARS AGO<br>BECAUSE I WANTED<br>TO BUY SOME<br><span class="sneakers">SNEAKERS</span><br>ON MY OWN.</h2><p class="origin-story">I had no idea what a “marketing strategy” was in 9th grade. I was just making YouTube thumbnails and taking whatever freelance gigs I could find through Insta & Discord.</p><p class="handwritten origin-after">It started as making things.<br>Then it became a way of thinking.<br><b>Strategy came later.</b></p><div class="polaroid draggable-sticker"><img src="${asset('polaroidimg.PNG')}" alt="A memory from Bajkamal's early creative journey" loading="lazy"><span>early phase ↗</span></div><span class="page-number">BAJKAMAL / 001</span></div>
          <div class="book-page book-right"><div class="page-header"><span>02 — ONE YES LED TO THE NEXT</span><span>THINGS THAT HAPPENED</span></div><span class="handwritten three-months">in 3 months.</span><div class="big-stat">186M<span>+</span></div><p class="stat-caption">VIEWS DRIVEN</p><div class="purpose"><span>CORE PHILOSOPHY</span><h3>ART WITH A PURPOSE.</h3><p>I am an artist at heart. I obsess over aesthetics, but I love it even more when my art actually makes people feel something and take action.</p><em class="handwritten">beautiful design that actually works.</em></div><div class="hustle"><span>// PLACES I'VE HUSTLED AT</span><p>Founding Marketer at <b>RNTL.</b><br>Interned at Grimbyte, MusicVerse, Sinskari, Frost & Sullivan & Blue Tea.</p><p>Grew an artist's community from scratch to <b>200K+ followers</b>, and pulled off a campus launch for a <b>Jio Hotstar show.</b></p></div>${stats([['33M+','Campaign reach'],['40+','Live shows'],['DU #1','5 subjects']])}<div class="page-ps handwritten">PS// still figuring things out.</div><span class="page-number">KEEP SCROLLING / 002</span></div>
          <div class="book-cover"><span>PERSONAL NOTES / VOL. 01</span><div>baaz<span>Design Lab</span></div><p>I'm an open book.<br>Scroll to turn the page. ↗</p><div class="cover-stickers"><b class="sticker-figma draggable-sticker">F<br><small>FIGMA</small></b><b class="sticker-smile draggable-sticker">☺</b><b class="sticker-cola draggable-sticker">COLD<br>POP</b></div></div>
        </div>
      </div>
    </section>
    <section id="projects" class="projects blueprint">
      <div class="corner corner-tl"></div><div class="corner corner-br"></div><span class="vertical-label">SECTOR 03 / ALPHA</span>
      <div class="projects-heading"><div><span class="section-label">SECTION 03</span><h2 class="handwritten"><span class="paper-word tape">Pro</span>jects<span class="green-star">✦</span></h2></div><div class="quick-note tape"><span>A QUICK NOTE</span><strong>Worth a look.</strong><p>But if you're short on time,<br>jump straight to <a href="#best-work">next section (Best Work).</a></p></div></div>
      <div class="project-stack">${projects.map((p,i)=>`<button class="project-card ${p.color}" data-project="${i}" aria-label="Explore ${p.name}"><span class="card-tape"></span><div class="card-heading"><strong>${p.name}</strong><span>${p.description}</span></div><div class="card-role">${p.role}<span>// ${p.duration}</span></div><span class="card-hint">CLICK TO OPEN ↗</span></button>`).join('')}</div>
      <span class="projects-foot">GOOD WORK IS A TEAM SPORT. GREAT WORK IS A LITTLE WEIRD.</span>
    </section>
    <section id="best-work" class="metro">
      <div class="metro-interior" inert><header class="metro-header"><span>SECTION 04 / BEST WORK</span><b>BLUE LINE <i class="live-dot"></i></b></header><div class="station-route">${stations.map((s,i)=>`<button data-station="${i}" class="station-stop ${i===0?'active':''}" aria-label="Visit ${s.name}" aria-pressed="${i===0}"><span class="station-dot"></span><span>${s.station}</span><b>${s.name}</b></button>`).join('')}</div><div class="train-window"><div class="metro-led">कृपया दरवाजों से दूर रहें • NEXT STATION: <span id="station-led">VISHWAVIDYALAYA</span></div><article id="station-content"></article><div class="metro-controls"><button id="station-prev" aria-label="Previous station">←</button><span id="station-counter">01 / 05</span><button id="station-next" aria-label="Next station">→</button></div></div><footer class="metro-footer"><span>built in new delhi /// powered by caffeine</span><button id="metro-exit">Return to platform ↗</button><span>caution: can run even after 11pm</span></footer></div>
      <div class="metro-gate"><div class="door door-left"></div><div class="door door-right"></div><div class="metro-welcome"><h2 lang="hi">दिल्ली मेट्रो में<br>आपका स्वागत है</h2><p class="handwritten">Welcome to Delhi Metro</p><button id="metro-enter" class="yellow-button">ENTER METRO <span>↗</span></button></div><span class="gate-caption">DRIVEN BY A SELF PROCLAIMED ARTIST</span></div>
    </section>
    <section id="visuals" class="visuals">
      <div class="corner corner-tl"></div><div class="corner corner-br"></div><div class="visual-labels"><span>BRAND DESIGN</span><span>SOCIAL MEDIA</span><span>TYPOGRAPHY</span><span>POSTER DESIGN</span><span>COLOUR GRADING</span><span>MOTION GRAPHICS</span><span>VISUAL IDENTITY</span><span>CONTENT CREATION</span></div><div class="visual-title"><h2 class="handwritten">insomniac<span>Work</span></h2><button id="gallery-open">● HOVER AROUND TO SEE THE MAGIC <span>↗</span></button><span class="mobile-gallery-note">TAP TO EXPLORE THE ARTWORK</span></div><div id="image-trail" aria-hidden="true"></div>
    </section>
    <section id="contact" class="contact"><div><span class="section-label">LAST STOP / SAY HELLO</span><h2 class="handwritten">contact<br><span>Me</span></h2><p>Ready to make a move? Drop an email to discuss<br>internships, collaborations, or just to say hi.</p></div><div class="contact-links"><a class="email-link handwritten" href="mailto:bajkamalsingh1@gmail.com">→ say hi before overthinking it ${arrow}</a><span>(OPENS YOUR MAIL APP — NO FORMS, NO FRICTION)</span><div class="social-links"><a href="https://www.instagram.com/bajkamal07/" target="_blank" rel="noopener noreferrer">INSTAGRAM ${arrow}</a><a href="https://www.linkedin.com/in/bajkamalsingh/" target="_blank" rel="noopener noreferrer">LINKEDIN ${arrow}</a><a href="mailto:bajkamalsingh1@gmail.com">MAIL ${arrow}</a></div></div></section>
    <footer class="footer"><p class="handwritten">Bye, have a great day at your job.<br>Hoping you get more creative portfolios to look at.</p><div class="footer-signature">Bajkamal Singh <span>(Baaz)</span></div><div class="footer-line"><span>© ${new Date().getFullYear()} BAJKAMAL SINGH</span><a href="#hero">BACK TO THE TOP ↑</a><span>MADE WITH A LITTLE TOO MUCH COFFEE.</span></div></footer>
  </main>
  <nav class="bottom-nav" aria-label="Portfolio sections">${navItems.map(([id,label],i)=>`<a href="#${id}" class="${i===0?'active':''}">${label}</a>`).join('')}</nav>
  <button id="sound-toggle" class="sound-toggle" aria-label="Enable sound effects" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="sound-off" d="m16 9 5 6m0-6-5 6"/><path class="sound-on" d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></svg></button>
  <div class="cursor" aria-hidden="true"></div><div class="cursor-label" aria-hidden="true">EXPLORE ↗</div>
  <dialog id="detail-dialog" aria-labelledby="dialog-title" data-lenis-prevent><button class="dialog-close" aria-label="Close details">CLOSE ×</button><div id="dialog-content"></div></dialog>
`;
const lenis = reducedMotion ? null : new Lenis({duration:1.05,smoothWheel:true});
lenis?.on('scroll',ScrollTrigger.update);
gsap.ticker.add(time=>lenis?.raf(time*1000));gsap.ticker.lagSmoothing(0);
const intro = document.querySelector('.opening');
const closeIntro=()=>{gsap.to(intro,{yPercent:-105,duration:reducedMotion?0:.8,ease:'power4.inOut',onComplete:()=>intro.remove()});gsap.from('.hero-title',{y:50,opacity:0,duration:1.2,ease:'power3.out'});};
if(reducedMotion) intro.remove(); else {gsap.from('.opening-title',{y:60,opacity:0,duration:.7});gsap.delayedCall(1.7,closeIntro);document.querySelector('.opening-skip').addEventListener('click',closeIntro);}

// Keep navigation, reading progress, and active-section indicators in sync.
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;const percentage=Math.round(max>0?scrollY/max*100:0);document.querySelector('#progress-label').textContent=`${percentage}%`;document.querySelector('.progress-fill').style.width=`${percentage}%`;}
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();if(lenis)lenis.scrollTo(target,{offset:-44});else target.scrollIntoView({behavior:'instant'});history.replaceState(null,'',a.getAttribute('href'));}));
navItems.forEach(([id])=>ScrollTrigger.create({trigger:`#${id}`,start:'top 45%',end:'bottom 45%',onToggle:self=>{if(self.isActive)document.querySelectorAll('.bottom-nav a').forEach(a=>{const active=a.getAttribute('href')===`#${id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}));
if(!reducedMotion){
 gsap.to('.hero-title',{y:110,scale:.9,opacity:.3,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 gsap.to('.book-cover',{rotationY:-178,scrollTrigger:{trigger:'.origin',start:'top 25%',end:'top -60%',scrub:1},ease:'none'});
 gsap.fromTo('.book',{rotationX:17,rotationZ:4,scale:.78},{rotationX:0,rotationZ:0,scale:1,scrollTrigger:{trigger:'.origin',start:'top bottom',end:'top -30%',scrub:1}});
 gsap.to('.origin-quote',{opacity:0,y:-30,scrollTrigger:{trigger:'.origin',start:'top top',end:'top -35%',scrub:true}});
 gsap.from('.contact h2',{y:80,opacity:0,scrollTrigger:{trigger:'.contact',start:'top 80%'},duration:.9});
 Draggable.create('.draggable-sticker',{type:'x,y',bounds:'.book',onDragStart(){this.target.style.zIndex=20},inertia:false});
}else document.querySelector('.book-cover').style.transform='rotateY(-178deg)';

// Project and artwork dialogs keep the entire portfolio navigable with a keyboard.
const dialog=document.querySelector('#detail-dialog'),content=document.querySelector('#dialog-content');
let previousFocus;
function showDialog(html){previousFocus=document.activeElement;content.innerHTML=html;dialog.showModal();lenis?.stop();document.body.classList.add('modal-open');document.querySelector('.dialog-close').focus();}
function closeDialog(){dialog.close();}
dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lenis?.start();previousFocus?.focus({preventScroll:true});});
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const p=projects[Number(b.dataset.project)];tick();showDialog(`<div class="project-detail"><span class="detail-kicker">PROJECT ARCHIVE / ${p.duration.toUpperCase()}</span><h2 id="dialog-title">${p.name}</h2><p class="detail-description">${p.description}</p><h3 class="handwritten">${p.role}</h3><ul>${p.points.map(x=>`<li>${x}</li>`).join('')}</ul>${stats(p.stats)}<span class="detail-stamp">ARCHIVED & VERIFIED ↗</span></div>`);}));

// A five-station metro journey with working doors, navigation, and project breakdowns.
let stationIndex=0,metroEntered=false;
function renderStation(animate=false){const s=stations[stationIndex];const node=document.querySelector('#station-content');node.innerHTML=`<span class="station-type">${s.type} / ${String(stationIndex+1).padStart(2,'0')}</span><div class="station-layout"><div><h3 class="handwritten">${s.name}</h3><p class="station-subtitle">${s.subtitle}</p><ul>${s.points.map(p=>`<li>${p}</li>`).join('')}</ul>${stats(s.stats)}<button class="yellow-button station-detail">STEP OUT FOR DISSECTION ${arrow}</button></div><figure class="metro-art"><img src="${asset(s.art)}" alt="${s.name} project artwork" loading="lazy"><figcaption>${s.name} / THE WORK BEHIND THE NUMBERS</figcaption></figure></div>`;document.querySelector('#station-led').textContent=s.station.toUpperCase();document.querySelector('#station-counter').textContent=`${String(stationIndex+1).padStart(2,'0')} / 05`;document.querySelectorAll('[data-station]').forEach((b,i)=>{b.classList.toggle('active',i===stationIndex);b.setAttribute('aria-pressed',String(i===stationIndex));});node.querySelector('.station-detail').addEventListener('click',()=>{tick();showDialog(`<div class="case-detail"><span class="detail-kicker">BLUE LINE / ${s.station.toUpperCase()} / ${s.type.toUpperCase()}</span><h2 id="dialog-title" class="handwritten">${s.name}</h2><p class="case-subtitle">${s.subtitle}</p>${stats(s.stats)}<div class="case-body"><img src="${asset(s.art)}" alt="${s.name} campaign artwork"><div><h3 class="handwritten">The thinking behind the work.</h3>${s.points.map((p,i)=>`<div class="case-point"><span>0${i+1}</span><p>${p}</p></div>`).join('')}</div></div></div>`);});if(animate&&!reducedMotion)gsap.fromTo(node,{opacity:0,x:30},{opacity:1,x:0,duration:.45});}
renderStation();
function moveStation(delta){stationIndex=(stationIndex+delta+stations.length)%stations.length;renderStation(true);tick();}
document.querySelector('#station-prev').addEventListener('click',()=>moveStation(-1));document.querySelector('#station-next').addEventListener('click',()=>moveStation(1));
document.querySelectorAll('[data-station]').forEach(b=>b.addEventListener('click',()=>{stationIndex=Number(b.dataset.station);renderStation(true);tick();}));
function enterMetro(){metroEntered=true;document.querySelector('.metro-interior').removeAttribute('inert');document.querySelector('.metro').classList.add('entered');document.querySelector('.metro-gate').setAttribute('inert','');tick(220);setTimeout(()=>document.querySelector('#station-next').focus({preventScroll:true}),reducedMotion?0:850);}
function exitMetro(){metroEntered=false;document.querySelector('.metro-interior').setAttribute('inert','');document.querySelector('.metro').classList.remove('entered');document.querySelector('.metro-gate').removeAttribute('inert');document.querySelector('#metro-enter').focus({preventScroll:true});tick(140);}
document.querySelector('#metro-enter').addEventListener('click',enterMetro);document.querySelector('#metro-exit').addEventListener('click',exitMetro);
document.addEventListener('keydown',e=>{if(dialog.open||!metroEntered)return;const r=document.querySelector('.metro').getBoundingClientRect();if(r.top>innerHeight/2||r.bottom<innerHeight/2)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveStation(e.key==='ArrowRight'?1:-1);}});
let touchStart=null;const metroWindow=document.querySelector('.train-window');metroWindow.addEventListener('touchstart',e=>{touchStart=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});metroWindow.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))moveStation(dx<0?1:-1);touchStart=null;},{passive:true});

// Original artwork follows the cursor; the gallery remains accessible on touch devices.
const visuals=document.querySelector('.visuals'),trail=document.querySelector('#image-trail');let lastPoint={x:-1000,y:-1000},artIndex=0;
visuals.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reducedMotion)return;const rect=visuals.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;if(Math.hypot(x-lastPoint.x,y-lastPoint.y)<115)return;lastPoint={x,y};const [file,label]=artworks[artIndex++%artworks.length];const img=document.createElement('img');img.src=asset(file);img.alt=label;img.style.left=`${x}px`;img.style.top=`${y}px`;trail.append(img);gsap.fromTo(img,{scale:.4,rotation:Math.random()*24-12,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(1.2)'});gsap.to(img,{y:35,opacity:0,scale:.9,delay:1.1,duration:.6,onComplete:()=>img.remove()});});
document.querySelector('#gallery-open').addEventListener('click',()=>showDialog(`<div class="art-detail"><span class="detail-kicker">LATE NIGHTS / GOOD IDEAS</span><h2 id="dialog-title" class="handwritten">insomniac Work</h2><div class="art-grid">${artworks.map(([file,label])=>`<figure><img src="${asset(file)}" alt="${label}" loading="lazy"><figcaption>${label}</figcaption></figure>`).join('')}</div></div>`));

// Sound is opt-in and synthesised locally, with no downloaded audio or autoplay.
let audioContext,soundOn=false;const soundButton=document.querySelector('#sound-toggle');
function tick(frequency=440){if(!soundOn||!audioContext)return;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency,audioContext.currentTime);osc.frequency.exponentialRampToValueAtTime(frequency/2,audioContext.currentTime+.12);gain.gain.setValueAtTime(.04,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.17);}
soundButton.addEventListener('click',async()=>{if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();soundOn=!soundOn;if(soundOn)await audioContext.resume();soundButton.classList.toggle('enabled',soundOn);soundButton.setAttribute('aria-pressed',String(soundOn));soundButton.setAttribute('aria-label',soundOn?'Disable sound effects':'Enable sound effects');tick(660);});

// Fine-pointer cursor, with a native cursor retained for touch and keyboard use.
if(matchMedia('(pointer:fine)').matches&&!reducedMotion){const cursor=document.querySelector('.cursor'),label=document.querySelector('.cursor-label');document.addEventListener('pointermove',e=>{cursor.style.opacity=1;gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.08});gsap.to(label,{x:e.clientX+20,y:e.clientY-15,duration:.12});const clickable=!!e.target.closest('a,button,.draggable-sticker');cursor.classList.toggle('interactive',clickable);label.classList.toggle('visible',!!e.target.closest('.project-card,.visuals'));label.textContent=e.target.closest('.visuals')?'KEEP GOING ↗':'EXPLORE ↗';});document.addEventListener('pointerleave',()=>cursor.style.opacity=0);document.addEventListener('pointerenter',()=>cursor.style.opacity=1);}
window.addEventListener('load',()=>ScrollTrigger.refresh());document.fonts.ready.then(()=>ScrollTrigger.refresh());
