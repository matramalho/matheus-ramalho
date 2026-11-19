export const toolkitGroups=[
 {id:'automacao',label:'Automação',title:'Da rotina ao fluxo.',description:'Workflows conectam documentos, dados e regras. O resultado precisa funcionar também nas exceções.',evidence:'/cases/automacao-propostas/',link:'Veja a automação de propostas'},
 {id:'contexto',label:'IA e contexto',title:'Contexto antes da resposta.',description:'Modelos recebem objetivos, fontes e critérios. A documentação mantém as decisões disponíveis para a próxima etapa.',evidence:'/cases/desenvolvimento-assistido-antigravity/',link:'Explore a arquitetura de contexto'},
 {id:'desenvolvimento',label:'Desenvolvimento',title:'Construir. Revisar. Evoluir.',description:'Desenvolvimento assistido, revisão visual e versionamento fazem parte da construção dos projetos.',evidence:'/cases/desenvolvimento-assistido-antigravity/',link:'Conheça o processo de desenvolvimento'}
];
export const toolkitItems=[
 {id:'n8n',name:'n8n',sourceTag:'n8n',role:'Workflows e regras',group:'automacao',symbol:'nodes'},
 {id:'llms',name:'LLMs',sourceTag:'LLMs em processos operacionais',role:'Extração, pesquisa e síntese',group:'contexto',symbol:'spark'},
 {id:'git',name:'Git',sourceTag:'Git',role:'Histórico e versionamento',group:'desenvolvimento',symbol:'branch'},
 {id:'workspace',name:'Google Workspace',sourceTag:'Google Workspace',role:'Documentos e operação',group:'automacao',symbol:'grid'},
 {id:'agents',name:'Agentes',sourceTag:'agentes especializados',role:'Execução com escopo',group:'contexto',symbol:'agent'},
 {id:'vite',name:'Vite',sourceTag:'Vite',role:'Ambiente de desenvolvimento',group:'desenvolvimento',symbol:'bolt'},
 {id:'api',name:'APIs / webhooks',sourceTag:'APIs e webhooks',role:'Integração entre etapas',group:'automacao',symbol:'link'},
 {id:'docs',name:'Documentação',sourceTag:'documentação técnica',role:'Decisões e continuidade',group:'contexto',symbol:'document'},
 {id:'vercel',name:'Vercel',sourceTag:'Vercel',role:'Ambientes de publicação',group:'desenvolvimento',symbol:'deploy'}
];
export function selectToolkit(id){const group=toolkitGroups.find(x=>x.id===id)||toolkitGroups[0];return {group,items:toolkitItems.filter(x=>x.group===group.id)};}
