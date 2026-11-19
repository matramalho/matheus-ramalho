export const proposalAutomationWorkflow = {
  id: 'proposal-automation',
  title: 'Automação sanitizada de propostas',
  description: 'Fluxo demonstrativo para recepção, extração, validação e registro de documentos sem dados operacionais reais.',
  explainer: 'Explore a arquitetura simplificada do workflow. Selecione cada etapa para entender sua função no processamento, na validação e no controle operacional.',
  implementationNote: 'A arquitetura é apresentada de forma independente da ferramenta. A implementação original foi construída e validada no n8n.',
  world: { width: 1420, height: 820 },
  nodes: [
    {
      id: 'drive-monitor',
      title: 'Monitorar Google Drive',
      shortTitle: 'Monitorar entrada',
      category: 'entrada',
      description: 'Observa uma pasta demonstrativa e inicia o fluxo quando um novo PDF é disponibilizado.',
      technicalNote: 'O exemplo não contém IDs de pasta, credenciais ou eventos de produção.',
      x: 50, y: 110, icon: 'drive', status: 'monitorado'
    },
    {
      id: 'select-file',
      title: 'Selecionar arquivo',
      shortTitle: 'Selecionar PDF',
      category: 'processamento',
      description: 'Filtra o item recebido e mantém apenas arquivos compatíveis com as regras documentais do fluxo.',
      technicalNote: 'A seleção valida tipo, extensão e presença dos metadados mínimos esperados.',
      x: 275, y: 110, icon: 'check-square', status: 'regra aplicada'
    },
    {
      id: 'deduplicate',
      title: 'Verificar duplicidade',
      shortTitle: 'Verificar duplicidade',
      category: 'validacao',
      description: 'Consulta a base utilizando um identificador estável do arquivo antes do processamento. A etapa reduz reprocessamento e registros duplicados.',
      technicalNote: 'O identificador usado nesta demonstração é fictício e não expõe chaves operacionais.',
      x: 500, y: 110, icon: 'shield-check', status: 'validado'
    },
    {
      id: 'download-pdf',
      title: 'Baixar PDF',
      shortTitle: 'Baixar documento',
      category: 'integracao',
      description: 'Obtém o conteúdo binário do documento selecionado para as etapas locais de leitura.',
      technicalNote: 'A representação não executa download nem acessa qualquer arquivo externo.',
      x: 725, y: 110, icon: 'drive', status: 'controlado'
    },
    {
      id: 'extract-text',
      title: 'Extrair texto',
      shortTitle: 'Extrair texto',
      category: 'processamento',
      description: 'Converte o conteúdo do PDF em texto utilizável pelas etapas posteriores de estruturação.',
      technicalNote: 'Documentos sem texto suficiente seguem para tratamento de exceção.',
      x: 950, y: 110, icon: 'code', status: 'processado'
    },
    {
      id: 'prepare-context',
      title: 'Preparar contexto',
      shortTitle: 'Preparar contexto',
      category: 'processamento',
      description: 'Organiza trechos relevantes e aplica limites antes de encaminhar conteúdo ao modelo de linguagem.',
      technicalNote: 'Prompts internos completos, documentos e informações privadas não são exibidos.',
      x: 1175, y: 110, icon: 'code', status: 'sanitizado'
    },
    {
      id: 'llm-extraction',
      title: 'Extrair dados com LLM',
      shortTitle: 'Extração com LLM',
      category: 'ia',
      description: 'Transforma o conteúdo documental em uma estrutura JSON predefinida. A saída passa por normalização e validações adicionais antes da gravação.',
      technicalNote: 'O modelo auxilia a extração; regras determinísticas e supervisão continuam fazendo parte do processo.',
      x: 1175, y: 355, icon: 'n8n', status: 'assistido'
    },
    {
      id: 'normalize-js',
      title: 'Normalizar com JavaScript',
      shortTitle: 'Normalizar dados',
      category: 'validacao',
      description: 'Padroniza datas, valores e campos opcionais antes de qualquer persistência.',
      technicalNote: 'A rotina aplica um schema conhecido e marca inconsistências para revisão.',
      x: 950, y: 355, icon: 'code', status: 'validado'
    },
    {
      id: 'regex-fallback',
      title: 'Aplicar fallback por regex',
      shortTitle: 'Fallback por regex',
      category: 'fallback',
      description: 'Aplica uma regra determinística para recuperar e validar campos específicos quando a saída principal não é suficiente.',
      technicalNote: 'O fallback não substitui a validação dos campos críticos nem a revisão de exceções.',
      x: 725, y: 355, icon: 'code', status: 'determinístico'
    },
    {
      id: 'write-sheets',
      title: 'Registrar no Google Sheets',
      shortTitle: 'Registrar resultado',
      category: 'armazenamento',
      description: 'Grava somente o conjunto normalizado de campos na base demonstrativa de controle.',
      technicalNote: 'Nenhum nome ou ID real de planilha está presente nesta prova de conceito.',
      x: 500, y: 355, icon: 'sheets', status: 'rastreável'
    },
    {
      id: 'route-result',
      title: 'Rotear resultado',
      shortTitle: 'Rotear por estado',
      category: 'saida',
      description: 'Encaminha o documento para um estado final conforme o resultado das validações.',
      technicalNote: 'As três rotas deixam o estado operacional explícito e permitem tratamento posterior.',
      x: 275, y: 355, icon: 'arrow-right', status: 'classificado'
    },
    {
      id: 'processed-output',
      title: 'Processados',
      shortTitle: 'Processados',
      category: 'saida',
      description: 'Representa documentos concluídos com estrutura mínima válida e registro confirmado.',
      technicalNote: 'O estado indica conclusão técnica, não aprovação comercial automática.',
      x: 50, y: 620, icon: 'check', status: 'concluído'
    },
    {
      id: 'duplicate-output',
      title: 'Duplicados',
      shortTitle: 'Duplicados',
      category: 'fallback',
      description: 'Isola documentos já identificados para impedir novo processamento e facilitar auditoria.',
      technicalNote: 'A decisão depende da chave estável validada no início do fluxo.',
      x: 355, y: 620, icon: 'check-square', status: 'interrompido'
    },
    {
      id: 'error-output',
      title: 'Erros',
      shortTitle: 'Erros',
      category: 'erro',
      description: 'Agrupa exceções que exigem análise, correção ou nova tentativa controlada.',
      technicalNote: 'Falhas não são descartadas silenciosamente e permanecem rastreáveis.',
      x: 660, y: 620, icon: 'alert-triangle', status: 'revisão necessária'
    }
  ],
  connections: [
    { source: 'drive-monitor', target: 'select-file', type: 'standard', label: 'novo arquivo' },
    { source: 'select-file', target: 'deduplicate', type: 'standard', label: 'PDF válido' },
    { source: 'deduplicate', target: 'download-pdf', type: 'standard', label: 'inédito' },
    { source: 'deduplicate', target: 'duplicate-output', type: 'fallback', label: 'já registrado' },
    { source: 'download-pdf', target: 'extract-text', type: 'standard', label: 'binário' },
    { source: 'extract-text', target: 'prepare-context', type: 'standard', label: 'texto' },
    { source: 'prepare-context', target: 'llm-extraction', type: 'assisted', label: 'contexto limitado' },
    { source: 'llm-extraction', target: 'normalize-js', type: 'assisted', label: 'JSON estruturado' },
    { source: 'normalize-js', target: 'regex-fallback', type: 'fallback', label: 'campos insuficientes' },
    { source: 'normalize-js', target: 'write-sheets', type: 'standard', label: 'campos válidos' },
    { source: 'regex-fallback', target: 'write-sheets', type: 'standard', label: 'campos recuperados' },
    { source: 'regex-fallback', target: 'error-output', type: 'error', label: 'falha persistente' },
    { source: 'write-sheets', target: 'route-result', type: 'standard', label: 'registro confirmado' },
    { source: 'route-result', target: 'processed-output', type: 'standard', label: 'concluído' },
    { source: 'route-result', target: 'error-output', type: 'error', label: 'exceção' }
  ]
};

