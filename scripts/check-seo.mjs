import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
const origin='https://inackra.work',root='dist';
async function pages(dir){const result=[];for(const name of await readdir(dir)){const file=`${dir}/${name}`;if((await stat(file)).isDirectory())result.push(...await pages(file));else if(name==='index.html')result.push(file)}return result;}
const files=await pages(root),indexed=new Set();const shared=files.filter(f=>/\/b\/[^/]+\/index\.html$/.test(f));assert.equal(shared.length,432,'every constructor build has a share page in both languages');
for(const file of shared){const html=await readFile(file,'utf8'),image=html.match(/property="og:image" content="https:\/\/inackra\.work(\/og\/[^"]+)"/)?.[1];assert.ok(html.includes('content="noindex,follow"'),`${file} is not indexed`);assert.ok(image,`${file} has a share cover`);await stat(root+image);}
assert.equal(files.length,266+432,'both languages include every case, task, filter and media route');
const read=file=>readFile(file,'utf8'),exists=async file=>{try{await stat(file);return true}catch{return false}};
for(const file of files){
 const html=await read(file),path=file.slice(root.length).replace(/index\.html$/,''),en=path.startsWith('/en/');
 assert.ok(html.includes(`<html lang="${en?'en':'ru'}">`),path+' language');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,path+' has one primary heading');
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,path+' has one canonical');
 assert.ok(html.includes(`rel="canonical" href="${origin+path}"`),path+' self canonical');
 assert.ok(!/<!--\$[!?]-->|<div hidden id="S:/.test(html),path+' has no unresolved streaming payload');
 assert.ok(!/Loading case study|Загрузка кейса/.test(html),path+' contains the actual case');
 assert.ok(html.includes('Multidisciplinary Designer'),path+' global positioning');
 assert.ok(!/<a[^>]+href="[^"]*readymag/i.test(html),path+' has no retired portfolio links');
 const json=html.match(/<script id="site-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/);assert.ok(json,path+' structured data');
 const graph=JSON.parse(json[1])['@graph'];assert.ok(graph.find(x=>x['@type']==='Person'&&x.name==='Yan Kavaleu'));assert.ok(graph.find(x=>x['@type']==='WebSite'));
 const alternates=[...html.matchAll(/<link rel="alternate" hreflang="(ru|en)" href="https:\/\/inackra.work([^\"]+)"/g)];assert.equal(alternates.length,2,path+' language alternates');
 for(const a of alternates)assert.ok(await exists(root+a[2]+'index.html'),path+' alternate exists');
 const description=html.match(/<meta name="description" content="([^\"]+)"/);assert.ok(description?.[1].length>30,path+' meaningful description');
 if(html.includes('<meta name="robots" content="index,follow"'))indexed.add(origin+path);
 // Validate generated navigation rather than accepting Vite's fallback-to-home response.
 for(const a of html.matchAll(/<a\b[^>]*href="(\/[^\"]*)"/g)){
  const local=a[1].split(/[?#]/)[0];if(!local)continue;
  assert.ok(await exists(root+local+(local.endsWith('/')?'index.html':'')),path+' links to existing '+local);
 }
 for(const img of html.matchAll(/<(?:img|image)\b[^>]*(?:src|href)="(\/[^\"]+)"/g))assert.ok(await exists(root+img[1]),path+' local evidence exists '+img[1]);
}
const sitemap=await read(root+'/sitemap.xml'),listed=new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]));assert.deepEqual(listed,indexed,'sitemap includes exactly the indexable canonical pages');assert.equal(indexed.size,58);
const ru=JSON.parse(await read('src/aio/tasks.ru.json')),en=JSON.parse(await read('src/aio/tasks.en.json'));
for(const [lang,tasks] of [['ru',ru],['en',en]])for(const task of tasks){const html=await read(root+(lang==='en'?'/en':'')+`/work/aio/${task.id}/index.html`);assert.ok(html.includes(task.title.replace(/&/g,'&amp;')),task.id+' task-specific static narrative');assert.ok(html.includes('case-image-preview'),task.id+' real interface evidence');}
const home=await read(root+'/index.html');assert.ok(home.includes('Три шага, и ты увидишь, как может выглядеть твой продукт.'));assert.ok(home.includes('href="/work/cases/"'));assert.ok(home.includes('href="/work/"'));
assert.ok((await read(root+'/404.html')).includes('noindex,follow'));assert.ok((await read(root+'/robots.txt')).includes('Sitemap: '+origin+'/sitemap.xml'));
console.log(`PASS: ${files.length} readable static pages, ${indexed.size} canonical indexable URLs, bilingual alternates, task evidence, valid internal links, structured data and genuine 404.`);
