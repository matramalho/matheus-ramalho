import test from 'node:test';
import assert from 'node:assert/strict';
import {createHardwareGeometry,stepHardware} from '../experiments/lusion-motion-study/hardware-geometry.js';

test('hardware mesh has finite positions, normalized normals and nondegenerate outward faces',()=>{
  const mesh=createHardwareGeometry();
  assert.equal(mesh.positions.length,mesh.normals.length);
  assert.equal(mesh.colors.length,mesh.positions.length);
  assert.equal(mesh.materials.length,mesh.positions.length/3*2);
  assert.ok(mesh.positions.length>1000&&mesh.positions.length<90000);
  for(let i=0;i<mesh.positions.length;i+=3){
    assert.ok(mesh.positions.slice(i,i+3).every(Number.isFinite));
    assert.ok(Math.abs(Math.hypot(...mesh.normals.slice(i,i+3))-1)<1e-5);
    assert.ok(Math.abs(mesh.positions[i])<1.4&&Math.abs(mesh.positions[i+1])<1.4);
  }
  for(let i=0;i<mesh.positions.length;i+=9){
    const a=mesh.positions.slice(i,i+3),b=mesh.positions.slice(i+3,i+6),c=mesh.positions.slice(i+6,i+9);
    const u=b.map((v,j)=>v-a[j]),v=c.map((v,j)=>v-a[j]);
    const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    assert.ok(Math.hypot(...cross)>1e-9);
    const n=mesh.normals.slice(i,i+3);assert.ok(cross.reduce((sum,x,j)=>sum+x*n[j],0)>0);
  }
  assert.ok(mesh.colors.every(v=>v>=0&&v<=1));assert.ok(mesh.materials.every(v=>v>=0&&v<=1));
});

test('attached hardware cannot be thrown out of its route and settles when input stops',()=>{
  const b={dx:0,dy:0,rx:0,ry:0};
  for(let i=0;i<3000;i++)stepHardware(b,.016,{x:Math.sin(i)*1e4,y:Math.cos(i)*1e4},Math.sin(i)*1e3);
  assert.ok(Object.values(b).every(Number.isFinite));
  assert.ok(Math.abs(b.dx)<=8&&Math.abs(b.dy)<=8&&Math.abs(b.rx)<=.22&&Math.abs(b.ry)<=.22);
  for(let i=0;i<500;i++)stepHardware(b,.016,null,0);
  assert.ok(Math.abs(b.dx)+Math.abs(b.dy)+Math.abs(b.rx)+Math.abs(b.ry)<1e-6);
});
