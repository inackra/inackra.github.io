import React,{useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';
import {createField,sampleField,prepareField} from './waveField';
import {fieldInk,setInk,THEME_INK} from './motionPalette';
import {createGlyphAtlas,drawGlyph} from './glyphAtlas';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const selector='[data-motion-text]';

// Build the numeral cloud from the actual rendered words, including wrapped lines.
function textCloud(element){
 const bounds=element.getBoundingClientRect();
 if(!bounds.width||!bounds.height)return null;
 const width=Math.ceil(bounds.width),height=Math.ceil(bounds.height);
 if(width*height>1500000)return null;
 const mask=document.createElement('canvas');mask.width=width;mask.height=height;
 const c=mask.getContext('2d',{willReadFrequently:true});c.fillStyle='#fff';c.textBaseline='alphabetic';
 const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){
  const parent=node.parentElement;if(!parent||parent.closest('svg,.sr-only,[data-motion-ignore]'))continue;
  const style=getComputedStyle(parent);c.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if('letterSpacing' in c)c.letterSpacing=style.letterSpacing==='normal'?'0px':style.letterSpacing;
  const text=node.textContent,regex=/\S+/g;let word;
  while((word=regex.exec(text))){
   const range=document.createRange();range.setStart(node,word.index);range.setEnd(node,word.index+word[0].length);
   const rect=range.getBoundingClientRect();
   const font=parseFloat(style.fontSize),metrics=c.measureText(word[0]);
   c.fillText(word[0],rect.left-bounds.left,rect.top-bounds.top+(metrics.fontBoundingBoxAscent||font*.82),rect.width+1);
  }
 }
 const pixels=c.getImageData(0,0,width,height).data;
 const large=parseFloat(getComputedStyle(element).fontSize)>36;
 const gap=large?7:4,points=[];
 for(let y=1;y<height;y+=gap)for(let x=1;x<width;x+=gap){
  if(pixels[(y*width+x)*4+3]>65){const seed=noise(points.length+width+x);points.push({x,y,seed});}
 }
 return {element,width,height,points:points.filter((_,i)=>i%Math.max(1,Math.ceil(points.length/2400))===0),progress:0};
}

