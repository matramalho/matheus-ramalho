import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..','dist-portfolio');
const files=[];function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const file=resolve(dir,item.name);item.isDirectory()?walk(file):files.push(file);}}walk(root);
const exported=files.map(f=>relative(root,f).replaceAll('\\','/'));
assert(exported.includes('index.html')&&exported.includes('institucional.html'));
assert(exported.includes('ai-evaluation.html'));
assert.equal(exported.filter(f=>/^cases\/[^/]+\/index\.html$/.test(f)).length,5);
assert(!exported.some(f=>/^(docs|node_modules|tests|src)\//.test(f)||/\.(md|zip|env|map)$/.test(f)),'Unexpected source or archive in output');
assert.deepEqual(exported.filter(f=>f.startsWith('experiments/')),['experiments/lusion-motion-study/institucional.html']);
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=readFileSync(file,'utf8');
 for(const [,url]of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(https?:|mailto:|data:)/.test(url))continue;
  const pathname=url.split(/[?#]/)[0];if(!pathname)continue;
  const target=pathname.startsWith('/')?resolve(root,'.'+pathname):resolve(dirname(file),pathname);
  assert(existsSync(target),'Missing local resource '+url+' in '+relative(root,file));
 }
}
const home=readFileSync(resolve(root,'index.html'),'utf8');
assert(!home.includes('noindex,nofollow'));
assert(home.includes('name="description"'));
console.log(JSON.stringify({files:files.length,html:files.filter(f=>f.endsWith('.html')).length,bytes:files.reduce((n,f)=>n+statSync(f).size,0),localResources:'verified',researchArchives:'excluded'},null,2));
