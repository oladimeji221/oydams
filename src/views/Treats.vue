<script setup>
import { computed, onMounted, ref } from 'vue'
import { Search, ShoppingBag, SlidersHorizontal } from 'lucide-vue-next'
import { addToCart, loadProducts, loadingProducts, products, productsError } from '../stores/shop'

const activeCategory = ref('All')
const search = ref('')
const categories = [
  { label: 'All', value: 'All' },
  { label: 'Parfaits', value: 'Parfaits' },
  { label: 'Yoghurt', value: 'Yoghurt' },
  { label: 'Tigernut & Drinks', value: 'Drinks' },
  { label: 'Cakes', value: 'Cakes' },
  { label: 'Pastries', value: 'Pastries' },
]
const visibleProducts = computed(() => products.value.filter(product => {
  const inCategory = activeCategory.value === 'All' || product.category === activeCategory.value
  const term = search.value.trim().toLowerCase()
  const matchesSearch = !term || product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
  return inCategory && matchesSearch
}))

onMounted(() => { if (!products.value.length) loadProducts() })
</script>

<template>
  <main class="treats-page">
    <section class="catalog-hero"><span class="kicker">The full Oydams collection</span><h1>Find your next<br/><em>favourite treat.</em></h1><p>Fresh cakes, pastries, yoghurt, parfaits and drinks, made in Lagos and prepared with care.</p></section>
    <section class="catalog-shell">
      <div class="catalog-toolbar"><div class="catalog-title"><SlidersHorizontal :size="18"/><span>Browse collection</span></div><label class="catalog-search"><Search :size="18"/><input v-model="search" placeholder="Search cakes, yoghurt, drinks..." aria-label="Search products"/></label></div>
      <div class="category-tabs catalog-tabs"><button v-for="category in categories" :key="category.value" :class="{ active: activeCategory === category.value }" @click="activeCategory = category.value">{{ category.label }}</button></div>
      <div class="catalog-count"><span>{{ visibleProducts.length }} {{ visibleProducts.length === 1 ? 'product' : 'products' }}</span><small>Prices can be confirmed during WhatsApp checkout</small></div>
      <div v-if="loadingProducts" class="catalog-state"><span class="loader"></span><p>Loading the collection...</p></div>
      <div v-else-if="productsError" class="catalog-state"><h3>We could not load the collection</h3><p>{{ productsError }}</p></div>
      <div v-else-if="!visibleProducts.length" class="catalog-state"><h3>No treats found</h3><p>Try a different category or search phrase.</p></div>
      <div v-else class="product-grid full-catalog-grid">
        <article v-for="product in visibleProducts" :key="product.id" class="product-card">
          <router-link :to="`/products/${product.id}`" class="product-image"><img :src="product.image_url" :alt="product.name" loading="lazy"/><span>{{ product.available ? product.category : 'Unavailable' }}</span></router-link>
          <div class="product-info"><router-link :to="`/products/${product.id}`"><h3>{{ product.name }}</h3></router-link><p>{{ product.description }}</p><div><strong>₦{{ Number(product.price).toLocaleString() }}</strong><button @click="addToCart(product)" :disabled="!product.available"><ShoppingBag v-if="product.available" :size="15"/> {{ product.available ? 'Add' : 'Unavailable' }}</button></div></div>
        </article>
      </div>
    </section>
  </main>
</template>
