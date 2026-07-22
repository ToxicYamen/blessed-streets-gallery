-- Phase B+ — Tracking columns on orders so the customer Account page can
-- show "Bei DHL/UPS/… verfolgen" once a shipment is on the road.
--
-- Additive only — no existing data touched.

alter table public.orders
  add column if not exists tracking_number  text,
  add column if not exists shipping_carrier text,
  add column if not exists shipped_at       timestamptz;

-- Lightweight check so the admin UI can rely on a closed enum without a
-- separate Postgres ENUM type (which is harder to migrate later).
alter table public.orders drop constraint if exists orders_shipping_carrier_chk;
alter table public.orders
  add constraint orders_shipping_carrier_chk
  check (shipping_carrier is null or shipping_carrier in ('dhl','ups','dpd','gls','hermes'));

create index if not exists orders_tracking_idx on public.orders (tracking_number)
  where tracking_number is not null;
