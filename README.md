# 🚀 Caminho Digital - ERP de Presença Digital com Agentes IA

**Production Domain**: https://turbinesuasredes.com.br  
**Development**: http://localhost:3000  
**Project Status**: Phases 3-7 ✅ Complete | Ready for Domain Configuration  
**Last Updated**: 2026-05-21

---

## 📚 Documentação Rápida

| Preciso de... | Leia... | Tempo |
|---|---|---|
| Entender o status atual | [`PHASE_STATUS.md`](./PHASE_STATUS.md) | 5 min |
| Configurar domínio + deploy | [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) | 15 min |
| Começar desenvolvimento local | [`QUICKSTART.md`](./QUICKSTART.md) | 10 min |
| Gerar imagens e assets | [`public/ASSETS_README.md`](./public/ASSETS_README.md) | 5 min |

---

## ✨ Sobre Caminho Digital

Caminho Digital é uma plataforma **SaaS premium** de **ERP de Presença Digital com Agentes IA** para PMEs.

**Modelo de Negócio**:
- **Diagnóstico Gratuito** → Lead magnet → Cria conta automaticamente
- **Plano Estratégico** (R$497/mês) → ERP + agentes IA respondendo
- **Plano Premium** (R$1.197/mês) → IA Master orquestra tudo automaticamente

**Oferece**:
- ✅ Diagnóstico gratuito de presença digital (score 0-100 por canal)
- ✅ Dashboard ERP completo com agentes IA especializados
- ✅ Monitoramento de: Instagram, TikTok, YouTube, Website
- ✅ Sistema multi-tenant com billing integrado
- ✅ Painel administrativo com analytics em tempo real
- ✅ Integração com Claude API para análise inteligente

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Framework** | Next.js (App Router) | 14.0.4 |
| **Linguagem** | TypeScript | 5.0+ |
| **Styling** | Tailwind CSS | 3.4.1 |
| **UI Componentes** | Shadcn/Radix UI | Latest |
| **Database** | PostgreSQL (Supabase) | 15+ |
| **ORM** | Prisma | 5.7.1 |
| **Auth** | NextAuth.js + OAuth 2.0 | 4.24+ |
| **AI** | Claude API (Anthropic) | Latest |
| **Payments** | Stripe + Ticto | Latest |
| **Hosting** | Vercel | Latest |
| **Animações** | Framer Motion | Latest |
| **State** | Zustand | Latest |

---

## 📁 Estrutura do Projeto

```
caminho-digital/
├── app/                        # Next.js 14 App Router
│   ├── api/                   # API Routes
│   │   ├── auth/             # NextAuth routes
│   │   ├── sitemap/          # Dinâmico sitemap
│   │   └── robots/           # Dinâmico robots.txt
│   ├── (dashboard)/          # Rotas protegidas
│   ├── layout.tsx            # Layout com SEO metadata
│   ├── page.tsx              # Landing page
│   └── globals.css           # Tailwind estilos
│
├── components/               # React components
│   ├── ui/                  # Shadcn UI components
│   ├── forms/               # Form components
│   ├── layout/              # Layout components
│   └── dashboard/           # Dashboard components
│
├── lib/                     # Utilities & config
│   ├── supabase-config.ts   # Supabase client
│   ├── oauth-callbacks.ts   # OAuth config
│   ├── auth.ts              # Auth helpers
│   ├── db.ts                # Prisma singleton
│   └── utils.ts             # Utilidades
│
├── services/                # Business logic
├── types/                   # TypeScript types
├── hooks/                   # Custom React hooks
├── store/                   # Zustand stores
├── prisma/                  # Database schema
├── public/                  # Static assets
│
├── middleware.ts            # HTTPS enforcement
├── vercel.json              # Deployment config
├── .env.production          # Production vars
├── .env.local              # Local dev vars
└── package.json            # Dependencies
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase criada
- `.env.local` configurado

### Instalação & Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente local
cp .env.production .env.local
# Editar .env.local com suas credenciais

# 3. Sincronizar banco de dados
npm run db:push

# 4. Iniciar desenvolvimento
npm run dev
```

Abra **http://localhost:3000** no navegador.

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                 # Next.js dev server (porta 3000)
npm run db:studio         # Prisma Studio (porta 5555)
npm run dev:all          # Ambos em paralelo

# Build & Produção
npm run build             # Build para produção
npm start                 # Servidor de produção

# Database
npm run db:push          # Sincroniza schema
npm run db:migrate:dev   # Nova migração

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript
```

---

## 🔐 Variáveis de Ambiente

### Desenvolvimento (`.env.local`)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...

GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-secret
META_CLIENT_ID=test-app-id
META_CLIENT_SECRET=test-secret

CLAUDE_API_KEY=your-api-key
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Produção
Configure todas as variáveis no **Vercel Dashboard** (Settings → Environment Variables)

Ver [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) para lista completa.

---

## 📊 Status das Fases

| Fase | Componente | Status | Descrição |
|------|-----------|--------|-----------|
| 3-7 | Infraestrutura | ✅ Done | Config, OAuth, security, SEO |
| 1-2 | Domain Setup | ⏳ Pending | Vercel + DNS (user action) |
| 8 | Validação | ⏳ Pending | HTTPS, headers, SSL tests |
| 2 | Diagnóstico IA | 🔜 Next | Landing page, AI agent, form |
| - | Dashboard ERP | 🔜 Next | Painel, módulos, charts |

---

## 🔄 Próximas Ações (48h)

1. **[CRÍTICO]** Identificar registrador do domínio `turbinesuasredes.com.br`
2. **[IMPORTANTE]** Gerar image assets (favicon, apple-icon, og-image)
3. **[IMPORTANTE]** Configurar Supabase dashboard (URLs, OAuth)
4. **[APÓS DOMÍNIO]** Adicionar env vars no Vercel

Ver [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) para guia completo.

---

## 📞 Contato & Suporte

**Lead**: Arthur  
**WhatsApp**: https://wa.me/554195976278  
**Email**: arturislacta1@gmail.com  
**Documentação**: Veja [`PHASE_STATUS.md`](./PHASE_STATUS.md)

---

## 📚 Documentação Detalhada

- **[PHASE_STATUS.md](./PHASE_STATUS.md)** — Status atual completo, o que foi feito, o que falta
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** — Guia passo-a-passo de deployment
- **[QUICKSTART.md](./QUICKSTART.md)** — Desenvolvimento local
- **[public/ASSETS_README.md](./public/ASSETS_README.md)** — Geração de imagens

---

**Status**: Phase 3-7 ✅ Complete | Awaiting Domain Configuration  
**Última Atualização**: 2026-05-21  
**Production**: https://turbinesuasredes.com.br
