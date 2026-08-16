-- إعداد جدول الأسعار والعروض - MYA PDF
-- نَفّذ هذا الكود مرة واحدة فقط في: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists public.prices (
  id text primary key,
  type text not null default 'price',
  col1 text,
  col2 text,
  col3 text,
  col4 text
);

alter table public.prices enable row level security;

drop policy if exists "allow_all_prices" on public.prices;
create policy "allow_all_prices" on public.prices
  for all using (true) with check (true);
