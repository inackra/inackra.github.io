import gsap from 'gsap';
// Magnetic pull and the rising fill for every site button, via one set of
// delegated listeners (pages render buttons in many components).
export const PILLS='.text-action:not(summary),.aio-support-navigation>summary,.case-open,.button,.archive-filters a,.archive-filters button,.footer-controls>a,.footer-controls>button,.copy-link,.carousel-arrows button';
export function mountPills(){
 const html=document.documentElement;
 if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
 html.classList.add('pills-js');
 let cur=null;
 const find=t=>t?.closest?.(PILLS);
 const enter=el=>{if(el.closest('.mock'))return;gsap.fromTo(el,{'--fy':'76%'},{'--fy':'0%',duration:.6,ease:'power2.out',overwrite:'auto'})};
 const leave=el=>{gsap.to(el,{'--fy':'-76%',duration:.6,ease:'power2.inOut',overwrite:'auto'});gsap.to(el,{x:0,y:0,duration:1.4,ease:'elastic.out(1.1,.4)'})};
 const over=e=>{const el=find(e.target);if(el===cur)return;if(cur)leave(cur);cur=el;if(el)enter(el)};
 const move=e=>{if(!cur||cur.disabled)return;const r=cur.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5,s=Math.min(14,r.width/10);gsap.to(cur,{x:dx*s,y:dy*s,duration:1.2,ease:'power4.out'})};
 const out=e=>{if(cur&&!cur.contains(e.relatedTarget)){leave(cur);cur=null}};
 document.addEventListener('mouseover',over);document.addEventListener('mousemove',move,{passive:true});document.addEventListener('mouseout',out);
 return()=>{html.classList.remove('pills-js');document.removeEventListener('mouseover',over);document.removeEventListener('mousemove',move);document.removeEventListener('mouseout',out)};
}
