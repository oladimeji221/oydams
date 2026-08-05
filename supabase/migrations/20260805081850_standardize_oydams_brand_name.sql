update public.products
set name = case id
  when '10000000-0000-4000-8000-000000000007' then 'Oydams Meat Pie'
  when '10000000-0000-4000-8000-000000000008' then 'Oydams Fruit Cocktail'
  else name
end
where id in (
  '10000000-0000-4000-8000-000000000007',
  '10000000-0000-4000-8000-000000000008'
);
