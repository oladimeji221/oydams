insert into public.products (id, name, category, price, description, image_url, active) values
  ('10000000-0000-4000-8000-000000000001', 'Celebration Cake', 'Cakes', 25000, 'A beautifully finished custom cake for birthdays and life’s sweetest celebrations.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884044/oydams/products/cake.jpg', true),
  ('10000000-0000-4000-8000-000000000002', 'Signature Wedding Cake', 'Cakes', 85000, 'An elegant tiered centrepiece designed specially for wedding celebrations. Final pricing depends on size and design.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884048/oydams/products/wedding_cake2.jpg', true),
  ('10000000-0000-4000-8000-000000000003', 'Rich Foil Cake', 'Cakes', 3500, 'Soft, rich cake baked in a handy foil pack, perfect for gifting or enjoying at home.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884050/oydams/products/foil_cake.jpg', true),
  ('10000000-0000-4000-8000-000000000004', 'Cake Parfait', 'Parfaits', 3000, 'Fluffy cake and smooth cream layered into one colourful, satisfying treat.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884055/oydams/products/cake_parfait.jpg', true),
  ('10000000-0000-4000-8000-000000000005', 'Greek Yoghurt Parfait', 'Parfaits', 4500, 'Creamy Greek yoghurt layered generously with crunchy granola, nuts and delicious fresh fruit.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884067/oydams/products/greek_yoghurt_parfait.jpg', true),
  ('10000000-0000-4000-8000-000000000006', 'Sweetened Greek Yoghurt', 'Yoghurt', 3000, 'Fresh, creamy Greek yoghurt with a smooth vanilla taste, bottled and served chilled.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884070/oydams/products/vanilla_youghurt.jpg', true),
  ('10000000-0000-4000-8000-000000000007', 'Oydam’s Meat Pie', 'Pastries', 1500, 'Golden, flaky pastry filled with a rich and savoury meat-and-vegetable filling.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884073/oydams/products/meatpie.jpg', true),
  ('10000000-0000-4000-8000-000000000008', 'Oydam’s Fruit Cocktail', 'Drinks', 2000, 'A refreshing and colourful fruit cocktail served chilled for parties and everyday enjoyment.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884075/oydams/products/oydam_cocktail.jpg', true),
  ('10000000-0000-4000-8000-000000000009', 'Fresh Tigernut Drink', 'Drinks', 2000, 'A naturally rich and refreshing tigernut drink blended fresh and served chilled.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884078/oydams/products/3d4ae81c-bec9-4045-9219-98302ca090ce.jpg', true),
  ('10000000-0000-4000-8000-000000000010', 'Chia Seed Drinking Yoghurt', 'Yoghurt', 3500, 'Smooth drinking yoghurt enriched with chia seeds for a creamy and satisfying refreshment.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884080/oydams/products/be2b0b72-f074-403a-86fb-7e4f8ad0104a.jpg', true),
  ('10000000-0000-4000-8000-000000000011', 'Butterfly Birthday Cake', 'Cakes', 30000, 'A charming pink-and-gold custom birthday cake decorated with butterflies, ribbons and pearls.', 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884082/oydams/products/ab5ba714-1ea9-4812-b628-6e353bf4535d.jpg', true)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  description = excluded.description,
  image_url = excluded.image_url,
  active = excluded.active;
