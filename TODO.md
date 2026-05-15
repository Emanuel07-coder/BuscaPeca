# 📋 TODO — BuscaPeça MVP v1.0

## ✅ Fase 1: Core (Concluída)

### Backend Infrastructure
- [x] Fastify + TypeScript setup
- [x] CORS habilitado
- [x] Multipart file upload
- [x] JWT token geração/verificação (7 dias)
- [x] Database connection com pg
- [x] Error handling básico

### Autenticação e Autorização
- [x] Auth service (signup, login, getUserById)
- [x] Password hashing com bcryptjs
- [x] JWT payload (sub, role, organization_id)
- [x] RBAC plugin com authorize decorator
- [x] Protected routes para cada papel

### Database Schema
- [x] Tabelas: organizations, users, products, inventory, intention_logs
- [x] Enums: user_role, organization_type, subscription_status
- [x] Extensions: pg_trgm para fuzzy search
- [x] Indexes: GIN (name), CEP prefix, timestamps
- [x] Constraints: unique, FK, CHECK (quantity >= 0)
- [x] Triggers: automatic updated_at

### Serviços de Negócio
- [x] AuthService (signup, login)
- [x] OrganizationService (CRUD, pendingVerifications)
- [x] SearchService (fuzzy search, intention logging)
- [x] InventoryService (upsert, increment, decrement)
- [x] CSVService (parser CSV com sanitização)
- [x] BrasilAPIService (CNPJ validation)

