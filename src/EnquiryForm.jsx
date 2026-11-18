import React,{useState,useRef,useEffect,useId} from 'react';
import FlipText from './FlipText';
import Arrow from './Arrow';
import {EMAIL} from './content';
const endpoint=import.meta.env.VITE_ENQUIRY_ENDPOINT||'';
const copy={ru:{name:'Как тебя зовут',contact:'Email для ответа',message:'Расскажи о задаче',submit:'Отправить заявку',sending:'Отправляем…',sent:'Спасибо! Заявка получена. Отвечу на указанный email.',error:'Не удалось подтвердить отправку. Попробуй ещё раз или напиши на email.',email:'Открыть письмо',hint:'Имя, email и сообщение будут использованы для ответа на заявку.',fallback:'Откроется почта с подготовленным письмом.',project:'У меня проект',role:'Предлагаю роль'},en:{name:'Your name',contact:'Your email',message:'Tell me about the opportunity',submit:'Send enquiry',sending:'Sending…',sent:'Thank you! Your enquiry was received. I’ll reply to your email.',error:'Could not confirm delivery. Please retry or contact me by email.',email:'Open email',hint:'Your name, email and message will be used to respond to your enquiry.',fallback:'Opens your email app with a prepared message.',project:'I have a project',role:'I’m hiring'}};
export default function EnquiryForm({lang,intent,setIntent}){
 const d=copy[lang],id=useId().replace(/\W/g,''),frameName=`enquiry-${id}`,iframe=useRef(null),form=useRef(null),active=useRef(null),timer=useRef(null);const [state,setState]=useState('idle'),[values,setValues]=useState({name:'',email:'',message:''});
 const request=useRef('');
 useEffect(()=>{const receive=e=>{if(!/^https:\/\/(script\.google\.com|[a-z0-9-]+\.googleusercontent\.com)$/.test(e.origin)||e.data?.type!=='inackra-enquiry'||e.data?.id!==active.current)return;clearTimeout(timer.current);active.current=null;setState(e.data.ok?'sent':'error');if(e.data.ok){form.current?.reset();setValues({name:'',email:'',message:''})}};addEventListener('message',receive);return()=>{removeEventListener('message',receive);clearTimeout(timer.current)}},[]);
 const submit=e=>{e.preventDefault();if(state==='sending')return;
  if(!endpoint){location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(intent==='project'?'Project enquiry':'Role enquiry')}&body=${encodeURIComponent(`${values.name}\n${values.email}\n\n${values.message}`)}`;return}
  request.current=crypto.randomUUID();form.current.elements.requestId.value=request.current;form.current.elements.intent.value=intent;active.current=request.current;setState('sending');form.current.submit();timer.current=setTimeout(()=>{active.current=null;setState('error')},25000);
 };
 return <form className="message-form enquiry-form" ref={form} action={endpoint||undefined} method="POST" target={frameName} onSubmit={submit}>
  <div className="intent-tabs" data-motion-text="true" data-motion-state="waiting" role="group" aria-label={lang==='ru'?'Повод обращения':'Enquiry type'}>{['project','role'].map(x=><button type="button" key={x} aria-pressed={intent===x} onClick={()=>setIntent(x)}><FlipText>{d[x]}</FlipText></button>)}</div>
  <input type="hidden" name="requestId"/><input type="hidden" name="intent"/><input type="hidden" name="lang" value={lang}/>
  <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  {['name','email'].map(field=><label data-motion-text="true" data-motion-state="waiting" key={field} htmlFor={`${id}-${field}`}>{d[field==='email'?'contact':'name']}<input id={`${id}-${field}`} name={field} type={field==='email'?'email':'text'} required maxLength={field==='name'?120:254} autoComplete={field==='name'?'name':'email'} value={values[field]} onChange={e=>setValues({...values,[field]:e.target.value})}/></label>)}
  <label data-motion-text="true" data-motion-state="waiting" htmlFor={`${id}-message`}>{d.message}<textarea id={`${id}-message`} name="message" required minLength={10} maxLength={3000} rows={4} value={values.message} onChange={e=>setValues({...values,message:e.target.value})}/></label>
  <button data-motion-text="true" data-motion-state="waiting" className="button solid" type="submit" disabled={state==='sending'}><FlipText>{state==='sending'?d.sending:endpoint?d.submit:d.email}</FlipText><Arrow/></button>
  <p className={`enquiry-status status-${state}`} role="status">{state==='sent'?d.sent:state==='error'?d.error:endpoint?d.hint:d.fallback}</p>
  <p className="form-privacy"><a href="/privacy/">{lang==='ru'?'Политика конфиденциальности':'Privacy policy'}</a></p>
  {state==='error'&&<a className="text-action" href={`mailto:${EMAIL}`}>{EMAIL}<Arrow/></a>}
  {endpoint&&<iframe name={frameName} ref={iframe} title="Enquiry delivery" className="enquiry-frame"/>}
 </form>;
}