export default function MotionField({menuCanvas,lang,paused,enabled=true,theme='dark'}){
 const canvas=useRef(null);
 useLayoutEffect(()=>{
  if(!enabled)return;
  const cv=canvas.current,c=cv.getContext('2d'),scope=cv.closest('.demo-root');if(!c||!scope)return;
  let width=0,height=0,raf=0,last=0,dead=false,clouds=[],trails=[],waves=[],particles=[],lastWave=0,headerBottom=0,animations=[],observers=[],fontsReady=false,input=null,cursor=null,lastTrail=0;
  const ink=THEME_INK[theme]||THEME_INK.dark;setInk(ink);const inkText=a=>`rgba(${ink[0]},${ink[1]},${ink[2]},${a})`;
  const atlas=createGlyphAtlas();
  const idle=document.createElement('canvas'),idleContext=idle.getContext('2d');
  const cached=!!idleContext?.fillText;let strip=0,lastIdle=0;
  const paintIdle=(time,all=false)=>{
   if(!cached)return;const y=all?0:strip*height/12,h=all?height:height/12;
   idleContext.save();idleContext.beginPath();idleContext.rect(0,y,width,h);idleContext.clip();idleContext.clearRect(0,y,width,h);
   idleContext.font='8px monospace';idleContext.textAlign='center';idleContext.textBaseline='middle';
   for(const p of particles){if(p.y<y-12||p.y>y+h+12)continue;idleContext.fillStyle=`rgba(245,245,245,${width<700?.095+p.seed*.05:.035+p.seed*.03})`;idleContext.fillText(String(Math.floor(time/(160+p.seed*800)+p.seed*100)%2),p.x,p.y)}
   idleContext.restore();strip=(strip+1)%12;
  };
  const queued=new WeakSet(),revealed=new WeakSet();
  const resize=()=>{width=cv.clientWidth||innerWidth;height=cv.clientHeight||innerHeight;particles=createField(width,height);headerBottom=scope.querySelector('.site-header')?.getBoundingClientRect().bottom||0;const dpr=Math.min(devicePixelRatio||1,width<700?1.5:1);cv.width=Math.round(width*dpr);cv.height=Math.round(height*dpr);c.setTransform(dpr,0,0,dpr,0,0);if(cached){idle.width=cv.width;idle.height=cv.height;idleContext.setTransform(dpr,0,0,dpr,0,0);paintIdle(performance.now(),true)}schedule()};
  const onPoint=(x,y,target)=>{
   if(paused||y<headerBottom||target?.closest?.('.site-header,.dialog-top,.case-card,.case-dialog,.scroll-rail')){input=null;return;}
   const now=performance.now();input={x,y,time:now};
   if(!cursor)cursor={x,y};
   cv.dataset.gestures=String(Number(cv.dataset.gestures||0)+1);schedule();
  };
  const pointer=e=>{if(e.pointerType!=='touch'||e.type==='pointerdown')onPoint(e.clientX,e.clientY,e.target)};
  const touch=e=>{const p=e.touches[0];if(p)onPoint(p.clientX,p.clientY,e.target)};
  function schedule(){if(!raf&&!dead)raf=requestAnimationFrame(draw)}
  function draw(time){
   raf=0;if(dead||document.hidden)return;
   const dt=Math.min(64,last?time-last:16);last=time;const frameStart=performance.now();c.clearRect(0,0,width,height);
   if(!paused){
    if(input&&cursor&&time-input.time<180){
     const follow=1-Math.exp(-dt/115),oldX=cursor.x,oldY=cursor.y;
     cursor.x+=(input.x-cursor.x)*follow;cursor.y+=(input.y-cursor.y)*follow;
     const distance=Math.hypot(cursor.x-oldX,cursor.y-oldY),speed=clamp(distance/Math.max(1,dt),0,2);
     if(time-lastTrail>=40){trails.push({x:cursor.x,y:cursor.y,time});lastTrail=time;}
     if(time-lastWave>=100){waves.push({x:cursor.x,y:cursor.y,time,strength:width>=700?(.48+speed*.10):(.58+speed*.18),dirX:distance?(cursor.x-oldX)/distance:0,dirY:distance?(cursor.y-oldY)/distance:0});lastWave=time;}
    }
    trails=trails.filter(p=>time-p.time<1900);waves=waves.filter(p=>time-p.time<2100);
    // The resting field stays invisible; only the wave around the pointer shows.
    c.textAlign='center';c.textBaseline='middle';
    let lit=0,bent=0;const buckets=new Map(),frame=prepareField(time,waves,trails,width);
    for(const particle of particles){
     if(cached&&(particle.x<frame.bounds.left||particle.x>frame.bounds.right||particle.y<frame.bounds.top||particle.y>frame.bounds.bottom))continue;
     const p=sampleField(particle,time,waves,trails,width,frame);
     if(p.light>.18)lit++;if(Math.abs(p.z)>3)bent++;
     if(p.light<.018&&Math.abs(p.z)<1.2)continue;
     if(atlas)drawGlyph(c,atlas,p);else{const size=(Math.round(p.size*10)/10).toFixed(1);if(!buckets.has(size))buckets.set(size,[]);buckets.get(size).push(p);}
    }
    for(const [size,points] of buckets){c.font=`${size}px monospace`;for(const p of points){c.fillStyle=fieldInk(p);c.fillText(String(p.bit),p.x,p.y)}}
    c.globalAlpha=1;
    cv.dataset.illuminated=String(lit);cv.dataset.wavePoints=String(bent);cv.dataset.particles=String(particles.length);
    const mc=menuCanvas?.current;
    if(mc){if(mc.width!==cv.width||mc.height!==cv.height){mc.width=cv.width;mc.height=cv.height}const m=mc.getContext('2d');m.clearRect(0,0,mc.width,mc.height);m.drawImage(cv,0,0)}
    clouds=clouds.filter(cloud=>(cloud.progress<1)&&cloud.element.isConnected);
    for(const cloud of clouds){
     const p=cloud.progress,rect=cloud.element.getBoundingClientRect();if(rect.bottom<0||rect.top>height)continue;
     const assemble=clamp(p/.55),fade=clamp((1-p)/.48)*Math.min(1,p*13);
     c.font=`${cloud.width>300?7:5}px monospace`;
     for(const point of cloud.points){
      const spread=(1-assemble)*20;
      const x=rect.left+point.x*rect.width/cloud.width+(point.seed-.5)*spread;
      const y=rect.top+point.y*rect.height/cloud.height+(noise(point.seed*54)-.5)*spread;
      c.fillStyle=inkText((fade*(.4+point.seed*.5)).toFixed(3));
      c.fillText(String(Math.floor(time/90+point.seed*20)%2),x,y);
     }
    }
    cv.dataset.textClouds=String(clouds.length);
   }
   cv.dataset.frameMs=(performance.now()-frameStart).toFixed(1);
   if(!paused)schedule();
  }
  function reveal(el){
   if(dead||paused||revealed.has(el)||!el.isConnected)return;revealed.add(el);
   if(document.documentElement.classList.contains('is-scrubbing')){gsap.set(el,{clearProps:'filter,transform,opacity'});el.dataset.motionState='complete';return;}
   const cloud=textCloud(el);if(cloud)clouds.push(cloud);
   // All text, including hero and Powered by AI, uses this one reveal.
   const tween=gsap.fromTo(el,{opacity:0,filter:'blur(12px)',scale:.95,y:10,transformOrigin:'left center'},{opacity:1,filter:'blur(0px)',scale:1,y:0,duration:.85,ease:'power2.inOut',clearProps:'filter,transform,opacity',onUpdate(){if(dead)return;if(cloud)cloud.progress=this.progress();schedule()},onComplete(){if(dead)return;if(cloud)cloud.progress=1;el.dataset.motionState='complete'}});
   animations.push(tween);el.dataset.motionState='revealing';
  }

  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);reveal(entry.target)}},{rootMargin:'0px 0px -5% 0px',threshold:0});observers.push(observer);
  const scan=()=>{
   if(dead)return;
   const candidates=[...scope.querySelectorAll(selector)];
   const candidateSet=new Set(candidates);
   for(const el of candidates){
    let parent=el.parentElement,covered=false;while(parent&&parent!==scope){if(candidateSet.has(parent)){covered=true;break}parent=parent.parentElement}if(covered)continue;
    if(!el.textContent.trim()||el.closest('dialog:not([open])'))continue;
    // A changed label must not hide and rebuild an element already on screen.
    if(revealed.has(el)||queued.has(el))continue;
    if(paused){gsap.set(el,{clearProps:'filter,transform,opacity'});el.dataset.motionState='static';continue}
    // The same waiting state is already in the JSX/CSS, so it cannot flash on entry.
    el.dataset.motionState='waiting';
    if(!fontsReady)continue;
    queued.add(el);observer.observe(el);
   }
  };
  // Scrubbing should display a stable document, not restart blur animations
  // or leave number clouds following the rapidly moving sections.
  const settle=()=>{animations.forEach(tween=>tween.progress(1));clouds.forEach(cloud=>cloud.progress=1);};
  window.addEventListener('rail-scrub-start',settle);
  const mutations=new MutationObserver(scan);
  mutations.observe(scope,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['open']});
  resize();scan();
  document.fonts.load('500 16px "Manrope Variable"').then(()=>document.fonts.ready).catch(()=>{}).then(()=>{if(!dead){fontsReady=true;scan()}});
  document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerdown',pointer,{passive:true});document.addEventListener('touchmove',touch,{passive:true});
  window.addEventListener('resize',resize,{passive:true});const visibility=()=>{if(!document.hidden)schedule()};document.addEventListener('visibilitychange',visibility);
  return()=>{dead=true;cancelAnimationFrame(raf);mutations.disconnect();observers.forEach(o=>o.disconnect());animations.forEach(a=>{a.kill()});scope.querySelectorAll('[data-motion-text]').forEach(el=>gsap.set(el,{clearProps:'filter,transform,opacity'}));document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerdown',pointer);document.removeEventListener('touchmove',touch);window.removeEventListener('rail-scrub-start',settle);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility)};
 },[lang,paused,enabled,theme]);
 return <canvas ref={canvas} className="site-binary-field" aria-hidden="true"/>;
}
