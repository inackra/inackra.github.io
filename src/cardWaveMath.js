// Map a flat surface onto a shallow cylinder. Units are CSS pixels/radians.
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function surfacePose(position, velocity=0, mobile=false) {
  const p=clamp(position,-1.5,1.5);
  // A flat reading zone in the middle; curvature belongs to entry and exit.
  const edge=Math.max(0,Math.abs(p)-.13)/1.37;
  const sign=Math.sign(p);
  return {
    bend: sign*(edge**1.15)*(mobile?1.08:1.24)+clamp(velocity*.0012,-.11,.11),
    tilt: -sign*(edge**1.2)*(mobile?17:22),
    depth: -(edge**1.4)*(mobile?115:190),
  };
}
export function stripPose(index, count, height, bend) {
  const center=(index+.5)/count*height;
  const local=center-height/2;
  if(Math.abs(bend)<.0001)return {y:0,z:0,angle:0};
  const radius=height/bend;
  const angle=local/radius;
  return {y:Math.sin(angle)*radius-local,z:(1-Math.cos(angle))*radius,angle:angle*180/Math.PI};
}
