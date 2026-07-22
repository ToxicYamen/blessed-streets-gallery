-- Stripe-related columns + indices on the existing `orders` table.
-- Keeps the schema additive so the previous Supabase types still compile.

alter table public.orders
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists currency text default 'eur';

create unique index if not exists orders_stripe_session_id_key
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;

create index if not exists orders_stripe_pi_idx
  on public.orders (stripe_payment_intent_id);

-- Allow guests (anon role) to insert orders that came in through Stripe.
-- The Edge Function uses the service role, so this policy is only a safety net.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders'
      and policyname = 'orders_service_role_all'
  ) then
    create policy orders_service_role_all on public.orders
      for all to service_role using (true) with check (true);
  end if;
end$$;
