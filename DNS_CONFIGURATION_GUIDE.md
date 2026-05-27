# GUIA DE CONFIGURAÇÃO DNS — turbinesuasredes.com.br
**Data:** 26 de maio de 2026  
**Status:** Pronto para execução

---

## RESUMO EXECUTIVO

A aplicação Caminho Digital está **100% deployada e funcional no Vercel**. O única etapa faltando é **configurar os registros DNS em Registro.br** para apontar o domínio `turbinesuasredes.com.br` para os servidores Vercel.

**Tempo estimado:** 10 minutos para configuração + 2-6 horas de propagação DNS global

---

## ANTES DE COMEÇAR

Você precisa ter:
- ✅ Acesso à conta Registro.br (login e senha)
- ✅ Acesso ao painel de controle do domínio `turbinesuasredes.com.br`
- ✅ 10-15 minutos de tempo
- ✅ Navegador web (Chrome, Firefox, Safari, Edge)

---

## PASSO 1: Acessar Painel Registro.br

1. Abra em novo aba: **https://registro.br**
2. Clique em **"Fazer Login"**
3. Digite **CPF/CNPJ** e **Senha**
4. Clique em **"Entrar"**
5. Você será redirecionado para o painel de domínios

---

## PASSO 2: Localizar o Domínio turbinesuasredes.com.br

1. No painel, procure a seção **"Meus Domínios"** ou **"Domínios"**
2. Procure por **`turbinesuasredes.com.br`** na lista
3. Clique nele para abrir as configurações
4. Localize a aba **"Servidores DNS"** ou **"Zona DNS"**

---

## PASSO 3: Adicionar Registros DNS

### Método A: Via Nameservers (RECOMENDADO MAIS RÁPIDO)
Se o painel oferecer opção de usar "Nameservers", você pode usar:

```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

**Vantagem:** Vercel gerencia todo o DNS automaticamente  
**Tempo de propagação:** 2-4 horas

### Método B: Via Registros A/CNAME Manuais
Se o painel pedir para inserir registros manualmente:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| **A** | @ (ou `turbinesuasredes.com.br`) | `76.76.21.21` | 3600 |
| **CNAME** | www | `cname.vercel-dns.com.` | 3600 |
| **CNAME** | * (wildcard) | `cname.vercel-dns.com.` | 3600 |

**Detalhes importantes:**
- O registro **A** aponta o domínio raiz para Vercel
- O registro **CNAME** para `www` redireciona `www.turbinesuasredes.com.br`
- O **wildcard CNAME** aponta qualquer subdomínio para Vercel
- **NÃO esqueça o ponto final** (`.`) no final de `cname.vercel-dns.com.`

**Tempo de propagação:** 4-6 horas

---

## PASSO 4: Confirmar Configuração

Após adicionar os registros **AGUARDE 30 MINUTOS A 2 HORAS** (propagação inicial), depois:

### Opção A: Validar via Terminal/PowerShell

```powershell
# Abra PowerShell e execute:
nslookup turbinesuasredes.com.br
```

**Resultado esperado (Método A - Nameservers):**
```
Name:    turbinesuasredes.com.br
Addresses: 76.76.21.21
```

**Resultado esperado (Método B - A/CNAME):**
```
Name:    turbinesuasredes.com.br
Address: 76.76.21.21
```

### Opção B: Validar via Browser

Abra em nova aba:
```
https://turbinesuasredes.com.br
```

**Esperado:** Página de diagnóstico de Caminho Digital carrega

### Opção C: Validar via Vercel Dashboard

1. Acesse: https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/domains
2. Procure `turbinesuasredes.com.br`
3. Status deve mostrar: ✅ **Valid Configuration** ou **DNS OK**

---

## PASSO 5: Testar Endpoints

Após DNS resolver, teste cada endpoint:

### Homepage
```bash
curl https://turbinesuasredes.com.br -I
# Esperado: HTTP/1.1 200 OK
```

### API Diagnóstico
```bash
curl -X POST https://turbinesuasredes.com.br/api/diagnostico \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Pizzaria Teste",
    "businessType": "Food & Beverage",
    "instagram": "pizzaria_test"
  }'

