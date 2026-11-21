import {readFile,writeFile} from 'node:fs/promises';
import {getPlenumTasks} from '../src/plenum/story.js';
const pick=tasks=>tasks.map(({id,label,title,summary})=>({id,label,title,summary}));
const data={};for(const lang of ['ru','en'])data[lang]={aio:pick(JSON.parse(await readFile(`src/aio/tasks.${lang}.json`,'utf8'))),plenum:pick(getPlenumTasks(lang))};
// Keep search metadata small: full case narratives and evidence stay in lazy case chunks.
await writeFile('src/searchTasks.json',JSON.stringify(data)+'\n');
