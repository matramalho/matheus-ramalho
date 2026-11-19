// Parametric torus: original geometry, not an imported model. Collision uses existing sphere proxies.
export function createLinkGeometry(segments=40,sides=14){segments=Math.max(12,Math.min(64,Math.round(segments)));sides=Math.max(8,Math.min(24,Math.round(sides)));const positions=[],normals=[],R=.64,r=.225;
const point=(u,v)=>({p:[(R+r*Math.cos(v))*Math.cos(u),(R+r*Math.cos(v))*Math.sin(u),r*Math.sin(v)],n:[Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v)]});
const emit=(a,b,c)=>{for(const q of[a,b,c]){positions.push(...q.p);normals.push(...q.n);}};
for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const u=i/segments*Math.PI*2,v=j/sides*Math.PI*2,du=Math.PI*2/segments,dv=Math.PI*2/sides,a=point(u,v),b=point(u+du,v),c=point(u,v+dv),d=point(u+du,v+dv);emit(a,b,c);emit(b,d,c);}
return {positions,normals};}

