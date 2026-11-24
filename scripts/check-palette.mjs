import assert from 'node:assert/strict';
import {fieldInk,setInk,THEME_INK} from '../src/motionPalette.js';
const channels=point=>fieldInk(point).match(/[\d.]+/g).map(Number);
for(const [theme,rgb] of Object.entries(THEME_INK)){
 setInk(rgb);
 for(let z=-85;z<=95;z+=5)for(const light of [0,.05,.2,.5,1]){
  const values=channels({z,light,opacity:.375});
  assert.deepEqual(values.slice(0,3),rgb,`${theme} waves use the theme ink`);
  assert.equal(values[3],.375,'colour does not change the existing opacity envelope');
 }
}
assert.deepEqual(THEME_INK.dark,[238,233,221]);assert.deepEqual(THEME_INK.light,[0,0,0]);
console.log('PASS: monochrome waves in the theme ink (EEE9DD on dark, black on light), preserved opacity.');
