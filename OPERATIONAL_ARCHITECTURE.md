# 🏗️ OPERATIONAL ARCHITECTURE - CAMINHO DIGITAL (P2)

**Data:** 2026-05-23  
**Fase:** Arquitetura Operacional para Escalabilidade  
**Objetivo:** Preparar sistemas para operação SaaS em larga escala

---

## 1️⃣ MULTI-TENANT ARCHITECTURE

### Modelo Atual (Single Tenant)
```
URL: turbinesuasredes.com.br
├─ User ID → auth.uid()
├─ Data: users, diagnostics, subscriptions
└─ RLS: row-level security em Supabase
```

### Modelo Future (Multi-Tenant)
```
URLs possíveis:
├─ turbinesuasredes.com.br (main SaaS)
├─ client1.turbinesuasredes.com.br (white-label)
├─ client2.turbinesuasredes.com.br (white-label)
└─ api.turbinesuasredes.com.br (API partners)

Schema modifications:
├─ Add tenant_id (UUID) a todas as tabelas
├─ RLS policies: WHERE tenant_id = current_tenant_id
├─ Índices: (tenant_id, user_id) composite
└─ Partitioning by tenant_id (para 1K+ tenants)
```

### Migração Strategy

**Step 1: Preparar schema (não breaking)**
```sql
-- Add tenant_id column (nullable primeiro)
ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_user_id UUID REFERENCES users(id),
  
  -- Billing
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT,
  
  -- Branding
  logo_url TEXT,
  custom_domain TEXT,
  brand_color TEXT DEFAULT '#00A86B',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Populate existing users with default tenant
INSERT INTO tenants (name, slug, owner_user_id) 
SELECT user_id, CONCAT('tenant-', SUBSTR(user_id::text, 1, 8)), user_id 
FROM users;

UPDATE users SET tenant_id = (
  SELECT id FROM tenants WHERE owner_user_id = users.id LIMIT 1
);

-- Make tenant_id NOT NULL
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
```

**Step 2: Update RLS policies**
```sql
-- Users can only see their own tenant
CREATE POLICY "Users view own tenant"
  ON public.users FOR SELECT
  USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Diagnostics filtered by tenant
CREATE POLICY "Diagnostics within tenant"
  ON public.diagnostics FOR SELECT
  USING (
    user_id = auth.uid() AND
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())
  );
```

**Step 3: Update API layer**
```typescript
// middleware/tenant.ts
export async function getTenantFromRequest(req: NextRequest) {
  // Extract from subdomain
  const host = req.headers.get('host');
  const subdomain = host.split('.')[0];
  
  if (subdomain === 'api' || subdomain === 'www') {
    // Get from auth context
    const user = await getCurrentUser();
    return user.tenant_id;
  }
  
  // Get from custom domain or subdomain
  const tenant = await supabase
    .from('tenants')
    .select('id')
    .or(`slug.eq.${subdomain},custom_domain.eq.${host}`)
    .single();
  
  return tenant.id;
}

// Middleware application
export async function middleware(req: NextRequest) {
  const tenantId = await getTenantFromRequest(req);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', tenantId);
  
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

**Step 4: Update queries**
```typescript
// Before
const diagnostics = await supabase
  .from('diagnostics')
  .select('*')
  .eq('user_id', userId);

// After (automatic via middleware)
const diagnostics = await supabase
  .from('diagnostics')
  .select('*')
  .eq('user_id', userId)
  .eq('tenant_id', tenantId); // Added automatically
```

**Rollout timeline:** Implementar ao atingir 10+ pagantes premium (white-label request)

---

## 2️⃣ CREDIT SYSTEM PARA IA

### Modelo de Créditos

```
Free tier: 1 diagnóstico grátis/mês
Estratégico: 5 créditos/mês (1 crédito = 1 diagnóstico completo)
Premium: 25 créditos/mês (ilimitado na prática)

Preço a crédito (venda à parte):
- 10 créditos = R$49.70 (R$4.97 cada)
- 50 créditos = R$197 (R$3.94 cada)
- 200 créditos = R$593 (R$2.97 cada)
```

### Schema

```sql
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  balance INT DEFAULT 0,
  used INT DEFAULT 0,
  purchased INT DEFAULT 0,
  
  -- Subscription bundle
  subscription_monthly_bundle INT DEFAULT 0, -- Reset monthly
  
  expires_at TIMESTAMP, -- Créditos expiram em 12 meses
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  credit_id UUID NOT NULL REFERENCES credits(id),
  
  amount INT NOT NULL, -- Positive: add, Negative: spend
  type TEXT NOT NULL, -- 'purchase', 'subscription', 'refund', 'usage'
  description TEXT,
  
  diagnostic_id UUID REFERENCES diagnostics(id),
  stripe_charge_id TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Fluxo de Consumo

