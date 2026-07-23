-- Launch-Rundmail: merkt sich pro Anmeldung, wann die "Wir sind live"-Mail
-- rausging — so kann der Versand beliebig oft angestoßen werden, ohne dass
-- jemand doppelt Post bekommt.

alter table public.launch_signups
  add column if not exists notified_at timestamptz;
