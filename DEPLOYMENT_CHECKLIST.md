# 🚀 Deployment Checklist - Caminho Digital

**Status**: Phase 3-7 ✅ Complete | Phase 1-2 ⏳ Pending User Action

---

## FASE 1-2: Configuração de Domínio Vercel + DNS

### Pré-requisitos
- [ ] Conta Vercel criada e projeto importado
- [ ] Domínio `turbinesuasredes.com.br` registrado (identificar registrador)
- [ ] Acesso ao painel do registrador

### Passo 1: Adicionar Domínio no Vercel
1. Ir para Vercel Dashboard → Seu Projeto
2. Aba "Settings" → "Domains"
3. Clicar "Add Domain"
4. Digitar: `turbinesuasredes.com.br`
5. Clicar "Add Domain"
6. **Copiar os DNS records que aparecem** (CNAME ou A + AAAA)

### Passo 2: Configurar DNS no Registrador
1. Acessar painel do registrador (Registro.br, Namecheap, GoDaddy, etc.)
2. Ir para zona DNS do domínio `turbinesuasredes.com.br`
3. **Remover** registros DNS antigos (se houver)
4. **Adicionar** os registros que Vercel exibiu:
   - Se Vercel indicar CNAME: Criar CNAME record apontando para Vercel
   - Se Vercel indicar A/AAAA: Criar registros A/AAAA com IPs fornecidos
5. Salvar as mudanças

### Passo 3: Aguardar Propagação DNS
- DNS pode levar 2-6 horas para propagar globalmente
- Usar ferramenta: https://www.whatsmydns.net/
- Buscar: `turbinesuasredes.com.br`
- Esperar até todos os servidores globais apontarem para Vercel

### Passo 4: Validar SSL Certificate
1. Após DNS propagar, Vercel automaticamente emitirá certificado SSL
2. Verificar em Vercel Dashboard → Domains
3. Status deve mostrar: "Valid Configuration" ✅

### Passo 5: Testar HTTPS
```bash
curl -I https://turbinesuasredes.com.br
```
Esperado:
- Status: 200 ou 301 (redirecionamento para não-www)
- Header `Strict-Transport-Security`: Presente
- Header `X-Content-Type-Options: nosniff`: Presente

---

## FASE 8: Pós-Validação de Domínio

### ✅ Checklist de Validação

#### 1. Validar HTTPS & Redirects
- [ ] `https://turbinesuasredes.com.br` carrega corretamente
- [ ] `http://turbinesuasredes.com.br` redireciona para HTTPS (301)
- [ ] `https://www.turbinesuasredes.com.br` redireciona para non-www (301)
- [ ] `http://www.turbinesuasredes.com.br` redireciona para HTTPS + non-www (301)

#### 2. Validar Security Headers
```bash
curl -I https://turbinesuasredes.com.br
```

Headers obrigatórios:
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- [ ] `Content-Security-Policy: ...` (com trusted domains)

#### 3. Validar SEO & Metadata
- [ ] `curl https://turbinesuasredes.com.br | grep "og:title"` retorna Caminho Digital
- [ ] Título da página: "Caminho Digital - Turbine Suas Redes"
- [ ] Open Graph image: `/og-image.png` (1200x630)
- [ ] Canonical URL: `https://turbinesuasredes.com.br`

#### 4. Validar Robots & Sitemap
- [ ] `https://turbinesuasredes.com.br/robots.txt` carrega corretamente
- [ ] `https://turbinesuasredes.com.br/sitemap.xml` carrega corretamente
- [ ] Sitemap contém URLs esperadas (/, /login, /signup, /diagnostico, /planos, etc.)

#### 5. Testar com Ferramentas Online
- [ ] [SSL Labs](https://www.ssllabs.com/ssltest/) → Grade A ou melhor
- [ ] [Mozilla Observatory](https://observatory.mozilla.org/) → Score A
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) → Performance > 90
- [ ] [Security Headers](https://securityheaders.com/) → Grade A

#### 6. Social Media Debuggers
- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug/) → Valida OG tags
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) → Valida Twitter card
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) → Valida OG tags

---

## FASE SUPABASE: Configuração de Autenticação

### ✅ Supabase Authentication Setup

#### 1. Configurar Site URL e Redirect URLs
1. Ir para Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://turbinesuasredes.com.br`
3. **Redirect URLs**:
   ```
   https://turbinesuasredes.com.br/auth/callback/google
   https://turbinesuasredes.com.br/auth/callback/meta
   https://turbinesuasredes.com.br/api/auth/callback/google
   https://turbinesuasredes.com.br/api/auth/callback/meta
   http://localhost:3000/auth/callback/google
   http://localhost:3000/auth/callback/meta
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/meta
   ```
4. Salvar mudanças