```typescript
// Ao submeter diagnóstico
export async function submitDiagnostic(userId: string, data: DiagnosticInput) {
  // Check credit balance
  const { data: credits } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (credits.balance < 1) {
    return { error: 'Insufficient credits', statusCode: 402 };
  }
  
  // Enqueue diagnostic
  const diagnostic = await enqueueDiagnostic(userId, data);
  
  // Deduct credit
  await supabase
    .from('credits')
    .update({ balance: credits.balance - 1, used: credits.used + 1 })
    .eq('user_id', userId);
  
  // Log transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -1,
      type: 'usage',
      diagnostic_id: diagnostic.id,
    });
  
  return diagnostic;
}
```

### Dashboard de Créditos

```typescript
// Component: CreditStatus
export function CreditStatus({ userId }: { userId: string }) {
  const { credits, nextReset } = useCredits(userId);
  const percentUsed = (credits.used / (credits.subscription_monthly_bundle + credits.purchased)) * 100;
  
  return (
    <div className="p-4 bg-white border rounded-lg">
      <h3 className="font-bold">Créditos IA</h3>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span>{credits.balance} créditos disponíveis</span>
          <span className="text-sm text-gray-500">
            Resets em {nextReset.toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>
      
      <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded">
        + Comprar Créditos
      </button>
    </div>
  );
}
```

---

## 3️⃣ RATE LIMITING

### Estratégia Multi-Layer

```
Layer 1: IP-based (DDoS prevention)
├─ 1000 requests/min por IP
├─ Implementado em Vercel middleware
└─ Response: 429 Too Many Requests

Layer 2: User-based (Resource fair use)
├─ 10 diagnósticos/min por usuário
├─ 100 API requests/min
├─ Implementado em app middleware
└─ Response: 429 com retry-after header

Layer 3: Tier-based (Subscription limits)
├─ Free: 1 diagnóstico/hora
├─ Estratégico: 10 diagnósticos/hora
├─ Premium: Unlimited (soft limit: 100/hora)
└─ Implementation: Redis counter por usuário

Layer 4: Queue-based (IA resource)
├─ Max 50 jobs simultâneos em processing
├─ Queue depth limit: 1000 jobs
├─ Quando > 500: direcionar para fila "slow" (4-8h)
└─ Alert em Discord se > 750
```

### Implementação com Redis

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// IP-based limit
export const ipLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, '60 s'),
  analytics: true,
  prefix: 'ratelimit:ip',
});

// User-based limit
export const userLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'ratelimit:user',
});

