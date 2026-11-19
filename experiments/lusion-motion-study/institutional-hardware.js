import {createHardwareGeometry,stepHardware} from './hardware-geometry.js';

// Two procedural WebGL packages attached to the existing SVG fan-outs.
export function createHardwareScene(canvas,onResize,options){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(!gl)return null;
  const world=canvas.parentElement,anchors=[...world.querySelectorAll('.pcb-package')];
  const shaders=[],buffers=[];
  const compile=(type,source)=>{const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const vertex=`attribute vec3 position,normal,surfaceColor;attribute vec2 material;uniform mat4 model,projection;varying vec3 N,C,L;varying vec2 M;void main(){N=mat3(model)*normal;C=surfaceColor;M=material;L=position;gl_Position=projection*model*vec4(position,1.);}`;
  const fragment=`precision highp float;varying vec3 N,C,L;varying vec2 M;uniform vec3 accent;uniform vec2 focus;uniform float phase,coverage;void main(){vec3 n=normalize(N),v=vec3(0.,0.,1.),light=normalize(vec3(-.55+focus.x*.5,-.7+focus.y*.5,1.));float d=max(dot(n,light),0.);float fill=max(dot(n,normalize(vec3(.8,.1,.6))),0.);float shine=pow(max(dot(n,normalize(light+v)),0.),mix(95.,18.,M.x));float rim=pow(1.-max(dot(n,v),0.),3.);float grain=sin(L.x*310.+sin(L.y*127.))*.007;vec3 c=C*(.40+d*.85+fill*.25+grain)+vec3(.58,.73,.87)*shine*(1.-M.x)*.8+accent*rim*.12; c+=accent*M.y*(.35+.13*sin(phase));gl_FragColor=vec4(pow(max(c,vec3(0.)),vec3(.85))*coverage,coverage);}`;
  const program=gl.createProgram();
  try{
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const mesh=createHardwareGeometry();
    for(const [name,key,size] of[['position','positions',3],['normal','normals',3],['surfaceColor','colors',3],['material','materials',2]]){
      const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(mesh[key]),gl.STATIC_DRAW);
      const at=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,size,gl.FLOAT,false,0,0);
    }
    const uniforms=Object.fromEntries(['model','projection','accent','phase','coverage','focus'].map(n=>[n,gl.getUniformLocation(program,n)]));
    const bodies=anchors.map(()=>({dx:0,dy:0,rx:0,ry:0,x:0,y:0,size:0}));
    let width=1,height=1,lost=false,disposed=false,pointer=null;
    function align(){
      const r=canvas.getBoundingClientRect();
      const titles=[...document.querySelectorAll('main h1,main h2,.footer-title')].map(e=>e.getBoundingClientRect()).filter(a=>a.bottom>0&&a.top<height);
      anchors.forEach((anchor,i)=>{const a=anchor.getBoundingClientRect();const overlap=titles.some(t=>a.left<t.right&&a.right>t.left&&a.top<t.bottom&&a.bottom>t.top);Object.assign(bodies[i],{x:(a.left+a.right)/2-r.left,y:(a.top+a.bottom)/2-r.top,size:Math.min(a.width,a.height)/2,coverage:overlap?.14:1});});
    }
    function resize(){
      const r=canvas.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);
      const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniformMatrix4fv(uniforms.projection,false,new Float32Array([2/width,0,0,0,0,-2/height,0,0,0,0,-.001,0,-1,1,0,1]));
      align();
      onResize();
    }
    const move=e=>{if(options.isPaused?.()||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};};
    const leave=()=>{pointer=null;};
    const loss=e=>{e.preventDefault();lost=true;world.classList.remove('hardware-ready');canvas.hidden=true;};
    const ro=new ResizeObserver(resize);ro.observe(canvas);
    // Desktop/mobile SVG crop and mask change at breakpoints; measure after CSS settles.
    const mq=matchMedia('(max-width:760px)');mq.addEventListener('change',resize);
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerleave',leave);
    canvas.addEventListener('webglcontextlost',loss);
    gl.enable(gl.DEPTH_TEST);resize();world.classList.add('hardware-ready');
    function draw(time,dt,animate){
      if(lost||disposed)return;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const reveal=options.reveal?.()??1;
      if(reveal<.001)return;
      for(let i=0;i<bodies.length;i++){
        const b=bodies[i];
        if(animate){const p=pointer?{x:(pointer.x-b.x)/Math.max(1,b.size*2),y:(pointer.y-b.y)/Math.max(1,b.size*2)}:null;
          const near=p&&Math.hypot(p.x,p.y)<2.5?p:null;stepHardware(b,dt,near,options.scrollImpulse?.()||0);
        }
        const rx=b.rx+(i?-.24:.24)*reveal,ry=b.ry+(i?-.28:.28)*reveal,sx=Math.sin(rx),cx=Math.cos(rx),sy=Math.sin(ry),cy=Math.cos(ry),s=b.size*(.82+.18*reveal);
        // Fixed pin anchors, only a few pixels of hover travel and modest tilt.
        const model=new Float32Array([cy*s,sx*sy*s,-cx*sy*s,0,0,cx*s,sx*s,0,sy*s,-sx*cy*s,cx*cy*s,0,b.x+b.dx,b.y+b.dy,0,1]);
        gl.uniformMatrix4fv(uniforms.model,false,model);gl.uniform3fv(uniforms.accent,i?[.57,.48,1.]:[.35,.78,1.]);gl.uniform1f(uniforms.phase,time*.8+i*1.8);gl.uniform1f(uniforms.coverage,b.coverage??1);gl.uniform2f(uniforms.focus,-b.ry*3,b.rx*3);
        gl.drawArrays(gl.TRIANGLES,0,mesh.positions.length/3);
      }
    }
    return {draw,layout:align,get count(){return bodies.length;},dispose(){
      disposed=true;ro.disconnect();mq.removeEventListener('change',resize);window.removeEventListener('pointermove',move);window.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',loss);world.classList.remove('hardware-ready');
      for(const b of buffers)gl.deleteBuffer(b);for(const s of shaders)gl.deleteShader(s);gl.deleteProgram(program);
    }};
  }catch(error){for(const b of buffers)gl.deleteBuffer(b);for(const s of shaders)gl.deleteShader(s);gl.deleteProgram(program);throw error;}
}

