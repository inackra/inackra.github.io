import React,{useEffect,useRef,useState} from 'react';
import {scrollTo} from './scroll';
const ids=['top','approach','work','about','collaboration','contact'];
const labels={ru:['Главная','Подход','Проекты','Обо мне','Сотрудничество','Контакт'],en:['Home','Approach','Work','About','Collaboration','Contact']};
const clamp=v=>Math.max(0,Math.min(1,v));
export default function ScrollRail({lang,blocked}){
 const [state,setState]=useState({progress:0,active:0,percent:0,stops:[]});
 const track=useRef(null),drag=useRef(null),frame=useRef(0),pending=useRef(null),geometry=useRef({max:1,stops:[]});
 useEffect(()=>{
  let raf=0,dead=false;
  const measure=()=>{if(drag.current)return;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);geometry.current={max,stops:ids.map(id=>Math.max(0,Math.min(max,(document.getElementById(id)?.getBoundingClientRect().top||0)+scrollY-96)))};schedule()};
  const update=()=>{raf=0;if(dead)return;const {max,stops}=geometry.current,p=clamp(scrollY/max);let active=0;stops.forEach((v,i)=>{if(scrollY>=v-8)active=i});setState({progress:p,percent:Math.round(p*100),active,stops:stops.map(y=>y/max)})};
  function schedule(){if(!raf)raf=requestAnimationFrame(update)}
  const observer=new ResizeObserver(measure);const main=document.getElementById('main');if(main)observer.observe(main);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});document.fonts.ready.then(()=>{if(!dead)measure()});measure();
  return()=>{dead=true;observer.disconnect();cancelAnimationFrame(raf);cancelAnimationFrame(frame.current);removeEventListener('scroll',schedule);removeEventListener('resize',measure);document.documentElement.classList.remove('is-scrubbing')};
 },[]);
 const scrub=e=>{const g=drag.current;if(!g)return;pending.current=clamp((e.clientY-g.top-g.offset)/g.height)*g.max;if(!frame.current)frame.current=requestAnimationFrame(()=>{frame.current=0;scrollTo(pending.current,{immediate:true})})};
 const end=()=>{if(!drag.current)return;if(pending.current!==null)scrollTo(pending.current,{immediate:true});drag.current=null;pending.current=null;cancelAnimationFrame(frame.current);frame.current=0;document.documentElement.classList.remove('is-scrubbing');dispatchEvent(new Event('rail-scrub-end'))};
 const key=e=>{if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))return;e.preventDefault();const delta=innerHeight*(e.key.startsWith('Page')?.8:.25);scrollTo(e.key==='Home'?0:e.key==='End'?geometry.current.max:scrollY+(['ArrowUp','PageUp'].includes(e.key)?-delta:delta))};
 return <nav className="scroll-rail" aria-label={lang==='ru'?'Навигация по странице':'Page navigation'} hidden={blocked}><div className="rail-track" ref={track}>
  <div className="rail-ticks" aria-hidden="true">{Array.from({length:49},(_,i)=><i key={i} style={{top:`${i/48*100}%`,width:`${7+30*Math.exp(-((i-state.progress*48)**2)/24)}px`}}/>)}<b style={{top:`${state.progress*100}%`}}/></div>
  <div className="rail-scrubber" role="scrollbar" aria-label={lang==='ru'?'Прокрутка страницы':'Page scroll'} aria-controls="main" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.percent} tabIndex={0} onKeyDown={key} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();const r=track.current.getBoundingClientRect(),thumb=r.top+state.progress*r.height;drag.current={top:r.top,height:r.height,max:geometry.current.max,offset:Math.abs(e.clientY-thumb)<24?e.clientY-thumb:0};document.documentElement.classList.add('is-scrubbing');e.currentTarget.setPointerCapture(e.pointerId);scrub(e)}} onPointerMove={scrub} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}/>
  <div className="rail-links">{ids.map((id,i)=><a href={`#${id}`} key={id} className={state.active===i?'is-active':''} aria-current={state.active===i?'location':undefined} style={{top:`${(state.stops[i]||0)*100}%`}}>{labels[lang][i]}</a>)}</div>
 </div></nav>;
}
