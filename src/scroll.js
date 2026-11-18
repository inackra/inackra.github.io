import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
let instance;
export function mountScroll(){
 instance=new Lenis({autoRaf:true,lerp:.2,smoothWheel:!matchMedia('(prefers-reduced-motion: reduce)').matches,syncTouch:false,anchors:false,prevent:node=>!!node.closest?.('dialog')});
 document.documentElement.classList.add('has-smooth-scroll');
 return()=>{instance?.destroy();instance=undefined;document.documentElement.classList.remove('has-smooth-scroll')};
}
export function scrollTo(target,{immediate=false,...options}={}){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 if(instance)instance.scrollTo(target,{immediate:immediate||reduce,force:true,offset:0,duration:immediate||reduce?0:.75,...options});
 else if(typeof target==='number')window.scrollTo({top:target,behavior:immediate||reduce?'instant':'smooth'});
 else target?.scrollIntoView({behavior:immediate||reduce?'instant':'smooth'});
}
export function blockScroll(blocked){if(blocked)instance?.stop();else instance?.start()}
