const defaultImage = 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884044/oydams/products/cake.jpg'
const defaultDescription = 'Order freshly made cakes, pastries, Greek yoghurt, parfaits and drinks from Oydams Confectionery Limited at 10 Yamco Bus Stop, Ayobo, Lagos.'

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/)
    if (match) element.setAttribute(match[1], match[2])
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export function updateSeo({ title, description = defaultDescription, image = defaultImage, path = '/', product = null }) {
  const fullTitle = title ? `${title} | Oydams Confectionery` : 'Oydams Confectionery | Cakes, Pastries & Yoghurt in Lagos'
  const canonical = `${window.location.origin}${path}`
  document.title = fullTitle
  setMeta('meta[name="description"]', 'content', description)
  setMeta('meta[property="og:title"]', 'content', fullTitle)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:image"]', 'content', image)
  setMeta('meta[property="og:url"]', 'content', canonical)
  setMeta('meta[name="twitter:title"]', 'content', fullTitle)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]', 'content', image)
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
  link.href = canonical
  const oldProductSchema = document.getElementById('product-schema')
  if (oldProductSchema) oldProductSchema.remove()
  if (product) {
    const schema = document.createElement('script')
    schema.id = 'product-schema'
    schema.type = 'application/ld+json'
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: product.name,
      description: product.description, image: [product.image_url], sku: String(product.id),
      brand: { '@type': 'Brand', name: 'Oydams Confectionery' },
      offers: { '@type': 'Offer', url: canonical, priceCurrency: 'NGN', price: Number(product.price), availability: product.available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
    })
    document.head.appendChild(schema)
  }
}
