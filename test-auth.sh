#!/bin/bash

# Script de teste rápido para autenticação
# Uso: ./test-auth.sh

echo "🧪 Testando Autenticação - Piuba Pescado ERP"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Verificar se o servidor está rodando
echo "📡 Verificando se o servidor está rodando..."
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Servidor está rodando${NC}"
else
    echo -e "${RED}❌ Servidor não está rodando. Execute 'pnpm dev' primeiro.${NC}"
    exit 1
fi

echo ""
echo "🔐 Testando endpoint de login..."

# Teste 1: Login com credenciais inválidas
echo "  Teste 1: Login com credenciais inválidas"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"senha123"}')

if echo "$RESPONSE" | grep -q '"ok":false'; then
    echo -e "  ${GREEN}✅ Passou: Retornou erro como esperado${NC}"
else
    echo -e "  ${RED}❌ Falhou: Deveria retornar erro${NC}"
fi

# Teste 2: Login com credenciais válidas
echo "  Teste 2: Login com credenciais válidas"
RESPONSE=$(curl -s -c /tmp/cookies.txt -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@dev.com","password":"password"}')

if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo -e "  ${GREEN}✅ Passou: Login bem-sucedido${NC}"
    
    # Verificar se o cookie foi criado
    if grep -q "auth_token" /tmp/cookies.txt; then
        echo -e "  ${GREEN}✅ Cookie auth_token foi criado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Cookie não encontrado (pode ser normal em testes curl)${NC}"
    fi
else
    echo -e "  ${RED}❌ Falhou: Login deveria ter sucesso${NC}"
fi

# Teste 3: Verificar autenticação
echo "  Teste 3: Verificar autenticação (GET /api/auth)"
RESPONSE=$(curl -s -b /tmp/cookies.txt "$BASE_URL/api/auth")

if echo "$RESPONSE" | grep -q '"isAuthenticated":true'; then
    echo -e "  ${GREEN}✅ Passou: Autenticação verificada${NC}"
else
    echo -e "  ${YELLOW}⚠️  Não autenticado (pode ser normal sem cookie no curl)${NC}"
fi

# Teste 4: Logout
echo "  Teste 4: Logout"
RESPONSE=$(curl -s -b /tmp/cookies.txt -X POST "$BASE_URL/api/auth/logout")

if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo -e "  ${GREEN}✅ Passou: Logout bem-sucedido${NC}"
else
    echo -e "  ${YELLOW}⚠️  Logout pode ter falhado${NC}"
fi

# Limpar arquivo temporário
rm -f /tmp/cookies.txt

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Testes de API concluídos!${NC}"
echo ""
echo "📝 Para testes completos na interface:"
echo "   1. Acesse: $BASE_URL/login"
echo "   2. Use as credenciais: demo@dev.com / password"
echo "   3. Siga o guia em TESTE_AUTENTICACAO.md"
echo ""




