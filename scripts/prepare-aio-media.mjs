import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),bundle=fileURLToPath(new URL('../assets/aio-media.tar.gz',import.meta.url));
// Keep the original PNGs in one source bundle; only extracted images enter the public build.
const entries=execFileSync('tar',['-tzf',bundle],{encoding:'utf8'}).trim().split('\n');
if(entries.some(path=>!/^assets\/aio-(2026|sections|visits)\//.test(path)||path.split('/').includes('..')))throw new Error('Unexpected path in the AIO media bundle');
mkdirSync(new URL('../public/',import.meta.url),{recursive:true});
execFileSync('tar',['-xzf',bundle,'-C',root+'public']);
