import {escapeHTML as e,projectContext} from './institutional-model.js';
export const projectFilters=[{id:'todos',label:'Todos'},{id:'sites',label:'Sites'},{id:'automacao',label:'Automações'},{id:'contexto',label:'Contexto e agentes'},{id:'produto',label:'Produto'}];
const evidence={
 'landing-page-raphael-seguros':{kind:'sites',cover:'Recorte da interface',label:'Interface em desenvolvimento',summary:'Recorte identificado da interface e descrição das decisões de pesquisa, organização e revisão.'},
 'automacao-propostas':{kind:'automacao',cover:'Panorama documental',label:'Workflow documentado',summary:'Etapas, regras e arquitetura interativa do workflow, com acesso ao registro original.'},
 'renovacao-lembretes-calendario':{kind:'automacao',cover:'Panorama documental',label:'Workflow documentado',summary:'Rotina, verificações e arquitetura interativa documentadas, com acesso ao registro original.'},
 'desenvolvimento-assistido-antigravity':{kind:'contexto',cover:'Capa conceitual',label:'Abordagem documentada',summary:'Bases documentais, instruções, handoffs e aplicações práticas descritas no estudo.'},
 'organizador-financeiro':{kind:'produto',cover:'Capa conceitual',label:'Estado do protótipo',summary:'O estudo descreve o protótipo local, seu estágio atual e as integrações ainda planejadas.'}
};
export function projectEvidence(project){return evidence[project.href?.split('/').filter(Boolean).at(-1)]||null;}
export function filterProjects(projects,id){if(!projectFilters.some(f=>f.id===id)||id==='todos')return [...projects];return projects.filter(p=>projectEvidence(p)?.kind===id);}
export function projectFilterMarkup(projects){return '<div class="project-browser" id="explorar-projetos"><div class="project-filters" role="group" aria-label="Filtrar projetos por frente">'+projectFilters.map((f,i)=>'<button type="button" data-project-filter="'+f.id+'" aria-pressed="'+(i===0)+'">'+e(f.label)+' <span>'+String(filterProjects(projects,f.id).length).padStart(2,'0')+'</span></button>').join('')+'</div><p class="project-filter-status" aria-live="polite" aria-atomic="true">5 de 5 projetos</p></div>';}
export function caseSummaryMarkup(project){const context=projectContext(project),proof=projectEvidence(project);if(!context||!proof)return '';return '<div class="case-brief"><p class="eyebrow">O PROJETO EM POUCAS LINHAS</p><dl><div><dt>01 / O problema</dt><dd>'+e(context.problem)+'</dd></div><div><dt>02 / Minha contribuição</dt><dd>'+e(context.contribution)+'</dd></div><div><dt>03 / O que você encontra</dt><dd>'+e(proof.summary)+'</dd></div></dl><a class="text-link" href="#case-content">Ler o estudo completo <span aria-hidden="true">↓</span></a></div>';}
export function attachProjectBrowser(section){
 if(!section)return null;const buttons=[...section.querySelectorAll('[data-project-filter]')],cards=[...section.querySelectorAll('.project')],status=section.querySelector('.project-filter-status');
 function select(id,updateUrl){const selected=projectFilters.find(f=>f.id===id)?.id||'todos';let count=0;for(const card of cards){card.hidden=selected!=='todos'&&card.dataset.projectKind!==selected;if(!card.hidden)count++;}for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.projectFilter===selected));status.textContent=count+' de '+cards.length+' projetos';if(updateUrl){const u=new URL(location.href);if(selected==='todos')u.searchParams.delete('frente');else u.searchParams.set('frente',selected);history.replaceState(history.state,'',u.pathname+u.search+u.hash);}window.dispatchEvent(new Event('resize'));}
 const click=ev=>{const b=ev.target.closest('button[data-project-filter]');if(b&&section.contains(b))select(b.dataset.projectFilter,true);};
 const key=ev=>{const i=buttons.indexOf(document.activeElement);if(i<0)return;const n=buttons.length,next=ev.key==='ArrowRight'?(i+1)%n:ev.key==='ArrowLeft'?(i+n-1)%n:ev.key==='Home'?0:ev.key==='End'?n-1:-1;if(next<0)return;ev.preventDefault();buttons[next].focus();select(buttons[next].dataset.projectFilter,true);};
 section.addEventListener('click',click);section.addEventListener('keydown',key);select(new URLSearchParams(location.search).get('frente'),false);
 return()=>{section.removeEventListener('click',click);section.removeEventListener('keydown',key);};
}

