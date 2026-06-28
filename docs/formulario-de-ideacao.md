# Formulário de Ideação — OrientaCar

> **haCARthon 2026** · Desafio 1: Simplificar o CAR para o usuário

---

## 1. Brainstorm

**Como foi o processo de escolha da ideia pela equipe?**

A equipe se reuniu para analisar o principal problema do CAR: o produtor rural não consegue completar o cadastro sozinho. Listamos as barreiras mais concretas — dificuldade em desenhar o mapa, linguagem técnica incompreensível e falta de orientação sobre documentos — e buscamos uma solução que atacasse todos esses pontos ao mesmo tempo.

**Quais ideias surgiram inicialmente?**

Três ideias foram discutidas:

- Detectar o polígono da propriedade automaticamente com inteligência artificial e imagem de satélite
- Criar um painel de controle para os analistas ambientais (OEMAs) acompanharem os cadastros
- Desenvolver um app que guiasse o produtor passo a passo pelo cadastro, com um assistente de IA para tirar dúvidas e traduzir erros em linguagem simples

**Qual ideia vocês escolheram desenvolver?**

O app de cadastro guiado com assistente de IA — o **OrientaCar**.

**Por que ela venceu as demais?**

Porque foi a única que passou no teste mais simples: *o produtor rural conseguiria usar sozinho, sem ajuda de ninguém?* A IA de satélite resolvia só o mapa. O painel do analista ignorava o produtor. O OrientaCar resolve o problema do início ao fim.

---

## 2. Problema

**Que problema vocês querem resolver?**

O produtor rural não consegue completar o Cadastro Ambiental Rural (CAR) sozinho. O processo é técnico demais, a linguagem é jurídica e quando ele comete um erro, não entende o que foi pedido para corrigir.

**Quem enfrenta esse problema?**

O pequeno e médio produtor rural brasileiro — especialmente quem tem pouca familiaridade com tecnologia, vive em áreas com internet limitada e não tem acesso a assistência técnica para ajudar no cadastro.

**O que acontece hoje que gera essa dificuldade?**

O sistema do governo (SICAR) foi feito para técnicos, não para produtores. Ele exige que o produtor desenhe o mapa da propriedade em coordenadas geográficas, identifique áreas de preservação sem orientação e preencha formulários com termos que ele não conhece. Quando erra, recebe uma notificação do órgão ambiental em linguagem jurídica que não entende — e muitas vezes simplesmente ignora.

**Por que esse problema é importante?**

O CAR é obrigatório e é pré-requisito para acesso a crédito rural, seguro agrícola e programas de pagamento por serviços ambientais. Sem CAR válido, o produtor perde acesso a esses benefícios — e o Brasil perde a rastreabilidade ambiental necessária para combater o desmatamento.

---

## 3. Solução

**Descreva a solução que vocês estão querendo criar.**

O OrientaCar é um aplicativo mobile que funciona como um guia pessoal de regularização ambiental. Ele conduz o produtor por todas as etapas do CAR de forma simples, visual e sem jargão técnico.

**Como ela funciona?**

O app tem quatro funcionalidades principais:

1. **Cadastro guiado em 5 etapas** (Identificação, Imóvel, Documentação, Representante e Geo), com modo simples de uma pergunta por vez e modo avançado para quem prefere formulário completo
2. **Análise automática antes do envio:** o sistema verifica cada etapa preenchida e indica se está aprovada, em análise ou reprovada — com o motivo em linguagem simples e instrução de correção
3. **Chat IA contextual:** assistente que tira dúvidas, explica termos técnicos e, quando acionado por uma pendência ou reprovação, já recebe o contexto automaticamente sem o produtor precisar explicar o problema
4. **Gestão de pendências:** painel com os problemas identificados, tipo do erro e botão direto para corrigir ou perguntar ao assistente

**Como ela resolve o problema apresentado?**

O produtor não precisa mais entender o CAR para conseguir fazê-lo. O app entende por ele, traduz o que é necessário em passos simples e avisa antes do envio se algo vai ser reprovado. Isso elimina o ciclo de tentativa e erro que hoje sobrecarrega os órgãos ambientais e frustra o produtor.

