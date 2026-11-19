import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleWorldState} from '../experiments/lusion-motion-study/institutional-world.js';
const stops=[{y:0,color:[8,13,24],media:.055},{y:1400,color:[8,20,32],media:.075},{y:2600,color:[8,14,25],media:.022},{y:4800,color:[8,25,31],media:.045}];
test('hero starts without traces or hardware and scroll draws them reversibly',()=>{
  const get=y=>sampleWorldState(y,800,700,stops,false);
  assert.equal(get(0).trace,0);assert.equal(get(0).hardware,0);
  assert.equal(get(650).trace,0);
  assert.ok(get(1100).trace>0&&get(1100).trace<1);
  assert.ok(get(1800).trace>get(1100).trace);
  assert.equal(get(2400).trace,1);
  assert.deepEqual(get(1100),sampleWorldState(1100,800,700,stops,false));
  assert.equal(get(0).hardware,0);
});
test('background interpolates without overshoot and gives projects a quieter media layer',()=>{
  const a=sampleWorldState(1400,800,700,stops,false),b=sampleWorldState(2600,800,700,stops,false);
  assert.ok(b.media<a.media);assert.notDeepEqual(a.color,b.color);
  for(let y=-200;y<8000;y+=37){const s=sampleWorldState(y,800,700,stops,false);assert.ok(s.trace>=0&&s.trace<=1&&s.hardware>=0&&s.hardware<=1);assert.ok(s.color.every(Number.isFinite));assert.ok(s.media>=0&&s.media<=.08);}
});
test('reduced motion has no partial line drawing or moving media',()=>{
  assert.equal(sampleWorldState(0,800,700,stops,true).trace,0);
  const s=sampleWorldState(1100,800,700,stops,true);assert.equal(s.trace,1);assert.equal(s.media,0);
});
