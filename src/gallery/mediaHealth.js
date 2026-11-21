import {useCallback,useEffect,useState} from 'react';

const STORAGE_KEY='inackra-unavailable-media';
export function readUnavailable(){
 try{const stored=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]');return new Set(Array.isArray(stored)?stored.filter(id=>/^[gv]\d{3}$/.test(id)):[])}catch{return new Set()}
}
export function useUnavailableMedia(){
 const [unavailable,setUnavailable]=useState(()=>new Set());
 useEffect(()=>setUnavailable(readUnavailable()),[]);
 const hide=useCallback(id=>setUnavailable(previous=>{
  if(previous.has(id))return previous;
  const next=new Set(previous);next.add(id);
  try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify([...next]))}catch{}
  return next;
 }),[]);
 return [unavailable,hide];
}
