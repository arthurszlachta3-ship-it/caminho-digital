# Guia de Deploy em Produção — Caminho Digital

## Status: Pronto para Deploy ✅

**Data:** 2026-05-23  
**Versão:** 1.0.0  
**Ambiente:** Vercel + Supabase + Anthropic API

---

## Pré-requisitos

- [x] Build local validado (0 erros)
- [x] Todas as 7 ETAPAs implementadas
- [x] Componentes e APIs testados
- [x] Variáveis de ambiente configuradas

## Checklist Deployment

### 1. Preparação Vercel
- [ ] Criar account Vercel (vercel.com)
- [ ] Conectar repositório GitHub
- [ ] Configurar project settings

### 2. Variáveis de Produção
Configure em Vercel Dashboard → Settings → Environment Variables:

```env
# App
NEXT_PUBLIC_APP_URL=https://turbinesuasredes.com.br
NEXTAUTH_URL=https://turbinesuasredes.com.br
NODE_ENV=production

# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk-ant-... (obter em console.anthropic.com)

# Supabase (quando integrado)
NEXT_PUBLIC_SUPABASE_URL=https://fjsxxfcghulqdwhhxafi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# OAuth (Google, Meta)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://turbinesuasredes.com.br/auth/callback/google

META_CLIENT_ID=...
META_CLIENT_SECRET=...
META_REDIRECT_URI=https://turbinesuasredes.com.br/auth/callback/meta

# Pagamentos (Stripe/Ticto)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

TICTO_API_KEY=...
TICTO_WEBHOOK_SECRET=...

# NextAuth
NEXTAUTH_SECRET=generate com: openssl rand -base64 32
```

### 3. Domínio turbinesuasredes.com.br
- [ ] Verificar registrador de domínio (Registro.br, Namecheap, etc)
- [ ] Apontar nameservers para Vercel
- [ ] Adicionar domínio em Vercel Dashboard
- [ ] Esperar propagação DNS (2-6 horas)
- [ ] Verificar SSL/TLS automático

**Registro DNS no Vercel:**
```
Tipo: A (ou CNAME)
Host: turbinesuasredes.com.br
Valor: [fornecido por Vercel]
```

### 4. Supabase Setup
- [ ] Criar project em supabase.com
- [ ] Obter SUPABASE_URL e ANON_KEY
- [ ] Criar tabelas (se necessário)
- [ ] Configurar autenticação OAuth
- [ ] Testar conexão

### 5. Anthropic API
- [ ] Gerar API key em console.anthropic.com
- [ ] Adicionar limite de custo mensal
- [ ] Testar endpoint /api/diagnostico

### 6. Deploy Vercel
```bash
# Opção 1: Via GitHub (recomendado)
git push origin main
# Vercel detecta e faz deploy automático

# Opção 2: Via Vercel CLI
npm i -g vercel
vercel
```

### 7. Pós-Deploy
- [ ] Verificar build logs em Vercel Dashboard
- [ ] Testar home page em https://turbinesuasredes.com.br
- [ ] Testar diagnóstico (/diagnostico)
- [ ] Testar dashboard (/dashboard)
- [ ] Testar planos (/planos)
- [ ] Verificar HTTPS certificate
- [ ] Validar Lighthouse scores (>90)
- [ ] Monitorar logs e erros

## Endpoints a Testar

```bash
# Diagnóstico (POST)
curl -X POST https://turbinesuasredes.com.br/api/diagnostico \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Teste","businessType":"varejo"}'

# Robots (GET)
curl https://turbinesuasredes.com.br/api/robots

# Sitemap (GET)
curl https://turbinesuasredes.com.br/api/sitemap
```

## Monitoramento em Produção

- **Vercel Analytics**: Automaticamente ativado
- **Sentry**: Para rastreamento de erros (opcional)
- **LogRocket**: Para session replay (opcional)

## Rollback

Se necessário fazer rollback:
```bash
vercel rollback
```

## Suporte

WhatsApp: https://wa.me/554195976278

---

**Status:** ✅ Pronto para Deploy  
**Próximo:** Executar checklist acima e publicar
