alter table public.products
add column available boolean not null default true;

create index products_active_available_idx
on public.products (active, available, sort_order);
