# 🔍 BuscaPeça - SaaS B2B de Autopeças

BuscaPeça é uma plataforma que conecta oficinas mecânicas com lojas de autopeças, eliminando o tempo improdutivo de buscas por telefone e grupos de WhatsApp ruidosos.

## 📋 Visão Geral

- **Oficionistas**: Buscam peças em segundos via fuzzy search, ordenadas por preço e proximidade (CEP)
- **Lojistas**: Importam estoque via CSV/Excel, fazem ajustes rápidos na quantidade, gerenciam equipe
- **SuperAdmin**: Aprova novas lojas, gerencia assinaturas, monitora intenções de compra

## 🏗️ Stack Técnica

- **Backend**: Node.js + TypeScript + Fastify
- **Frontend**: React + Vite + Tailwind CSS + Zustand
- **Banco de Dados**: PostgreSQL (Supabase)
- **Auth**: JWT (7 dias)
- **Integrações**: BrasilAPI (CNPJ), WhatsApp (wa.me)

## 📁 Estrutura do Projeto

```
buscapeca/
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT + Autenticação
│   │   ├── controllers/   # Lógica de requisição
│   │   ├── services/      # Lógica de negócio
│   │   ├── lib/           # Database connection
│   │   ├── routes/        # Definição de rotas
│   │   ├── types/         # TypeScript types
│   │   ├── plugins/       # RBAC
│   │   └── index.ts       # Entrada do app
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # React hooks
│   │   ├── store/         # Zustand store (auth)
│   │   ├── lib/           # HTTP client (axios)
│   │   ├── App.tsx        # Router
│   │   ├── main.tsx       # Entrada
│   │   └── types.ts       # TypeScript types
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── database/
│   └── schema.sql         # Schema PostgreSQL
├── .env.local             # Variáveis de ambiente
└── README.md
```

## 🚀 Quick Start

### 1. Configurar Ambiente

Copiar `.env.local` e preencher:

```bash
# Backend
PORT=3001
JWT_SECRET=seu-secret-muito-seguro-aqui
DATABASE_URL=postgresql://user:password@localhost:5432/buscapeca

# Frontend
VITE_API_URL=http://localhost:3001
```

### 2. Banco de Dados

#### Opção A: Supabase (Recomendado)

1. Criar projeto em https://supabase.com
2. Copiar `DATABASE_URL` para `.env.local`
3. Executar schema em Supabase SQL Editor (copiar todo `database/schema.sql`)

#### Opção B: PostgreSQL Local

```bash
# Criar banco
createdb buscapeca

# Executar schema
psql buscapeca < database/schema.sql
```

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

Backend rodará em `http://localhost:3001`

### 4. Frontend

Abrir outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend rodará em `http://localhost:5173`

## 📚 Principais Funcionalidades

### Para Mecânicos (SHOP)

1. **Busca de Peças** (UC-01)
   - Fuzzy search por nome/SKU
   - Filtro por proximidade (CEP 5 dígitos)
   - Ordenação: preço ↑, depois proximidade
   - Botão gigante para WhatsApp pré-parametrizado

2. **Redirecionamento WhatsApp**
   - Mensagem: "Olá [Loja], sou da [Oficina]..."
   - Log automático de intenção de compra

### Para Lojistas (STORE)

1. **Importação de Estoque** (UC-02)
   - Upload CSV/XLSX com colunas: SKU, Name, Price, Quantity
   - Sanitização automática (R$ → float, , → .)
   - Upsert inteligente (produto novo ou atualiza quantidade/preço)
   - Painel de resumo: X criados, Y atualizados, Z erros

2. **Ajuste Rápido** (UC-03)
   - Botões [−] e [+] gigantes (>48px)
   - Operação atômica (sem race condition)
   - Quantidade não pode ir abaixo de 0

3. **Gestão de Equipe**
   - Criar operadores com acesso apenas à busca
   - Admin tem acesso a importação + ajuste

### Para SuperAdmin

1. **Moderação de CNPJ**
   - Fila de lojas pendentes
   - Validação automática via BrasilAPI
   - Aprovação/Rejeição com notificação WhatsApp

2. **Gestão de Assinaturas**
   - Trial: 30 dias → Expired → invisibilidade
   - Renovação manual (+30 dias)

3. **Relatórios**
   - Total de intenções de compra
   - Top 10 peças mais buscadas
   - Taxa de convert trial → pago

## 🔐 Segurança e Multi-tenancy

### Autenticação

- Email + Senha com bcrypt (cost=10)
- JWT Token (7 dias de expira)
- Refresh manual via re-login

### Autorização

