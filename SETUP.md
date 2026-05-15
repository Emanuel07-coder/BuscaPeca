# 🚀 Setup BuscaPeça - Guia Completo

Instruções para configurar BuscaPeça localmente e fazer deploy.

## 📋 Pré-Requisitos

- Node.js 18+ e npm
- Git
- PostgreSQL 13+ (ou Docker)
- Editor de código (VS Code recomendado)

## 🏃 Quick Start (5 minutos)

### 1. Clone e Instale Dependências

```bash
# Clone o repository
git clone <repo-url>
cd buscapeca

# Backend
cd backend
npm install

# Frontend (novo terminal)
cd frontend
npm install
```

### 2. Configure Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Criar database
createdb buscapeca

# Executar schema
psql buscapeca < database/schema.sql

# Testar conexão
psql -U postgres -d buscapeca -c "SELECT COUNT(*) FROM organizations;"
```

#### Opção B: Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d

# Aguardar ~10 segundos

# Verificar se schema foi carregado
docker exec buscapeca-db psql -U postgres -d buscapeca -c "SELECT COUNT(*) FROM organizations;"
```

#### Opção C: Supabase Cloud

1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Na seção SQL Editor, copiar **todo** o conteúdo de `database/schema.sql`
4. Colar e executar
5. Copiar `Project URL` e `Database Password` da seção Settings

### 3. Configure Variáveis de Ambiente

Criar arquivo `.env.local` na raiz:

```bash
# Backend
PORT=3001
NODE_ENV=development
JWT_SECRET=dev-secret-change-in-prod-$(openssl rand -hex 16)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/buscapeca

# Frontend
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=BuscaPeça
```

**Para Supabase:**
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

### 4. Inicie Backend e Frontend

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Deve aparecer:
```
✅ Backend running on http://localhost:3001
```

#### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Deve aparecer:
```
  VITE v5.4.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### 5. Abra no Navegador

```
http://localhost:5173
```

Clique em "Criar nova conta" e teste!

---

## 📖 Detalhes Técnicos

### Backend Stack

```javascript
{
  "framework": "Fastify 4.29.0",
  "language": "TypeScript 5.7.2",
  "database": "PostgreSQL via pg",
  "auth": "@fastify/jwt 7.0.0",
  "security": "bcryptjs 2.4.3",
  "csv": "csv-parse 5.5.5"
}
```

### Frontend Stack

```javascript
{
  "framework": "React 18.2.0",
  "bundler": "Vite 5.4.2",
  "styling": "Tailwind CSS 3.4.10",
  "state": "Zustand 4.4.7",
  "http": "axios 1.6.7",
  "routing": "react-router-dom 6.21.0"
}
```

### Estrutura de Pastas

```
backend/src/
├── auth/              # JWT, autenticação
│   ├── authenticate.ts
│   ├── decorators.ts
│   ├── routes.ts
│   └── types.ts
├── controllers/       # Request handlers
│   ├── auth.controllers.ts
│   ├── search.controllers.ts
│   ├── inventory.controllers.ts
│   └── admin.controllers.ts
├── services/          # Business logic
│   ├── auth.services.ts
│   ├── search.services.ts
│   ├── inventory.services.ts
│   ├── csv.services.ts
│   └── brasilapi.services.ts
├── repositories/      # Database queries (future)
├── routes/            # Route definitions
│   ├── auth.routes.ts
│   ├── search.routes.ts
│   ├── inventory.routes.ts
│   ├── admin.routes.ts
│   └── health.ts
├── lib/
│   └── db.ts          # Database connection pool
├── plugins/
│   └── rbac.ts        # Role-based access control
├── types/
│   └── domain.ts      # TypeScript interfaces
└── index.ts           # App entry point

frontend/src/
├── pages/
│   ├── AuthPage.tsx
│   ├── SearchPage.tsx
│   ├── ImportPage.tsx
│   ├── InventoryPage.tsx
│   └── AdminPage.tsx
├── components/
│   └── Button.tsx
├── hooks/
│   └── useAuth.ts
├── store/
│   └── auth.ts        # Zustand auth store
├── lib/
│   └── api.ts         # Axios client
├── types.ts           # TypeScript types
├── App.tsx            # Router setup
└── main.tsx           # React entry point
```

---

## 🔐 Autenticação

### Flow de Login

```
1. User clica "Entrar"
2. Frontend POST /auth/login { email, password }
3. Backend verifica bcrypt_compare(password, hash)
4. Backend emite JWT token (exp 7 dias)
5. Frontend armazena token em localStorage
6. Frontend injeta token em todas as requests: "Authorization: Bearer {token}"
```

### Token JWT Payload

```json
{
  "sub": "user-id-uuid",
  "role": "admin|operator|superadmin",
  "organization_id": "org-id-uuid or null",
  "email": "user@example.com",
  "iat": 1683000000,
  "exp": 1683604800
}
```

### Roles

- **superadmin**: Acesso global (moderação de CNPJs, financeiro)
- **admin**: Acesso total da organização (importação, equipe)
- **operator**: Acesso limitado (busca, ajuste rápido apenas)

---

## 📡 Endpoints da API

### Autenticação

```
POST /auth/signup
  Body: {
    email: "user@example.com",
    password: "senha123",
    type: "SHOP|STORE",
    cnpj: "12345678901234",
    fantasyName: "Minha Loja",
    whatsapp: "5511987654321",
    cep: "01234-567"
  }
  Response: { user, organization, token }

