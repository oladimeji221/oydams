alter table public.products
add column sort_order integer;

with ranked as (
  select id, row_number() over (order by created_at, id)::integer as position
  from public.products
)
update public.products p
set sort_order = ranked.position
from ranked
where p.id = ranked.id;

alter table public.products
alter column sort_order set default 0,
alter column sort_order set not null;

create index products_sort_order_idx
on public.products (sort_order, created_at desc);
