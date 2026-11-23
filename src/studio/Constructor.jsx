import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import {MockStage} from './Mocks';
import {copy,types,moods,niches,presets,achievements,findNiche} from './data';
import '@fontsource/cormorant-garamond/500-italic.css';
import './studio.css';

const STEPS=['type','mood','niche'];
const reduced=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

// Two type families in one line: the last word is set in the italic serif.
function Accent({text}){const i=text.trimEnd().lastIndexOf(' ');return i<0?<em>{text}</em>:<>{text.slice(0,i+1)}<em>{text.slice(i+1)}</em></>}

// Options with a highlight that slides to the chosen one.
function Picker({options,value,onChange,variant,lang,render}){
 const wrap=useRef(null),[box,setBox]=useState(null);
 useLayoutEffect(()=>{
  const el=wrap.current;if(!el)return;
  const place=()=>{const b=el.querySelector('[aria-pressed="true"]');setBox(b?{x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}:null)};
  place();const ro=new ResizeObserver(place);ro.observe(el);return()=>ro.disconnect();
 },[value,options]);
 return <div className={`picker picker-${variant}`} ref={wrap} role="group">
  <span className="picker-glow" aria-hidden="true" style={box?{transform:`translate(${box.x}px,${box.y}px)`,width:box.w,height:box.h,opacity:1}:{opacity:0}}/>
  {options.map((o,i)=><button type="button" key={o.id} aria-pressed={value===o.id} onClick={()=>onChange(o.id)} style={{'--i':i}}>{render(o,i)}</button>)}
 </div>;
}

function TypeViz({id}){
 if(id==='site')return <svg viewBox="0 0 120 80" className="viz" aria-hidden="true"><rect x="2" y="2" width="116" height="76" rx="6"/><path d="M2 14h116"/><circle cx="9" cy="8" r="1.6"/><circle cx="15" cy="8" r="1.6"/><path className="viz-line a" d="M12 30h46"/><path className="viz-line b" d="M12 39h36"/><rect className="viz-fill" x="12" y="50" width="22" height="9" rx="4.5"/><rect className="viz-card" x="70" y="24" width="38" height="44" rx="4"/></svg>;
 if(id==='app')return <svg viewBox="0 0 120 80" className="viz" aria-hidden="true"><rect x="40" y="2" width="40" height="76" rx="9"/><path d="M54 7h12"/><rect className="viz-card" x="46" y="16" width="28" height="20" rx="4"/><path className="viz-line a" d="M46 44h28"/><path className="viz-line b" d="M46 52h20"/><path className="viz-line a" d="M46 60h24"/><circle cx="50" cy="71" r="1.6"/><circle cx="60" cy="71" r="1.6"/><circle cx="70" cy="71" r="1.6"/></svg>;
 return <svg viewBox="0 0 120 80" className="viz" aria-hidden="true"><rect x="2" y="2" width="116" height="76" rx="6"/><path d="M30 2v76"/><path className="viz-line a" d="M8 14h16M8 22h12M8 30h14"/><rect className="viz-card" x="38" y="12" width="22" height="16" rx="3"/><rect className="viz-card" x="64" y="12" width="22" height="16" rx="3"/><rect className="viz-card" x="90" y="12" width="22" height="16" rx="3"/><path className="viz-chart" d="M38 66c10-4 14-18 24-16s14 10 24 2 14-14 26-16"/></svg>;
}
function MoodViz({id}){return <span className={`mood-viz mood-viz-${id}`} aria-hidden="true"><span className="mv-aa">Aa</span><i/><i/><i/></span>}

