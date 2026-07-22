-- Guest checkout + ops plumbing (Welle 2).
--
--  a) orders.user_id nullable          → Gast-Checkout (kein Account nötig)
--  b) orders.customer_email            → E-Mail des Käufers (Gast UND eingeloggt)
--  c) app_config                       → Laufzeit-Secrets, nur service_role
--  d) decrement_stock()                → atomarer Lagerabzug (jsonb)
--  e) restock_stock()                  → symmetrische Rückbuchung (Refund)
--  f) CHECK constraint auf orders.status (NOT VALID wegen Altbestand)

-- ---------------------------------------------------------------------------
-- a) Gast-Checkout: user_id darf NULL sein.
alter table public.orders
  alter column user_id drop not null;

-- b) Käufer-E-Mail. Bei Gästen die einzige Kontaktmöglichkeit; bei
--    eingeloggten Kunden zusätzlich befüllt (schadet nie, hilft beim Support).
alter table public.orders
  add column if not exists customer_email text;

-- ---------------------------------------------------------------------------
-- c) app_config: Laufzeit-Secrets (RESEND_API_KEY, STRIPE_WEBHOOK_SECRET,
--    ADMIN_NOTIFY_EMAIL), weil CLI-Zugriff auf Supabase-Function-Secrets fehlt.
--    RLS ist AN und es gibt BEWUSST KEINE Policies → ausschließlich die
--    service_role (Edge Functions) kann lesen/schreiben. anon/authenticated
--    sehen nichts.
create table if not exists public.app_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

alter table public.app_config enable row level security;

comment on table public.app_config is
  'Laufzeit-Secrets & Konfiguration (z. B. RESEND_API_KEY, STRIPE_WEBHOOK_SECRET, '
  'ADMIN_NOTIFY_EMAIL). RLS ohne Policies: nur service_role hat Zugriff. '
  'Existiert, weil Function-Secrets nicht per CLI gepflegt werden können.';

-- ---------------------------------------------------------------------------
-- d) Atomarer Lagerabzug. Ersetzt das bisherige read-modify-write in
--    verify-checkout-session (Race-Condition bei parallelen Käufen).
--    Gibt false zurück, wenn der Bestand nicht reicht (kein Abzug erfolgt).
create or replace function public.decrement_stock(
  p_slug text,
  p_size text,
  p_qty  int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
     set size_quantities = jsonb_set(
           coalesce(size_quantities, '{}'::jsonb),
           array[p_size],
           to_jsonb(coalesce((size_quantities ->> p_size)::int, 0) - p_qty)
         )
   where slug = p_slug
     and coalesce((size_quantities ->> p_size)::int, 0) >= p_qty;
  return found;
end;
$$;

-- e) Symmetrische Rückbuchung für Refunds — bewusst OHNE >=-Guard
--    (Zurücklegen kann nie an fehlendem Bestand scheitern).
create or replace function public.restock_stock(
  p_slug text,
  p_size text,
  p_qty  int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
     set size_quantities = jsonb_set(
           coalesce(size_quantities, '{}'::jsonb),
           array[p_size],
           to_jsonb(coalesce((size_quantities ->> p_size)::int, 0) + p_qty)
         )
   where slug = p_slug;
  return found;
end;
$$;

-- Nur die service_role (Edge Functions) darf die Stock-Funktionen aufrufen.
revoke all on function public.decrement_stock(text, text, int) from public;
revoke all on function public.decrement_stock(text, text, int) from anon;
revoke all on function public.decrement_stock(text, text, int) from authenticated;
grant execute on function public.decrement_stock(text, text, int) to service_role;

revoke all on function public.restock_stock(text, text, int) from public;
revoke all on function public.restock_stock(text, text, int) from anon;
revoke all on function public.restock_stock(text, text, int) from authenticated;
grant execute on function public.restock_stock(text, text, int) to service_role;

-- ---------------------------------------------------------------------------
-- f) Status-CHECK. Als NOT VALID angelegt, damit eventuell vorhandene
--    Alt-Orders mit abweichenden Status-Werten die Migration nicht sprengen:
--    NOT VALID prüft nur NEUE/geänderte Zeilen, der Altbestand bleibt
--    unangetastet. Später optional: alter table … validate constraint.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_status_check
      check (status in (
        'pending', 'confirmed', 'processing', 'shipped',
        'delivered', 'cancelled', 'refunded'
      ))
      not valid;
  end if;
end$$;
