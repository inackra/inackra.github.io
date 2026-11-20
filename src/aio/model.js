import ru from './tasks.ru.json';
import en from './tasks.en.json';
export const tasks=ru;
export const getTasks=lang=>lang==='en'?en:ru;
export const trafficModes=[{"id":"first","label":"First","box":[168,292,340,182],"text":"Первый вариант без распределения между несколькими версиями. Самое короткое состояние настройки."},{"id":"ai","label":"AI","box":[512,292,340,287],"text":"Автоматическое распределение связано с выбранной конверсией. У режима появляются параметры, которых нет в First."},{"id":"weights","label":"Weights","box":[856,292,341,287],"text":"Вес каждого варианта задаётся вручную. Числовые поля показывают, где именно пользователь управляет распределением."}];
export const imagePath=i=>'/assets/cases/allinone/'+String(i).padStart(2,'0')+'.webp';
export function resolveTask(value=''){let id;try{id=decodeURIComponent(String(value).replace(/^#/,'').replace(/^task=/,'').replace(/^aio-/,''))}catch{return 'traffic'};if(id==='editor')id='traffic';return ru.some(t=>t.id===id)?id:'traffic'}
export function adjacentTask(id,key){const i=ru.findIndex(t=>t.id===id);return ru[key==='Home'?0:key==='End'?ru.length-1:(i+(key==='ArrowLeft'?-1:1)+ru.length)%ru.length].id}
