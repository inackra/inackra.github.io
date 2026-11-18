import assert from 'node:assert/strict';
import {sampleWarp,warpGeometry} from '../src/cardWarp.js';
const trail=[{x:200,y:150,t:1000,vx:20,vy:5}];
assert.deepEqual(sampleWarp(500,150,trail,1050),{dx:0,dy:0},'outside the pointer radius the whole card stays unchanged');
assert.ok(sampleWarp(200,150,trail,1050).dx>8,'the point under the cursor follows its movement');
assert.deepEqual(sampleWarp(200,150,trail,1700),{dx:0,dy:0},'the surface settles completely');
assert.deepEqual(sampleWarp(200,150,trail,900),{dx:0,dy:0},'future impulses do not affect the surface');
for(let x=0;x<800;x+=2){const a=sampleWarp(x,160,trail,1100),b=sampleWarp(x+1,160,trail,1100);assert.ok(Math.hypot(a.dx-b.dx,a.dy-b.dy)<1,'no spatial seams at the edge of the local warp')}
for(let t=1000;t<1700;t+=16){const a=sampleWarp(220,150,trail,t),b=sampleWarp(220,150,trail,t+16);assert.ok(Math.hypot(a.dx-b.dx,a.dy-b.dy)<4,'temporal motion is continuous')}
assert.ok(Object.values(sampleWarp(210,160,Array.from({length:9},()=>trail[0]),1050)).every(v=>Number.isFinite(v)&&Math.abs(v)<=34),'overlapping impulses stay bounded');
console.log('PASS: local card displacement, untouched outer surface, decay, continuous space/time and bounded overlapping gestures.');

for(const [w,h] of [[800,620],[356,530]]){
 const map=warpGeometry(w,h);
 assert.ok(map.x<=-40&&map.y<=-40&&map.x+map.width>=w+40&&map.y+map.height>=h+40,'map covers the whole displacement filter margin');
 for(const [x,y] of [[-63,h/2],[w+63,h/2],[w/2,-63],[w/2,h+63]]){
  const point=sampleWarp(x,y,[{x:w/2,y:h/2,vx:28,vy:28,t:1000}],1016);
  assert.deepEqual(point,{dx:0,dy:0},'outer filter pixels remain neutral rather than sampling a duplicate edge');
 }
}
console.log('PASS: padded filter/map geometry and neutral output margins on desktop and mobile cards.');
