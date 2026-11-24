import {mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {render,metadata,allRoutes} from '../.prerender/ssr.js';
const template=await readFile('dist/index.html','utf8');
const escape=value=>String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function head(m){return `<title>${escape(m.title)}</title>\n<meta name="description" content="${escape(m.description)}"/>\n<meta name="robots" content="${m.robots}"/>\n<link rel="canonical" href="${m.canonical}"/>\n${[...m.alternates,{lang:'x-default',url:m.alternates[0].url}].map(a=>`<link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`).join('\n')}\n<meta property="og:type" content="${m.schema['@graph'].some(n=>n['@type']==='CreativeWork')?'article':'website'}"/><meta property="og:site_name" content="INACKRA"/><meta property="og:locale" content="${m.lang==='ru'?'ru_RU':'en_US'}"/>\n${Object.entries({'og:title':m.title,'og:description':m.description,'og:url':m.canonical,'og:image':m.image}).map(([key,value])=>`<meta property="${key}" content="${escape(value)}"/>`).join('\n')}\n${m.image.includes('/og/')?'<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:type" content="image/jpeg"/>':''}\n<meta name="twitter:card" content="summary_large_image"/>${Object.entries({'twitter:title':m.title,'twitter:description':m.description,'twitter:image':m.image}).map(([key,value])=>`<meta name="${key}" content="${escape(value)}"/>`).join('\n')}\n<script id="site-schema" type="application/ld+json">${JSON.stringify(m.schema).replace(/</g,'\\u003c')}</script>`;}
// SSR CSS is extracted separately from the client bundle. Include every lazy case stylesheet
// in the initial document so the static content has the same layout before hydration.
const manifest=JSON.parse(await readFile('dist/.vite/manifest.json','utf8'));
const css=[...new Set(Object.values(manifest).flatMap(entry=>entry.css||[]))];
const base=template.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="(?:description|robots)"[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/,'');
const routes=allRoutes();
for(const path of routes){
 const m=metadata(path),body=await render(path);
 const html=base.replace('<html lang="ru">',`<html lang="${m.lang}">`).replace('</head>',`${head(m)}${css.filter(file=>!base.includes(`/assets/${file.split('/').pop()}`)).map(file=>`<link rel="stylesheet" href="/${file}"/>`).join('')}</head>`).replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const directory='dist'+path;await mkdir(directory,{recursive:true});await writeFile(directory+'index.html',html);
}
const indexed=routes.filter(path=>metadata(path).robots==='index,follow');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${indexed.map(path=>{const m=metadata(path);return `<url><loc>${m.canonical}</loc>${m.alternates.map(a=>`<xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`).join('')}</url>`}).join('\n')}</urlset>`);
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\n\nSitemap: https://inackra.work/sitemap.xml\n');
await writeFile('dist/404.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found — INACKRA</title><style>body{background:#000;color:#eee;font:18px/1.6 system-ui;margin:10vw}a{color:inherit}</style><h1>Page not found / Страница не найдена</h1><p><a href="/">На главную</a> · <a href="/en/">Home</a> · <a href="/work/">Все работы / All work</a></p></html>`);
// llms.txt: a short plain-text card of the site for AI search and assistants.
{
 const page=path=>{const m=metadata(path);return `- [${m.title}](${m.canonical}): ${m.description}`};
 const en=indexed.filter(path=>path.startsWith('/en/')),pick=re=>en.filter(path=>re.test(path));
 const home=metadata('/en/');
 await writeFile('dist/llms.txt',[`# Yan Kavaleu (INACKRA)`,'',`> ${home.description}`,'',
  'Multidisciplinary designer: digital products, UX/UI, design systems, brand, motion and 3D. Works in Russian and English. Contact: hello@inackra.work, Telegram https://t.me/Jo1_Se.','',
  '## Services',page('/en/services/'),'',
  '## Case studies',...pick(/^\/en\/work\/[a-z]+\/$/).filter(path=>!/\/work\/(cases|images|video)\/$/.test(path)).map(page),'',
  '## Portfolio',...['/en/work/','/en/work/cases/','/en/work/images/','/en/work/video/'].filter(path=>indexed.includes(path)).map(page),'',
  '## Russian version','The same pages in Russian live without the /en/ prefix, e.g. https://inackra.work/services/.',''].join('\n'));
}
await rm('.prerender',{recursive:true,force:true});
console.log(`Prerendered ${routes.length} pages; sitemap: ${indexed.length} indexable URLs.`);
