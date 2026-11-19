// Sphere proxies with fixed-step integration; mesh-accurate contact is intentionally absent.
export function createCluster(random,count=34){return Array.from({length:count},(_,i)=>{const a=i*2.39996,r=2+random()*3.8,size=.83+random()*.35;return{x:Math.cos(a)*r,y:Math.sin(a)*r*.62,z:(random()-.5)*5,vx:0,vy:0,vz:0,rx:random()*6,ry:random()*6,rz:random()*6,wx:0,wy:0,wz:0,size,mass:size**3,radius:size*1.05,colorIndex:Math.floor(random()*5)};});}
export function stepCluster(bodies,dt,bounds,pointer){
  const damping=Math.exp(-1.8*dt);
  for(const b of bodies){b.release=Math.max(0,(b.release||0)-dt);const attraction=1-.88*Math.min(1,b.release/1.4);b.vx-=b.x*3.4/b.mass*dt*attraction;b.vy-=b.y*3.4/b.mass*dt*attraction;b.vz-=b.z*2.4/b.mass*dt;
    if(pointer.active){
      const ax=pointer.previousX??pointer.x,ay=pointer.previousY??pointer.y,sx=pointer.x-ax,sy=pointer.y-ay,segment=sx*sx+sy*sy;
      const along=segment>1e-8?Math.max(0,Math.min(1,((b.x-ax)*sx+(b.y-ay)*sy)/segment)):0;
      const dx=b.x-(ax+sx*along),dy=b.y-(ay+sy*along),distance=Math.hypot(dx,dy),reach=b.radius+.55;
      const speed=Math.hypot(pointer.vx,pointer.vy),sequence=pointer.sequence??0;
      if(distance<reach&&speed>.15&&b.lastPointerSequence!==sequence){
        const weight=(.25+.75*(1-distance/reach))*Math.max(.35,1-Math.abs(b.z)/6),kick=Math.min(9,speed*.75)*weight/Math.sqrt(b.mass);
        b.vx+=pointer.vx/speed*kick;b.vy+=pointer.vy/speed*kick;b.release=1.4;
        b.wx=Math.max(-2,Math.min(2,b.wx+dy*.15*kick));b.wy=Math.max(-2,Math.min(2,b.wy-dx*.15*kick));
        b.lastPointerSequence=sequence;
      }
    }
    b.vx*=damping;b.vy*=damping;b.vz*=damping;b.x+=b.vx*dt;b.y+=b.vy*dt;b.z+=b.vz*dt;
    const speed=Math.hypot(b.vx,b.vy,b.vz);b.rx+=(b.wx+b.vy*.08)*dt;b.ry+=(b.wy+b.vx*.08+.07)*dt;b.rz+=(b.wz+speed*.025)*dt;b.wx*=damping;b.wy*=damping;b.wz*=damping;
  }
  for(let iteration=0;iteration<3;iteration++)for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
    const a=bodies[i],b=bodies[j],dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d=Math.hypot(dx,dy,dz),min=a.radius+b.radius;if(d>=min||d<1e-8)continue;const nx=dx/d,ny=dy/d,nz=dz/d,ia=1/a.mass,ib=1/b.mass,total=ia+ib,correction=(min-d)*.7/total;
    a.x-=nx*correction*ia;a.y-=ny*correction*ia;a.z-=nz*correction*ia;b.x+=nx*correction*ib;b.y+=ny*correction*ib;b.z+=nz*correction*ib;
    const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny+(b.vz-a.vz)*nz;if(relative<0){const impulse=-relative*1.28/total;a.vx-=nx*impulse*ia;a.vy-=ny*impulse*ia;a.vz-=nz*impulse*ia;b.vx+=nx*impulse*ib;b.vy+=ny*impulse*ib;b.vz+=nz*impulse*ib;a.wz-=impulse*ny*.07;b.wx+=impulse*ny*.07;}
  }
  for(const b of bodies)for(const [axis,limit] of [['x',bounds.x-b.radius*.45],['y',bounds.y-b.radius*.45],['z',3.8]]){const v='v'+axis;if(Math.abs(b[axis])>limit){b[axis]=Math.sign(b[axis])*limit;b[v]*=-.35;}}
}
