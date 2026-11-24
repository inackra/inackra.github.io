import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import Arrow from './Arrow';
import FlipText from './FlipText';
import Magnetic from './Magnetic';
import {homeUrl,workUrl} from './routes';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from './content';
import {achievements} from './studio/data';
import {pop} from './confetti';
import './services.css';

// Services as plans, in the manner of a calm pricing page: plans side by side on
// hairlines (one full screen each on a phone), then the plan laid out on a month
// calendar, the way it would look in Apple or Google Calendar.

// Clients shown on the old portfolio homepage (logos in /assets/companies).
// [slug, name, site]; a logo without a site stays a plain image.
const clients=[['adobe-semrush','Adobe × Semrush','https://www.semrush.com/'],['mccann','McCann','https://www.mccann.com/'],['evapolar','Evapolar','https://evapolar.com/'],['buburuza','Buburuza','https://www.buburuza.com/'],['natasha-denona','Natasha Denona','https://www.natashadenona.com/'],['palindrom','Palindrom','https://palindrome.media/'],['12k','12K',''],['le-papa','Le Papa','https://lepapa.ru/'],['lg','LG','https://www.lg.com/'],['instant-funding','Instant Funding','https://instantfunding.com/']];

// Calendar colours: Apple's system palette, readable on both themes.
const C={red:'#FF453A',orange:'#FF9F0A',yellow:'#FFD60A',green:'#30D158',teal:'#40C8E0',blue:'#0A84FF',purple:'#BF5AF2'};
// Calendar events: [label, first working day 0–19, length in days, lane, colour].

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
   {id:'sprint',name:'Спринт MVP',price:'от $3 500',per:'за спринт',note:'3–4 недели: от идеи до продукта, готового к разработке',cta:'Обсудить спринт',items:['Исследование и сценарии','Все экраны продукта','Прототип на коде','Логотип и мини-айдентика','Дизайн-система','Лендинг','Моушн и 3D','Передача в разработку']},
  ],
  calTitle:'Месяц в календаре',days:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],week:'Неделя',
  calNote:'Задачи для примера. Настоящий план собираем вместе в первый день.',
  cal:[
   {lead:'Одна задача за раз: следующая начинается, когда готова предыдущая.',lanes:1,ev:[['Лендинг',0,4,0,C.blue],['Онбординг',4,4,0,C.orange],['Экран оплаты',8,3,0,C.green],['Баннеры',11,2,0,C.purple],['Дашборд',13,5,0,C.red],['Правки',18,2,0,C.yellow],]},
   {lead:'Две задачи параллельно: продукт и бренд двигаются одновременно.',lanes:2,ev:[['Лендинг',0,5,0,C.blue],['Онбординг',5,4,0,C.orange],['Экран оплаты',9,3,0,C.green],['Дашборд',12,5,0,C.red],['Правки',17,3,0,C.yellow],['Логотип и айдентика',0,7,1,C.purple],['Дизайн-система',7,7,1,C.teal],['Моушн-ролик',14,6,1,C.red]]},
   {lead:'План на 3–4 недели: от идеи до продукта, готового к разработке.',lanes:2,ev:[['Исследование и сценарии',0,4,0,C.blue],['Все экраны',4,9,0,C.orange],['Прототип',13,3,0,C.green],['Передача',16,3,0,C.yellow],['Логотип и айдентика',2,5,1,C.purple],['Дизайн-система',7,6,1,C.teal],['Лендинг',13,4,1,C.blue],['Моушн и 3D',17,2,1,C.red],]},
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
   {id:'sprint',name:'MVP sprint',price:'from $3,500',per:'per sprint',note:'3–4 weeks: from an idea to a product ready for development',cta:'Discuss the sprint',items:['Research and flows','Every product screen','Coded prototype','Logo and mini identity','Design system','Landing page','Motion and 3D','Developer handoff']},
  ],
  calTitle:'A month on the calendar',days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],week:'Week',
  calNote:'Sample tasks. We put the real plan together on day one.',
  cal:[
   {lead:'One task at a time: the next starts when the previous one is done.',lanes:1,ev:[['Landing page',0,4,0,C.blue],['Onboarding',4,4,0,C.orange],['Checkout',8,3,0,C.green],['Banners',11,2,0,C.purple],['Dashboard',13,5,0,C.red],['Revisions',18,2,0,C.yellow],]},
   {lead:'Two tasks in parallel: product and brand move at the same time.',lanes:2,ev:[['Landing page',0,5,0,C.blue],['Onboarding',5,4,0,C.orange],['Checkout',9,3,0,C.green],['Dashboard',12,5,0,C.red],['Revisions',17,3,0,C.yellow],['Logo and identity',0,7,1,C.purple],['Design system',7,7,1,C.teal],['Motion video',14,6,1,C.red]]},
   {lead:'A 3–4 week plan: from an idea to a product ready for development.',lanes:2,ev:[['Research and flows',0,4,0,C.blue],['All screens',4,9,0,C.orange],['Prototype',13,3,0,C.green],['Handoff',16,3,0,C.yellow],['Logo and identity',2,5,1,C.purple],['Design system',7,6,1,C.teal],['Landing page',13,4,1,C.blue],['Motion and 3D',17,2,1,C.red],]},
  ],
  proofTitle:'What it has done before',clientsTitle:'Worked with',reviewsTitle:'Testimonials',
  customTitle:'Need something else?',customText:'Write a few lines about the task, I reply within a day and suggest a format.',cases:'See case studies',
 },
};