// Tier-based limit
export async function checkTierLimit(userId: string, plan: string) {
  const limits = {
    free: 1,      // 1 diagnóstico/hora
    estrategico: 10,  // 10 diagnósticos/hora
    premium: 100,  // 100 diagnósticos/hora
  };
  
  const limit = limits[plan];
  const key = `tier:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 3600); // 1 hour
  }
  
  return { allowed: current <= limit, remaining: limit - current };
}

// Middleware
export async function withRateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const user = await getCurrentUser();
  
  // Check IP limit
  const { success: ipOk } = await ipLimit.limit(ip);
  if (!ipOk) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'retry-after': '60' } }
    );
  }
  
  // Check user limit
  const { success: userOk } = await userLimit.limit(user.id);
  if (!userOk) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'retry-after': '60' } }
    );
  }
  
  // Check tier limit
  const tierCheck = await checkTierLimit(user.id, user.plan);
  if (!tierCheck.allowed) {
    return NextResponse.json(
      { error: 'Monthly limit exceeded', remaining: 0 },
      { status: 402 }
    );
  }
  
  return NextResponse.next();
}
```

---

## 4️⃣ LOGS CENTRALIZADOS

### Stack: Vercel Logs + Custom Logger + DataDog

```typescript
// lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-datadog-transport',
    options: {
      apiKey: process.env.DATADOG_API_KEY,
      ddsource: 'caminho-digital',
      ddtags: `service:api,env:${process.env.NODE_ENV}`,
    },
  },
});

export const log = {
  // Request lifecycle
  info: (msg: string, meta?: any) => logger.info(meta, msg),
  error: (msg: string, error?: Error, meta?: any) => 
    logger.error({ ...meta, error }, msg),
  warn: (msg: string, meta?: any) => logger.warn(meta, msg),
  debug: (msg: string, meta?: any) => logger.debug(meta, msg),
  
  // Business events
  diagnostic: {
    submitted: (userId: string, diagnosticId: string) =>
      logger.info({ userId, diagnosticId }, 'diagnostic.submitted'),
    completed: (userId: string, diagnosticId: string, duration: number) =>
      logger.info({ userId, diagnosticId, duration }, 'diagnostic.completed'),
    failed: (userId: string, error: string) =>
      logger.error({ userId, error }, 'diagnostic.failed'),
  },
  
  subscription: {
    created: (userId: string, plan: string, amount: number) =>
      logger.info({ userId, plan, amount }, 'subscription.created'),
    cancelled: (userId: string, reason: string) =>
      logger.info({ userId, reason }, 'subscription.cancelled'),
    failed: (userId: string, error: string) =>
      logger.error({ userId, error }, 'subscription.payment_failed'),
  },
  
  auth: {
    signin: (userId: string, provider: string) =>
      logger.info({ userId, provider }, 'auth.signin'),
    signup: (email: string, plan: string) =>
      logger.info({ email, plan }, 'auth.signup'),
    failed: (email: string, reason: string) =>
      logger.warn({ email, reason }, 'auth.failed'),
  },
};
```

### Log Aggregation Dashboard

```
DataDog Dashboards:
├─ System Health
│  ├─ API latency (p50/p95/p99)
│  ├─ Error rate by endpoint
│  ├─ Database query times
│  └─ Queue depth
│
├─ Business Metrics
│  ├─ Diagnostics submitted/completed
│  ├─ Conversions (free → paid)
│  ├─ Subscription revenue
│  └─ Churn rate
│
├─ AI Monitoring
│  ├─ IA API latency
│  ├─ Anthropic cost/day
│  ├─ Queue depth
│  └─ Error rate from IA
│
└─ Alerts
   ├─ Error rate > 5%
   ├─ Latency p99 > 5s
   ├─ Queue > 500 jobs
   └─ Costs > $100/day
```

---

## 5️⃣ OBSERVABILITY STACK

### Componentes

| Tool | Propósito | Custo | Integração |
|------|-----------|-------|-----------|
| **Sentry** | Error tracking | $29/mês | @sentry/nextjs |
| **DataDog** | APM + Logs | $15/mês | datadog/browser-rum |
| **Vercel Analytics** | Web vitals | Free | @vercel/analytics |
| **Upstash Console** | Queue monitoring | Free | dashboard.upstash.com |
| **Supabase Dashboard** | Database metrics | Free | supabase.com |

### Implementação Sentry

```typescript
// app/layout.tsx ou _app.tsx
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Custom Metrics

```typescript
// lib/metrics.ts
export async function recordMetric(name: string, value: number, tags?: Record<string, string>) {
  // Send to DataDog via API
  await fetch('https://api.datadoghq.com/api/v1/series', {
    method: 'POST',
    headers: {
      'DD-API-KEY': process.env.DATADOG_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      series: [{
        metric: `caminho_digital.${name}`,
        points: [[Math.floor(Date.now() / 1000), value]],
        type: 'gauge',
        tags: Object.entries(tags || {}).map(([k, v]) => `${k}:${v}`),
      }],
    }),
  });
}

// Usage
await recordMetric('diagnostic.latency_ms', duration, {
  plan: user.plan,
  result: 'success',
});
```

---

## 6️⃣ ERROR TRACKING (SENTRY)

### Configuração Avançada

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

// User context
export function setSentryUser(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    plan: user.plan,
  });
}

// Breadcrumbs for context
export function addBreadcrumb(message: string, category: string, data?: any) {
  Sentry.captureMessage(message, 'info');
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

// Error capturing with context
export function captureError(error: Error, context?: any) {
  Sentry.captureException(error, {
    contexts: {
      app: context,
    },
  });
}

// Tagging for filtering
export function tagError(name: string, value: string) {
  Sentry.setTag(name, value);
}
```

