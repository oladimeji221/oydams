create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Users can view their own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text;
begin
  -- The first account created is the business owner. All later accounts are customers.
  select case when exists (select 1 from public.profiles where role = 'admin')
    then 'customer' else 'admin' end into assigned_role;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    assigned_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill accounts created before this migration. The oldest account becomes admin.
insert into public.profiles (id, email, full_name, role, created_at)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  case when row_number() over (order by u.created_at, u.id) = 1 then 'admin' else 'customer' end,
  u.created_at
from auth.users u
on conflict (id) do nothing;

drop policy if exists "Anyone can view active products" on public.products;
drop policy if exists "Authenticated users can add products" on public.products;
drop policy if exists "Authenticated users can update products" on public.products;
drop policy if exists "Authenticated users can delete products" on public.products;

create policy "Anyone can view active products"
  on public.products for select
  using (active = true or public.is_admin());

create policy "Admins can add products"
  on public.products for insert to authenticated
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (public.is_admin());
