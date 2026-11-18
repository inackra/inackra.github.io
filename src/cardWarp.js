export function sampleWarp(x,y,trail,time){
 let dx=0,dy=0;
 for(const p of trail){const age=(time-p.t)/650;if(age<0||age>=1)continue;const ox=x-p.x,oy=y-p.y,r=Math.hypot(ox,oy)/190;if(r>=1)continue;const envelope=(1-r*r)**3*(1-age)**2,ring=Math.sin(r*11-age*7);dx+=(p.vx*.7+ox/190*ring*12)*envelope;dy+=(p.vy*.7+oy/190*ring*12)*envelope;}
 return {dx:Math.max(-34,Math.min(34,dx)),dy:Math.max(-34,Math.min(34,dy))};
}
