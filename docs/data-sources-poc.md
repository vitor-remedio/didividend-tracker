# PoC — fontes gratuitas de dados

## Objetivo

Validar fontes sem chave e sem assinatura para exibir no Monitor de Proventos:

- último preço de fechamento e sua data de referência;
- valor bruto por ação/cota;
- data COM (último dia com direito ao provento);
- data de pagamento.

A PoC não habilita cotação intradiária nem trata os dados como recomendação de investimento.

## 1. Cotações: Capital Agora

**Status: fonte candidata, documentação e termos compatíveis.**

- Endpoint: `GET https://capitalagora.com.br/api/ativo/{TICKER}`
- Sem chave, cadastro ou custo.
- Retorno documentado: `ticker`, `empresa`, `tipo`, `data`, `preco` e outros indicadores.
- `data` é a data de referência do fechamento; `preco` é o valor em reais.
- A fonte primária informada é o arquivo COTAHIST da B3.
- Limite documentado: 240 requisições por minuto por IP.
- A API recomenda uma consulta diária após o fechamento, respeitando o cabeçalho `Cache-Control`.
- Uso em produto público/comercial permitido nos termos publicados, com crédito e link para Capital Agora e indicação da fonte primária. Não espelhar a base integral.

### Como executar o teste real

Requer Node.js 18.17+ (ou versão LTS atual), sem instalar dependências:

```bash
node scripts/poc-market-data.mjs
```

O teste consulta PETR4, ITUB4, HGLG11 e MXRF11. Também é possível informar tickers:

```bash
node scripts/poc-market-data.mjs PETR4 HGLG11
```

O script valida HTTP, Content-Type, preço numérico e data ISO. Ele não grava dados no banco e não altera o dashboard.

### Critérios de aceite

- [ ] PETR4 e ITUB4 retornam cotação válida.
- [ ] HGLG11 e MXRF11 retornam cotação válida.
- [ ] A data de referência corresponde ao último pregão publicado, não à data/hora da consulta.
- [ ] O campo de preço é numérico e positivo.
- [ ] A resposta e o cabeçalho de cache são registrados para definir a estratégia de atualização.
- [ ] O site exibirá “Fechamento de DD/MM/AAAA” e crédito para Capital Agora / B3.

## 2. Proventos de ações: CVM / documentos IPE

**Status: fonte oficial disponível; automação ainda não validada.**

A CVM publica arquivos ZIP anuais do conjunto “Companhias Abertas: Documentos: Periódicos e Eventuais (IPE)”. O conjunto inclui categorias como “Aviso aos Acionistas” e “Calendário de Eventos Corporativos”, com atualização semanal. Os documentos são não estruturados; portanto, não há garantia de que todos tenham o mesmo layout ou possam ser extraídos sem revisão.

- Catálogo: https://dados.cvm.gov.br/dataset/cia_aberta-doc-ipe
- Arquivos: https://dados.cvm.gov.br/dados/cia_aberta/DOC/IPE/DADOS/
- O relatório/aviso do emissor é a fonte a priorizar para data COM, valor e pagamento.
- O tipo do evento só será preenchido quando estiver explícito no documento. Caso contrário, será classificado como “Provento não especificado”.
- Não inferir data EX a partir da data COM.
- Documento cancelado ou reapresentado precisa atualizar o evento anterior, não criar duplicidade.

## 3. Proventos de FIIs: Fundos.NET / CVM

**Status: fonte oficial de documentos identificada; extração estruturada ainda não validada.**

Avisos aos cotistas e documentos dos fundos são publicados no Fundos.NET. A PoC ainda precisa validar como consultar os documentos por fundo e extrair com segurança valor, data-base/data COM e pagamento. Regulamento do fundo não substitui o aviso específico de cada distribuição.

Portal público: https://fnet.bmfbovespa.com.br/fnet/

## 4. Fontes que não serão usadas como integração

- Dados B3: a API gratuita é limitada a uso próprio; os termos excluem redistribuição e publicação dos dados em outro produto/serviço. Não usar no Monitor público.
- B3 UP2DATA: documenta um feed estruturado de eventos corporativos, mas é um produto de dados da B3 e não foi identificado como fonte gratuita.
- Scraping em massa de páginas da B3: não adotar como estratégia.

## Decisão técnica provisória

1. Usar Capital Agora apenas para preço de fechamento, condicionado à execução bem-sucedida do script.
2. Manter a integração de proventos separada da cotação.
3. Não ativar dados de proventos em produção até a extração ser validada contra os documentos oficiais e cobrir alterações/cancelamentos.
4. Não exibir data COM, data EX, valor ou pagamento quando o documento não fornecer esses campos de forma inequívoca.
5. Não persistir os resultados desta PoC no Supabase.

## Referências consultadas

- Capital Agora — API: https://capitalagora.com.br/api
- Capital Agora — guia de integração: https://capitalagora.com.br/guias/como-usar-a-api-do-capital-agora
- Capital Agora — termos: https://capitalagora.com.br/termos
- CVM — documentos IPE: https://dados.cvm.gov.br/dataset/cia_aberta-doc-ipe
- B3 — dados disponíveis do UP2DATA: https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/up2data/dados-disponiveis/
