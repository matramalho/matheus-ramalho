import { renderIcons } from './icons.js';
import { workflowCatalog } from '../data/workflows.js';

const NODE_WIDTH = 190;
const NODE_HEIGHT = 88;
const MIN_SCALE = 0.55;
const MAX_SCALE = 1.6;
const SCALE_STEP = 0.14;

const categoryLabels = {
  entrada: 'Entrada', processamento: 'Processamento', ia: 'IA assistida',
  validacao: 'Validação', integracao: 'Integração', armazenamento: 'Armazenamento',
  fallback: 'Fallback', saida: 'Saída', erro: 'Erro'
};

export function initWorkflowCanvases(scope = document) {
  scope.querySelectorAll('[data-workflow-canvas]').forEach((mount) => {
    const workflow = workflowCatalog[mount.dataset.workflowCanvas];
    if (workflow) new WorkflowCanvas(mount, workflow).init();
  });
}

class WorkflowCanvas {
  constructor(mount, workflow) {
    this.mount = mount;
    this.workflow = workflow;
    this.state = { x: 0, y: 0, scale: 0.72, selectedId: null, mobileIndex: 0 };
    this.drag = null;
    this.lastSelectedButton = null;
  }

  init() {
    this.render();
    this.cacheElements();
    this.bindEvents();
    this.renderConnections();
    renderIcons();
    requestAnimationFrame(() => this.centerView());
  }

  render() {
    const { title, description, explainer, implementationNote, nodes } = this.workflow;
    this.mount.innerHTML = `
      <div class="workflow-canvas-heading">
        <div>
          <span class="workflow-canvas-eyebrow">Prova de conceito interativa</span>
          <h2 id="workflow-poc-title">${title}</h2>
          <p>${description}</p>
          <p class="workflow-canvas-explainer">${explainer}</p>
          <p class="workflow-canvas-implementation-note">${implementationNote}</p>
        </div>
        <button class="workflow-explore-button" type="button" aria-expanded="false" data-action="explore-mobile">
          Explorar etapas
        </button>
      </div>

      <div class="workflow-canvas-desktop">
        <div class="workflow-canvas-stage">
          <div class="workflow-canvas-toolbar" aria-label="Controles do diagrama">
            <button type="button" data-action="zoom-out" aria-label="Diminuir zoom">−</button>
            <output class="workflow-zoom-value" aria-label="Nível de zoom">72%</output>
            <button type="button" data-action="zoom-in" aria-label="Aumentar zoom">+</button>
            <button type="button" class="workflow-center-button" data-action="center" aria-label="Recentralizar visualização">Centralizar</button>
          </div>
          <div class="workflow-canvas-viewport" tabindex="0" role="region" aria-label="Diagrama interativo do workflow. Use as setas para mover, mais e menos para zoom e zero para centralizar.">
            <div class="workflow-canvas-world">
              <svg class="workflow-connections" width="${this.workflow.world.width}" height="${this.workflow.world.height}" aria-hidden="true"></svg>
              ${nodes.map((node, index) => this.nodeTemplate(node, index)).join('')}
            </div>
          </div>
          <p class="workflow-canvas-help">Arraste para navegar · use a roda ou os controles para zoom · selecione uma etapa para ler os detalhes</p>
        </div>
        <aside class="workflow-detail-panel" aria-label="Detalhes da etapa selecionada" hidden>
          <button type="button" class="workflow-panel-close" data-action="close-panel" aria-label="Fechar detalhes">×</button>
          <span class="workflow-detail-category"></span>
          <h3 class="workflow-detail-title"></h3>
          <p class="workflow-detail-description"></p>
          <div class="workflow-detail-note">
            <strong>Nota técnica</strong>
            <p></p>
          </div>
          <span class="workflow-detail-status"></span>
        </aside>
      </div>

      <div class="workflow-mobile-explorer" hidden>
        <div class="workflow-mobile-progress"><span>Etapa</span><strong data-mobile-progress>1 / ${nodes.length}</strong></div>
        <article class="workflow-mobile-card" tabindex="-1"></article>
        <div class="workflow-mobile-actions">
          <button type="button" data-action="previous-node">Etapa anterior</button>
          <button type="button" data-action="next-node">Próxima etapa</button>
        </div>
      </div>

      <details class="workflow-text-alternative">
        <summary>Ver alternativa textual estruturada</summary>
        <ol>${nodes.map((node) => `<li><strong>${node.title}</strong><span>${node.description}</span></li>`).join('')}</ol>
      </details>
    `;
  }

