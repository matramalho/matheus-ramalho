// A decorative surface edge. The same curve defines both fill and stroke.
export function transitionPaths(value) {
  const progress = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 1;
  const left = 112 - progress * 46;
  const center = 78 - progress * 40;
  const right = 104 - progress * 26;
  const edge = `M 0 ${left} C 240 ${left}, 320 ${center}, 550 ${center} S 820 ${right}, 1000 ${right}`;
  return { edge, surface: `${edge} L 1000 200 L 0 200 Z` };
}

function initSurfaceTransition() {
  const transition = document.querySelector('[data-surface-transition]');
  const fill = transition?.querySelector('[data-surface-fill]');
  const edge = transition?.querySelector('[data-surface-edge]');
  if (!transition || !fill || !edge || !window.IntersectionObserver) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let visible = false;

  const render = (progress) => {
    const paths = transitionPaths(progress);
    fill.setAttribute('d', paths.surface);
    edge.setAttribute('d', paths.edge);
  };

  const update = () => {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    const rect = transition.getBoundingClientRect();
    const start = window.innerHeight * 0.95;
    const distance = window.innerHeight * 0.65 + rect.height;
    render((start - rect.top) / distance);
  };

  const schedule = () => {
    if (visible && !reducedMotion.matches && !frame) frame = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) render(1);
    else schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  observer.observe(transition);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSurfaceTransition, { once: true });
  else initSurfaceTransition();
}
