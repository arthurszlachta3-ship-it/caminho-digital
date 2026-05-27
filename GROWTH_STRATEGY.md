# 🚀 GROWTH STRATEGY - CAMINHO DIGITAL (P3)

**Data:** 2026-05-23  
**Fase:** Crescimento e Monetização  
**Objetivo:** Definir estratégia para crescimento de 50 → 10K pagantes em 12 meses

---

## 1️⃣ ONBOARDING WIZARD

### Problema
- Landing page → diagnóstico → resultado parcelado = leakage
- Users não entendem plano ao chegar no checkout

### Solução: Multi-step Wizard

```
Step 1: Welcome
├─ Explicar o que é Caminho Digital
├─ "Você vai receber um diagnóstico completo em 2 minutos"
└─ "Ver exemplo de diagnóstico" (pre-generated)

Step 2: Quick Profile
├─ Qual é seu negócio?
├─ Quanto seguidores você tem?
├─ Campo com email (já pré-preenchido se logged in)
└─ CTA: "Começar diagnóstico"

Step 3: Diagnóstico (animated)
├─ Show loading com dicas "Sabias que..."
├─ Display score por canal em tempo real
├─ Mostrar recomendações aparecendo

Step 4: Results (resultado parcial)
├─ Score geral destacado (grande)
├─ Top 3 problemas
├─ 1 quick win implementável
├─ CTA 1: "Ver diagnóstico completo ($49.70/mês)"
├─ CTA 2: "Ver plano Premium ($119.70/mês)"
└─ CTA 3: "Salvar resultado parcial" (email delivery)

Step 5: Checkout
├─ Plan comparison (side-by-side)
├─ Payment method selector (Stripe vs PIX)
├─ Preço anual (10% desconto)
└─ "Qual é sua garantia?" (30-day money back)

Step 6: Confirmation
├─ "Bem-vindo ao Caminho Digital!"
├─ Próximos passos
├─ Link para dashboard
└─ "Seu diagnóstico completo está carregando..."
```

### Implementação

```typescript
// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { OnboardingStep } from '@/components/onboarding';

const steps = ['welcome', 'profile', 'diagnostic', 'results', 'checkout', 'confirmation'];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-green-500 transition-all"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Step content */}
      <OnboardingStep
        step={steps[currentStep]}
        data={data}
        onUpdate={(newData) => setData({ ...data, ...newData })}
        onNext={() => setCurrentStep(currentStep + 1)}
        onPrev={() => setCurrentStep(Math.max(0, currentStep - 1))}
      />
    </div>
  );
}
```

### Conversão Target
- Welcome → Profile: 95%
- Profile → Diagnostic: 90%
- Diagnostic → Results: 100%
- Results → Checkout: 25% (70% para free email delivery)
- Checkout → Payment: 80%
- **Overall:** 12% conversion free → paid

---

## 2️⃣ TRIALS & FREEMIUM STRATEGY

### Modelo Atual
```
Free: 1 diagnóstico gratuito
Estratégico: R$497/mês
Premium: R$1.197/mês
```

### Modelo Melhorado

```
Free Plan
├─ 1 diagnóstico/mês (gratuito)
├─ Score por canal
├─ 1 quick win
└─ Email com resultado

Pro Trial (7 dias)
├─ Acesso completo ao Estratégico
├─ 5 diagnósticos
├─ IA recomendações completas
├─ Sem cartão de crédito
└─ CTA: "Upgrade para continuar"

Premium Trial (3 dias)
├─ Acesso completo ao Premium
├─ Diagnósticos ilimitados
├─ IA Master + automação
└─ Exige cartão (charge após 3 dias se não cancelar)
```

### Fluxo de Trials

