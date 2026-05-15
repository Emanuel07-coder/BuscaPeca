# 🟣 Vercel Deployment — Guia Rápido

## 1. Preparar

Antes de começar, você precisa de:
- [ ] Repositório do BuscaPeça no GitHub (público ou privado)
- [ ] URL do backend no Railway (ex: `https://buscapeca-production-xyzabc.railway.app`)

## 2. Criar Conta Vercel

1. https://vercel.com → **Sign up with GitHub**
2. Autorizar Vercel acessar seu GitHub
3. Confirmar email

## 3. Importar Projeto

1. Vercel Dashboard → **Add New** → **Project**
2. Clicar **Import Git Repository**
3. Procurar por `buscapeca` (seu repositório)
4. Clicar **Import**

## 4. Configurar Build

Vercel deve auto-detectar como **Vite** project.

Se não auto-detectar, configurar manualmente:

1. **Settings** → **Build & Development Settings**
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build:frontend`
4. **Output Directory**: `frontend/dist`
5. **Install Command**: `npm install:all`
6. Clicar **Save**

## 5. Configurar Environment Variables

1. **Settings** → **Environment Variables**
2. Adicionar para **Production**:

```
VITE_API_URL = https://buscapeca-production-xyzabc.railway.app
VITE_APP_NAME = BuscaPeça
```

Substituir:
- `https://buscapeca-production-xyzabc.railway.app` pela sua URL do Railway

3. Clicar **Save**

## 6. Deploy

Opção A - Automático:
- Vercel redeploya automaticamente quando você faz push para `main`

Opção B - Manual:
1. **Deployments** → botão **Redeploy** (canto superior)
2. Selecionar branch `main`
3. Clicar **Redeploy**

⏳ Aguardar ~3-5 minutos

## 7. Copiar URL do Frontend

1. Após sucesso, Vercel mostra URL (ex: `https://buscapeca-nine.vercel.app`)
2. Esta é a URL pública do seu app!

## ✅ Verificar Funcionamento

1. Abrir https://buscapeca-nine.vercel.app
2. Testar:
   - [ ] Página carrega
   - [ ] Clica "Criar nova conta"
   - [ ] Digita dados e submete
   - [ ] Redireciona para busca
   - [ ] Busca funciona (conectou no backend Railway)

## 🔍 Ver Logs

1. **Deployments** → Clique no deployment
2. **Logs** → ver build output
3. Se erro, procurar por mensagens vermelhas

## 🐛 Troubleshooting

### Frontend carrega mas busca não funciona

**Problema**: CORS error ou "Cannot reach server"

**Solução**:
1. Abrir DevTools (F12) → **Console**
2. Ver erro exato (ex: "Failed to fetch")
3. Verificar `VITE_API_URL` em Vercel
4. Verificar se Railway está online

### "Build fails"

**Problema**: Build command retorna erro

**Solução**:
1. Ver logs completos
2. Comum: `npm install:all` falha
   - Deletar `node_modules` e `package-lock.json` localmente
   - Fazer push novamente
3. Comum: `npm run build:frontend` falha
   - Rodar localmente: `cd frontend && npm install && npm run build`
   - Verificar erros

### Página em branco

**Problema**: Frontend carrega mas nada aparece

**Solução**:
1. Abrir DevTools → **Console**
2. Procurar por erros `[object Object]` ou "undefined"
3. Verificar se `VITE_API_URL` está correto

## 📝 vercel.json

Arquivo na raiz (já criado com config):

```json
{
  "buildCommand": "npm run build:frontend",
  "outputDirectory": "frontend/dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_APP_NAME": "BuscaPeça"
  }
}
```

Vercel lê automaticamente!

## 🔄 CI/CD Automático

Sempre que você faz push para `main`:
1. GitHub detecta mudança
2. Vercel auto-compila
3. Se sucesso → deploy automático
4. Se erro → cancela e notifica

Sem fazer nada manualmente!

## 🌍 Domínio Customizado (Opcional)

1. Vercel → Projeto → **Settings** → **Domains**
2. **Add Domain**
3. Colocar seu domínio (ex: `app.buscapeca.com.br`)
4. Seguir instruções de DNS
5. Vercel valida e conecta automaticamente

---

**Pronto!** Seu app está online e conectado ao backend em Railway + banco em Supabase. 🚀
