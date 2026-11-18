const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {buildSync}=require('esbuild');
const code=buildSync({entryPoints:['src/MotionField.jsx'],bundle:true,format:'cjs',write:false,external:['react','gsap']}).outputFiles[0].text;

// Lifecycle regression checks with platform stubs. No browser or visual rendering.
function harness(paused=false){
 let effect,mutation,intersection,fontResolve;
 const listeners={};
 const calls=[],observed=new Set(),targets=[];
 const scope={querySelectorAll:()=>targets,querySelector:()=>null};
 const context={setTransform(){},clearRect(){},getImageData:()=>({data:new Uint8ClampedArray(16*16*4)})};
 const canvas={dataset:{},closest:()=>scope,getContext:()=>context};
 const fonts={load:()=>new Promise(resolve=>fontResolve=resolve),ready:Promise.resolve()};
 const gsap={set(){},fromTo(target,from,to){const tween={target,from,to,kill(){this.killed=true}};calls.push(tween);return tween}};
 const React={createElement(){return null},useRef:()=>({current:canvas}),useLayoutEffect(fn){effect=fn}};
 const sandbox={module:{exports:{}},exports:{},require(name){if(name==='react')return React;if(name==='gsap')return gsap;throw Error(name)},document:{documentElement:{classList:{contains:()=>false}},fonts,hidden:false,createElement:()=>({width:0,height:0,getContext:()=>context}),createTreeWalker:()=>({nextNode:()=>null}),addEventListener(name,fn){listeners[name]=fn},removeEventListener(){}},performance:{now:()=>1000},window:{addEventListener(){},removeEventListener(){}},NodeFilter:{SHOW_TEXT:4},innerWidth:375,innerHeight:812,devicePixelRatio:1,requestAnimationFrame:()=>1,cancelAnimationFrame(){},getComputedStyle:()=>({fontSize:'16px'}),IntersectionObserver:class{constructor(fn){intersection=fn}observe(node){observed.add(node)}unobserve(node){observed.delete(node)}disconnect(){observed.clear()}},MutationObserver:class{constructor(fn){mutation=fn}observe(){}disconnect(){}}};
 vm.runInNewContext(code,sandbox,{filename:'MotionField.cjs'});
 const component=sandbox.module.exports.default;
 const node=text=>({textContent:text,isConnected:true,parentElement:scope,dataset:{motionState:'waiting'},closest:()=>null,getBoundingClientRect:()=>({width:16,height:16,left:0,top:100,bottom:116})});
 const first=node('Меню');targets.push(first);component({menuCanvas:{current:null},lang:'ru',paused});
 const cleanup=effect();
 return {first,targets,calls,observed,node,cleanup,listeners,canvas,ready:async()=>{fontResolve();await new Promise(setImmediate)},mutate:()=>mutation(),enter:target=>intersection([{isIntersecting:true,target}])};
}
(async()=>{
 const h=harness();
 assert.equal(h.first.dataset.motionState,'waiting');assert.equal(h.calls.length,0);
 assert.equal(h.observed.size,0,'do not start text before its font is ready');
 await h.ready();assert.ok(h.observed.has(h.first));
 h.listeners.pointerdown({type:'pointerdown',pointerType:'touch',clientX:20,clientY:100});assert.equal(h.canvas.dataset.gestures,'1','a touch tap still creates a gesture');
 h.listeners.pointermove({type:'pointermove',pointerType:'touch',clientX:25,clientY:105});assert.equal(h.canvas.dataset.gestures,'1','touch movement is not counted twice');
 h.listeners.touchmove({touches:[{clientX:30,clientY:110}]});assert.equal(h.canvas.dataset.gestures,'2');
 h.listeners.pointermove({pointerType:'mouse',clientX:30,clientY:110,target:{closest:()=>true}});assert.equal(h.canvas.dataset.gestures,'2','cards/header do not trigger the global field');
 h.enter(h.first);assert.equal(h.calls.length,1);assert.equal(h.calls[0].from.opacity,0);
 h.first.textContent='Закрыть';h.mutate();
 assert.equal(h.first.dataset.motionState,'revealing','label changes must not hide visible controls');
 h.enter(h.first);assert.equal(h.calls.length,1,'repeat observer entries must not restart the reveal');
 h.calls[0].to.onComplete();assert.equal(h.first.dataset.motionState,'complete');
 h.first.textContent='Меню';h.mutate();assert.equal(h.first.dataset.motionState,'complete');assert.equal(h.calls.length,1);
 const second=h.node('Новый кейс');h.targets.push(second);h.mutate();assert.ok(h.observed.has(second));h.enter(second);assert.equal(h.calls.length,2,'new dialog content still reveals');
 h.cleanup();assert.ok(h.calls.every(x=>x.killed));
 const late=h.node('Поздний callback');h.enter(late);assert.equal(h.calls.length,2,'queued callbacks must stop after cleanup');
 second.dataset.motionState='new-owner';h.calls[1].to.onComplete();assert.equal(second.dataset.motionState,'new-owner','old completion must not modify a new controller state');
 const reduced=harness(true);await reduced.ready();assert.equal(reduced.first.dataset.motionState,'static');assert.equal(reduced.observed.size,0);assert.equal(reduced.calls.length,0);reduced.cleanup();
 console.log('PASS: font readiness, zero-opacity start, one reveal per target, changing labels, new dialog content, late callbacks, reduced motion.');
})().catch(error=>{console.error(error);process.exitCode=1});
