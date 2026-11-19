// DOM/CSS navigation effects; no dependency, cursor capture or custom menu roles.
export function attachNavigation(header,isPaused){
  const nav=header.querySelector('.desktop-nav'),links=[...nav.querySelectorAll('a')];
  let target=nav.querySelector('[aria-current]')||links[0],frame=0,disposed=false;
  function indicator(){
    if(!nav.clientWidth||!target)return;
    const parent=nav.getBoundingClientRect(),r=target.getBoundingClientRect();
    nav.style.setProperty('--item-x',(r.left-parent.left)+'px');
    nav.style.setProperty('--item-w',r.width+'px');
  }
  function measure(){
    frame=0;if(disposed)return;
    header.classList.toggle('is-scrolled',scrollY>24);
    const max=document.documentElement.scrollHeight-innerHeight;
    header.style.setProperty('--reading',String(max>0?Math.min(1,Math.max(0,scrollY/max)):0));
    indicator();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
  const follow=event=>{if(isPaused()||event.pointerType==='touch')return;const r=header.getBoundingClientRect();header.style.setProperty('--pointer-x',(event.clientX-r.left)+'px');header.style.setProperty('--pointer-y',(event.clientY-r.top)+'px');header.classList.add('has-pointer');};
  const reset=()=>{header.classList.remove('has-pointer');const focused=links.find(n=>n===document.activeElement);target=focused||nav.querySelector('[aria-current]')||links[0];indicator();};
  const onBlur=()=>queueMicrotask(reset);
  const dialog=document.querySelector('#site-menu');
  const cycle=event=>{
    if(event.key!=='Tab'||!dialog.open)return;
    const controls=[...dialog.querySelectorAll('button:not([disabled]),a[href]')];
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  };
  dialog.addEventListener('keydown',cycle);
  const select=event=>{const link=event.target.closest('a');if(link&&nav.contains(link)){target=link;indicator();}};
  header.addEventListener('pointermove',follow,{passive:true});header.addEventListener('pointerleave',reset);
  nav.addEventListener('pointerover',select);nav.addEventListener('focusin',select);nav.addEventListener('focusout',onBlur);
  nav.addEventListener('pointerleave',reset);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
  const observer=new ResizeObserver(schedule);observer.observe(nav);document.fonts?.ready.then(schedule);measure();
  return()=>{disposed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();dialog.removeEventListener('keydown',cycle);header.removeEventListener('pointermove',follow);header.removeEventListener('pointerleave',reset);nav.removeEventListener('pointerover',select);nav.removeEventListener('focusin',select);nav.removeEventListener('focusout',onBlur);nav.removeEventListener('pointerleave',reset);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
}
