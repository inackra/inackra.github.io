import React from 'react';
import Arrow from './Arrow';
import FlipText from './FlipText';
import Magnetic from './Magnetic';
import {homeUrl,workUrl} from './routes';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from './content';
import {achievements} from './studio/data';
import './services.css';

// Services as plans, laid out like the case pages: one column, hairlines,
// small looping schematics instead of cards.

// Clients shown on the old portfolio homepage (logos in /assets/companies).
const clients=[['adobe-semrush','Adobe × Semrush',190],['mccann','McCann',132],['evapolar','Evapolar',130],['buburuza','Buburuza',124],['natasha-denona','Natasha Denona',180],['palindrom','Palindrom',142],['12k','12K',136],['le-papa','Le Papa',166],['lg','LG',38],['instant-funding','Instant Funding',43]];

// Testimonials appear only once clients have sent them: [quote, name, role and company].
export const testimonials={ru:[],en:[]};

const copy={
 ru:{
  back:'На главную',eyebrow:'Услуги · дизайн по подписке',title:'Услуги.',
  lead:'Фиксированная цена в месяц, задачи по очереди, пауза в любой момент. Без смет и долгих согласований.',
  intro:'Пишешь задачу в Telegram, я беру её в работу и сдаю. Следующая уже ждёт в очереди.',
  flow:['Очередь','В работе','Готово'],flowLabel:'Как идут задачи',
  scopeTitle:'Что можно поручить',scope:['Интерфейсы','Лендинги','Бренд','Дизайн-системы','Моушн','3D'],
  scopeText:'Продукт, сайт, айдентика и визуал для запуска. Всё, что я показываю в кейсах.',
  plansTitle:'Пакеты',
  plans:[
   {id:'lite',name:'Lite',price:'$1 500',per:'/ мес',line:'Одна задача в работе. Для интерфейсов и лендингов.',items:['UI и UX','Лендинги','Прототипы'],lanes:1,cta:'Обсудить Lite'},
   {id:'pro',name:'Pro',price:'$2 900',per:'/ мес',line:'Две задачи параллельно. Плюс бренд, дизайн-система, моушн и 3D.',items:['Всё из Lite','Бренд и дизайн-система','Моушн и 3D'],lanes:2,cta:'Обсудить Pro'},
   {id:'sprint',name:'Спринт MVP',price:'от $3 500',per:'разово',line:'Две-три недели от идеи до прототипа, который можно показать людям.',items:['Сценарии','Интерфейс','Прототип на коде'],sprint:['Неделя 1','Неделя 2','Неделя 3'],cta:'Обсудить спринт'},
  ],
  allTitle:'Во всех пакетах',all:['Пауза и отмена в любой момент','Общение в Telegram','Файлы и исходники остаются у тебя'],
  proofTitle:'Что уже получалось',clientsTitle:'С кем работал',reviewsTitle:'Отзывы',
  customTitle:'Нужно что-то своё?',customText:'Напиши пару строк о задаче, отвечу в течение дня и предложу формат.',cases:'Смотреть кейсы',
 },
 en:{
  back:'Back home',eyebrow:'Services · design on a subscription',title:'Services.',
  lead:'A fixed monthly price, tasks in a queue, pause any time. No estimates, no long approvals.',
  intro:'You send a task in Telegram, I take it on and deliver. The next one is already waiting in the queue.',
  flow:['Queue','In progress','Done'],flowLabel:'How tasks move',
  scopeTitle:'What you can hand over',scope:['Interfaces','Landing pages','Brand','Design systems','Motion','3D'],
  scopeText:'Product, website, identity and launch visuals. Everything you see in the case studies.',
  plansTitle:'Plans',
  plans:[
   {id:'lite',name:'Lite',price:'$1,500',per:'/ mo',line:'One task at a time. For interfaces and landing pages.',items:['UI and UX','Landing pages','Prototypes'],lanes:1,cta:'Discuss Lite'},
   {id:'pro',name:'Pro',price:'$2,900',per:'/ mo',line:'Two tasks in parallel. Plus brand, design system, motion and 3D.',items:['Everything in Lite','Brand and design system','Motion and 3D'],lanes:2,cta:'Discuss Pro'},
   {id:'sprint',name:'MVP sprint',price:'from $3,500',per:'one-off',line:'Two to three weeks from an idea to a prototype you can show people.',items:['Flows','Interface','Coded prototype'],sprint:['Week 1','Week 2','Week 3'],cta:'Discuss the sprint'},
  ],
  allTitle:'In every plan',all:['Pause or cancel any time','We talk in Telegram','Files and sources stay yours'],
  proofTitle:'What it has done before',clientsTitle:'Worked with',reviewsTitle:'Testimonials',
  customTitle:'Need something else?',customText:'Write a few lines about the task, I reply within a day and suggest a format.',cases:'See case studies',
 },
};

// A task lane: blocks enter the queue, get worked on, leave as done.
function Lane({playing,offset=0}){
 return <div className={`pk-lane${playing?' is-playing':''}`} style={{'--pk-offset':offset}}>{[0,1,2,3].map(i=><i key={i} style={{'--pk-i':i}}/>)}</div>;
}

