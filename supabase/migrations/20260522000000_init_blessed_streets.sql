-- Blessed Streets — initial schema for Supabase project xsyjrijezdajiojxgzzr
-- Shared backend for both the shop frontend (blessed-streets-gallery)
-- and the admin panel (blessed-admin-panel).
--
-- Tables:   collections, products, profiles, orders, lookbook
-- Auth:     handle_new_user() creates a profile on signup (auto-admin for known emails)
-- Security: RLS on every table + is_admin() helper
-- Storage:  public "product-images" bucket (admin-write)

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ============================================================
-- Tables
-- ============================================================
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  image       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  price           numeric(10,2) not null default 0,
  description     text,
  color           text,
  images          text[] default '{}',
  size            text[] default '{}',
  size_quantities jsonb default '{}'::jsonb,
  stock           integer not null default 0,
  is_featured     boolean default false,
  is_new          boolean default false,
  collection_id   uuid references public.collections(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists products_slug_idx on public.products (slug);

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  first_name  text,
  last_name   text,
  phone       text,
  address     text,
  avatar_url  text,
  role        text not null default 'user', -- 'user' | 'staff' | 'admin'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  items              jsonb not null default '[]'::jsonb,
  total              numeric(10,2) not null default 0,
  status             text not null default 'pending',
  shipping_address   text,
  payment_method     text,
  color              text,
  estimated_delivery timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_status_idx  on public.orders (status);

create table if not exists public.lookbook (
  id          uuid primary key default gen_random_uuid(),
  image       text not null,
  title       text,
  tags        text[] default '{}',
  order_index integer default 0,
  created_at  timestamptz default now()
);

-- ============================================================
-- updated_at maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_collections_updated on public.collections;
create trigger trg_collections_updated before update on public.collections
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auth: create a profile when a new auth user signs up.
-- Known admin emails are promoted to the 'admin' role automatically,
-- mirroring the previous hardcoded admin list.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role text := 'user';
begin
  if new.email in ('admin@blessedstreets.de', 'developer@uniwebprog.com') then
    v_role := 'admin';
  end if;

  insert into public.profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    v_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- is_admin() — SECURITY DEFINER so it bypasses RLS on profiles
-- (avoids recursive policy evaluation).
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.collections enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.lookbook    enable row level security;

-- Catalog: public read, admin write
drop policy if exists "products public read"    on public.products;
drop policy if exists "products admin write"     on public.products;
drop policy if exists "collections public read"  on public.collections;
drop policy if exists "collections admin write"  on public.collections;
drop policy if exists "lookbook public read"     on public.lookbook;
drop policy if exists "lookbook admin write"      on public.lookbook;

create policy "products public read"   on public.products    for select using (true);
create policy "products admin write"   on public.products    for all using (public.is_admin()) with check (public.is_admin());
create policy "collections public read" on public.collections for select using (true);
create policy "collections admin write" on public.collections for all using (public.is_admin()) with check (public.is_admin());
create policy "lookbook public read"   on public.lookbook    for select using (true);
create policy "lookbook admin write"   on public.lookbook    for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: self read/update; admin read/update all; self insert (trigger fallback)
drop policy if exists "profiles self select"  on public.profiles;
drop policy if exists "profiles self update"  on public.profiles;
drop policy if exists "profiles admin update" on public.profiles;
drop policy if exists "profiles self insert"  on public.profiles;

create policy "profiles self select"  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles self update"  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "profiles self insert"  on public.profiles for insert with check (auth.uid() = id);

-- Orders: user owns their orders; admin sees/manages all
drop policy if exists "orders user select"  on public.orders;
drop policy if exists "orders user insert"  on public.orders;
drop policy if exists "orders admin update" on public.orders;
drop policy if exists "orders admin delete" on public.orders;

create policy "orders user select"  on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders user insert"  on public.orders for insert with check (auth.uid() = user_id);
create policy "orders admin update" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "orders admin delete" on public.orders for delete using (public.is_admin());

-- ============================================================
-- Storage: public product-images bucket (admin-write)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read"   on storage.objects;
drop policy if exists "product images admin insert"  on storage.objects;
drop policy if exists "product images admin update"  on storage.objects;
drop policy if exists "product images admin delete"  on storage.objects;

create policy "product images public read"  on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product images admin insert" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "product images admin update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());
create policy "product images admin delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================
-- Seed: the 2 hoodies
-- Image URLs are the current shop-local paths; they get rewritten
-- to Storage URLs once the images are uploaded.
-- ============================================================
insert into public.products (name, slug, price, description, color, images, size, size_quantities, stock, is_featured, is_new)
values
(
  'Blesssed Streets Logo Hoodie', 'black-hoodie', 69.99,
  'Premium black hoodie featuring the iconic Blesssed Streets logo embroidery. Made from high-quality cotton for ultimate comfort and style.',
  'black',
  array[
    '/lovable-uploads/ae0b165b-1ee3-42d3-b7b6-ef45f7449951.png',
    '/lovable-uploads/623e99f8-cf2a-460c-acae-13d2d7081dec.png',
    '/lovable-uploads/28893163-9864-483e-aa41-5c9c5f70b41c.png'
  ],
  array['M','L','XL'],
  '{"M":3,"L":18,"XL":10}'::jsonb,
  31, true, true
),
(
  'Blesssed Streets Logo Hoodie', 'khaki-hoodie', 59.99,
  'Premium khaki hoodie featuring the iconic Blesssed Streets logo embroidery. Made from high-quality cotton for ultimate comfort and style.',
  'khaki',
  array[
    '/lovable-uploads/68bd47c8-4553-4f02-8047-e01949d85881.png',
    '/lovable-uploads/14cc0786-37aa-4471-8f05-f800b6420083.png',
    '/lovable-uploads/bc7f81ea-fb32-4ff2-915a-b8a677272b83.png',
    '/lovable-uploads/4db1a544-1a50-475b-80dd-36804b583257.png'
  ],
  array['M','L','XL'],
  '{"M":19,"L":21,"XL":9}'::jsonb,
  49, true, true
)
on conflict (slug) do nothing;
