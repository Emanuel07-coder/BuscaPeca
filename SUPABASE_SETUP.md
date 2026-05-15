# 🟢 Supabase Setup — Passo a Passo

## 1. Criar Projeto

1. https://supabase.com → **New project**
2. Preencher:
   - **Organization**: (criar ou selecionar)
   - **Project name**: `buscapeca`
   - **Database Password**: (guardar em seguro!)
   - **Region**: São Paulo (ou mais próximo)
3. Clicar **Create new project**
4. ⏳ Aguardar ~2 minutos

## 2. Copiar DATABASE_URL

Precisamos de 4 valores:

### Via Connection String (Mais Fácil)

1. Dashboard → **Settings** → **Database** → **Connection string**
2. Selecionar **URI** em **Connection pooling**
3. Ver ou copiar apenas a parte ativa:

```
postgresql://postgres:[password]@[project-id].supabase.co:5432/postgres?schema=public
```

### Via Componentes Individuais

Se preferir montar manualmente:

1. **Host**: `[project-id].supabase.co`
2. **Port**: `5432`
3. **User**: `postgres`
4. **Password**: (aquela que você criou)
5. **Database**: `postgres`

**Formato final**:
```
postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
```

## 3. Encontrar Project ID

1. Dashboard → **Settings** → **General**
2. Procurar por **Project ID** (ex: `abcdef123456`)
3. Ou olhar na URL: `supabase.com/project/[PROJECT_ID]`

## 4. Executar Schema SQL

1. Supabase → **SQL Editor** → **New query**
2. Copiar **TODO** o arquivo `database/schema.sql`
3. Colar no editor
4. Clicar **Run** (botão azul no canto superior direito)
5. ✅ Aguardar completar (deve aparecer verde)

## 5. Verificar Setup

No **SQL Editor**, rodar:

```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar índices
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public';

-- Verificar extensões
SELECT extname FROM pg_extension;
```

Deve retornar:
- Tables: organizations, users, products, inventory, intention_logs
- Extension: pg_trgm

## 6. Copiar para .env.local

```bash
# Seu .env.local
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
```

Substituir:
- `[PASSWORD]`: aquela que você criou no Supabase
- `[PROJECT_ID]`: ex `abcdef123456`

## ✅ Teste Local

```bash
# Testar conexão
psql "[Sua DATABASE_URL aqui]"

# Se funcionar, sairá deste prompt:
# postgres=> 

# Depois sair com: \q
```

## 🔒 Backup Automático

1. Supabase → **Settings** → **Backups**
2. Verificar se **Automatic backups** está ✅ habilitado
3. Padrão: diário

## 🚀 Próximo Passo

Agora use `DATABASE_URL` para:
- Railway (backend)
- Desenvolvimento local

---

**Nota**: Nunca commitar `DATABASE_URL` no Git! Já está no `.gitignore`.
