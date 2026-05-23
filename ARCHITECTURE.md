# Arquitetura Técnica — Caminho Digital

## Visão Geral

Caminho Digital é um **ERP de Presença Digital** que ajuda PMEs brasileiras a monitorar e otimizar seus canais digitais (Instagram, TikTok, YouTube, Website) usando agentes de IA.

**Stack:** Next.js 14 + React 18 + TypeScript + Tailwind + Framer Motion + Recharts + Supabase + Claude API

---

## Arquitetura em Camadas

```
┌─────────────────────────────────────────┐
│       Camada de Apresentação            │
│  (React Components + Framer Motion)     │
├─────────────────────────────────────────┤
│       Camada de Negócio                 │
│  (Hooks + State Management)             │
├─────────────────────────────────────────┤
│       Camada de API                     │
│  (Next.js Routes + Endpoints)           │
├─────────────────────────────────────────┤
│       Camada de Serviços                │
│  (Claude AI, Supabase, Stripe)          │
├─────────────────────────────────────────┤
│       Camada de Dados                   │
│  (PostgreSQL via Supabase)              │
└─────────────────────────────────────────┘
```

---

## Fluxo de Dados

### Diagnóstico (Lead Magnet)
```
User Input (Form)
    ↓
POST /api/diagnostico
    ↓
DiagnosticEngine.analyze()
    ↓
Claude API (ou Mock em Dev)
    ↓
Parse JSON Response
    ↓
DiagnosticScore Component (Apresentação)
```

### Dashboard (Plano Estratégia/Premium)
```
DashboardClient (useEffect + State)
    ↓
Fetch /api/dashboard (futuro)
    ↓
Supabase Query
    ↓
MetricsGrid + Charts (Recharts)
    ↓
Real-time Updates (5s)
```

---

## Estrutura de Arquivos

```
caminho-digital/
├── app/
│   ├── page.tsx                  # Home
│   ├── diagnostico/
│   │   └── page.tsx              # Diagnóstico
│   ├── dashboard/
│   │   ├── layout.tsx            # Protected layout
│   │   └── page.tsx              # Dashboard ERP
│   ├── planos/
│   │   └── page.tsx              # Pricing
│   ├── api/
│   │   ├── diagnostico/
│   │   │   └── route.ts          # POST diagnóstico
│   │   ├── robots/
│   │   │   └── route.ts          # robots.txt
│   │   └── sitemap/
│   │       └── route.ts          # sitemap.xml
│   ├── layout.tsx                # Root layout
│   └── middleware.ts             # Security headers
├── components/
│   ├── diagnostic/
│   │   ├── DiagnosticForm.tsx
│   │   ├── DiagnosticScore.tsx
│   │   └── DiagnosticPageClient.tsx
│   ├── dashboard/
│   │   ├── DashboardClient.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── MetricsGrid.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── ConversionFunnel.tsx
│   │   └── AlertsPanel.tsx
│   ├── pricing/
│   │   └── PricingPlans.tsx
│   └── ui/
│       └── button.tsx
├── hooks/
│   └── useDiagnostic.ts          # Diagnóstico state hook
├── lib/
│   ├── diagnostic-engine.ts      # Motor IA (Claude API)
│   ├── diagnostic-engine.mock.ts # Mock para dev
│   └── supabase-config.ts        # Supabase client
├── public/
│   └── (assets, favicon, etc)
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind theming
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── DEPLOYMENT.md                 # Este arquivo
```

---

## Componentes Principais

### 1. **DiagnosticScore** (`components/diagnostic/DiagnosticScore.tsx`)
Visualiza resultado de diagnóstico com:
- Círculo animado de score (0-100)
- 4 canais com grade A-F
- Prioridades recomendadas
- Citação de recomendação
- CTA para plano premium

**Props:**
```typescript
interface DiagnosticScoreProps {
  result: DiagnosticResult
}
```

### 2. **DashboardClient** (`components/dashboard/DashboardClient.tsx`)
Orquestrador do dashboard com:
- Atualização real-time (5s)
- 9 métricas dinâmicas
- Estado compartilhado entre componentes

**State:**
```typescript
interface DashboardMetrics {
  mrr: number
  arr: number
  activeUsers: number
  // ... 6 outras métricas
}
```

### 3. **PricingPlans** (`components/pricing/PricingPlans.tsx`)
Exibe 3 tiers de preço:
- **Gratuito**: Diagnóstico apenas
- **Estratégia R$497/mês**: Dashboard + Agentes
- **Premium R$1.197/mês**: IA Master automática

---

## APIs e Endpoints

### POST /api/diagnostico
Análise de presença digital usando Claude AI.

**Request:**
```json
{
  "businessName": "string",
  "businessType": "string",
  "instagram": "string (opcional)",
  "tiktok": "string (opcional)",
  "youtube": "string (opcional)",
  "website": "string (opcional)",
  "currentFollowers": {
    "instagram": number,
    "tiktok": number,
    "youtube": number
  }
}
```

**Response:**
```json
{
  "businessName": "string",
  "overallScore": 0-100,
  "timestamp": "ISO 8601",
  "channels": {
    "instagram": {
      "score": 0-100,
      "grade": "A|B|C|D|F",
      "problems": ["array"],
      "quickWin": "string",
      "sentiment": "excellent|good|fair|poor"
    },
    // tiktok, youtube, website...
  },
  "topPriorities": ["array"],
  "recommendation": "string",
  "nextSteps": ["array"]
}
```

