import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {toolkitGroups,toolkitItems,selectToolkit} from '../experiments/lusion-motion-study/institutional-toolkit-model.js';
const root=new URL('../',import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,'');
const source=JSON.parse(readFileSync(root+'experiments/lusion-motion-study/portfolio-content.json'));
test('every featured tool is documented and every group points to a real case without claiming new proficiency',()=>{
 assert.equal(toolkitItems.length,9);assert.equal(new Set(toolkitItems.map(x=>x.id)).size,9);
 for(const item of toolkitItems){assert.ok(source.editorial.about.tags.includes(item.sourceTag),item.name);assert.ok(toolkitGroups.some(g=>g.id===item.group));assert.ok(item.role.length>5);}
 for(const group of toolkitGroups){assert.equal(toolkitItems.filter(x=>x.group===group.id).length,3);assert.ok(source.projects.some(x=>x.href===group.evidence));assert.ok(readFileSync(root+group.evidence.slice(1)+'index.html').length>0);}
});
test('invalid selection falls back to a documented front and returns only its three tools',()=>{
 const result=selectToolkit('untrusted');assert.equal(result.group.id,'automacao');assert.equal(result.items.length,3);
 assert.equal(selectToolkit('desenvolvimento').items.map(x=>x.name).join(','),'Git,Vite,Vercel');
 assert.equal(selectToolkit('contexto').group.evidence,'/cases/desenvolvimento-assistido-antigravity/');
});