export default function Constructor({lang='ru',paused=false}){
 const d=copy[lang];
 const [step,setStep]=useState(0); // 0..2 choices, 3 generating, 4 result
 const [choice,setChoice]=useState({type:null,mood:null,niche:null});
 const [build,setBuild]=useState(0);
 const [proof,setProof]=useState(0),[phase,setPhase]=useState(0);
 const [form,setForm]=useState({task:'',contact:''}),[status,setStatus]=useState('idle');
 const top=useRef(null);
 const key=STEPS[step],niche=findNiche(choice.niche);
 const label=(list,id)=>list.find(x=>x.id===id)?.[lang]||'';

 // Generation: a few seconds of proof, then the mock-up.
 useEffect(()=>{
  if(step!==3)return;
  const fast=paused||reduced(),total=fast?1200:4600,list=achievements[lang];
  setProof(0);setPhase(0);
  const ticks=[setInterval(()=>setProof(p=>(p+1)%list.length),fast?600:1500),setInterval(()=>setPhase(p=>Math.min(p+1,d.generating.length-1)),total/d.generating.length)];
  const done=setTimeout(()=>{setBuild(b=>b+1);setStep(4)},total);
  return()=>{ticks.forEach(clearInterval);clearTimeout(done)};
 },[step,lang,paused,d.generating.length]);

 // While the wide result is on screen the side rail steps aside.
 useEffect(()=>{
  const el=top.current,html=document.documentElement;if(!el||step<3){html.classList.remove('studio-focus');return}
  const io=new IntersectionObserver(([e])=>html.classList.toggle('studio-focus',e.isIntersecting&&e.intersectionRatio>.15),{threshold:[0,.15,.3]});
  io.observe(el);return()=>{io.disconnect();html.classList.remove('studio-focus')};
 },[step]);

 const scrollTop=()=>requestAnimationFrame(()=>{const el=top.current;if(el&&el.getBoundingClientRect().top<-40)el.scrollIntoView({behavior:reduced()?'auto':'smooth'})});
 const go=n=>{setStep(n);scrollTop()};
 const pick=v=>setChoice(c=>({...c,[key]:v}));
 const usePreset=p=>{setChoice({type:p.type,mood:p.mood,niche:p.niche});go(3)};
 const restart=()=>{setChoice({type:null,mood:null,niche:null});setStatus('idle');go(0)};
 const submit=e=>{
  e.preventDefault();
  if(form.task.trim().length<3||form.contact.trim().length<3){setStatus('invalid');return}
  // The handler (e.g. Cloudflare Worker → Telegram bot) is connected later.
  const payload={...choice,task:form.task.trim(),contact:form.contact.trim(),lang,source:'constructor'};
  if(typeof console!=='undefined')console.info('[constructor] enquiry (not sent, demo)',payload);
  setStatus('sent');setForm({task:'',contact:''});
 };

 const options=key==='type'?types:key==='mood'?moods:niches;
 const ready=key&&choice[key];
 return <section id="top" className={`studio studio-${lang} studio-step-${step}`} ref={top}>
  <div className="studio-topline"><span data-motion-text="true" data-motion-state="waiting">{d.label}</span>{step<3&&<span className="studio-count">{String(step+1).padStart(2,'0')} / 03</span>}</div>

  {step<3&&<>
   <div className="studio-intro">
    <h1><span className="studio-line" data-motion-text="true" data-motion-state="waiting">{d.title[0]}</span><span className="studio-line accent" data-motion-text="true" data-motion-state="waiting"><em>{d.title[1]}</em></span></h1>
    <p data-motion-text="true" data-motion-state="waiting">{d.text}</p>
   </div>
   <div className="studio-progress" aria-hidden="true">{STEPS.map((s,i)=><span key={s} className={i<step?'done':i===step?'on':''}><i/>{d.steps[i]}</span>)}</div>
   <div className="studio-step" key={key}>
    <h2 className="studio-question"><Accent text={d.steps[step]}/></h2>
    <Picker options={options} value={choice[key]} onChange={pick} lang={lang} variant={key==='niche'?'chips':'cards'} render={(o,i)=>key==='niche'
     ?<span className="chip-label">{o[lang]}</span>
     :<span className="opt"><span className="opt-top"><span className="opt-index">0{i+1}</span>{key==='type'?<TypeViz id={o.id}/>:<MoodViz id={o.id}/>}</span><span className="opt-title">{o[lang]}</span><span className="opt-note">{lang==='ru'?o.noteRu:o.noteEn}</span></span>}/>
    <div className="studio-nav">
     {step>0?<button type="button" className="text-action" onClick={()=>go(step-1)}><Arrow left/><FlipText>{d.back}</FlipText></button>:<span/>}
     <button type="button" className="button solid" disabled={!ready} onClick={()=>go(step+1)}><FlipText>{step===2?d.build:d.next}</FlipText><Arrow/></button>
    </div>
   </div>
   {step===0&&<div className="studio-presets"><span>{d.presets}</span><div>{presets.map(p=><button type="button" key={p.ru} className="preset" onClick={()=>usePreset(p)}>{p[lang]}<Arrow/></button>)}</div></div>}
  </>}

  {step===3&&<div className="studio-gen" role="status" aria-live="polite">
   <div className="gen-summary">{[label(types,choice.type),label(moods,choice.mood),label(niches,choice.niche)].map(x=><span key={x}>{x}</span>)}</div>
   <span className="gen-meanwhile">{d.meanwhile}</span>
   <div className="gen-proof" key={proof}><strong>{achievements[lang][proof][0]}</strong><span>{achievements[lang][proof][1]}</span></div>
   <div className="gen-bar"><i style={{animationDuration:`${paused||reduced()?1.2:4.6}s`}}/></div>
   <span className="gen-phase" key={`p${phase}`}>{d.generating[phase]}…</span>
  </div>}

  {step===4&&<div className="studio-result">
   <div className="result-head">
    <div className="result-title"><span>{d.summary}</span><div className="gen-summary">{[label(types,choice.type),label(moods,choice.mood),label(niches,choice.niche)].map(x=><span key={x}>{x}</span>)}</div></div>
    <div className="result-actions"><span className="result-hint">{d.hint}</span><button type="button" className="text-action" onClick={()=>go(0)}><FlipText>{d.edit}</FlipText></button><button type="button" className="text-action" onClick={restart}><FlipText>{d.restart}</FlipText><Arrow/></button></div>
   </div>
   <div className="studio-wide"><MockStage key={build} type={choice.type} mood={choice.mood} niche={niche} paused={paused}/>
   <div className="order">
    <div className="order-copy"><h2>{d.order[0]}<br/><em>{d.order[1]}</em></h2><p>{d.orderText}</p></div>
    {status==='sent'
     ?<div className="order-sent"><h3>{d.sentTitle}</h3><p>{d.sentText}</p><div className="order-sent-actions"><a className="button solid" href="#work"><FlipText>{d.seeWork}</FlipText><Arrow/></a><button type="button" className="text-action" onClick={restart}><FlipText>{d.playMore}</FlipText><Arrow/></button></div></div>
     :<form className="order-form" onSubmit={submit} noValidate>
      <label>{d.task}<textarea rows={3} maxLength={2000} placeholder={d.taskHint} value={form.task} onChange={e=>{setForm({...form,task:e.target.value});setStatus('idle')}}/></label>
      <label>{d.contact}<input maxLength={200} autoComplete="email" placeholder="you@mail.com / @telegram" value={form.contact} onChange={e=>{setForm({...form,contact:e.target.value});setStatus('idle')}}/></label>
      <div className="order-submit"><button className="button solid" type="submit"><FlipText>{d.send}</FlipText><Arrow/></button><span className={`order-status ${status}`} role="status">{status==='invalid'?d.required:d.demoNote}</span></div>
     </form>}
   </div></div>
  </div>}
 </section>;
}
