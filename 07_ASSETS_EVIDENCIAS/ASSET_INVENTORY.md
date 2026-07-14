# Inventário de Assets e Evidências Visuais

Este inventário controla a conformidade e auditoria visual de todos os arquivos de mídia (imagens, vídeos e thumbnails) utilizados nas demonstrações públicas dos estudos de caso do portfólio.

---

## 1. Controle de Assets — Case 1: Extração de Apólices (automacao-propostas)

| Nome do Asset | Tipo | Origem | Status | Riscos Sensíveis Verificados | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `workflow_main.png` | Screenshot | n8n Canvas | **Pendente** | IDs de nós, nomes de credenciais, chaves de API. | Exibir o canvas n8n completo do fluxo sanitizado. |
| `sheets_base.png` | Screenshot | Google Sheets | **Pendente** | E-mails de login, IDs da barra de endereço, nomes de clientes. | Exibir linhas fictícias preenchidas (ex: Carlos Drummond). |
| `demostracao.mp4` | Vídeo | Gravação | **Pendente** | Abas do navegador, bookmarks, notificações do sistema. | Vídeo curto (30s) demonstrando o fluxo executado em tempo real. |
| `thumbnail.png` | Thumbnail | Design | **Pendente** | Identidade visual. | Arte em bento grid para a home do portfólio. |

---

## 2. Controle de Assets — Case 2: Lembretes de Renovação (renovacao-lembretes-calendario)

| Nome do Asset | Tipo | Origem | Status | Riscos Sensíveis Verificados | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `workflow_main.png` | Screenshot | n8n Canvas | **Pendente** | IDs de conexões, emails da corretora. | Mapeamento completo dos nós lógicos e waits. |
| `tasks_calendar.png` | Screenshot | Calendar/Tasks | **Pendente** | Contas e emails de login, barra de tarefas do Windows. | Visualização das tarefas mockadas criadas de exemplo. |
| `demostracao.mp4` | Vídeo | Gravação | **Pendente** | Notificações do Windows, bookmarks do Chrome. | Vídeo rápido (45s) da planilha disparando tarefas e calendário. |
| `thumbnail.png` | Thumbnail | Design | **Pendente** | Identidade visual. | Thumbnail representativa do fluxo de agenda/tarefas. |

---

## 3. Fluxo de Triagem de Mídia (3 Estágios)

A inserção de qualquer asset de mídia deve obedecer rigorosamente a este fluxo de triagem:

1. **Entrada de Mídia Bruta**: Os arquivos de captura originais entram primeiro no diretório de triagem temporário:
   - `07_ASSETS_EVIDENCIAS/_PENDENTE_REVISAO/`
2. **Revisão e Higienização**: É executado o [CHECKLIST_SANITIZACAO_MIDIA.md](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/08_CHECKLISTS/CHECKLIST_SANITIZACAO_MIDIA.md). Caso todos os itens de segurança passem, o arquivo é copiado para a pasta de mídias aprovadas:
   - `07_ASSETS_EVIDENCIAS/_APROVADO_PUBLICACAO/`
3. **Publicação Local**: Apenas os arquivos contidos em `_APROVADO_PUBLICACAO` podem ser copiados para a pasta pública de distribuição do site para o build final:
   - `public/assets/cases/`

> [!WARNING]  
> **NÃO COPIE OU IMPORTE** arquivos diretamente para `public/assets/` sem passar pelas etapas `_PENDENTE_REVISAO` e `_APROVADO_PUBLICACAO` e receber a validação técnica correspondente.

