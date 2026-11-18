import {mkdir,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist/work',{recursive:true});
const html=await readFile('dist/index.html','utf8');
await writeFile('dist/work/index.html',html.replace('<title>Yan Kavaleu — Product Designer</title>','<title>Work — INACKRA</title>').replace('rel="canonical" href="https://inackra.work/"','rel="canonical" href="https://inackra.work/work/"'));
