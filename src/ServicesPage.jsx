import React,{useState} from 'react';
import Arrow from './Arrow';
import FlipText from './FlipText';
import Magnetic from './Magnetic';
import {homeUrl,workUrl} from './routes';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from './content';
import {achievements} from './studio/data';
import './services.css';

// Services as plans, in the manner of a calm pricing page: plans side by side on
// hairlines (one full screen each on a phone), then a comparison table.

// Clients shown on the old portfolio homepage (logos in /assets/companies).
const clients=[['adobe-semrush','Adobe × Semrush'],['mccann','McCann'],['evapolar','Evapolar'],['buburuza','Buburuza'],['natasha-denona','Natasha Denona'],['palindrom','Palindrom'],['12k','12K'],['le-papa','Le Papa'],['lg','LG'],['instant-funding','Instant Funding']];

// Testimonials appear only once clients have sent them: [quote, name, role and company].
export const testimonials={ru:[],en:[]};

// Comparison cells: true = included, false = not included, string = the value itself.
const copy={
 ru:{
  back:'На главную',title:'Услуги',
  lead:'Дизайн по подписке. Фиксированная цена в месяц, задачи по очереди, пауза в любой момент.',
  plans:[
   {id:'lite',name:'Lite',price:'$1 500',per:'в месяц',note:'Одна задача в работе',cta:'Обсудить Lite',items:['Интерфейсы, UI и UX','Лендинги и сайты','Прототипы','Общение в Telegram','Пауза и отмена в любой момент']},
   {id:'pro',name:'Pro',price:'$2 700',per:'в месяц',note:'Две задачи параллельно',cta:'Обсудить Pro',solid:true,items:['Интерфейсы, UI и UX','Лендинги и сайты','Прототипы','Бренд и айдентика','Дизайн-система','Моушн и 3D','Общение в Telegram','Пауза и отмена в любой момент']},
   {id:'sprint',name:'Спринт MVP',price:'от $3 500',per:'разово',note:'2–3 недели, 5–7 крупных задач',cta:'Обсудить спринт',items:['Исследование и сценарии','Интерфейс ключевых экранов','Прототип на коде','Сайт и лендинги','Бренд и айдентика','Дизайн-система','Моушн и 3D','Передача в разработку']},
  ],
  compareTitle:'Сравнение',
  groups:[
   ['Формат',[['Оплата','Помесячно','Помесячно','Разово'],['Задач в работе','1','2','5–7 крупных'],['Срок','Пока нужно','Пока нужно','2–3 недели'],['Пауза и отмена',true,true,false]]],
   ['Дизайн',[['Интерфейсы, UI и UX',true,true,true],['Лендинги и сайты',true,true,true],['Прототип на коде',true,true,true],['Бренд и айдентика',false,true,true],['Дизайн-система',false,true,true],['Моушн и 3D',false,true,true]]],
   ['Работа',[['Общение в Telegram',true,true,true],['Файлы и исходники у тебя',true,true,true],['Передача в разработку',true,true,true]]],
  ],
  proofTitle:'Что уже получалось',clientsTitle:'С кем работал',reviewsTitle:'Отзывы',
  customTitle:'Нужно что-то своё?',customText:'Напиши пару строк о задаче, отвечу в течение дня и предложу формат.',cases:'Смотреть кейсы',
 },
 en:{
  back:'Back home',title:'Services',
  lead:'Design on a subscription. A fixed monthly price, tasks in a queue, pause any time.',
  plans:[
   {id:'lite',name:'Lite',price:'$1,500',per:'per month',note:'One task at a time',cta:'Discuss Lite',items:['Interfaces, UI and UX','Landing pages and websites','Prototypes','Telegram','Pause or cancel any time']},
   {id:'pro',name:'Pro',price:'$2,700',per:'per month',note:'Two tasks in parallel',cta:'Discuss Pro',solid:true,items:['Interfaces, UI and UX','Landing pages and websites','Prototypes','Brand and identity','Design system','Motion and 3D','Telegram','Pause or cancel any time']},
   {id:'sprint',name:'MVP sprint',price:'from $3,500',per:'one-off',note:'2–3 weeks, 5–7 major tasks',cta:'Discuss the sprint',items:['Research and flows','Key screens','Coded prototype','Website and landing pages','Brand and identity','Design system','Motion and 3D','Developer handoff']},
  ],
  compareTitle:'Compare',
  groups:[
   ['Format',[['Billing','Monthly','Monthly','One-off'],['Tasks in progress','1','2','5–7 major'],['Length','As long as needed','As long as needed','2–3 weeks'],['Pause and cancel',true,true,false]]],
   ['Design',[['Interfaces, UI and UX',true,true,true],['Landing pages and websites',true,true,true],['Coded prototype',true,true,true],['Brand and identity',false,true,true],['Design system',false,true,true],['Motion and 3D',false,true,true]]],
   ['Work',[['Telegram',true,true,true],['Files and sources stay yours',true,true,true],['Developer handoff',true,true,true]]],
  ],
  proofTitle:'What it has done before',clientsTitle:'Worked with',reviewsTitle:'Testimonials',
  customTitle:'Need something else?',customText:'Write a few lines about the task, I reply within a day and suggest a format.',cases:'See case studies',
 },
};

