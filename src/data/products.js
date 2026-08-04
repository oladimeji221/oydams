import birthdayCake from '../../images/cake.JPG?url'
import cakeParfait from '../../images/cake_parfait.JPG?url'
import foilCake from '../../images/foil_cake.JPG?url'
import yoghurtParfait from '../../images/greek_yoghurt_parfait.JPG?url'
import meatPie from '../../images/meatpie.JPG?url'
import vanillaYoghurt from '../../images/vanilla_youghurt.JPG?url'
import weddingCake from '../../images/wedding_cake2.JPG?url'
import cocktail from '../../images/oydam_cocktail.JPG?url'
import oydamPortrait from '../../images/ceo.JPG?url'
import oydamAtWork from '../../images/wedding_cake1.JPG?url'
import logo from '../../images/logo.png?url'
import tigernut from '../../images/3d4ae81c-bec9-4045-9219-98302ca090ce.JPG?url'
import chiaYoghurt from '../../images/be2b0b72-f074-403a-86fb-7e4f8ad0104a.JPG?url'
import butterflyCake from '../../images/ab5ba714-1ea9-4812-b628-6e353bf4535d.JPG?url'
import parfaitBatch from '../../images/c3e9127a-58b4-4bcc-9088-cb4a1de008cf.JPG?url'
import bakerAtWork from '../../images/e6f53765-b777-4893-878a-8fea585be095.JPG?url'

export const brandImages = { logo, weddingCake, oydamPortrait, oydamAtWork, parfaitBatch, bakerAtWork, butterflyCake, tigernut }

// These prices are starter values and can be changed from the admin dashboard.
export const starterProducts = [
  { id: 'birthday-cake', name: 'Celebration Cake', category: 'Cakes', price: 25000, description: 'A beautifully finished custom cake for birthdays and life’s sweetest celebrations.', image_url: birthdayCake },
  { id: 'wedding-cake', name: 'Signature Wedding Cake', category: 'Cakes', price: 85000, description: 'An elegant tiered centrepiece, designed especially for your wedding celebration.', image_url: weddingCake },
  { id: 'foil-cake', name: 'Rich Foil Cake', category: 'Cakes', price: 3500, description: 'Soft, rich cake baked in a handy foil pack, perfect for gifting or enjoying at home.', image_url: foilCake },
  { id: 'cake-parfait', name: 'Cake Parfait', category: 'Parfaits', price: 3000, description: 'Fluffy cake and smooth cream layered into one colourful, satisfying treat.', image_url: cakeParfait },
  { id: 'greek-yoghurt-parfait', name: 'Greek Yoghurt Parfait', category: 'Parfaits', price: 4500, description: 'Creamy Greek yoghurt layered with crunchy granola and delicious fruit.', image_url: yoghurtParfait },
  { id: 'vanilla-yoghurt', name: 'Sweetened Greek Yoghurt', category: 'Yoghurt', price: 3000, description: 'Fresh, creamy Greek yoghurt with a smooth vanilla taste, bottled and chilled.', image_url: vanillaYoghurt },
  { id: 'meat-pie', name: 'Oydam’s Meat Pie', category: 'Pastries', price: 1500, description: 'Golden, flaky pastry filled with a rich, savoury meat and vegetable filling.', image_url: meatPie },
  { id: 'cocktail', name: 'Oydam’s Fruit Cocktail', category: 'Drinks', price: 2000, description: 'A refreshing, colourful fruit cocktail served chilled for parties and everyday enjoyment.', image_url: cocktail },
  { id: 'tigernut', name: 'Fresh Tigernut Drink', category: 'Drinks', price: 2000, description: 'A naturally rich and refreshing tigernut drink blended fresh and served chilled.', image_url: tigernut },
  { id: 'chia-yoghurt', name: 'Chia Seed Drinking Yoghurt', category: 'Yoghurt', price: 3500, description: 'Smooth drinking yoghurt enriched with chia seeds for a creamy, satisfying refreshment.', image_url: chiaYoghurt },
  { id: 'butterfly-cake', name: 'Butterfly Birthday Cake', category: 'Cakes', price: 30000, description: 'A charming pink-and-gold custom birthday cake decorated with butterflies and pearls.', image_url: butterflyCake },
]
