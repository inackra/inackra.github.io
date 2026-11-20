import React,{useEffect,useRef,useState} from 'react';
import FlipText from '../FlipText';
import {mediaUrl} from './model';

function useRange(ref,margin){
 const [inside,setInside]=useState(false);
 useEffect(()=>{const node=ref.current;if(!node)return;if(!window.IntersectionObserver){setInside(true);return}const observer=new IntersectionObserver(([entry])=>setInside(entry.isIntersecting),{rootMargin:margin});observer.observe(node);return()=>observer.disconnect()},[ref,margin]);
 return inside;
}
export default function Media({item,lang='ru',paused=false,detail=false}){
 const host=useRef(null),video=useRef(null);
 const near=useRange(host,'600px'),visible=useRange(host,'0px');
 const [hidden,setHidden]=useState(false),[muted,setMuted]=useState(true),[failed,setFailed]=useState(false),[blocked,setBlocked]=useState(false);
 useEffect(()=>{const update=()=>setHidden(document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 useEffect(()=>{setFailed(false);setBlocked(false);setMuted(true)},[item.id]);
 const playable=visible&&!paused&&!hidden;
 useEffect(()=>{
  const node=video.current;if(!node)return;let cancelled=false;
  node.muted=muted;
  if(playable){const promise=node.play();promise?.then(()=>{if(!cancelled)setBlocked(false)}).catch(()=>{if(!cancelled)setBlocked(true)})}else node.pause();
  return()=>{cancelled=true;node.pause()};
 },[playable,near,muted,item.id]);
 return <div ref={host} className={`wall-media${detail?' wall-media-detail':''}`} style={{aspectRatio:`${item.width}/${item.height}`}}>
  {near&&item.type==='image'&&<img src={mediaUrl(item.key)} width={item.width} height={item.height} alt={detail?(lang==='ru'?'Визуальная работа INACKRA':'Visual work by INACKRA'):''} decoding="async" onError={()=>setFailed(true)}/>}
  {item.type==='video'&&<video ref={video} src={near?mediaUrl(item.key):undefined} poster={near&&item.poster?mediaUrl(item.poster):undefined} width={item.width} height={item.height} muted={muted} autoPlay={playable} loop playsInline preload="none" controls={detail} aria-label={lang==='ru'?'Видеоработа INACKRA':'Video work by INACKRA'} onVolumeChange={()=>{if(video.current)setMuted(video.current.muted)}} onError={()=>{if(near)setFailed(true)}}/>}
  {failed&&<div className="media-feedback"><span>{lang==='ru'?'Не удалось загрузить':'Could not load media'}</span>{detail&&<button className="text-action" onClick={()=>{setFailed(false);if(video.current){video.current.load();video.current.play().catch(()=>setBlocked(true))}else{const img=host.current.querySelector('img');if(img)img.src=mediaUrl(item.key)}}}><FlipText>{lang==='ru'?'Повторить':'Retry'}</FlipText></button>}</div>}
  {detail&&blocked&&!failed&&<button className="button solid media-play" onClick={()=>video.current?.play().then(()=>setBlocked(false)).catch(()=>setBlocked(true))}><FlipText>{lang==='ru'?'Воспроизвести':'Play video'}</FlipText></button>}
  {detail&&item.hasAudio&&<button className="button media-sound" aria-pressed={!muted} onClick={()=>setMuted(value=>!value)}><FlipText>{muted?(lang==='ru'?'Включить звук':'Sound on'):(lang==='ru'?'Выключить звук':'Sound off')}</FlipText></button>}
  {!detail&&blocked&&!failed&&<span className="media-format" aria-hidden="true">{lang==='ru'?'Видео':'Video'}</span>}
 </div>;
}
