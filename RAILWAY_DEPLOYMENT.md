# 🔵 Railway Deployment — Guia Rápido

## 1. Preparar

Antes de começar, você precisa ter:
- [ ] Repositório do BuscaPeça no GitHub
- [ ] `DATABASE_URL` do Supabase (ex: `postgresql://postgres:...@...supabase.co:5432/postgres`)
- [ ] Gerar `JWT_SECRET` seguro

### Gerar JWT_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
$bytes = [byte[]]::new(32)
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Result: algo como: "a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q"
```

Guardar este valor!

## 2. Criar Conta Railway

1. https://railway.app → **Login with GitHub**
2. Autorizar Railway acessar seu GitHub
3. Confirmar email

## 3. Criar Projeto

1. Dashboard → **New** → **Empty Project**
2. Clicar **Add Service** → **GitHub Repo**
3. Selecionar seu repositório do BuscaPeça
4. Selecionar **main** branch
5. Railway vai auto-detect e configurar o build

## 4. Configurar Environment Variables

1. Seu projeto Railway → **Variables**

Adicionar:

```env
PORT=3001
NODE_ENV=production
JWT_SECRET=<seu-valor-gerado-acima-32-chars>
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
BRASIL_API_URL=https://brasilapi.com.br/api
```

Substituir:
- `JWT_SECRET`: valor gerado no passo anterior
- `DATABASE_URL`: valor do Supabase

## 5. Deploy

Railway auto-detects:
- `package.json` na raiz ✅
- Lê scripts: `npm run install:all` → `npm run build:backend` → `npm run start:backend` ✅

Deploy automático quando:
1. Você faz push para `main` no GitHub
2. Ou clica **Redeploy** manualmente em Railway

## 6. Copiar URL do Backend

1. Seu projeto Railway → **Deployments**
2. Clicar no deployment ativo
3. Copiar URL (ex: `https://buscapeca-production-xyzabc.railway.app`)

**Guardar esta URL!** Será usada no Vercel.

## ✅ Verificar Saúde

```bash
# Testar health check
curl https://buscapeca-production-xyzabc.railway.app/health

# Esperado:
# {"ok":true}
```

## 🔍 Ver Logs

1. Projeto Railway → **Deployments**
2. Clicar em ícone de "logs" (canto direito)
3. Buscar por erros

Mensagens de sucesso:
```
✅ Backend running on http://localhost:3001
```

## 🐛 Troubleshooting

### "Build fails"

1. Verificar logs: Railway → View Logs
2. Comum: `npm install` falha
   - Solução: Deletar `node_modules` e `package-lock.json` localmente, fazer push

### "502 Bad Gateway"

1. Verificar logs
2. Comum: `DATABASE_URL` incorreta
   - Solução: Verificar credentials Supabase

### Conexão recusada no banco

1. Testar DATABASE_URL localmente:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres"
   ```
2. Se não funcionar:
   - Verificar senha
   - Verificar IP allowlist no Supabase

## 🚀 Build & Start Scripts

Railway roda automaticamente:

```bash
# Install
npm run install:all
# Equivalente a: npm install && cd backend && npm install && cd ../frontend && npm install

# Build
npm run build:backend
# Equivalente a: cd backend && npm run build

# Start
npm run start:backend
# Equivalente a: cd backend && npm start
```

Se mudar os scripts em `package.json`, Railway auto-atualiza.

## 📝 railway.toml

Arquivo opcional na raiz (já criado):

```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build:backend"

[start]
cmd = "npm run start:backend"
```

Railway lê automaticamente!

---

**Próximo Passo**: Deploy frontend em Vercel com `VITE_API_URL` apontando para URL do Railway.