### Error Categories

```
Sentry Alerts:
├─ Performance: Latency > 5s
├─ Reliability: Error rate > 5%
├─ Business: Failed payment
├─ Integration: Anthropic API error
└─ Security: Failed auth attempt (3+)

Severity levels:
├─ fatal: App unusable
├─ error: Feature broken
├─ warning: Degraded performance
└─ info: Informational events
```

---

## 7️⃣ ANALYTICS PIPELINE

### Eventos para Rastrear

```typescript
// Analytics events
export const events = {
  // User
  'user.signup': { email, plan },
  'user.login': { email, provider },
  'user.logout': { userId },
  
  // Diagnostic
  'diagnostic.started': { userId, type: 'free|paid' },
  'diagnostic.submitted': { userId, duration_ms, canal_count },
  'diagnostic.completed': { userId, score, quality: 'good|ok|poor' },
  'diagnostic.failed': { userId, error_message },
  
  // Subscription
  'subscription.created': { userId, plan, amount, currency },
  'subscription.upgraded': { userId, from_plan, to_plan },
  'subscription.cancelled': { userId, reason },
  'subscription.payment_failed': { userId, retry_count },
  
  // Feature usage
  'feature.dashboard.viewed': { userId, section },
  'feature.recommendations.clicked': { userId, type },
  'feature.export.requested': { userId, format: 'pdf|csv' },
  
  // Support
  'support.chat.started': { userId },
  'support.ticket.created': { userId, topic },
};

// Implementation (Segment/Mixpanel)
export function trackEvent(eventName: string, properties: any) {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track(eventName, properties);
  }
}
```

### Dashboards

```
Mixpanel Dashboards:
├─ Funnel Analysis
│  ├─ Free → Paid conversion
│  ├─ Step-by-step dropoff
│  └─ Conversion by source
│
├─ Retention Cohorts
│  ├─ 30-day retention
│  ├─ Churn by plan
│  └─ Usage frequency
│
└─ Revenue Metrics
   ├─ MRR growth
   ├─ Customer LTV
   └─ CAC payback period
```

---

## 8️⃣ FEATURE FLAGS

### Implementação com Vercel Edge Config

```typescript
// lib/features.ts
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient({
  token: process.env.EDGE_CONFIG_TOKEN,
});

export async function isFeatureEnabled(userId: string, feature: string) {
  const flags = await edgeConfig.get('features');
  
  // Check if enabled globally
  if (flags[feature].enabled === true) return true;
  
  // Check if user in beta group
  if (flags[feature].betaUsers?.includes(userId)) return true;
  
  // Check if user in percentage rollout
  const rolloutPercent = flags[feature].rolloutPercent || 0;
  const userHash = parseInt(userId.substring(0, 8), 16);
  const rollout = (userHash % 100) < rolloutPercent;
  
  return rollout;
}

// Usage
export async function getDashboardFeatures(userId: string) {
  return {
    advancedAnalytics: await isFeatureEnabled(userId, 'advanced_analytics'),
    aiMaster: await isFeatureEnabled(userId, 'ai_master'),
    whatsappIntegration: await isFeatureEnabled(userId, 'whatsapp'),
  };
}
```

### Feature Flag Configuration

```json
{
  "features": {
    "advanced_analytics": {
      "enabled": true,
      "rolloutPercent": 100,
      "betaUsers": []
    },
    "ai_master": {
      "enabled": false,
      "rolloutPercent": 10,
      "betaUsers": ["user-123", "user-456"]
    },
    "whatsapp_integration": {
      "enabled": false,
      "rolloutPercent": 0,
      "betaUsers": ["daniel-godri"]
    }
  }
}
```

---

## 9️⃣ BACKGROUND JOBS

### Job Types

| Job | Frequency | Priority | Timeout |
|-----|-----------|----------|---------|
| Diagnóstico IA | On-demand | High | 30s |
| Envio de email | On-demand | Medium | 10s |
| Relatório diário | Daily 8am | Medium | 60s |
| Limpeza de dados | Weekly | Low | 300s |
| Webhook retry | Every 5min | Medium | 30s |
| Backup | Daily 2am | Low | 600s |

### Implementação com Bull

