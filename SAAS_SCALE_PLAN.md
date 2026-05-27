# 📈 SAAS SCALE PLAN - CAMINHO DIGITAL

**Data:** 2026-05-23  
**Fase:** Operação SaaS Real + Arquitetura de Escala  
**Objetivo:** Preparar infraestrutura para crescimento de 1 → 10K usuários

---

## 1️⃣ SCALING STRATEGY - Fases de Crescimento

### FASE ALPHA (Mês 1-2): MVP em Produção
```
Usuários esperados: 10-50
Infra: Vercel Hobby → Pro
Banco: Supabase Free → Pro
Filas: Não necessário
IA: API calls on-demand (Anthropic)

Custo estimado: $50-100/mês
Margem: N/A (fase de tração)
```

**Limites atuais:**
- Vercel Pro: 100 deployments/dia, 3GB max serverless function
- Supabase: 500MB storage free, 50K queries/mês free tier
- Anthropic: Pay-as-you-go (default: $0.003/1K input, $0.015/1K output)

**Quando escalar:** > 100 API calls/dia de diagnóstico

---

### FASE BETA (Mês 3-4): Arquitetura de Filas
```
Usuários esperados: 50-500
Infra: Vercel Pro + Edge Network (Cloudflare)
Banco: Supabase Pro ($25/mês)
Filas: Bull + Redis (AWS ElastiCache ou Upstash)
IA: Batch processing + queue system

Custo estimado: $150-300/mês
Margem projetada: 40-50% (considerando 20 pagantes @ R$500/mês)
```

**Arquitetura de Filas IA:**
```
USER SUBMITS DIAGNOSTIC
        ↓
POST /api/diagnostico (Vercel edge)
        ↓
enqueue({ userId, data }) → Bull Queue (Upstash Redis)
        ↓
Background Worker (Node.js) consome fila
        ↓
call Anthropic API (batch)
        ↓
upsert Supabase diagnostics table
        ↓
emit WebSocket → frontend (real-time update)
        ↓
client recebe resultado
```

**Benefícios:**
- Diagnóstico não bloqueia user (async)
- Usa Anthropic batch API (50% mais barato)
- Rate limiting natural
- Retries automáticos em falha

**Redis opções:**
- Upstash Free: 10K commands/dia (R$0-50/mês)
- AWS ElastiCache: Redis 7.x t3.micro (R$15/mês + data)
- Recomendação: Upstash no início (serverless)

---

### FASE GROWTH (Mês 5-9): Multi-Region + Otimização
```
Usuários esperados: 500-2K
Infra: Vercel Edge + Cloudflare Workers (opcional)
Banco: Supabase + Read Replicas
Filas: 3 workers paralelos
Cache: Redis (sessões + diagnostics cache)
CDN: Vercel Edge + Cloudflare
IA: Implementar circuit breaker + fallback

Custo estimado: $400-700/mês
Margem projetada: 60-70% (100+ pagantes)
```

**Otimizações nesta fase:**

1. **Database Read Replicas**
   - Primary: Supabase (master writes)
   - Replicas: 2x read-only para reports/analytics
   - Replicação: automática (Postgres nativo)
   - Custo: +$25/mês por replica

2. **Caching Strategy**
   - User sessions: Redis (TTL: 30 dias)
   - Diagnostics (read-heavy): Redis com TTL 7 dias
   - Plans: Redis com TTL 30 dias
   - Cache busting: WebSocket invalidation

3. **IA Queue Optimization**
   - 3x workers paralelos (cada um processa 10 jobs/min)
   - Batching: agrupa 5 diagnósticos por API call (+40% economia)
   - Priorização: pagantes primeiro (5s latência), free tier (30s latência)
   - Fallback: gerar resumo básico se IA falhar

4. **Observability**
   - Sentry: error tracking ($29/mês)
   - DataDog: APM ($15/mês) ou Vercel Analytics (free)
   - Custom metrics: Queue depth, IA latency, error rate
   - Alertas: Discord webhook em caso de fila > 100 jobs

---

