export const clampProgress=value=>Math.max(0,Math.min(1,value));
// Touch dragging is relative to its starting scroll position. Grabbing the
// narrow rail must not jump the page before the finger has moved.
export function dragTarget(clientY,gesture){
 const fraction=gesture.relative
  ?gesture.startProgress+(clientY-gesture.startY)/gesture.height
  :(clientY-gesture.top)/gesture.height;
 return clampProgress(fraction)*gesture.max;
}