```typescript
// lib/trial.ts
export async function createTrial(userId: string, plan: 'pro' | 'premium') {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (plan === 'pro' ? 7 : 3));
  
  await supabase.from('users').update({
    plan: 'trial',
    trial_plan: plan,
    trial_expires_at: expiresAt,
    trial_started_at: new Date(),
  }).eq('id', userId);
  
  // Email: Welcome to trial
  await sendEmail(userId, 'trial_started', { plan, expiresAt });
}

// Check if in trial
export async function isInTrial(userId: string) {
  const user = await getUser(userId);
  return user.plan === 'trial' && new Date() < user.trial_expires_at;
}

// Handle trial expiration
export async function handleTrialExpiration(userId: string) {
  const user = await getUser(userId);
  
  // Option 1: Charge if card on file
  if (user.stripe_customer_id && user.trial_plan === 'premium') {
    await chargeUser(userId, user.trial_plan);
  }
  
  // Option 2: Downgrade to free
  await supabase.from('users').update({
    plan: 'free',
    trial_plan: null,
  }).eq('id', userId);
  
  // Email: Trial expired
  await sendEmail(userId, 'trial_expired');
}
```

### Messaging

```
Email 1: Welcome (Day 0)
├─ "Você tem 7 dias de acesso completo"
├─ "Criar 5 diagnósticos grátis"
├─ "Usar IA recomendações ilimitadas"
└─ Link: Dashboard

Email 2: Trial Midpoint (Day 3 para 7-day, Day 1 para 3-day)
├─ "Você descobriu X em seus canais?"
├─ "Quer continuar com esses recursos?"
└─ CTA: "Upgrade agora"

Email 3: Trial Expiring Soon (Day 6 para 7-day, Day 2 para 3-day)
├─ "Seu acesso expira em 24 horas"
├─ Mostrar economia: "Só R$16.57/dia"
└─ "Manter acesso" ou "Voltar ao plano gratuito"

Email 4: Trial Expired (Day 7)
├─ "Seu período de teste terminou"
├─ Recap: "Você criou 3 diagnósticos..."
└─ CTA: "Reativar plano" (link com desconto 20% para 1º mês)
```

### Conversion Target
- Free → Trial: 20%
- Trial → Paid: 40%
- **Overall:** 8% conversion free → trial → paid

---

## 3️⃣ REFERRAL PROGRAM

### Modelo 1: Crédito para referidos

```
Referrer ganha: R$50 em créditos/referido que pagar
Referido recebe: R$25 desconto no 1º mês

Limite: Máximo 10 referidos/mês por usuário
Requisito: Referido deve pagar (plano mínimo Estratégico)
Payout: Créditos acumulam, saca via PIX quando > R$500
```

### Modelo 2: Affiliate (para agências)

```
Agência ganha: 20% de revenue share
Termo: Permanente enquanto cliente pago

Setup:
├─ Create affiliate account
├─ Get unique referral link
├─ Dashboard com statistics
├─ Payment via PIX
```

### Implementação

```typescript
// lib/referral.ts
export async function generateReferralLink(userId: string) {
  const code = generateCode(8); // e.g., ABC123XY
  
  await supabase.from('referral_codes').insert({
    user_id: userId,
    code,
    created_at: new Date(),
  });
  
  return `https://turbinesuasredes.com.br/signup?ref=${code}`;
}

// Signup with referral code
export async function signupWithReferral(email: string, refCode: string) {
  // Find referrer
  const { data: referral } = await supabase
    .from('referral_codes')
    .select('user_id')
    .eq('code', refCode)
    .single();
  
  if (!referral) return { error: 'Invalid referral code' };
  
  // Create user
  const user = await createUser(email);
  
  // Record referral
  await supabase.from('referrals').insert({
    referrer_id: referral.user_id,
    referred_user_id: user.id,
    status: 'pending', // becomes 'paid' when referred user upgrades
  });
  
  return { user };
}

