# 🌐 Guia de Configuração DNS — turbinesuasredes.com.br

**Domínio**: turbinesuasredes.com.br  
**Hosting**: Vercel  
**Tipo**: SaaS  
**Status**: Pronto para configuração DNS

---

## PASSO 1️⃣ — Adicionar Domínio em Vercel

### Local: Vercel Dashboard

1. **Ir para seu projeto** → `Settings` → `Domains`
2. **Clicar em** `Add Domain`
3. **Digitar**: `turbinesuasredes.com.br`
4. **Clicar em** `Add Domain`
5. **IMPORTANTE**: Copiar os registros DNS que aparecem

---

## PASSO 2️⃣ — Tipos de Registros DNS

Vercel fornecerá DOIS tipos de opções:

### OPÇÃO A: CNAME (Mais Comum)

```
Nome/Host:     @  (ou www)
Tipo:          CNAME
Valor/Target:  cname.vercel-dns.com.
TTL:           3600 (1 hora)
```

**Quando usar**: Se seu registrador permite CNAME no root domain

### OPÇÃO B: A/AAAA Records (IP Diretos)

```
Nome/Host:     @
Tipo:          A
Valor:         76.76.19.1  (exemplo - seu será diferente)
TTL:           3600

Nome/Host:     @
Tipo:          AAAA
Valor:         2606:4700:4700::1111  (exemplo)
TTL:           3600
```

**Quando usar**: Se CNAME não funcionar ou registrador não permite

### Para WWW (Sempre CNAME)

```
Nome/Host:     www
Tipo:          CNAME
Valor:         cname.vercel-dns.com.
TTL:           3600
```

---

## PASSO 3️⃣ — Registradores Conhecidos

Instruções por tipo de registrador que pode estar usando:

### Registro.br (Brasil)

1. **Login**: https://registro.br
2. **Meus Domínios** → Seu domínio
3. **Editar** → Servidores DNS ou zona
4. **Substituir** registros antigos pelos de Vercel
5. **Salvar mudanças**

### Namecheap

1. **Domain List** → Seu domínio
2. **Manage** → Advanced DNS
3. **Adicionar/Editar** registros
4. **Host**: `@` ou `www`
5. **Type**: `CNAME` ou `A`
6. **Value**: Conforme Vercel
7. **Save**

### GoDaddy

1. **Manage My Domains**
2. **DNS** (ou Domain Settings)
3. **Edit DNS Records**
4. **Adicionar registros** A ou CNAME
5. **Save**

### Google Domains (Google Cloud)

1. **Meus domínios** → Seu domínio
2. **DNS** → Registros DNS personalizados
3. **Criar registros** (A, CNAME, AAAA)
4. **Salvar**

---

## PASSO 4️⃣ — Configuração Passo-a-Passo

### Exemplo Real (CNAME):

**Assumindo que Vercel forneceu**: `cname.vercel-dns.com.`

```
┌─────────────────────────────────────┐
│ Registrador DNS (seu painel)        │
├─────────────────────────────────────┤
│                                     │
│ Adicionar registro:                 │
│                                     │
│ Nome:  @                            │
│ Tipo:  CNAME                        │
│ Valor: cname.vercel-dns.com.        │
│ TTL:   3600                         │
│                                     │
│ [Salvar]                            │
│                                     │
│ Adicionar outro:                    │
│                                     │
│ Nome:  www                          │
│ Tipo:  CNAME                        │
│ Valor: cname.vercel-dns.com.        │
│ TTL:   3600                         │
│                                     │
│ [Salvar]                            │
│                                     │
└─────────────────────────────────────┘
```

---

## PASSO 5️⃣ — Validar Propagação DNS

### Usando WhatIsMyDNS.net

1. **Ir para**: https://www.whatsmydns.net/
2. **Digitar domínio**: `turbinesuasredes.com.br`
3. **Type**: `A` (para IP) ou `CNAME` (para alias)
4. **Clicar em Search**
5. **Observar**: Mapa mundi mostrando qual IP/servidor cada localização está vendo

**O que esperar**:
- 🟢 Verde = Apontando para Vercel (Correto)
- 🔴 Vermelho = Ainda apontando para servidor antigo (Aguarde)
- ⚪ Cinza = DNS ainda não resolvendo

**Tempo típico**: 2-6 horas para propagação completa

