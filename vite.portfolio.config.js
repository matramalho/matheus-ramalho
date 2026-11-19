import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
const root=dirname(fileURLToPath(import.meta.url));
const cases=['automacao-propostas','renovacao-lembretes-calendario','landing-page-raphael-seguros','desenvolvimento-assistido-antigravity','organizador-financeiro'];
const description='IA aplicada, automação e desenvolvimento assistido, com contexto, evidências e revisão humana. Portfólio de Matheus Ramalho.';
export default {
 root,base:'/',publicDir:resolve(root,'public'),
 plugins:[{name:'portfolio-public-entry',writeBundle(){
  const out=resolve(root,'dist-portfolio');
  const html=readFileSync(resolve(out,'experiments/lusion-motion-study/institucional.html'),'utf8')
   .replace('<meta name="robots" content="noindex,nofollow">','<meta name="robots" content="index,follow">')
   .replace('<meta name="theme-color" content="#efeff4">','<meta name="theme-color" content="#0a0f1c">')
   .replace('</head>','<meta name="description" content="'+description+'"><meta property="og:title" content="Matheus Ramalho — IA aplicada"><meta property="og:description" content="'+description+'"><meta property="og:type" content="website"><link rel="icon" href="/favicon.svg"></head>')
   .replace('<a href="/">Abrir portfólio existente</a>','<a href="/ai-evaluation.html">View the English profile</a>');
  writeFileSync(resolve(out,'index.html'),html);
  writeFileSync(resolve(out,'institucional.html'),html);
  const anchors={cases:'/?page=projetos',capacidades:'/?page=atuacao','como-uso-ia':'/?page=atuacao',processo:'/?page=atuacao',seguranca:'/?page=atuacao',sobre:'/?page=sobre',contato:'/?page=contato'};
  for(const name of ['ai-evaluation.html',...cases.map(slug=>'cases/'+slug+'/index.html')]){
   const file=resolve(out,name);
   writeFileSync(file,readFileSync(file,'utf8').replace(/href="\/#([a-z-]+)"/g,(all,id)=>anchors[id]?'href="'+anchors[id]+'"':all));
  }
 }}],
 build:{outDir:resolve(root,'dist-portfolio'),emptyOutDir:false,rollupOptions:{input:[resolve(root,'experiments/lusion-motion-study/institucional.html'),resolve(root,'ai-evaluation.html'),...cases.map(slug=>resolve(root,'cases',slug,'index.html'))]}}
};