// Plan names, prices and contents, for the page's structured data and llms.txt.
export const servicePlans=lang=>copy[lang].plans;

const Check=()=><svg className="pl-check" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7"/><path d="m5 8.2 2 2 4-4.2"/></svg>;

const useIso=typeof window==='undefined'?useEffect:useLayoutEffect;

// One plan as four working weeks. Events that cross a weekend split into
// segments, as in a month view; bars draw in, in order, once in view.
function Calendar({plan,d,paused}){
 const ref=useRef(null),[stage,setStage]=useState('');
 useIso(()=>{
  const el=ref.current;if(!el)return;
  if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  setStage('is-wait');
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setStage('is-in');io.disconnect()}},{threshold:.25});
  io.observe(el);return()=>io.disconnect();
 },[]);
 const tap=e=>{if(!paused)pop(e.clientX,e.clientY)};
 // Working days 0–19 map onto real dates: weekends stay in the grid, so the
 // numbers run without gaps and a task over a weekend reads as one bar.
 const cal=i=>7*Math.floor(i/5)+i%5,weeks=[0,1,2,3],days7=[0,1,2,3,4,5,6];
 const seg=w=>plan.ev.map(([label,start,len,lane,color],k)=>{
  const from=cal(start),to=cal(start+len-1)+1,a=Math.max(from,7*w),b=Math.min(to,7*w+7);
  return a<b&&{k,label,lane,color,a:a-7*w,b:b-7*w,cont:a>from,more:b<to,i:start+lane*1.5};
 }).filter(Boolean);
 const cls=e=>`pl-ev${e.cont?' pl-ev-cont':''}${e.more?' pl-ev-more':''}`;
 return <div ref={ref} className={`pl-cal ${stage}`} style={{'--lanes':plan.lanes}}>
  {/* Desktop: a month view, weeks as rows and events as horizontal bars. */}
  <div className="pl-month">
   <div className="pl-cal-days" aria-hidden="true">{d.days.map((x,i)=><span key={x} className={i>4?'is-off':''}>{x}</span>)}</div>
   {weeks.map(w=><div className="pl-week" key={w} role="group" aria-label={`${d.week} ${w+1}`}>
    {days7.map(i=><span className={`pl-day${i>4?' is-off':''}`} key={i} style={{gridColumn:i+1}}>{7*w+i+1}</span>)}
    {seg(w).map(e=><span key={e.k} className={cls(e)} onClick={tap} style={{gridColumn:`${e.a+1} / ${e.b+1}`,gridRow:e.lane+2,'--c':e.color,'--t':e.color===C.yellow?'#1d1d1f':'#fff','--i':e.i}}><span>{e.label}</span></span>)}
   </div>)}
  </div>
  {/* Phone: one continuous schedule, days running down and events as vertical bars;
      a quiet week label sits on each Monday. */}
  <div className="pl-agenda" aria-hidden="true"><div className="pl-aw-grid">
   {weeks.flatMap(w=>days7.map(i=><span className={`pl-aw-day${i>4?' is-off':''}${i===0?' is-mon':''}`} key={w*7+i} style={{gridRow:w*7+i+1}}>
    {i===0&&<small>{d.week} {w+1}</small>}<b>{7*w+i+1}</b>{d.days[i]}</span>))}
   {plan.ev.map(([label,start,len,lane,color],k)=><span key={k} className="pl-ev pl-ev-v" onClick={tap}
    style={{gridRow:`${cal(start)+1} / ${cal(start+len-1)+2}`,gridColumn:lane+2,'--c':color,'--t':color===C.yellow?'#1d1d1f':'#fff','--i':start+lane*1.5}}><span>{label}</span></span>)}
  </div></div>
 </div>;
}