export const renewalReminderWorkflow = {
  id: 'renewal-reminders',
  title: 'Renovação e lembretes sanitizados',
  description: 'Fluxo demonstrativo para identificar vencimentos, controlar elegibilidade e registrar lembretes sem dados operacionais reais.',
  explainer: 'Explore a arquitetura simplificada do workflow. Selecione cada etapa para entender sua função no processamento, na validação e no controle operacional.',
  implementationNote: 'A arquitetura é apresentada de forma independente da ferramenta. A implementação original foi construída e validada no n8n.',
  world: { width: 1680, height: 940 },
  nodes: [
    { id: 'daily-schedule', title: 'Agendamento diário', shortTitle: 'Agendamento diário', category: 'entrada', description: 'Inicia uma verificação programada em uma janela diária demonstrativa.', technicalNote: 'O horário e a agenda reais não são expostos nesta representação.', x: 45, y: 90, icon: 'calendar', status: 'agendado' },
    { id: 'read-sheet', title: 'Leitura da planilha', shortTitle: 'Ler base de controle', category: 'integracao', description: 'Lê registros sanitizados necessários para avaliar vencimentos e estados operacionais.', technicalNote: 'A demonstração não acessa planilhas, IDs ou dados pessoais.', x: 275, y: 90, icon: 'sheets', status: 'controlado' },
    { id: 'calculate-days', title: 'Cálculo dos dias até o vencimento', shortTitle: 'Calcular vencimento', category: 'processamento', description: 'Calcula a diferença entre a data de referência e o vencimento informado em cada registro.', technicalNote: 'As datas apresentadas são conceituais e não correspondem a apólices reais.', x: 505, y: 90, icon: 'code', status: 'calculado' },
    { id: 'validate-policy', title: 'Validação da apólice', shortTitle: 'Validar registro', category: 'validacao', description: 'Confere campos mínimos e consistência antes de permitir qualquer ação de acompanhamento.', technicalNote: 'Registros incompletos seguem para revisão, sem criação automática de lembretes.', x: 735, y: 90, icon: 'shield-check', status: 'validado' },
    { id: 'eligible-filter', title: 'Filtro de itens elegíveis', shortTitle: 'Filtrar elegíveis', category: 'validacao', description: 'Mantém somente itens dentro da regra de prazo e das condições operacionais previstas.', technicalNote: 'Elegibilidade depende de regras explícitas e revisáveis.', x: 965, y: 90, icon: 'check-square', status: 'filtrado' },
    { id: 'exclude-finished', title: 'Exclusão de concluídos ou inelegíveis', shortTitle: 'Excluir não elegíveis', category: 'fallback', description: 'Remove do processamento os itens já concluídos ou sem condição de continuidade.', technicalNote: 'A exclusão preserva rastreabilidade do motivo e não apaga o registro de origem.', x: 1195, y: 90, icon: 'check', status: 'controlado' },
    { id: 'check-existing-ids', title: 'Verificação de IDs existentes', shortTitle: 'Verificar IDs', category: 'validacao', description: 'Consulta referências já registradas para evitar tarefas e eventos duplicados.', technicalNote: 'Os identificadores são abstratos nesta prova de conceito.', x: 1425, y: 90, icon: 'shield-check', status: 'verificado' },
    { id: 'task-sync', title: 'Criação ou validação de Google Task', shortTitle: 'Sincronizar tarefa', category: 'integracao', description: 'Cria uma tarefa ou confirma a referência previamente associada ao item elegível.', technicalNote: 'A etapa não acessa contas, listas ou tarefas reais.', x: 1425, y: 345, icon: 'check-square', status: 'rastreável' },
    { id: 'calendar-sync', title: 'Criação ou validação de evento no Google Calendar', shortTitle: 'Sincronizar evento', category: 'integracao', description: 'Cria um evento ou confirma o vínculo existente para o lembrete operacional.', technicalNote: 'Nenhum calendário compartilhado ou evento de produção é acessado.', x: 1195, y: 345, icon: 'calendar', status: 'rastreável' },
    { id: 'apply-reminders', title: 'Aplicação de lembretes', shortTitle: 'Aplicar lembretes', category: 'processamento', description: 'Define lembretes previstos pela regra de acompanhamento antes da atualização final.', technicalNote: 'A cadência real pode ser revisada por uma pessoa responsável.', x: 965, y: 345, icon: 'calendar', status: 'configurado' },
    { id: 'batch-wait', title: 'Processamento em lotes e waits', shortTitle: 'Lotes e esperas', category: 'processamento', description: 'Organiza execuções em grupos e introduz pausas controladas entre chamadas externas.', technicalNote: 'As pausas ajudam a respeitar limites de taxa e tornam o processo observável.', x: 735, y: 345, icon: 'calendar', status: 'controlado' },
    { id: 'update-ids', title: 'Atualização dos IDs', shortTitle: 'Atualizar referências', category: 'armazenamento', description: 'Registra as referências de tarefa e evento que podem ser consultadas em ciclos posteriores.', technicalNote: 'A escrita é representada de forma abstrata, sem chaves ou identificadores reais.', x: 505, y: 345, icon: 'sheets', status: 'registrado' },
    { id: 'update-status', title: 'Atualização do status', shortTitle: 'Atualizar status', category: 'armazenamento', description: 'Atualiza o estado operacional do item após as verificações e registros necessários.', technicalNote: 'O estado final permanece auditável e pode ser revisado por uma pessoa.', x: 275, y: 345, icon: 'sheets', status: 'atualizado' },
    { id: 'final-result', title: 'Resultado final', shortTitle: 'Concluído', category: 'saida', description: 'Indica que a sequência prevista foi concluída com as evidências de controle registradas.', technicalNote: 'Conclusão técnica não substitui a decisão humana sobre a renovação.', x: 45, y: 345, icon: 'check', status: 'sucesso' },
    { id: 'ineligible-item', title: 'Item inelegível', shortTitle: 'Inelegível', category: 'fallback', description: 'Representa um item que não atende à regra de prazo ou de integridade necessária para seguir.', technicalNote: 'O item fica disponível para análise, sem ações de calendário ou tarefas.', x: 950, y: 200, icon: 'alert-triangle', status: 'inelegível' },
    { id: 'existing-task', title: 'Tarefa existente', shortTitle: 'Tarefa existente', category: 'validacao', description: 'Representa a verificação de uma tarefa já associada ao item. Após a validação, o fluxo continua para o calendário.', technicalNote: 'Uma tarefa existente e válida é reutilizada; a verificação reduz duplicidade.', x: 1425, y: 640, icon: 'check-square', status: 'validada' },
    { id: 'existing-event', title: 'Evento existente', shortTitle: 'Evento existente', category: 'validacao', description: 'Representa a verificação de um evento já associado ao item. Após a validação, o fluxo continua para os lembretes.', technicalNote: 'Um evento existente e válido é reutilizado, e seus lembretes são verificados.', x: 1195, y: 640, icon: 'calendar', status: 'validado' },
    { id: 'rate-limit-wait', title: 'Pausa preventiva', shortTitle: 'Pausa preventiva', category: 'processamento', description: 'Representa uma pausa programada entre chamadas às integrações.', technicalNote: 'A pausa é preventiva e não representa uma reação automática a um erro de limite de taxa.', x: 735, y: 640, icon: 'calendar', status: 'programada' },
    { id: 'renewal-error', title: 'Erro', shortTitle: 'Erro', category: 'erro', description: 'Agrupa exceções que exigem análise, correção ou nova tentativa controlada.', technicalNote: 'Falhas permanecem visíveis e rastreáveis para tratamento humano.', x: 950, y: 600, icon: 'alert-triangle', status: 'erro' }
  ],
  connections: [
    { source: 'daily-schedule', target: 'read-sheet', type: 'standard', label: 'execução diária' },
    { source: 'read-sheet', target: 'calculate-days', type: 'standard', label: 'registros' },
    { source: 'calculate-days', target: 'validate-policy', type: 'standard', label: 'prazo calculado' },
    { source: 'validate-policy', target: 'eligible-filter', type: 'standard', label: 'registro válido' },
    { source: 'eligible-filter', target: 'exclude-finished', type: 'standard', label: 'elegível' },
    { source: 'eligible-filter', target: 'ineligible-item', type: 'fallback', label: 'inelegível' },
    { source: 'exclude-finished', target: 'check-existing-ids', type: 'standard', label: 'pendente' },
    { source: 'check-existing-ids', target: 'task-sync', type: 'standard', label: 'verificar tarefa' },
    { source: 'task-sync', target: 'existing-task', type: 'standard', label: 'tarefa existente' },
    { source: 'existing-task', target: 'calendar-sync', type: 'standard', label: 'tarefa validada' },
    { source: 'task-sync', target: 'calendar-sync', type: 'standard', label: 'tarefa confirmada' },
    { source: 'calendar-sync', target: 'existing-event', type: 'standard', label: 'evento existente' },
    { source: 'existing-event', target: 'apply-reminders', type: 'standard', label: 'evento validado' },
    { source: 'calendar-sync', target: 'apply-reminders', type: 'standard', label: 'evento confirmado' },
    { source: 'apply-reminders', target: 'batch-wait', type: 'standard', label: 'lembretes definidos' },
    { source: 'batch-wait', target: 'rate-limit-wait', type: 'standard', label: 'pausa preventiva' },
    { source: 'rate-limit-wait', target: 'update-ids', type: 'standard', label: 'continuar' },
    { source: 'update-ids', target: 'update-status', type: 'standard', label: 'IDs atualizados' },
    { source: 'update-status', target: 'final-result', type: 'standard', label: 'sucesso' },
    { source: 'validate-policy', target: 'renewal-error', type: 'error', label: 'erro de validação' },
    { source: 'calendar-sync', target: 'renewal-error', type: 'error', label: 'erro de integração' }
  ]
};

export const workflowCatalog = {
  proposalAutomation: proposalAutomationWorkflow,
  renewalReminders: renewalReminderWorkflow
};
