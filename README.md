# OrientaCar

**Inteligência a favor do produtor rural.**

> Solução desenvolvida para o **haCARthon 2026** — Desafio 1: Simplificar o CAR para o usuário.

---

## O Problema

O Cadastro Ambiental Rural (CAR) é obrigatório para acesso a crédito rural, seguro agrícola e programas de pagamento por serviços ambientais. Mas o sistema oficial (SICAR) foi feito para técnicos, não para produtores.

O resultado: o pequeno e médio produtor rural não consegue completar o cadastro sozinho.

- Linguagem jurídica e técnica incompreensível
- Mapeamento da propriedade exige coordenadas geográficas sem orientação
- Quando erra, recebe notificações que não entende — e ignora
- O ciclo de tentativa e erro pode durar meses

**Sem CAR válido, o produtor perde acesso a crédito, seguro e benefícios ambientais.**

---

## A Solução

O **OrientaCar** é um aplicativo mobile que funciona como um guia pessoal de regularização ambiental. Ele conduz o produtor por todas as etapas do CAR de forma simples, visual e sem jargão técnico.

> O produtor não precisa mais entender o CAR para conseguir fazê-lo. O app entende por ele.

---

## Protótipo Funcional

O protótipo completo foi desenvolvido em **48 horas** durante o haCARthon. Todas as telas abaixo estão implementadas e navegáveis.

### Fluxo do Produtor

| Tela | Descrição |
|---|---|
| **Login** | Autenticação por CPF com formatação automática e máscara |
| **Início** | Dashboard com carrossel de notícias do CAR, acesso rápido e alertas de rascunhos |
| **Checklist Pré-CAR** | Guia de documentos necessários antes de começar — cada item explica como obter, custo e onde buscar |
| **Formulário CAR (7 etapas)** | Wizard passo a passo com barra de progresso e salvamento automático |
| **Meus CARs** | Lista de rascunhos e cadastros enviados com status em tempo real |
| **Detalhes do CAR** | Protocolo, situação, pendências e botão direto para resolver com o Chat IA |
| **Chat IA** | Assistente contextual com sugestões de perguntas e respostas sobre o CAR |
| **Perfil** | Dados do usuário, configurações e logout |

### As 7 Etapas do Cadastro Guiado

1. **Identificação** — Busca de proprietários por CPF com confirmação de dados mascarados
2. **Imóvel** — Vinculação com SIGEF/SNCR ou cadastro manual; dados de localização e acesso
3. **Documentação** — Upload e gestão de documentos; integração com dados pré-preenchidos do INCRA
4. **Representante** — Opcional; busca e vinculação de representante legal
5. **Geo** — Mapa interativo com desenho do perímetro da propriedade, cálculo de área em hectares, marcação da sede e camadas de sobreposição (Terras Indígenas, Unidades de Conservação, Áreas Embargadas)
6. **Alertas** — Validação automática antes do envio: avisos amarelos (revisáveis) e bloqueios vermelhos com explicação em linguagem simples
7. **Resumo** — Revisão completa de todos os dados antes de enviar ao órgão ambiental

### Chat IA Contextual

O assistente está disponível em qualquer tela e, quando acionado a partir de uma pendência, **já recebe o contexto automaticamente** — o produtor não precisa explicar o problema.

Perguntas pré-configuradas no protótipo:
- "Quais são minhas pendências?"
- "Como corrigir documentação inválida?"
- "O que é divergência de área?"
- "Como enviar um shapefile?"

---

## Para Quem

| Usuário | Benefício |
|---|---|
| **Produtor rural** | Faz o CAR sem pagar técnico, entende o que está errado e sabe exatamente o que corrigir |
| **Analista ambiental (OEMA)** | Recebe cadastros com menos erros, gasta menos tempo em correções repetidas |

Foco principal: **pequeno e médio produtor rural**, especialmente quem tem pouca familiaridade com tecnologia e vive em áreas com internet limitada.

---

## Diferencial

| Como é hoje | Com o OrientaCar |
|---|---|
| Produtor acessa o SICAR sem orientação | App guia passo a passo com linguagem simples |
| Envia o cadastro e aguarda análise (semanas) | Sistema valida antes do envio e indica o que será reprovado |
| Recebe notificação técnica que não entende | Erros traduzidos em instruções práticas de correção |
| Precisa explicar o problema ao atendente | Chat IA já recebe o contexto da pendência automaticamente |
| Perde o rascunho se sair do sistema | Salvamento automático no dispositivo a cada etapa |

---

## Stack Tecnológica

```
Frontend    React 19 + TanStack Router + TanStack Start
Estilo      Tailwind CSS 4 + Radix UI (shadcn/ui)
Formulários React Hook Form + Zod
Mapas       Canvas interativo com cálculo de área (turf.js ready)
Backend     Nitro (Cloudflare Workers target)
Build       Vite 8 + TypeScript 5 + Bun
```

Bases de dados públicas previstas na integração: SICAR, MapBiomas, PRODES, Gov.br, SIGEF/INCRA.

---

## Como Rodar

```bash
cd APP
bun install
bun dev
```

O app abre em `http://localhost:3000`. Use CPF qualquer + senha qualquer para entrar (dados mock).

---

## Impacto Esperado

- **Produtor rural:** menos tempo para regularizar, sem custo com técnico, acesso a crédito e programas ambientais
- **Órgãos ambientais:** menos ciclos de retificação, analistas com mais tempo para casos complexos
- **CAR nacional:** cadastros com mais qualidade, base de dados mais confiável, apoio às políticas de desmatamento zero

---

## Roadmap

```
Fase 1 — 48h  [✅ Concluída no haCARthon]
  Protótipo funcional com todas as telas, dados mock e cadastro guiado completo

Fase 2 — 3 meses
  Integração real com APIs do SICAR, MapBiomas, SIGEF e Gov.br
  Testes de usabilidade com produtores rurais no Tocantins
  Expansão do banco de conhecimento do assistente de IA

Fase 3 — 3 meses
  Bot WhatsApp para alertas de prazo e orientações
  Mapeamento por GPS no perímetro da propriedade
  Painel público de impacto
  Expansão para outros estados
```

---

## Bem Público Digital

O OrientaCar foi concebido para ser compartilhado. O código é publicado com **licença MIT**.

- **Outros estados:** cada OEMA pode configurar o app com sua própria legislação sem precisar de programadores
- **Outros países:** países com cadastros ambientais similares (Colômbia, Peru, Equador) podem adaptar trocando apenas as regras de bioma e APIs
- **ONGs:** organizações de apoio a agricultores familiares podem usar o assistente de IA como canal de orientação ambiental
- **Municípios:** técnicos agrícolas municipais podem usar o app para atender produtores presencialmente

---

## Estrutura do Repositório

```
orientacar/
├── APP/                        # Código-fonte da aplicação
│   ├── src/
│   │   ├── routes/             # Páginas (login, início, car, chat, perfil)
│   │   ├── components/         # Shell mobile, Chat IA, componentes UI
│   │   └── lib/                # Utilitários, sessão, acessibilidade
│   └── package.json
├── docs/
│   └── documento de daods.md   # Formulário de ideação (haCARthon 2026)
└── README.md
```

---

## Documentação

- [Formulário de Ideação](docs/documento%20de%20daods.md) — Problema, solução, viabilidade e impacto detalhados

---

## Licença

Distribuído sob a licença **MIT**. Qualquer órgão, organização ou estado pode usar, adaptar e distribuir gratuitamente.

---

*haCARthon 2026 — Desafio 1: Simplificar o CAR para o usuário*