### FASE SCALE (Mês 10-12): Arquitetura Dedicada
```
Usuários esperados: 2K-10K
Infra: Kubernetes (EKS/GKE) + Load Balancer
Banco: Supabase Large ($500/mês) + Managed Postgres
Filas: RabbitMQ ou SQS em escala
IA: Endpoint dedicado + rate limiter por usuário
Cache: Redis Cluster (3+ nodes)

Custo estimado: $1000-2000/mês
Margem projetada: 75%+ (1K+ pagantes)
```

**Quando migrar de Vercel:**
- ✅ > 5K requests/min (Vercel max)
- ✅ Latência crítica < 100ms (edge não suficiente)
- ✅ Custom infra justificada por volume
- ✅ Contratos enterprise exigindo SLA 99.9%+

**Arquitetura Kubernetes:**
```
Ingress (LoadBalancer)
    ↓
├─ API Pods (Node.js/Nest.js) [auto-scale: 3-20]
├─ Worker Pods (Bull workers) [auto-scale: 5-50]
├─ Webhook Handler Pods [auto-scale: 2-10]
└─ Background Jobs Pods [scheduled: 1-2]
    ↓
├─ Postgres (RDS with read replicas)
├─ Redis Cluster (3+ nodes)
└─ S3 (file storage para reports)
```

---

## 2️⃣ CUSTO DE INFRAESTRUTURA - Projeção

| Fase | Vercel | Supabase | Redis | Workers | Sentry | CDN | Total/mês |
|------|--------|----------|-------|---------|--------|-----|-----------|
| Alpha | $20 | $0 | $0 | $0 | $0 | $0 | **$20** |
| Beta | $50 | $25 | $30 | $0 | $29 | $0 | **$134** |
| Growth | $100 | $100 | $50 | $100 | $29 | $50 | **$429** |
| Scale | $200 | $500 | $150 | $300 | $50 | $100 | **$1,300** |

### Custo IA (Anthropic)

**Modelo preço:** Input $0.003/1K, Output $0.015/1K

**Por diagnóstico:**
- Input: ~5K tokens (empresa data) = $0.015
- Output: ~2K tokens (recomendações) = $0.03
- **Total/diagnóstico: ~$0.045**

**Projeção mensal:**
- 50 diagnósticos/mês (Alpha): $2.25/mês
- 500 diagnósticos/mês (Beta): $22.50/mês
- 2K diagnósticos/mês (Growth): $90/mês
- 10K diagnósticos/mês (Scale): $450/mês

**Otimizações:**
1. **Batch API** (50% economia) - quando > 100 diag/dia
   - Queue diagnósticos por 2h
   - Process em batch de 50
   - Economiza $225/mês em Scale
   
2. **Caching de resultados** (25% economia)
   - Cache 7 dias por usuário
   - Reutiliza resultado se score pouco mudou
   - Economiza $112/mês em Scale

3. **Fallback local** (quando IA fails)
   - Score baseado em template
   - Quick wins estáticos
   - Salva $200/mês em erros

**Custo IA otimizado (Scale):** $450 → $113/mês (75% economia)

---

## 3️⃣ PROJEÇÃO DE MARGEM & RECEITA

### Modelo de Negócio
```
Free: Diagnóstico gratuito (lead magnet)
Estratégico: R$497/mês (5 diag/mês + IA recomendações)
Premium: R$1.197/mês (ilimitado + IA master + automação)

Mix esperado: 80% Estratégico, 20% Premium
ASP (Average Subscription Price): R$600/mês
```

### Projeção 12 meses
```
Mês  | Leads | Conv.% | Pagantes | MRR      | COGS   | Margem | Status
-----|-------|--------|----------|----------|--------|--------|--------
1    | 100   | 10%    | 10       | R$6K     | $20    | 99%    | Alpha
2    | 200   | 15%    | 30       | R$18K    | $134   | 99%    | Beta prep
3    | 400   | 20%    | 80       | R$48K    | $429   | 99%    | Beta live
4    | 600   | 20%    | 120      | R$72K    | $429   | 99%    | Scale queue
5    | 900   | 22%    | 200      | R$120K   | $429   | 99%    | Growth
6    | 1.2K  | 25%    | 300      | R$180K   | $429   | 99%    | Growth
7    | 1.5K  | 25%    | 375      | R$225K   | $429   | 99%    | Growth
8    | 1.8K  | 25%    | 450      | R$270K   | $429   | 99%    | Growth
9    | 2.1K  | 25%    | 525      | R$315K   | $1,300 | 99%    | Growth
10   | 2.5K  | 26%    | 650      | R$390K   | $1,300 | 99%    | Scale prep
11   | 3K    | 27%    | 810      | R$486K   | $1,300 | 99%    | Scale
12   | 3.5K  | 27%    | 950      | R$570K   | $1,300 | 99%    | Scale
```

