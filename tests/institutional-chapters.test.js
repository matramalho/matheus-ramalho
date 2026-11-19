import test from 'node:test';
import assert from 'node:assert/strict';
import {planCaseChapters} from '../experiments/lusion-motion-study/institutional-chapters.js';
test('chapter destinations remain unique with repeated titles and existing page IDs',()=>{
 const headings=[{text:'Solução'},{text:'Solução'},{text:'Contexto'}];
 const before=JSON.stringify(headings),plan=planCaseChapters(headings,['case-solucao','case-contexto']);
 assert.deepEqual(plan.map(p=>p.id),['case-solucao-2','case-solucao-3','case-contexto-2']);
 assert.equal(JSON.stringify(headings),before);
 assert.deepEqual(plan.map(p=>p.text),['Solução','Solução','Contexto']);
});
test('chapter plan ignores empty headings and retains their source positions',()=>{
 const plan=planCaseChapters([{text:'  '},{text:'  Resultado observável  '},{text:'Sobre a visualização'}]);
 assert.deepEqual(plan.map(p=>[p.index,p.id,p.text]),[[1,'case-resultado-observavel','Resultado observável'],[2,'case-sobre-a-visualizacao','Sobre a visualização']]);
});
