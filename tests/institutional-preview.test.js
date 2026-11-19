import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {currentPage,pageHref,selectProjects,escapeHTML} from '../experiments/lusion-motion-study/institutional-model.js';
import {createLinkGeometry} from '../experiments/lusion-motion-study/institutional-geometry.js';
const content=JSON.parse(readFileSync(new URL('../experiments/lusion-motion-study/portfolio-content.json',import.meta.url)));
test('navigation is constrained to the five institutional pages and preserves explicit section links',()=>{
assert.equal(currentPage('?page=atuacao'),'atuacao');
assert.equal(currentPage('?page=../../cases'),'inicio');
assert.equal(currentPage('?page=projetos&motion=reduce'),'projetos');
assert.equal(pageHref('sobre','trajetoria'),'./institucional.html?page=sobre#trajetoria');
assert.equal(pageHref('invalid'),'./institucional.html');
});
test('selection balances sites, automation and context without changing factual status or losing the other cases',()=>{
const {featured,all}=selectProjects(content.projects);
assert.equal(all.length,5);
assert.equal(new Set(all.map(p=>p.href)).size,5);
assert.match(featured[0].href,/landing-page/);assert.match(featured[1].href,/automacao-propostas/);assert.match(featured[2].href,/antigravity/);
for(const p of all)assert.equal(p.status,content.projects.find(s=>s.href===p.href).status);
});
test('source text is escaped before being interpolated in HTML',()=>assert.equal(escapeHTML('<script x="y">&'), '&lt;script x=&quot;y&quot;&gt;&amp;'));
test('link geometry is finite, outward and normalized for stable lighting and does not collapse at the seam',()=>{
const {positions,normals}=createLinkGeometry(32,12);
assert.equal(positions.length,normals.length);assert.ok(positions.length>1000);
for(let i=0;i<normals.length;i+=3){assert.ok(Number.isFinite(positions[i]));assert.ok(Math.abs(Math.hypot(...normals.slice(i,i+3))-1)<1e-5);}
for(let i=0;i<positions.length;i+=9){const a=positions.slice(i,i+3),b=positions.slice(i+3,i+6),c=positions.slice(i+6,i+9);const u=b.map((x,j)=>x-a[j]),v=c.map((x,j)=>x-a[j]);assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-6);}
});

