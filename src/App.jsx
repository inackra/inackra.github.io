import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Demo from './Demo';
import Boot from './Boot';
export default function App({initialPath='/'}){
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const target=document.getElementById('boot-root');if(!target){setReady(true);return}
  const root=createRoot(target);let finished=false;
  const finish=()=>{if(finished)return;finished=true;clearTimeout(window.__bootFallback);setTimeout(()=>{root.unmount();target.remove();setReady(true)},0)};
  addEventListener('inackra:boot-timeout',finish);root.render(<Boot onComplete={finish}/>);
  return()=>{removeEventListener('inackra:boot-timeout',finish);setTimeout(()=>root.unmount(),0)};
 },[]);
 return <Demo initialPath={initialPath} ready={ready}/>;
}
