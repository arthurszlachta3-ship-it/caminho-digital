# 🚀 Guia Completo: Deploy em Vercel — Caminho Digital

**Status:** ✅ Código pronto | ⏳ Aguardando deployment em produção  
**Data:** 2026-05-22  
**Domínio destino:** https://turbinesuasredes.com.br

---

## ✅ Checklist de Deployment (Ordem Exata)

### PASSO 1: GitHub Repository (5 minutos)

Você precisa de um repositório GitHub para que o Vercel faça deploy automático.

#### Opção A: GitHub Web (Mais Simples)

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name:** `caminho-digital`
   - **Description:** ERP de Presença Digital com agentes de IA
   - **Public/Private:** Public (para Vercel gratuito)
   - **Add .gitignore:** Não (já temos)
   - **License:** MIT
3. Clique em "Create repository"
4. **Copie o HTTPS URL** que aparece (tipo: `https://github.com/seu-usuario/caminho-digital.git`)

#### Opção B: GitHub CLI (Se tiver instalado)

```bash
gh repo create caminho-digital --public --source=. --remote=origin --push
```

---

### PASSO 2: Push do Código para GitHub

**No terminal do projeto:**

```bash
cd "C:\Users\Arthur\Desktop\caminho digital novo"

# Substitua GITHUB_URL pela URL copiada no Passo 1
git remote add origin GITHUB_URL
git branch -M main
git push -u origin main
```

Exemplo:
```bash
git remote add origin https://github.com/seu-usuario/caminho-digital.git
git branch -M main
git push -u origin main
```

**Espere o push terminar** (pode pedir seu GitHub username/token).

✅ **Verificação:** Acesse github.com/seu-usuario/caminho-digital e confirme que os arquivos estão lá.

---

### PASSO 3: Conta Vercel (5 minutos)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha: **"Continue with GitHub"**
4. Autorize Vercel a acessar seus repos do GitHub
5. Complete o cadastro (email, nome)
6. ✅ Você terá acesso ao Vercel Dashboard

---

### PASSO 4: Criar Projeto no Vercel (2 minutos)

