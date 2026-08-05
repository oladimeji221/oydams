import { computed, reactive, ref, watch } from 'vue'
import { hasSupabase, supabase } from '../lib/supabase'

export const products = ref([])
export const cart = ref(JSON.parse(localStorage.getItem('oydams-cart') || '[]'))
export const cartOpen = ref(false)
export const loadingProducts = ref(false)
export const productsError = ref('')
export const toast = ref('')

watch(cart, value => localStorage.setItem('oydams-cart', JSON.stringify(value)), { deep: true })

export const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
export const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

export async function loadProducts() {
  if (!hasSupabase) { productsError.value = 'The product catalogue is being configured. Please check back shortly.'; return }
  loadingProducts.value = true
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  if (error) productsError.value = 'We could not load the catalogue right now. You can still order directly on WhatsApp.'
  else { products.value = data || []; productsError.value = '' }
  loadingProducts.value = false
}

export function addToCart(product) {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) existing.quantity += 1
  else cart.value.push({ ...product, quantity: 1 })
  toast.value = `${product.name} added to your box`
  setTimeout(() => (toast.value = ''), 2200)
}

export function changeQuantity(id, amount) {
  const item = cart.value.find(product => product.id === id)
  if (!item) return
  item.quantity += amount
  if (item.quantity < 1) cart.value = cart.value.filter(product => product.id !== id)
}

export const customer = reactive({ name: '', phone: '', location: '', note: '' })

export function checkout() {
  if (!customer.name || !customer.phone || !customer.location || !cart.value.length) return false
  const lines = cart.value.flatMap(item => [
    `• ${item.name} × ${item.quantity}: ₦${(item.price * item.quantity).toLocaleString()}`,
    `  Product: ${window.location.origin}/products/${item.id}`,
  ])
  const message = [
    `Hello Oydams 👋🏽 I would like to place an order:`, '', ...lines, '',
    `*Total: ₦${cartTotal.value.toLocaleString()}*`, '',
    `Name: ${customer.name}`, `Phone: ${customer.phone}`, `Delivery location: ${customer.location}`,
    customer.note ? `Note: ${customer.note}` : '', '', 'Please confirm availability and payment details. Thank you!'
  ].filter(Boolean).join('\n')
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '2347067720332'
  window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  return true
}
