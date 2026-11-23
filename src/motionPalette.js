// The field is monochrome: waves take the theme's text colour
// (#EEE9DD on black, #000 on #EEE9DD). The resting field is invisible.
let ink=[238,233,221];
export const THEME_INK={dark:[238,233,221],light:[0,0,0]};
export function setInk(rgb){ink=rgb}
export function fieldRGB(){return ink}
export function fieldInk(point){return `rgba(${ink[0]},${ink[1]},${ink[2]},${point.opacity.toFixed(3)})`}
