export function hexToRgb(hex){
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? { r: parseInt(res[1],16), g: parseInt(res[2],16), b: parseInt(res[3],16)} : null;
}
export function rgbToHex({r,g,b}){
  const toHex = v => v.toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
export function gradientColors(startHex, endHex, steps){
  const s = hexToRgb(startHex), e = hexToRgb(endHex);
  const arr = [];
  for(let i=0;i<steps;i++){
    const t = i/(steps-1);
    const r = Math.round(s.r + (e.r - s.r)*t);
    const g = Math.round(s.g + (e.g - s.g)*t);
    const b = Math.round(s.b + (e.b - s.b)*t);
    arr.push(rgbToHex({r,g,b}));
  }
  return arr;
}