POST /auth/login
  Body: { email, password }
  Response: { user, token }

GET /auth/me (requer token)
  Response: { user }
```

### Busca

```
GET /search?q=filtro&cep=12345
  Response: { total: N, results: [...] }

POST /search/log (requer token)
  Body: { organization_id, product_id, search_term, sku, price }
  Response: { ok: true }
```

### Inventário

```
GET /inventory (requer token)
  Response: [{ id, organization_id, product_id, price, quantity }]

POST /inventory/:id/decrement (requer token)
  Response: { ok: true }

POST /inventory/:id/increment (requer token)
  Response: { ok: true }

POST /inventory/import (requer token + admin)
  Body: multipart/form-data { file }
  Response: { updated: N, created: N, errors: [...] }
```

### Admin

```
GET /admin/organizations/pending (requer token + superadmin)
  Response: [organizations...]

GET /admin/organizations (requer token + superadmin)
  Response: [organizations...]

POST /admin/organizations/:id/approve (requer token + superadmin)
  Response: { organization }

POST /admin/organizations/:id/reject (requer token + superadmin)
  Response: { message }
```

### Health Check

```
GET /health
  Response: { ok: true }
```

---

## 🧪 Testes Manuais

### Teste 1: Signup (Oficina)

```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mecanico@exemplo.com",
    "password": "senha123",
    "type": "SHOP",
    "cnpj": "11222333000101",
    "fantasyName": "Oficina Top",
    "whatsapp": "5511987654321",
    "cep": "01234567"
  }'
```

Esperado: `{ user, organization, token }`

### Teste 2: Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mecanico@exemplo.com",
    "password": "senha123"
  }'
```

Esperado: `{ user, token }`

### Teste 3: Busca

```bash
curl "http://localhost:3001/search?q=filtro&cep=01234"
```

Esperado: `{ total: 0, results: [] }` (até importar estoque)

### Teste 4: Me (Requer Token)

```bash
TOKEN="..." # copiar do login
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Deploy

### Backend em Railway

1. Criar conta em https://railway.app
2. Conectar GitHub repository
3. Configurar environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   JWT_SECRET=<random-secret>
   DATABASE_URL=postgresql://...
   BRASIL_API_URL=https://brasilapi.com.br/api
   ```
4. Railway auto-detecta `package.json` e roda `npm start`
5. Copiar URL: `https://your-app.railway.app`

### Frontend em Vercel

1. Criar conta em https://vercel.com
2. Importar proyecto do GitHub
3. Configurar environment variables:
   ```
   VITE_API_URL=https://your-app.railway.app
   VITE_APP_NAME=BuscaPeça
   ```
4. Vercel detecta Vite e roda `npm run build` automaticamente
5. Deploy automático em push para main

### Database em Supabase (Recomendado)

1. Copiar `database/schema.sql` inteiro
2. Supabase SQL Editor → Run
3. Aguardar execução
4. Copiar `DATABASE_URL` para ambiente variables

---

## 🐛 Troubleshooting

### "Cannot connect to database"

```bash
# Verificar se PostgreSQL está rodando
psql -l

# Se usando Docker
docker ps | grep postgres

# Verificar DATABASE_URL em .env.local
echo $DATABASE_URL
```

### "Module not found: pg"

```bash
cd backend
npm install pg
```

### "CORS error frontend → backend"

Verificar `VITE_API_URL` em frontend `.env.local`:

```bash
# frontend/.env.local
VITE_API_URL=http://localhost:3001
```

### "JWT token invalid or expired"

Token dura 7 dias. Fazer novo login.

### "Port 3001 já em uso"

```bash
# Liberar porta (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Ou usar PORT diferente
PORT=3002 npm run dev
```

---

## 📚 Mais Recursos

- [Fastify Docs](https://www.fastify.io/)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Última atualização**: 14/05/2026  
**Versão**: 1.0  
**Status**: Production-Ready
