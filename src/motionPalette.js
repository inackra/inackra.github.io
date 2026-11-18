const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;

// Colour follows the existing height/light field. No displacement, timing,
// opacity or glyph duplication is added for the aberration-inspired tint.
export function fieldInk(point){
 const saturation=clamp(point.light*1.25+Math.abs(point.z)/110,0,.88);
 const violet=clamp(.5-point.z/55);
 const [r,g,b]=fieldRGB(saturation,violet);
 return `rgba(${r},${g},${b},${point.opacity.toFixed(3)})`;
}

export function fieldRGB(saturation,violet){
 const r=Math.round(mix(245,mix(110,179,violet),saturation));
 const g=Math.round(mix(245,mix(221,148,violet),saturation));
 const b=Math.round(mix(245,255,saturation));
 return [r,g,b];
}