### Controllers e Rotas
- [x] AuthController (/auth/signup, /auth/login, /auth/me)
- [x] SearchController (/search, /search/log)
- [x] InventoryController (/inventory, /inventory/:id/[+/-], /inventory/import)
- [x] AdminController (/admin/organizations/*)
- [x] Health route (/health)

### Frontend Foundation
- [x] React + Vite + Tailwind setup
- [x] Zustand auth store (signin/signup/logout persistence)
- [x] Axios HTTP client com token injection
- [x] TypeScript types (User, Organization, Product, etc.)
- [x] useAuth hook
- [x] Button component reusável
- [x] Protected routes (ProtectedRoute, AdminProtectedRoute)

### Frontend Pages
- [x] AuthPage (login/signup com type selector)
- [x] SearchPage (UC-01: busca + botão WhatsApp)
- [x] ImportPage (UC-02: CSV upload + feedback)
- [x] InventoryPage (UC-03: adjustments com [+/-])
- [x] AdminPage (moderação de CNPJ + listagem)

### Documentação
- [x] README.md (Quick Start, Stack, Deploy)
- [x] .env.local example
- [x] Schema SQL comentado

---

## 🔄 Fase 2: Refinement & Testing (Próxima)

### Backend Melhorias
- [ ] Validação com Zod (schemas de request)
- [ ] Paginação em endpoints de lista
- [ ] Error handling melhorado (custom errors)
- [ ] Logging estruturado (pino)
- [ ] Tests (Jest/Vitest para services)
- [ ] Sentry integration (error tracking)
- [ ] Rate limiting (ffmpeg ou custom)
- [ ] API documentation (Swagger)

### Frontend Melhorias
- [ ] Toast notifications (react-toastify)
- [ ] Form validation (react-hook-form)
- [ ] Loading states e spinners
- [ ] Error boundaries
- [ ] Mobile responsiveness (grid + flexbox)
- [ ] Dark mode toggle
- [ ] Navbar com logout e user info
- [ ] Perfil de usuário
- [ ] Histórico de buscas (para mecânicos)

### Feature Enhancements
- [ ] Notificação WhatsApp para SuperAdmin (aprovação)
- [ ] Soft delete para organizações
- [ ] Audit logs (who changed what)
- [ ] Email notifications
- [ ] Bulk actions no admin (multi-select)
- [ ] Export relatórios (CSV/PDF)
- [ ] Tags de recência (🟢🟡🔴 para inventory)

---

## ⏳ Fase 3: Payments & Integrations

### Payment Gateway
- [ ] Integração Stripe ou Asaas
- [ ] Cobrança recorrente mensal
- [ ] Webhook para confirmação
- [ ] Renovação automática de trial

### Chat e Comunicação
- [ ] Chat interno entre oficina ↔ loja
- [ ] Notificações push
- [ ] Histórico de conversas

### ERP Integrations
- [ ] API para importação automática
- [ ] Webhooks (inventory sync)
- [ ] Suporte a principais ERPs

---

## 🧪 Testes de Aceitação (MVP)

### Busca (UC-01)
- [ ] [ ] Buscar "filtro" retorna resultados em <300ms
- [ ] [ ] Lojas with subscription_status='expired' não aparecem
- [ ] [ ] Lojas with is_active=false não aparecem
- [ ] [ ] Proximidade por CEP funciona (5 dígitos)
- [ ] [ ] Ordenação por preço ASC, depois proximidade
- [ ] [ ] Clique WhatsApp abre wa.me com mensagem pré-preenchida
- [ ] [ ] Intenção é logada em intention_logs

### Importação (UC-02)
- [ ] [ ] Upload CSV com 100 linhas processa em <5s
- [ ] [ ] CSV inválido (preço "S/A") é pulado com erro
- [ ] [ ] Coluna "price" aceita "R$ 45,50" e converte para 45.50
- [ ] [ ] Duplicatas de SKU no arquivo: última ocorrência prevalece
- [ ] [ ] Painel resume: X criados, Y atualizados, Z erros
- [ ] [ ] Produtos novos são criados em products table
- [ ] [ ] Produtos existentes: atualiza price + quantity

### Ajuste Rápido (UC-03)
- [ ] [ ] Clique [−] decrementa quantity by 1
- [ ] [ ] [−] bloqueado quando quantity = 0
- [ ] [ ] Clique [+] incrementa quantity by 1
- [ ] [ ] Quantidade atualiza na tela instantaneamente
- [ ] [ ] Operação não permite valores negativos (SQL CHECK)

### Admin (Moderação)
- [ ] [ ] SuperAdmin vê lista de org pendentes
- [ ] [ ] SuperAdmin consegue aprov

ar (is_active=true)
- [ ] [ ] CNPJ inválido na BrasilAPI bloqueia aprovação
- [ ] [ ] Org aprovada vira visível na busca imediatamente

### RBAC & Segurança
- [ ] [ ] Operador tenta /inventory/import → 403
- [ ] [ ] SuperAdmin tenta /search → sem filtro (acesso total)
- [ ] [ ] Mecânico vê apenas sua org na busca
- [ ] [ ] Token expirado (>7d) → 401 na próxima req
- [ ] [ ] Password hash não é nunca exposição (DELETE password_hash)

### Multi-tenancy
- [ ] [ ] Usuário da Org A não vê inventário da Org B
- [ ] [ ] Alteração de estoque de Org A não afeta Org B
- [ ] [ ] Admin da Org A não consegue aprovar CNPJs (é tarefa SuperAdmin)

---

## 📊 KPIs de Sucesso

### Performance (PRD)
- [ ] Latência de busca ≤300ms (P95)
- [ ] Importação 2k linhas em ≤10s
- [ ] Disponibilidade ≥99.5% (07h-19h)
- [ ] Time to first search <100ms

### Negócio
- [ ] Taxa de Zero-Search ≤20%
- [ ] Taxa de conversão Trial→Pago ≥15%
- [ ] Retention 30d ≥70%
- [ ] Volume de intenções >100/dia

---

## 🚀 Deployment Checklist

### Backend (Railway/Render)
- [ ] Environment variables configuradas
- [ ] DATABASE_URL apontando para Supabase
- [ ] JWT_SECRET com valor aleatório seguro
- [ ] NODE_ENV=production
- [ ] Port 3001 exposto
- [ ] Health check (`GET /health`) retorna 200
- [ ] Logs centralizados
- [ ] Sentry configurado para error tracking

### Frontend (Vercel)
- [ ] VITE_API_URL apontando para backend em produção
- [ ] Build gera arquivo dist/
- [ ] Custom domain
- [ ] SSL/TLS automático
- [ ] Asset caching habilitado
- [ ] Environment variables injected

### Database (Supabase)
- [ ] Schema SQL rodado
- [ ] Backups automáticos habilitados
- [ ] RLS policies configuradas
- [ ] Performance insights monitorados

---

## 🔐 Security Checklist

- [x] JWT auth com expira 7d
- [x] Passwords hashed com bcryptjs (cost 10)
- [x] Multi-tenancy via organization_id
- [x] SQL Injection prevention (pg parameterized queries)
- [x] XSS prevention (React escapa HTML)
- [ ] CORS restritivo em prod (not origin: true)
- [ ] Rate limiting per IP/user
- [ ] HTTPS forced
- [ ] CSP headers
- [ ] Secrets rotacionados periodicamente

---

## 📝 Notas

### CSV Import
- Colunas obrigatórias: sku, name, price, quantity (case-insensitive)
- Linhas inválidas são puladas mas não interrompem batch
- Preços: "R$ 45,50" ou "45.50" (ambos convertem para float)
- Quantidades: "10" ou "10.5" (ambos convertem para int floor)
- Upsert: se SKU existe → UPDATE, senão → INSERT

### WhatsApp Link
- Format: `https://wa.me/[phone]?text=[url_encoded_message]`
- Phone em formato E.164 (ex: 5511987654321)
- Message pré-preenchida: nome da oficina, peça, preço
- Link abre em wa.me (web.whatsapp.com fallback)

### Trial & Subscription
- Trial automático: 30 dias após signup
- Após 30d: subscription_status='expired'
- Org expired não aparece em buscas (inventory invisível)
- SuperAdmin pode renovar (+30d) ou mudar para 'active' (pago)

### Performance Notes
- pg_trgm index em products.name garante <300ms
- CEP prefix index (5 dígitos) otimiza proximidade
-Inventário indexado por org_id (filtro multi-tenant)
- Intention_logs append-only (não deleta para audit)

---

**Última atualização**: 14/05/2026  
**Status**: MVP Core Completo 60%  
**Próximo**: Refinement + Testing (Fase 2)
