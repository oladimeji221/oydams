<script setup>
import { ShoppingBag, Menu, X, Instagram, Facebook, Music2, MapPin, MessageCircle, Clock3, ArrowUpRight } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { cartCount, cartOpen, toast } from './stores/shop'
import CartDrawer from './components/CartDrawer.vue'
import { brandImages } from './data/products'
import { products } from './stores/shop'
import { updateSeo } from './lib/seo'

const menuOpen = ref(false)
const route = useRoute()
const whatsappUrl = `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '2347067720332').replace(/\D/g, '')}`

watchEffect(() => {
  if (route.name === 'product' || route.path.startsWith('/products/')) {
    const product = products.value.find(item => String(item.id) === String(route.params.id))
    if (product) updateSeo({ title: product.name, description: product.description, image: product.image_url, path: route.path, product })
    return
  }
  const pages = {
    '/': {},
    '/treats': { title: 'All Treats', description: 'Browse celebration cakes, meat pies, parfaits, Greek yoghurt and refreshing drinks freshly made by Oydams in Lagos.' },
    '/login': { title: 'Admin Sign In', description: 'Secure owner access for Oydams Confectionery.' },
    '/register': { title: 'Owner Registration', description: 'Create the owner account for Oydams Confectionery.' },
    '/admin': { title: 'Product Dashboard', description: 'Manage the Oydams product catalogue.' },
  }
  updateSeo({ ...(pages[route.path] || {}), path: route.path })
})
</script>

<template>
  <header class="site-header">
    <router-link to="/" class="brand" aria-label="Oydams home">
      <img :src="brandImages.logo" class="official-logo" alt="Oydams Confectionery Limited"/>
    </router-link>
    <nav :class="{ open: menuOpen }">
      <router-link to="/treats" @click="menuOpen = false">Our treats</router-link>
      <a href="/#about" @click="menuOpen = false">Our story</a>
      <a href="/#gallery" @click="menuOpen = false">Gallery</a>
      <a href="/#contact" @click="menuOpen = false">Contact</a>
    </nav>
    <div class="header-actions">
      <button class="icon-button menu-button" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Close menu' : 'Open menu'">
        <X v-if="menuOpen" :size="22"/><Menu v-else :size="22"/>
      </button>
      <button class="bag-button" @click="cartOpen = true" aria-label="Open shopping bag">
        <ShoppingBag :size="20"/><span>Bag</span><b>{{ cartCount }}</b>
      </button>
    </div>
  </header>
  <router-view />
  <CartDrawer />
  <transition name="toast"><div v-if="toast" class="toast">{{ toast }}</div></transition>
  <footer id="contact">
    <div class="footer-main">
      <div class="footer-intro"><router-link to="/" class="brand footer-brand"><img :src="brandImages.logo" class="official-logo" alt="Oydams Confectionery Limited"/></router-link><p>Celebration cakes, pastries, yoghurt, parfaits and refreshing drinks, made with care in Lagos.</p><div class="social-links" aria-label="Oydams social media"><a href="https://www.instagram.com/oydamslimited/" target="_blank" rel="noopener" aria-label="Instagram"><Instagram :size="18"/></a><a href="https://www.facebook.com/search/top?q=oydams%20confectionery" target="_blank" rel="noopener" aria-label="Facebook"><Facebook :size="18"/></a><a href="https://www.tiktok.com/@oydams.confection?_r=1&_t=ZS-98cuqwoZMzl" target="_blank" rel="noopener" aria-label="Oydams on TikTok"><Music2 :size="18"/></a></div></div>
      <div class="footer-column"><h3>Explore</h3><router-link to="/treats">Our products</router-link><a href="/#about">About Oydams</a><a href="/#gallery">Our gallery</a><router-link to="/login">Admin sign in</router-link></div>
      <div class="footer-column"><h3>Visit & contact</h3><p><MapPin/> 10 Yamco Bus Stop, Ayobo, Lagos</p><a :href="whatsappUrl" target="_blank" aria-label="Chat with Oydams on WhatsApp"><MessageCircle/> +234 706 772 0332</a><p><Clock3/> Monday to Sunday · 8:00am–6:00pm</p></div>
      <div class="footer-order"><span>READY TO ORDER?</span><h3>Let’s make something delicious.</h3><a :href="whatsappUrl" target="_blank">Chat on WhatsApp <ArrowUpRight :size="18"/></a></div>
    </div>
    <div class="footer-bottom"><small>© {{ new Date().getFullYear() }} Oydams Confectionery Limited. RC 7821155.</small><small>Freshly made in Lagos, Nigeria.</small></div>
  </footer>
</template>
