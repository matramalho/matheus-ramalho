# Case — Organizador Financeiro Inteligente

## Título público sugerido

Desenvolvimento de Organizador Financeiro Inteligente

## Status do case

Em desenvolvimento (projeto autoral ativo).

## Resumo

Projeto autoral focado na criação de uma aplicação de controle e organização financeira pessoal. A solução é desenvolvida de forma incremental, com forte foco na privacidade de dados por padrão, estruturação relacional das informações financeiras e potencial integração de automações locais seguras para importação de extratos.

## Problema operacional

- Ferramentas tradicionais de finanças exigem compartilhamento excessivo de dados sensíveis ou conexões bancárias automatizadas pouco transparentes.
- Dificuldade na importação limpa e deduplicação de extratos bancários em formato CSV/OFX de múltiplos bancos.
- Falta de customização simples para categorização de despesas e visualização de metas financeiras de curto e longo prazo.
- Falta de rastreabilidade de transações recorrentes e cálculo automatizado de provisões financeiras mensais.

## Solução planejada e em desenvolvimento

- **Organização Financeira Pessoal (Planejado):** Estruturação projetada para consolidação de entradas, saídas, investimentos e provisões de custos fixos.
- **Importação Estruturada de Extratos (Em validação):** Protótipo de lógica local para leitura, sanitização e mapeamento de campos de planilhas de extratos em CSV, visando evitar entradas manuais redundantes.
- **Estruturação de Dados Relacional (Em estudo):** Estudo de modelagem de dados que separa contas, categorias e transações para gerar relatórios estruturados.
- **Privacidade de Dados por Padrão (Premissa de Arquitetura):** O processamento e armazenamento das transações são projetados para ocorrer inteiramente de forma local ou sob bancos de dados locais estruturados, sem vazamento de dados pessoais ou financeiros para servidores terceiros.
- **Desenvolvimento Incremental:** Criação em etapas começando pelo mapeamento do banco de dados relacional e rotinas locais de higienização de CSV, com o design da interface gráfica planejado para etapas futuras.

## Como funciona (Escopo Atual)

1. **Mapeamento de Dados (Entrada):** Coleta de extratos bancários brutos exportados pelo próprio usuário em ambiente seguro.
2. **Processamento e Categorização:** Scripts locais JavaScript que validam os campos e mapeiam as datas e valores para o banco de dados.
3. **Consolidação:** Lógica relacional que agrupa despesas por categorias pré-definidas (ex: Moradia, Alimentação, Transporte) de forma automática.
4. **Relatórios (Saída):** Exibição de resumos financeiros estruturados para análise sob demanda.

## Stack

- HTML5 & CSS3 para interface
- JavaScript (Node.js/ES6) para lógica de processamento
- Estrutura de dados em formato relacional (PostgreSQL / SQLite)
- Versionamento via Git

## Regras de negócio e Segurança

- **Zero Acesso Externo a Bancos:** A aplicação não armazena credenciais, senhas ou tokens de acesso a contas bancárias. Toda entrada de dados é assistida ou importada via arquivos de extratos exportados localmente pelo usuário.
- **Segurança da Informação:** Não há qualquer dado financeiro real exposto no código público, nos mocks ou no repositório de desenvolvimento.
- **Desenvolvimento Defensivo:** Não são declarados recursos de IA ou inteligência preditiva que ainda não estejam testados e validados no core da aplicação.

## Resultados Esperados

- Centralização de finanças pessoais de forma segura, privada e independente.
- Redução relevante do esforço de digitação manual de transações por meio de importador de planilhas CSV.
- Flexibilidade na categorização e visualização de metas sem amarras comerciais de terceiros.
