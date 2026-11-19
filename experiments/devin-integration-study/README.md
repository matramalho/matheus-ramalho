# Ferramentas — componente aprovado e integrado
19/11/2026. Matheus aprovou a interpretação do estudo e autorizou integração, pedindo permanência dos cartões inferiores, expansão mais lenta, interação de cor e ícones das ferramentas conhecidas.

## Implementação vigente
- `component.js/css` geram a seção institucional; `controller.js` compartilha o mecanismo com o estudo isolado. `motion.js` mantém geometria pura e reversível.
- Trecho sticky560vh, leitura até64% do progresso, morph64–98%; passivos só começam a atenuar78–92%. Na rodada inicial desapareciam22–50%. Mobile tem21entradas em7linhas; desktop7colunas.
-21ferramentas/práticas por fontes existentes.12ícones de marca locais, provenientes de Simple Icons; arquivos/fontes/termos em brands/. Práticas abstratas mantêm símbolos próprios. Não implica domínio avançado uniforme.
- Destaques: GitHub/revisão e versão; n8n/arquitetura do workflow; Workspace/continuidade operacional. Os três painéis têm links para cases existentes, preservando theme e motion.
- Hover/foco: gradiente azul/verde e realce; cartões fora da leitura ficam fora da ordem de foco. Pausa global e reduzido integrados; reduzido exibe os3painéis em leitura estática.
- LEDs:32percursos existentes preservados, cada um com ponta e2camadas de rastro. SVG/CSS, não WebGL/vídeo. Nenhum bundle/mídia doDevin importado.

## Evidência e limites
Referência Devin: grade escalonada→três cartões→painel expandido e faixas estreitas observados noIAB na rodada inicial. Medidas/snapshots registrados no histórico da conversa. A proposta foi aprovada como interpretação própria; não prometer réplicaidêntica.
Build institucional58módulos e13testes pertinentes passaram. Desktop/mobile390 semoverflow na amostra; marcas conferidas após corrigir aspas dasURLsdataSVG; painel/teclado/pausaLED/reduzido observados. Links para3cases inspecionados; ativação porEnter abriu casepropostas preservando theme/motion. A tentativa inicial de click emlink fora do enquadramento não navegou; não confundir com ativação por mouse confirmada. Não há auditoria completa/FPS.
O primeiro CSS integrado ficou incompleto por corte de faixa antes do seletor inicial; causa identificada/corrigida na prévia antes de publicar. Conteúdo estático e fontes próprias; build/testes não medem fidelidade visual.

## Preservação e próximos trechos
Institucional/cases/fundo/partículas preservados. O estudo isolado continua em http://127.0.0.1:5180/experiments/devin-integration-study/index.html; sua versão atual deve ser recompilada pelo config isolado. A publicação institucional usa apenas o componente, não exporta a página do laboratório.
Comentários1–2:integrados/refinados.3:LEDsrefinados.4–5:workspace→galeria ainda pendente.6:partículasIgloo ainda pendente de inspeção específica/refino de volume, material e dispersão. Próxima frente:Igloo6; manter4–5 na fila. Não retomar cinema complexo/Rafael por inércia. VídeoRafael permanece pendente.