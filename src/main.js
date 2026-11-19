/* ==========================================================================
   Main Entry Script — Matheus Automações IA
   ========================================================================== */

import { renderIcons } from './components/icons.js';

// Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
  // Renderizar ícones do site
  renderIcons();
  
  // Configurar Menu Mobile
  setupMobileMenu();

  // Configurar Terminal Interativo se estiver na Home
  if (document.getElementById('mock-terminal')) {
    initMockTerminal();
  }

  // Atualizar data de copyright no footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Menu Mobile
function setupMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  
  if (toggle && links) {
    const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
    const menuLabels = isEnglish
      ? { open: 'Open navigation menu', close: 'Close navigation menu' }
      : { open: 'Abrir menu de navegação', close: 'Fechar menu de navegação' };
    const closeMenu = () => {
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', menuLabels.open);
      renderMenuIcon(toggle, false);
    };

    const toggleMenu = () => {
      links.classList.toggle('active');
      const isExpanded = links.classList.contains('active');
      toggle.setAttribute('aria-expanded', isExpanded);
      toggle.setAttribute('aria-label', isExpanded ? menuLabels.close : menuLabels.open);
      renderMenuIcon(toggle, isExpanded);
    };

    toggle.addEventListener('click', toggleMenu);
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && links.classList.contains('active')) {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  }
}

function renderMenuIcon(toggle, isExpanded) {
  toggle.innerHTML = isExpanded
    ? `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    : `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
}

// Logs para o terminal interativo
const terminalLogs = [
  { text: 'workflow start --document-processing', type: 'command' },
  { text: '[ENTRADA] Documento recebido para processamento.', type: 'info' },
  { text: '[VALIDAÇÃO] Verificando duplicidade e campos mínimos.', type: 'info' },
  { text: '[PROCESSAMENTO] Extração estruturada em andamento.', type: 'success' },
  { text: '[CONTEXTO] Conteúdo organizado para o modelo de linguagem.', type: 'info' },
  { text: '[DADOS] Estrutura JSON predefinida recebida para normalização.', type: 'success' },
  { text: '[ESTADO] Resultado registrado com tratamento de exceções.', type: 'status' }
];

function initMockTerminal() {
  const terminal = document.getElementById('mock-terminal');
  if (!terminal) return;

  let currentLine = 0;
  let timerId = null;
  let isVisible = true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    terminalLogs.forEach((log) => appendTerminalLine(terminal, log));
    return;
  }

  const schedule = (callback, delay) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      timerId = null;
      callback();
    }, delay);
  };

  function typeLine() {
    if (currentLine >= terminalLogs.length) {
      // Reiniciar após um delay
      schedule(() => {
        terminal.innerHTML = '';
        currentLine = 0;
        typeLine();
      }, 5000);
      return;
    }

    if (!isVisible) return;

    const log = terminalLogs[currentLine];
    appendTerminalLine(terminal, log);
    
    // Rola o terminal para o fim
    terminal.scrollTop = terminal.scrollHeight;
    
    currentLine++;
    
    // Define a velocidade baseada no tipo de mensagem
    const delay = log.type === 'command' ? 1200 : 800;
    schedule(typeLine, delay);
  }

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && timerId === null) typeLine();
    if (!isVisible) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }, { threshold: 0.05 });

  observer.observe(terminal);

  // Iniciar digitação dos logs
  typeLine();
}

function appendTerminalLine(terminal, log) {
  const lineEl = document.createElement('div');
  lineEl.className = 'terminal-line';

  if (log.type === 'command') {
    const promptEl = document.createElement('span');
    promptEl.className = 'terminal-prompt';
    promptEl.textContent = 'matheus@n8n-studio:~$ ';
    lineEl.appendChild(promptEl);
  }

  const textEl = document.createElement('span');
  if (log.type === 'success' || log.type === 'status') textEl.className = 'terminal-success';
  if (log.type === 'status') textEl.style.fontWeight = 'bold';
  if (log.type === 'warning') textEl.className = 'terminal-warning';
  textEl.textContent = log.text;
  textEl.style.whiteSpace = 'pre-wrap';

  lineEl.appendChild(textEl);
  terminal.appendChild(lineEl);
}