function Flow({labels,playing,lanes=1}){
 return <div className="pk-flow" aria-hidden="true">
  {Array.from({length:lanes},(_,i)=><Lane key={i} playing={playing} offset={i*.5}/>)}
  <div className="pk-flow-labels">{labels.map(l=><span key={l}>{l}</span>)}</div>
 </div>;
}

function Sprint({weeks,playing}){
 return <div className={`pk-sprint${playing?' is-playing':''}`} aria-hidden="true">
  <div className="pk-sprint-track"><b/>{weeks.map(w=><span key={w}>{w}</span>)}</div>
  <em>MVP</em>
 </div>;
}

export default function ServicesPage({lang,paused}){
 const d=copy[lang],reviews=testimonials[lang],playing=!paused;
 return <article id="top" className="services-page">
  <a className="text-action back-home" href={homeUrl(lang)}><Arrow left/><FlipText>{d.back}</FlipText></a>

  <header className="pk-hero">
   <p className="eyebrow">{d.eyebrow}</p>
   <h1>{d.title}</h1>
   <p className="pk-lead">{d.lead}</p>
  </header>

  <section className="pk-chapter" aria-label={d.flowLabel}>
   <p className="pk-text">{d.intro}</p>
   <figure className="pk-figure"><p className="eyebrow">{d.flowLabel}</p><Flow labels={d.flow} playing={playing}/></figure>
  </section>

  <section className="pk-chapter" aria-labelledby="pk-scope">
   <h2 id="pk-scope">{d.scopeTitle}</h2>
   <p className={`pk-words${playing?' is-playing':''}`} aria-label={d.scope.join(', ')}>{d.scope.map((w,i)=><span key={w} style={{'--w':i}} aria-hidden="true">{w}</span>)}</p>
   <p className="pk-text">{d.scopeText}</p>
  </section>

  <section className="pk-chapter" aria-labelledby="pk-plans">
   <h2 id="pk-plans">{d.plansTitle}</h2>
   <div className="pk-plans">{d.plans.map(p=><div className={`pk-plan pk-plan-${p.id}`} key={p.id}>
    <div className="pk-plan-head"><h3>{p.name}</h3><p className="pk-price"><strong>{p.price}</strong><span>{p.per}</span></p></div>
    <p className="pk-text">{p.line}</p>
    {p.sprint?<Sprint weeks={p.sprint} playing={playing}/>:<Flow labels={d.flow} playing={playing} lanes={p.lanes}/>}
    <div className="pk-plan-foot"><p className="pk-items">{p.items.map(x=><span key={x}>{x}</span>)}</p><a className="pill" href={TELEGRAM} target="_blank" rel="noreferrer"><span>{p.cta}</span><Arrow/></a></div>
   </div>)}</div>
  </section>

  <section className="pk-chapter" aria-labelledby="pk-all">
   <h2 id="pk-all">{d.allTitle}</h2>
   <ul className="pk-all">{d.all.map(x=><li key={x}>{x}</li>)}</ul>
  </section>

  <section className="pk-chapter" aria-labelledby="pk-proof">
   <h2 id="pk-proof">{d.proofTitle}</h2>
   <dl className="pk-metrics">{achievements[lang].map(([value,label])=><div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
  </section>

  <section className="pk-chapter" aria-labelledby="pk-clients">
   <h2 id="pk-clients">{d.clientsTitle}</h2>
   <div className="pk-marquee" role="list"><div className={`pk-marquee-track${playing?' is-playing':''}`}>{[0,1].map(k=>clients.map(([slug,name,width])=><div className={`brand-logo brand-logo-${slug}`} role={k?undefined:'listitem'} aria-hidden={k?true:undefined} key={slug+k}><img src={`/assets/companies/${slug}.svg`} alt={k?'':name} style={{'--logo-width':`${width}px`}} loading="lazy" decoding="async"/></div>))}</div></div>
  </section>

  {reviews.length>0&&<section className="pk-chapter" aria-labelledby="pk-reviews"><h2 id="pk-reviews">{d.reviewsTitle}</h2>
   {reviews.map(([quote,name,role])=><figure className="pk-review" key={name}><blockquote>“{quote}”</blockquote><figcaption><b>{name}</b> · {role}</figcaption></figure>)}
  </section>}

  <section className="pk-chapter pk-custom" aria-labelledby="pk-custom">
   <h2 id="pk-custom">{d.customTitle}</h2>
   <p className="pk-text">{d.customText}</p>
   <div className="pk-actions">
    <Magnetic as="a" className="mag-solid" href={TELEGRAM} target="_blank" rel="noreferrer"><span>Telegram {TELEGRAM_HANDLE}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={`mailto:${EMAIL}`}><span>{EMAIL}</span></Magnetic>
    <Magnetic as="a" href={workUrl(lang,'cases')}><span>{d.cases}</span></Magnetic>
   </div>
  </section>
 </article>;
}
