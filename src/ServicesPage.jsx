import React from 'react';
import Arrow from './Arrow';
import FlipText from './FlipText';
import Magnetic from './Magnetic';
import {homeUrl,workUrl} from './routes';
import {EMAIL,TELEGRAM,TELEGRAM_HANDLE} from './content';
import {achievements} from './studio/data';
import './services.css';

// Clients shown on the old portfolio homepage (logos in /assets/companies).
const clients=[['adobe-semrush','Adobe × Semrush',190],['mccann','McCann',132],['evapolar','Evapolar',130],['buburuza','Buburuza',124],['natasha-denona','Natasha Denona',180],['palindrom','Palindrom',142],['12k','12K',136],['le-papa','Le Papa',166],['lg','LG',38],['instant-funding','Instant Funding',43]];

// Testimonials appear only once clients have sent them: [quote, name, role and company].
export const testimonials={ru:[],en:[]};

const copy={
 ru:{
  title:'Услуги.',lead:'Продукт, бренд и визуал под ключ. Работаю с фаундерами и продуктовыми командами, в приоритете AI и SaaS.',
  servicesTitle:'Что я делаю',
  services:[
   ['01','Продукт под ключ','Исследование, сценарии, интерфейсы и рабочий прототип. Собираю его на коде вместе с ИИ, чтобы идею можно было проверить на людях, а не на картинках.',['UX и UI','Прототип на коде','Передача в разработку']],
   ['02','Брендинг','Логотип, айдентика и правила, по которым бренд узнают везде: от сайта и упаковки до соцсетей и презентаций.',['Логотип и айдентика','Гайдлайн','Носители']],
   ['03','Дизайн-системы','UI-кит, токены и компоненты, которые команда переиспользует вместо того, чтобы рисовать экраны заново.',['UI-кит','Токены и компоненты','Документация']],
   ['04','3D и моушен','Продуктовые рендеры и анимации, которые объясняют устройство продукта и заменяют часть съёмок.',['Рендеры продукта','Анимации и ролики','Визуал для запуска']],
  ],
  forTitle:'Для кого',
  forList:[['Фаундеры','Нужно быстро показать продукт инвесторам или первым клиентам.'],['AI и SaaS-команды','Сложная логика, которую надо превратить в понятный интерфейс.'],['Бренды и e-commerce','Запуск, ребрендинг или визуал, который продаёт.']],
  formatsNote:'Беру проект целиком или подключаюсь к команде надолго.',
  howTitle:'Как идёт работа',
  how:[['Знакомство','Созваниваемся, разбираем задачу, сроки и что считать результатом.'],['Концепция','Исследую контекст и показываю направление до того, как рисовать всё.'],['Дизайн и прототип','Собираю интерфейсы, бренд или визуал и проверяю их на реальных сценариях.'],['Передача','Отдаю файлы, систему и прототип так, чтобы команда могла работать дальше.']],
  clientsTitle:'С кем работал',numbersTitle:'В цифрах',reviewsTitle:'Отзывы',
  ctaTitle:'Обсудим проект?',ctaText:'Напиши пару строк о задаче, отвечу в течение дня. Или собери макет своего продукта за минуту.',ctaBuild:'Собрать макет',cases:'Смотреть кейсы',back:'На главную',
 },
 en:{
  title:'Services.',lead:'Product, brand and visuals end to end. I work with founders and product teams, with AI and SaaS as a priority.',
  servicesTitle:'What I do',
  services:[
   ['01','Product end to end','Research, flows, interfaces and a working prototype. I build it in code with AI, so the idea is tested on people, not on pictures.',['UX and UI','Coded prototype','Developer handoff']],
   ['02','Branding','A logo, an identity and the rules that make the brand recognisable everywhere: site, packaging, social and decks.',['Logo and identity','Guidelines','Applications']],
   ['03','Design systems','A UI kit, tokens and components the team reuses instead of drawing screens from scratch.',['UI kit','Tokens and components','Documentation']],
   ['04','3D and motion','Product renders and animation that explain how the product works and replace part of the photo shoots.',['Product renders','Animation and video','Launch visuals']],
  ],
  forTitle:'Who it’s for',
  forList:[['Founders','You need to show the product to investors or first customers, fast.'],['AI and SaaS teams','Complex logic that has to become a clear interface.'],['Brands and e-commerce','A launch, a rebrand or visuals that sell.']],
  formatsNote:'I take on a whole project or join a team for the long run.',
  howTitle:'How we work',
  how:[['Intro','A call to go through the task, the timeline and what counts as the result.'],['Concept','I study the context and show a direction before designing everything.'],['Design and prototype','I build the interfaces, brand or visuals and test them on real scenarios.'],['Handoff','Files, system and prototype delivered so the team can carry on.']],
  clientsTitle:'Worked with',numbersTitle:'In numbers',reviewsTitle:'Testimonials',
  ctaTitle:'Let’s talk about your project?',ctaText:'Write a few lines about the task, I reply within a day. Or build a mock-up of your product in a minute.',ctaBuild:'Build a mock-up',cases:'See case studies',back:'Back home',
 },
};

export default function ServicesPage({lang}){
 const d=copy[lang],reviews=testimonials[lang];
 return <article id="top" className="services-page">
  <a className="text-action back-home" href={homeUrl(lang)}><Arrow left/><FlipText>{d.back}</FlipText></a>
  <header className="services-hero"><h1>{d.title}</h1><p>{d.lead}</p></header>

  <section className="services-block" aria-labelledby="services-what"><h2 id="services-what">{d.servicesTitle}</h2>
   <div className="services-grid">{d.services.map(([n,title,text,items])=><div className="services-card" key={n}><small>{n}</small><h3>{title}</h3><p>{text}</p><ul>{items.map(x=><li key={x}>{x}</li>)}</ul></div>)}</div>
  </section>

  <section className="services-block" aria-labelledby="services-numbers"><h2 id="services-numbers">{d.numbersTitle}</h2>
   <div className="services-numbers">{achievements[lang].map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
  </section>

  <section className="services-block" aria-labelledby="services-clients"><h2 id="services-clients">{d.clientsTitle}</h2>
   <div className="brand-list services-clients" role="list">{clients.map(([slug,name,width])=><div className={`brand-logo brand-logo-${slug}`} role="listitem" key={slug}><img src={`/assets/companies/${slug}.svg`} alt={name} style={{'--logo-width':`${width}px`}} loading="lazy" decoding="async"/></div>)}</div>
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

  <section className="services-cta"><h2>{d.ctaTitle}</h2><p>{d.ctaText}</p>
   <div className="services-actions">
    <Magnetic as="a" className="mag-solid" href={`mailto:${EMAIL}`}><span>{EMAIL}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={TELEGRAM} target="_blank" rel="noreferrer"><span>Telegram {TELEGRAM_HANDLE}</span><Arrow/></Magnetic>
    <Magnetic as="a" href={`${homeUrl(lang)}#top`}><span>{d.ctaBuild}</span></Magnetic>
    <Magnetic as="a" href={workUrl(lang,'cases')}><span>{d.cases}</span></Magnetic>
   </div>
  </section>
 </article>;
}
