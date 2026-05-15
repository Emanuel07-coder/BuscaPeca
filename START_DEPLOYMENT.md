# 🎯 BuscaPeça — Deploy em Produção (Supabase + Railway + Vercel)

Você está pronto para fazer deploy! Aqui estão os próximos passos.

---

## 📚 Documentação de Deployment

Siga **nesta ordem**:

### 1️⃣ **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** (Leia PRIMEIRO!)
   - Checklist completo com todos os passos
   - O que fazer em Supabase, Railway e Vercel
   - Testes pós-deploy

### 2️⃣ **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
   - Criar projeto Supabase
   - Executar schema SQL
   - Copiar `DATABASE_URL`

### 3️⃣ **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)**
   - Criar projeto Railway
   - Conectar GitHub
   - Configurar environment variables
   - Deploy backend

### 4️⃣ **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**
   - Criar projeto Vercel
   - Configurar build
   - Configurar environment variables com URL do Railway
   - Deploy frontend

### 📖 **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**
   - Guia completo + troubleshooting
   - Instruções detalhadas de cada plataforma

---

## ⏱️ Tempo Estimado

| Etapa | Tempo | Plataforma |
|-------|-------|-----------|
| Setup Supabase | 5-10 min | https://supabase.com |
| Setup Railway | 10-15 min | https://railway.app |
| Setup Vercel | 10-15 min | https://vercel.com |
| **Total** | **~30-40 min** | |

---

## ✅ Checklist Rápido

### Supabase
- [ ] Projeto criado
- [ ] Schema SQL rodado
- [ ] `DATABASE_URL` copiada

### Railway
- [ ] Conta criada
- [ ] Repositório conectado
- [ ] Environment variables configuradas
- [ ] Build ✅
- [ ] URL do backend copiada

### Vercel
- [ ] Conta criada
- [ ] Repositório conectado
- [ ] `VITE_API_URL` aponta para Railway
- [ ] Build ✅
- [ ] App online

---

## 💾 Guardar Esses Valores (IMPORTANTE!)

Copie e guarde em local seguro:

```
[SUPABASE]
DATABASE_URL = postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres

[RAILWAY]
JWT_SECRET = [seu-valor-aleatorio-32-chars]
BACKEND_URL = https://buscapeca-production-[ID].railway.app

[VERCEL]
FRONTEND_URL = https://buscapeca-[ID].vercel.app
```

---

## 🚀 Ordem de Execução

### Dia 1: Setup Infrastructure
1. [ ] Criar Supabase (5-10 min)
2. [ ] Executar schema (1-2 min)
3. [ ] Criar Railway (5 min)
4. [ ] Conectar GitHub (2 min)

### Dia 2: Deploy (ou Dia 1 se for rápido)
1. [ ] Configurar env vars Railway (2 min)
2. [ ] Aguardar build Railway (3-5 min)
3. [ ] Testar backend (2 min)
4. [ ] Criar Vercel (5 min)
5. [ ] Configurar env vars Vercel (2 min)
6. [ ] Aguardar build Vercel (3-5 min)
7. [ ] Testar frontend (5 min)
8. [ ] Testar E2E (login → busca) (5 min)

---

## 🔐 Segurança — NÃO ESQUECER!

- ✅ JWT_SECRET é **único** e **aleatório** (não use hardcoded)
- ✅ DATABASE_URL **nunca** é commitada no Git (.gitignore já tem)
- ✅ Senhas Supabase guardadas em local seguro (1Password, bitwarden, etc)
- ✅ Verificar HTTPS em Railway e Vercel (automático)
- ✅ CORS habilitado no backend

---

## 🧪 Testes Pós-Deploy

### Backend (Railway)
```bash
curl https://buscapeca-production-[ID].railway.app/health
# Esperado: {"ok":true}
```

### Frontend (Vercel)
1. Abrir https://buscapeca-[ID].vercel.app
2. Fazer signup completo
3. Verificar se criou no banco Supabase
4. Fazer login
5. Fazer busca

---

## 📞 Se Tiver Dúvidas

1. Consulte **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)**
2. Consulte **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** → Troubleshooting
3. Ver logs:
   - Railway: Dashboard → Logs
   - Vercel: Deployments → View Logs
   - Supabase: Logs (se houver erro SQL)

---

## 🎉 Pronto!

Seu BuscaPeça estará online em:
- Frontend: https://buscapeca-[ID].vercel.app
- Backend: https://buscapeca-production-[ID].railway.app
- Database: Supabase Postgres

---

**Próximo Passo**: Abra **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** e comece! ✅
