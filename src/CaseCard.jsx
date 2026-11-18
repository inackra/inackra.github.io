import React,{useLayoutEffect,useRef,useId} from 'react';
import {sampleWarp,warpGeometry} from './cardWarp';
// A local, velocity-driven displacement field. Neutral pixels leave the rest
// of the complete surface (image, type and controls) in its original position.
export default function CaseCard({id,className='',paused,children,artwork}){
 const host=useRef(null),surface=useRef(null),map=useRef(null),filter=useRef(null),region=useRef(null);const filterId=`warp-${useId().replace(/[^\w-]/g,'')}`;
 useLayoutEffect(()=>{
  if(paused||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const el=host.current,plane=surface.current,cv=document.createElement('canvas');cv.width=160;cv.height=120;const ctx=cv.getContext('2d');if(!ctx)return;
  const pixels=ctx.createImageData(cv.width,cv.height);let raf=0,last=0,previous=0,dead=false,trail=[],pointer=null;
  const draw=time=>{raf=0;if(dead)return;if(time-last<32){schedule();return}last=time;trail=trail.filter(p=>time-p.t<650);const w=el.clientWidth,h=el.clientHeight,bounds=warpGeometry(w,h);
   if(!trail.length){plane.style.filter='';return}const data=pixels.data;
   for(let y=0;y<cv.height;y++)for(let x=0;x<cv.width;x++){
    const {dx,dy}=sampleWarp(bounds.x+x/cv.width*bounds.width,bounds.y+y/cv.height*bounds.height,trail,time);
    const i=(y*cv.width+x)*4;data[i]=128+Math.max(-110,Math.min(110,dx*255/80));data[i+1]=128+Math.max(-110,Math.min(110,dy*255/80));data[i+2]=128;data[i+3]=255;
   }
   for(const [key,value] of Object.entries(bounds)){region.current?.setAttribute(key,String(value));map.current?.setAttribute(key,String(value))}ctx.putImageData(pixels,0,0);map.current?.setAttribute('href',cv.toDataURL());filter.current?.setAttribute('scale','80');schedule();
  };
  function schedule(){if(!raf&&!dead)raf=requestAnimationFrame(draw)}
  const move=e=>{if(e.pointerType==='touch'||e.buttons)return;const r=el.getBoundingClientRect(),now=performance.now(),x=e.clientX-r.left,y=e.clientY-r.top;const dt=pointer?Math.max(12,now-pointer.t):16;const vx=pointer?Math.max(-28,Math.min(28,(x-pointer.x)/dt*16)):0,vy=pointer?Math.max(-28,Math.min(28,(y-pointer.y)/dt*16)):0;
   if(now-previous>32){trail.push({x,y,vx,vy,t:now});trail=trail.slice(-9);previous=now}pointer={x,y,t:now};schedule()};
  const image=map.current;const ready=()=>{if(!dead&&trail.length)plane.style.filter=`url(#${filterId})`};image?.addEventListener('load',ready);
  const leave=()=>{pointer=null;schedule()};el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',leave);
  return()=>{dead=true;image?.removeEventListener('load',ready);cancelAnimationFrame(raf);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);plane.style.filter=''};
 },[paused,filterId]);
 return <section ref={host} id={id} className={`case-section case-card ${className}`} aria-labelledby={`${id}-title`}><svg className="card-warp-definition" aria-hidden="true" focusable="false"><defs><filter ref={region} id={filterId} filterUnits="userSpaceOnUse" x="-64" y="-64" width="1000" height="1000" colorInterpolationFilters="sRGB"><feImage ref={map} x="-64" y="-64" width="1128" height="1128" preserveAspectRatio="none" result="field"/><feComponentTransfer in="field" result="balanced-field"><feFuncR type="linear" slope="1" intercept="-0.0019607843"/><feFuncG type="linear" slope="1" intercept="-0.0019607843"/></feComponentTransfer><feDisplacementMap ref={filter} in="SourceGraphic" in2="balanced-field" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><div ref={surface} className="case-card-stage">{artwork}<div className="case-card-body">{children}</div></div></section>;
}
