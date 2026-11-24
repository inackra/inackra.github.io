// Builds the share covers into public/og/<lang>/<code>.jpg. Run locally after changing
// the generator: `node scripts/make-og.mjs` (needs Playwright with Chromium).
import {build} from 'vite';
import {createServer} from 'node:http';
import {readFile,mkdir,rm} from 'node:fs/promises';
import {extname,join} from 'node:path';
import {createRequire} from 'node:module';
import {allShareCodes} from '../src/studio/data.js';
const out='.og-build';
await build({root:'scripts/og',base:'./',logLevel:'error',build:{outDir:'../../'+out,emptyOutDir:true,rollupOptions:{input:'scripts/og/og.html'}}});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp'};
const server=createServer(async(req,res)=>{try{const p=join(out,decodeURIComponent(new URL(req.url,'http://x').pathname));res.writeHead(200,{'content-type':types[extname(p)]||'application/octet-stream'});res.end(await readFile(p))}catch{res.writeHead(404);res.end()}}).listen(4321);
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch(),only=process.argv[2];
const jobs=['ru','en'].flatMap(lang=>allShareCodes().filter(c=>!only||c===only).map(code=>({lang,code})));
for(const lang of ['ru','en'])await mkdir(`public/og/${lang}`,{recursive:true});
await Promise.all(Array.from({length:6},async()=>{const page=await browser.newPage({viewport:{width:1200,height:630}});
 while(jobs.length){const {lang,code}=jobs.shift();await page.goto(`http://localhost:4321/og.html?b=${code}&lang=${lang}`);await page.waitForTimeout(2800);
  await page.screenshot({path:`public/og/${lang}/${code}.jpg`,type:'jpeg',quality:78,clip:{x:0,y:0,width:1200,height:630}})}
 await page.close()}));
await browser.close();server.close();await rm(out,{recursive:true,force:true});
console.log('Share covers ready.');
