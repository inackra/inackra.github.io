import React,{useEffect,useState} from 'react';
import './boot.css';
const timed=(promise,ms=12000)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))]);
function asset(url){return timed(new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>img.decode().catch(()=>{}).then(resolve);img.onerror=reject;img.src=url}))}
export default function Boot({onComplete}){
 const [progress,setProgress]=useState(0),[error,setError]=useState(false),[bits,setBits]=useState('');
 useEffect(()=>{let dead=false,timer;const animation=setInterval(()=>setBits(Array.from({length:300},()=>Math.random()>.5?'1':'0').join(' ')),90);let done=0;const tasks=[Promise.resolve(),timed(document.fonts.load('500 16px "Manrope Variable"').then(()=>document.fonts.ready),8000),asset('/assets/inackra.svg'),asset('/assets/cases/semrush/00.webp'),asset('/assets/covers/aio.png'),asset('/assets/cases/buburuza/07.webp')];
  const tracked=tasks.map(p=>p.finally(()=>{done++;if(!dead)setProgress(Math.round(done/tasks.length*100))}));
  Promise.allSettled(tracked).then(results=>{if(dead)return;if(results[0].status==='rejected'){setError(true);return}timer=setTimeout(()=>{if(!dead)onComplete()},250)});
  return()=>{dead=true;clearInterval(animation);clearTimeout(timer)};
 },[onComplete]);
 return <div className="boot-screen" role="status" aria-live="polite"><div className="boot-mark" style={{'--load':progress/100}}><div className="boot-bits" aria-hidden="true">{bits}</div><img src="/assets/inackra.svg" alt="INACKRA" width="300" height="62"/></div>{error?<div className="boot-error"><p>Не удалось загрузить сайт / Couldn’t load the site.</p><button onClick={()=>location.reload()}>Повторить / Retry</button></div>:<div className="boot-progress"><span className="sr-only">Загрузка / Loading </span><span aria-hidden="true">{String(progress).padStart(3,'0')}%</span><progress max="100" value={progress} aria-label="Загрузка сайта / Loading website"/></div>}</div>;
}
