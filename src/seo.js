import {parseRoute,homeUrl,workUrl,caseUrl,taskUrl,languageUrl} from './routes';
import {content,EMAIL,LINKEDIN} from './content';
import {getCaseStudies} from './caseStudies';
import searchTasks from './searchTasks.json';
const getTasks=lang=>searchTasks[lang].aio;
const getPlenumTasks=lang=>searchTasks[lang].plenum;
import catalog from './gallery/catalog.json';
export const ORIGIN='https://inackra.work';
const absolute=path=>ORIGIN+path;
const person={'@type':'Person','@id':ORIGIN+'/#person',name:'Yan Kavaleu',alternateName:'INACKRA',url:ORIGIN+'/',jobTitle:'Multidisciplinary Designer',email:EMAIL,sameAs:[LINKEDIN],knowsAbout:['Digital product design','User experience design','Visual identity','3D graphics','Motion design','AI-assisted development']};
export function metadata(path='/'){
 const route=parseRoute(path),{lang,archive,privacy,visualId,caseId,task}=route,ru=lang==='ru',cases=getCaseStudies(content[lang].work.cases,lang),project=cases.find(p=>p.id===caseId),visual=catalog.find(p=>p.id===visualId);
 const tasks=caseId==='aio'?getTasks(lang):caseId==='plenum'?getPlenumTasks(lang):[],scenario=tasks.find(p=>p.id===task);
 const known=route.clean==='/'||archive||privacy||Boolean(visual)||Boolean(project&&(!task||scenario));
 let title='Yan Kavaleu — Multidisciplinary Designer / INACKRA',description=ru?'Ян Ковалев (INACKRA) — мультидисциплинарный дизайнер. Сложные цифровые продукты и дизайн-системы для команд. UX, визуальный дизайн и AI-разработка. 8 лет опыта.':'Yan Kavaleu (INACKRA), multidisciplinary designer. Complex digital products and design systems for teams. UX, visual design and AI-assisted development. 8 years in design.',image='/assets/covers/aio.png';
 if(archive){const names={all:ru?'Все работы':'All work',cases:ru?'Продуктовые кейсы':'Product case studies',image:ru?'Графика и 3D':'Graphics and 3D',video:ru?'Моушен и видео':'Motion and video'};title=`${names[route.filter]} — INACKRA / Yan Kavaleu`;description=ru?'Портфолио INACKRA: продуктовые кейсы Plenum, AIO Tech, Semrush и Buburuza, графика, 3D и моушен. Фильтрация по формату работы.':'INACKRA’s portfolio: Plenum, AIO Tech, Semrush and Buburuza product case studies, graphics, 3D and motion. Browse by work format.';}
 if(project){title=`${scenario?scenario.label+' — ':''}${project.name} — ${ru?'кейс':'case study'} / INACKRA`;description=scenario?.summary||project.headline||project.line;image=project.cover?.path||image;}
 if(privacy){title=ru?'Конфиденциальность — INACKRA':'Privacy — INACKRA';description=ru?'Как INACKRA обрабатывает заявки, контактные данные и настройки посетителей сайта.':'How INACKRA handles enquiries, contact details and visitor preferences.';}
 if(visual){title=`${visual.type==='video'?(ru?'Моушен':'Motion'):(ru?'Графическая работа':'Visual work')} ${visual.id.toUpperCase()} — INACKRA`;description=ru?'Авторская визуальная работа INACKRA. Посмотри работу и другие материалы того же формата.':'An original visual work by INACKRA. View this piece and explore more work in the same format.';image=visual.type==='image'?`https://media.inackra.work/${visual.key}`:visual.poster?`https://media.inackra.work/${visual.poster}`:image;}
 if(!known){title=ru?'Страница не найдена — INACKRA':'Page not found — INACKRA';description=ru?'Такой страницы нет. Перейди на главную или посмотри все работы INACKRA.':'This page does not exist. Visit INACKRA’s homepage or browse all work.';}
 const canonical=absolute(languageUrl(path,lang)),url=canonical,site={'@type':'WebSite','@id':ORIGIN+'/#website',url:ORIGIN+'/',name:'INACKRA — Yan Kavaleu',publisher:{'@id':person['@id']},inLanguage:['ru','en']};
 const page={'@type':route.clean==='/'?'ProfilePage':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:lang,isPartOf:{'@id':site['@id']},mainEntity:route.clean==='/'?{'@id':person['@id']}:undefined};
 const graph=[person,site,page];
 if(project){const work={'@type':'CreativeWork','@id':url+'#case-study',name:scenario?`${project.name}: ${scenario.title}`:project.name,description,url,inLanguage:lang,creator:{'@id':person['@id']},image:absolute(image),genre:'Design case study'};if(scenario)work.isPartOf={'@type':'CreativeWork',name:project.name,url:absolute(caseUrl(caseId,lang))};graph.push(work);page.mainEntity={'@id':work['@id']};}
 if(route.clean!=='/'){const crumbs=[{name:ru?'Главная':'Home',item:absolute(homeUrl(lang))}];if(archive||project||visual)crumbs.push({name:ru?'Все работы':'All work',item:absolute(workUrl(lang))});if(project)crumbs.push({name:project.name,item:absolute(caseUrl(caseId,lang))});if(scenario)crumbs.push({name:scenario.label,item:url});if(privacy||visual)crumbs.push({name:privacy?(ru?'Конфиденциальность':'Privacy'):title,item:url});graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))});}
 return {title,description,lang,canonical,image:image.startsWith('https:')?image:absolute(image),robots:!known||visual||project?.status!=='ready'&&project?'noindex,follow':'index,follow',alternates:['ru','en'].map(lang=>({lang,url:absolute(languageUrl(path,lang))})),schema:{'@context':'https://schema.org','@graph':graph},known};
}
export function applyMetadata(path){
 const m=metadata(path);document.documentElement.lang=m.lang;document.title=m.title;
 const meta=(selector,attrs)=>{let node=document.head.querySelector(selector);if(!node){node=document.createElement(selector.startsWith('link')?'link':'meta');document.head.append(node)}for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value)};
 meta('meta[name="description"]',{name:'description',content:m.description});meta('meta[name="robots"]',{name:'robots',content:m.robots});meta('link[rel="canonical"]',{rel:'canonical',href:m.canonical});
 for(const [property,content] of Object.entries({'og:title':m.title,'og:description':m.description,'og:url':m.canonical,'og:image':m.image,'og:locale':m.lang==='ru'?'ru_RU':'en_US'}))meta(`meta[property="${property}"]`,{property,content});
 for(const [name,content] of Object.entries({'twitter:title':m.title,'twitter:description':m.description,'twitter:image':m.image}))meta(`meta[name="${name}"]`,{name,content});
 for(const a of [...m.alternates,{lang:'x-default',url:m.alternates[0].url}])meta(`link[hreflang="${a.lang}"]`,{rel:'alternate',hreflang:a.lang,href:a.url});
 let node=document.getElementById('site-schema');if(!node){node=document.createElement('script');node.id='site-schema';node.type='application/ld+json';document.head.append(node)}node.textContent=JSON.stringify(m.schema);
}
export function allRoutes(){const base=['/','/work/','/work/cases/','/work/images/','/work/video/','/privacy/',...getCaseStudies(content.ru.work.cases,'ru').map(p=>caseUrl(p.id)),...getTasks('ru').map(t=>taskUrl('aio',t.id)),...getPlenumTasks('ru').map(t=>taskUrl('plenum',t.id)),...catalog.map(p=>`/work/visual/${p.id}/`)];return base.flatMap(p=>[p,languageUrl(p,'en')]);}
