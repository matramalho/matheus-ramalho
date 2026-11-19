export function planCaseChapters(headings,reserved=[]){
 const used=new Set(reserved),plan=[];
 headings.forEach((heading,index)=>{
  const text=heading.text.trim();if(!text)return;
  const slug=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'capitulo';
  const base='case-'+slug;let id=base,number=2;
  while(used.has(id))id=base+'-'+number++;
  used.add(id);plan.push({index,id,text});
 });return plan;
}
export function attachCaseChapters(body,container){
 const headings=[...body.querySelectorAll('h2')];
 const plan=planCaseChapters(headings.map(h=>({text:h.textContent})),[...document.querySelectorAll('[id]')].map(n=>n.id));
 if(plan.length<2)return;
 const nav=document.createElement('nav');nav.className='case-chapters';nav.setAttribute('aria-label','Capítulos do estudo');
 const title=document.createElement('p');title.className='eyebrow';title.textContent='NESTE ESTUDO';
 const list=document.createElement('ol');
 for(const item of plan){
  const heading=headings[item.index];heading.id=item.id;heading.tabIndex=-1;
  const li=document.createElement('li'),a=document.createElement('a'),number=document.createElement('span'),label=document.createElement('span');
  a.href='#'+item.id;number.textContent=String(list.children.length+1).padStart(2,'0');number.setAttribute('aria-hidden','true');label.textContent=item.text;a.append(number,label);li.append(a);list.append(li);
  a.addEventListener('click',()=>{heading.focus({preventScroll:true});});
 }
 nav.append(title,list);container.prepend(nav);
 const requested=plan.find(item=>'#'+item.id===location.hash);
 if(requested)Promise.resolve(document.fonts?.ready).then(()=>requestAnimationFrame(()=>{if(location.hash==='#'+requested.id)headings[requested.index].scrollIntoView({behavior:'instant'});}));
}
