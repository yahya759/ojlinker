-- شغّل هاد الملف كامل بـ Supabase SQL Editor (مشروعك الخاص بـ ojlinker)

create table if not exists public.revenues (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null check (amount > 0),
  description text,
  category text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12,2) not null check (amount > 0),
  description text,
  category text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists revenues_entry_date_idx on public.revenues (entry_date desc);
create index if not exists expenses_entry_date_idx on public.expenses (entry_date desc);

-- ملاحظة مهمة: بما إنه ما في تسجيل دخول بالنظام، الجداول هاي مفتوحة بالقراءة
-- والكتابة لأي حدا معه anon key (يعني أي حدا يعرف رابط الموقع). هاد مقبول
-- لواجهة داخلية بس خليك منتبه إنه ما في حماية إضافية أبعد من هيك.

alter table public.revenues enable row level security;
alter table public.expenses enable row level security;

create policy "public read revenues" on public.revenues
  for select using (true);
create policy "public insert revenues" on public.revenues
  for insert with check (true);
create policy "public update revenues" on public.revenues
  for update using (true);
create policy "public delete revenues" on public.revenues
  for delete using (true);

create policy "public read expenses" on public.expenses
  for select using (true);
create policy "public insert expenses" on public.expenses
  for insert with check (true);
create policy "public update expenses" on public.expenses
  for update using (true);
create policy "public delete expenses" on public.expenses
  for delete using (true);
