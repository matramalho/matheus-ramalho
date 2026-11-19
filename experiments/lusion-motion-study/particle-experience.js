import {createParticleTargets,createParticleState,stepParticleField} from './particle-field.js';

export function attachParticleExperience(section,options){
  if(!section)return null;
  const canvas=section.querySelector('.particle-canvas'),fallback=section.querySelector('.particle-static');
  const buttons=[...section.querySelectorAll('button[data-particle-mode]')],status=section.querySelector('.particle-description'),link=section.querySelector('.particle-context-link');
  const modes={sites:{label:'Sites',text:'Informação organizada em uma interface que pode ser explorada.',anchor:'sites'},automacao:{label:'Automações',text:'Etapas, dados e ferramentas conectados por regras e verificações.',anchor:'automacao'},avaliacao:{label:'Avaliação de IA',text:'Resultados examinados com contexto, critérios e revisão humana.',anchor:'avaliacao'}};
  let mode='sites',state=null,targets=null,gl=null,gpu=null,ready=false,intersecting=false,raf=0,last=0,angle=0,time=0,width=1,height=1,disposed=false,pointer=null,lost=false;
  const narrow=()=>innerWidth<=760;
  const paused=()=>options.isPaused()||options.isReduced();
  const schedule=()=>{if(!raf&&!disposed&&!document.hidden&&intersecting)raf=requestAnimationFrame(frame);};
  function init(){
    if(ready)return;ready=true;
    const count=narrow()?10000:24000;
    targets=Object.fromEntries(Object.keys(modes).map(key=>[key,createParticleTargets(key,count)]));
    state=createParticleState(targets[mode]);canvas.dataset.particles=String(count);
    gl=canvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
    if(gl){try{gpu=createRenderer(gl,count);}catch(error){console.warn('Particle renderer unavailable',error.message);gl=null;}}
    if(!gl){canvas.hidden=true;fallback.hidden=false;}resize();
  }
  function resize(){
    const r=section.getBoundingClientRect();width=r.width*1.11;height=r.height;
    const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);fallback.width=Math.round(width);fallback.height=Math.round(height);
    if(gl&&!lost)gl.viewport(0,0,canvas.width,canvas.height);schedule();
  }
  function layout(){
    const r=section.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
    angle=options.isReduced()?-.18:(progress-.5)*.55-.18;
    const presence=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight*.55)))*Math.min(1,Math.max(0,r.bottom/(innerHeight*.4)));
    document.documentElement.style.setProperty('--particle-presence',presence.toFixed(3));schedule();
  }
  function setMode(key){
    if(!modes[key])return;mode=key;section.dataset.particleMode=key;
    for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.particleMode===key));
    status.textContent=modes[key].text;const url=new URL(link.href);url.hash=modes[key].anchor;link.href=url.href;link.firstChild.textContent='Conheça '+(key==='sites'?'os sites':key==='automacao'?'as automações':'a avaliação de IA')+' ';
    if(state&&paused()){state.positions.set(targets[mode]);state.velocities.fill(0);state.heat.fill(0);}schedule();
  }
  const click=e=>{const button=e.target.closest('button[data-particle-mode]');if(button)setMode(button.dataset.particleMode);};
  const key=e=>{const index=buttons.indexOf(document.activeElement);if(index<0)return;let next;
    if(e.key==='ArrowRight')next=(index+1)%buttons.length;else if(e.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;
    e.preventDefault();buttons[next].focus();setMode(buttons[next].dataset.particleMode);
  };
  let lastPointer=0;
  const move=e=>{if(paused()||e.pointerType==='touch'||!state)return;const r=canvas.getBoundingClientRect();
    const scale=narrow()?.44:.9,centerX=narrow()?0:1.42,centerY=narrow()?-.90:0;
    const halfY=2.36,halfX=halfY*r.width/r.height;
    const x=(((e.clientX-r.left)/r.width*2-1)*halfX-centerX)/scale,y=((1-(e.clientY-r.top)/r.height*2)*halfY-centerY)/scale;
    const now=performance.now(),dt=Math.max(.016,(now-lastPointer)/1000),old=pointer;
    pointer={x,y,vx:old?Math.max(-12,Math.min(12,(x-old.x)/dt)):0,vy:old?Math.max(-12,Math.min(12,(y-old.y)/dt)):0,radius:.72};lastPointer=now;schedule();
  };
  const leave=()=>{pointer=null;};
  function frame(now){
    raf=0;if(disposed||document.hidden||!intersecting)return;if(!ready)init();
    const dt=last?Math.min(1/30,(now-last)/1000):0;last=now;
    if(!paused()){time+=dt;stepParticleField(state,targets[mode],dt,pointer);if(pointer){pointer.vx*=Math.exp(-12*dt);pointer.vy*=Math.exp(-12*dt);}}
    if(gpu&&!lost){gpu.draw(state,angle,paused()?0:Math.sin(time*.25)*.045,narrow(),canvas.width/canvas.height,Math.min(devicePixelRatio,1.5));}
    else drawStatic();
    if(!paused()&&gpu&&!lost)schedule();
  }
  function drawStatic(){
    const ctx=fallback.getContext('2d');ctx.clearRect(0,0,width,height);const scale=narrow()?width*.20:Math.min(width*.14,height*.25),cx=width*(narrow()?.5:.72),cy=height*(narrow()?.69:.52);
    const target=targets[mode];for(let i=0;i<target.length;i+=30){const x=target[i],y=target[i+1],z=target[i+2];ctx.fillStyle='rgba(160,205,245,.7)';ctx.fillRect(cx+(x*.96+z*.25)*scale,cy-y*scale,1.4,1.4);}
  }
  const sync=()=>{pointer=null;last=0;if(raf){cancelAnimationFrame(raf);raf=0;}if(state&&options.isReduced()){state.positions.set(targets[mode]);state.velocities.fill(0);state.heat.fill(0);}schedule();};
  const visibility=()=>{last=0;if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}else schedule();};
  const io=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;if(intersecting){layout();schedule();}else if(raf){cancelAnimationFrame(raf);raf=0;last=0;}},{rootMargin:'120px'});io.observe(section);
  const ro=new ResizeObserver(()=>{if(ready)resize();layout();});ro.observe(section);
  const loss=e=>{e.preventDefault();lost=true;canvas.hidden=true;fallback.hidden=false;schedule();};canvas.addEventListener('webglcontextlost',loss);
  section.addEventListener('click',click);section.addEventListener('keydown',key);section.addEventListener('pointermove',move,{passive:true});section.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',visibility);window.addEventListener('scroll',layout,{passive:true});window.addEventListener('resize',layout,{passive:true});
  setMode(mode);layout();
  return {sync,dispose(){disposed=true;if(raf)cancelAnimationFrame(raf);io.disconnect();ro.disconnect();gpu?.dispose();section.removeEventListener('click',click);section.removeEventListener('keydown',key);section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',loss);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('scroll',layout);window.removeEventListener('resize',layout);document.documentElement.style.removeProperty('--particle-presence');}};
}

function createRenderer(gl,count){
  const shaders=[],buffers=[];
  const compile=(type,source)=>{const shader=gl.createShader(type);shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));return shader;};
  const vertex=`attribute vec3 position;attribute float heat;uniform float yaw,pitch,aspect,scale,centerX,centerY,dpr;varying float H,D;void main(){float cy=cos(yaw),sy=sin(yaw),cx=cos(pitch),sx=sin(pitch);vec3 q=vec3(position.x*cy+position.z*sy,position.y,-position.x*sy+position.z*cy);q=vec3(q.x,q.y*cx-q.z*sx,q.y*sx+q.z*cx)*scale+vec3(centerX,centerY,-6.5);float f=2.75;gl_Position=vec4(q.x*f/aspect,q.y*f,-q.z*.99-.20,-q.z);gl_PointSize=clamp((1.65+heat*1.9)*dpr*6.5/(-q.z),1.,5.);H=heat;D=clamp((position.z+1.)*.5,0.,1.);}`;
  const fragment=`precision mediump float;varying float H,D;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float a=(1.-smoothstep(.25,1.,r))*(.28+H*.45);vec3 c=mix(vec3(.38,.56,.95),vec3(.73,.89,1.),D);c=mix(c,vec3(1.),H);gl_FragColor=vec4(c,a);}`;
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const bind=(name,size,length)=>{const buffer=gl.createBuffer();buffers.push(buffer);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,length*4,gl.DYNAMIC_DRAW);const at=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,size,gl.FLOAT,false,0,0);return buffer;};
  const positions=bind('position',3,count*3),heat=bind('heat',1,count),u=Object.fromEntries(['yaw','pitch','aspect','scale','centerX','centerY','dpr'].map(n=>[n,gl.getUniformLocation(program,n)]));
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);
  return {draw(state,yaw,pitch,narrow,aspect,dpr){
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
    for(const [name,value]of Object.entries({yaw,pitch,aspect,scale:narrow?.44:.9,centerX:narrow?0:1.42,centerY:narrow?-.90:0,dpr}))gl.uniform1f(u[name],value);
    gl.bindBuffer(gl.ARRAY_BUFFER,positions);gl.bufferSubData(gl.ARRAY_BUFFER,0,state.positions);gl.bindBuffer(gl.ARRAY_BUFFER,heat);gl.bufferSubData(gl.ARRAY_BUFFER,0,state.heat);gl.drawArrays(gl.POINTS,0,count);
  },dispose(){for(const b of buffers)gl.deleteBuffer(b);for(const s of shaders)gl.deleteShader(s);gl.deleteProgram(program);}};
}

