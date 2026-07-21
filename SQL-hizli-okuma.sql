-- ============================================================
-- HIZLI OKUMA — koç/veli görünürlüğü için kalıcı kayıt tabloları
-- Supabase → SQL Editor'da TEK SEFERDE çalıştır.
-- (Kod bu tabloları push'tan sonra kullanmaya başlar; ÖNCE bunu çalıştır.)
-- ============================================================

-- 1) Okuma hızı testi sonuçları
create table if not exists public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wpm integer not null,
  comprehension integer not null,
  effective_wpm integer not null,
  passage_id text,
  passage_title text,
  created_at timestamptz not null default now()
);

create index if not exists reading_sessions_user_idx
  on public.reading_sessions (user_id, created_at desc);

-- Aynı sonucun iki kez yazılmasını engelle (backfill güvenliği)
create unique index if not exists reading_sessions_unique_row
  on public.reading_sessions (user_id, created_at);

-- 2) Tamamlanan egzersiz turları (takistoskop / gölgeleme / blok / schulte)
create table if not exists public.reading_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default now()
);

create index if not exists reading_exercises_user_idx
  on public.reading_exercises (user_id, created_at desc);

-- 3) İzinler (proje deseni: service role ile erişiliyor, RLS kapalı)
grant all on public.reading_sessions to anon, authenticated, service_role;
grant all on public.reading_exercises to anon, authenticated, service_role;

alter table public.reading_sessions disable row level security;
alter table public.reading_exercises disable row level security;
