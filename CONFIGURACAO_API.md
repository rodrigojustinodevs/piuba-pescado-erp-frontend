# 🔧 Configuração da API de Autenticação

## 📋 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8005
```

**Importante**: 
- Use `NEXT_PUBLIC_` como prefixo para variáveis acessíveis no cliente
- O valor padrão é `http://localhost:8005` se a variável não estiver definida

## 🔌 Endpoint da API

A aplicação está configurada para usar:
- **URL Base**: `http://localhost:8005`
- **Endpoint de Login**: `POST /api/login`

## 📨 Formato da Requisição

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

## 📥 Formato da Resposta (Sucesso)

```json
{
  "status": true,
  "response": {
    "token": "token-jwt-aqui"
  },
  "message": "Authenticated successfully"
}
```

## 🔄 Fluxo de Autenticação

1. **Frontend** → Envia credenciais para `/api/auth` (Next.js API Route)
2. **Next.js API Route** → Faz proxy para `http://localhost:8005/api/login`
3. **Backend** → Retorna token JWT
4. **Next.js API Route** → Armazena token no cookie `auth_token` (httpOnly)
5. **Frontend** → Recebe confirmação e redireciona para dashboard

## 🍪 Gerenciamento de Cookies

O token JWT é armazenado em um cookie seguro:
- **Nome**: `auth_token`
- **HttpOnly**: `true` (não acessível via JavaScript)
- **Path**: `/`
- **SameSite**: `lax`
- **MaxAge**: 7 dias
- **Secure**: `false` (em desenvolvimento) - habilitar em produção

## 🧪 Testando a Integração

1. Certifique-se de que a API backend está rodando em `http://localhost:8005`
2. Configure a variável de ambiente (opcional, já tem valor padrão)
3. Faça login com credenciais válidas
4. Verifique no DevTools > Network que a requisição foi feita
5. Verifique no DevTools > Application > Cookies que o `auth_token` foi criado

## ⚠️ Troubleshooting

### Erro: "Erro ao conectar com o servidor"
- Verifique se a API backend está rodando
- Verifique se a URL está correta no `.env.local`
- Verifique CORS na API backend

### Erro: "Credenciais inválidas"
- Verifique se o formato da requisição está correto
- Verifique se a API está retornando o formato esperado

### Token não está sendo salvo
- Verifique se a resposta da API tem `status: true` e `response.token`
- Verifique o console do navegador para erros