  nodeTemplate(node, index) {
    return `
      <button class="workflow-canvas-node" type="button" data-node-id="${node.id}" aria-pressed="false"
        aria-label="Etapa ${index + 1}: ${node.title}. Categoria ${categoryLabels[node.category]}."
        style="--node-x:${node.x}px; --node-y:${node.y}px" data-category="${node.category}">
        <span class="workflow-node-icon" data-icon="${node.icon}" aria-hidden="true"></span>
        <span class="workflow-node-copy"><strong>${node.shortTitle}</strong></span>
      </button>`;
  }

  cacheElements() {
    this.viewport = this.mount.querySelector('.workflow-canvas-viewport');
    this.world = this.mount.querySelector('.workflow-canvas-world');
    this.svg = this.mount.querySelector('.workflow-connections');
    this.panel = this.mount.querySelector('.workflow-detail-panel');
    this.zoomValue = this.mount.querySelector('.workflow-zoom-value');
    this.mobileExplorer = this.mount.querySelector('.workflow-mobile-explorer');
    this.mobileCard = this.mount.querySelector('.workflow-mobile-card');
  }

  bindEvents() {
    this.mount.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      const nodeButton = event.target.closest('[data-node-id]');
      if (nodeButton) this.selectNode(nodeButton.dataset.nodeId, nodeButton);
      if (action === 'zoom-in') this.zoomBy(SCALE_STEP);
      if (action === 'zoom-out') this.zoomBy(-SCALE_STEP);
      if (action === 'center') this.centerView();
      if (action === 'close-panel') this.closePanel();
      if (action === 'explore-mobile') this.toggleMobileExplorer(event.target.closest('button'));
      if (action === 'previous-node') this.moveMobile(-1);
      if (action === 'next-node') this.moveMobile(1);
    });

    this.mount.addEventListener('focusin', (event) => {
      const nodeButton = event.target.closest('[data-node-id]');
      if (nodeButton) this.selectNode(nodeButton.dataset.nodeId, nodeButton);
    });

    this.viewport.addEventListener('pointerdown', (event) => this.startPan(event));
    this.viewport.addEventListener('pointermove', (event) => this.movePan(event));
    this.viewport.addEventListener('pointerup', (event) => this.endPan(event));
    this.viewport.addEventListener('pointercancel', (event) => this.endPan(event));
    this.viewport.addEventListener('wheel', (event) => this.handleWheel(event), { passive: false });
    this.viewport.addEventListener('keydown', (event) => this.handleViewportKeyboard(event));
    this.mount.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.panel.hidden) this.closePanel();
    });

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        if (!this.drag && !this.state.selectedId) this.centerView();
      });
      this.resizeObserver.observe(this.viewport);
    }
  }

  renderConnections() {
    const nodeMap = new Map(this.workflow.nodes.map((node) => [node.id, node]));
    const markerId = `workflow-arrow-${this.workflow.id}`;
    const paths = this.workflow.connections.map((connection) => {
      const source = nodeMap.get(connection.source);
      const target = nodeMap.get(connection.target);
      const sx = source.x + NODE_WIDTH / 2;
      const sy = source.y + NODE_HEIGHT / 2;
      const tx = target.x + NODE_WIDTH / 2;
      const ty = target.y + NODE_HEIGHT / 2;
      const bend = Math.max(70, Math.abs(tx - sx) * 0.45);
      const direction = tx >= sx ? 1 : -1;
      const d = `M ${sx} ${sy} C ${sx + bend * direction} ${sy}, ${tx - bend * direction} ${ty}, ${tx} ${ty}`;
      return `<g class="workflow-connection" data-type="${connection.type}"><path d="${d}" marker-end="url(#${markerId})"></path></g>`;
    }).join('');
    this.svg.innerHTML = `<defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>${paths}`;
  }

  applyTransform() {
    this.world.style.transform = `translate3d(${this.state.x}px, ${this.state.y}px, 0) scale(${this.state.scale})`;
    this.zoomValue.value = `${Math.round(this.state.scale * 100)}%`;
    this.zoomValue.textContent = this.zoomValue.value;
  }

  centerView() {
    const width = this.viewport.clientWidth;
    const height = this.viewport.clientHeight;
    const fit = Math.min((width - 48) / this.workflow.world.width, (height - 48) / this.workflow.world.height);
    this.state.scale = Math.min(1, Math.max(MIN_SCALE, fit));
    this.state.x = (width - this.workflow.world.width * this.state.scale) / 2;
    this.state.y = (height - this.workflow.world.height * this.state.scale) / 2;
    this.applyTransform();
  }

  zoomBy(delta, origin = null) {
    const previous = this.state.scale;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, previous + delta));
    if (next === previous) return;
    const rect = this.viewport.getBoundingClientRect();
    const point = origin || { x: rect.width / 2, y: rect.height / 2 };
    const worldX = (point.x - this.state.x) / previous;
    const worldY = (point.y - this.state.y) / previous;
    this.state.x = point.x - worldX * next;
    this.state.y = point.y - worldY * next;
    this.state.scale = next;
    this.applyTransform();
  }

  startPan(event) {
    if (event.target.closest('button')) return;
    this.drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: this.state.x, y: this.state.y };
    this.viewport.setPointerCapture(event.pointerId);
    this.viewport.classList.add('is-panning');
  }

  movePan(event) {
    if (!this.drag || this.drag.id !== event.pointerId) return;
    this.state.x = this.drag.x + event.clientX - this.drag.startX;
    this.state.y = this.drag.y + event.clientY - this.drag.startY;
    this.applyTransform();
  }

  endPan(event) {
    if (!this.drag || this.drag.id !== event.pointerId) return;
    this.drag = null;
    this.viewport.classList.remove('is-panning');
  }

  handleWheel(event) {
    event.preventDefault();
    const rect = this.viewport.getBoundingClientRect();
    this.zoomBy(event.deltaY > 0 ? -SCALE_STEP : SCALE_STEP, { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  handleViewportKeyboard(event) {
    const panStep = 42;
    if (event.key === 'ArrowLeft') this.state.x += panStep;
    else if (event.key === 'ArrowRight') this.state.x -= panStep;
    else if (event.key === 'ArrowUp') this.state.y += panStep;
    else if (event.key === 'ArrowDown') this.state.y -= panStep;
    else if (event.key === '+' || event.key === '=') return this.zoomBy(SCALE_STEP);
    else if (event.key === '-') return this.zoomBy(-SCALE_STEP);
    else if (event.key === '0') return this.centerView();
    else return;
    event.preventDefault();
    this.applyTransform();
  }

  selectNode(id, button) {
    const node = this.workflow.nodes.find((item) => item.id === id);
    if (!node) return;
    this.state.selectedId = id;
    this.lastSelectedButton = button;
    this.mount.querySelectorAll('[data-node-id]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.nodeId === id)));
    this.panel.querySelector('.workflow-detail-category').textContent = categoryLabels[node.category];
    this.panel.querySelector('.workflow-detail-title').textContent = node.title;
    this.panel.querySelector('.workflow-detail-description').textContent = node.description;
    this.panel.querySelector('.workflow-detail-note p').textContent = node.technicalNote;
    this.panel.querySelector('.workflow-detail-status').textContent = `Estado: ${node.status}`;
    this.panel.hidden = false;
    this.mount.querySelector('.workflow-canvas-desktop').classList.add('has-selection');
  }

  closePanel() {
    this.panel.hidden = true;
    this.mount.querySelector('.workflow-canvas-desktop').classList.remove('has-selection');
    this.mount.querySelectorAll('[data-node-id]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
    this.state.selectedId = null;
    this.lastSelectedButton?.focus();
  }

  toggleMobileExplorer(button) {
    const willOpen = this.mobileExplorer.hidden;
    this.mobileExplorer.hidden = !willOpen;
    button.setAttribute('aria-expanded', String(willOpen));
    button.textContent = willOpen ? 'Fechar etapas' : 'Explorar etapas';
    if (willOpen) {
      this.renderMobileNode();
      this.mobileCard.focus();
    }
  }

  moveMobile(direction) {
    const length = this.workflow.nodes.length;
    this.state.mobileIndex = (this.state.mobileIndex + direction + length) % length;
    this.renderMobileNode();
    this.mobileCard.focus();
  }

  renderMobileNode() {
    const node = this.workflow.nodes[this.state.mobileIndex];
    this.mount.querySelector('[data-mobile-progress]').textContent = `${this.state.mobileIndex + 1} / ${this.workflow.nodes.length}`;
    this.mobileCard.innerHTML = `<span>${categoryLabels[node.category]} · ${node.status}</span><h3>${node.title}</h3><p>${node.description}</p><div><strong>Nota técnica</strong><p>${node.technicalNote}</p></div>`;
  }
}

initWorkflowCanvases();
