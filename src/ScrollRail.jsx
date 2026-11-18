import React,{useEffect,useRef,useState} from 'react';
import {scrollTo,blockScroll} from './scroll';
import {clampProgress,dragTarget} from './railMath';
const ids=['top','approach','work','about','collaboration','contact'];
const labels={ru:['Главная','Подход','Проекты','Обо мне','Сотрудничество','Контакт'],en:['Home','Approach','Work','About','Collaboration','Contact']};
export default function ScrollRail({lang,blocked}){
 const [state,setState]=useState({progress:0,active:0,percent:0});
 const track=useRef(null),drag=useRef(null),geometry=useRef({max:1,stops:[]});
 const finish=()=>{
  if(!drag.current)return;
  drag.current=null;document.documentElement.classList.remove('is-scrubbing');
  if(!blocked)blockScroll(false);dispatchEvent(new Event('rail-scrub-end'));
 };
 useEffect(()=>{
  let raf=0,dead=false;
  function update(){raf=0;if(dead)return;const {max,stops}=geometry.current,p=clampProgress(scrollY/max);let active=0;stops.forEach((v,i)=>{if(scrollY>=v-8)active=i});setState({progress:p,percent:Math.round(p*100),active})}
  function schedule(){if(!raf)raf=requestAnimationFrame(update)}
  function measure(){
   if(drag.current)return;
   const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
   geometry.current={max,stops:ids.map(id=>{const el=document.getElementById(id);return el?Math.max(0,Math.min(max,el.getBoundingClientRect().top+scrollY-96)):max})};schedule();
  }
  const observer=new ResizeObserver(measure),main=document.getElementById('main');if(main)observer.observe(main);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('rail-scrub-end',measure);document.fonts.ready.then(()=>{if(!dead)measure()});measure();
  return()=>{dead=true;observer.disconnect();cancelAnimationFrame(raf);removeEventListener('scroll',schedule);removeEventListener('resize',measure);removeEventListener('rail-scrub-end',measure);finish()};
 },[]);
 useEffect(()=>{if(blocked)finish()},[blocked]);
 const scrub=e=>{const gesture=drag.current;if(!gesture||gesture.id!==e.pointerId)return;e.preventDefault();scrollTo(dragTarget(e.clientY,gesture),{immediate:true})};
 const start=e=>{
  if(e.button!==0||blocked)return;e.preventDefault();
  const r=track.current.getBoundingClientRect(),max=geometry.current.max,p=clampProgress(scrollY/max);
  drag.current={id:e.pointerId,top:r.top,height:Math.max(1,r.height),max,startY:e.clientY,startProgress:p,relative:e.pointerType==='touch'||Math.abs(e.clientY-(r.top+p*r.height))<24};
  document.documentElement.classList.add('is-scrubbing');blockScroll(true);dispatchEvent(new Event('rail-scrub-start'));e.currentTarget.setPointerCapture(e.pointerId);scrub(e);
 };
 const key=e=>{if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))return;e.preventDefault();const delta=innerHeight*(e.key.startsWith('Page')?.8:.25);scrollTo(e.key==='Home'?0:e.key==='End'?geometry.current.max:scrollY+(['ArrowUp','PageUp'].includes(e.key)?-delta:delta))};
 return <nav className="scroll-rail" aria-label={lang==='ru'?'Навигация по странице':'Page navigation'} hidden={blocked}><div className="rail-track" ref={track}>
  <div className="rail-ticks" aria-hidden="true">{Array.from({length:49},(_,i)=><i key={i} style={{top:`${i/48*100}%`,width:`${7+30*Math.exp(-((i-state.progress*48)**2)/24)}px`}}/>)}<b style={{top:`${state.progress*100}%`}}/></div>
  <div className="rail-scrubber" role="scrollbar" aria-label={lang==='ru'?'Прокрутка страницы':'Page scroll'} aria-controls="main" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.percent} tabIndex={blocked?-1:0} onKeyDown={key} onPointerDown={start} onPointerMove={scrub} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}/>
  <div className="rail-links">{ids.map((id,i)=><a href={`#${id}`} key={id} className={state.active===i?'is-active':''} aria-current={state.active===i?'location':undefined} style={{top:`${i/(ids.length-1)*100}%`}}>{labels[lang][i]}</a>)}</div>
 </div></nav>;
}