**Ano 2 (projeção conservadora):**
- 3K pagantes = R$1.8M MRR = R$21.6M ARR
- COGS: $1,500/mês (infra + IA)
- Margem bruta: 99%
- Margem operacional: ~75% (descontar salários, marketing, support)

---

## 4️⃣ LIMITES VERCEL & QUANDO MIGRAR

### Limites Atuais (Hobby/Pro)

| Limite | Hobby | Pro | Quando ultrapassar |
|--------|-------|-----|-------------------|
| **Deployments/dia** | 50 | 100 | Raramente, só com CI/CD agressivo |
| **Serverless functions** | 12s timeout | 60s timeout | Diagnósticos > 30s (vai bloquear) |
| **Max function size** | 50MB | 50MB | Problemas em Phase Scale (packages crescem) |
| **Cold start** | ~1s | ~500ms | Aceitável até Growth |
| **Concurrent requests** | Shared | Prioritário | Aceitável até Growth |
| **Bandwidth** | 100GB/mês | Unlimited | Provavelmente nunca no nosso caso |
| **Concurrency** | 1000 simultâneos | 3000 | Atingiremos em Scale |

### Sinais para Migrar para Arquitetura Dedicada

🚩 **Quando migrar:**
1. **Latência diagnóstico > 30s** → Serverless timeout insuficiente
2. **Fila de diagnósticos > 100 jobs** → Workers não acompanham
3. **Erros de cold start > 5% das requisições** → Não aceitável para UX
4. **Concurrency alerts do Vercel** → Atingindo limite
5. **Custo Vercel > $500/mês** → Mais barato com K8s próprio

**Timeline estimada:** Fim do mês 9 / início do mês 10

---

## 5️⃣ ESTRATÉGIA DE FILAS PARA IA

### Arquitetura Proposta

```
VERCEL (API Edge)
├─ GET /api/diagnostico → Valida request
├─ POST /api/diagnostico → 
│   └─ Enqueue job em Redis
│   └─ Retorna { jobId, status: 'queued' }
│
└─ GET /api/diagnostico/[jobId] → Poll status

WORKER POOL (Node.js)
├─ Consumer 1: Pull job → Call Anthropic → Save Supabase
├─ Consumer 2: (paralelo)
├─ Consumer 3: (paralelo)
└─ Retry logic: 3x tentativas com exponential backoff

WEBSOCKET (Real-time)
└─ Notifica frontend quando diagnóstico pronto

SCHEDULER (cron)
└─ Cleanup jobs expirados (> 7 dias)
```

### Implementação com Bull + Upstash

**Instalar:**
```bash
npm install bull upstash-redis
```

**Producer (em Vercel):**
```typescript
// lib/queue.ts
import Queue from 'bull';
import { Redis } from 'upstash-redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export const diagnosticQueue = new Queue('diagnostics', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
  },
});

// Enqueue
export async function enqueueDiagnostic(userId: string, data: DiagnosticInput) {
  const job = await diagnosticQueue.add(
    { userId, data },
    { priority: isPremiumUser(userId) ? 1 : 10 } // Premiums first
  );
  return { jobId: job.id, status: 'queued' };
}
```

**Worker (Lambda/EC2/Pod):**
```typescript
// worker.ts
diagnosticQueue.process(1, async (job) => {
  const { userId, data } = job.data;
  
  try {
    // Call Anthropic
    const diagnostic = await generateDiagnosticWithAI(data);
    
    // Save to Supabase
    await supabase
      .from('diagnostics')
      .insert({ user_id: userId, ...diagnostic });
    
    // Notify via WebSocket
    await notifyUser(userId, diagnostic);
    
    return { success: true, diagnostic };
  } catch (error) {
    throw error; // Bull retry
  }
});
```

