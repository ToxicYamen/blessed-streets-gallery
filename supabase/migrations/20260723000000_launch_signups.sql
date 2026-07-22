-- Coming-Soon-Gate: E-Mail-Sammlung für den Launch.
-- Jeder darf sich eintragen (anon insert), aber nur Admins dürfen die Liste lesen.

create table if not exists public.launch_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'coming-soon',
  created_at timestamptz not null default now()
);

alter table public.launch_signups enable row level security;

-- Eintragen darf jeder Besucher — auch ohne Account.
create policy "launch_signups_insert_public"
  on public.launch_signups for insert
  to anon, authenticated
  with check (true);

-- Lesen dürfen nur Admins (fürs Admin-Panel). Kein update/delete für Clients.
create policy "launch_signups_select_admin"
  on public.launch_signups for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
