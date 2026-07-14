export const proposalAutomationWorkflow = {
  id: 'proposal-automation',
  title: 'Automação sanitizada de propostas',
  description: 'Fluxo demonstrativo para recepção, extração, validação e registro de documentos sem dados operacionais reais.',
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

export const workflowCatalog = {
  proposalAutomation: proposalAutomationWorkflow
};