**Frontend (real-time polling):**
```typescript
// hooks/useDiagnosticQueue.ts
export function useDiagnosticJob(jobId: string) {
  const [status, setStatus] = useState('queued');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const pollJob = setInterval(async () => {
      const response = await fetch(`/api/diagnostico/${jobId}`);
      const { status, result } = await response.json();
      
      setStatus(status);
      if (result) {
        setResult(result);
        clearInterval(pollJob);
      }
    }, 2000); // Poll every 2s

    return () => clearInterval(pollJob);
  }, [jobId]);

  return { status, result };
}
```

### Métricas para Monitorar

```typescript
// lib/monitoring.ts
export const queueMetrics = {
  jobsQueued: await diagnosticQueue.getWaiting(),
  jobsProcessing: await diagnosticQueue.getActive(),
  jobsFailed: await diagnosticQueue.getFailed(),
  avgProcessTime: await diagnosticQueue.getCompletedCount(), // needs calc
  errorRate: failedJobs / totalJobs,
};

// Alertar se:
if (queueMetrics.jobsQueued > 100) {
  await discord.notify('Queue building up!');
}
if (queueMetrics.errorRate > 0.05) {
  await discord.notify('Error rate > 5%!');
}
```

---

## 6️⃣ OTIMIZAÇÃO DE CUSTO ANTHROPIC

### Tática 1: Batch API
```
Normal: $0.045/diagnóstico
Batch: $0.0225/diagnóstico (50% desconto)

Setup:
- Enqueue 50+ diagnósticos
- Process a cada 2 horas via Batch API
- Use case: Diagnósticos podem esperar 2-4h

Economia: R$1.80/100 diagnósticos = R$540/mês em Scale
```

### Tática 2: Cached Results
```
User refaz diagnóstico com dados similares?
→ Reutiliza resultado anterior (cache 7 dias)
→ Économiza $0.045/requisição

Implementação:
- Hash dos inputs (company_type + industry + followers)
- Se hash existe em cache → return cached
- Senão → call IA

Economia: 20-30% reduction = R$36-54/mês em Scale
```

### Tática 3: Fallback Local
```
Diagnóstico falha ou timeout IA?
→ Servir versão template + cache

Template (sem IA):
- Score baseado em social media size
- 3 quick wins padrão por indústria
- CTA: upgrade para IA completa

Custo: $0 (local)
User experience: Degradada mas aceitável

Economia: Previne 10-15% de erros = R$45-68/mês
```

### Tática 4: Tier de Detalhamento
```
Free/Estratégico:
- Score 0-100 por canal
- 3 recomendações principais
- Custo: $0.02/diagnóstico

Premium:
- + Análise detalhada IA
- + Action plan customizado
- Custo: $0.05/diagnóstico

Implementação: Parameter na API
POST /api/diagnostico?detail=full (Premium) vs basic (Estratégico)

Economia: 30% dos users em Estratégico usam basic
```

### Tática 5: Prompt Optimization
```
Atual:
- Prompt: ~1.5K tokens de context
- Output: ~2K tokens

Otimizado:
- System prompt cached (Anthropic cache feature)
- Prompt: ~800 tokens (-50% com compression)
- Output: ~1.2K tokens (-40% com structured output)

Total: $0.045 → $0.018 (-60%)

Implementação:
- Usar prompt_caching (beta Anthropic)
- JSON schema para output estruturado
```

### Custo Otimizado - Cenário Scale (10K diag/mês)

| Estratégia | Base | Com Otimizações | Economia |
|-----------|------|-----------------|----------|
| Normal | $450 | - | - |
| + Batch (2h delay) | - | $225 | $225 (50%) |
| + Cache 7d | - | $157 | $68 (30%) |
| + Fallback (5% erros) | - | $149 | $8 (5%) |
| + Tier detailment | - | $113 | $36 (30%) |
| **TOTAL** | **$450** | **$113** | **$337 (75%)** |

**Target:** R$113/mês IA cost em Scale (vs R$450 sem otimizações)

---

## 7️⃣ ROADMAP TÉCNICO - 12 MESES

