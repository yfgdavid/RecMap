# Requisitos do Backend - Persistência de Sessão

## 📋 Resumo

O frontend agora salva o token e dados do usuário no `localStorage`. Para garantir segurança e validação adequada, o backend precisa implementar um endpoint para validar tokens e restaurar sessões.

---

## 🔐 Endpoint Necessário

### **GET /auth/validate** ou **GET /auth/me**

**Descrição:** Valida o token JWT e retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": "123",
    "id_usuario": "123",
    "nome": "João Silva",
    "name": "João Silva",
    "email": "joao@example.com",
    "tipo": "citizen" | "government"
  },
  "token": "novo_token_se_necessario" // opcional, se quiser renovar o token
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Token inválido ou expirado"
}
```

---

## 🔄 Fluxo Recomendado

### Opção 1: Validação Automática (Recomendado)
O frontend pode chamar este endpoint ao carregar a página se houver token salvo:

1. Frontend verifica se há token no `localStorage`
2. Se houver, faz requisição para `/auth/validate` com o token
3. Backend valida o token e retorna dados do usuário
4. Frontend restaura a sessão com os dados retornados

### Opção 2: Validação em Todas as Requisições
O backend já valida o token em todas as requisições protegidas. O frontend pode confiar nisso e apenas restaurar do `localStorage` (implementação atual).

---

## 🛡️ Segurança

### Validações que o Backend DEVE fazer:

1. **Verificar assinatura do token JWT**
2. **Verificar expiração do token**
3. **Verificar se o usuário ainda existe e está ativo**
4. **Retornar erro 401 se token inválido/expirado**

### Exemplo de Middleware (Node.js/Express):
```javascript
const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
```

---

## 📝 Estrutura de Dados Esperada

O frontend espera que a resposta do login/validação contenha:

```typescript
{
  user: {
    id_usuario: string | number,  // ou "id" ou "usuario_id"
    nome: string,                 // ou "name"
    email: string,
    tipo?: "citizen" | "government"
  },
  token: string
}
```

---

## ✅ Checklist Backend

- [ ] Criar endpoint `/auth/validate` ou `/auth/me`
- [ ] Validar token JWT no endpoint
- [ ] Retornar dados do usuário se token válido
- [ ] Retornar erro 401 se token inválido/expirado
- [ ] Garantir que todas as rotas protegidas validam o token
- [ ] Implementar refresh token (opcional, mas recomendado)

---

## 🔗 Integração com Frontend

O frontend já está preparado para:
- ✅ Salvar token e dados do usuário no `localStorage`
- ✅ Restaurar sessão ao carregar a página
- ✅ Enviar token no header `Authorization: Bearer {token}`

**Próximo passo:** Implementar chamada opcional para `/auth/validate` no frontend quando houver token salvo, para garantir que o token ainda é válido antes de restaurar a sessão.

---

## 📌 Notas Importantes

1. **Tokens expirados:** O frontend pode tentar restaurar com token expirado. O backend deve rejeitar e retornar 401.

2. **Logout:** Quando o usuário faz logout, o frontend limpa o `localStorage`. O backend pode invalidar o token (opcional).

3. **Segurança:** Nunca confie apenas no frontend. Sempre valide tokens no backend em todas as requisições protegidas.

4. **Refresh Token:** Considere implementar refresh tokens para melhorar a experiência do usuário sem comprometer a segurança.

