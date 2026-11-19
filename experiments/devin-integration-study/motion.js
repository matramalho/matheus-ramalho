export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
// All geometry is derived from scroll progress. Reverse scroll follows the same path.
export function integrationState(progress,width,height,active=2){
 const p=clamp(progress),compact=width<700,gap=compact?8:16,pad=compact?16:width*.03;
 const cols=compact?3:7,cw=(width-gap*(cols-1))/cols,base=height*.46,travel=height*(compact?1.85:1.02);
 const grid=Array.from({length:21},(_,i)=>{const col=i%cols,row=Math.floor(i/cols),offset=(compact?[.13,0,.1]:[.0,.16,.42,.32,.42,.16,0])[col]*height;return {x:col*(cw+gap),y:base+offset+(row===0?0:cw*1.45+gap+(row-1)*(cw+gap))-travel*ease(p/.76),w:cw,h:cw*(row===0?1.45:1),opacity:1-ease((p-.78)/.14)};});
 const q=ease((p-.64)/.34),available=width-pad*2-gap*2,small=compact?44:available*.15,large=available-small*2;
 const initialW=cw,initialH=cw*1.6,targetH=Math.min(height*.63,compact?430:600),targetY=height*.21;
 const starts=compact?[0,1,2]:[2,3,4];let cursor=pad;
 const panels=starts.map((col,i)=>{const weight=Array.isArray(active)?active[i]:(i===active?1:0),w=small+(large-small)*weight,x=cursor;cursor+=w+gap;return {x:mix(col*(cw+gap),x,q),y:mix(grid[compact?18+col:14+col].y,targetY,q),w:mix(initialW,w,q),h:mix(initialH,targetH,q),detail:ease((p-.83)/.15)*weight,tint:ease((p-.68)/.26)};});
 return {p,grid,panels,titleOpacity:1-ease(p/.2),titleY:-ease(p/.28)*height*.2,phase:p<.64?'grade':p<.98?'transformação':'painéis'};
}
