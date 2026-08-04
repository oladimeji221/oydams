const defaultImage = 'https://res.cloudinary.com/dxvpoebb0/image/upload/v1785884044/oydams/products/cake.jpg'
const defaultDescription = 'Order freshly made cakes, pastries, Greek yoghurt, parfaits and drinks from Oydam’s Confectionery’s Limited in Ayobo, Lagos.'

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

export function updateSeo({ title, description = defaultDescription, image = defaultImage, path = '/' }) {
  const fullTitle = title ? `${title} | Oydam’s Confectionery` : 'Oydam’s Confectionery | Cakes, Pastries & Yoghurt in Lagos'
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
}
