// Authored PCB-inspired scenery, not an electrically functional board.
// Pins feed parallel 45-degree routes; all scenery stays outside the reading plane.
function bank(side){
  const paths=[];
  const vias=[];
  for(let i=0;i<6;i++){
    const x=98+i*10,turn=254-i*12;
    paths.push(`M${x} 330V${turn}L${x-80} ${turn-80}H-24`);
    const y=350+i*12,elbow=194+i*12,end=elbow+52;
    paths.push(`M178 ${y}H${elbow}L${end} ${y+52}V${658+i*17}`);
    vias.push([end,658+i*17]);
  }
  for(let i=0;i<4;i++){
    const x=108+i*12;
    paths.push(`M${x} 430V${488+i*14}L${x-60} ${548+i*14}V${824+i*12}`);
    vias.push([x-60,824+i*12]);
  }
  const routes=paths.map((d,i)=>{const id=`pcb-reveal-${side}-${i}`;return `<g style="--route-index:${i%8}"><mask id="${id}" maskUnits="userSpaceOnUse" x="-40" y="-100" width="450" height="1100"><path class="trace-reveal" pathLength="1000" d="${d}"/></mask><g mask="url(#${id})"><path class="trace-track" pathLength="1000" d="${d}"/><path class="trace-pulse stream-afterglow" pathLength="1000" style="--signal-delay:-${(i*.37+side*.8).toFixed(2)}s;--signal-duration:${(2.3+i%4*.2).toFixed(1)}s" d="${d}"/><path class="trace-pulse stream-wake" pathLength="1000" style="--signal-delay:-${(i*.37+side*.8).toFixed(2)}s;--signal-duration:${(2.3+i%4*.2).toFixed(1)}s" d="${d}"/><path class="trace-pulse stream-head" pathLength="1000" style="--signal-delay:-${(i*.37+side*.8).toFixed(2)}s;--signal-duration:${(2.3+i%4*.2).toFixed(1)}s" d="${d}"/></g></g>`;}).join('');
  const pins=Array.from({length:6},(_,i)=>`<path d="M${98+i*10} 330v-9M178 ${350+i*12}h9M78 ${350+i*12}h-9"/>`).join('')+Array.from({length:4},(_,i)=>`<path d="M${108+i*12} 430v9"/>`).join('');
  const pads=vias.map(([x,y])=>`<circle class="pcb-via" cx="${x}" cy="${y}" r="3"/>`).join('');
  const small=Array.from({length:4},(_,i)=>`<g transform="translate(${30+i*25} 700)"><rect class="pcb-contact" x="0" y="-3" width="10" height="4"/><rect class="pcb-passive" width="10" height="18" rx="2"/><rect class="pcb-contact" y="17" width="10" height="4"/></g>`).join('');
  return `<svg class="pcb-bank pcb-bank-${side?'right':'left'}" viewBox="0 0 360 900" preserveAspectRatio="xMinYMid slice" focusable="false"><g class="pcb-layout" transform="translate(0 ${side?-95:0})">${routes}<g class="pcb-pins">${pins}</g><rect class="pcb-package" x="78" y="330" width="100" height="100" rx="7"/><rect class="pcb-die" x="94" y="346" width="68" height="68" rx="3"/><path class="pcb-etch" d="M102 359h15l8 8h27M102 370h10l8 8h32M102 389h26l10 10h14"/><circle class="pcb-pin-one" cx="87" cy="339" r="2"/>${pads}${small}<path class="pcb-silkscreen" d="M68 346v-26h25M163 320h25v26M68 415v25h25M163 440h25v-25M20 690h120v40H20z"/></g></svg>`;
}

export function circuitMarkup(){
  return `<div class="circuit-traces pcb-scenery" aria-hidden="true">${bank(0)}${bank(1)}</div>`;
}
