-- BuscaPeça v1.0 (PRD) — Core Schema
-- Target schema: public
-- Observação: ajuste secrets/admin setup conforme seu projeto Supabase.
-- Rodar no Supabase SQL Editor.

-- =========================
-- Extensions (pg_trgm)
-- =========================
create extension if not exists pg_trgm;

-- =========================
-- Enums
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'operator', 'superadmin');
  end if;

  if not exists (select 1 from pg_type where typname = 'organization_type') then
    create type public.organization_type as enum ('STORE', 'SHOP');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('trial', 'active', 'expired');
  end if;
end $$;

-- =========================
-- Tables
-- =========================

-- organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  type public.organization_type not null,
  cnpj text not null unique,
  fantasy_name text not null,
  whatsapp text not null,
  cep text not null,
  is_active boolean not null default false,
  subscription_status public.subscription_status not null default 'trial',
  trial_ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  email text not null unique,
  password_hash text not null,
  role public.user_role not null,
  created_at timestamptz not null default now()
);

-- products (global catalog)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- inventory (tenant-scoped)
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price numeric(10,2) not null,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint inventory_org_product_unique unique (organization_id, product_id)
);

-- intention_logs
create table if not exists public.intention_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete cascade, -- target store
  product_id uuid references public.products(id) on delete set null,
  search_term text,
  sku text,
  price numeric(10,2),
  created_at timestamptz not null default now()
);

-- =========================
-- Indexes
-- =========================

-- Fuzzy search index
create index if not exists products_name_trgm_idx
  on public.products
  using gin (name gin_trgm_ops);

-- inventory join indexes
create index if not exists inventory_org_idx on public.inventory(organization_id);
create index if not exists inventory_product_idx on public.inventory(product_id);

-- organizations CEP index (first 5 digits)
-- PRD: "Indexado nos 5 primeiros dígitos"
-- We create an expression index for prefix matching.
create index if not exists organizations_cep_prefix5_idx
  on public.organizations ((substring(regexp_replace(cep, '[^0-9]', '', 'g') from 1 for 5)));

-- Search recency tag: updated_at already indexed if desired
create index if not exists inventory_updated_at_idx on public.inventory(updated_at);

-- =========================
-- Updated_at trigger for inventory upserts
-- =========================
create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inventory_set_updated_at on public.inventory;
create trigger trg_inventory_set_updated_at
before update on public.inventory
for each row
execute function public.set_inventory_updated_at();

-- =========================
-- RLS (basic multi-tenant safety)
-- =========================
-- Recomendação: autenticar via JWT do Supabase ou pelo seu backend.
-- Aqui habilitamos RLS para forçar disciplina.
-- O seu backend deve sempre filtrar por organization_id.
-- Para MVP, o RLS será permissivo para o service role e pode ser ajustado depois.

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.intention_logs enable row level security;

-- Policies (MVP minimal):
-- Service role (service key) ignora RLS automaticamente.
-- Para autenticação via Supabase Auth (se você migrar depois), as policies devem ser ajustadas.
-- Mantemos policies "deny all" para evitar vazamento acidental via anon.
drop policy if exists "deny_anon_all_organizations" on public.organizations;
create policy "deny_anon_all_organizations"
on public.organizations
for all
to anon
using (false)
with check (false);

drop policy if exists "deny_anon_all_users" on public.users;
create policy "deny_anon_all_users"
on public.users
for all
to anon
using (false)
with check (false);

drop policy if exists "deny_anon_all_products" on public.products;
create policy "deny_anon_all_products"
on public.products
for all
to anon
using (false)
with check (false);

drop policy if exists "deny_anon_all_inventory" on public.inventory;
create policy "deny_anon_all_inventory"
on public.inventory
for all
to anon
using (false)
with check (false);

drop policy if exists "deny_anon_all_intention_logs" on public.intention_logs;
create policy "deny_anon_all_intention_logs"
on public.intention_logs
for all
to anon
using (false)
with check (false);

-- Para authenticated role, você decide conforme seu modelo.
-- Por padrão, vamos negar para evitar vazamento; o backend (server) fará via service role.

drop policy if exists "deny_authenticated_all_organizations" on public.organizations;
create policy "deny_authenticated_all_organizations"
on public.organizations
for all
to authenticated
using (false)
with check (false);

drop policy if exists "deny_authenticated_all_users" on public.users;
create policy "deny_authenticated_all_users"
on public.users
for all
to authenticated
using (false)
with check (false);

drop policy if exists "deny_authenticated_all_products" on public.products;
create policy "deny_authenticated_all_products"
on public.products
for all
to authenticated
using (false)
with check (false);

drop policy if exists "deny_authenticated_all_inventory" on public.inventory;
create policy "deny_authenticated_all_inventory"
on public.inventory
for all
to authenticated
using (false)
with check (false);

drop policy if exists "deny_authenticated_all_intention_logs" on public.intention_logs;
create policy "deny_authenticated_all_intention_logs"
on public.intention_logs
for all
to authenticated
using (false)
with check (false);

-- =========================
-- Notes de consistência do PRD
-- =========================
-- - RN-01 será implementado no backend via filtros:
--   organizations.is_active = true
--   organizations.subscription_status = 'active'
--   inventory.quantity > 0
-- - Recência (🟢/🟡/🔴) será calculada com inventory.updated_at no backend
-- - Upsert em inventory precisa preservar updated_at via trigger acima
