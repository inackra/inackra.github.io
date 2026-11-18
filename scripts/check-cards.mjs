import assert from 'node:assert/strict';
import {surfacePose,stripPose} from '../src/cardWaveMath.js';
const center=surfacePose(0,0,true);
assert.ok(Math.abs(center.bend)<1e-8);assert.ok(Math.abs(center.tilt)<1e-8);assert.ok(Math.abs(center.depth)<1e-8);
for(let i=0;i<18;i++)assert.deepEqual(stripPose(i,18,820,0),{y:0,z:0,angle:0});
const enter=surfacePose(1,0,true),exit=surfacePose(-1,0,true);
assert.equal(enter.bend,-exit.bend);assert.equal(enter.tilt,-exit.tilt);assert.equal(enter.depth,exit.depth);
assert.ok(enter.depth<0&&enter.bend>0&&exit.bend<0);
assert.ok(Math.abs(surfacePose(0,10000,true).bend)<=.11,'gesture impulses stay bounded');
for(const h of [520,820,1120])for(const p of [-10,-1,0,1,10])for(let i=0;i<24;i++){
 const pose=surfacePose(p,90,false),band=stripPose(i,24,h,pose.bend);
 assert.ok(Object.values(band).every(Number.isFinite));
}
console.log('PASS: flat reading zone, mirrored entry/exit, bounded scroll impulse, finite card curvature.');
