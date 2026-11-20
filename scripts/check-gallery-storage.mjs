import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const catalog=JSON.parse(await readFile(new URL('../src/gallery/catalog.json',import.meta.url),'utf8'));
const origin='https://media.inackra.work';
const objects=catalog.flatMap(item=>[{key:item.key,bytes:item.bytes,type:item.type==='video'?'video/mp4':item.key.endsWith('.png')?'image/png':'image/jpeg'},...(item.poster?[{key:item.poster,type:'image/jpeg'}]:[])]);
const failures=[];let cursor=0;
async function worker(){while(cursor<objects.length){const item=objects[cursor++];try{const response=await fetch(`${origin}/${item.key}`,{method:'HEAD',signal:AbortSignal.timeout(20000)});assert.equal(response.status,200);assert.equal(response.headers.get('content-type')?.split(';')[0],item.type);if(item.bytes)assert.equal(Number(response.headers.get('content-length')),item.bytes)}catch(error){failures.push(`${item.key}: ${error.message}`)}}}
await Promise.all(Array.from({length:3},worker));
const video=catalog.find(item=>item.type==='video');
try{const response=await fetch(`${origin}/${video.key}`,{headers:{Range:'bytes=0-1'},signal:AbortSignal.timeout(20000)});if(response.status!==206){await response.body?.cancel();throw Error(`Expected byte ranges (206), got ${response.status}`)}assert.equal(response.headers.get('content-range'),`bytes 0-1/${video.bytes}`);assert.equal((await response.arrayBuffer()).byteLength,2)}catch(error){failures.push(`Video range request: ${error.message}`)}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`PASS: ${objects.length} public media objects, original sizes, content types and video byte ranges.`);
