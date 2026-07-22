-- Productivity workspace (Esma): interactive projects, tasks and notes.
-- Admin-managed (RLS via public.is_admin() from the initial migration).

create table if not exists public.productivity_tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  tag         text not null default 'Work',
  due_at      timestamptz,
  done        boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.productivity_projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  status      text not null default 'Planning', -- 'In Progress' | 'Planning' | 'Completed'
  description text,
  progress    integer not null default 0,
  due_date    date,
  icon        text not null default 'Orbit',     -- lucide icon key
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.productivity_notes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- updated_at triggers (set_updated_at() defined in the initial migration)
drop trigger if exists trg_prod_tasks_updated on public.productivity_tasks;
create trigger trg_prod_tasks_updated before update on public.productivity_tasks
  for each row execute function public.set_updated_at();

drop trigger if exists trg_prod_projects_updated on public.productivity_projects;
create trigger trg_prod_projects_updated before update on public.productivity_projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_prod_notes_updated on public.productivity_notes;
create trigger trg_prod_notes_updated before update on public.productivity_notes
  for each row execute function public.set_updated_at();

-- RLS: admin-only (Esma's workspace lives inside the admin panel)
alter table public.productivity_tasks    enable row level security;
alter table public.productivity_projects enable row level security;
alter table public.productivity_notes    enable row level security;

drop policy if exists "prod_tasks admin all"    on public.productivity_tasks;
drop policy if exists "prod_projects admin all" on public.productivity_projects;
drop policy if exists "prod_notes admin all"    on public.productivity_notes;

create policy "prod_tasks admin all"    on public.productivity_tasks    for all using (public.is_admin()) with check (public.is_admin());
create policy "prod_projects admin all" on public.productivity_projects for all using (public.is_admin()) with check (public.is_admin());
create policy "prod_notes admin all"    on public.productivity_notes    for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Seed Esma's starting workspace (only if empty)
-- ============================================================
insert into public.productivity_tasks (title, tag, due_at, done, sort_order)
select * from (values
  ('Finalize Q2 roadmap',            'Work',     (now()::date + time '10:00')::timestamptz, false, 1),
  ('Review design system updates',   'Design',   (now()::date + time '11:30')::timestamptz, true,  2),
  ('Reply to important emails',      'Admin',    (now()::date + time '14:00')::timestamptz, false, 3),
  ('Plan creator content this week', 'Content',  (now()::date + time '16:30')::timestamptz, false, 4),
  ('Prepare weekly team sync notes', 'Planning', (now()::date + time '18:00')::timestamptz, false, 5)
) as v(title, tag, due_at, done, sort_order)
where not exists (select 1 from public.productivity_tasks);

insert into public.productivity_projects (title, status, description, progress, due_date, icon)
select * from (values
  ('Q2 Roadmap',       'In Progress', 'Ship better, ship smarter.', 68, (now()::date + 9),  'Orbit'),
  ('Website Redesign', 'Planning',    'Clean, modern, and fast.',   42, (now()::date + 21), 'Globe'),
  ('Onboarding',       'Planning',    'Trim first-run steps.',      31, (now()::date + 18), 'ClipboardCheck')
) as v(title, status, description, progress, due_date, icon)
where not exists (select 1 from public.productivity_projects);

insert into public.productivity_notes (title, body, created_at)
select * from (values
  ('Design principles that scale', '', now()),
  ('Content ideas',                '', now() - interval '1 day'),
  ('Lessons from the week',        '', now() - interval '4 days'),
  ('Books I''m reading',           '', now() - interval '5 days')
) as v(title, body, created_at)
where not exists (select 1 from public.productivity_notes);
