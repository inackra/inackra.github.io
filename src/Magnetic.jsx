import React,{useEffect,useRef} from 'react';
import gsap from 'gsap';

// Pill button with a magnetic pull and a fill that rises from below on hover
// and leaves through the top (the dennissnellenberg.com/work interaction).
// strength: how far the button follows the cursor; textStrength: the extra
// travel of the label inside it.
export default function Magnetic({as:Tag='button',strength=25,textStrength=15,active=false,className='',children,...props}){
 const host=useRef(null),fill=useRef(null),label=useRef(null);
 useEffect(()=>{
  const el=host.current,f=fill.current,t=label.current;if(!el)return;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches,still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.set(f,{y:0,yPercent:active?0:-76});
  if(!fine)return;
  const enter=()=>{if(!el.classList.contains('is-active'))gsap.fromTo(f,{y:0,yPercent:76},{yPercent:0,duration:.6,ease:'power2.out',overwrite:true})};
  const leave=()=>{
   if(!el.classList.contains('is-active'))gsap.to(f,{yPercent:-76,duration:.6,ease:'power2.inOut',overwrite:true});
   if(!still){gsap.to(el,{x:0,y:0,duration:1.5,ease:'elastic.out(1.1,.4)',overwrite:true});gsap.to(t,{x:0,y:0,duration:1.5,ease:'elastic.out(1.1,.4)',overwrite:true})}
  };
  const move=e=>{
   if(still)return;const r=el.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;
   gsap.to(el,{x:dx*strength,y:dy*strength,duration:1.5,ease:'power4.out',overwrite:true});
   gsap.to(t,{x:dx*textStrength,y:dy*textStrength,duration:1.5,ease:'power4.out',overwrite:true});
  };
  el.addEventListener('mouseenter',enter);el.addEventListener('mouseleave',leave);el.addEventListener('mousemove',move);
  return()=>{el.removeEventListener('mouseenter',enter);el.removeEventListener('mouseleave',leave);el.removeEventListener('mousemove',move);gsap.killTweensOf([el,f,t])};
 },[strength,textStrength]);
 // Selection keeps the fill in place; deselection lets it drop away.
 useEffect(()=>{const f=fill.current;if(f)gsap.to(f,{yPercent:active?0:-76,duration:active?.45:.6,ease:'power2.inOut',overwrite:true})},[active]);
 return <Tag ref={host} className={`mag${active?' is-active':''} ${className}`} {...props}>
  <span className="mag-fill" ref={fill} aria-hidden="true"/>
  <span className="mag-label" ref={label}>{children}</span>
 </Tag>;
}
