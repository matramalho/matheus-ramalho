# N8N + IA Portfolio Site Kit — Índice

Este pacote prepara o terreno para criar, no Antigravity, um site institucional/portfólio profissional focado em:

- n8n e automações;
- low-code/no-code com lógica técnica;
- agentes de IA;
- workflows documentados;
- cases com vídeos, prints e evidências.

## Estrutura

```text
00_PROJECT_BRIEF/          briefing, escopo, regras e perfil do agente
01_RESEARCH/               pesquisa, referências e padrões de mercado
02_SKILLS/                 skills em Markdown para orientar agentes no projeto
03_CONTENT/                conteúdo base, cases e blocos de copy
04_DESIGN_SYSTEM/          guia visual, tom, componentes e tokens
05_SITE_BLUEPRINT/         arquitetura do site, wireframes e mapa de seções
06_PROMPTS_ANTIGRAVITY/    prompts prontos para iniciar/rodar o projeto
07_ASSETS_EVIDENCIAS/      local para prints, vídeos e imagens dos workflows
08_CHECKLISTS/             checklist de segurança, publicação e revisão
09_PUBLICATION/            plano de deploy, SEO, versionamento e QA
99_ARCHIVE_OBSOLETO/       material antigo ou descartado
```

## Como usar no Antigravity

1. Extraia este pacote dentro de um novo projeto, por exemplo: `Portfolio_Matheus_Automacoes_IA`.
2. Abra o projeto no Antigravity.
3. Leia `00_PROJECT_BRIEF/PROJECT_BRIEF.md`.
4. Cole o prompt em `06_PROMPTS_ANTIGRAVITY/PROMPT_00_INICIAR_PROJETO.md`.
5. Só depois autorize criação/edição de arquivos do site.

## Regras rápidas

- Não publicar JSON bruto de workflows contendo IDs reais.
- Não publicar prints com nomes, e-mails, telefones, CPF/CNPJ, IDs de pastas, IDs de planilha ou credenciais.
- Todo vídeo/print deve usar dados fictícios ou dados mascarados.
- O site deve vender competência prática, não prometer automação milagrosa.