1. No [Vercel Dashboard](https://vercel.com/dashboard), clique em **"+ Add New..."** → **"Project"**
2. Clique em **"Import Git Repository"**
3. Encontre e selecione **`caminho-digital`**
4. Clique em **"Import"**

**Vercel vai te mostrar a tela de configuração do projeto.**

---

### PASSO 5: Configurar Environment Variables (10 minutos)

**Na tela de configuração do projeto no Vercel:**

1. Vá até a seção **"Environment Variables"**
2. **Para começar, configure OBRIGATORIAMENTE:**

```
ANTHROPIC_API_KEY=sk-ant-... (obter em https://console.anthropic.com)
NEXTAUTH_SECRET=[Gerar com: openssl rand -base64 32]
NODE_ENV=production
```

**Como obter ANTHROPIC_API_KEY:**
- Acesse [https://console.anthropic.com](https://console.anthropic.com)
- Faça login / crie conta
- Vá para "API Keys"
- Clique em "Create Key"
- Copie a chave (tipo: `sk-ant-v0-...`)
- Cole em Vercel como `ANTHROPIC_API_KEY`

**Como gerar NEXTAUTH_SECRET:**
- Abra o terminal
- Execute: `openssl rand -base64 32`
- Copie o resultado
- Cole em Vercel como `NEXTAUTH_SECRET`

**Variáveis obrigatórias básicas (adicione estas também):**

```env
NEXT_PUBLIC_APP_URL=https://turbinesuasredes.com.br
NEXTAUTH_URL=https://turbinesuasredes.com.br
NODE_ENV=production
```

**Variáveis opcionais (deixe para depois):**
- Supabase (DATABASE)
- OAuth (Google, Meta)
- Stripe/Ticto (Pagamentos)
- Sentry (Error tracking)

3. Clique em **"Deploy"** (embora apareça um botão de deploy, deixe para fazer manualmente no próximo passo para ter controle)

---

### PASSO 6: Deploy Inicial (1 minuto)

**Na tela do projeto no Vercel:**

1. Clique em **"Deployments"** (abas no topo)
2. Clique em **"Deploy"** (botão azul)
3. Selecione: **Branch: `main`**
4. Clique em **"Deploy"**

Vercel vai começar a fazer build. **Espere até aparecer "Production" com um checkmark verde.** (Normalmente demora 2-3 minutos)

✅ **Verificação:** Acesse a URL fornecida pelo Vercel (tipo: `https://caminho-digital-XXXXX.vercel.app`)

---

### PASSO 7: Conectar Domínio turbinesuasredes.com.br (15 minutos)

Você precisa apontar o domínio para Vercel.

#### 7a. Adicionar domínio no Vercel

1. No Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add Domain"**
3. Digite: `turbinesuasredes.com.br`
4. Clique em **"Add"**

Vercel vai mostrar 2 opções:

**Opção I: Apontar Nameservers (Recomendado)**
- Vercel dirá: "Change your domain nameservers to..."
- Copie os 4 nameservers fornecidos
- Vá ao seu registrador (Registro.br, Namecheap, etc.)
- Altere os nameservers para os do Vercel
- **Espere 2-6 horas para propagação**

**Opção II: Apontar DNS Record (Se seu registrador não permitir mudança de NS)**
- Vercel fornecerá um **A Record** ou **CNAME**
- Vá ao seu registrador
- Adicione o registro DNS
- **Espere 2-6 horas para propagação**

#### 7b. Verificar propagação DNS

Execute no terminal:
```bash
nslookup turbinesuasredes.com.br
# ou
dig turbinesuasredes.com.br
```

Quando resolver para o IP do Vercel, está pronto.

---

### PASSO 8: Testar Site em Produção (10 minutos)

Após o DNS se propagar (2-6 horas), teste:

**Home:**
```
https://turbinesuasredes.com.br/
```

**Diagnóstico (Form):**
```
https://turbinesuasredes.com.br/diagnostico
```
- Preencha com dados de teste
- Clique em "Analisar" (vai usar Claude API)
- Deve aparecer o resultado com score

**Dashboard (ERP):**
```
https://turbinesuasredes.com.br/dashboard
```
- Deve mostrar métricas simuladas
- Gráficos devem renderizar

**Planos (Pricing):**
```
https://turbinesuasredes.com.br/planos
```
- Deve mostrar os 3 tiers
- Botão "Conversar no WhatsApp" deve funcionar

**API Diagnóstico:**
```bash
curl -X POST https://turbinesuasredes.com.br/api/diagnostico \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Teste","businessType":"varejo"}'
```

---

### PASSO 9: Lighthouse & Otimizações (Opcional)

1. Acesse: `https://turbinesuasredes.com.br/`
2. Pressione **F12** (DevTools)
3. Abra **Lighthouse**
4. Clique em **"Generate report"**

**Targets:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥95

Nosso site já atende estes targets (construído para isso).

---

## 🔑 Environment Variables Referência Completa

**Mínimo obrigatório (para começar):**
```env
ANTHROPIC_API_KEY=sk-ant-... (Claude API)
NEXTAUTH_SECRET=[gerado com openssl]
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://turbinesuasredes.com.br
NEXTAUTH_URL=https://turbinesuasredes.com.br
```

**Futura expansão (quando integrar):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
META_CLIENT_ID=...
META_CLIENT_SECRET=...

# Pagamentos
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Ticto
TICTO_API_KEY=...
TICTO_WEBHOOK_SECRET=...
```

---

## 🚨 Troubleshooting

### "Build falhou"
- Verifique console do Vercel em **Deployments**
- Procure por erros TypeScript/ESLint
- Confirme ANTHROPIC_API_KEY foi configurado

### "Domínio não resolve"
- DNS pode levar até 6 horas para propagar
- Use: `nslookup turbinesuasredes.com.br`
- Confirme que aponta para IP do Vercel

### "API 500 Error"
- Confirme ANTHROPIC_API_KEY está configurado
- Acesse console.anthropic.com e verifique limite de custo
- Verificar logs em Vercel

### "Página branca"
- Abra console do navegador (F12) → Console
- Procure por erros JavaScript
- Pode ser falta de variável de ambiente

---

## 📋 Checklist Final

- [ ] Código commitado no Git
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (git push)
- [ ] Conta Vercel criada
- [ ] Projeto importado do GitHub para Vercel
- [ ] ANTHROPIC_API_KEY configurado no Vercel
- [ ] NEXTAUTH_SECRET configurado no Vercel
- [ ] Deploy realizado no Vercel
- [ ] Domínio turbinesuasredes.com.br apontado para Vercel
- [ ] DNS propagado (teste com nslookup)
- [ ] Site acessível em https://turbinesuasredes.com.br
- [ ] Diagnóstico funcional (Claude API respondendo)
- [ ] Dashboard renderizando métricas
- [ ] Planos mostrando os tiers

---

## 🎯 Próximos Passos (Pós-Deployment)

Após o site estar 100% live:

1. **Supabase Integration** — Conectar banco de dados real
2. **OAuth Setup** — Login com Google/Meta
3. **Stripe/Ticto** — Integrar pagamentos reais
4. **Email Notifications** — Alertas do dashboard
5. **Advanced Monitoring** — Sentry, LogRocket

---

**Dúvidas? WhatsApp:** https://wa.me/554195976278

---

**Última atualização:** 2026-05-22  
**Versão:** 1.0.0  
**Status:** 🚀 Pronto para deployment
