import React,{useEffect,useRef,useState} from 'react';
import Arrow from './Arrow';
import FlipText from './FlipText';
import Magnetic from './Magnetic';
import {homeUrl,workUrl} from './routes';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from './content';
import {achievements,niches,findNiche} from './studio/data';
import {MockStage} from './studio/Mocks';
import './studio/studio.css';
import './services.css';

// Clients shown on the old portfolio homepage (logos in /assets/companies).
const clients=[['adobe-semrush','Adobe × Semrush',190],['mccann','McCann',132],['evapolar','Evapolar',130],['buburuza','Buburuza',124],['natasha-denona','Natasha Denona',180],['palindrom','Palindrom',142],['12k','12K',136],['le-papa','Le Papa',166],['lg','LG',38],['instant-funding','Instant Funding',43]];

// Testimonials appear only once clients have sent them: [quote, name, role and company].
export const testimonials={ru:[],en:[]};

// The story: one product grows chapter by chapter while the page scrolls.
// Each chapter shows the real constructor mock-up (or real case renders) in a new state.
const renders=['/assets/evapolar/render-detail.webp','/assets/evapolar/chill.webp','/assets/evapolar/smart.webp','/assets/evapolar/pure.webp'];
const pickNiches=['ai','fintech','food','travel'];

const copy={
 ru:{
  back:'На главную',kicker:'Услуги',
  hero:['Идея.','Продукт.'],heroAccent:'Целиком.',
  lead:'Беру продукт от первой мысли до запуска: интерфейс, бренд, система и моушен. Листай: один продукт пройдёт весь путь.',
  scroll:'Листай',
  chapters:[
   {n:'01',word:['Продукт.'],title:'Продукт под ключ',text:'Исследование, сценарии, интерфейсы и рабочий прототип на коде. Идею проверяют на людях, а не на картинках.',tags:['UX и UI','Прототип на коде','Передача в разработку'],pick:'Выбери сферу'},
   {n:'02',word:['Бренд.'],title:'Брендинг',text:'Тот же продукт, другой характер. Логотип, цвет и типографика, по которым его узнают везде.',tags:['Айдентика','Гайдлайн','Носители']},
   {n:'03',word:['Система.'],title:'Дизайн-системы',text:'Одни компоненты собирают сайт, приложение и админку. Команда переиспользует их, а не рисует экраны заново.',tags:['UI-кит','Токены','Документация']},
   {n:'04',word:['Движение.'],title:'3D и моушен',text:'Рендеры и анимации, которые объясняют продукт и заменяют часть съёмок. Это реальные кадры из кейса Evapolar.',tags:['Рендеры','Анимации','Визуал для запуска']},
  ],
  brandMoods:['Сдержанно','Смело','С изюминкой'],systemTypes:['Сайт','Приложение','Админка'],
  numbersTitle:['Не обещания.','Цифры.'],clientsTitle:'С кем работал',
  forTitle:'Для кого',forList:[['Фаундеры','Нужно быстро показать продукт инвесторам или первым клиентам.'],['AI и SaaS','Сложная логика, которую надо превратить в понятный интерфейс.'],['Бренды','Запуск, ребрендинг или визуал, который продаёт.']],
  howTitle:'Как идёт работа',how:[['Знакомство','Созвон: задача, сроки и что считать результатом.'],['Концепция','Показываю направление до того, как рисовать всё.'],['Дизайн и прототип','Собираю и проверяю на реальных сценариях.'],['Передача','Файлы, система и прототип, чтобы команда шла дальше.']],
  formatsNote:'Беру проект целиком или подключаюсь к команде надолго.',
  reviewsTitle:'Отзывы',
  ctaTitle:['Твой продукт.','Следующая глава.'],ctaText:'Напиши пару строк о задаче, отвечу в течение дня. Или собери макет своего продукта за минуту.',ctaBuild:'Собрать макет',cases:'Смотреть кейсы',
 },
 en:{
  back:'Back home',kicker:'Services',
  hero:['Idea.','Product.'],heroAccent:'End to end.',
  lead:'I take a product from the first thought to launch: interface, brand, system and motion. Scroll: one product goes all the way.',
  scroll:'Scroll',
  chapters:[
   {n:'01',word:['Product.'],title:'Product end to end',text:'Research, flows, interfaces and a working prototype in code. The idea is tested on people, not on pictures.',tags:['UX and UI','Coded prototype','Developer handoff'],pick:'Pick a field'},
   {n:'02',word:['Brand.'],title:'Branding',text:'Same product, a different character. The logo, colour and type that make it recognisable everywhere.',tags:['Identity','Guidelines','Applications']},
   {n:'03',word:['System.'],title:'Design systems',text:'One set of components builds the site, the app and the admin. The team reuses them instead of redrawing screens.',tags:['UI kit','Tokens','Documentation']},
   {n:'04',word:['Motion.'],title:'3D and motion',text:'Renders and animation that explain the product and replace part of the shoots. These are real frames from the Evapolar case.',tags:['Renders','Animation','Launch visuals']},
  ],
  brandMoods:['Calm','Bold','Twisted'],systemTypes:['Website','App','Admin'],
  numbersTitle:['Not promises.','Numbers.'],clientsTitle:'Worked with',
  forTitle:'Who it’s for',forList:[['Founders','You need to show the product to investors or first customers, fast.'],['AI and SaaS','Complex logic that has to become a clear interface.'],['Brands','A launch, a rebrand or visuals that sell.']],
  howTitle:'How we work',how:[['Intro','A call: the task, the timeline and what counts as the result.'],['Concept','I show a direction before designing everything.'],['Design and prototype','Built and tested on real scenarios.'],['Handoff','Files, system and prototype so the team can carry on.']],
  formatsNote:'I take on a whole project or join a team for the long run.',
  reviewsTitle:'Testimonials',
  ctaTitle:['Your product.','Next chapter.'],ctaText:'Write a few lines about the task, I reply within a day. Or build a mock-up of your product in a minute.',ctaBuild:'Build a mock-up',cases:'See case studies',
 },
};

