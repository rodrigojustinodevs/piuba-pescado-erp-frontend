# 🚀 Como Testar a Autenticação - Guia Rápido

## ⚡ Início Rápido

### 1. Iniciar o Servidor
```bash
pnpm dev
```

### 2. Acessar a Página de Login
Abra no navegador: **http://localhost:3000/login**

---

## 🎯 Teste Básico (5 minutos)

### ✅ Credenciais de Teste
- **Email**: `demo@dev.com`
- **Senha**: `password`

### 📝 Passos para Testar

1. **Acesse a página de login**
   - URL: `http://localhost:3000/login`
   - Você deve ver o formulário de login

2. **Teste de Validação**
   - Deixe o email vazio e clique em "Entrar"
   - **Esperado**: Mensagem "E-mail é obrigatório"
   - Digite email inválido (ex: "teste")
   - **Esperado**: Mensagem "E-mail inválido"
   - Digite senha com menos de 6 caracteres
   - **Esperado**: Mensagem "Senha deve ter no mínimo 6 caracteres"

3. **Teste de Login com Credenciais Inválidas**
   - Email: `teste@teste.com`
   - Senha: `senha123`
   - Clique em "Entrar"
   - **Esperado**: Mensagem de erro "Credenciais inválidas"

4. **Teste de Login com Credenciais Válidas** ⭐
   - Email: `demo@dev.com`
   - Senha: `password`
   - Clique em "Entrar"
   - **Esperado**: 
     - Botão muda para "Entrando..."
     - Redirecionamento automático para `/dashboard`
     - Página do dashboard aparece

5. **Teste de Proteção de Rota**
   - Estando logado, tente acessar `/login` diretamente
   - **Esperado**: Redirecionamento automático para `/dashboard`

6. **Teste de Logout**
   - Na página do dashboard, clique em "Sair"
   - **Esperado**: Redirecionamento para `/login`

---

## 🔍 Verificações Técnicas (Opcional)

### DevTools do Navegador (F12)

#### Console
- Não deve haver erros em vermelho
- Mensagens de erro devem ser tratadas

#### Network Tab
1. Faça login
2. Procure a requisição `POST /api/auth`
3. **Verificar**:
   - Status: `200 OK`
   - Response: `{"ok":true}`
   - Headers: `Set-Cookie: auth_token=...`

#### Application > Cookies
1. Após login, verifique os cookies
2. **Deve existir**: `auth_token`
3. **Propriedades**:
   - HttpOnly: ✅
   - Path: `/`
   - SameSite: `Lax`

#### React Query DevTools
- Ícone flutuante no canto inferior direito
- Clique para ver as queries e mutations
- Deve aparecer `["auth", "check"]` e mutations de login

---

## 🧪 Teste Automatizado (Script)

Execute o script de teste da API:

```bash
./test-auth.sh
```

Este script testa:
- ✅ Login com credenciais inválidas
- ✅ Login com credenciais válidas
- ✅ Verificação de autenticação
- ✅ Logout

---

## 📋 Checklist Completo

Para testes mais detalhados, consulte o arquivo **`TESTE_AUTENTICACAO.md**

### Testes Essenciais:
- [ ] Validação de formulário funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Login com credenciais válidas redireciona
- [ ] Dashboard é acessível após login
- [ ] Middleware protege rotas
- [ ] Logout funciona corretamente
- [ ] Cookie é criado/removido corretamente

---

## 🐛 Problemas Comuns

### "Cannot read property 'login' of undefined"
**Solução**: Verifique se o servidor está rodando e recarregue a página

### Erro 404 na API
**Solução**: Verifique se o arquivo `/app/api/auth/route.ts` existe

### Redirecionamento não funciona
**Solução**: Limpe o cache do navegador e cookies

### Validação não aparece
**Solução**: Verifique se o formulário está usando `react-hook-form` corretamente

---

## ✅ Resultado Esperado

Após todos os testes, você deve ter:
- ✅ Formulário validando corretamente
- ✅ Login funcionando com as credenciais de teste
- ✅ Redirecionamento automático após login
- ✅ Dashboard acessível apenas quando autenticado
- ✅ Logout funcionando
- ✅ Middleware protegendo rotas

---

## 📞 Próximos Passos

1. Integrar com backend real
2. Adicionar refresh token
3. Implementar "Lembrar-me"
4. Adicionar recuperação de senha
5. Implementar testes unitários




