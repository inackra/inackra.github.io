import React,{useEffect,useRef,useState} from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import Magnetic from '../Magnetic';
import {MockStage} from './Mocks';
import {copy,types,moods,niches,achievements,findNiche,parseShare,shareCode} from './data';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from '../content';
import {homeUrl,shareUrl} from '../routes';
import {ORIGIN} from '../seo';

// Same delivery as the old contact form: a Google Apps Script web app that writes
// a row to Ян's private sheet. Without it the form opens a prepared email instead.
const endpoint=import.meta.env.VITE_ENQUIRY_ENDPOINT||'';
const isEmail=v=>/^\S+@\S+\.\S+$/.test(v);
import './studio.css';

const reduced=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

// Two type families in one line: the last word is set in the italic serif.
function Accent({text}){const i=text.trimEnd().lastIndexOf(' ');return i<0?<em>{text}</em>:<>{text.slice(0,i+1)}<em>{text.slice(i+1)}</em></>}

const glyphs={
 site:'M3 5h18v14H3zM3 9h18M6 7h.01M8.5 7h.01',
 app:'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
 saas:'M3 4h18v16H3zM9 4v16M12 15l2.5-3 2 2L20 9',
 ai:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
 fintech:'M3 6h18v12H3zM3 10h18M7 15h4',
 crypto:'M7 7h12l-3-3M17 17H5l3 3',
 travel:'M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
 health:'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
 ecom:'M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0',
 realty:'M4 11l8-7 8 7v9H4zM10 20v-5h4v5',
 food:'M3 12h18a9 9 0 0 1-18 0zM8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4',
};
function Glyph({id}){return <svg className="opt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={glyphs[id]}/></svg>}
// The mood is shown by its palette: three colours of the finished look.
function Swatch({colors}){return <span className="opt-swatch" aria-hidden="true">{colors.map(c=><i key={c} style={{background:c}}/>)}</span>}

export default function Constructor({lang='ru',paused=false,shared=null}){
 const d=copy[lang],initial=shared!=null?parseShare(shared):null;
 const [step,setStep]=useState(initial?4:0); // 0..2 choices, 3 generating, 4 result
 const [choice,setChoice]=useState(initial?{type:initial.type,mood:initial.mood,niche:initial.niche}:{type:null,mood:null,niche:null});
 const [build,setBuild]=useState(0),[variant,setVariant]=useState(()=>initial?initial.variant:Math.floor(Math.random()*3));
 // A visitor who came by someone's link: the first result is that build, the enquiry says so.
 const [viewing,setViewing]=useState(Boolean(initial));const via=useRef(initial?shared:null);
 const [shareOpen,setShareOpen]=useState(false),[copied,setCopied]=useState(false);
 const [proof,setProof]=useState(0),[phase,setPhase]=useState(0);
 const [form,setForm]=useState({task:'',contact:''}),[status,setStatus]=useState('idle');
 const top=useRef(null),sendForm=useRef(null),pending=useRef(null),timer=useRef(null);
 useEffect(()=>{const receive=e=>{if(!/^https:\/\/(script\.google\.com|[a-z0-9-]+\.googleusercontent\.com)$/.test(e.origin)||e.data?.type!=='inackra-enquiry'||e.data?.id!==pending.current)return;clearTimeout(timer.current);pending.current=null;if(e.data.ok){setStatus('sent');setForm({task:'',contact:''})}else setStatus('failed')};addEventListener('message',receive);return()=>{removeEventListener('message',receive);clearTimeout(timer.current)}},[]);
 const niche=findNiche(choice.niche);
 const label=(list,id)=>list.find(x=>x.id===id)?.[lang]||'';

 // Generation: a few seconds of proof, then the mock-up.
 useEffect(()=>{
  if(step!==3)return;
  const fast=paused||reduced(),total=fast?1200:4600,list=achievements[lang];
  setProof(0);setPhase(0);
  const ticks=[setInterval(()=>setProof(p=>(p+1)%list.length),fast?600:1500),setInterval(()=>setPhase(p=>Math.min(p+1,d.generating.length-1)),total/d.generating.length)];
  // Each build moves to the next layout (the first one is random), so rebuilds never repeat.
  const done=setTimeout(()=>{setBuild(b=>b+1);setVariant(v=>(v+1)%3);setStep(4)},total);
  return()=>{ticks.forEach(clearInterval);clearTimeout(done)};
 },[step,lang,paused,d.generating.length]);

 const scrollTop=()=>requestAnimationFrame(()=>{const el=top.current;if(el&&el.getBoundingClientRect().top<-40)el.scrollIntoView({behavior:reduced()?'auto':'smooth'})});
 const go=n=>{setStep(n);setShareOpen(false);if(n<4&&viewing){setViewing(false);if(location.pathname.includes('/b/'))history.replaceState(null,'',homeUrl(lang))}scrollTop()};
 // Types and moods move on by themselves; a short pause lets the fill land.
 const pick=(key,v,next)=>{setChoice(c=>({...c,[key]:v}));if(next!=null)setTimeout(()=>go(next),reduced()?0:320)};
 const restart=()=>{setChoice({type:null,mood:null,niche:null});setStatus('idle');go(0)};
 const link=step===4&&choice.type?ORIGIN+shareUrl(shareCode(choice,variant),lang):'';
 const shareTo=where=>{const text=d.shareText,u=encodeURIComponent(link),t=encodeURIComponent(text);return {tg:`https://t.me/share/url?url=${u}&text=${t}`,in:`https://www.linkedin.com/sharing/share-offsite/?url=${u}`,x:`https://x.com/intent/post?text=${t}&url=${u}`}[where]};
 const copyLink=async()=>{try{await navigator.clipboard.writeText(link)}catch{const a=document.createElement('textarea');a.value=link;document.body.append(a);a.select();try{document.execCommand('copy')}catch{}a.remove()}setCopied(true);setTimeout(()=>setCopied(false),2200)};
 const nativeShare=()=>navigator.share?.({title:'INACKRA',text:d.shareText,url:link}).catch(()=>{});
 const submit=e=>{
  e.preventDefault();if(status==='sending')return;
  const task=form.task.trim(),contact=form.contact.trim();
  if(task.length<10||!isEmail(contact)){setStatus('invalid');return}
  const brief=[label(types,choice.type),label(moods,choice.mood),label(niches,choice.niche)].join(' / ');
  const ref=via.current?`\n${lang==='ru'?'Пришёл по ссылке':'Came via shared link'}: ${ORIGIN}${shareUrl(via.current,lang)}`:'';
  const message=`${lang==='ru'?'Сборка':'Build'}: ${brief}${ref}\n\n${task}`;
  if(!endpoint){location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(lang==='ru'?'Заявка с конструктора':'Constructor enquiry')}&body=${encodeURIComponent(`${message}\n\n${contact}`)}`;return}
  const f=sendForm.current,id=crypto.randomUUID?.()||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  f.elements.requestId.value=id;f.elements.email.value=contact;f.elements.message.value=message;f.elements.lang.value=lang;
  pending.current=id;setStatus('sending');f.submit();
  timer.current=setTimeout(()=>{pending.current=null;setStatus('failed')},25000);
 };

 const row=(key,list,next,icon)=><div className={`studio-options options-${key}`} role="group" aria-label={d.steps[step]}>
  {list.map((o,i)=><Magnetic key={o.id} type="button" active={choice[key]===o.id} aria-pressed={choice[key]===o.id} onClick={()=>pick(key,o.id,next)} style={{'--i':i}} title={o.noteRu?(lang==='ru'?o.noteRu:o.noteEn):undefined}>{icon(o)}<span>{o[lang]}</span></Magnetic>)}
 </div>;

 return <section id="top" className={`studio studio-${lang} studio-step-${step}`} ref={top}>
  {step<3&&<div className="studio-hero">
   <h1><span data-motion-text="true" data-motion-state="waiting">{d.title[0]}</span> <span className="accent" data-motion-text="true" data-motion-state="waiting"><em>{d.title[1]}</em></span></h1>
   <p className="studio-text" data-motion-text="true" data-motion-state="waiting">{d.text}</p>
   <div className="studio-step" key={step}>
    <h2 className="studio-question"><Accent text={d.steps[step]}/></h2>
    {step===0&&row('type',types,1,o=><Glyph id={o.id}/>)}
    {step===1&&row('mood',moods,2,o=><Swatch colors={o.swatch}/>)}
    {step===2&&<>{row('niche',niches,null,o=><Glyph id={o.id}/>)}
     <div className="studio-build"><Magnetic type="button" className="mag-solid" disabled={!choice.niche} onClick={()=>go(3)}><span>{d.build}</span><Arrow/></Magnetic></div></>}
    {step>0&&<button type="button" className="studio-back" onClick={()=>go(step-1)}><Arrow left/><FlipText>{d.back}</FlipText></button>}
   </div>
  </div>}

  {step===3&&<div className="studio-gen" role="status" aria-live="polite">
   <span className="gen-meanwhile">{d.meanwhile}</span>
   <div className="gen-proof" key={proof}><strong>{achievements[lang][proof][0]}</strong><span>{achievements[lang][proof][1]}</span></div>
   <div className="gen-bar"><i style={{animationDuration:`${paused||reduced()?1.2:4.6}s`}}/></div>
   <span className="gen-phase" key={`p${phase}`}>{d.generating[phase]}…</span>
  </div>}

  {step===4&&<div className="studio-result">
   {viewing?<div className="result-head result-shared">
    <div><h1 className="result-title"><Accent text={d.sharedTitle}/></h1><p className="result-shared-text">{d.sharedText}</p></div>
    <div className="result-actions"><Magnetic type="button" className="mag-small mag-solid" onClick={restart}><span>{d.buildOwn}</span><Arrow/></Magnetic><Magnetic type="button" className="mag-small" onClick={()=>{const el=document.querySelector('.order');el?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});setTimeout(()=>document.querySelector('.order-form textarea')?.focus({preventScroll:true}),reduced()?0:700)}}><span>{d.wantThis}</span></Magnetic></div>
   </div>:<div className="result-head">
    <h2 className="result-title"><Accent text={d.summary}/></h2>
    <div className="result-actions"><span className="result-hint">{d.hint}</span><Magnetic type="button" className="mag-small mag-solid" onClick={()=>go(3)}><span>{d.another}</span></Magnetic><Magnetic type="button" className="mag-small" onClick={restart}><span>{d.restart}</span><Arrow/></Magnetic>
    </div>
   </div>}
   <div className="result-stage">
   <MockStage key={build} type={choice.type} mood={choice.mood} niche={niche} paused={paused} variant={variant}/>
   {!viewing&&<div className="share share-below"><Magnetic type="button" className="mag-solid share-btn" aria-expanded={shareOpen} aria-controls="share-menu" onClick={()=>setShareOpen(o=>!o)}><span>{d.share}</span></Magnetic>
      {shareOpen&&<div className="share-menu" id="share-menu" role="menu">
       <button type="button" role="menuitem" onClick={copyLink}>{copied?d.shareCopied:d.shareCopy}</button>
       <a role="menuitem" href={shareTo('tg')} target="_blank" rel="noreferrer">Telegram</a>
       <a role="menuitem" href={shareTo('in')} target="_blank" rel="noreferrer">LinkedIn</a>
       <a role="menuitem" href={shareTo('x')} target="_blank" rel="noreferrer">X</a>
       {typeof navigator!=='undefined'&&navigator.share&&<button type="button" role="menuitem" onClick={nativeShare}>{d.shareMore}</button>}
       <span className="share-url">{link.replace('https://','')}</span>
      </div>}
   </div>}
   </div>
   <div className="order">
    <div className="order-copy"><h2>{d.order[0]}<br/><em>{d.order[1]}</em></h2><p>{d.orderText}</p><ul className="order-promise">{d.promise.map(x=><li key={x}>{x}</li>)}</ul></div>
    {status==='sent'
     ?<div className="order-sent"><h3>{d.sentTitle}</h3><p>{d.sentText}</p><div className="order-sent-actions"><Magnetic as="a" className="mag-solid" href="#more"><span>{d.seeWork}</span><Arrow/></Magnetic><Magnetic type="button" onClick={restart}><span>{d.playMore}</span></Magnetic></div></div>
     :<form className="order-form" onSubmit={submit} noValidate>
      <div className="order-brief"><span>{d.brief}</span>{[label(types,choice.type),label(moods,choice.mood),label(niches,choice.niche)].map(x=><b key={x}>{x}</b>)}</div>
      <label>{d.task}<textarea rows={3} maxLength={2000} placeholder={d.taskHint} value={form.task} onChange={e=>{setForm({...form,task:e.target.value});setStatus('idle')}}/></label>
      <label>{d.contact}<input maxLength={200} type="email" autoComplete="email" placeholder="you@mail.com" value={form.contact} onChange={e=>{setForm({...form,contact:e.target.value});setStatus('idle')}}/></label>
      <div className="order-submit"><Magnetic type="submit" className="mag-solid"><span>{d.send}</span><Arrow/></Magnetic><span className={`order-status ${status}`} role="status">{status==='invalid'?d.required:status==='sending'?d.sending:status==='failed'?<>{d.failed} <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>:endpoint?d.privacy:d.mailNote}</span></div>
      <p className="order-direct">{lang==='ru'?'Или напиши напрямую:':'Or write directly:'} <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · <a href={TELEGRAM} target="_blank" rel="noreferrer">Telegram {TELEGRAM_HANDLE}</a></p>
     </form>}
    {endpoint&&<form ref={sendForm} action={endpoint} method="POST" target="constructor-send" hidden aria-hidden="true"><input name="requestId"/><input name="intent" defaultValue="project"/><input name="name" defaultValue="Constructor"/><input name="email"/><textarea name="message"/><input name="lang"/><input name="website"/></form>}
    {endpoint&&<iframe name="constructor-send" title="send" hidden/>}
   </div>
  </div>}
 </section>;
}
