# ⚡ P0 ACTION PLAN - HOJE (2026-05-23)

**Prioridades absolutas para publicação do Caminho Digital**

---

## 1️⃣ DNS PROPAGATION STATUS

### Verificação Atual
```bash
$ nslookup turbinesuasredes.com.br 8.8.8.8

Servidor:  dns.google
Address:  8.8.8.8

Nome:    turbinesuasredes.com.br
```

**Status:** ⏳ **Em propagação** (expected 2-6 horas a partir de 2026-05-23 18:00 UTC)

### Timeline esperada
- **20:24 UTC:** Domínio registrado em Vercel
- **20:30-02:00 UTC:** Propagação global (esperado: 2-6 horas)
- **02:00-08:00 UTC (próximo dia):** 99% dos resolvers resolvem corretamente
- **Confirmação:** `nslookup turbinesuasredes.com.br` retorna IP Vercel (216.198.79.130)

### Monitorar com Script
```bash
#!/bin/bash
# Salvar como: check-dns.sh

until nslookup turbinesuasredes.com.br 8.8.8.8 | grep -q "216.198.79.130"; do
  echo "Ainda propagando... $(date)"
  sleep 30
done

echo "✅ DNS RESOLVIDO! $(date)"
curl https://turbinesuasredes.com.br/ -I | head -1
```

**Executar:**
```bash
chmod +x check-dns.sh
./check-dns.sh
```

---

## 2️⃣ ADICIONAR ANTHROPIC_API_KEY (P0 - CRÍTICO)

### Passo 1: Obter a Chave
1. Ir em: https://console.anthropic.com/account/keys
2. Fazer login com sua conta Anthropic
3. Copiar a chave ativa (começa com `sk-ant-...`)

### Passo 2: Adicionar em Vercel

**URL direta:**  
https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/settings/environment-variables

**Ou manualmente:**
1. Ir em https://vercel.com/dashboard
2. Clicar no projeto "caminho-digital"
3. Settings → Environment Variables
4. Clicar "Add new..."

### Passo 3: Preencher Formulário

| Campo | Valor |
|-------|-------|
| **Name** | `ANTHROPIC_API_KEY` |
| **Value** | `sk-ant-...` (colar a chave obtida) |
| **Environment** | ✅ Production |
| | ☐ Preview (deixar unchecked) |
| | ☐ Development (deixar unchecked) |

### Passo 4: Salvar e Fazer Redeploy

1. Clicar "Save"
2. Vercel perguntará: "Redeploy com novo environment variable?"
3. Clicar "Redeploy" (vai demorar ~2 min)
4. Esperar aparecer "✅ Production: Ready"

**Status após redeploy:**
```
Deployment: dpl_XXXXXXX (novo)
Status: Ready (Production)
Time: ~2 minutos
```

---

## 3️⃣ VALIDAÇÕES PÓS-REDEPLOY

### Checklist Imediato (5 min)

```
⏳ Redeploy em progresso...

Assim que terminar (status = "Ready"):

[ ] 1. Acessar homepage
      └─ URL: https://turbinesuasredes.com.br/ 
      └─ Esperar: Página carrega normalmente
      └─ Tempo: < 5s

[ ] 2. Acessar diagnóstico
      └─ URL: https://turbinesuasredes.com.br/diagnostico
      └─ Esperar: Formulário aparecer
      └─ Verificar: Não há erros no console

[ ] 3. Teste IA (submeter diagnóstico)
      └─ Preencher: Nome, negócio, redes sociais
      └─ Submeter: Clicar "Iniciar Diagnóstico"
      └─ Esperar: Resultado com score (aguardando backend)
      └─ Verificar: Resposta JSON válida (browser dev tools → Network)

[ ] 4. Verificar logs Vercel
      └─ URL: https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/deployments
      └─ Buscar: Deployment mais recente
      └─ Clicar: "View Function Logs"
      └─ Procurar: Erros relacionados a ANTHROPIC_API_KEY
      └─ Esperado: Nenhum erro "ANTHROPIC_API_KEY undefined"
```

### Se Houver Erro

**Erro: "ANTHROPIC_API_KEY not found"**
```
→ Verificar se ANTHROPIC_API_KEY está em Production (não Preview)
→ Fazer redeploy novamente após confirmar
→ Limpar cache: Ctrl+Shift+Del → limpar cookies/cache
```

**Erro: "Invalid API key"**
```
→ Verificar se a chave foi copiada completamente (sem espaços)
→ Tentar obter chave nova em console.anthropic.com
→ Salvar novamente em Vercel
```

**Erro: "Timeout"**
```
→ IA pode estar lenta (normal em primeira chamada)
→ Tentar novamente em 30s
→ Se persistir: verificar logs de erro em Sentry
```

---

## 4️⃣ MONITORAR DNS ENQUANTO AGUARDA

**Enquanto DNS propaga, você pode:**

1. ✅ **CONCLUÍDO:** Criar SAAS_SCALE_PLAN.md (scaling + custos + projeção)
2. ✅ **CONCLUÍDO:** Criar OPERATIONAL_ARCHITECTURE.md (P2)
3. ✅ **CONCLUÍDO:** Criar GROWTH_STRATEGY.md (P3)
4. **AGORA:** Executar P0 (DNS + API Key)
5. **AMANHÃ (quando DNS resolver):** Testar HTTPS + SSL + endpoints

---

## 5️⃣ QUANDO DNS RESOLVER

### Sinais de Resolução
```bash
# Confirmar que DNS propagou
$ nslookup turbinesuasredes.com.br

# Esperado:
# Name:    turbinesuasredes.com.br
# Address: 216.198.79.130 (Vercel IP)
```

