-- Support inbox: messages submitted via the shop's support form land here and
-- show up in the admin "Email" page. Esma reads them, replies (real email sent
-- by an edge function later), and answered ones move to the "answered" folder.

create table if not exists public.support_messages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  subject         text,
  message         text not null,
  attachment_url  text,
  attachment_name text,
  status          text not null default 'inbox',  -- 'inbox' | 'answered' | 'archived' | 'trash'
  read            boolean not null default false,
  reply_body      text,
  replied_at      timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists support_messages_status_idx on public.support_messages (status);
create index if not exists support_messages_created_idx on public.support_messages (created_at desc);

drop trigger if exists trg_support_updated on public.support_messages;
create trigger trg_support_updated before update on public.support_messages
  for each row execute function public.set_updated_at();

alter table public.support_messages enable row level security;

-- Anyone (anon shop visitor) may submit a new message, but only as a fresh
-- 'inbox' item — they can't set answered/reply fields.
drop policy if exists "support public insert" on public.support_messages;
create policy "support public insert" on public.support_messages
  for insert
  with check (status = 'inbox' and char_length(message) > 0 and char_length(email) > 0);

-- Admins (Esma) read and manage everything.
drop policy if exists "support admin select" on public.support_messages;
drop policy if exists "support admin update" on public.support_messages;
drop policy if exists "support admin delete" on public.support_messages;
create policy "support admin select" on public.support_messages for select using (public.is_admin());
create policy "support admin update" on public.support_messages for update using (public.is_admin()) with check (public.is_admin());
create policy "support admin delete" on public.support_messages for delete using (public.is_admin());

-- Storage bucket for support attachments (image / PDF). Public read, anyone can upload.
insert into storage.buckets (id, name, public)
values ('support-attachments', 'support-attachments', true)
on conflict (id) do nothing;

drop policy if exists "support attach public read"   on storage.objects;
drop policy if exists "support attach public insert" on storage.objects;
drop policy if exists "support attach admin delete"  on storage.objects;
create policy "support attach public read"   on storage.objects for select using (bucket_id = 'support-attachments');
create policy "support attach public insert" on storage.objects for insert with check (bucket_id = 'support-attachments');
create policy "support attach admin delete"  on storage.objects for delete using (bucket_id = 'support-attachments' and public.is_admin());