```typescript
// jobs/diagnostic.ts
import Queue from 'bull';

export const diagnosticQueue = new Queue('diagnostics', {
  redis: { host: 'localhost', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
  },
});

// Process job
diagnosticQueue.process(async (job) => {
  const { userId, data } = job.data;
  
  try {
    // Generate diagnostic
    const result = await generateWithAI(data);
    
    // Save to DB
    await saveDiagnostic(userId, result);
    
    // Notify user
    await notifyUser(userId, result);
    
    return result;
  } catch (error) {
    // Sentry tracking
    Sentry.captureException(error, {
      tags: { job: 'diagnostic', userId },
    });
    throw error; // Bull retries
  }
});

// Job events
diagnosticQueue.on('failed', (job, err) => {
  log.error('Job failed after retries', { jobId: job.id, error: err.message });
  notifyAdminOfFailure(job.data.userId);
});
```

---

## 🔟 QUEUE SYSTEM PARA IA

### Architecture Decision

```
Option 1: Vercel Serverless + Bull (Recommended)
├─ Enqueue em Vercel edge
├─ Bull workers em separate Node.js process
├─ Redis em Upstash
└─ Cost: $30/mês

Option 2: AWS SQS + Lambda
├─ Queue: SQS
├─ Workers: Lambda functions
├─ Cost: $5/mês + Lambda costs

Option 3: RabbitMQ (em K8s)
├─ RabbitMQ cluster
├─ Kubernetes workers
└─ Cost: $100+/mês (Phase Scale)
```

**Recomendação:** Começar com Bull + Upstash (Option 1)

### Implementação Completa

```typescript
// lib/queue/diagnostic.queue.ts
import Queue, { QueueScheduler, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { generateDiagnosticAI } from '@/lib/anthropic';
import { saveDiagnostic, notifyUser } from '@/lib/db';

const redis = new Redis(process.env.REDIS_URL);

const diagnosticQueue = new Queue('diagnostics', { connection: redis });
new QueueScheduler('diagnostics', { connection: redis });

// Producer (em Vercel)
export async function enqueueDiagnostic(userId: string, input: DiagnosticInput) {
  const job = await diagnosticQueue.add(
    { userId, input },
    {
      priority: isPremium(userId) ? 1 : 10,
      delay: isFreeTier(userId) ? 5 * 60 * 1000 : 0, // Free tier: 5min delay
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    }
  );
  
  log.info('Diagnostic enqueued', { jobId: job.id, userId });
  return job;
}

// Worker (separado ou em Vercel)
const worker = new Worker('diagnostics', async (job) => {
  try {
    const { userId, input } = job.data;
    
    // Check credits
    const credits = await getCredits(userId);
    if (credits.balance < 1) {
      throw new Error('Insufficient credits');
    }
    
    // Generate with AI
    const diagnostic = await generateDiagnosticAI(input);
    
    // Save to DB
    await saveDiagnostic(userId, diagnostic);
    
    // Deduct credit
    await deductCredit(userId, 1);
    
    // Notify user (WebSocket)
    await notifyUser(userId, {
      type: 'diagnostic.completed',
      diagnostic,
    });
    
    return diagnostic;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}, { connection: redis });

// Events
worker.on('completed', (job) => {
  log.info('Job completed', { jobId: job.id, duration: job.duration });
});

worker.on('failed', (job, err) => {
  log.error('Job failed', { jobId: job.id, error: err.message });
});

// Monitoring
export async function getQueueMetrics() {
  const counts = await diagnosticQueue.getJobCounts(
    'wait', 'active', 'delayed', 'completed', 'failed'
  );
  
  return {
    ...counts,
    avgWaitTime: await getAverageWaitTime(),
    workerCount: worker.numWorkers,
  };
}
```

---

## PRÓXIMOS PASSOS

1. ✅ Multi-tenant architecture (design, não implementar até 10+ pagantes)
2. ✅ Credit system (design documentado, implementar Week 2)
3. ✅ Rate limiting (implementar Week 1 com Redis)
4. ✅ Logs centralizados (setup Sentry Week 1)
5. ✅ Observability (DataDog alerts Week 2)
6. ✅ Feature flags (Vercel Edge Config Week 2)
7. ✅ Background jobs (Bull Queue Week 2)
8. ✅ Queue system (AI processing Week 2)

**Timeline:** Implementar gradualmente ao longo do mês, operacionalizar no mês 2.

---

*Documento de arquitetura operacional*  
*Atualizar com implementações reais*