// Logos run on their own and can be swiped or scrolled by hand; the loop is
// a doubled track whose scroll position wraps at half its width.
function LogoMarquee({paused}){
 const ref=useRef(null);
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos=1,last=0,held=0,raf=0,own=false;
  const half=()=>el.scrollWidth/2;
  const wrap=()=>{const h=half();if(el.scrollLeft>=h){el.scrollLeft-=h}else if(el.scrollLeft<=0){el.scrollLeft+=h}};
  const touch=()=>{held=performance.now()+1800};
  const onScroll=()=>{if(own){own=false;return}wrap();pos=el.scrollLeft};
  const tick=t=>{
   const dt=last?Math.min(t-last,64):0;last=t;
   if(!paused&&!still&&t>held){pos+=dt*.075;const h=half();if(pos>=h)pos-=h;own=true;el.scrollLeft=pos}
   raf=requestAnimationFrame(tick);
  };
  el.scrollLeft=pos;
  ['pointerdown','touchstart','wheel'].forEach(e=>el.addEventListener(e,touch,{passive:true}));
  el.addEventListener('scroll',onScroll,{passive:true});
  raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);el.removeEventListener('scroll',onScroll);['pointerdown','touchstart','wheel'].forEach(e=>el.removeEventListener(e,touch))};
 },[paused]);
 return <div className="pl-logos" ref={ref}><ul className="pl-logos-track">{[0,1].map(k=>clients.map(([slug,name,href])=>{
  const img=<img src={`/assets/companies/${slug}.svg`} alt={k?'':name} loading="lazy" decoding="async"/>;
  return <li className={`pl-logo pl-logo-${slug}`} aria-hidden={k?true:undefined} key={slug+k}>{href?<a href={href} target="_blank" rel="noopener noreferrer" tabIndex={k?-1:undefined}>{img}</a>:img}</li>;
 }))}</ul></div>;
}

export default function ServicesPage({lang,paused}){
 const d=copy[lang],reviews=testimonials[lang];
 const [pick,setPick]=useState(1); // which plan the phone comparison shows
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
   <h2 id="pl-compare">{d.calTitle}</h2>
   <div className="pl-cal-head">
    <div className="pl-tabs" role="tablist" aria-label={d.calTitle}>{d.plans.map((p,i)=><button type="button" role="tab" key={p.id} className="pill" aria-selected={pick===i} onClick={()=>setPick(i)}>{p.name}</button>)}</div>
    <p className="pl-cal-price" aria-live="polite"><strong>{d.plans[pick].price}</strong> <span>{d.plans[pick].per}</span></p>
   </div>
   <p className="pl-cal-lead">{d.cal[pick].lead}</p>
   <Calendar key={pick} plan={d.cal[pick]} d={d} paused={paused}/>
   <p className="pl-cal-note">{d.calNote}</p>
  </section>

  <section className="pl-section" aria-labelledby="pl-proof">
   <h2 id="pl-proof">{d.proofTitle}</h2>
   <dl className="pl-metrics">{achievements[lang].map(([value,label])=><div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
  </section>

  <section className="pl-section" aria-labelledby="pl-clients">
   <h2 id="pl-clients">{d.clientsTitle}</h2>
   <LogoMarquee paused={paused}/>
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