---

## 4. Público-Alvo

**Para quem é a solução de vocês?**

O app tem dois usuários: o produtor rural (usuário principal) e o analista ambiental dos órgãos estaduais (usuário secundário).

**Quem vai se beneficiar?**

| Usuário | Benefício |
|---|---|
| **Produtor rural** | Consegue fazer o CAR sem pagar técnico, entende o que está errado e sabe exatamente o que precisa corrigir |
| **Analista ambiental** | Recebe cadastros com menos erros, gasta menos tempo pedindo correções repetidas e pode atender o produtor pelo mesmo sistema no balcão |

**Por que vocês escolheram esse público?**

O produtor rural é quem tem mais dificuldade hoje e quem mais precisa do CAR regularizado para acessar crédito e benefícios. Resolver para ele é resolver o problema na raiz — se o cadastro entrar correto, o trabalho do analista também fica mais simples.

---

## 5. Resumo da Solução

> O OrientaCar é um assistente digital que guia produtores rurais no preenchimento e correção do Cadastro Ambiental Rural passo a passo, usando inteligência artificial e dados públicos para analisar cada etapa antes do envio e traduzir erros em instruções simples e acessíveis.

---

## 6. Próximos Passos

**Se a equipe pudesse continuar desenvolvendo esta solução após o haCARthon, quais seriam os próximos passos?**

- Integração real com as APIs públicas do SICAR, MapBiomas, PRODES e Gov.br para substituir os dados mock do protótipo
- Testes de usabilidade com produtores rurais reais em parceria com sindicatos rurais e cooperativas do Tocantins
- Expansão do banco de conhecimento do Chat IA com base na legislação do CAR, cobrindo os erros mais comuns identificados pelos analistas dos OEMAs
- Desenvolvimento do bot para WhatsApp — canal preferido do produtor rural — para envio de alertas de prazo e orientações por mensagem
- Publicação como PWA com distribuição via QR code nos órgãos ambientais estaduais e sindicatos rurais

**O que seria necessário para transformar a ideia em uma solução real?**

Seria necessário envolver:

- Especialistas em legislação ambiental e Código Florestal para validar o conteúdo do assistente de IA
- Analistas ambientais das OEMAs para mapear os erros mais frequentes e calibrar o módulo de análise pré-envio
- Produtores rurais de diferentes perfis para testes de usabilidade — especialmente pequenos agricultores com baixa familiaridade digital
- Parceiros institucionais: Serviço Florestal Brasileiro, INCRA, Ministério Público Estadual e secretarias de meio ambiente estaduais
- Convênio com o INCRA e o ONR para integração com o SNCR e os dados cartoriais dos imóveis rurais
- Equipe mínima: 1 desenvolvedor frontend, 1 desenvolvedor backend, 1 especialista em legislação ambiental e 1 designer com experiência em produtos para populações de baixa renda digital
- Investimento inicial estimado de **R$ 300 mil** para o desenvolvimento da versão de produção e os primeiros 12 meses de operação no Tocantins

---

## 7. Impacto

**Quais são os impactos e resultados esperados?**

| Esfera | Impacto |
|---|---|
| **Produtor** | Menos tempo para regularizar, sem custo com técnico, acesso a crédito rural e programas ambientais |
| **CAR** | Cadastros com menos erros, mais qualidade nas informações declaradas e base de dados mais confiável |
| **Órgãos ambientais** | Menos ciclos de retificação, analistas com mais tempo para casos complexos e comunicação mais eficiente com os produtores |

**O que mudaria para cada parte?**

O produtor deixa de ter medo do processo e passa a enxergar o CAR como acesso a oportunidades, não como burocracia. Os órgãos ambientais recebem menos cadastros com erros primários. E o CAR nacional ganha qualidade e cobertura, apoiando as políticas de desmatamento zero.

---

## 8. Diferencial

**O que torna essa solução interessante?**

