export const pages=['inicio','projetos','atuacao','sobre','contato'];
export function currentPage(search=''){const p=new URLSearchParams(search).get('page');return pages.includes(p)?p:'inicio';}
export function pageHref(page='inicio',anchor=''){const p=pages.includes(page)?page:'inicio';return './institucional.html'+(p==='inicio'?'':'?page='+p)+(anchor?'#'+encodeURIComponent(anchor):'');}
export function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function selectProjects(projects){const order=['landing-page-raphael-seguros','automacao-propostas','desenvolvimento-assistido-antigravity','renovacao-lembretes-calendario','organizador-financeiro'];const all=[...projects].sort((a,b)=>order.findIndex(x=>a.href.includes(x))-order.findIndex(x=>b.href.includes(x)));return {all,featured:all.slice(0,3)};}


export function caseHref(project,search=""){const match=project?.href?.match(/^\/cases\/([a-z0-9-]+)\/$/);return pageHref('projetos')+(match?'&case='+encodeURIComponent(match[1]):'')+(new URLSearchParams(search).get('motion')==='reduce'?'&motion=reduce':'')+(new URLSearchParams(search).get('theme')==='cyberpunk'?'&theme=cyberpunk':'');}
export function getCaseProject(search,projects){const slug=new URLSearchParams(search).get('case');return projects.find(p=>p.href==='/cases/'+slug+'/')||null;}
const contexts={
'landing-page-raphael-seguros':{shortTitle:'Landing page de seguros',problem:'Tornar os serviços de seguros mais claros e orientar a comparação.',contribution:'Pesquisa, organização da informação e revisão da interface com apoio de IA.'},
'automacao-propostas':{shortTitle:'Automação de propostas e apólices',problem:'Localizar dados em PDFs, transcrever campos e organizar documentos.',contribution:'Estruturação do fluxo, validações e tratamento de duplicados e erros.'},
'renovacao-lembretes-calendario':{shortTitle:'Renovação, tarefas e calendário',problem:'Acompanhar vencimentos sem perder estado ou repetir tarefas.',contribution:'Regras de acompanhamento, validação de IDs e integração com o Google Workspace.'},
'desenvolvimento-assistido-antigravity':{shortTitle:'Agentes e arquitetura de contexto',problem:'Preservar contexto e decisões em projetos extensos com IA.',contribution:'Bases documentais, instruções persistentes, handoffs e revisão humana.'},
'organizador-financeiro':{shortTitle:'Organizador financeiro modular',problem:'Centralizar informações e organizar rotinas financeiras em módulos.',contribution:'Organização de requisitos e acompanhamento da construção assistida do protótipo.'}};
export function projectContext(project){return contexts[project.href?.split('/').filter(Boolean).at(-1)]||null;}
