import {homeUrl,workUrl,ordinaryClick,parseRoute} from '../routes';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import {scrollTo} from '../scroll';
import Media from './Media';
import {catalog,filters,shuffled,sessionSeed,visualUrl,validFilter,recommendations} from './model';
import {useUnavailableMedia} from './mediaHealth';
import './gallery.css';

export function Masonry({items,render}){
 const grid=useRef(null);
 useEffect(()=>{
  const node=grid.current;if(!node)return;
  const layout=()=>{for(const child of node.children){const width=child.getBoundingClientRect().width;const ratio=Number(child.dataset.ratio)||1;child.style.gridRowEnd=`span ${Math.ceil((width/ratio+12)/16)}`}};
  layout();const observer=new ResizeObserver(layout);observer.observe(node);return()=>observer.disconnect();
 },[items]);
 return <div className="media-wall" ref={grid}>{items.map(item=><div className={`wall-cell${item.type==='project'?' wall-project':''}`} key={item.id} data-ratio={item.type==='project'? .8:item.width/item.height}>{render(item)}</div>)}</div>;
}
function VisualTile({item,lang,paused,filter,onUnavailable}){
 return <a className="visual-tile" href={visualUrl(item.id,filter,lang)} aria-label={item.type==='video'?(lang==='ru'?'Открыть видео':'Open video'):(lang==='ru'?'Открыть изображение':'Open image')} onClick={()=>{try{if(location.pathname.replace(/\/$/,'')==='/work')sessionStorage.setItem('inackra-wall-return',JSON.stringify({y:window.scrollY,filter}))}catch{}}}><Media item={item} lang={lang} paused={paused} onUnavailable={onUnavailable}/></a>;
}
export default function Gallery({cases,renderCard,lang,paused,initialFilter='all'}){
 const [filter,setFilter]=useState(initialFilter);
 const [seed,setSeed]=useState(42);
 useEffect(()=>{setSeed(sessionSeed());const restore=()=>setFilter(parseRoute(location.pathname).filter);addEventListener('popstate',restore);const legacy=new URLSearchParams(location.search).get('filter');if(legacy)setFilter(validFilter(legacy));return()=>removeEventListener('popstate',restore)},[]);

 const [unavailable,hideUnavailable]=useUnavailableMedia();
 const filterBar=useRef(null);
 const [chrome,setChrome]=useState({pinned:false,height:0});
 useEffect(()=>{
  const node=filterBar.current;if(!node)return;let frame;
  const update=()=>{frame=null;const rect=node.getBoundingClientRect(),top=parseFloat(getComputedStyle(node).top)||0;const pinned=window.scrollY>0&&rect.top<=top+1,height=pinned?Math.ceil(rect.bottom+18):0;setChrome(previous=>previous.pinned===pinned&&previous.height===height?previous:{pinned,height})};
  const schedule=()=>{if(frame==null)frame=requestAnimationFrame(update)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  const observer=new ResizeObserver(schedule);observer.observe(node);schedule();
  return()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer.disconnect();if(frame!=null)cancelAnimationFrame(frame)};
 },[]);
 const items=useMemo(()=>shuffled([...catalog,...cases.map(project=>({id:project.id,type:'project',project}))],seed),[cases,seed]);
 const available=useMemo(()=>items.filter(item=>!unavailable.has(item.id)),[items,unavailable]);
 const visible=useMemo(()=>available.filter(item=>filter==='all'||(filter==='cases'?item.type==='project':item.type===filter)),[available,filter]);
 useEffect(()=>{
  try{const saved=JSON.parse(sessionStorage.getItem('inackra-wall-return')||'null');if(saved&&saved.filter===filter){sessionStorage.removeItem('inackra-wall-return');requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:saved.y,behavior:'instant'})))}}catch{}
 },[]);
 const choose=value=>{setFilter(value);history.pushState(null,'',workUrl(lang,value));dispatchEvent(new Event('inackra:navigate'));if(window.scrollY>200)requestAnimationFrame(()=>scrollTo(document.getElementById('gallery-filters'),{offset:-100,immediate:true}))};
 return <section className="archive-page gallery-page" id="top" data-pinned={chrome.pinned}>
  <div className="gallery-top-chrome" aria-hidden="true" style={{height:chrome.height}}/>
  <h1 data-motion-text="true" data-motion-state="waiting">{lang==='ru'?'Все работы.':'All work.'}</h1>
  <div className="archive-filters gallery-filters" id="gallery-filters" ref={filterBar} role="group" aria-label={lang==='ru'?'Формат работы':'Work format'}>{filters.map(([id,ru,en])=><a key={id} href={workUrl(lang,id)} aria-current={filter===id?'page':undefined} onClick={e=>{if(ordinaryClick(e)){e.preventDefault();choose(id)}}}><FlipText>{lang==='ru'?ru:en}</FlipText><small>{id==='all'?available.length:available.filter(item=>item.type===(id==='cases'?'project':id)).length}</small></a>)}</div>
  <span className="sr-only" role="status">{visible.length} {lang==='ru'?'работ':'works'}</span>
  <Masonry items={visible} render={item=>item.type==='project'?renderCard(item.project,cases.indexOf(item.project)):<VisualTile item={item} lang={lang} paused={paused} filter={filter} onUnavailable={hideUnavailable}/>}/>
  <a className="text-action back-home" href={homeUrl(lang)}><Arrow left/><FlipText>{lang==='ru'?'На главную':'Back home'}</FlipText></a>
 </section>;
}
export function VisualPage({id,lang,paused}){
 const item=catalog.find(x=>x.id===id),[seed,setSeed]=useState(42);
 useEffect(()=>setSeed(sessionSeed()),[]);
 const [unavailable,hideUnavailable]=useUnavailableMedia();
 const [filter,setFilter]=useState('all');
 useEffect(()=>setFilter(validFilter(new URLSearchParams(location.search).get('from'))),[]);
 const related=useMemo(()=>item?recommendations(item,seed).filter(work=>!unavailable.has(work.id)):[],[item,seed,unavailable]);
 if(!item)return <section className="visual-page" id="top"><h1>{lang==='ru'?'Работа не найдена':'Work not found'}</h1><a className="text-action" href={workUrl(lang)}><Arrow left/><FlipText>{lang==='ru'?'Все работы':'All work'}</FlipText></a></section>;
 return <section className="visual-page" id="top">
  <h1 className="sr-only">{item.type==='video'?(lang==='ru'?'Видео INACKRA':'Video by INACKRA'):(lang==='ru'?'Графика INACKRA':'Image by INACKRA')}</h1>
  <a className="text-action back-home visual-back" href={workUrl(lang,filter)}><Arrow left/><FlipText>{lang==='ru'?'Все работы':'All work'}</FlipText></a>
  {!unavailable.has(item.id)&&<Media key={item.id} item={item} lang={lang} paused={paused} detail onUnavailable={hideUnavailable}/>}
  <h2 className="recommendations-heading">{lang==='ru'?'Ещё посмотреть':'More to explore'}</h2>
  <Masonry items={related} render={relatedItem=><VisualTile item={relatedItem} lang={lang} paused={paused} filter={filter} onUnavailable={hideUnavailable}/>}/>
 </section>;
}
