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
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
      const isExpanded = links.classList.contains('active');
      toggle.setAttribute('aria-expanded', isExpanded);
      toggle.innerHTML = isExpanded 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
    });
  }
}

// Logs para o terminal interativo
const terminalLogs = [
  { text: 'n8n start --workflow-id="propostas-ia-ficticio"', type: 'command' },
  { text: '[SYSTEM] Inicializando conexões seguras...', type: 'info' },
  { text: '[DRIVE] Monitorando pasta: /Entrada_Propostas_Mock', type: 'info' },
  { text: '[DRIVE] Novo arquivo detectado: "proposta_premium_ficticia.pdf"', type: 'success' },
  { text: '[NODE] Executando: Extração de Conteúdo PDF...', type: 'info' },
  { text: '[NODE] Executando: OpenAI Chat Model (Extração)...', type: 'info' },
  { text: '[DATA] Dados Extraídos (Sanitizados): \n{\n  "segurado": "Carlos Drummond",\n  "placa": "MOCK-9999",\n  "vigencia": "12/2026",\n  "valor": "R$ 3.450,00"\n}', type: 'success' },
  { text: '[NODE] Executando: Deduplicação (Validação Sheets)...', type: 'info' },
  { text: '[SHEETS] Gravando dados na Planilha de Controle...', type: 'info' },
  { text: '[SYSTEM] Arquivo movido para: /Processados_Ficticios', type: 'success' },
  { text: '[SUCCESS] Execução concluída com sucesso. Sem falhas.', type: 'status' }
];

function initMockTerminal() {
  const terminal = document.getElementById('mock-terminal');
  if (!terminal) return;

  let currentLine = 0;

  function typeLine() {
    if (currentLine >= terminalLogs.length) {
      // Reiniciar após um delay
      setTimeout(() => {
        terminal.innerHTML = '';
        currentLine = 0;
        typeLine();
      }, 5000);
      return;
    }

    const log = terminalLogs[currentLine];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';
    
    if (log.type === 'command') {
      const promptEl = document.createElement('span');
      promptEl.className = 'terminal-prompt';
      promptEl.textContent = 'matheus@n8n-studio:~$ ';
      lineEl.appendChild(promptEl);
    }

    const textEl = document.createElement('span');
    if (log.type === 'success') {
      textEl.className = 'terminal-success';
    } else if (log.type === 'status') {
      textEl.className = 'terminal-success';
      textEl.style.fontWeight = 'bold';
    } else if (log.type === 'warning') {
      textEl.className = 'terminal-warning';
    }
    
    // Tratamento de quebras de linha para formatação de JSON
    if (log.text.includes('\n')) {
      textEl.innerHTML = log.text.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;&nbsp;');
    } else {
      textEl.textContent = log.text;
    }

    lineEl.appendChild(textEl);
    terminal.appendChild(lineEl);
    
    // Rola o terminal para o fim
    terminal.scrollTop = terminal.scrollHeight;
    
    currentLine++;
    
    // Define a velocidade baseada no tipo de mensagem
    const delay = log.type === 'command' ? 1200 : 800;
    setTimeout(typeLine, delay);
  }

  // Iniciar digitação dos logs
  typeLine();
}