#### 2. Configurar Google OAuth
1. Ir para Supabase → Authentication → Providers → Google
2. Habilitar provider
3. Inserir `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
4. Copiar Supabase Callback URL fornecida
5. Ir para Google Cloud Console
6. Adicionar em "Authorized JavaScript origins":
   - `https://turbinesuasredes.com.br`
   - `https://*.turbinesuasredes.com.br`
7. Adicionar em "Authorized Redirect URIs":
   - `https://turbinesuasredes.com.br/auth/callback/google`
   - `https://turbinesuasredes.com.br/api/auth/callback/google`
   - `http://localhost:3000/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`

#### 3. Configurar Meta/Facebook OAuth
1. Ir para Supabase → Authentication → Providers → Facebook
2. Habilitar provider
3. Inserir `META_CLIENT_ID` e `META_CLIENT_SECRET`
4. Ir para Facebook Developers
5. Adicionar em "Valid OAuth Redirect URIs":
   - `https://turbinesuasredes.com.br/auth/callback/meta`
   - `https://turbinesuasredes.com.br/api/auth/callback/meta`
   - `http://localhost:3000/auth/callback/meta`
   - `http://localhost:3000/api/auth/callback/meta`

---

## FASE VERCEL: Variáveis de Ambiente

### ✅ Configurar Environment Variables

1. Vercel Dashboard → Settings → Environment Variables
2. Adicionar **para Production** (turbinesuasredes.com.br):
   ```
   NEXT_PUBLIC_APP_URL = https://turbinesuasredes.com.br
   NEXTAUTH_URL = https://turbinesuasredes.com.br
   NEXTAUTH_SECRET = [gerar com: openssl rand -base64 32]
   
   DATABASE_URL = [Supabase Connection String]
   
   SUPABASE_URL = [Supabase URL]
   SUPABASE_ANON_KEY = [Supabase Anon Key]
   SUPABASE_SERVICE_ROLE_KEY = [Supabase Service Role Key]
   SUPABASE_AUTH_REDIRECT_TO = https://turbinesuasredes.com.br
   SUPABASE_AUTH_EXTERNAL_REDIRECT_URLS = https://turbinesuasredes.com.br
   
   GOOGLE_CLIENT_ID = [from Google Cloud Console]
   GOOGLE_CLIENT_SECRET = [from Google Cloud Console]
   
   META_CLIENT_ID = [from Facebook Developers]
   META_CLIENT_SECRET = [from Facebook Developers]
   
   CLAUDE_API_KEY = [from Anthropic Console]
   
   STRIPE_PUBLIC_KEY = [from Stripe Dashboard]
   STRIPE_SECRET_KEY = [from Stripe Dashboard]
   STRIPE_WEBHOOK_SECRET = [from Stripe Webhooks]
   
   TICTO_API_KEY = [from Ticto Dashboard]
   TICTO_WEBHOOK_SECRET = [from Ticto Webhooks]
   ```

3. **Para Preview/Development**:
   - Mesmo setup mas com URLs `http://localhost:3000`
   - Use `.env.local` localmente durante desenvolvimento

---

## FASE ASSETS: Imagens e Ícones

### ✅ Arquivo de Assets Criado
- [ ] Ler `public/ASSETS_README.md`
- [ ] Criar `favicon.ico` (32x32 ou 64x64)
- [ ] Criar `apple-icon.png` (180x180)
- [ ] Criar `og-image.png` (1200x630)
- [ ] Colocar arquivos em `public/`

---

## FASE 2: Sistema de Diagnóstico IA Premium

### ⏳ Próximas Features (após validação de domínio)

Componentes a desenvolver:
1. [ ] Landing Page (hero, CTAs, navegação)
2. [ ] Página de Diagnóstico Gratuito (formulário)
3. [ ] Integração com Claude API (análise de presença digital)
4. [ ] Geração de Diagnóstico (score, problemas, recomendações)
5. [ ] Modal de Resultados (score + 1 quick win + CTA)
6. [ ] Sistema de Login/Signup
7. [ ] Dashboard ERP (visão geral, módulos por canal)
8. [ ] Integração Stripe/Ticto (checkouts, webhooks)

---

## 🎯 Resumo do Caminho

```
✅ Fase 3-7: Configuração Complete
   └─ .env.production, Supabase Config, OAuth, SEO, Security Headers

⏳ Fase 1-2: Domínio Vercel + DNS (User Action)
   └─ Configurar turbinesuasredes.com.br em Vercel
   └─ Criar registros DNS no registrador
   └─ Aguardar propagação DNS (2-6h)

⏳ Fase 8: Validação Pós-Domain
   └─ Testar HTTPS, security headers, SEO, social media debuggers

⏳ Fase 2: Premium Diagnostic System
   └─ Desenvolver landing page, diagnóstico IA, dashboard ERP
```

---

**Próximo Passo**: Confirmação do status de deployment em Vercel e identificação do registrador de domínio.
