# Publicação do portfólio

Versão preparada em 19/11/2026, na branch `codex/portfolio-publicacao-2026-11-19`.

## Vercel

- Importar o repositório `matramalho/matheus-ramalho` e selecionar esta branch para a primeira publicação.
- A configuração `vercel.json` usa `npm run build:portfolio` e exporta `dist-portfolio`.
- O endereço `/` abre a composição institucional atual. `/?theme=cyberpunk` mantém o teste cromático disponível, sem mudar a paleta padrão.
- Cinco cases, seus aprofundamentos técnicos e o perfil em inglês fazem parte da saída. Pesquisas, arquivos ZIP e outros laboratórios não são exportados.
- A branch principal e sua home de origem não foram substituídas.

## Atualizações

Depois que a Vercel estiver conectada ao GitHub, commits enviados para a branch configurada disparam novos deploys. Fazer commits por rodada validada, com descrição clara, preserva histórico e permite reversão.

Antes de publicar, executar:

```sh
npm run build:portfolio
node scripts/verify-portfolio-build.mjs
node --test tests/institutional-cases.test.js tests/institutional-chapters.test.js tests/institutional-theme.test.js
```

Não incluir credenciais, `.env`, arquivos pessoais ou o acervo de pesquisa na saída pública. Manter os status reais dos projetos.

## Diferenças de empacotamento

O build cria aliases públicos `index.html`/`institucional.html`, adiciona metadados de compartilhamento e adapta links da navegação antiga dos aprofundamentos para as páginas atuais. A cópia de publicação remove o link interno “Field original” do rodapé; as versões de laboratório originais permanecem na pasta de trabalho do projeto.