const Check=()=><svg className="pl-check" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7"/><path d="m5 8.2 2 2 4-4.2"/></svg>;
const Cell=({v,yes,no})=>v===true?<><Check/><span className="sr-only">{yes}</span></>:v===false?<span className="pl-dash" aria-label={no}>—</span>:<span>{v}</span>;

export default function ServicesPage({lang}){
 const d=copy[lang],reviews=testimonials[lang],ru=lang==='ru';
 const [pick,setPick]=useState(1); // which plan the phone comparison shows
 const yes=ru?'Есть':'Included',no=ru?'Нет':'Not included';
 return <article id="top" className="services-page">
  <a className="text-action back-home" href={homeUrl(lang)}><Arrow left/><FlipText>{d.back}</FlipText></a>

  <header className="pl-hero">
   <h1>{d.title}</h1>
   <p>{d.lead}</p>
  </header>

  <section className="pl-plans" aria-label={d.title}>{d.plans.map(p=><div className={`pl-plan pl-plan-${p.id}`} key={p.id}>
   <div className="pl-plan-top">
    <h2>{p.name}</h2>
    <p className="pl-price"><strong>{p.price}</strong> <span>{p.per}</span></p>
    <p className="pl-note">{p.note}</p>
   </div>
   <ul className="pl-items">{p.items.map(x=><li key={x}><Check/>{x}</li>)}</ul>
   <a className={`pill pl-cta${p.solid?' pl-cta-solid':''}`} href={TELEGRAM} target="_blank" rel="noreferrer"><span>{p.cta}</span><Arrow/></a>
  </div>)}</section>

  <section className="pl-compare" aria-labelledby="pl-compare">
   <h2 id="pl-compare">{d.compareTitle}</h2>
   <div className="pl-tabs" role="tablist" aria-label={d.compareTitle}>{d.plans.map((p,i)=><button type="button" role="tab" key={p.id} className="pill" aria-selected={pick===i} aria-pressed={pick===i} onClick={()=>setPick(i)}>{p.name}</button>)}</div>
   <table className="pl-table" style={{'--pick':pick}}>
    <thead><tr><th scope="col"><span className="sr-only">{d.compareTitle}</span></th>{d.plans.map((p,i)=><th scope="col" key={p.id} className={i===pick?'is-pick':''}>{p.name}</th>)}</tr></thead>
    {d.groups.map(([group,rows])=><tbody key={group}>
     <tr className="pl-group"><th scope="rowgroup" colSpan={4}>{group}</th></tr>
     {rows.map(([label,...vals])=><tr key={label}><th scope="row">{label}</th>{vals.map((v,i)=><td key={i} className={i===pick?'is-pick':''}><Cell v={v} yes={yes} no={no}/></td>)}</tr>)}
    </tbody>)}
   </table>
  </section>

  <section className="pl-section" aria-labelledby="pl-proof">
   <h2 id="pl-proof">{d.proofTitle}</h2>
   <dl className="pl-metrics">{achievements[lang].map(([value,label])=><div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
  </section>

  <section className="pl-section" aria-labelledby="pl-clients">
   <h2 id="pl-clients">{d.clientsTitle}</h2>
   <div className="pl-logos" role="list"><div className="pl-logos-track">{[0,1].map(k=>clients.map(([slug,name])=><div className={`pl-logo pl-logo-${slug}`} role={k?undefined:'listitem'} aria-hidden={k?true:undefined} key={slug+k}><img src={`/assets/companies/${slug}.svg`} alt={k?'':name} loading="lazy" decoding="async"/></div>))}</div></div>
  </section>

  {reviews.length>0&&<section className="pl-section" aria-labelledby="pl-reviews"><h2 id="pl-reviews">{d.reviewsTitle}</h2>
   {reviews.map(([quote,name,role])=><figure className="pl-review" key={name}><blockquote>“{quote}”</blockquote><figcaption><b>{name}</b> · {role}</figcaption></figure>)}
  </section>}

  <section className="pl-section pl-custom" aria-labelledby="pl-custom">
   <h2 id="pl-custom">{d.customTitle}</h2>
   <p>{d.customText}</p>
   <div className="pl-actions">
    <Magnetic as="a" className="mag-solid" href={TELEGRAM} target="_blank" rel="noreferrer"><span>Telegram {TELEGRAM_HANDLE}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={`mailto:${EMAIL}`}><span>{EMAIL}</span></Magnetic>
    <Magnetic as="a" href={workUrl(lang,'cases')}><span>{d.cases}</span></Magnetic>
   </div>
  </section>
 </article>;
}
