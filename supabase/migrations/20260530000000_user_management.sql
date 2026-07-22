-- Phase B — User management
--
-- Adds:
--   * profiles.is_banned         — boolean flag the admin UI flips
--   * profiles.banned_at         — when it happened
--   * profiles.banned_by         — which admin did it
--   * profiles_admin_audit       — append-only log of role/ban changes
--   * RLS policies + a hardening trigger so users can't promote themselves
--
-- All policies are namespaced so they're idempotent across re-runs.

alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists banned_at timestamptz,
  add column if not exists banned_by uuid references public.profiles(id);

create index if not exists profiles_is_banned_idx on public.profiles (is_banned) where is_banned;

-- Append-only audit log so we can trace who promoted/banned whom and why.
create table if not exists public.profiles_admin_audit (
  id          uuid primary key default gen_random_uuid(),
  target_id   uuid not null references public.profiles(id) on delete cascade,
  actor_id    uuid references public.profiles(id),
  action      text not null,                -- e.g. 'role_changed', 'banned', 'unbanned', 'edited'
  before_val  jsonb,
  after_val   jsonb,
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.profiles_admin_audit enable row level security;
drop policy if exists "audit admin read"   on public.profiles_admin_audit;
drop policy if exists "audit admin insert" on public.profiles_admin_audit;
create policy "audit admin read"   on public.profiles_admin_audit for select using (public.is_admin());
create policy "audit admin insert" on public.profiles_admin_audit for insert with check (public.is_admin());

-- Hardening: a normal user must NEVER be able to promote themselves to admin or
-- toggle is_banned. The `profiles admin update` policy from the init migration
-- already restricts UPDATE to admins, but we add a trigger as defense-in-depth
-- in case someone introduces a more permissive policy later.
create or replace function public.protect_profile_admin_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'role can only be changed by an admin';
  end if;
  if new.is_banned is distinct from old.is_banned and not public.is_admin() then
    raise exception 'is_banned can only be changed by an admin';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_admin_fields on public.profiles;
create trigger profiles_protect_admin_fields
  before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();