### Validações HTTPS/SSL (tomar ~2-5 min depois que DNS resolver)

```
[ ] HTTPS está ativo?
    curl -I https://turbinesuasredes.com.br/
    └─ Esperado: HTTP/2 200 ✅
    └─ Header: "Strict-Transport-Security" presente ✅

[ ] SSL certificate válido?
    openssl s_client -connect turbinesuasredes.com.br:443 < /dev/null | grep -A5 subject
    └─ Esperado: CN=turbinesuasredes.com.br ✅
    └─ Issuer: Let's Encrypt (Vercel auto-provision) ✅

[ ] Redirect www → non-www?
    curl -I https://www.turbinesuasredes.com.br/
    └─ Esperado: HTTP 307 Redirect → https://turbinesuasredes.com.br/ ✅

[ ] Homepage carrega normalmente?
    curl https://turbinesuasredes.com.br/ | grep -c "<html"
    └─ Esperado: 1 (contém HTML) ✅
```

### Teste de Endpoints (no navegador)

```
1. Homepage
   https://turbinesuasredes.com.br/
   └─ Status: ✅ Carrega

2. Diagnóstico
   https://turbinesuasredes.com.br/diagnostico
   └─ Status: ✅ Carrega
   └─ Teste: Submeter diagnóstico
   └─ Resultado: Score + recomendações aparecem

3. Dashboard
   https://turbinesuasredes.com.br/dashboard
   └─ Status: ✅ Carrega (requer login)
   └─ Teste: Fazer login com Google
   └─ Resultado: Painel vazio mas funcional

4. Planos
   https://turbinesuasredes.com.br/planos
   └─ Status: ✅ Carrega
   └─ Teste: Clicar "Assinar Estratégico"
   └─ Resultado: Ir para checkout (payment não processado ainda)

5. APIs
   GET https://turbinesuasredes.com.br/api/robots
   └─ Esperado: { rules: [...] }
   
   GET https://turbinesuasredes.com.br/api/sitemap
   └─ Esperado: XML com sitemap
```

---

## 6️⃣ TIMELINE RESUMIDA

```
AGORA (2026-05-23 20:45 UTC)
├─ [ ] Adicionar ANTHROPIC_API_KEY (15 min)
├─ [ ] Redeploy (2 min)
└─ [ ] Validações (5 min)
└─ Total: ~25 min

PRÓXIMAS 2-6 HORAS
├─ Monitorar: DNS propagação
├─ Documenta: P0/P1/P2/P3 estratégia (CONCLUÍDO ✅)
└─ Preparar: Phase 2 infrastructure (Supabase setup)

AMANHÃ (assim que DNS resolver)
├─ [ ] Validar HTTPS + SSL
├─ [ ] Validar redirect www
├─ [ ] Validar todos endpoints
├─ [ ] Teste de IA end-to-end
└─ [ ] FINAL TEST: Fazer diagnóstico completo com IA

SEMANA 1 (após DNS estável)
├─ [ ] Supabase project criado
├─ [ ] Schema SQL executado
├─ [ ] NextAuth configurado
├─ [ ] Google OAuth testado
└─ [ ] BETA READY

SEMANA 2-4
├─ [ ] Meta OAuth implementado
├─ [ ] Auto-save diagnósticos funcionando
├─ [ ] Dashboard com dados reais
├─ [ ] Stripe integration live
└─ [ ] ALPHA LAUNCH
```

---

## 7️⃣ CONTACT & EMERGENCY

### Se Algo Não Funcionar

1. **Verificar logs:** https://vercel.com/.../deployments → "View Function Logs"
2. **Verificar console:** Browser DevTools → Console/Network
3. **Verificar DNS:** Aguardar ou usar alternativa temporária
4. **Contact:**
   - Vercel Support: https://vercel.com/support
   - Anthropic Status: https://status.anthropic.com

### Rollback se Necessário

Se redeploy quebrou algo:
```
1. Ir em Vercel Dashboard
2. Deployments → Previous deployment
3. Clicar "Promote to Production"
4. Sistema volta para versão anterior em ~10s
```

---

## 📋 CHECKLIST FINAL P0

```
IMPLEMENTAÇÃO:
[ ] ANTHROPIC_API_KEY obtida (console.anthropic.com)
[ ] Adicionada em Vercel → Environment Variables
[ ] Production selecionado (não Preview)
[ ] Redeploy disparado e completou (status = Ready)
[ ] Nenhum erro nos logs de deployment

VALIDAÇÃO:
[ ] Homepage carrega sem erro
[ ] /diagnostico formulário aparece
[ ] Submeter diagnóstico → IA responde
[ ] JSON retornado é válido
[ ] Score 0-100 aparece
[ ] Recomendações aparecem

DOCUMENTAÇÃO:
[ ] SAAS_SCALE_PLAN.md criado (scaling + custos + projeção)
[ ] OPERATIONAL_ARCHITECTURE.md criado (P2 - arquitetura operacional)
[ ] GROWTH_STRATEGY.md criado (P3 - crescimento)
[ ] P0_ACTION_PLAN.md criado (este arquivo - ações imediatas)

DNS:
[ ] Monitorando propagação
[ ] Script check-dns.sh pronto
[ ] Será validado quando resolver

PRÓXIMO PASSO:
[ ] Assim que DNS resolver → Validar HTTPS + SSL
[ ] Completar Phase 2 infrastructure (Supabase)
```

---

**Plano de ação P0**  
**Atualizar à medida que progride**  
**Target:** Concluído em < 30 minutos
