# 🚀 DEPLOY AGORA — 9 Passos Simples

**Tempo total:** ~30 minutos (+ 2-6h para DNS propagar)

---

## Passo 1: GitHub (Repositório Online)

```bash
# Terminal no projeto
git remote add origin https://github.com/SEU-USUARIO/caminho-digital.git
git branch -M main
git push -u origin main
```

**Antes de fazer isso:**
1. Acesse [github.com/new](https://github.com/new)
2. Crie repo: `caminho-digital` (público)
3. **Copie a URL HTTPS** fornecida

---

## Passo 2: Vercel Account

- Acesse [vercel.com](https://vercel.com)
- "Sign Up" → "Continue with GitHub"
- Autorize e complete cadastro

---

## Passo 3: Importar Projeto

- Vercel Dashboard → "+ Add New" → "Project"
- "Import Git Repository"
- Selecione `caminho-digital`
- "Import"

---

## Passo 4: Environment Variables (OBRIGATÓRIO)

**Antes de fazer Deploy, configure:**

### Gerar NEXTAUTH_SECRET

Terminal:
```bash
openssl rand -base64 32
# Copia o resultado
```

### Obter ANTHROPIC_API_KEY

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login
3. API Keys → Create Key
4. Copie a chave (tipo: `sk-ant-v0-...`)

### Adicionar no Vercel

Na tela do projeto, vá em **"Environment Variables"** e adicione:

| Nome | Valor |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (do passo acima) |
| `NEXTAUTH_SECRET` | (do `openssl` acima) |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | `https://turbinesuasredes.com.br` |
| `NEXTAUTH_URL` | `https://turbinesuasredes.com.br` |

---

## Passo 5: Deploy

Clique em **"Deploy"** (botão azul)

**Espere até aparecer "Production ✓"** (2-3 minutos)

---

## Passo 6: Domínio

Na aba **"Settings"** → **"Domains"**:

1. Clique "Add Domain"
2. Digite: `turbinesuasredes.com.br`
3. Vercel mostra 2 opções:

### Opção A: Nameservers (Recomendado)
- Copie os 4 nameservers
- Vá ao seu registrador (Registro.br, Namecheap, etc)
- Altere os nameservers
- Espere 2-6 horas

### Opção B: DNS Record
- Se o registrador não permitir mudar NS
- Adicione o A Record fornecido
- Espere 2-6 horas

---

## Passo 7: Verificar DNS (Depois de 2-6h)

Terminal:
```bash
nslookup turbinesuasredes.com.br
# Se resolver para IP do Vercel, está pronto!
```

---

## Passo 8: Testar Site

Após DNS propagar:

✅ Home: https://turbinesuasredes.com.br
✅ Diagnóstico: https://turbinesuasredes.com.br/diagnostico
✅ Dashboard: https://turbinesuasredes.com.br/dashboard
✅ Planos: https://turbinesuasredes.com.br/planos

---

## Passo 9: Lighthouse Score (Opcional)

Home → F12 → Lighthouse → Generate Report

**Targets:**
- Performance: ≥90 ✓
- Accessibility: ≥90 ✓
- Best Practices: ≥90 ✓
- SEO: ≥95 ✓

---

## ⏭️ Depois que Deploy Terminar

```
1. Supabase — Banco de dados
2. OAuth — Login Google/Meta
3. Stripe/Ticto — Pagamentos
4. Email — Notificações
5. Monitoring — Erros em produção
```

---

**Dúvidas?** WhatsApp: https://wa.me/554195976278
