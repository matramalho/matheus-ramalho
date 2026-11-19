// Original procedural surfaces: interface, workflow and inspection tool.
// These are conceptual illustrations, not models/media from a reference site.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createParticleTargets(mode,count,seed=87){
  let n=seed;const random=()=>{n=(n*16807)%2147483647;return(n-1)/2147483646;};
  const parts=[];
  function box(x,y,z,w,h,d,weight=1){parts.push({weight,sample(){
    const face=Math.floor(random()*6),p=[(random()-.5)*w,(random()-.5)*h,(random()-.5)*d];
    p[Math.floor(face/2)]=[w,h,d][Math.floor(face/2)]/2*(face%2?1:-1);
    return [p[0]+x,p[1]+y,p[2]+z];
  }});}
  function sphere(x,y,z,r,weight=1){parts.push({weight,sample(){const a=random()*Math.PI*2,u=random()*2-1,q=Math.sqrt(1-u*u)*r;return[x+q*Math.cos(a),y+q*Math.sin(a),z+u*r];}});}
  function tube(a,b,r,weight=1,bend=.16){parts.push({weight,sample(){
    const t=random(),angle=random()*Math.PI*2;
    const p=a.map((v,i)=>v+(b[i]-v)*t);p[2]+=Math.sin(t*Math.PI)*bend;
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
    return[p[0]-dy/len*r*Math.cos(angle),p[1]+dx/len*r*Math.cos(angle),p[2]+r*Math.sin(angle)];
  }});}
  function ring(x,y,z,R,r,weight=1){parts.push({weight,sample(){const a=random()*Math.PI*2,b=random()*Math.PI*2;return[x+(R+r*Math.cos(b))*Math.cos(a),y+(R+r*Math.cos(b))*Math.sin(a),z+r*Math.sin(b)];}});}
  if(mode==='automacao'){
    const nodes=[[-1.45,.68,-.25],[-1.45,-.68,.22],[-.08,0,.12],[1.35,.68,-.12],[1.35,-.68,.16]];
    for(let i=0;i<nodes.length;i++){const[x,y,z]=nodes[i];box(x,y,z,i===2?.85:.65,i===2?.85:.65,.42,3);box(x,y,z+.24,.38,.38,.035,.5);}
    for(const [a,b]of[[0,2],[1,2],[2,3],[2,4]])tube(nodes[a],nodes[b],.055,1.7);
  }else if(mode==='avaliacao'){
    box(-.65,0,-.25,1.5,2.12,.13,2.7);
    for(let i=0;i<5;i++)box(-.72,.65-i*.28,-.15,.85-i%2*.15,.045,.025,.42);
    ring(.45,.18,.45,.82,.11,5.5);
    tube([1.02,-.40,.45],[1.65,-1.05,.45],.13,2,0);
    tube([.02,.13,.50],[.28,-.12,.50],.055,.65,0);tube([.28,-.12,.50],[.82,.48,.50],.055,1.15,0);
  }else{
    box(0,1.13,0,3.4,.14,.25,2);box(0,-1.13,0,3.4,.14,.25,2);
    box(-1.63,0,0,.14,2.12,.25,1.5);box(1.63,0,0,.14,2.12,.25,1.5);
    box(0,.72,.02,3.15,.04,.19,.5);
    for(let i=0;i<3;i++)sphere(-1.36+i*.21,.94,.12,.045,.22);
    box(-.78,-.05,0,1.30,1.13,.12,4);
    box(.65,.35,.07,1.05,.14,.16,.9);box(.65,.04,.05,1.05,.065,.12,.55);box(.53,-.15,.05,.82,.065,.12,.45);
    box(.45,-.61,.10,.64,.22,.22,1.2);
  }
  const total=parts.reduce((sum,p)=>sum+p.weight,0),out=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    let at=random()*total,part=parts[parts.length-1];for(const p of parts){at-=p.weight;if(at<=0){part=p;break;}}
    out.set(part.sample(),i*3);
  }
  return out;
}
export function createParticleState(target){return {positions:target.slice(),velocities:new Float32Array(target.length),heat:new Float32Array(target.length/3)};}
export function stepParticleField(state,target,dt,pointer){
  dt=clamp(dt,0,1/30);if(!dt)return;
  const p=state.positions,v=state.velocities,heat=state.heat;
  const speed=pointer?Math.hypot(pointer.vx,pointer.vy):0,r=pointer?.radius||.65;
  for(let i=0;i<p.length;i+=3){
    let fx=0,fy=0,fz=0;
    if(pointer&&speed>.02){const dx=p[i]-pointer.x,dy=p[i+1]-pointer.y,dist=Math.hypot(dx,dy);
      if(dist<r){const strength=(1-dist/r)**2*Math.min(65,speed*15),inv=1/Math.max(.08,dist);fx=(dx*inv+pointer.vx/speed*.9)*strength;fy=(dy*inv+pointer.vy/speed*.9)*strength;fz=Math.sin(i*1.71)*strength*.8;}
    }
    for(let axis=0;axis<3;axis++){
      const j=i+axis,force=axis===0?fx:axis===1?fy:fz;
      v[j]=clamp(v[j]+((target[j]-p[j])*18-v[j]*6.2+force)*dt,-9,9);p[j]=clamp(p[j]+v[j]*dt,-8,8);
    }
    heat[i/3]=Math.min(1,Math.hypot(v[i],v[i+1],v[i+2])*.23);
  }
}
