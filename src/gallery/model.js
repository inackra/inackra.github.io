import catalog from './catalog.json';
export {catalog};
export const MEDIA_ORIGIN=import.meta.env?.VITE_MEDIA_ORIGIN||'https://media.inackra.work';
export const mediaUrl=key=>`${MEDIA_ORIGIN}/${key}`;
export const visualUrl=(id,filter='all')=>`/work/visual/${id}/?from=${encodeURIComponent(filter)}`;
export const filters=[['all','Все','All'],['cases','Кейсы','Cases'],['image','Изображения','Images'],['video','Видео','Video']];
export function shuffled(items,seed){
 const result=[...items];let state=seed>>>0;
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
 return result;
}
export function sessionSeed(){
 if(typeof window==='undefined')return 42;
 try{let seed=sessionStorage.getItem('inackra-wall-seed');if(!seed){seed=String(crypto.getRandomValues(new Uint32Array(1))[0]);sessionStorage.setItem('inackra-wall-seed',seed)}return Number(seed)}catch{return 42}
}
export const recommendations=(item,seed)=>shuffled(catalog.filter(x=>x.type===item.type&&x.id!==item.id),seed);
export const validFilter=value=>filters.some(([id])=>id===value)?value:'all';
