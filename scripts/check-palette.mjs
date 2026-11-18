import assert from 'node:assert/strict';
import {fieldInk} from '../src/motionPalette.js';
const channels=point=>fieldInk(point).match(/[\d.]+/g).map(Number);
assert.deepEqual(channels({z:0,light:0,opacity:.025}),[245,245,245,.025],'idle numbers stay neutral');
const crest=channels({z:40,light:.8,opacity:.75});
const trough=channels({z:-40,light:.8,opacity:.75});
assert.ok(crest[1]>crest[0]&&crest[2]>crest[1],'raised waves tint cyan');
assert.ok(trough[0]>trough[1]&&trough[2]>trough[0],'falling waves tint violet');
assert.equal(crest[3],.75);assert.equal(trough[3],.75);
for(let z=-85;z<=95;z+=5)for(const light of [0,.05,.2,.5,1]){
 const values=channels({z,light,opacity:.375});
 assert.ok(values.slice(0,3).every(v=>Number.isInteger(v)&&v>=0&&v<=255));
 assert.equal(values[3],.375,'colour does not change the existing opacity envelope');
}
console.log('PASS: neutral idle, cyan crest, violet trough, bounded RGB channels, preserved opacity.');
