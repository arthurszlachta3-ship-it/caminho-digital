# 💳 CAMINHO DIGITAL - INTEGRAÇÃO STRIPE + TICTO

## 1. ESTRATÉGIA DE PAGAMENTO

### Estrutura:
- **Stripe:** Pagamentos com cartão de crédito (International + Brasil)
- **Ticto:** PIX + Boleto (Brasil optimizado)
- **Modelo:** Subscription (SaaS) com cobrança recorrente

### Planos:
```
├─ Gratuito (R$0) - Diagnóstico único
├─ Estratégico (R$497/mês) - Acesso ao ERP + Agentes
└─ Premium (R$1.197/mês) - IA Master + Automação
```

---

## 2. CONFIGURAÇÃO STRIPE

### Pré-requisitos:
1. Criar conta em https://stripe.com
2. Ativar modo Live
3. Obter API Keys:
   - `STRIPE_SECRET_KEY` (sk_live_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
   - `STRIPE_WEBHOOK_SECRET` (whsec_...)

### Variáveis de Ambiente:
```env
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Criar Products e Prices no Stripe:

```javascript
// Script para criar produtos (executar uma vez no Stripe CLI)

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  // Produto: Plano Estratégico
  const estrategico = await stripe.products.create({
    name: "Plano Estratégico",
    description: "ERP Presença Digital com Agentes IA",
    metadata: {
      plan_type: "estrategico",
    },
  });

  // Price: Estratégico - Monthly
  const estrategicoPrice = await stripe.prices.create({
    product: estrategico.id,
    unit_amount: 49700, // R$497.00
    currency: "brl",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    metadata: {
      plan: "estrategico",
    },
  });

  // Produto: Plano Premium
  const premium = await stripe.products.create({
    name: "Plano Premium",
    description: "IA Master + Automação Completa",
    metadata: {
      plan_type: "premium",
    },
  });

  // Price: Premium - Monthly
  const premiumPrice = await stripe.prices.create({
    product: premium.id,
    unit_amount: 119700, // R$1.197.00
    currency: "brl",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    metadata: {
      plan: "premium",
    },
  });

  console.log("Produto Estratégico:", estrategico.id);
  console.log("Price Estratégico:", estrategicoPrice.id);
  console.log("Produto Premium:", premium.id);
  console.log("Price Premium:", premiumPrice.id);
}

createProducts();
```

---

## 3. CONFIGURAÇÃO TICTO

### Pré-requisitos:
1. Criar conta em https://ticto.com.br
2. Ativar Documentação
3. Obter API Keys:
   - `TICTO_API_KEY` (para requisições)
   - `TICTO_WEBHOOK_SECRET` (para webhooks)

### Variáveis de Ambiente:
```env
TICTO_API_KEY=xxxxx
TICTO_WEBHOOK_SECRET=xxxxx
```

---

## 4. ESTRUTURA DE CHECKOUT

### Arquivo: `app/checkout/page.tsx`

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const plan = searchParams.get("plan") || "estrategico";
  const paymentMethod = searchParams.get("method") || "stripe"; // stripe ou ticto

  const prices = {
    estrategico: {
      priceId: "price_xxxxx", // Do Stripe
      amount: 49700,
      display: "R$ 497,00/mês",
    },
    premium: {
      priceId: "price_xxxxx",
      amount: 119700,
      display: "R$ 1.197,00/mês",
    },
  };

  const handleCheckout = async () => {
    if (!session?.user?.id) {
      window.location.href = "/auth/login";
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === "stripe") {
        // Checkout via Stripe
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: prices[plan as keyof typeof prices].priceId,
            plan,
          }),
        });

        const session = await response.json();

        if (session.sessionId) {
          const stripe = await stripePromise;
          await stripe?.redirectToCheckout({
            sessionId: session.sessionId,
          });
        }
      } else if (paymentMethod === "ticto") {
        // Checkout via Ticto
        const response = await fetch("/api/ticto-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            amount: prices[plan as keyof typeof prices].amount,
          }),
        });

        const data = await response.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111] border border-[#222] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            {plan === "estrategico" ? "Plano Estratégico" : "Plano Premium"}
          </h1>

          <div className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981] rounded-lg">
            <p className="text-3xl font-bold text-[#10b981]">
              {prices[plan as keyof typeof prices].display}
            </p>
            <p className="text-gray-400 text-sm mt-2">Renovação automática</p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#10b981] hover:bg-[#10b981]/90 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "Processando..." : "Continuar com Stripe"}
            </button>

            <button
              onClick={() => {
                searchParams.set("method", "ticto");
                handleCheckout();
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "Processando..." : "Pagar com PIX/Boleto (Ticto)"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Cancelável a qualquer momento. Sem taxas ocultas.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. API ENDPOINT: STRIPE CHECKOUT

### Arquivo: `app/api/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { priceId, plan } = await req.json();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?plan=${plan}`,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
```