- **SuperAdmin**: `role = 'superadmin'`, `organization_id = NULL`
- **Lojista Admin**: `role = 'admin'`, acesso total à org
- **Lojista Operador**: `role = 'operator'`, apenas inventário + ajuste
- **Mecânico Admin**: `role = 'admin'` em SHOP, acesso a busca
- **Mecânico Operador**: `role = 'operator'`, apenas busca

### Multi-tenancy

Todos os queries filtram por `organization_id`:

```sql
WHERE organization_id = $1 AND is_active = true AND subscription_status = 'active'
```

## 📊 Modelo de Dados

### organizations
- `id` (uuid PK)
- `type` (STORE | SHOP)
- `cnpj` (unique)
- `fantasy_name` (nome comercial)
- `whatsapp` (E.164)
- `cep` (5+ dígitos)
- `is_active` (false = aguardando aprovação)
- `subscription_status` (trial | active | expired)
- `trial_ends_at` (timestamp)

### users
- `id` (uuid PK)
- `organization_id` (FK, NULL para superadmin)
- `email` (unique)
- `password_hash` (bcrypt)
- `role` (admin | operator | superadmin)

### products
- `id` (uuid PK)
- `sku` (unique)
- `name` (GIN trgm index para fuzzy search)

### inventory
- `id` (uuid PK)
- `organization_id` (FK)
- `product_id` (FK)
- `price` (numeric 10,2)
- `quantity` (int, CHECK >= 0)
- Unique (organization_id, product_id) para upsert

### intention_logs
- `id` (uuid PK)
- `user_id` (FK, nullable)
- `organization_id` (FK)
- `product_id` (FK, nullable)
- `search_term` (texto)
- `sku` (código)
- `price` (numérico)
- `created_at` (timestamp)

## 🔌 API Endpoints

### Autenticação

```
POST /auth/signup
POST /auth/login
GET /auth/me (requer token)
```

### Busca (Público)

```
GET /search?q=filtro&cep=12345
POST /search/log (log de intenção)
```

### Inventário (Requer token + org)

```
GET /inventory
POST /inventory/:id/decrement
POST /inventory/:id/increment
POST /inventory/import (multipart, admin only)
```

### Admin (Requer token + superadmin)

```
GET /admin/organizations/pending
GET /admin/organizations
POST /admin/organizations/:id/approve
POST /admin/organizations/:id/reject
```

### Health Check

```
GET /health
```

## 📈 Critérios de Aceite

- ✅ Busca retorna em ≤300ms (P95) via pg_trgm
- ✅ Importação 2k linhas em ≤10s com upsert
- ✅ Redirecionamento WhatsApp com mensagem parametrizada
- ✅ Operação de decrement bloqueia valores negativos
- ✅ Lojas expired/inactive não aparecem na busca
- ✅ Auto-preenchimento CNPJ funciona + valida status
- ✅ Operador bloqueado de rotas de importação (403)

## 🚀 Deploy

### Production Stack

- **Database**: Supabase (PostgreSQL managed)
- **Backend**: Railway (Node.js)
- **Frontend**: Vercel (React/Vite)

### Guias Detalhados

1. **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** — Checklist completo com todos os passos
2. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** — Setup do banco de dados
3. **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** — Deploy backend
4. **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** — Deploy frontend
5. **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** — Guia geral completo

### Quick Deploy (TL;DR)

```bash
# 1. Supabase
# - Criar projeto
# - Copiar schema.sql para SQL Editor
# - Guardar DATABASE_URL

# 2. Railway
# - Conectar GitHub
# - Adicionar DATABASE_URL + JWT_SECRET
# - Deploy automático

# 3. Vercel
# - Conectar GitHub
# - Adicionar VITE_API_URL (URL do Railway)
# - Deploy automático
```

## 🔧 Desenvolvimento

### Scripts Úteis

```bash
# Backend
cd backend && npm run dev      # Watch mode com tsx
npm run build                   # TypeScript compile para dist/
npm start                       # Rodar versão compilada

# Frontend
cd frontend && npm run dev      # Vite dev server
npm run build                   # Build para dist/
npm run preview                 # Preview local da build

# Toda a aplicação
npm run install:all             # Instala backend + frontend
npm run build                   # Build ambos
```

## 🐛 Troubleshooting

### Erro: "Missing env DATABASE_URL"

Verificar `.env.local`:

```bash
echo $DATABASE_URL
```

### Erro: Cannot find module

```bash
cd backend && npm install
cd frontend && npm install
```

### Erro: CORS bloqueando frontend-backend

Verificar se `VITE_API_URL` aponta para o backend correto.

### Erro: Token inválido

JWT expirou (7 dias). Fazer novo login.

---

**Versão**: 1.0  
**Data**: 14/05/2026  
**Status**: MVP Production-Ready

