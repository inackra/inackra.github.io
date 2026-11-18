import {fieldRGB} from './motionPalette';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// Rasterise the two glyphs once. Continuous image scaling avoids repeated font
// rasterisation and whole-pixel size jumps during a gesture.
export function createGlyphAtlas(){
 const canvas=document.createElement('canvas'),c=canvas.getContext('2d');
 if(!c?.fillText)return null;
 const levels=9,columns=18,tw=28,th=36;
 canvas.width=columns*tw;canvas.height=levels*th;c.setTransform(2,0,0,2,0,0);c.font='9px monospace';c.textAlign='center';c.textBaseline='middle';
 for(let s=0;s<levels;s++)for(let v=0;v<levels;v++){
  const [r,g,b]=fieldRGB(s/8*.88,v/8);c.fillStyle=`rgb(${r},${g},${b})`;
  for(let bit=0;bit<2;bit++){const i=(s*levels+v)*2+bit;c.fillText(String(bit),(i%columns)*14+7,Math.floor(i/columns)*18+9)}
 }
 return {canvas,columns,tw,th};
}
export function drawGlyph(c,atlas,p){
 const saturation=clamp(p.light*1.25+Math.abs(p.z)/110,0,.88),violet=clamp(.5-p.z/55);
 const i=(Math.round(saturation/.88*8)*9+Math.round(violet*8))*2+p.bit;
 const scale=p.size/9,w=14*scale,h=18*scale;
 c.globalAlpha=p.opacity;c.drawImage(atlas.canvas,(i%atlas.columns)*atlas.tw,Math.floor(i/atlas.columns)*atlas.th,atlas.tw,atlas.th,p.x-w/2,p.y-h/2,w,h);
}
