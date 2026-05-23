# Estrutura do Projeto Caminho Digital

## 📁 Diretórios Principais

### `app/`
Next.js App Router - Contém todas as páginas, layouts e rotas.

```
app/
├── layout.tsx          # Root layout global
├── page.tsx            # Landing page (/)
└── globals.css         # Estilos globais
```

### `components/`
Componentes React reutilizáveis, organizados por categoria.

```
components/
├── ui/                 # Componentes Shadcn/Radix UI
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── badge.tsx
├── layout/             # Componentes de layout
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── nav.tsx
├── auth/               # Componentes de autenticação
├── dashboard/          # Componentes do dashboard
└── common/             # Componentes genéricos
```

### `lib/`
Utilitários, helpers, clients e configurações.

```
lib/
├── utils.ts            # Funções utilitárias (cn, formatters, etc)
├── db.ts               # Prisma client singleton
├── auth.ts             # Lógica de autenticação
└── supabase.ts         # Supabase client
```

### `types/`
Definições de tipos TypeScript.

```
types/
├── index.ts            # Tipos principais e interfaces
├── auth.ts             # Tipos de autenticação
├── user.ts             # Tipos de usuário
└── database.ts         # Tipos do banco de dados
```

### `prisma/`
Schema do banco de dados e seeding.

```
prisma/
├── schema.prisma       # Definição completa do schema
└── seed.ts             # Script de seed (opcional)
```

### `.claude/`
Configuração específica do Claude Code.

```
.claude/
└── launch.json         # Configuração dos dev servers
```

## 🔧 Arquivos de Configuração

| Arquivo | Propósito |
|---------|----------|
| `package.json` | Dependências do Node.js |
| `tsconfig.json` | Configuração TypeScript |
| `next.config.js` | Configuração Next.js |
| `tailwind.config.ts` | Configuração Tailwind CSS |
| `postcss.config.js` | Configuração PostCSS |
| `.env.example` | Template de variáveis de ambiente |
| `.env.local` | Variáveis de ambiente locais (gitignored) |
| `.gitignore` | Arquivos a ignorar no Git |

## 🚀 Primeiros Passos

### 1. Instalar dependências
```bash
npm install
```

### 2. Setup do banco de dados
```bash
# Criar/sync schema com banco
npx prisma db push

# Abrir Prisma Studio (visual editor)
npm run db:studio
```

### 3. Configurar ambiente
```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local com suas credenciais:
# - DATABASE_URL (PostgreSQL)
# - NEXT_PUBLIC_SUPABASE_URL
# - ANTHROPIC_API_KEY
# - Etc...
```

### 4. Rodar servidor
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📊 Padrões de Código

### Server Components (Padrão)
```typescript
// app/page.tsx
export default function Page() {
  // Server Component - executa no servidor
  return <div>Conteúdo</div>
}
```

### Client Components
```typescript
'use client'  // Ativa interatividade no cliente

import { useState } from 'react'

export default function Component() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Componentes Shadcn
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  )
}
```

### Tipos TypeScript
```typescript
import type { UserProfile } from '@/types'

function getUser(id: string): Promise<UserProfile> {
  // ...
}
```

### Utilitários
```typescript
import { cn, formatCurrency, formatDate } from '@/lib/utils'

// Merge classes Tailwind
const className = cn('px-2', isActive && 'bg-blue-500')

// Formatadores
const price = formatCurrency(99.99) // "R$ 99,99"
const date = formatDate(new Date())  // "21/05/2026"
```

## 🔌 Integrações

### Banco de Dados (Prisma)
```typescript
import { db } from '@/lib/db'

const user = await db.user.findUnique({
  where: { email: 'user@example.com' }
})
```

### Supabase
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('users')
  .select('*')
```

### Autenticação
```typescript
import { getSession } from '@/lib/auth'

const session = await getSession()
if (!session) {
  // Redirect to login
}
```

## 📦 Scripts Disponíveis

```bash
npm run dev              # Dev server (port 3000)
npm run build            # Build para produção
npm run start            # Start servidor de produção
npm run lint             # Lint com ESLint
npm run db:push          # Sync Prisma schema com DB
npm run db:studio        # Prisma Studio (visual editor)
npm run type-check       # Type checking TypeScript
```

## 🎯 Fase Atual

**Fase 1: Foundation** ✓ COMPLETA
- ✓ Setup Next.js 14
- ✓ Tailwind + Shadcn UI
- ✓ Supabase + Prisma
- ✓ Auth base
- ✓ Layout SaaS
- ✓ Dashboard básico

**Próximas:**
- Fase 2: Diagnóstico IA
- Fase 3: Sistema de Agentes
- Fase 4: Admin Dashboard

---

Para dúvidas: [Documentação técnica](./README.md)
