import React,{useEffect,useRef,useState} from 'react';
const ids=['top','approach','work','about','collaboration','contact'];
const labels={ru:['Главная','Подход','Проекты','Обо мне','Сотрудничество','Контакт'],en:['Home','Approach','Work','About','Collaboration','Contact']};
const clamp=v=>Math.max(0,Math.min(1,v));
export default function ScrollRail({lang,blocked}){
 const [state,setState]=useState({progress:0,active:0,percent:0}),stops=useRef([]),dragging=useRef(false),track=useRef(null);
 useEffect(()=>{
  let raf=0,dead=false;
  const update=()=>{raf=0;if(dead)return;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),y=scrollY;
   stops.current=[...ids.map(id=>Math.min(max,Math.max(0,(()=>{const el=document.getElementById(id);return (el?.getBoundingClientRect().top||0)+y-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)-(el?parseFloat(getComputedStyle(el).scrollMarginTop)||0:0)})()))),max];
   let index=0;while(index<ids.length-1&&y>=stops.current[index+1]-2)index++;
   let part=Math.min(ids.length-1,index);if(y>=stops.current[ids.length-1])part=ids.length-1;
   const start=stops.current[part],end=stops.current[part+1];
   setState({progress:clamp((part+clamp((y-start)/Math.max(1,end-start)))/ids.length),active:Math.min(index,ids.length-1),percent:Math.round(clamp(y/max)*100)});
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
  const size=new ResizeObserver(schedule);const main=document.getElementById('main');if(main)size.observe(main);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(()=>{if(!dead)schedule()});update();
  return()=>{dead=true;cancelAnimationFrame(raf);size.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.documentElement.classList.remove('is-scrubbing')};
 },[]);
 const scrub=e=>{const r=track.current.getBoundingClientRect(),p=clamp((e.clientY-r.top)/r.height),n=ids.length,slot=Math.min(n-1,Math.floor(p*n)),t=p*n-slot,a=stops.current[slot]||0,b=stops.current[slot+1]||0;window.scrollTo({top:a+(b-a)*t,behavior:'auto'})};
 const end=()=>{dragging.current=false;document.documentElement.classList.remove('is-scrubbing')};
 const key=e=>{const keys=['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'];if(!keys.includes(e.key))return;e.preventDefault();const max=document.documentElement.scrollHeight-innerHeight,delta=e.key.startsWith('Page')?innerHeight*.8:innerHeight*.25;const target=e.key==='Home'?0:e.key==='End'?max:scrollY+(['ArrowUp','PageUp'].includes(e.key)?-delta:delta);window.scrollTo({top:target,behavior:document.body.classList.contains('motion-paused')?'auto':'smooth'})};
 return <nav className="scroll-rail" aria-label={lang==='ru'?'Навигация по странице':'Page navigation'} hidden={blocked}>
  <div className="rail-track" ref={track}>
   <div className="rail-ticks" aria-hidden="true">{Array.from({length:49},(_,i)=><i key={i} style={{top:`${i/48*100}%`,width:`${7+30*Math.exp(-((i-state.progress*48)**2)/24)}px`}}/>)}<b style={{top:`${state.progress*100}%`}}/></div>
   <div className="rail-scrubber" role="scrollbar" aria-label={lang==='ru'?'Прокрутка страницы':'Page scroll'} aria-controls="main" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.percent} aria-valuetext={`${state.percent}% — ${labels[lang][state.active]}`} tabIndex={0} onKeyDown={key} onPointerDown={e=>{e.preventDefault();dragging.current=true;document.documentElement.classList.add('is-scrubbing');e.currentTarget.setPointerCapture(e.pointerId);scrub(e)}} onPointerMove={e=>{if(dragging.current)scrub(e)}} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}/>
   <div className="rail-links">{ids.map((id,i)=><a href={`#${id}`} key={id} className={state.active===i?'is-active':''} aria-current={state.active===i?'location':undefined} style={{top:`${i/ids.length*100}%`}}>{labels[lang][i]}</a>)}</div>
  </div>
 </nav>;
}
