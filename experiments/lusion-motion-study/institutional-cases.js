import {attachCaseChapters} from './institutional-chapters.js';
import {caseHref,escapeHTML as e} from './institutional-model.js';
const sources=import.meta.glob('../../cases/*/index.html',{query:'?raw',import:'default'});
const allowed=new Set(['SECTION','DIV','P','H2','H3','H4','UL','OL','LI','STRONG','EM','B','I','CODE','PRE','TABLE','THEAD','TBODY','TR','TH','TD','A','DETAILS','SUMMARY','FIGURE','FIGCAPTION','IMG','BLOCKQUOTE','SPAN','BR']);
const dropped=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','CANVAS','FORM','BUTTON','INPUT','SVG']);
export async function hydrateCase(project,container,projects){
const slug=project.href.split('/').filter(Boolean).at(-1),loader=sources['../../cases/'+slug+'/index.html'];
if(!loader)throw Error('Fonte do estudo não encontrada');
const raw=await loader(),doc=new DOMParser().parseFromString(raw,'text/html'),article=doc.querySelector('.case-main-content');
if(!article)throw Error('Conteúdo principal do estudo não encontrado');
function semantic(node){if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent);
if(node.nodeType!==Node.ELEMENT_NODE||node.hidden||node.getAttribute('aria-hidden')==='true'||dropped.has(node.tagName))return null;
const output=allowed.has(node.tagName)?document.createElement(node.tagName.toLowerCase()):document.createDocumentFragment();
if(node.classList.contains('widget-info-label'))output.className='case-field-label';
if(node.classList.contains('widget-info-value'))output.className='case-field-value';
if(node.tagName==='A'){try{const u=new URL(node.getAttribute('href')||'',location.origin+project.href);if(['http:','https:','mailto:'].includes(u.protocol)){const related=projects.find(p=>p.href===u.pathname);output.href=related?caseHref(related,location.search):u.href;if(u.origin!==location.origin){output.rel='noopener noreferrer';}}}catch{}}
if(node.tagName==='IMG'){try{const u=new URL(node.getAttribute('src')||'',location.origin+project.href);if(['http:','https:'].includes(u.protocol)){output.src=u.href;output.alt=node.getAttribute('alt')||'';output.loading='lazy';}}catch{}}
if(['TH','TD'].includes(node.tagName)){for(const name of ['colspan','rowspan'])if(node.hasAttribute(name))output.setAttribute(name,node.getAttribute(name));}
for(const child of node.childNodes){const copy=semantic(child);if(copy)output.append(copy);}return output;}
const body=document.createElement('article');body.className='case-reading';
for(const child of article.childNodes){const copy=semantic(child);if(copy)body.append(copy);}
const aside=document.createElement('aside');aside.className='case-facts';aside.setAttribute('aria-label','Ficha do projeto');
const sourceAside=doc.querySelector('.case-sidebar');if(sourceAside){for(const child of sourceAside.childNodes){const copy=semantic(child);if(copy)aside.append(copy);}}
const layout=document.createElement('div');layout.className='case-layout';layout.append(body,aside);container.replaceChildren(layout);container.setAttribute('aria-busy','false');
const workflow=doc.querySelector('.workflow-poc-section');if(workflow){const note=document.createElement('div');note.className='case-diagram-link';note.innerHTML='<span class="eyebrow">APROFUNDAMENTO TÉCNICO</span><h2>A arquitetura, em detalhe.</h2><p>A representação interativa do workflow permanece disponível no registro original, com suas etapas e limites.</p><a class="button" href="'+e(project.href)+'#workflow-poc-title">Abrir arquitetura interativa <span aria-hidden="true">↗</span></a>';body.append(note);}
attachCaseChapters(body,container);
return{source:project.href,sections:body.querySelectorAll('h2').length};
}

