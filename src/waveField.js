const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{const t=clamp(v);return t*t*(3-2*t)};
const random=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};

export function createField(width,height){
 const gap=Math.max(width<700?9.5:12,Math.sqrt(width*height/7400));
 const particles=[];
 for(let y=-gap;y<height+gap;y+=gap)for(let x=-gap;x<width+gap;x+=gap){
  const seed=random(particles.length+13);
  particles.push({x:x+(seed-.5)*gap*.7,y:y+(random(x+y*17)-.5)*gap*.7,seed,phase:seed*Math.PI*2});
 }
 return particles;
}

// A travelling height field: perspective, radial displacement and curl all come
// from the same wave. This bends the number surface without distorting page text.
export function prepareField(time,waves,trails,width){
 const frame={radius:width<700?138:200,motionGain:width<700?1:.82,
  trails:trails.map(point=>{const age=(time-point.time)/1900;return {...point,weight:age<0||age>1?0:(1-age)*smooth(age*1900/100)}}).filter(p=>p.weight>0),
  waves:waves.map(wave=>{const age=(time-wave.time)/1000;return {...wave,reach:age*245+170,travel:age*245,weight:age<0||age>2.1?0:Math.exp(-age*1.25)*wave.strength*smooth(age/.14)*smooth((2.1-age)/.4)}}).filter(p=>p.weight>0)
 };
 const bounds={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};
 for(const point of [...frame.trails.map(p=>({...p,reach:frame.radius})),...frame.waves]){
  bounds.left=Math.min(bounds.left,point.x-point.reach);bounds.right=Math.max(bounds.right,point.x+point.reach);
  bounds.top=Math.min(bounds.top,point.y-point.reach);bounds.bottom=Math.max(bounds.bottom,point.y+point.reach);
 }
 frame.bounds=bounds;return frame;
}
export function sampleField(p,time,waves,trails,width,prepared){
 let dx=0,dy=0,z=0,light=0;
 const frame=prepared||prepareField(time,waves,trails,width),{radius,motionGain}=frame;
 for(const point of frame.trails){
  const ox=p.x-point.x,oy=p.y-point.y;if(Math.abs(ox)>radius||Math.abs(oy)>radius)continue;
  const d=Math.sqrt(ox*ox+oy*oy),falloff=clamp(1-d/radius);
  light=Math.max(light,falloff*falloff*point.weight);
 }
 for(const wave of frame.waves){
  const x=p.x-wave.x,y=p.y-wave.y;if(Math.abs(x)>wave.reach||Math.abs(y)>wave.reach)continue;
  const d=Math.sqrt(x*x+y*y),distance=d-wave.travel;
  if(Math.abs(distance)>170)continue;
  const envelope=Math.exp(-(distance*distance)/5200)*wave.weight;
  const phase=distance*.052,crest=Math.sin(phase)*envelope;
  const slope=Math.cos(phase)*envelope;
  const nx=d>.1?x/d:0,ny=d>.1?y/d:0;
  z+=crest*52;
  dx+=nx*slope*19-ny*crest*12+wave.dirX*envelope*8;
  dy+=ny*slope*19+nx*crest*12+wave.dirY*envelope*8;
  light=Math.max(light,envelope*.65);
 }
 const turbulence=light*(8+9*p.seed);
 dx+=Math.sin(time*.0024+p.phase*4)*turbulence;
 dy+=Math.cos(time*.0019+p.phase*5)*turbulence;
 z=clamp(z,-85,95);
 dx*=motionGain;dy*=motionGain;z*=motionGain;
 const perspective=640/(640-z);
 const depth=clamp(1+z/150,.55,1.65);
 return {
  x:p.x+dx*perspective+Math.sin(time*.00045+p.phase)*1.3,
  y:p.y+dy*perspective+Math.cos(time*.00038+p.phase)*1.3,
  z,light:clamp(light),size:clamp((7+p.seed*2)*depth,5,14),
  opacity:clamp(.035+p.seed*.03+light*.8+Math.max(0,z)*.003,0,.92),
  bit:Math.floor(time/(160+p.seed*800)+p.seed*100)%2
 };
}
