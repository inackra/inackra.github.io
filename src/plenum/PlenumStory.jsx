import React,{useEffect,useRef,useState} from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import {scrollTo} from '../scroll';
import {projectCovers,plenumEvidence} from '../projectMedia';
import {getPlenumTasks,resolvePlenumTask,taskIds} from './story';
import PlenumScenes from './PlenumScenes';
import '../aio/aio-story.css';
import './plenum.css';
const text=(lang,ru,en)=>lang==='en'?en:ru;
function TaskNavigation({tasks,active,onSelect,lang,bottom=false}){
 const ref=useRef(null);
 const keys=e=>{if(e.target.tagName!=='BUTTON'||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=taskIds.indexOf(e.target.dataset.task),id=taskIds[e.key==='Home'?0:e.key==='End'?taskIds.length-1:(i+(e.key==='ArrowLeft'?-1:1)+taskIds.length)%taskIds.length];onSelect(id,false);ref.current.querySelector(`[data-task="${id}"]`).focus()};
 return <nav ref={ref} className={`aio-task-navigation ${bottom?'aio-task-navigation-bottom':''}`} aria-label={text(lang,'Сценарии Plenum','Plenum workflows')} onKeyDown={keys}><p>{bottom?text(lang,'Как задача связана с проектом','How this task connects to the project'):text(lang,'Задачи и сценарии','Challenges and workflows')}</p><div className="archive-filters" role="group" aria-label={text(lang,'Выбор задачи','Choose a task')}>{tasks.map(task=><button key={task.id} data-task={task.id} aria-pressed={task.id===active} aria-controls="plenum-task-panel" onClick={()=>onSelect(task.id,bottom)}><FlipText>{task.label}</FlipText></button>)}</div></nav>;
}
export default function PlenumStory({lang='ru',paused=false,initialTask}){
 const tasks=getPlenumTasks(lang),[active,setActive]=useState(()=>resolvePlenumTask(initialTask??(typeof location==='undefined'?'':location.hash))),panel=useRef(null),task=tasks.find(t=>t.id===active);
 useEffect(()=>{const restore=()=>setActive(resolvePlenumTask(location.hash));addEventListener('hashchange',restore);addEventListener('popstate',restore);return()=>{removeEventListener('hashchange',restore);removeEventListener('popstate',restore)}},[]);
 useEffect(()=>{document.title=`${task.label} — Plenum / INACKRA`},[task.label]);
 const select=(id,scroll=false)=>{setActive(id);if(location.hash!==`#task=${id}`)history.pushState({plenumTask:id},'',`#task=${id}`);if(scroll)requestAnimationFrame(()=>{scrollTo(panel.current,{offset:-100,immediate:paused});panel.current.focus({preventScroll:true})})};
 return <div className={`aio-study plenum-study ${paused?'motion-paused':''}`}>
  <section className="aio-project-intro archive-page"><p className="eyebrow">Founder / Product Designer / AI-assisted Builder</p><h1>Plenum.</h1><p className="archive-intro">{text(lang,'Рабочая среда для понимания сложного цифрового продукта.','A workspace for understanding complex digital products.')}</p><p className="aio-project-context">{text(lang,'Я спроектировал продукт, его интерфейс и поведение, организовал разработку с AI и выстроил проверку качества. Требования, решения, задачи и код становятся общей моделью, в которой можно проверить происхождение каждого вывода.','I designed the product, interface and behaviour, directed its AI-assisted development and established a quality evaluation process. Requirements, decisions, tasks and code form a shared model in which the basis of each conclusion can be inspected.')}</p><p className="plenum-status">{text(lang,'Независимый продукт в разработке · инженерный срез 17 ноября 2026','Independent product in development · engineering snapshot: 17 November 2026')}</p></section>
  <figure className="project-cover"><img src={projectCovers.plenum.path} width="1080" height="1080" alt={text(lang,'Plenum — визуальное направление холста и выбора контекста','Plenum — canvas and context selection visual direction')} decoding="async"/></figure>
  <TaskNavigation tasks={tasks} active={active} onSelect={select} lang={lang}/>
  <article ref={panel} id="plenum-task-panel" tabIndex={-1} className="aio-task-panel privacy-page" aria-labelledby="plenum-task-title">
   <div className="aio-task-body" key={task.id}><div className="aio-task-heading"><p className="eyebrow">{task.label}</p><h2 id="plenum-task-title">{task.title}</h2><p className="privacy-intro">{task.summary}</p></div>
   <div className="aio-task-brief"><section><h3>{text(lang,'Задача','Challenge')}</h3><p>{task.problem}</p></section><section><h3>{text(lang,'Решение','Solution')}</h3><p>{task.solution}</p></section></div>
   <PlenumScenes key={task.id} taskId={task.id} lang={lang} paused={paused}/>
   <p className="plenum-schematic-note">{text(lang,'Схема взаимодействия · демонстрационные данные','Interaction sketch · illustrative data')}</p>
   <div className="dialog-content aio-narrative">{task.sections.map(([title,body])=><section key={title} className="case-chapter"><h3>{title}</h3><p>{body}</p></section>)}</div>
   {plenumEvidence[task.id]?.length>0&&<section className="aio-evidence"><h2>{text(lang,'В интерфейсе.','In the interface.')}</h2>{plenumEvidence[task.id].map(media=><section className="aio-evidence-row case-chapter" key={media.src}><div><h3>{media.title[lang]}</h3><p>{media.description[lang]}</p></div><figure className="case-image">{media.type==='video'?<video src={media.src} poster={media.poster} controls playsInline preload="metadata" aria-label={media.title[lang]}/>:<a href={media.src} target="_blank" rel="noreferrer"><img src={media.src} width={media.width} height={media.height} alt={media.title[lang]} loading="lazy" decoding="async"/></a>}</figure></section>)}</section>}
   {task.metric&&<section className="plenum-measurement" aria-labelledby="plenum-measurement-title"><h3 id="plenum-measurement-title">{task.metric.label}</h3><div className="plenum-measurement-values">{task.metric.before&&<><span>{task.metric.before}</span><Arrow/></>}<strong>{task.metric.after}</strong></div><p>{task.metric.note}</p></section>}
   <p className="plenum-task-limit">{task.limit}</p></div>
  </article>
  <TaskNavigation tasks={tasks} active={active} onSelect={select} lang={lang} bottom/>
  <section className="plenum-outcome"><h2>{text(lang,'Продукт, который можно проверять.','A product that can be tested.')}</h2><p>{text(lang,'Мой результат — связанная продуктовая система: от холста и дизайн-системы до модели знаний, доказательств и восстановления анализа. Следующий критерий готовности — независимая проверка полной цепочки на незнакомых проектах.','My outcome is a connected product system, from canvas and design system to a knowledge model, evidence and recoverable analysis. The next readiness criterion is independent evaluation of the complete pipeline on unfamiliar projects.')}</p><p>{text(lang,'Дизайнеры и разработчики работают с общей моделью. Продуктовые и операционные руководители — выбранный сегмент для проверки ценности; это рабочая гипотеза, не результат подтверждённого customer research.','Designers and engineers work with the shared model. Product and operational leaders are the selected segment for testing value; this is a working hypothesis, not a validated customer-research result.')}</p></section>
 </div>;
}
