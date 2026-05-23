# ⚡ Quick Start - Caminho Digital Development

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git
- Conta Supabase criada
- Variáveis de ambiente configuradas (`.env.local`)

---

## 🚀 Iniciar Dev Server

### Opção 1: Usando o Claude Code (Recomendado)

```bash
# Detecta servidores configurados em .claude/launch.json
# e pergunta qual iniciar
claude code start
```

**Servidores disponíveis:**
- **Next.js Dev Server** (porta 3000)
- **Prisma Studio** (porta 5555)

### Opção 2: Manualmente

```bash
# Terminal 1: Next.js Dev Server
npm run dev

# Terminal 2: Prisma Studio (opcional)
npm run db:studio
```

### Opção 3: Vercel CLI

```bash
npm install -g vercel
vercel dev
```

---

## 📂 Estrutura do Projeto

```
caminho-digital/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout com metadata
│   ├── page.tsx             # Landing page (/)
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth routes
│   │   ├── diagnostico/     # Diagnostic API
│   │   ├── sitemap/         # Sitemap geração
│   │   └── robots/          # Robots.txt geração
│   └── (dashboard)/         # Protected routes
│       ├── layout.tsx       # Dashboard layout
│       ├── page.tsx         # Dashboard home
│       ├── diagnostico/     # Diagnostic view
│       └── planos/          # Plans page
│
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── forms/               # Form components
│   ├── layout/              # Layout components
│   └── dashboard/           # Dashboard specific components
│
├── lib/                     # Utilities & configurations
│   ├── supabase-config.ts   # Supabase client
│   ├── oauth-callbacks.ts   # OAuth configuration
│   ├── auth.ts              # Auth helpers
│   ├── db.ts                # Prisma client
│   └── utils.ts             # General utilities
│
├── services/                # Business logic
│   ├── diagnostic.ts        # Diagnostic service
│   ├── user.ts              # User service
│   └── agent.ts             # AI agent service
│
├── types/                   # TypeScript types
│   └── index.ts             # All type definitions
│
├── hooks/                   # React hooks
│   └── useAuth.ts           # Auth context hook
│
├── store/                   # State management (Zustand)
│   └── authStore.ts         # Auth store
│
├── prisma/                  # Database
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Database migrations
│
├── public/                  # Static assets
│   ├── favicon.ico          # Browser icon
│   ├── og-image.png         # Social sharing image
│   ├── apple-icon.png       # iOS icon
│   ├── robots.txt           # SEO robots file
│   └── site.webmanifest     # PWA manifest
│
├── middleware.ts            # Next.js middleware (HTTPS, redirects)
├── vercel.json              # Vercel deployment config
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies
├── .env.local               # Local environment variables
└── .env.production          # Production environment variables
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (Next.js)
npm run dev:prisma      # Abre Prisma Studio
npm run dev:all         # Inicia ambos

# Build & Produção
npm run build            # Build para produção
npm start                # Inicia servidor de produção
npm run build:analyze    # Analisa bundle size

# Database
npm run db:push         # Sincroniza schema com banco
npm run db:studio       # Abre Prisma Studio
npm run db:seed         # Popula dados de teste (se configurado)
npm run db:migrate:dev  # Cria nova migração
npm run db:migrate:deploy # Aplica migrações

# Code Quality
npm run lint            # ESLint
npm run format          # Prettier
npm run type-check      # TypeScript check

# Testing
npm test                # Jest tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

---

## 🔐 Configuração de Ambiente Local

### 1. Criar `.env.local`

```bash
# Copiar template
cp .env.production .env.local

# Ou criar manualmente com valores locais:
```

```env
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_AUTH_REDIRECT_TO=http://localhost:3000
SUPABASE_AUTH_EXTERNAL_REDIRECT_URLS=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/caminho_digital

# OAuth (Use test app IDs)
GOOGLE_CLIENT_ID=your-test-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-test-client-secret
META_CLIENT_ID=your-test-app-id
META_CLIENT_SECRET=your-test-app-secret

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Claude API
CLAUDE_API_KEY=your-api-key

# Payments (Test Keys)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
TICTO_API_KEY=test-api-key
```

### 2. Inicializar Banco de Dados

```bash
# Aplicar migrations
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```

### 3. Validar Configuração

```bash
# Check environment variables
npm run check:env

# Testar conexão Supabase
npm run test:supabase

# Testar autenticação
npm run test:auth
```

---

## 🌐 Acessar Aplicação

```
Local Development:    http://localhost:3000
Prisma Studio:       http://localhost:5555
Production:          https://turbinesuasredes.com.br
```

### Rotas Principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/diagnostico` | Diagnóstico gratuito |
| `/login` | Login (OAuth) |
| `/signup` | Cadastro |
| `/dashboard` | Dashboard (protected) |
| `/dashboard/diagnostico` | Resultados diagnóstico |
| `/dashboard/planos` | Planos de assinatura |
| `/api/auth/*` | NextAuth routes |
| `/api/sitemap` | XML sitemap gerado |
| `/api/robots` | Robots.txt gerado |

---

## 🧪 Testar Localmente

### 1. OAuth Local

Para testar Google OAuth localmente:

```bash
# Google Cloud Console
# Authorized redirect URIs deve incluir:
# http://localhost:3000/api/auth/callback/google
# http://localhost:3000/auth/callback/google
```

### 2. Testar Email

Para desenvolvimento sem envio real:
```bash
# Use .env.local
MAIL_PROVIDER=console  # Loga emails no console

# Ou use mailtrap.io para sandbox
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-user
SMTP_PASS=your-pass
```

### 3. Testar Pagamentos

Use Stripe Test Mode:
```bash
# Card números de teste
4242 4242 4242 4242  # Success
4000 0000 0000 0002  # Decline
```

---

## 🐛 Debug & Troubleshooting

### Dev Server não inicia

```bash
# Limpar cache
rm -rf .next node_modules/.cache

# Reinstalar dependências
npm ci

# Rebuild
npm run build
```

### Problemas de Supabase

```bash
# Verificar conexão
npm run test:supabase

# Ver logs em tempo real
supabase logs tail

# Reset local database
rm postgres_data/ -rf && supabase start
```

### TypeScript Errors

```bash
# Full type check
npm run type-check

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo .next
```

---

## 📚 Documentação de Referência

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) — Guia completo de deployment
- [Project Structure](./STRUCTURE.md) — Detalhes arquiteturais
- [Assets README](./public/ASSETS_README.md) — Geração de imagens
- [NextAuth Docs](https://next-auth.js.org/) — Autenticação
- [Supabase Docs](https://supabase.com/docs) — Database & Auth
- [Prisma Docs](https://www.prisma.io/docs/) — ORM

---

## 🚀 Próximos Passos

1. ✅ Configurar `.env.local`
2. ✅ Iniciar dev server (`npm run dev`)
3. ✅ Testar landing page em http://localhost:3000
4. ✅ Implementar página de diagnóstico
5. ✅ Integrar Claude API para análise
6. ✅ Construir dashboard ERP
7. ✅ Testar OAuth (Google + Meta)
8. ✅ Deploy para produção com domínio turbinesuasredes.com.br

---

**Last Updated**: 2026-05-21
**Project**: Caminho Digital ERP
**Env**: Development
