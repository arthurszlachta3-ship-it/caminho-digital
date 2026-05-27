#!/bin/bash

echo "🔍 Monitorando propagação DNS para turbinesuasredes.com.br"
echo "=================================================="
echo ""

DOMAIN="turbinesuasredes.com.br"
VERCEL_IP="216.198.79.130"
CHECK_INTERVAL=30

check_dns() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Verificando $DOMAIN..."
  
  # Try nslookup
  RESULT=$(nslookup $DOMAIN 2>/dev/null)
  
  if echo "$RESULT" | grep -q "Address"; then
    IP=$(echo "$RESULT" | grep "Address:" | tail -1 | awk '{print $2}')
    echo "✅ DNS Resolvido: $IP"
    
    # Check if it's pointing to Vercel
    if [ "$IP" = "$VERCEL_IP" ] || echo "$RESULT" | grep -q "vercel"; then
      echo "✅ Apontando corretamente para Vercel"
      return 0
    else
      echo "⚠️  IP não parece ser Vercel. Aguardando..."
      return 1
    fi
  else
    echo "⏳ DNS ainda não resolvido globalmente"
    return 1
  fi
}

# Check immediately
if check_dns; then
  echo ""
  echo "=================================================="
  echo "🎉 DNS PROPAGADO! Pronto para testes."
  echo "Você pode agora testar:"
  echo "  - https://turbinesuasredes.com.br"
  echo "  - https://turbinesuasredes.com.br/diagnostico"
  echo "  - https://turbinesuasredes.com.br/dashboard"
  exit 0
fi

echo ""
echo "Próxima verificação em $CHECK_INTERVAL segundos..."
echo "Pressione Ctrl+C para cancelar"
echo ""

# Loop monitoring
while true; do
  sleep $CHECK_INTERVAL
  if check_dns; then
    echo ""
    echo "=================================================="
    echo "🎉 DNS PROPAGADO! Pronto para testes."
    echo "Você pode agora testar:"
    echo "  - https://turbinesuasredes.com.br"
    echo "  - https://turbinesuasredes.com.br/diagnostico"
    echo "  - https://turbinesuasredes.com.br/dashboard"
    exit 0
  fi
done
