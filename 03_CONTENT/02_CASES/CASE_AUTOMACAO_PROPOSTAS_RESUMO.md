# Case Base — Automação de Propostas com IA

## Título público sugerido

Automação de Extração de Dados de Apólices com n8n e IA

## Resumo

Workflow que recebe PDFs fictícios de apólices/propostas, extrai texto, usa IA para estruturar informações, normaliza campos, evita duplicidades e grava os dados em uma planilha de controle.

## Problema

- Dados de PDFs precisam ser digitados manualmente.
- Há risco de erro humano em CPF, placa, vigência e valores.
- Arquivos precisam ser classificados depois do processamento.
- Reprocessar documentos duplicados desperdiça tempo e API.

## Solução

- Busca arquivos no Google Drive.
- Verifica duplicidade antes de gastar IA.
- Extrai texto do PDF.
- Usa IA para estruturar campos.
- Normaliza dados com JavaScript.
- Grava resultado no Google Sheets.
- Move arquivo para Processados, Erros ou Duplicados.

## Stack

- n8n
- Google Drive
- Google Sheets
- IA para extração estruturada
- JavaScript em Code Nodes
- Dados fictícios para demonstração

## Observação para publicação

Usar apenas PDFs fictícios e prints sem dados sensíveis.