### Método Alternativo (Terminal/PowerShell)

```powershell
# Verificar record A
nslookup turbinesuasredes.com.br

# Verificar CNAME
nslookup turbinesuasredes.com.br -type=cname

# Verbose (mostra detalhes)
nslookup -d turbinesuasredes.com.br
```

**Esperado**:
```
Name:    turbinesuasredes.com.br
Address: 76.76.19.1  (IP de Vercel)
```

---

## PASSO 6️⃣ — Validar SSL Certificate

**Depois que DNS propagar:**

1. **Ir para Vercel Dashboard**
2. **Settings** → **Domains**
3. **Seu domínio** (turbinesuasredes.com.br)
4. **Status deve mostrar**: ✅ `Valid Configuration`

Se mostrar ❌ erro:
- Aguarde mais 15 minutos (propagação ainda em progresso)
- Ou clique "Verify" para force-check

**Vercel automaticamente:**
- Detectará o domínio apontado
- Solicitará certificado SSL via Let's Encrypt
- Instalará em ~30 minutos

---

## PASSO 7️⃣ — Testar HTTPS

Depois que SSL estiver válido:

```powershell
# Testar HTTPS
invoke-webrequest https://turbinesuasredes.com.br -headers @{"Accept" = "text/html"}

# Esperado:
# StatusCode        : 200
# StatusDescription : OK
```

**Testes online**:
- https://www.ssl-shopper.com/ssl-checker.html
- https://www.ssllabs.com/ssltest/

---

## CHECKLIST DNS

### Antes de Começar
- [ ] Projeto em Vercel criado
- [ ] Domínio `turbinesuasredes.com.br` registrado
- [ ] Acesso ao painel do registrador
- [ ] Verificou qual registrador gerencia o domínio

### Configuração
- [ ] Acessou Vercel Dashboard
- [ ] Clicou em `Settings` → `Domains`
- [ ] Adicionou `turbinesuasredes.com.br`
- [ ] Copiou registros DNS (CNAME ou A/AAAA)

### DNS Setup
- [ ] Fez login no registrador
- [ ] Removeu registros antigos
- [ ] Adicionou registro `@` → CNAME/A
- [ ] Adicionou registro `www` → CNAME
- [ ] Salvou mudanças

### Validação
- [ ] Abriu https://www.whatsmydns.net/
- [ ] Verificou domínio (aguardou propagação)
- [ ] Todos os IPs globais apontam para Vercel ✅
- [ ] Vercel Dashboard mostra "Valid Configuration" ✅
- [ ] HTTPS funciona (sem erros SSL) ✅

### Pós-Setup
- [ ] Visitou https://turbinesuasredes.com.br
- [ ] Landing page carrega
- [ ] SEO meta tags visíveis
- [ ] HTTPS está forçado (http redireciona)
- [ ] Performance é rápida

---

## Troubleshooting

### "DNS não está propagando"
- Aguarde 2-6 horas
- Limpe cache do navegador (Ctrl+Shift+Del)
- Tente em navegador anônimo
- Use https://www.whatsmydns.net/ para status global

### "SSL certificate não valida"
- Aguarde 15-30 minutos após DNS propagar
- Clique "Verify" em Vercel
- Se continuar, contate Vercel support

### "Ainda apontando para servidor antigo"
- Verifique se salvou as mudanças DNS
- Verifique se removeu registros conflitantes
- Use WhatIsMyDNS.net para localizar problema

### "HTTPS error: Mixed content"
- Certifique-se de que vercel.json força HTTPS
- Middleware.ts deve redirecionar HTTP → HTTPS
- Limpe cache do navegador

---

## Informações de Contato

Se tiver problemas:

**Vercel Support**: https://vercel.com/help  
**Let's Encrypt**: https://letsencrypt.org/

---

## Timeline Esperado

```
Passo                         Tempo
─────────────────────────────────────
Adicionar domínio em Vercel   5 min
Configurar DNS no registrador 5 min
Aguardar propagação DNS       2-6h
SSL certificate válido        30 min
HTTPS funcional               30 min
─────────────────────────────────────
Total                         ~3-8h
```

---

**Próximo**: Após DNS estar propagado, prosseguir para ETAPA 5 (Sistema de Diagnóstico IA)

**Generated**: 2026-05-22
