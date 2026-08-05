<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Check, MessageCircle, ShoppingBag } from 'lucide-vue-next'
import { addToCart, loadProducts, products, cartOpen } from '../stores/shop'

const route = useRoute()
const product = computed(() => products.value.find(item => String(item.id) === String(route.params.id)))
onMounted(() => { if (!products.value.length) loadProducts() })
function add() { if (product.value) { addToCart(product.value); cartOpen.value = true } }
</script>

<template>
  <main class="product-page">
    <router-link to="/#shop" class="back-link"><ArrowLeft :size="17"/> Back to collection</router-link>
    <section v-if="product" class="product-detail"><div class="detail-image"><img :src="product.image_url" :alt="product.name"/><span>{{ product.category }}</span></div><div class="detail-copy"><span class="kicker">Made fresh by Oydams</span><h1>{{ product.name }}</h1><p class="detail-description">{{ product.description }}</p><strong class="detail-price">₦{{ Number(product.price).toLocaleString() }}</strong><ul><li><Check/> Freshly prepared</li><li><Check/> Custom requests welcome</li><li><Check/> Delivery confirmed on WhatsApp</li></ul><button class="button primary" @click="add"><ShoppingBag :size="18"/> Add to order</button><p class="detail-note"><MessageCircle :size="16"/> Final specifications and payment are confirmed directly on WhatsApp.</p></div></section>
    <section v-else class="product-missing"><h1>Finding this treat…</h1><p>If it is no longer available, browse the latest collection.</p><router-link to="/#shop" class="button primary">View all products</router-link></section>
  </main>
</template>
