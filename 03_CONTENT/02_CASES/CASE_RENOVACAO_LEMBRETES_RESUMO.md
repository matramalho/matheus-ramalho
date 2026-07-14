# Case Base — Renovação de Apólices com Tasks e Calendar

## Título público sugerido

Automação de Lembretes de Renovação com n8n, Google Tasks e Calendar

## Resumo

Workflow que lê uma planilha de apólices, identifica contratos ativos próximos do vencimento, cria/valida tarefas operacionais e eventos no calendário, e grava o status de lembrete na planilha.

## Problema

- Renovações podem ser esquecidas.
- Criar lembretes manualmente gera retrabalho.
- É difícil saber quais apólices já possuem tarefa/evento.
- IDs de lembrete precisam ser rastreados.

## Solução

- Execução diária às 08:00.
- Leitura da planilha de controle.
- Cálculo de dias para vencer.
- Filtro de apólices elegíveis.
- Validação/criação de Google Task.
- Validação/criação de Google Calendar Event.
- Atualização de status no Google Sheets.

## Stack

- n8n
- Google Sheets
- Google Tasks
- Google Calendar
- JavaScript em Code Nodes
- Controle de rate limit com Wait Nodes

## Observação para publicação

Não publicar IDs reais de planilha, calendário, task list ou credenciais.
