create extension if not exists "pgcrypto";

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Cakes', 'Pastries', 'Parfaits', 'Yoghurt', 'Drinks')),
  price numeric(12,2) not null check (price >= 0),
  description text not null default '',
  image_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  using (active = true or auth.role() = 'authenticated');

create policy "Authenticated users can add products"
  on public.products for insert to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on public.products for update to authenticated
  using (true) with check (true);

create policy "Authenticated users can delete products"
  on public.products for delete to authenticated
  using (true);

create index products_active_created_at_idx
  on public.products (active, created_at desc);
