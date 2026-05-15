# ✅ Production Deploy Checklist

Guia de checklist para fazer deploy de BuscaPeça em produção em Supabase + Railway + Vercel.

---

## 📋 Supabase (Database)

- [ ] Criar conta em https://supabase.com
- [ ] Criar novo projeto ("buscapeca")
- [ ] Copiar `[PROJECT_ID]` e `[PASSWORD]`
- [ ] Ir para **SQL Editor**
- [ ] Copiar TODO o arquivo `database/schema.sql`
- [ ] Colar no editor Supabase e rodar
- [ ] ✅ Verificar se rodou sem erros (verde)
- [ ] Rodar teste SQL:
  ```sql
  SELECT COUNT(*) FROM organizations;
  ```
- [ ] Copiar `DATABASE_URL`:
  ```
  postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
  ```
- [ ] Guardar em local seguro

---

## 🔵 Railway (Backend)

### Preparação

- [ ] Gerar `JWT_SECRET` seguro (32 chars aleatório)
- [ ] Guardar `JWT_SECRET` em local seguro
- [ ] Ter `DATABASE_URL` do Supabase pronto
- [ ] Repositório BuscaPeça no GitHub (público ou privado)

### Setup

- [ ] Criar conta em https://railway.app (login GitHub)
- [ ] Criar novo projeto ("Empty Project")
- [ ] Adicionar serviço → "GitHub Repo"
- [ ] Conectar repositório `buscapeca`
- [ ] Selecionar branch `main`

### Configurar Variáveis

- [ ] Ir para **Variables**
- [ ] Adicionar `PORT=3001`
- [ ] Adicionar `NODE_ENV=production`
- [ ] Adicionar `JWT_SECRET=[seu-valor-gerado]`
- [ ] Adicionar `DATABASE_URL=[do-supabase]`
- [ ] Adicionar `BRASIL_API_URL=https://brasilapi.com.br/api`
- [ ] Clicar **Save Changes**

### Deploy

- [ ] Aguardar Railway fazer build automático (~3-5 min)
- [ ] Verificar se deployment foi ✅
- [ ] Ver logs para confirmar não há erros
- [ ] Testar health check:
  ```bash
  curl https://buscapeca-production-[id].railway.app/health
  ```
- [ ] Resposta esperada: `{"ok":true}`
- [ ] Copiar URL do backend (ex: `https://buscapeca-production-xyzabc.railway.app`)
- [ ] Guardar URL para o Vercel

---

## 🟣 Vercel (Frontend)

### Preparação

- [ ] Ter URL completa do Railway (ex: `https://buscapeca-production-xyzabc.railway.app`)
- [ ] Repositório BuscaPeça no GitHub

### Setup

- [ ] Criar conta em https://vercel.com (login GitHub)
- [ ] Ir para **Add New** → **Project**
- [ ] Clicar **Import Git Repository**
- [ ] Procurar e selecionar repositório `buscapeca`
- [ ] Clicar **Import**

### Configurar Build

- [ ] Vercel auto-detecta Vite (confirmar)
- [ ] Se não auto-detectou, configurar manualmente:
  - [ ] **Settings** → **Build & Development Settings**
  - [ ] **Framework Preset**: Vite
  - [ ] **Build Command**: `npm run build:frontend`
  - [ ] **Output Directory**: `frontend/dist`
  - [ ] Clicar **Save**

### Configurar Environment Variables

- [ ] Ir para **Settings** → **Environment Variables**
- [ ] Clicar **Add New**
- [ ] Nome: `VITE_API_URL`
- [ ] Valor: `https://buscapeca-production-xyzabc.railway.app` (sua URL do Railway)
- [ ] Selecionar **Production**
- [ ] Clicar **Add**
- [ ] Adicionar nova:
  - Nome: `VITE_APP_NAME`
  - Valor: `BuscaPeça`
  - Production
  - Add
- [ ] Clicar **Save**

### Deploy

- [ ] Ir para **Deployments**
- [ ] Clicar **Redeploy** (ou esperar push automático para main)
- [ ] Aguardar build (~3-5 min)
- [ ] Verificar se sucesso ✅
- [ ] Copiar URL do Vercel (ex: `https://buscapeca-nine.vercel.app`)

---

## 🧪 Testes de Aceitação

### Backend (Railway)

- [ ] Health check retorna 200
  ```bash
  curl https://buscapeca-production-xyzabc.railway.app/health
  ```
- [ ] Login endpoint funciona
  ```bash
  curl -X POST https://buscapeca-production-xyzabc.railway.app/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}'
  ```
- [ ] Sem erros nos logs (Railway → Logs)

### Database (Supabase)

- [ ] Testes SQL retornam dados
  ```sql
  SELECT COUNT(*) FROM users;
  SELECT COUNT(*) FROM organizations;
  ```
- [ ] Backups automáticos habilitados (Settings → Backups)

### Frontend (Vercel)

- [ ] App carrega sem erros (abrir URL Vercel)
- [ ] Console não mostra erros (DevTools → F12)
- [ ] Página é responsiva (mobile + desktop)
- [ ] Botões funcionam
- [ ] Sign up funciona (cria user + org em Supabase)
- [ ] Login funciona (retorna token JWT)
- [ ] Busca funciona (conecta ao backend Railway)
- [ ] Resultados da busca retornam

### End-to-End

- [ ] [ ] Abrir frontend Vercel
- [ ] [ ] Fazer sign up completo
- [ ] [ ] Fazer login
- [ ] [ ] Fazer busca
- [ ] [ ] Import de CSV (se implementado)
- [ ] [ ] Logout funciona

---

## 🔐 Segurança Pre-Launch

- [ ] JWT_SECRET é único e aleatório (não default)
- [ ] DATABASE_URL não está em `.env.local` commitado
- [ ] `.gitignore` inclui `node_modules/`, `*.env`, `dist/`
- [ ] CORS está habilitado no backend
- [ ] Backend roda em HTTPS (Railway autossl)
- [ ] Frontend roda em HTTPS (Vercel autossl)

---

## 🚀 Pós-Launch

- [ ] Monitorar logs (Railway + Vercel)
- [ ] Testar funcionalidades em produção
- [ ] Verificar emails/WhatsApp de confirmação (se implementado)
- [ ] Ter plano de rollback (git tags)
- [ ] Documentar problemas encontrados

---

## 📞 Se Tiver Problemas

| Problema | Solução |
|----------|---------|
| APP branco em Vercel | Check console (F12) para erros CORS |
| Backend 502 | Ver logs Railway, verificar DATABASE_URL |
| Conexão BD recusada | Testar DATABASE_URL localmente com psql |
| Build falha Railway | Deletar node_modules + package-lock, push novamente |
| CORS error | Verificar `VITE_API_URL` exato em Vercel |

---

**Status**: Pronto para produção ✅  
**Data**: 15/05/2026  
**Ambiente**: Supabase + Railway + Vercel
