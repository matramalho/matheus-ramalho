import test from 'node:test';
import assert from 'node:assert/strict';
import {createParticleTargets,createParticleState,stepParticleField} from '../experiments/lusion-motion-study/particle-field.js';

test('three conceptual outputs have stable deterministic 3D populations and distinct geometry',()=>{
  const clouds=['sites','automacao','avaliacao'].map(mode=>createParticleTargets(mode,1200));
  for(const cloud of clouds){assert.equal(cloud.length,3600);assert.ok([...cloud].every(Number.isFinite));
    for(let axis=0;axis<3;axis++){const values=[...cloud].filter((_,i)=>i%3===axis);assert.ok(Math.max(...values)-Math.min(...values)>.2);}
  }
  assert.deepEqual(clouds[0],createParticleTargets('sites',1200));
  assert.notDeepEqual(clouds[0],clouds[1]);assert.notDeepEqual(clouds[1],clouds[2]);
});
test('cursor scatters particles and releasing it reconstructs the target instead of orbiting forever',()=>{
  const home=createParticleTargets('sites',800),state=createParticleState(home);
  const error=()=>state.positions.reduce((sum,p,i)=>sum+(p-home[i])**2,0)/home.length;
  for(let i=0;i<30;i++)stepParticleField(state,home,1/60,{x:0,y:0,vx:6,vy:2,radius:2});
  assert.ok(error()>.01);
  for(let i=0;i<600;i++)stepParticleField(state,home,1/60,null);
  assert.ok(error()<1e-5);
  assert.ok([...state.positions,...state.velocities].every(Number.isFinite));
});
test('category changes converge to the new output; zero time preserves a paused frame',()=>{
  const a=createParticleTargets('sites',600),b=createParticleTargets('automacao',600),state=createParticleState(a);
  const original=state.positions.slice();stepParticleField(state,b,0,null);assert.deepEqual(state.positions,original);
  for(let i=0;i<700;i++)stepParticleField(state,b,1/60,null);
  const error=state.positions.reduce((sum,p,i)=>sum+(p-b[i])**2,0)/b.length;assert.ok(error<1e-5);
});