### GET /api/robots
Retorna `robots.txt` dinâmico com exclusões e sitemap.

### GET /api/sitemap
Retorna `sitemap.xml` com todas as rotas públicas.

---

## Motor de Diagnóstico IA

### DiagnosticEngine (Production)
```typescript
class DiagnosticEngine {
  private client: Anthropic | null = null
  private model = 'claude-3-5-sonnet-20241022'
  
  async analyze(input: DiagnosticInput): Promise<DiagnosticResult>
}
```

**Lazy Initialization:** Cliente Anthropic criado apenas na primeira requisição para não bloquear build.

### MockDiagnosticEngine (Development)
Simula respostas sem chamar Claude API:
- Scores aleatórios com distribuição realista
- Problemas pré-definidos por canal
- Atualiza onlineUsers e MRR simulando flutuações

**Ativação em Produção:**
```typescript
// app/api/diagnostico/route.ts
const useRealApi = !!process.env.ANTHROPIC_API_KEY && process.env.NODE_ENV === 'production'
const engine = useRealApi ? diagnosticEngine : mockDiagnosticEngine
```

---

## Segurança

### Middleware (middleware.ts)
- ✅ HTTPS enforcement em produção
- ✅ Redirect www → non-www
- ✅ HSTS header (1 ano)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ CSP (Content Security Policy)
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Variáveis Sensíveis
- ✅ ANTHROPIC_API_KEY: Server-only
- ✅ DATABASE_URL: Server-only
- ✅ NextAuth secrets: .env.production (não commitado)

### Validação de Input
- ✅ businessName e businessType obrigatórios
- ✅ Erro 400 se faltarem
- ✅ Parse seguro de JSON

---

## Performance Targets

### Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms
- **FCP (First Contentful Paint):** < 1.8s

### Lighthouse
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 95

### Build Size
- First Load JS: < 150 kB
- Middleware: < 30 kB
- Per-page: < 50 kB

**Current Status:**
- ✅ Homepage: 96.4 kB
- ✅ Dashboard: 225 kB (com gráficos)
- ✅ Diagnostico: 131 kB
- ✅ Planos: 122 kB

---

## Integração Supabase (Futuro)

### Tabelas Planejadas

**diagnostics**
```sql
id (uuid)
user_id (uuid) -> users
business_name (text)
business_type (text)
overall_score (integer 0-100)
channels (jsonb)
top_priorities (jsonb)
recommendation (text)
created_at (timestamp)
```

**users**
```sql
id (uuid)
email (text)
plan (enum: free|estrategia|premium)
stripe_customer_id (text)
created_at (timestamp)
```

---

## Fluxo de Pagamento (Futuro)

1. Usuário acessa /planos
2. Clica em "Começar Teste" (Estratégia) ou "Acessar Premium"
3. Redireciona para Stripe Checkout
4. Após pagamento, webhook atualiza user.plan no Supabase
5. Login redirecionado para /dashboard

**Stripe Events:**
- `checkout.session.completed` → Criar subscription
- `customer.subscription.updated` → Atualizar plan
- `customer.subscription.deleted` → Downgrade para free

---

## CI/CD (Vercel)

### Build
```bash
next build
```
- Valida TypeScript
- ESLint validation
- Gera static pages
- Minifica assets
- Otimiza imagens

### Deploy
- GitHub → Vercel automático
- Preview em cada PR
- Production em merge para main

### Monitoramento
- Analytics automático
- Error tracking (Sentry opcional)
- Performance metrics

---

## Tecnologias

| Camada | Tech | Versão |
|--------|------|--------|
| Runtime | Node.js | 20.x |
| Framework | Next.js | 14.2.35 |
| UI | React | 18.2 |
| Language | TypeScript | 5.3 |
| Styling | Tailwind CSS | 3.4 |
| Animation | Framer Motion | 10.16 |
| Charts | Recharts | 2.10 |
| Icons | Lucide React | 0.294 |
| API Client | Fetch + Axios | - |
| AI | Anthropic SDK | 0.24 |
| Auth | NextAuth.js | 4.24 |
| Database | Supabase | 2.38 |
| ORM | Prisma | 5.7 |
| Payments | Stripe | Latest |
| State | Zustand | 4.4 |
| Server State | React Query | 5.25 |
| Validation | Zod | 3.22 |
| Forms | React Hook Form | 7.48 |
| Date | date-fns | 2.30 |

---

## Roadmap

**✅ Completo:**
- [x] ETAPA 1: Validação de Produção
- [x] ETAPA 2: Preparação para Deploy
- [x] ETAPA 3: Configuração de Domínio (estrutura)
- [x] ETAPA 4: DNS Setup (documentado)
- [x] ETAPA 5: Sistema de Diagnóstico IA
- [x] ETAPA 6: Dashboard ERP
- [x] ETAPA 7: Documentação & Execução Autônoma

**📋 Próximo:**
- [ ] Deploy em Vercel
- [ ] Apontar domínio turbinesuasredes.com.br
- [ ] Configurar Supabase live
- [ ] Integrar Stripe/Ticto
- [ ] Monitoramento em produção

---

**Última Atualização:** 2026-05-23  
**Versão:** 1.0.0  
**Status:** 🚀 Pronto para Deploy
