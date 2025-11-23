# 🧪 Guia de Testes - Autenticação

## 📋 Pré-requisitos

1. Certifique-se de que todas as dependências estão instaladas:
```bash
pnpm install
```

2. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

3. Acesse: `http://localhost:3000`

---

## ✅ Checklist de Testes

### 1. **Teste de Validação de Formulário**

#### 1.1. Campo Email Vazio
- [ ] Deixar campo email vazio
- [ ] Clicar em "Entrar"
- [ ] **Esperado**: Mensagem "E-mail é obrigatório" aparece abaixo do campo

#### 1.2. Email Inválido
- [ ] Digitar email inválido (ex: "teste" ou "teste@")
- [ ] Clicar em "Entrar"
- [ ] **Esperado**: Mensagem "E-mail inválido" aparece abaixo do campo

#### 1.3. Campo Senha Vazio
- [ ] Preencher email válido (ex: "teste@teste.com")
- [ ] Deixar senha vazia
- [ ] Clicar em "Entrar"
- [ ] **Esperado**: Mensagem "Senha é obrigatória" aparece abaixo do campo

#### 1.4. Senha Curta
- [ ] Preencher email válido
- [ ] Digitar senha com menos de 6 caracteres (ex: "12345")
- [ ] Clicar em "Entrar"
- [ ] **Esperado**: Mensagem "Senha deve ter no mínimo 6 caracteres" aparece

---

### 2. **Teste de Login com Credenciais Inválidas**

- [ ] Preencher email: `teste@teste.com`
- [ ] Preencher senha: `senha123`
- [ ] Clicar em "Entrar"
- [ ] **Esperado**: 
  - Botão mostra "Entrando..." durante o processo
  - Mensagem de erro aparece: "Credenciais inválidas" ou "Invalid credentials"
  - Botão volta ao estado normal

---

### 3. **Teste de Login com Credenciais Válidas**

#### Credenciais de Teste:
- **Email**: `test@example.com`
- **Senha**: `password`

#### Passos:
- [ ] Preencher email: `test@example.com`
- [ ] Preencher senha: `password`
- [ ] Clicar em "Entrar"
- [ ] **Esperado**:
  - Botão mostra "Entrando..." e fica desabilitado
  - Não aparece mensagem de erro
  - Redirecionamento automático para `/dashboard` (ou página inicial se não existir)
  - Cookie `auth_token` é criado (verificar no DevTools > Application > Cookies)

---

### 4. **Teste de Estado de Loading**

- [ ] Preencher credenciais válidas
- [ ] Clicar em "Entrar"
- [ ] **Esperado**:
  - Botão muda para "Entrando..."
  - Botão fica desabilitado (não pode clicar novamente)
  - Inputs ficam desabilitados (opcional, mas boa prática)

---

### 5. **Teste de Redirecionamento após Login**

- [ ] Fazer login com credenciais válidas
- [ ] **Esperado**:
  - URL muda para `/dashboard` (ou página inicial)
  - Se tentar acessar `/login` novamente, deve redirecionar para `/dashboard` (middleware)

---

### 6. **Teste de Middleware - Proteção de Rotas**

#### 6.1. Acesso sem Autenticação
- [ ] Fazer logout (se estiver logado)
- [ ] Tentar acessar `/dashboard` diretamente na URL
- [ ] **Esperado**: Redirecionamento automático para `/login`

#### 6.2. Acesso com Autenticação
- [ ] Fazer login com credenciais válidas
- [ ] Tentar acessar `/login` diretamente na URL
- [ ] **Esperado**: Redirecionamento automático para `/dashboard`

---

### 7. **Teste de Logout** (se implementado na UI)

- [ ] Estar logado
- [ ] Clicar em botão de logout
- [ ] **Esperado**:
  - Cookie `auth_token` é removido
  - Redirecionamento para `/login`
  - Não consegue mais acessar rotas protegidas

---

### 8. **Teste de Persistência de Sessão**

- [ ] Fazer login com credenciais válidas
- [ ] Fechar a aba do navegador
- [ ] Abrir novamente e acessar `/dashboard`
- [ ] **Esperado**: Ainda está autenticado (cookie persiste por 7 dias)

---

## 🔍 Verificações Técnicas (DevTools)

### Console do Navegador
1. Abra DevTools (F12)
2. Vá para a aba "Console"
3. **Esperado**: Não deve haver erros em vermelho

### Network Tab
1. Abra DevTools > Network
2. Faça login
3. **Verificar**:
   - Requisição POST para `/api/auth` com status 200
   - Response contém `{ ok: true }`
   - Headers incluem `Set-Cookie: auth_token=...`

### Application > Cookies
1. DevTools > Application > Cookies
2. **Verificar**:
   - Cookie `auth_token` existe após login
   - Cookie tem `HttpOnly: true`
   - Cookie tem `Path: /`
   - Cookie tem `SameSite: Lax`

### React Query DevTools
1. Deve aparecer um ícone flutuante no canto inferior
2. Clique para abrir
3. **Verificar**:
   - Query `["auth", "check"]` aparece
   - Mutation de login aparece quando faz login

---

## 🐛 Problemas Comuns e Soluções

### Problema: "Cannot read property 'login' of undefined"
**Solução**: Verificar se o `QueryProvider` está envolvendo a aplicação no `layout.tsx`

### Problema: Erro 404 na API
**Solução**: Verificar se o arquivo `/app/api/auth/route.ts` existe

### Problema: Redirecionamento não funciona
**Solução**: Verificar se o middleware está configurado corretamente em `/src/middleware.ts`

### Problema: Validação não aparece
**Solução**: Verificar se `zodResolver` está sendo usado corretamente no `useForm`

---

## 📝 Notas de Teste

- **Ambiente**: Desenvolvimento local
- **Navegador**: Chrome/Firefox/Edge (testar em pelo menos um)
- **Versão Node**: Verificar compatibilidade
- **Data do Teste**: ___________
- **Testado por**: ___________

---

## ✅ Resultado Final

- [ ] Todos os testes passaram
- [ ] Alguns testes falharam (anotar quais)
- [ ] Problemas encontrados (descrever abaixo)

**Observações**:
_________________________________________________
_________________________________________________
_________________________________________________




