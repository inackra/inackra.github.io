import React,{useState,useRef,useEffect} from 'react';
import {flushSync} from 'react-dom';
import MotionField from './MotionField';
import FlipText from './FlipText';
import CaseCard from './CaseCard';
import Magnetic from './Magnetic';
import Arrow from './Arrow';
import PrivacyPage from './PrivacyPage';
import Icon from './Icon';
import ProjectPage from './ProjectPage';
import {caseUrl,homeUrl,workUrl,parseRoute,languageUrl} from './routes';
import {applyMetadata} from './seo';
import {mountScroll,blockScroll,scrollTo} from './scroll';
import Gallery,{VisualPage} from './gallery/Gallery';
import {getCaseStudies} from './caseStudies';
import {content,EMAIL,LINKEDIN,TELEGRAM,TELEGRAM_HANDLE} from './content';
import Constructor from './studio/Constructor';
import './demo.css';
import './home.css';
import './pills.css';
import {mountPills} from './pills';
const copy={
 ru:{menu:'Меню',close:'Закрыть',work:'Проекты',about:'Обо мне',contact:'Контакт',structure:'Структура',
  hero:['Дизайн.','В действии.'],heroLabel:'Yan Kavaleu / Multidisciplinary Designer',heroText:'Проектирую сложные цифровые продукты и создаю дизайн-системы, которые ускоряют работу команд. Соединяю UX, визуальный дизайн и AI-разработку.',heroProof:'8 лет в дизайне · опыт в Semrush · развиваю Plenum',client:'Обсудить проект',employer:'Рассмотреть в команду',scroll:'Листай дальше',
  intro:'От логики продукта до визуального языка и реализации. Связываю интерфейсы, брендинг, 3D и моушен в единую систему.',
  workHeading:'Разные задачи.\nСистемный подход.',workNote:'Продуктовые сценарии, дизайн-системы и визуальные коммуникации.',explore:'Открыть кейс',more:'Другие работы',
  caseTypes:['AI-продукт / собственный проект','Дизайн-системы / производство','B2B SaaS / продуктовый UX','Бренд / веб / визуальная система'],
  caseLines:['Разговор, документы и знания команды — в одном контексте.','Системы, которыми команды могут пользоваться самостоятельно.','От настройки эксперимента до понятного результата.','Единый язык для продукта и его коммуникаций.'],
  aboutHeading:'Продуктовое мышление.\nВизуальный кругозор.',aboutText:'Я Ян, мультидисциплинарный дизайнер с 8 годами опыта. Работаю с цифровыми продуктами, брендингом, графикой и 3D-моушеном. Сейчас развиваю собственный AI-продукт Plenum.',aboutSecond:'Моя сильная сторона — связывать продуктовую логику, дизайн-систему и визуальный язык с реализацией. В текущем процессе использую AI-агентов для исследований, визуальных материалов и разработки. Задаю направление, проверяю результат и довожу идеи до работающих прототипов и программных решений.',years:'лет в дизайне',
  togetherTitle:'Твоя задача.\nМой следующий проект.',forClient:'Для проекта',forTeam:'Для команды',clientText:'Цифровой продукт, интерфейс, айдентика, 3D или моушен. Помогу связать идею, визуальный язык и реализацию — начнём с задачи и первого проверяемого результата.',teamText:'Мультидисциплинарный дизайнер, который связывает продуктовые сценарии, дизайн-системы и реализацию. Помогаю команде быстрее проверять идеи и выстраивать процессы, которые работают без постоянного участия дизайнера.',cv:'Скачать CV',role:'Обсудить роль',
  contactTitle:'Давай\nобсудим.',contactText:'Несколько строк о проекте или роли — хорошее начало.',footer:'Yan Kavaleu / INACKRA',pause:'Остановить движение',resume:'Включить движение',top:'Наверх',
  allWork:'Все работы',allWorkMeta:'Лента',allWorkLine:'Продукты, бренды, 3D, моушен и графика в одной ленте.',allWorkOpen:'Смотреть ленту',products:'Продукты',productsMeta:'Кейсы',productsLine:'Продуктовые кейсы: задача, процесс и результат.',productsOpen:'Открыть кейсы',moreLabel:'Работы',light:'Светлая тема',dark:'Тёмная тема',
 },
 en:{menu:'Menu',close:'Close',work:'Work',about:'About',contact:'Contact',structure:'Structure',
  hero:['Design.','Made real.'],heroLabel:'Yan Kavaleu / Multidisciplinary Designer',heroText:'I design complex digital products and design systems that help teams work faster. Connecting UX, visual design and AI-assisted development.',heroProof:'8 years in design · experience at Semrush · building Plenum',client:'Discuss a project',employer:'Explore a team fit',scroll:'Keep scrolling',
  intro:'From product logic to visual identity and implementation. I bring interfaces, branding, 3D and motion together as one system.',workHeading:'Different challenges.\nSystems thinking.',workNote:'Product workflows, design systems and visual communication.',explore:'Explore case',more:'More work',caseTypes:['AI product / independent project','Design systems / production','B2B SaaS / product UX','Brand / web / visual system'],
  caseLines:['Conversation, documents and team knowledge. Connected.','Systems that teams can build with independently.','From experiment configuration to meaningful results.','One visual language for a product and its communications.'],
  aboutHeading:'Product thinking.\nVisual range.',aboutText:'I’m Yan, a multidisciplinary designer with 8 years of experience across digital products, branding, graphics and 3D motion. I’m currently developing my own AI product, Plenum.',aboutSecond:'My strength is connecting product logic, design systems and visual identity with implementation. In my current workflow, I use AI agents for research, visual creation and development. I set the direction, review the results and build working prototypes and software.',years:'years in design',
  togetherTitle:'Your challenge.\nMy next project.',forClient:'For your project',forTeam:'For your team',clientText:'A digital product, interface, brand identity, 3D or motion. I connect the idea, visual language and implementation, starting with the challenge and a first testable outcome.',teamText:'A multidisciplinary designer connecting product workflows, design systems and implementation. I help teams test ideas faster and build processes they can use independently.',cv:'Download CV',role:'Discuss a role',
  contactTitle:'Let’s\ntalk.',contactText:'A few lines about the project or role is a good place to start.',footer:'Yan Kavaleu / INACKRA',pause:'Pause motion',resume:'Resume motion',top:'Back to top',
  allWork:'All work',allWorkMeta:'Feed',allWorkLine:'Products, brands, 3D, motion and graphics in one feed.',allWorkOpen:'Open the feed',products:'Products',productsMeta:'Case studies',productsLine:'Product case studies: the task, the process and the outcome.',productsOpen:'Open case studies',moreLabel:'Work',light:'Light theme',dark:'Dark theme',
 }
};
export default function Demo({initialPath='/',ready=true}){
 const [path,setPath]=useState(initialPath);
 const route=parseRoute(path),{lang,archive,privacy,caseId,visualId}=route,casePage=Boolean(caseId||visualId);
 useEffect(()=>{const update=()=>setPath(location.pathname);addEventListener('popstate',update);addEventListener('inackra:navigate',update);return()=>{removeEventListener('popstate',update);removeEventListener('inackra:navigate',update)}},[]);
 useEffect(()=>mountPills(),[]);
 const [theme,setTheme]=useState('dark');
 useEffect(()=>{const t=document.documentElement.dataset.theme;if(t==='light'||t==='dark')setTheme(t);else if(matchMedia('(prefers-color-scheme: light)').matches)setTheme('light')},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
 // The new theme rises over the page like the button fill: a wide ellipse from the bottom edge.
 const toggleTheme=()=>{
  const next=theme==='dark'?'light':'dark',html=document.documentElement;
  try{localStorage.setItem('inackra-theme',next)}catch{}
  const apply=()=>{flushSync(()=>setTheme(next));html.dataset.theme=next};
  if(!document.startViewTransition||paused||matchMedia('(prefers-reduced-motion: reduce)').matches){html.classList.add('theme-swap');setTimeout(()=>html.classList.remove('theme-swap'),650);apply();return}
  const swap=document.startViewTransition(apply);
  swap.ready.then(()=>html.animate({clipPath:['ellipse(160% 0% at 50% 100%)','ellipse(160% 82% at 50% 100%)','ellipse(160% 210% at 50% 100%)']},{duration:1000,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
 };
 const [menu,setMenu]=useState(false);
 const [paused,setPaused]=useState(false);
 const [showTop,setShowTop]=useState(false);
 useEffect(()=>{
  const update=()=>setShowTop(window.scrollY>Math.min(window.innerHeight*.65,480));
  update();
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  return ()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[]);
 const menuCanvas=useRef(null);
 const d=copy[lang],t=content[lang],cases=getCaseStudies(t.work.cases,lang);
 const soonText=lang==='ru'?'Кейс готовится к публикации.':'Case study coming soon.';
 useEffect(()=>{applyMetadata(path);try{localStorage.setItem('yan-language',lang)}catch{}},[path,lang]);
 useEffect(()=>{document.body.classList.toggle('motion-paused',paused);document.documentElement.style.scrollBehavior='auto';return()=>{document.body.classList.remove('motion-paused');document.documentElement.style.scrollBehavior=''}},[paused]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setPaused(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>mountScroll(),[]);
 useEffect(()=>{blockScroll(menu||!ready)},[menu,ready]);
 useEffect(()=>{document.body.style.overflow=menu?'hidden':'';return()=>{document.body.style.overflow=''}},[menu]);
 useEffect(()=>{const hash=location.hash.slice(1);if(hash)requestAnimationFrame(()=>scrollTo(document.getElementById(hash),{immediate:true}));},[]);
 useEffect(()=>{
  const anchor=e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest?.('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1),target=document.getElementById(id);if(!target)return;e.preventDefault();setMenu(false);requestAnimationFrame(()=>{scrollTo(target);history.pushState(null,'',`#${id}`)})};
  document.addEventListener('click',anchor);return()=>document.removeEventListener('click',anchor);
 },[paused]);
 const renderCard=(item,i)=><CaseCard key={item.id} id={`case-${item.id}`} className={`case-${item.id}${item.cover?' has-artwork':''}`} artwork={item.cover?<div className="case-artwork" aria-hidden="true"><img src={item.cover.path} width={item.cover.width} height={item.cover.height} alt="" loading="lazy" decoding="async"/></div>:null} paused={paused} version={lang}>
    <div className="case-head"><div className="case-meta"><span data-motion-text="true" data-motion-state="waiting">{String(i+1).padStart(2,'0')} / {String(cases.length).padStart(2,'0')}</span><span data-motion-text="true" data-motion-state="waiting">{item.discipline||item.category}</span></div><h3 id={`case-${item.id}-title`} data-motion-text="true" data-motion-state="waiting">{item.name}</h3></div>
    {item.id==='plenum'&&!item.cover&&<div className="case-visual"><h4 data-motion-text="true" data-motion-state="waiting" className="powered-ai"><span className="ai-line">Powered</span><span className="ai-line">by AI.</span></h4></div>}

    <div className="case-bottom"><div><p data-motion-text="true" data-motion-state="waiting" className="case-line">{item.line}</p><p data-motion-text="true" data-motion-state="waiting" className="case-outcome">{item.status==='ready'?item.takeaway:soonText}</p></div>{item.status==='ready'?<a data-motion-text="true" data-motion-state="waiting" className="case-open" href={caseUrl(item.id,lang)}><FlipText>{d.explore}</FlipText><Arrow/></a>:<a data-motion-text="true" data-motion-state="waiting" className="case-open case-soon" href={caseUrl(item.id,lang)}><FlipText>Soon</FlipText><Arrow/></a>}</div>
   </CaseCard>;
 return <div className="demo-root" data-layout={archive||casePage?'centered':privacy?'rail':'home'} onContextMenu={e=>{if(e.target.closest?.('img,video,.wall-media,.case-image,.project-cover,.image-lightbox,.case-artwork,.project-neighbour'))e.preventDefault()}} onDragStart={e=>{if(e.target.closest?.('img,video,.wall-media,.case-image,.project-cover'))e.preventDefault()}} data-motion={paused?'off':'on'}>
  <MotionField menuCanvas={menuCanvas} lang={lang} paused={paused} enabled={ready} theme={theme}/>
  <a className="skip" href="#main">{t.skip}</a>
  <header className="site-header">
   <div className="header-left"><button type="button" className="theme-toggle" data-theme-state={theme} aria-label={theme==='dark'?d.light:d.dark} title={theme==='dark'?d.light:d.dark} onClick={toggleTheme}><i aria-hidden="true"/><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button><span className="header-id"><b>Yan Kavaleu</b><span>Multidisciplinary Designer</span></span></div>
   <a className="wordmark" href={archive||privacy||casePage?homeUrl(lang):'#top'} aria-label="INACKRA — на главную"><img src="/assets/inackra.svg" width="180" height="37" alt="INACKRA"/></a>
   <div className="header-controls"><div className="language" aria-label="Language"><a aria-current={lang==='ru'?'page':undefined} href={languageUrl(path,'ru')}>RU</a><a aria-current={lang==='en'?'page':undefined} href={languageUrl(path,'en')}>EN</a></div><Magnetic className="menu-toggle mag-small" aria-label={menu?d.close:d.menu} strength={14} textStrength={8} aria-expanded={menu} aria-controls="site-menu" onClick={()=>setMenu(!menu)}><span>{menu?d.close:d.menu}</span><span className={`menu-dots${menu?' open':''}`} aria-hidden="true"><i/><i/></span></Magnetic></div>
  </header>
  {menu&&<nav className="menu-panel" id="site-menu"><canvas ref={menuCanvas} className="menu-binary-field" aria-hidden="true"/><div className="menu-links">{[[workUrl(lang),d.allWork],[workUrl(lang,'cases'),d.products]].map(([href,label])=><a data-motion-text="true" data-motion-state="waiting" key={label} href={href} onClick={()=>setMenu(false)}><span className="menu-roll"><span>{label}</span><span aria-hidden="true">{label}</span></span><Arrow/></a>)}</div><p className="menu-about" data-motion-text="true" data-motion-state="waiting">{d.aboutText}</p><div className="menu-bottom"><a href={`mailto:${EMAIL}`}><Icon name="mail"/><span>{EMAIL}</span></a><a href={TELEGRAM} target="_blank" rel="noreferrer"><Icon name="telegram"/><span>Telegram {TELEGRAM_HANDLE}</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer"><Icon name="linkedin"/><span>LinkedIn</span></a></div></nav>}
  <main id="main">{visualId?<VisualPage id={visualId} lang={lang} paused={paused||menu}/>:casePage?<ProjectPage id={caseId} initialTask={route.task} cases={cases} lang={lang} paused={paused||menu}/>:privacy?<PrivacyPage lang={lang}/>:archive?<Gallery initialFilter={route.filter} cases={cases} renderCard={renderCard} lang={lang} paused={paused||menu}/>:<>{/* Home: the constructor, then two doors into the work. */}
   <Constructor lang={lang} paused={paused||menu} shared={route.share}/>
   <section id="more" className="home-more" aria-label={d.moreLabel}><div className="home-cards">{[[workUrl(lang),d.allWork,d.allWorkMeta,d.allWorkLine,d.allWorkOpen],[workUrl(lang,'cases'),d.products,d.productsMeta,d.productsLine,d.productsOpen]].map(([href,title,meta,line,open],i)=><CaseCard key={href} id={`home-${i?'products':'work'}`} className="home-card" paused={paused||menu}>
    <div className="case-head"><div className="case-meta"><span data-motion-text="true" data-motion-state="waiting">{String(i+1).padStart(2,'0')} / 02</span><span data-motion-text="true" data-motion-state="waiting">{meta}</span></div><h3 id={`home-${i?'products':'work'}-title`} data-motion-text="true" data-motion-state="waiting">{title}</h3></div>
    <div className="case-bottom"><p data-motion-text="true" data-motion-state="waiting" className="case-line">{line}</p><Magnetic as="a" className="mag-small mag-solid home-card-link" href={href}><span>{open}</span><Arrow/></Magnetic></div>
   </CaseCard>)}</div></section>
  </>}</main>
  <footer className="site-footer"><a href={homeUrl(lang)} className="footer-name" aria-label="INACKRA — на главную"><img src="/assets/inackra.svg" width="180" height="37" alt="INACKRA"/></a><span data-motion-text="true" data-motion-state="waiting">{d.footer}<br/>© 2026</span><div className="footer-controls"><a href={`mailto:${EMAIL}`}><Icon name="mail"/><span>{EMAIL}</span></a><a href={TELEGRAM} target="_blank" rel="noreferrer"><Icon name="telegram"/><span>Telegram</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer"><Icon name="linkedin"/><span>LinkedIn</span></a><a href="/assets/Yan-Kavaleu-CV.pdf" download><Icon name="download"/><span>{d.cv}</span></a><a className="pill-quiet" href={`${homeUrl(lang)}privacy/`}><span>{lang==='ru'?'Конфиденциальность':'Privacy'}</span></a><button aria-pressed={paused} onClick={()=>setPaused(!paused)}><Icon name={paused?'play':'pause'}/><span>{paused?d.resume:d.pause}</span></button></div></footer>
  <div className="carousel-arrows floating-top" hidden={!showTop||menu||!ready}><button className="back-to-top" aria-label={d.top} onClick={()=>scrollTo(0,{immediate:paused})}><Arrow up/></button></div>

 </div>;
}