// Handle payment (when referred user upgrades)
export async function markReferralAsPaid(referredUserId: string) {
  const { data: referral } = await supabase
    .from('referrals')
    .select('referrer_id')
    .eq('referred_user_id', referredUserId)
    .eq('status', 'pending')
    .single();
  
  if (!referral) return;
  
  // Update status
  await supabase
    .from('referrals')
    .update({ status: 'paid', paid_at: new Date() })
    .eq('referred_user_id', referredUserId);
  
  // Award credit to referrer
  await awardCredit(referral.referrer_id, 'referral', 50, {
    referred_user_id: referredUserId,
  });
}
```

### Dashboard Referral

```typescript
// app/dashboard/referral/page.tsx
export function ReferralDashboard({ userId }: { userId: string }) {
  const { referrals, pendingCredit, totalEarned } = useReferralStats(userId);
  const referralLink = useReferralLink(userId);
  
  return (
    <div className="space-y-6">
      {/* Referral Link */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-bold mb-2">Seu link de referência</h3>
        <div className="flex gap-2">
          <input 
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 border rounded"
          />
          <button onClick={() => copyToClipboard(referralLink)}>
            📋 Copiar
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Ganhe R$50 para cada amigo que assine um plano pago
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard 
          label="Referidos" 
          value={referrals.length}
          detail={`${referrals.filter(r => r.status === 'paid').length} pagando`}
        />
        <StatCard 
          label="Crédito pendente" 
          value={`R$${pendingCredit}`}
        />
        <StatCard 
          label="Total ganho" 
          value={`R$${totalEarned}`}
        />
      </div>
      
      {/* Referrals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Email</th>
              <th>Data</th>
              <th>Status</th>
              <th>Crédito</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(ref => (
              <tr key={ref.id} className="border-b">
                <td>{ref.referred_user.email}</td>
                <td>{new Date(ref.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    ref.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
                    {ref.status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td>R$50</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Target
- Referral signup: 5% dos users
- Referral → Paid: 40%
- **Revenue impact:** +5% MRR após 3 meses

---

## 4️⃣ CRM INTERNO & LEADS

### CRM Feature (Dentro do Dashboard)

```
Módulo: Gerenciador de Clientes
├─ Importar contatos (CSV)
├─ Adicionar contatos manualmente
├─ Automações: Enviar diagnóstico para cliente
├─ Track: Quem viu, quem clicou
├─ Próxima feature: Lead scoring (Daniel como early beta)
```

### Integração Stripe

```typescript
// Webhook: Subscription payment success
POST /api/webhooks/stripe

→ Criar entry em CRM da empresa do cliente
  ├─ Nome: company_name
  ├─ Website: website_url
  ├─ Seguidores: sum(instagram_followers + tiktok_followers + youtube_subscribers)
  └─ Status: "Subscribed" com data
```

### Analytics

```
CRM Dashboard:
├─ Total de clientes
├─ MRR por cliente (agregado)
├─ Churn rate
├─ NPS (Net Promoter Score)
└─ Lifetime value
```

### Lead Scoring (Future)

```
Algoritmo simples:
├─ Qualidade: Score diagnóstico (0-100)
├─ Engagement: Freq de acesso ao dashboard
├─ Payment: Value tier + tenure
└─ Score = (Qualidade + Engagement + Payment) / 3

High-value leads: Score > 80
├─ Oferecer consultoria paga
├─ Upgrade automático para Premium (trial)
├─ Dedicated support
```

---

## 5️⃣ AUTOMAÇÕES WHATSAPP (Futura)

### Proposta
Integrar WhatsApp Business API para:
- Enviar diagnósticos via WhatsApp
- Suporte automático via ChatBot IA
- Notificações de pagamento
- Reativação de churners

### MVP
```
Fase 1: Manual
├─ User clica "Enviar para WhatsApp"
├─ Generate QR code com resumo diagnóstico
├─ Link para dashboard

Fase 2: Automated (Bot)
├─ Nova mensagem → auto-reply com FAQ
├─ User envia número de diagnóstico → retorna resultado
├─ Suporte humano se não entender (escalate)

Fase 3: Proactive
├─ Chat diário com dicas
├─ Lembretes de tarefas (quick wins)
├─ Notificações de diagnósticos novos
```

### Stack
```
Meta WhatsApp Business API
├─ Twilio (proxy)
└─ Custom webhook handler

IA:
├─ Claude API para respostas
├─ Fallback: Template responses
└─ Human escalation via email
```

---

## 6️⃣ RECUPERAÇÃO DE LEADS (Churn Prevention)

### Tipos de Churn

```
Hard Churn: Subscription cancelled
├─ Exit survey: "Why are you leaving?"
├─ Discount email: "Volte com 30% de desconto por 2 meses"
├─ Reengage sequence (3 emails em 2 semanas)

Soft Churn: Low activity (< 1 login/mês)
├─ Alert: "Parece que não estamos te ajudando?"
├─ Oferecer suporte: "Marcar call com especialista"
├─ Quick wins: "Tarefas simples para melhorar seu score"
└─ Downgrade: "Reduzir para Estratégico por 2 meses"
```

### Implementação

```typescript
// Scheduled job: Check for soft churn
export async function checkSoftChurn() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  
  const churners = await supabase
    .from('users')
    .select('id, email, plan')
    .neq('plan', 'free')
    .lt('last_login_at', cutoff);
  
  for (const user of churners.data) {
    await sendEmail(user.email, 'soft_churn_alert', {
      reengageLink: generateReengageLink(user.id),
      discountCode: generateDiscountCode(user.id, 30), // 30% off
    });
    
    // Set flag
    await supabase
      .from('users')
      .update({ at_risk: true })
      .eq('id', user.id);
  }
}

// Handle cancellation
export async function handleChurnRequest(userId: string, reason: string) {
  const user = await getUser(userId);
  
  // Try to retain with offer
  const offer = {
    discount: 40, // 40% off
    duration: 3, // 3 meses
    expiresIn: 7, // Oferta vale 7 dias
  };
  
  await sendEmail(user.email, 'retention_offer', offer);
  
  // If they still cancel after 7 days → process
}
```

### Email Sequence (After Cancellation)

```
Email 1: Exit survey (imediato)
├─ "Sentiremos sua falta"
├─ 4 motivos pré-definidos
├─ Aberto para feedback
└─ CTA: "Reativar por R$297" (40% off)

Email 2: Offer (Dia 1)
├─ "Voltando ao Caminho Digital"
├─ Mostrar valor entregue (X diagnósticos, Y recs)
├─ Ofereça 3 meses @ R$99 ou 1 mês @ R$49.70
└─ Prazo: 7 dias

Email 3: Last chance (Dia 5)
├─ "Sua oferta expirar em 48h"
├─ Mostrar ROI possível
└─ Último CTA com urgência

Email 4: Post-churn (Dia 30)
├─ "Como está seu negócio?"
├─ Free diagnóstico rápido
└─ Softer approach, sem push
```

### Target
- Soft churn prevention: 30% reengage
- Hard churn recovery: 10% come back within 90 days
- **Impact:** Reduce churn from 5% → 3%

---

## 7️⃣ FUNNEL DE CONVERSÃO

### Métricas por Estágio

```
1. AWARENESS (Top of Funnel)
   ├─ Impressions: ~50K/mês (ads + organic)
   ├─ CTR: 2-3%
   └─ Leads: ~1500/mês

2. INTEREST
   ├─ Landing page views: 1500
   ├─ Onboarding started: 900 (60%)
   └─ Profile filled: 700 (78%)

3. DECISION (Diagnostic)
   ├─ Diagnostic submitted: 600 (85%)
   ├─ Completed: 590 (98%)
   └─ Results viewed: 580 (98%)

4. ACTION (Conversion)
   ├─ Clicked "Learn more": 150 (26%)
   ├─ Added payment method: 120 (80%)
   ├─ Completed purchase: 100 (83%)
   └─ Revenue: R$50K/mês (100 pagantes @ R$500 ASP)

Overall Funnel Conversion: 100 / 1500 = 6.7%
```

### Otimizações Propostas

| Estágio | Métrica | Atual | Target | Tática |
|---------|---------|-------|--------|--------|
| AWARENESS | CTR | 2% | 3% | Improve ad copy |
| INTEREST | Start→Profile | 78% | 85% | Simplify form |
| DECISION | Completed→View | 98% | 98% | OK |
| ACTION | View→Click | 26% | 35% | Better CTA |
| ACTION | Click→Purchase | 83% | 90% | Remove friction |
| **OVERALL** | **Funnel** | **6.7%** | **10%** | Multi-pronged |

### Testing Plan (A/B Tests)

```
Week 1-2: Onboarding
├─ Test 1: 2-step vs 6-step wizard
├─ Test 2: "See full report" vs "Unlock insights"
└─ Test 3: Payment upfront vs after trial

Week 3-4: Pricing
├─ Test 1: R$49.70 vs R$39.70 vs R$59.70
├─ Test 2: Monthly vs annual default
└─ Test 3: Feature comparison table vs benefits list

Week 5-6: Messaging
├─ Test 1: "See what you're missing" vs ROI-focused
├─ Test 2: Money-back guarantee vs free trial
└─ Test 3: Success stories vs quick wins
```

### Conversion Goals (12 months)

```
Month 1-2: Stabilize
├─ Funnel: 5-7% (starting low)
├─ Monthly users: 500-1000
└─ Payantes: 50-70

Month 3-6: Grow
├─ Funnel: 8-10% (optimizations paying off)
├─ Monthly users: 2000-3000
└─ Payantes: 200-400

Month 7-12: Scale
├─ Funnel: 12-15% (paid ads + viral growth)
├─ Monthly users: 5000-8000
└─ Payantes: 1000-2000
```

---

## 8️⃣ PAID ACQUISITION STRATEGY

### Channels

| Channel | Budget | CAC | LTV | Payback |
|---------|--------|-----|-----|---------|
| Google Ads | 30% | R$80 | R$2K | 4 meses |
| LinkedIn Ads | 20% | R$120 | R$2K | 6 meses |
| Facebook/Insta | 20% | R$60 | R$2K | 3 meses |
| Referral | 15% | R$30 | R$2K | 2 meses |
| Organic | 15% | R$0 | R$2K | Instant |

### Ads Copy (Tested)

**Google Ads (Search)**
```
Headline 1: "Diagnóstico Digital Grátis"
Headline 2: "Descubra o que falta na sua presença online"
Headline 3: "Resultados em 2 minutos"

Description: "Score 0-100 por canal. IA recomendações. Sem cadastro."
CTA: "Fazer Diagnóstico"
```

**LinkedIn (B2B)**
```
"Donos de PME: Descubra por que não estão conseguindo clientes online"
"Diagnóstico gratuito em 2 minutos. Veja o que seus concorrentes estão fazendo."
"50% das PMEs têm score < 40 em presença digital. Qual é o seu?"
```

**Facebook/Insta (Video)**
```
15s video: "Você está viralizando? Veja como [company] aumentou 5x"
Story ad: Before/after dashboard score
Carousel: 3 quick wins para aumentar followers
```

---

## 9️⃣ PARTNERSHIP STRATEGY

### Potencial de Partners

| Partner | Tipo | Komissão | Benefício |
|---------|------|----------|-----------|
| Agências Digital | Reseller | 20% | Co-sell com seus clientes |
| Consultores SEO | Referral | 15% | Upsell após SEO |
| Contadores/Escritórios | Reseller | 20% | Incluir em pacote |
| Plataformas (Hotmart, etc) | Affiliate | 20% | Marketplace listing |
| Influenciadores | Affiliate | 15% | Endorsement |

### Setup de Parceria

```
MOU (Letter of Intent):
├─ Komissão model
├─ Termo de pagamento (NET 30)
├─ Territórios (opcional)
└─ Exclusividade (não aplicável inicialmente)

Recursos:
├─ White-label link / code
├─ Marketing materials (1-pager, email template, social)
├─ Dashboard de tracking
└─ Monthly calls

Suporte:
├─ Sales training (webinar)
├─ Demo script
├─ FAQ
└─ Dedicated Slack channel
```

---

## 🔟 ANNUAL GROWTH TARGETS

```
2026 (Year 1)
├─ Users: 5K
├─ Pagantes: 1K
├─ MRR: R$600K
├─ ARR: R$7.2M
├─ CAC: R$80
├─ LTV: R$2.5K
├─ LTV:CAC ratio: 31:1 ✅

2027 (Year 2)
├─ Users: 20K
├─ Pagantes: 3K
├─ MRR: R$1.8M
├─ ARR: R$21.6M
├─ CAC: R$100 (paid ads)
├─ LTV: R$3.5K
├─ LTV:CAC ratio: 35:1 ✅

2028 (Year 3)
├─ Users: 50K
├─ Pagantes: 7.5K
├─ MRR: R$4.5M
├─ ARR: R$54M
├─ CAC: R$120
├─ LTV: R$4.5K
├─ LTV:CAC ratio: 37:1 ✅
└─ Status: Ready for Series A
```

---

**Documento de estratégia de crescimento**  
**Executar em fases conforme produto matura**
