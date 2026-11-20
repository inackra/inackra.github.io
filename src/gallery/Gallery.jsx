import React,{useEffect,useMemo,useRef,useState} from 'react';
import FlipText from '../FlipText';
import Arrow from '../Arrow';
import {scrollTo} from '../scroll';
import Media from './Media';
import {catalog,filters,shuffled,sessionSeed,visualUrl,validFilter,recommendations,mediaUrl} from './model';
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
function VisualTile({item,lang,paused,filter}){
 return <a className="visual-tile" href={visualUrl(item.id,filter)} aria-label={item.type==='video'?(lang==='ru'?'Открыть видео':'Open video'):(lang==='ru'?'Открыть изображение':'Open image')} onClick={()=>{try{if(location.pathname.replace(/\/$/,'')==='/work')sessionStorage.setItem('inackra-wall-return',JSON.stringify({y:window.scrollY,filter}))}catch{}}}><Media item={item} lang={lang} paused={paused}/></a>;
}
export default function Gallery({cases,renderCard,lang,paused}){
 const [filter,setFilter]=useState(()=>typeof window==='undefined'?'all':validFilter(new URLSearchParams(location.search).get('filter')));
 const [seed]=useState(sessionSeed);
 const items=useMemo(()=>shuffled([...catalog,...cases.map(project=>({id:project.id,type:'project',project}))],seed),[cases,seed]);
 const visible=useMemo(()=>items.filter(item=>filter==='all'||(filter==='cases'?item.type==='project':item.type===filter)),[items,filter]);
 useEffect(()=>{
  try{const saved=JSON.parse(sessionStorage.getItem('inackra-wall-return')||'null');if(saved&&saved.filter===filter){sessionStorage.removeItem('inackra-wall-return');requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:saved.y,behavior:'instant'})))}}catch{}
 },[]);
 const choose=value=>{setFilter(value);const url=new URL(location.href);url.searchParams.set('filter',value);history.replaceState(null,'',url);if(window.scrollY>200)requestAnimationFrame(()=>scrollTo(document.getElementById('gallery-filters'),{offset:-100,immediate:true}))};
 return <section className="archive-page gallery-page" id="top">
  <h1 data-motion-text="true" data-motion-state="waiting">{lang==='ru'?'Все работы.':'All work.'}</h1>
  <div className="archive-filters gallery-filters" id="gallery-filters" role="group" aria-label={lang==='ru'?'Формат работы':'Work format'}>{filters.map(([id,ru,en])=><button key={id} aria-pressed={filter===id} onClick={()=>choose(id)}><FlipText>{lang==='ru'?ru:en}</FlipText><small>{id==='all'?items.length:id==='cases'?cases.length:catalog.filter(x=>x.type===id).length}</small></button>)}</div>
  <span className="sr-only" role="status">{visible.length} {lang==='ru'?'работ':'works'}</span>
  <Masonry items={visible} render={item=>item.type==='project'?renderCard(item.project,cases.indexOf(item.project)):<VisualTile item={item} lang={lang} paused={paused} filter={filter}/>}/>
  <a className="text-action back-home" href="/"><Arrow left/><FlipText>{lang==='ru'?'На главную':'Back home'}</FlipText></a>
 </section>;
}
export function VisualPage({id,lang,paused}){
 const item=catalog.find(x=>x.id===id),[seed]=useState(sessionSeed);
 const filter=typeof window==='undefined'?'all':validFilter(new URLSearchParams(location.search).get('from'));
 const related=useMemo(()=>item?recommendations(item,seed):[],[item,seed]);
 if(!item)return <section className="visual-page" id="top"><h1>{lang==='ru'?'Работа не найдена':'Work not found'}</h1><a className="text-action" href="/work/"><Arrow left/><FlipText>{lang==='ru'?'Все работы':'All work'}</FlipText></a></section>;
 return <section className="visual-page" id="top">
  <h1 className="sr-only">{item.type==='video'?(lang==='ru'?'Видео INACKRA':'Video by INACKRA'):(lang==='ru'?'Графика INACKRA':'Image by INACKRA')}</h1>
  <a className="text-action back-home visual-back" href={`/work/?filter=${filter}`}><Arrow left/><FlipText>{lang==='ru'?'Все работы':'All work'}</FlipText></a>
  <Media key={item.id} item={item} lang={lang} paused={paused} detail/>
  <a className="text-action visual-original" href={mediaUrl(item.key)} target="_blank" rel="noreferrer"><FlipText>{lang==='ru'?'Открыть оригинал':'Open original'}</FlipText><Arrow/></a>
  <h2 className="recommendations-heading">{lang==='ru'?'Ещё посмотреть':'More to explore'}</h2>
  <Masonry items={related} render={relatedItem=><VisualTile item={relatedItem} lang={lang} paused={paused} filter={filter}/>}/>
 </section>;
}
