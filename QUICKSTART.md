# 🔍 BuscaPeça — Guia Rápido de Início

## 30 segundos para rodar localmente

### 1. Instale dependências
```bash
npm install:all
```

### 2. Setup banco (escolha uma opção)

**Com Docker** (recomendado):
```bash
docker-compose up -d
```

**Com PostgreSQL local**:
```bash
createdb buscapeca
psql buscapeca < database/schema.sql
```

**Com Supabase**:
- Copie `database/schema.sql` inteiro para SQL Editor
- Run

### 3. Crie `.env.local`
```bash
cp .env.local.example .env.local
# Edite conforme seu banco (DATABASE_URL)
```

### 4. Rode o projeto

**Terminal 1 - Backend**:
```bash
npm run dev:backend
# ✅ Backend running on http://localhost:3001
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
# ➜  Local:   http://localhost:5173
```

### 5. Abra http://localhost:5173

Pronto! 🎉

---

## Dados de Teste

### Signup: Oficina
- Email: mecanico@test.com
- Senha: test123
- Tipo: 🚗 Oficina Mecânica
- CNPJ: 11222333000101
- CEP: 01234567

### Signup: Loja
- Email: loja@test.com
- Senha: test123
- Tipo: 🏪 Auto Peças
- CNPJ: 11444555000292
- CEP: 01234567

---

## Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "Cannot connect to database" | Verificar `DATABASE_URL` em `.env.local` |
| "Port 3001 already in use" | `lsof -ti:3001 \| xargs kill -9` |
| "Module not found" | `cd backend && npm install && cd ../frontend && npm install` |
| CORS error | Verificar `VITE_API_URL=http://localhost:3001` |

---

## Documentação Completa

- **Setup detalhado**: [SETUP.md](./SETUP.md)
- **README**: [README.md](./README.md)
- **PRD completo**: Procurar por "PRD — BuscaPeça"
- **TODO**: [TODO.md](./TODO.md)

---

**Versão**: 1.0  
**Data**: 14/05/2026  
**Ambiente**: MVP Production-Ready
