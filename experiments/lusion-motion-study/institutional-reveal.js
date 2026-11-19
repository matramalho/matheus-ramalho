// Two visibility bands replay entrances only after a group has fully left the reading area.
export function attachReveals(root,{isPaused,isReduced}){
 if(!root||!('IntersectionObserver' in window))return null;
 const nodes=[...root.querySelectorAll('.home-hero h1,.approach h2,.particle-copy h2,.toolkit-intro h2,.page-title h1,.page-title .page-lead,.section-heading h2,.human-grid h2,.human-grid>div>p:not(.eyebrow),.about-teaser h2,.about-teaser>div,.editorial-heading,.biography>div:last-child,.history>h2,.history li,.contact-context,.case-brief,.security>h2')];
 let disposed=false;
 const stopped=()=>isPaused()||isReduced();
 const show=node=>{node.dataset.reveal='shown';};
 const arm=node=>{const r=node.getBoundingClientRect();if(stopped()||node.contains(document.activeElement)){show(node);return;}node.dataset.revealDirection=r.bottom<0?'above':'below';node.dataset.reveal='pending';};
 const enter=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)show(e.target);},{rootMargin:'0px 0px -30px 0px',threshold:0});
 const reset=new IntersectionObserver(entries=>{for(const e of entries)if(!e.isIntersecting)arm(e.target);},{rootMargin:'120px 0px 120px 0px',threshold:0});
 for(const n of nodes){if(!stopped()&&n.getBoundingClientRect().top>innerHeight)arm(n);else show(n);enter.observe(n);reset.observe(n);}
 const focus=ev=>{for(const n of nodes)if(n.contains(ev.target))show(n);};root.addEventListener('focusin',focus);
 const sync=()=>{if(disposed)return;for(const n of nodes){const r=n.getBoundingClientRect();if(stopped()||n.contains(document.activeElement))show(n);else if(r.bottom<-120||r.top>innerHeight+120)arm(n);}};
 return{sync,dispose(){disposed=true;enter.disconnect();reset.disconnect();root.removeEventListener('focusin',focus);for(const n of nodes){delete n.dataset.reveal;delete n.dataset.revealDirection;}}};
}