---

## 6. API ENDPOINT: TICTO CHECKOUT

### Arquivo: `app/api/ticto-checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TICTO_API_URL = "https://api.ticto.com.br";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { plan, amount } = await req.json();

  try {
    // Criar pedido/pagamento no Ticto
    const response = await fetch(`${TICTO_API_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TICTO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          email: session.user.email,
          name: session.user.name,
        },
        amount: amount, // em centavos
        currency: "BRL",
        description: `Plano ${plan === "estrategico" ? "Estratégico" : "Premium"}`,
        payment_method: "auto", // PIX ou Boleto
        metadata: {
          userId: session.user.id,
          plan,
        },
        return_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      }),
    });

    const data = await response.json();

    if (data.payment_url) {
      return NextResponse.json({ paymentUrl: data.payment_url });
    } else {
      throw new Error("No payment URL returned");
    }
  } catch (error) {
    console.error("Ticto error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
```

---

## 7. WEBHOOKS

### Stripe Webhook: `app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from("subscriptions")
          .upsert({
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            billing_period_start: new Date(
              subscription.current_period_start * 1000
            ),
            billing_period_end: new Date(
              subscription.current_period_end * 1000
            ),
          });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date() })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        await supabase
          .from("audit_logs")
          .insert({
            action: "payment_succeeded",
            resource_type: "subscription",
            details: { invoiceId: invoice.id },
          });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
```

---

## 8. GERENCIAR SUBSCRIPTIONS

### Arquivo: `lib/subscription.ts`

```typescript
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserSubscription(userId: string) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  // Cancelar no Stripe
  await stripe.subscriptions.del(subscriptionId);

  // Atualizar no Supabase
  await supabase
    .from("subscriptions")
    .update({
      status: "cancelled",
      cancelled_at: new Date(),
    })
    .eq("stripe_subscription_id", subscriptionId);
}

export async function changePlan(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
  });
}
```

---

## 9. SALVAR AUTO-DIAGNÓSTICOS

### Arquivo: `hooks/useAutoSaveDiagnostic.ts`

```typescript
import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAutoSaveDiagnostic(diagnosticData: any) {
  const { data: session } = useSession();

  const saveDiagnostic = useCallback(
    async (data: any) => {
      if (!session?.user?.id) return;

      try {
        // Insert or update diagnóstico
        const { data: result, error } = await supabase
          .from("diagnostics")
          .upsert(
            {
              user_id: session.user.id,
              ...data,
              status: "draft",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        if (error) throw error;

        return result;
      } catch (error) {
        console.error("Save diagnostic error:", error);
      }
    },
    [session?.user?.id]
  );

  // Auto-save a cada 30s
  useEffect(() => {
    if (!diagnosticData) return;

    const timer = setTimeout(() => {
      saveDiagnostic(diagnosticData);
    }, 30000);

    return () => clearTimeout(timer);
  }, [diagnosticData, saveDiagnostic]);

  return { saveDiagnostic };
}
```

---

## 10. VARIÁVEIS NECESSÁRIAS

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Ticto
TICTO_API_KEY=xxxxx
TICTO_WEBHOOK_SECRET=xxxxx
```

---

## 11. FLUXO COMPLETO DE PAGAMENTO

```
1. Usuário clica "Assinar Plano"
   ↓
2. Redireciona para /checkout?plan=estrategico
   ↓
3. Usuário escolhe método:
   - Stripe (Cartão)
   - Ticto (PIX/Boleto)
   ↓
4. Redireciona para checkout
   ↓
5. Pagamento processado
   ↓
6. Webhook recebe confirmação
   ↓
7. Subscription criada no Supabase
   ↓
8. Plan atualizado para "estrategico"
   ↓
9. Usuário redirecionado para /dashboard
```

---

## 12. PRÓXIMOS PASSOS

1. ✅ Criar conta Stripe Live
2. ✅ Criar conta Ticto
3. ✅ Criar Products e Prices no Stripe
4. ✅ Implementar checkout pages
5. ✅ Configurar webhooks
6. ✅ Testar fluxo completo
7. ✅ Implementar cancellation flow
8. ✅ Implementar dunning (retry automático)

