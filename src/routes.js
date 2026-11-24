export const WORK_URL='/work/';
export const homeUrl=(lang='ru')=>lang==='en'?'/en/':'/';
export const workUrl=(lang='ru',filter='all')=>`${homeUrl(lang)}work/${filter==='all'?'':({image:'images',video:'video',cases:'cases'}[filter]||'')+'/'}`;
export const caseUrl=(id,lang='ru')=>`${homeUrl(lang)}work/${id}/`;
export const taskUrl=(project,id,lang='ru')=>`${caseUrl(project,lang)}${id}/`;
export const shareUrl=(code,lang='ru')=>`${homeUrl(lang)}b/${code}/`;
export function parseRoute(path='/'){
 const lang=/^\/en(?:\/|$)/.test(path)?'en':'ru';
 const clean=path.replace(/^\/en(?=\/|$)/,'').replace(/\/$/,'')||'/';
 const segments=clean.split('/').filter(Boolean),filter={cases:'cases',images:'image',video:'video'}[segments[1]];
 return {lang,path,clean,share:segments[0]==='b'?segments[1]||'':null,archive:clean==='/work'||Boolean(filter),filter:filter||'all',privacy:clean==='/privacy',visualId:segments[1]==='visual'?segments[2]:null,caseId:segments[0]==='work'&&segments[1]&&!filter&&segments[1]!=='visual'?segments[1]:null,task:segments[1]!=='visual'?segments[2]:null};
}
export const languageUrl=(path,lang)=>`${homeUrl(lang)}${parseRoute(path).clean.replace(/^\//,'')}`.replace(/([^/])$/,'$1/');
export const ordinaryClick=e=>e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey;
export function navigateTask(project,id,lang){history.pushState(null,'',taskUrl(project,id,lang));window.dispatchEvent(new Event('inackra:navigate'));}
