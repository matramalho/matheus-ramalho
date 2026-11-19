import test from 'node:test';
import assert from 'node:assert/strict';
import {workflowCover} from '../experiments/lusion-motion-study/workflow-art.js';
import {proposalAutomationWorkflow,renewalReminderWorkflow} from '../src/data/workflows.js';
test('cover labels and node references come from sanitized workflow data',()=>{
 for(const [kind,workflow] of [['documents',proposalAutomationWorkflow],['calendar',renewalReminderWorkflow]]){
  const html=workflowCover(kind);const ids=[...html.matchAll(/data-source-node="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,6);for(const id of ids){const node=workflow.nodes.find(n=>n.id===id);assert.ok(node);assert.ok(html.includes(node.shortTitle));}
  assert.ok(html.includes('Não representa execução em tempo real'));
  assert.ok(!html.includes('<img'));assert.ok(!html.includes('credentials'));
 }
});
test('repeated artwork has unique accessible SVG and gradient identifiers',()=>{
 const a=workflowCover(),b=workflowCover();assert.notEqual(a.match(/aria-labelledby="([^"]+)"/)[1],b.match(/aria-labelledby="([^"]+)"/)[1]);
});
