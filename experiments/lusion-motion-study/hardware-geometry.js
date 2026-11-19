// Original ceramic package, silicon cap and metal contacts. No imported model.
export function createHardwareGeometry(){
  const positions=[],normals=[],colors=[],materials=[];
  const vertex=(p,n,color,rough,emission)=>{positions.push(...p);normals.push(...n);colors.push(...color);materials.push(rough,emission);};
  const triangle=(a,b,c,color,rough,emission)=>{for(const q of[a,b,c])vertex(q.p,q.n,color,rough,emission);};
  function box(w,h,depth,r,bevel,center,color,rough=.6,emission=0,segments=3){
    const outline=(inset,z,nz)=>{
      const width=w-2*inset,height=h-2*inset,radius=r-inset,ring=[];
      for(let corner=0;corner<4;corner++){
        const cx=(corner===0||corner===3?1:-1)*(width/2-radius);
        const cy=(corner<2?1:-1)*(height/2-radius);
        for(let j=0;j<=segments;j++){
          const angle=(corner+j/segments)*Math.PI/2,nx=Math.cos(angle),ny=Math.sin(angle),xy=Math.sqrt(1-nz*nz);
          ring.push({p:[center[0]+cx+radius*nx,center[1]+cy+radius*ny,center[2]+z],n:[nx*xy,ny*xy,nz]});
        }
      }
      return ring;
    };
    const rings=[outline(bevel,-depth/2,-Math.SQRT1_2),outline(0,-depth/2+bevel,0),outline(0,depth/2-bevel,0),outline(bevel,depth/2,Math.SQRT1_2)];
    for(let k=0;k<3;k++)for(let i=0;i<rings[k].length;i++){
      const j=(i+1)%rings[k].length;
      triangle(rings[k][i],rings[k][j],rings[k+1][i],color,rough,emission);
      triangle(rings[k][j],rings[k+1][j],rings[k+1][i],color,rough,emission);
    }
    for(const end of[0,3]){
      const n=[0,0,end===3?1:-1],ring=rings[end],mid={p:[center[0],center[1],center[2]+(end===3?1:-1)*depth/2],n};
      for(let i=0;i<ring.length;i++){
        const a={p:ring[i].p,n},b={p:ring[(i+1)%ring.length].p,n};
        triangle(mid,end===3?a:b,end===3?b:a,color,rough,emission);
      }
    }
  }
  const ceramic=[.035,.058,.092],metal=[.40,.49,.58],silicon=[.055,.095,.16];
  box(2,2,.28,.16,.045,[0,0,0],ceramic,.78);
  box(1.62,1.62,.085,.10,.022,[0,0,.17],[.21,.29,.37],.34);
  box(1.46,1.46,.075,.085,.018,[0,0,.235],silicon,.43);
  // Exposed contacts sit beneath the ceramic rather than floating as icons.
  for(let i=0;i<6;i++){
    const at=-.65+i*.26;
    for(const side of[-1,1]){
      box(.12,.32,.07,.025,.01,[at,side*1.08,-.055],metal,.23,0,2);
      box(.32,.12,.07,.025,.01,[side*1.08,at,-.055],metal,.23,0,2);
    }
  }
  // Small on-die conductors and a pin-one marker, not logos or service claims.
  for(let i=0;i<4;i++){
    box(.70-i*.07,.018,.012,.006,.002,[-.08+i*.035,-.30+i*.18,.279],[.18,.32,.45],.4,.32,2);
    box(.018,.09,.012,.006,.002,[.27-i*.035,-.265+i*.18,.279],[.18,.32,.45],.4,.32,2);
  }
  box(.065,.065,.016,.025,.004,[-.80,.80,.149],[.6,.76,.87],.35,.1);
  return {positions,normals,colors,materials};
}

// A connected package follows its pad, never drifts through text or off the board.
export function stepHardware(body,dt,pointer,scrollImpulse=0){
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  dt=clamp(dt,0,.05);const mix=1-Math.exp(-9*dt);
  const x=pointer?clamp(pointer.x,-1,1):0,y=pointer?clamp(pointer.y,-1,1):0;
  const targets={dx:x*7,dy:y*5+clamp(scrollImpulse,-5,5)*.5,rx:y*.20,ry:-x*.20};
  for(const key of Object.keys(targets))body[key]+=(targets[key]-body[key])*mix;
}
