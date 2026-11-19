const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};

// Scroll, not elapsed time, directs the reveal and chapter palette.
export function sampleWorldState(scroll,height,start,stops,reduced=false){
  const trace=reduced?(scroll>start?1:0):smooth((scroll-start)/Math.max(1,height*1.6));
  const hardware=reduced?trace:smooth((trace-.12)/.45);
  let a=stops[0],b=a;
  for(let i=1;i<stops.length;i++){b=stops[i];if(scroll<=b.y)break;a=b;}
  const t=smooth((scroll-a.y)/Math.max(1,b.y-a.y));
  const color=reduced?[8,14,25]:a.color.map((v,i)=>v+(b.color[i]-v)*t);
  const media=reduced?0:a.media+(b.media-a.media)*t;
  return {trace,hardware,color,media,pan:reduced?0:Math.max(-20,Math.min(20,(scroll-start)*-.006)),hue:reduced?0:color[2]-color[1]};
}

export function attachWorld(world){
  const chapters=[['.home-hero',[8,13,24],.055],['.approach',[8,20,32],.070],['.work',[7,13,24],.020],['.assembly',[6,24,29],.045],['.human',[15,13,28],.015],['.about-teaser',[9,18,31],.025],['.site-footer',[19,14,32],.018]];
  let dirty=true,start=0,stops=[],height=1,state={trace:0,hardware:0};
  function measure(){
    height=innerHeight;
    const heading=document.querySelector('.hero-heading');
    start=Math.max(height*.7,(heading?.getBoundingClientRect().bottom||0)+scrollY);
    stops=chapters.map(([selector,color,media],i)=>{const el=document.querySelector(selector);return {y:i===0?0:Math.max(1,(el?.getBoundingClientRect().top||0)+scrollY-height*.4),color,media};}).sort((a,b)=>a.y-b.y);
    dirty=false;
  }
  function update(scroll,reduced){
    if(dirty)measure();state=sampleWorldState(scroll,height,start,stops,reduced);
    world.style.setProperty('--circuit-reveal',state.trace.toFixed(4));
    world.style.setProperty('--hardware-reveal',state.hardware.toFixed(4));
    world.style.setProperty('--world-color','rgb('+state.color.map(Math.round).join(' ')+')');
    world.style.setProperty('--world-media',state.media.toFixed(4));
    world.style.setProperty('--world-pan',state.pan.toFixed(2)+'px');
    world.style.setProperty('--world-hue',state.hue.toFixed(2)+'deg');
  }
  const invalidate=()=>{dirty=true;};
  const ro=new ResizeObserver(invalidate);ro.observe(document.body);
  window.addEventListener('resize',invalidate,{passive:true});
  return {update,get state(){return state;},dispose(){ro.disconnect();window.removeEventListener('resize',invalidate);}};
}
