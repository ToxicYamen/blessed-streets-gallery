-- Newsletter signups from the shop home page.
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text default 'home',
  created_at  timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Anyone can submit their email; we just require it to be non-empty.
drop policy if exists "newsletter public insert" on public.newsletter_subscribers;
create policy "newsletter public insert" on public.newsletter_subscribers
  for insert
  with check (char_length(email) > 0);

-- Admins (Esma) see and manage the list.
drop policy if exists "newsletter admin select" on public.newsletter_subscribers;
drop policy if exists "newsletter admin delete" on public.newsletter_subscribers;
create policy "newsletter admin select" on public.newsletter_subscribers for select using (public.is_admin());
create policy "newsletter admin delete" on public.newsletter_subscribers for delete using (public.is_admin());
