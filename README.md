# API de Empacotamento Inteligente

Sistema de empacotamento desenvolvido como solução para o Exercício 1 do teste técnico para a vaga de Desenvolvedor Node.js Pleno na L2 Code.

## Visão Geral

A API recebe pedidos com produtos e retorna a distribuição dos itens nas caixas disponíveis.  
O algoritmo usado é **heurístico, determinístico e explicável** — adequado para um problema de empacotamento (NP-difícil) em contexto de teste prático.

### Heurística (o que exatamente fazemos)

- **Shelf 1D por caixa (sem rotação de grupo)**: escolhe-se **um eixo** da caixa para **somar** os comprimentos dos itens; nos outros dois eixos usa-se o **máximo** entre os itens.  
- **Eixo “congelado” por caixa**: ao abrir a caixa com o 1º item, definimos o eixo de soma e mantemos o mesmo eixo para os próximos itens daquela caixa.  
- **Rotação permitida apenas no teste individual** de “cabe na caixa”: ordenamos os lados do item e comparamos com os da caixa (não rotacionamos o **grupo**).  
- **Política de item grande (configurável)**: se existir item “grande” na caixa, limitamos o **nº total de itens** nessa caixa para evitar superlotação irrealista.

> Objetivo prático: **minimizar nº de caixas** com um layout consistente e verificável, não perseguir a solução ótima 3D.

## Arquitetura

**Clean Architecture** com responsabilidades bem separadas:

- **Domain**: entidades e regras puras (`Dimensions`, `Product`, `Box`, `Order`, portas/contratos).
- **Application**: casos de uso (`PackOrderUseCase`).
- **Infrastructure**: adapters/repos, controllers e injeção de dependências (NestJS).
- **Policies**: parâmetros de empacotamento via DI.

Estrutura (resumo):
```
src/
├── modules/
│   ├── packaging/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │       ├── adapters/
│   │       │   └── in-memory-packaging.repository.ts
│   │       └── policies/
│   │           ├── packing-policy.ts
│   │           └── packing-policy.factory.ts
│   └── shared/ ...
└── main.ts / app.module.ts
```

## Tecnologias

- **NestJS** (Node.js)
- **TypeScript**
- **Swagger/OpenAPI**
- **Jest**
- **Docker** (opcional)

## Pré-requisitos

- Node.js 20+
- npm ou yarn
- Docker (opcional)

## Instalação e Execução

```bash
git clone <repository-url>
cd teste-tecnico-l2-exercicio-1
npm install
cp .env.example .env
```

Execute:

```bash
# Dev (hot reload)
npm run start:dev

# Prod
npm run build
npm start
```

### Docker

```bash
docker compose up
# ou
NODE_ENV=production docker compose up --build
```

## Configuração por Ambiente (.env)

Parâmetros da política de empacotamento (via DI):

```env
PACK_BIG_H=40              # altura a partir da qual o item é "grande"
PACK_BIG_W=50              # largura a partir da qual o item é "grande"
PACK_MAX_ITEMS_WITH_BIG=2  # se houver item grande na caixa, máx. total de itens nessa caixa
```

Wire no módulo (exemplo):

```ts
// providers:
{ provide: PACKING_POLICY, inject: [ConfigService], useFactory: packingPolicyFactory },
```

Ou valor fixo (sem @nestjs/config):

```ts
{ provide: PACKING_POLICY, useValue: { bigH: 40, bigW: 50, maxWithBig: 2 } }
```

## Documentação da API

Swagger em `/docs`.

### Endpoint

**POST** `/pack`  
Processa a solicitação e retorna a distribuição de produtos em caixas.

**Exemplo de entrada** (trecho):
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        { "produto_id": "PS5", "dimensoes": { "altura": 40, "largura": 10, "comprimento": 25 } },
        { "produto_id": "Volante", "dimensoes": { "altura": 40, "largura": 30, "comprimento": 30 } }
      ]
    }
  ]
}
```

**Exemplo de resposta** (trecho):
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        { "caixa_id": "Caixa 2", "produtos": ["PS5", "Volante"] }
      ]
    }
  ]
}
```

> **Observação importante**: o enunciado fornece **exemplos** de entrada/saída.  
> Esta solução **não garante igualdade textual** com o exemplo quando houver **múltiplos arranjos válidos**; garante, porém, que:
> 1) cada item só é alocado se **couber nas três dimensões** da caixa;  
> 2) as caixas são usadas de forma **determinística** e **consistente**;  
> 3) buscamos **minimizar o nº de caixas** segundo a heurística descrita;  
> 4) ao abrir caixa, a escolha favorece a **menor caixa** possível que comporte o item inicial no eixo escolhido.

## Testes

- Rodar: `npm test`  
- Validações principais:
  - Todos os produtos do pedido aparecem **exatamente uma vez** no resultado (ou são marcados como não alocáveis).
  - Nenhum grupo de itens dentro de uma caixa viola as **restrições de dimensão**.
  - O número de caixas é **compatível** com a heurística (minimizado dentro das regras).

## Decisões de Projeto

- **Por que heurística?** Empacotamento 3D é **NP-difícil**; heurísticas permitem resultados rápidos, determinísticos e testáveis.
- **Shelf 1D + eixo congelado:** simplifica a verificação de “caber junto” e produz layouts consistentes.
- **Item grande (política configurável):** aproxima o comportamento de cenários reais, evitando “encaixes improváveis”.
- **DI para políticas:** facilita ajustar comportamento por ambiente sem tocar na implementação.

## Limitações Conhecidas

- Não otimiza arranjos 3D complexos; é uma aproximação **pragmática**.  
- Pode haver mais de um arranjo válido com o mesmo nº de caixas; a resposta pode diferir do **exemplo ilustrativo** do enunciado, mantendo as garantias acima.

## Referências

- `references/entrada.json` — payload completo de entrada (exemplo).
- `references/saida.json` — exemplo de saída **ilustrativo** do enunciado.

## Desenvolvedor

**Thiago Vasconcelos Teixeira**  
Full-Stack Developer — Imperatriz, MA, Brasil  
GitHub: https://github.com/thiagovt-dev

## Licença

Projeto desenvolvido como parte de um teste técnico e não possui licença comercial.