```
SEMANA 1-2 (MAI)
├─ ✅ Deploy Vercel production
├─ ✅ Documentação arquitetura
└─ → P0: DNS + ANTHROPIC_API_KEY

SEMANA 3-4 (MAI/JUN)
├─ Supabase + Auth (NextAuth)
├─ OAuth Google + Meta
└─ Auto-save diagnósticos

SEMANA 5-6 (JUN)
├─ Stripe Live integration
├─ Ticto PIX/Boleto
└─ Subscription management

SEMANA 7-8 (JUN/JUL)
├─ Sentry + Analytics
├─ Feature flags (Vercel)
└─ Rate limiting basic

SEMANA 9-12 (JUL/AGO)
├─ Bull queue + Redis setup
├─ 3x worker parallelization
├─ Anthropic optimization
└─ **BETA LAUNCH**

SEMANA 13-20 (AGO/SET)
├─ Multi-tenant architecture
├─ Admin panel + CRM
├─ Advanced analytics
└─ WhatsApp automation

SEMANA 21-26 (SET/OUT)
├─ K8s proof-of-concept
├─ Load testing
├─ Database optimization
└─ **GROWTH PHASE**

SEMANA 27-36 (OUT/NOV/DEZ)
├─ Kubernetes migration
├─ Multi-region setup
├─ Advanced observability
└─ **SCALE PHASE**

SEMANA 37-52 (JAN-MAR)
├─ Enterprise features
├─ Compliance (LGPD/SOC2)
├─ API marketplace
└─ **IPO READINESS**
```

---

## 8️⃣ CHECKLIST IMPLEMENTAÇÃO

### Phase Beta (Próximas 4 semanas)

- [ ] Bull + Redis setup (Upstash)
- [ ] Queue infrastructure online
- [ ] 3x workers paralelos testados
- [ ] Anthropic batch API integrated
- [ ] Cache strategy implemented
- [ ] Fallback logic in place
- [ ] Sentry error tracking live
- [ ] Rate limiter middleware
- [ ] Admin metrics dashboard
- [ ] Load testing (1K concurrent)

### Phase Growth (Semanas 5-9)

- [ ] Multi-tenant architecture designed
- [ ] Admin panel MVP
- [ ] Advanced diagnostics (timeline/trends)
- [ ] Credit system for IA calls
- [ ] Feature flags system
- [ ] Webhook system robust
- [ ] Database read replicas
- [ ] CDN optimization
- [ ] Analytics pipeline (Mixpanel/Segment)
- [ ] Compliance audit (LGPD)

### Phase Scale (Semanas 10+)

- [ ] Kubernetes cluster setup
- [ ] Load balancer configured
- [ ] Auto-scaling policies
- [ ] Multi-region replication
- [ ] Disaster recovery tested
- [ ] SOC2 compliance
- [ ] Enterprise SSO (SAML)
- [ ] Advanced monitoring (DataDog)
- [ ] API marketplace setup
- [ ] Partner program

---

## 9️⃣ RECURSOS ESTIMADOS

| Fase | Eng. | DevOps | PM | Design | Total/mês |
|------|------|--------|-----|--------|-----------|
| Alpha | 2 | 0.5 | 0.5 | 0 | 2.5 FTE |
| Beta | 2 | 1 | 0.5 | 0.5 | 4 FTE |
| Growth | 3 | 1 | 1 | 1 | 6 FTE |
| Scale | 4 | 2 | 1 | 1 | 8 FTE |

---

## 🔟 CONCLUSÃO

**Caminho Digital está pronto para escalar de SaaS MVP → Plataforma de Escala Global**

Próximos passos imediatos (P0 - Hoje):
1. DNS propagação monitorada ✅
2. ANTHROPIC_API_KEY adicionada → Redeploy
3. Validação de endpoints com IA live
4. Spike: Queue infrastructure (Upstash + Bull)

Próximos 2 meses (P1):
- Infraestrutura completa de filas
- Otimizações de custo IA
- Rate limiting + observability
- Beta launch com primeiros 100 pagantes

**Margem projetada ano 1:** 99% (infra mínima)  
**Margem projetada ano 2:** 75% (com times)  
**ARR ano 2:** R$21.6M

---

*Documento gerado automaticamente*  
*Atualizar quando mudanças em arquitetura/custos*
