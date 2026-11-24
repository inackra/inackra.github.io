// "Task done" confetti: a small canvas burst with no library. celebrate() fires
// party poppers from both bottom corners with 🎉 emoji (the right ones mirrored)
// and a short caption; pop() is a little burst at a point, for taps on bars.
const COLORS=['#FF453A','#FF9F0A','#FFD60A','#30D158','#40C8E0','#0A84FF','#BF5AF2'];
const still=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function burst(sources,life){
 const cv=document.createElement('canvas');cv.className='confetti-canvas';cv.setAttribute('aria-hidden','true');
 document.body.appendChild(cv);
 const dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
 cv.width=w*dpr;cv.height=h*dpr;const c=cv.getContext('2d');c.scale(dpr,dpr);
 const parts=[];
 for(const {x,y,angle,spread,speed,count} of sources)for(let i=0;i<count;i++){
  const a=angle+(Math.random()-.5)*spread,v=speed*(.55+Math.random()*.6);
  parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6.28,vr:(Math.random()-.5)*.35,
   w:5+Math.random()*6,h:3+Math.random()*4,col:COLORS[i%COLORS.length],round:Math.random()<.3,wob:Math.random()*6.28});
 }
 const t0=performance.now();
 const tick=t=>{
  const k=(t-t0)/life;c.clearRect(0,0,w,h);
  for(const p of parts){
   p.vy+=.32;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.wob+=.12;
   c.save();c.globalAlpha=Math.max(0,1-Math.max(0,k-.65)/.35);c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.cos(p.wob));
   c.fillStyle=p.col;if(p.round){c.beginPath();c.arc(0,0,p.h*.8,0,6.28);c.fill()}else c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore();
  }
  if(k<1)requestAnimationFrame(tick);else cv.remove();
 };
 requestAnimationFrame(tick);
}

export function pop(x,y){
 if(still())return;
 burst([{x,y,angle:-Math.PI/2,spread:2.4,speed:9,count:26}],1100);
}

export function celebrate(text){
 if(still())return;
 const w=innerWidth,h=innerHeight,speed=Math.min(26,14+h/70);
 burst([{x:0,y:h,angle:-Math.PI/3,spread:.9,speed,count:90},{x:w,y:h,angle:-Math.PI*2/3,spread:.9,speed,count:90}],2600);
 const box=document.createElement('div');box.className='confetti-layer';box.setAttribute('aria-hidden','true');
 // Two poppers on each side; the right-hand ones are mirrored to face inward.
 box.innerHTML=[['l',0],['l',1],['r',0],['r',1]].map(([s,i])=>`<span class="confetti-emoji is-${s}" style="--n:${i}">🎉</span>`).join('');
 const note=document.createElement('p');note.className='confetti-note';note.setAttribute('role','status');note.textContent=text;
 box.appendChild(note);document.body.appendChild(box);
 setTimeout(()=>box.classList.add('is-out'),2000);
 setTimeout(()=>box.remove(),2600);
}