O sistema analisa o cadastro antes do envio ao órgão ambiental e já indica o que vai ser reprovado — com o motivo em linguagem simples. **Nenhuma plataforma de CAR no Brasil faz isso hoje.** O produtor corrige antes de enviar, não depois de esperar semanas por uma resposta.

**Como esse problema é resolvido hoje?**

O produtor acessa diretamente o SICAR, preenche o cadastro sem orientação, envia e aguarda a análise do órgão ambiental. Se houver erro, recebe uma notificação técnica que frequentemente não entende. O processo pode levar meses em ciclos de correção.

**O que a proposta de vocês faz de diferente?**

| Diferencial | Como funciona |
|---|---|
| Análise pré-envio | Verifica cada etapa e aponta reprovações antes de enviar |
| Linguagem simples | Traduz erros e pendências em instruções de correção |
| Chat IA contextual | Já recebe o contexto da pendência automaticamente |
| Modo guiado | Uma pergunta por vez para quem tem dificuldade com formulários |
| Direcionamento | Indica documentos e plataformas corretas quando falta algum item |

---

## 9. Viabilidade

**A solução é viável nos aspectos legal, tecnológico e operacional?**

Sim, nos três aspectos.

| Aspecto | Situação |
|---|---|
| **Legal** | O app não substitui o SICAR — ele prepara o produtor para usar o sistema oficial. A operação está dentro do previsto pela Lei 12.651/2012 e o Decreto 7.830/2012. As bases de dados (SICAR, MapBiomas, PRODES, Gov.br) têm acesso público |
| **Tecnológico** | Toda a stack é baseada em tecnologias abertas e gratuitas. Um protótipo funcional foi desenvolvido em 48 horas com React, Leaflet, turf.js e integração com IA |
| **Operacional** | O app funciona como PWA no navegador do celular, sem necessidade de publicação em loja de apps. O conteúdo do assistente pode ser atualizado sem programação |

---

## 10. Implementação

**Quanto tempo seria necessário para implementar a solução?**

**6 meses** para uma versão de produção completa, em três fases:

```
Fase 1 — 48h  [✅ Concluída no haCARthon]
  Protótipo funcional com telas principais, dados mock e cadastro guiado

Fase 2 — 3 meses
  Integração real com APIs do SICAR, MapBiomas e Gov.br
  Testes com produtores rurais no Tocantins
  Ajustes de experiência

Fase 3 — 3 meses
  Bot WhatsApp
  GPS pelo perímetro da propriedade
  Painel público de impacto
  Expansão para outros estados
```

**Quais seriam as principais etapas dessa implementação?**

1. Integração com as bases de dados públicas (SICAR, MapBiomas, PRODES, Gov.br)
2. Construção do banco de conhecimento do assistente de IA com base na legislação do CAR
3. Testes de usabilidade com produtores rurais reais
4. Publicação como PWA e distribuição via QR code nos órgãos ambientais estaduais
5. Treinamento dos analistas para uso do painel de acompanhamento

---

## 11. Código Aberto

**Como essa solução poderia ser compartilhada para que outras organizações, estados ou países também pudessem utilizá-la?**

O código será publicado no GitHub com **licença MIT** — qualquer órgão ou organização pode usar, adaptar e distribuir gratuitamente.

| Quem pode usar | Como pode adaptar |
|---|---|
| **Outros estados** | Cada OEMA configura o app com sua própria legislação, prazos e links de plataformas estaduais sem precisar de programadores |
| **Outros países** | Países com cadastros ambientais similares (Colômbia, Peru, Equador) podem adaptar trocando apenas as regras de bioma e as APIs integradas |
| **Sociedade civil** | ONGs de apoio a agricultores familiares podem usar o assistente de IA como canal de orientação ambiental independente |
| **Academia** | A base de dados anonimizada de diagnósticos pode ser usada para estudar padrões de irregularidade e efetividade do CAR |
| **Municípios** | Técnicos agrícolas municipais podem usar o app para atender produtores presencialmente |

---

*OrientaCar — Inteligência a favor do produtor rural · haCARthon 2026*
