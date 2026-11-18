import React,{useLayoutEffect,useRef,useId} from 'react';
import {clamp,surfacePose,stripPose} from './cardWaveMath';

export default function CaseCard({id,className='',paused,version,children,artwork}){
 const card=useRef(null),stage=useRef(null),skin=useRef(null),displacement=useRef(null),patch=useRef(null);
 const warpId=`card-warp-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
 useLayoutEffect(()=>{
  const host=card.current,plane=stage.current,mesh=skin.current;
  if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const count=innerWidth<700?18:24;
  let bands=[],height=0,top=0,raf=0,visible=false,dead=false;
  let lastY=scrollY,lastTime=performance.now(),speed=0,smooth=0,previous=99,lastFrame=0;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hover={x:0,y:0,level:0},target={x:0,y:0,level:0};
  const paint=(now)=>{
   raf=0;if(dead||!visible||document.hidden)return;
   const dt=Math.min(64,lastFrame?now-lastFrame:16);lastFrame=now;
   const follow=1-Math.exp(-dt/70);hover.x+=(target.x-hover.x)*follow;hover.y+=(target.y-hover.y)*follow;hover.level+=(target.level-hover.level)*(1-Math.exp(-dt/220));
   if(!target.level&&hover.level<.001)hover.level=0;
   smooth+=(speed-smooth)*.18;speed*=.78;
   const position=(top+height/2-scrollY-innerHeight/2)/(innerHeight*.67);
   if(Math.abs(position-previous)>.0002||Math.abs(smooth)>.2||hover.level||host.dataset.cardWarp!=='0.000'){
    const pose=surfacePose(position,smooth,innerWidth<700);
    plane.style.transform=`perspective(1300px) translate3d(0,0,${pose.depth.toFixed(2)}px) rotateX(${pose.tilt.toFixed(3)}deg)`;
    const radius=Math.min(160,host.clientWidth*.23);patch.current?.setAttribute('x',String(hover.x-radius));patch.current?.setAttribute('y',String(hover.y-radius));patch.current?.setAttribute('width',String(radius*2));patch.current?.setAttribute('height',String(radius*2));host.dataset.warpCenter=`${hover.x.toFixed(1)},${hover.y.toFixed(1)}`;host.dataset.warpRadius=String(radius);
    const warp=hover.level*50;if(displacement.current?.getAttribute('scale')!==warp.toFixed(2))displacement.current?.setAttribute('scale',warp.toFixed(2));
    plane.style.filter=hover.level?`url(#${warpId})`:'';
    host.dataset.cardWarp=hover.level.toFixed(3);
    for(let i=0;i<count;i++){
     const p=stripPose(i,count,height,pose.bend);
     bands[i].style.transform=`translate3d(0,${p.y.toFixed(3)}px,${p.z.toFixed(3)}px) rotateX(${p.angle.toFixed(3)}deg)`;
     const shade=10+Math.round(Math.cos(i/count*Math.PI)*Math.abs(pose.bend)*3);
     bands[i].style.backgroundColor=`rgb(${shade},${shade},${shade})`;
    }
    host.dataset.cardBend=pose.bend.toFixed(3);host.dataset.cardPosition=position.toFixed(3);previous=position;
   }
   if(Math.abs(smooth)>.2||Math.abs(speed)>.2||Math.abs(target.level-hover.level)>.001||Math.abs(target.x-hover.x)>.001||Math.abs(target.y-hover.y)>.001)schedule();
  };
  function schedule(){if(!raf&&!dead)raf=requestAnimationFrame(paint)}
  const resize=()=>{
   height=host.clientHeight;top=host.getBoundingClientRect().top+scrollY;
   if(!height)return;
   const fragment=document.createDocumentFragment();bands=[];
   for(let i=0;i<count;i++){
    const band=document.createElement('div');band.className='case-card-band';
    band.style.top=`${i/count*height}px`;band.style.height=`${height/count+1.4}px`;
    if(i===0)band.classList.add('first');if(i===count-1)band.classList.add('last');
    fragment.append(band);bands.push(band);
   }
   mesh.replaceChildren(fragment);host.classList.add('card-wave-ready');previous=99;schedule();
  };
  const onScroll=()=>{
   const now=performance.now(),y=scrollY;
   speed=clamp((y-lastY)/Math.max(8,now-lastTime)*16,-90,90);lastY=y;lastTime=now;schedule();
  };
  const move=e=>{if(!fine||e.pointerType==='touch')return;const r=host.getBoundingClientRect();target.x=clamp(e.clientX-r.left,0,r.width);target.y=clamp(e.clientY-r.top,0,r.height);if(!hover.level){hover.x=target.x;hover.y=target.y}target.level=1;schedule()};
  const leave=()=>{target.level=0;schedule()};
  host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerenter',move,{passive:true});host.addEventListener('pointerleave',leave);
  const viewport=()=>{top=host.getBoundingClientRect().top+scrollY;previous=99;schedule()};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){viewport();schedule()}else{cancelAnimationFrame(raf);raf=0;target.level=hover.level=0;lastFrame=0}},{rootMargin:'200px 0px'});
  const size=new ResizeObserver(resize);size.observe(host);observer.observe(host);
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',viewport,{passive:true});
  const visibility=()=>{if(!document.hidden){viewport();schedule()}};document.addEventListener('visibilitychange',visibility);
  document.fonts.ready.then(()=>{if(!dead)resize()});resize();
  return()=>{dead=true;cancelAnimationFrame(raf);observer.disconnect();size.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',viewport);document.removeEventListener('visibilitychange',visibility);mesh.replaceChildren();plane.style.transform='';plane.style.filter='';host.removeEventListener('pointermove',move);host.removeEventListener('pointerenter',move);host.removeEventListener('pointerleave',leave);delete host.dataset.cardWarp;host.classList.remove('card-wave-ready');delete host.dataset.cardBend;delete host.dataset.cardPosition};
 },[paused,version]);
 return <section ref={card} id={id} className={`case-section case-card ${className}`} aria-labelledby={`${id}-title`}><svg className="card-warp-definition" aria-hidden="true" focusable="false"><defs><filter id={warpId} x="-6%" y="-10%" width="112%" height="120%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".005 .007" numOctaves="1" seed="5" result="folds"/><feGaussianBlur in="folds" stdDeviation="3" result="soft-folds"/><feImage ref={patch} href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22256%22%20height%3D%22256%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22m%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22white%22%2F%3E%3Cstop%20offset%3D%22.45%22%20stop-color%3D%22white%22%20stop-opacity%3D%22.9%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22white%22%20stop-opacity%3D%220%22%2F%3E%3C%2FradialGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22256%22%20height%3D%22256%22%20fill%3D%22url%28%23m%29%22%2F%3E%3C%2Fsvg%3E" x="0" y="0" width="320" height="320" result="hover-mask"/><feComposite in="soft-folds" in2="hover-mask" operator="in" result="local-folds"/><feFlood floodColor="#808080" result="neutral"/><feComposite in="local-folds" in2="neutral" operator="over" result="local-map"/><feDisplacementMap ref={displacement} in="SourceGraphic" in2="local-map" scale="0" xChannelSelector="R" yChannelSelector="G" result="deformed"/><feComposite in="deformed" in2="hover-mask" operator="in" result="deformed-patch"/><feComposite in="SourceGraphic" in2="hover-mask" operator="out" result="untouched"/><feComposite in="deformed-patch" in2="untouched" operator="arithmetic" k2="1" k3="1"/></filter></defs></svg><div ref={stage} className="case-card-stage"><div ref={skin} className="case-card-skin" aria-hidden="true"/>{artwork}<div className="case-card-body">{children}</div></div></section>;
}