# Esperado: Resposta JSON com diagnóstico
```

### Robots.txt
```bash
curl https://turbinesuasredes.com.br/robots.txt
# Esperado: Conteúdo robots.txt válido
```

### Sitemap.xml
```bash
curl https://turbinesuasredes.com.br/sitemap.xml
# Esperado: XML com URLs do site
```

### SSL/HTTPS Ativo
```bash
curl -I https://turbinesuasredes.com.br | grep -i "secure\|strict"
# Esperado: Strict-Transport-Security header presente
```

---

## TROUBLESHOOTING

### ❌ Problema: "Não consegui encontrar o domínio em Registro.br"

**Solução:**
1. Confirme que o domínio foi registrado (você deveria ter recebido email de confirmação)
2. Verifique se o domínio está ativo (pode estar em período de carência)
3. Contate suporte Registro.br: https://registro.br/support

---

### ❌ Problema: "DNS ainda não resolveu após 6 horas"

**Solução:**
1. Verifique o TTL dos registros (deve estar entre 300-3600 segundos)
2. Limpe cache DNS local:
   ```powershell
   # PowerShell (como Admin):
   ipconfig /flushdns
   ```
3. Teste com DNS público:
   ```bash
   nslookup turbinesuasredes.com.br 8.8.8.8
   # 8.8.8.8 = Google DNS
   ```

---

### ❌ Problema: "DNS resolveu mas site retorna erro 500"

**Possíveis causas:**
- Middleware em erro
- Variável de ambiente faltando
- Deployment incompleto

**Solução:** Verifique logs em:
https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/logs

---

## TIMELINE ESPERADA

| Tempo | Evento |
|-------|--------|
| T+0 min | Você configura DNS em Registro.br |
| T+30 min | DNS começa a propagar (alguns ISPs já resolvem) |
| T+1-2 h | Maioria dos clientes resolvem (DNS cache atualizado) |
| T+4-6 h | Propagação global completa |

**Você pode começar a testar IMEDIATAMENTE após configurar**, mas espere até T+1h para testes principais.

---

## VERIFICAÇÃO FINAL (Checklist)

Após DNS resolver, confirme que tudo está funcionando:

- [ ] `nslookup turbinesuasredes.com.br` retorna `76.76.21.21`
- [ ] https://turbinesuasredes.com.br carrega (não redirect error)
- [ ] POST /api/diagnostico retorna diagnóstico válido
- [ ] SSL está ativo (cadeado verde no navegador)
- [ ] Não há erros no Vercel dashboard
- [ ] Email de boas-vindas/confirmação foi enviado ao usuário

---

## PRÓXIMOS PASSOS (Após DNS OK)

1. **Fase 2 — Supabase Integration** (semana 1-2)
   - Executar schema SQL em Supabase
   - Configurar NextAuth.js com OAuth
   - Implementar autenticação de usuário
   - Salvar diagnósticos em banco de dados

2. **Phase 2 — Payment Integration** (semana 2-3)
   - Integrar Stripe Live  
   - Integrar Ticto (PIX/Boleto)
   - Implementar webhooks
   - Testes de transação

3. **Phase 2 — IA Agents** (semana 3-4)
   - Implementar 10 agentes especializados
   - Criar canais de comunicação de agentes
   - Implementar loop de feedback
   - Testes end-to-end

---

## SUPORTE

Caso encontre problemas:

**Registro.br Issues:**
- Email: suporte@registro.br
- Site: https://registro.br/support

**Vercel Issues:**
- Dashboard: https://vercel.com/support
- Docs: https://vercel.com/docs

**Caminho Digital Issues:**
- Logs: https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/logs
- Deployments: https://vercel.com/arthurszlachta3-ship-its-projects/caminho-digital/deployments

---

## INFORMAÇÕES TÉCNICAS (Referência)

**Detalhes da Configuração:**
```
Domínio: turbinesuasredes.com.br
Plataforma de Hospedagem: Vercel (Edge Serverless)
App URL: https://caminho-digital-n53shwas1-arthurszlachta3-ship-its-projects.vercel.app
Region: Washington, D.C. (iad1)
Build: Next.js 14.2.35 com TypeScript
API Key: ANTHROPIC_API_KEY configurada ✅
```

**Registros DNS:**
```
A Record: 76.76.21.21 (Vercel Edge IP)
CNAME: cname.vercel-dns.com (Vercel Management)
Nameservers: ns.vercel-dns.com (Opcional)
```

---

**Documento criado em:** 2026-05-26 10:47 UTC  
**Última atualização:** 2026-05-26 11:15 UTC  
**Status:** Pronto para execução
