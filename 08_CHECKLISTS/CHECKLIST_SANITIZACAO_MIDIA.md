# Checklist de Sanitização de Mídia (LGPD & Segurança)

Este checklist deve ser executado obrigatoriamente para **CADA print de tela, imagem de apoio ou vídeo demonstrativo** antes de movê-los para os diretórios públicos do portfólio.

---

## 1. Verificação de Dados Pessoais e Fictícios
- [ ] **Nomes**: Não expor nomes de clientes reais, familiares ou funcionários. Usar nomes mockados (ex: "Carlos Drummond", "Corretora Teste").
- [ ] **Documentos**: Nenhum CPF, CNPJ, RG ou CNH real deve estar visível.
- [ ] **Contato**: Ocultar telefones, celulares, endereços residenciais e e-mails reais.
- [ ] **Dados de Veículo**: Ocultar placas reais, números de chassi ou RENAVAM em simulações de seguros.
- [ ] **Números de Apólices**: Qualquer contrato exibido deve conter números de apólice de exemplo gerados aleatoriamente.

## 2. Sanitização de Plataformas e Workflows
- [ ] **IDs de Recursos Google**:
  - Ocultar ou cortar barras de endereço contendo IDs de planilhas (`/d/planilha-id/edit`), pastas do Drive (`/folders/pasta-id`) ou calendários.
- [ ] **Credenciais n8n**:
  - Garantir que nomes de credenciais reais (ex: "OpenAI Matheus Particular") não fiquem visíveis no painel de edição do nó do n8n.
- [ ] **Logs de Execução**:
  - Revisar payloads nos nós do n8n. Certifique-se de que a aba "JSON" ou "Table" de entrada/saída não contenha nenhum dado real.

## 3. Higiene do Ambiente de Captura (Navegador/Desktop)
- [ ] **Barra de URL**: Preferencialmente, recortar a barra de URLs do navegador para evitar exposição de rotas privadas e IPs locais.
- [ ] **Contas Logadas**: Ocultar fotos de perfil, e-mails de login ou nomes de conta do Google no canto superior direito das páginas.
- [ ] **Navegação Limpa**:
  - Fechar abas pessoais (redes sociais, e-mails pessoais, WhatsApp Web).
  - Ocultar a barra de favoritos/bookmarks do navegador.
  - Desativar notificações de sistema (pop-ups de mensagens, notificações de e-mail).
- [ ] **Sistema Operacional**: Recortar a barra de tarefas do Windows/macOS e a área de relógio/ícones de sistema em capturas de tela cheia.

---

## 4. Critério de Aprovação

Para que uma mídia seja transferida de `_PENDENTE_REVISAO` para `_APROVADO_PUBLICACAO`, ela deve obrigatoriamente satisfazer todos os critérios abaixo:

- **Sem dados reais visíveis**: Nenhuma informação real de clientes, parceiros ou da sua própria operação de produção deve aparecer no asset.
- **Sem credenciais expostas**: Nenhum token, chave de API, segredo ou nome de credencial real deve estar visível no canvas ou nas configurações de nós.
- **Sem IDs privados**: Nenhum ID privado de planilhas, pastas ou agendas nas URLs ou campos de texto.
- **Sem e-mails pessoais**: Nenhum e-mail de uso pessoal ou corporativo real exposto em capturas de tela ou logs.
- **Sem barra de favoritos pessoal**: A barra de favoritos deve estar desativada durante capturas do navegador.
- **Sem abas pessoais**: Nenhuma aba adicional aberta em navegadores.
- **Sem URLs sensíveis**: Nenhuma URL com caminhos de administração privada exposta.
- **Sem payloads sensíveis em logs**: Históricos de execução do n8n devem ter o conteúdo de payloads reais oculto ou apagado.
- **Sem nomes reais de clientes**: Somente dados mockados e fictícios.
- **Sem CPFs, CNPJs, placas, telefones, endereços ou apólices reais**: Bloqueio total a dados reais de negócio ou de trânsito.
- **Dados fictícios claramente identificados**: O uso de dados sintéticos de exemplo deve ser indicado no portfólio.

---

## 5. Assinatura de Validação

Para cada asset publicado, registre a conformidade no arquivo [ASSET_INVENTORY.md](file:///C:/Users/Matheus/Documents/antigravity/portfolio_site_antigravity_kit/07_ASSETS_EVIDENCIAS/ASSET_INVENTORY.md). Em caso de qualquer item marcado como **não sanitizado**, o deploy do arquivo de mídia correspondente estará **rejeitado**.