const moodIds=['strict','bright','twist'],typeIds=['site','app','saas'];

// Scroll progress through the story: which chapter is on screen and how far into it.
function useStory(ref,count){
 const [state,setState]=useState({i:0,p:0});
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  let raf=0;
  const update=()=>{raf=0;const r=el.getBoundingClientRect(),total=r.height-innerHeight,done=Math.min(Math.max(-r.top/Math.max(total,1),0),.9999),x=done*count,i=Math.floor(x);setState(s=>s.i===i&&Math.abs(s.p-(x-i))<.01?s:{i,p:x-i})};
  const on=()=>{if(!raf)raf=requestAnimationFrame(update)};
  update();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);
  return()=>{cancelAnimationFrame(raf);removeEventListener('scroll',on);removeEventListener('resize',on)};
 },[count]);
 return state;
}

// Cycles through n states while active, for the brand and system chapters.
function useCycle(active,n,ms=1700){
 const [k,setK]=useState(0);
 useEffect(()=>{if(!active){setK(0);return}const t=setInterval(()=>setK(x=>(x+1)%n),ms);return()=>clearInterval(t)},[active,n,ms]);
 return k;
}

// Counts up once the number scrolls into view; keeps text like "→" and "+".
function CountUp({value}){
 const ref=useRef(null),[shown,setShown]=useState(value);
 useEffect(()=>{
  const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const parts=value.split(/(\d+(?:[\s,]\d{3})*)/);
  const nums=parts.map(p=>/\d/.test(p)?+p.replace(/[\s,]/g,''):null);
  const fmt=(n,src)=>{const r=Math.round(n);return /\s/.test(src)?r.toLocaleString('ru-RU').replace(/ /g,' '):/,/.test(src)?r.toLocaleString('en-US'):String(r)};
  setShown(parts.map((p,i)=>nums[i]!=null?fmt(0,p):p).join(''));
  const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const t0=performance.now();
   const tick=t=>{const k=Math.min(1,(t-t0)/1400),ease=1-Math.pow(1-k,3);setShown(parts.map((p,i)=>nums[i]!=null?fmt(nums[i]*ease,p):p).join(''));if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)},{threshold:.5});
  io.observe(el);return()=>io.disconnect();
 },[value]);
 return <strong ref={ref}>{shown}</strong>;
}

function Stage({chapter,niche,mood,type,render}){
 return <div className={`story-stage story-stage-${chapter}`}>
  <div className="story-mock" aria-hidden={chapter===3}><MockStage key={`${type}-${niche.id}`} type={type} mood={mood} niche={niche} variant={0}/></div>
  <div className="story-renders" aria-hidden={chapter!==3}>{renders.map((src,i)=><img key={src} src={src} alt="" className={i===render?'on':''} loading="lazy" decoding="async"/>)}</div>
 </div>;
}

