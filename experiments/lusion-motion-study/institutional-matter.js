import {createHardwareScene} from './institutional-hardware.js';
import {stepAmbient} from './ambient-physics.js';
import {createLinkGeometry} from './institutional-geometry.js';
import {createCluster,stepCluster} from './matter-physics.js';
// Original WebGL study. Soft positional simulation, not a rigid-body engine.
export function createInstitutionalMatter(canvas,onResize=()=>{},options={}) {
  if(options.ambient)return createHardwareScene(canvas,onResize,options);
  const ambient=!!options.ambient;
  const gl = canvas.getContext('webgl', {alpha:ambient,antialias:true,powerPreference:'low-power'});
  if (!gl) return null;
  const vertex = `attribute vec3 position;attribute vec3 normal;uniform mat4 model;uniform mat4 projection;varying vec3 N;varying vec3 P;varying vec3 L;void main(){vec4 p=model*vec4(position,1.);P=p.xyz;L=position;N=mat3(model)*normal;gl_Position=projection*p;}`;
  const fragment = `precision highp float;varying vec3 N;varying vec3 P;varying vec3 L;uniform vec3 color;void main(){vec3 n=normalize(N),v=normalize(vec3(0.,0.,18.)-P);vec3 l=normalize(vec3(-.5,.9,1.));float d=max(dot(n,l),0.);float rim=pow(1.-max(dot(n,v),0.),3.);float s=pow(max(dot(reflect(-l,n),v),0.),55.);float stripe=pow(max(dot(n,normalize(vec3(.5,.6,1.))),0.),22.);vec3 c=color*(.2+d*.75)+vec3(.65,.73,1.)*s*.85+vec3(.3,.35,.8)*rim*.4+stripe*.14;gl_FragColor=vec4(pow(c,vec3(.85)),1.);}`;
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const {positions,normals}=createLinkGeometry(canvas.clientWidth>=700?40:28,14);
  for(const [name,data] of [['position',positions],['normal',normals]]){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);}
  const uniforms=Object.fromEntries(['model','projection','color'].map(n=>[n,gl.getUniformLocation(program,n)]));
  const palette=[[.065,.035,.8],[.1,.15,1.],[.14,.16,.2],[.72,.74,.81],[.46,.48,.58]];
  let seed=67;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const bodies=createCluster(random,ambient?14:28); for(let i=0;i<100;i++)stepCluster(bodies,1/90,{x:6.1,y:3.5},{active:false});bodies.forEach((b,i)=>{b.color=palette[b.colorIndex];if(ambient){b.size=.32+random()*.38;b.x=(i%2?1:-1)*6.2;b.y=(random()-.5)*9;b.z=(random()-.5)*2;}});
  const pointer={x:100,y:100,previousX:100,previousY:100,vx:0,vy:0,sequence:0,active:false};let aspect=2,halfX=7.1,halfY=4,accumulator=0,lastPointerTime=0;
  function resize(){const oldX=halfX,oldY=halfY;const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);aspect=r.width/r.height;halfX=ambient?(aspect<1?3.2:7.2):(aspect<1?3.2:5.6);halfY=halfX/aspect;if(ambient)for(const b of bodies){b.x*=halfX/oldX;b.y*=halfY/oldY;}gl.viewport(0,0,canvas.width,canvas.height);const near=.1,far=80;gl.uniformMatrix4fv(uniforms.projection,false,new Float32Array([20/halfX,0,0,0,0,20/halfY,0,0,0,0,-(far+near)/(far-near),-1,0,0,-2*far*near/(far-near),0]));onResize();}
  const pointerTarget=ambient?window:canvas;
  const move=e=>{if(e.pointerType==='touch'||options.isPaused?.())return;const r=canvas.getBoundingClientRect(),x=((e.clientX-r.left)/r.width*2-1)*halfX,y=(1-(e.clientY-r.top)/r.height*2)*halfY,now=performance.now(),dt=Math.max(.016,(now-lastPointerTime)/1000);pointer.vx=pointer.active?Math.max(-15,Math.min(15,(x-pointer.x)/dt)):0;pointer.vy=pointer.active?Math.max(-15,Math.min(15,(y-pointer.y)/dt)):0;pointer.previousX=pointer.active?pointer.x:x;pointer.previousY=pointer.active?pointer.y:y;pointer.x=x;pointer.y=y;pointer.sequence++;pointer.active=true;lastPointerTime=now;};pointerTarget.addEventListener('pointermove',move,{passive:true});
  const leave=()=>{pointer.active=false;pointer.vx=pointer.vy=0;};pointerTarget.addEventListener('pointerleave',leave);
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();gl.enable(gl.DEPTH_TEST);
  function draw(time,dt,animate){
    gl.clearColor(ambient?0:.065,ambient?0:.068,ambient?0:.08,ambient?0:1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    if(animate){accumulator+=Math.min(dt,.05);while(accumulator>=1/90){if(ambient)stepAmbient(bodies,1/90,{x:halfX,y:halfY},pointer,options.scrollImpulse?.()||0);else stepCluster(bodies,1/90,{x:halfX+.5,y:halfY+.5},pointer);accumulator-=1/90;}pointer.vx*=Math.exp(-12*dt);pointer.vy*=Math.exp(-12*dt);}
    for(let i=0;i<bodies.length;i++){const b=bodies[i];
      const rx=b.rx,ry=b.ry,rz=b.rz;const sx=Math.sin(rx),cx=Math.cos(rx),sy=Math.sin(ry),cy=Math.cos(ry),sz=Math.sin(rz),cz=Math.cos(rz),s=b.size;
      const m=new Float32Array([cy*cz*s,(sx*sy*cz+cx*sz)*s,(-cx*sy*cz+sx*sz)*s,0,-cy*sz*s,(-sx*sy*sz+cx*cz)*s,(cx*sy*sz+sx*cz)*s,0,sy*s,-sx*cy*s,cx*cy*s,0,b.x,b.y,b.z-20,1]);
      gl.uniformMatrix4fv(uniforms.model,false,m);gl.uniform3fv(uniforms.color,b.color);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);
    }
  }
  return {draw,dispose(){ro.disconnect();pointerTarget.removeEventListener('pointermove',move);pointerTarget.removeEventListener('pointerleave',leave);},get count(){return bodies.length;}};
}



