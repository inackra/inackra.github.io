import assert from 'node:assert/strict';
import {createField,sampleField,prepareField} from '../src/waveField.js';
const mobile=createField(375,844),desktop=createField(1440,900);
assert.ok(mobile.length>3000,'the mobile field is substantially denser than the former 16px grid');
assert.ok(desktop.length<8500,'large viewports retain a bounded particle budget');
const p={x:240,y:100,seed:.5,phase:1};
const wave={x:100,y:100,time:1000,strength:1,dirX:1,dirY:0};
const idle=sampleField(p,1450,[],[],375);
const crest=sampleField(p,1450,[wave],[],375);
assert.equal(idle.z,0);assert.ok(idle.opacity>.035&&idle.opacity<.07);
assert.ok(crest.z>20,'a nearby crest raises the number surface');
assert.ok(crest.size>idle.size,'perspective makes raised symbols larger');
assert.ok(crest.opacity>idle.opacity,'the crest is illuminated');
assert.notEqual(crest.x,idle.x,'the wave displaces symbols, not just opacity');
const desktopCrest=sampleField(p,1450,[wave],[],1440);
assert.ok(Math.abs(desktopCrest.z)<Math.abs(crest.z)*.9,'desktop waves have less bounce than touch waves');
const moving={...p,x:240};
assert.ok(Math.abs(sampleField(moving,1450,[wave],[],375).z)>10,'the crest propagates away from the gesture');
assert.equal(sampleField(p,3200,[wave],[],375).z,0,'old waves expire');
const faded=sampleField(p,3200,[],[{x:130,y:100,time:1000}],375);
assert.equal(faded.light,0,'the gesture trail expires');
for(const particle of mobile.filter((_,i)=>i%97===0)){
 const point=sampleField(particle,1400,Array.from({length:9},()=>({...wave,strength:1.5})),[{x:120,y:120,time:1300}],375);
 assert.ok(Object.values(point).every(Number.isFinite),'overlapping waves remain finite');
 assert.ok(point.size>=5&&point.size<=14);assert.ok(point.z>=-85&&point.z<=95);assert.ok(point.opacity>=0&&point.opacity<=.92);
}
console.log(`PASS: dense mobile field (${mobile.length}), bounded desktop field (${desktop.length}), propagation, perspective, displacement, decay, overlap stability.`);

assert.equal(sampleField(p,1000,[wave],[],375).z,0,'new waves fade in from zero');
for(let time=1000;time<3200;time+=16){
 const a=sampleField(p,time,[wave],[],375),b=sampleField(p,time+16,[wave],[],375);
 assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<15,'no position discontinuities at wave birth/expiry');
 assert.ok(Math.abs(a.size-b.size)<.8,'glyph size varies continuously instead of whole-pixel jumps');
}
assert.ok(sampleField(p,3084,[wave],[],375).opacity<.08,'waves decay before being removed');
console.log('PASS: soft birth/expiry and continuous position / fractional size.');

const prepared=prepareField(1400,[wave],[{x:120,y:120,time:1300}],375);
for(const particle of mobile.filter((_,i)=>i%97===0))assert.deepEqual(sampleField(particle,1400,[wave],[{x:120,y:120,time:1300}],375,prepared),sampleField(particle,1400,[wave],[{x:120,y:120,time:1300}],375));
console.log('PASS: cached frame coefficients preserve the wave geometry.');