export default function ServicesPage({lang,paused}){
 const d=copy[lang],reviews=testimonials[lang],story=useRef(null);
 const {i:chapter,p}=useStory(story,d.chapters.length);
 const [nicheId,setNicheId]=useState('ai');
 const brandK=useCycle(chapter===1&&!paused,3),systemK=useCycle(chapter===2&&!paused,3,2100),renderK=useCycle(chapter===3&&!paused,renders.length,1500);
 const niche=findNiche(nicheId);
 const mood=chapter===1?moodIds[brandK]:chapter>=2?'twist':'strict';
 const type=chapter===2?typeIds[systemK]:'site';
 const c=d.chapters[chapter];
 return <article id="top" className="services-page">
  <a className="text-action back-home" href={homeUrl(lang)}><Arrow left/><FlipText>{d.back}</FlipText></a>

  <header className="services-hero">
   <span className="services-kicker">{d.kicker}</span>
   <h1>{d.hero.map(w=><span key={w}>{w}</span>)}<span className="accent">{d.heroAccent}</span></h1>
   <p>{d.lead}</p>
   <span className="services-scroll">{d.scroll}<Arrow down/></span>
  </header>

  <section className="story" ref={story} style={{'--chapters':d.chapters.length}} aria-label={d.kicker}>
   <div className="story-sticky">
    <div className="story-copy">
     <div className="story-progress" aria-hidden="true">{d.chapters.map((x,i)=><i key={x.n} style={{'--fill':i<chapter?1:i===chapter?p:0}}/>)}</div>
     <div className="story-text" key={chapter}>
      <small>{c.n} / 0{d.chapters.length} · {c.title}</small>
      <h2>{c.word}</h2>
      <p>{c.text}</p>
      <ul>{c.tags.map(x=><li key={x}>{x}</li>)}</ul>
     </div>
     <div className="story-switch">
      {chapter===0&&<><span>{c.pick}</span><div>{pickNiches.map(id=>{const n=findNiche(id);return <button type="button" key={id} className="pill" aria-pressed={nicheId===id} onClick={()=>setNicheId(id)}>{n[lang]}</button>})}</div></>}
      {chapter===1&&<div>{d.brandMoods.map((m,i)=><span key={m} className={`story-chip${i===brandK?' on':''}`}>{m}</span>)}</div>}
      {chapter===2&&<div>{d.systemTypes.map((m,i)=><span key={m} className={`story-chip${i===systemK?' on':''}`}>{m}</span>)}</div>}
      {chapter===3&&<div>{renders.map((m,i)=><span key={m} className={`story-dot${i===renderK?' on':''}`}/>)}</div>}
     </div>
    </div>
    <Stage chapter={chapter} niche={niche} mood={mood} type={type} render={renderK}/>
   </div>
  </section>

  <section className="services-block services-proof" aria-labelledby="services-numbers">
   <h2 id="services-numbers">{d.numbersTitle[0]} <span className="accent">{d.numbersTitle[1]}</span></h2>
   <div className="services-numbers">{achievements[lang].map(([value,label])=><div key={label}><CountUp value={value}/><span>{label}</span></div>)}</div>
  </section>

  <section className="services-block" aria-labelledby="services-clients"><h2 id="services-clients" className="services-small-title">{d.clientsTitle}</h2>
   <div className="services-marquee" role="list"><div className="services-marquee-track">{[0,1].map(k=>clients.map(([slug,name,width])=><div className={`brand-logo brand-logo-${slug}`} role={k?undefined:'listitem'} aria-hidden={k?true:undefined} key={slug+k}><img src={`/assets/companies/${slug}.svg`} alt={k?'':name} style={{'--logo-width':`${width}px`}} loading="lazy" decoding="async"/></div>))}</div></div>
  </section>

  <section className="services-block services-two" aria-labelledby="services-for">
   <div><h2 id="services-for">{d.forTitle}</h2><p className="services-note">{d.formatsNote}</p></div>
   <div className="services-list">{d.forList.map(([title,text])=><div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
  </section>

  <section className="services-block" aria-labelledby="services-how"><h2 id="services-how">{d.howTitle}</h2>
   <ol className="services-steps">{d.how.map(([title,text],i)=><li key={title}><small>0{i+1}</small><h3>{title}</h3><p>{text}</p></li>)}</ol>
  </section>

  {reviews.length>0&&<section className="services-block" aria-labelledby="services-reviews"><h2 id="services-reviews">{d.reviewsTitle}</h2>
   <div className="services-reviews">{reviews.map(([quote,name,role])=><figure key={name}><blockquote>“{quote}”</blockquote><figcaption><b>{name}</b><span>{role}</span></figcaption></figure>)}</div>
  </section>}

  <section className="services-cta"><h2>{d.ctaTitle[0]}<br/><span className="accent">{d.ctaTitle[1]}</span></h2><p>{d.ctaText}</p>
   <div className="services-actions">
    <Magnetic as="a" className="mag-solid" href={`mailto:${EMAIL}`}><span>{EMAIL}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={TELEGRAM} target="_blank" rel="noreferrer"><span>Telegram {TELEGRAM_HANDLE}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={`${homeUrl(lang)}#top`}><span>{d.ctaBuild}</span></Magnetic>
    <Magnetic as="a" href={workUrl(lang,'cases')}><span>{d.cases}</span></Magnetic>
   </div>
  </section>
 </article>;
}
