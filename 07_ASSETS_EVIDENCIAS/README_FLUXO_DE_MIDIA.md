# Manual do Fluxo de Mídia e Evidências

Este guia explica como preparar e aprovar arquivos de mídia (imagens e vídeos) para uso no seu portfólio, garantindo conformidade com a LGPD e prevenindo vazamentos de segurança.

---

## 1. Onde Colocar Mídia Bruta

Qualquer print ou gravação de tela inicial que você realizar deve ser salvo nos diretórios de triagem temporários correspondentes a cada estudo de caso:
- **Case 1 (Propostas com IA)**:  
  [07_ASSETS_EVIDENCIAS/_PENDENTE_REVISAO/automacao-propostas/](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/_PENDENTE_REVISAO/automacao-propostas/)
- **Case 2 (Tarefas e Calendário)**:  
  [07_ASSETS_EVIDENCIAS/_PENDENTE_REVISAO/renovacao-lembretes-calendario/](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/_PENDENTE_REVISAO/renovacao-lembretes-calendario/)

---

## 2. Como Revisar

Para cada arquivo adicionado em `_PENDENTE_REVISAO`, abra e confira todos os itens do guia de conformidade em [CHECKLIST_SANITIZACAO_MIDIA.md](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/08_CHECKLISTS/CHECKLIST_SANITIZACAO_MIDIA.md).

Certifique-se de aplicar desfoque (blur), recortar ou redimensionar os prints para remover:
- Fotos e contas Google logadas no canto do navegador.
- Favoritos/bookmarks ou abas pessoais.
- IDs reais de planilhas ou pastas na barra de URLs.

---

## 3. Quando Aprovar e Onde Copiar

Se o arquivo passar em todos os critérios de conformidade listados na seção **Critério de Aprovação**:
1. Marque o status do asset correspondente como `Aprovado` no inventário geral [ASSET_INVENTORY.md](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/ASSET_INVENTORY.md).
2. Mova o arquivo higienizado para o diretório de mídias liberadas:
   - **Case 1**:  
     [07_ASSETS_EVIDENCIAS/_APROVADO_PUBLICACAO/automacao-propostas/](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/_APROVADO_PUBLICACAO/automacao-propostas/)
   - **Case 2**:  
     [07_ASSETS_EVIDENCIAS/_APROVADO_PUBLICACAO/renovacao-lembretes-calendario/](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/_APROVADO_PUBLICACAO/renovacao-lembretes-calendario/)

---

## 4. Quando Inserir no Site (Deploy)

Apenas arquivos que estejam salvos em `_APROVADO_PUBLICACAO` podem ser copiados para a pasta pública de assets do portfólio para compilação final:
- **Case 1**:  
  `public/assets/cases/automacao-propostas/`
- **Case 2**:  
  `public/assets/cases/renovacao-lembretes-calendario/`

Depois de copiados para a pasta pública, você poderá editar as tags HTML comentadas nos cases (como `<!-- Substituir pelo asset real: <img src="..." -->`) para renderizar os arquivos reais no site de forma segura.
