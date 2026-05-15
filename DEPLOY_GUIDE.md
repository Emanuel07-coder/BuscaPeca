# 🚀 Deploy Guide — Supabase + Railway + Vercel

Instruções passo a passo para deploy do BuscaPeça em produção.

## 📋 Tarefas

- [ ] Setup Supabase (Database)
- [ ] Deploy Backend em Railway
- [ ] Deploy Frontend em Vercel
- [ ] Conectar domínios (opcional)
- [ ] Configurar CI/CD

---

## 🟢 1. Supabase (Database)

### Criar Projeto

1. Ir para https://supabase.com
2. Clicar em "New project"
3. Preencher:
   - **Organization**: (criar ou selecionar)
   - **Project name**: `buscapeca`
   - **Password**: (copiar e guardar em local seguro!)
   - **Region**: (mais próximo de você, ex: São Paulo)
4. Clicar "Create new project"
5. Aguardar ~2 min (Supabase setup)

### Executar Schema

1. Copiar todo o conteúdo de `database/schema.sql`
2. No Supabase, ir para **SQL Editor**
3. Colar o schema e clicar **Run**
4. Aguardar execução (deve aparecer ✓)

### Copiar Credenciais

1. Supabase Dashboard → **Settings** → **Database**
2. Copiar: **Host**, **Port** (5432), **User** (postgres), **Password**
3. Copiar **Project ID** da URL (entre `.` e `.supabase.co`)

### Montar DATABASE_URL

```
postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
```

**Exemplo**:
```
postgresql://postgres:abc123XYZ@abcdef123456.supabase.co:5432/postgres
```

Guardar este valor para os próximos passos!

---

## 🔵 2. Railway (Backend)

### Criar Conta

1. Ir para https://railway.app
2. Clicar "Login with GitHub" (recomendado)
3. Autorizar

### Criar Aplicação

1. Dashboard → **New** → **Empty Project**
2. Clicar **Add Service** → **GitHub Repo**
3. Conectar seu repositório do BuscaPeça
4. Selecionar a branch (`main`)
5. Railway auto-detecta `package.json` e configura build

### Configurar Environment Variables

1. Projeto Railway → **Variables**
2. Adicionar:

```env
PORT=3001
NODE_ENV=production
JWT_SECRET=gerar-uma-senha-aleatoria-segura-super-longa-32-chars
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
BRASIL_API_URL=https://brasilapi.com.br/api
```

### Gerar JWT_SECRET Seguro

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

Guardar este valor em local seguro!

### Deploy

1. Railway detecta `package.json` na raiz
2. Executa: `npm install:all` → `npm run build:backend`
3. Inicia: `npm run start:backend`

### Copiar URL do Backend

1. Projeto Railway → **Deployments**
2. Copiar URL (exemplo: `https://buscapeca-backend-xyzabc.railway.app`)

**IMPORTANTE**: Esta URL será usada no frontend!

---

## 🟣 3. Vercel (Frontend)

### Preparar Variáveis

Antes de fazer deploy, você precisa:
- ✅ URL do backend em Railway (ex: `https://buscapeca-backend-xyzabc.railway.app`)

### Criar Projeto na Vercel

1. Ir para https://vercel.com
2. Clicar **Add New** → **Project**
3. **Import Git Repository**
4. Selecionar seu repositório do BuscaPeça
5. Clicar **Import**

### Configurar Build

Vercel deve auto-detectar:
- **Framework**: Vite
- **Build Command**: `npm run build:frontend`
- **Output Directory**: `frontend/dist`

Se não auto-detectar:

1. Configurar manualmente em **Settings** → **Build & Development Settings**
2. **Framework Preset**: `Vite`
3. **Build Command**: `cd frontend && npm run build`
4. **Output Directory**: `frontend/dist`

### Configurar Environment Variables

1. **Settings** → **Environment Variables**
2. Adicionar (para **Production**):

```env
VITE_API_URL=https://buscapeca-backend-xyzabc.railway.app
VITE_APP_NAME=BuscaPeça
```

3. Clicar **Save**

### Deploy

1. Ir para **Deployments**
2. Clicar **Redeploy** (selecionar branch **main**)
3. Aguardar ~3 minutos

Vercel mostrará URL: `https://buscapeca-xxxxx.vercel.app`

---

## 🔗 Conectar Domínios (Opcional)

### Domínio no Vercel

1. Vercel → Projeto → **Settings** → **Domains**
2. Clicar **Add Domain**
3. Inserir seu domínio (ex: `app.buscapeca.com.br`)
4. Seguir instruções para apontar DNS

### Domínio no Railway

1. Railway → Projeto → **Settings**
2. Procurar por **Custom Domain**
3. Adicionar domínio para o backend (ex: `api.buscapeca.com.br`)

---

## ✅ Checklist Final

Backend (Railway):
- [ ] Variáveis de ambiente configuradas
- [ ] `DATABASE_URL` apontando para Supabase
- [ ] `JWT_SECRET` com valor aleatório seguro
- [ ] `NODE_ENV=production`
- [ ] Health check retorna 200 (`GET /health`)
- [ ] URL do backend copiada

Frontend (Vercel):
- [ ] `VITE_API_URL` apontando para URL do backend
- [ ] Build roda sem erros
- [ ] App carrega no navegador
- [ ] Login funciona
- [ ] Busca retorna dados

Database (Supabase):
- [ ] Schema SQL rodado com sucesso
- [ ] Backups automáticos habilitados
- [ ] DATABASE_URL funciona

---

## 🧪 Testar Conexões

### Testar Backend

```bash
# Verificar health check
curl https://buscapeca-backend-xyzabc.railway.app/health
# Esperado: { "ok": true }

# Testar login
curl -X POST https://buscapeca-backend-xyzabc.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Testar Frontend

1. Abrir https://buscapeca-xxxxx.vercel.app
2. Clicar "Criar nova conta"
3. Preencher dados e submeter
4. Verificar se criou org + user

### Testar Database

No Supabase, ir para **SQL Editor**:

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM organizations;
```

Devem retornar números > 0 se teste passou.

---

## 🔄 CI/CD Automático

### GitHub Actions

Quando fizer push para `main`:
1. GitHub detecta mudanças
2. Railway re-deploya automaticamente
3. Vercel re-deploya automaticamente

Sem necessidade de fazer nada manual!

---

## 🐛 Troubleshooting

### Frontend não conecta no backend

**Problema**: Erro CORS ou "Cannot reach server"

**Solução**:
1. Verificar `VITE_API_URL` em Vercel
2. Verificar se Railway está online (Dashboard → Health)
3. Checar logs do backend: Railway → Deployments → Logs

### Erro 502 no Backend

**Problema**: Railway retorna erro 502

**Solução**:
1. Verificar logs: Railway → View Logs
2. Verificar DATABASE_URL (typo?)
3. Verificar schema SQL foi rodado no Supabase

### Database connection refused

**Problema**: Backend não consegue conectar em Supabase

**Solução**:
1. Verificar `DATABASE_URL` formato
2. Testar conexão local:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres"
   ```
3. Verificar IP allowlist no Supabase (Settings → Database → Allowed IPs)

---

## 📞 Contato Suporte

- **Supabase**: https://supabase.com/support
- **Railway**: https://railway.app/support
- **Vercel**: https://vercel.com/support

---

**Versão**: 1.0  
**Data**: 15/05/2026  
**Status**: Production Ready
