// Decorative world-space drift. Approximate impulses, no mesh contact or hard walls.
export function stepAmbient(bodies,dt,bounds,pointer,scrollImpulse=0){
  dt=Math.min(Math.max(dt,0),.05);
  for(let i=0;i<bodies.length;i++){
    const b=bodies[i],side=i%2?1:-1,target=side*bounds.x*.82;
    b.vx+=(target-b.x)*.28*dt;
    b.vy+=(-.12+Math.min(5,Math.abs(scrollImpulse))*.025)*dt;
    if(pointer.active&&b.lastPointerSequence!==pointer.sequence){
      const ax=pointer.previousX??pointer.x,ay=pointer.previousY??pointer.y,dx=pointer.x-ax,dy=pointer.y-ay,len=dx*dx+dy*dy;
      const t=len?Math.max(0,Math.min(1,((b.x-ax)*dx+(b.y-ay)*dy)/len)):0;
      const distance=Math.hypot(b.x-ax-t*dx,b.y-ay-t*dy),speed=Math.hypot(pointer.vx,pointer.vy);
      if(distance<b.size+1&&speed>.2){const force=Math.min(10,speed*.45)*(1-distance/(b.size+1));b.vx+=pointer.vx/speed*force;b.vy+=pointer.vy/speed*force+force*.32;b.lastPointerSequence=pointer.sequence;}
    }
    const damping=Math.exp(-.65*dt);b.vx*=damping;b.vy*=damping;b.x+=b.vx*dt;b.y+=b.vy*dt;
    b.rx+=(.08+b.vy*.1)*dt;b.ry+=(.12+b.vx*.12)*dt;
    // Re-enter beyond the opposite edge; never bounce off an invisible box.
    if(b.y>bounds.y+2)b.y=-bounds.y-1.9;
    if(b.y<-bounds.y-2)b.y=bounds.y+1.9;
    if(b.x>bounds.x+2)b.x=-bounds.x-1.9;
    if(b.x<-bounds.x-2)b.x=bounds.x+1.9;
  }
}
