<script setup>
import { ShoppingBag, Menu, X, Instagram, Facebook, Music2, MapPin, Phone, Clock3, ArrowUpRight } from 'lucide-vue-next'
import { ref } from 'vue'
import { cartCount, cartOpen, toast } from './stores/shop'
import CartDrawer from './components/CartDrawer.vue'
import { brandImages } from './data/products'

const menuOpen = ref(false)
const whatsappUrl = `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '2347067720332').replace(/\D/g, '')}`
</script>

<template>
  <header class="site-header">
    <router-link to="/" class="brand" aria-label="Oydam's home">
      <img :src="brandImages.logo" class="official-logo" alt="Oydam's Confectionery's Limited"/>
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
      <div class="footer-intro"><router-link to="/" class="brand footer-brand"><img :src="brandImages.logo" class="official-logo" alt="Oydam's Confectionery's Limited"/></router-link><p>Celebration cakes, pastries, yoghurt, parfaits and refreshing drinks, made with care in Lagos.</p><div class="social-links" aria-label="Oydam's social media"><a href="https://www.instagram.com/oydamslimited/" target="_blank" rel="noopener" aria-label="Instagram"><Instagram :size="18"/></a><a href="https://www.facebook.com/search/top?q=oydams%20confectionery" target="_blank" rel="noopener" aria-label="Facebook"><Facebook :size="18"/></a><a href="https://www.tiktok.com/search?q=oydams%20confectionery" target="_blank" rel="noopener" aria-label="TikTok"><Music2 :size="18"/></a></div></div>
      <div class="footer-column"><h3>Explore</h3><router-link to="/treats">Our products</router-link><a href="/#about">About Oydam’s</a><a href="/#gallery">Our gallery</a><router-link to="/login">Admin sign in</router-link></div>
      <div class="footer-column"><h3>Visit & contact</h3><p><MapPin/> Amule Bus Stop, Ayobo, Lagos</p><a :href="whatsappUrl" target="_blank"><Phone/> +234 706 772 0332</a><p><Clock3/> Mon–Sat · 8:00am–6:00pm</p></div>
      <div class="footer-order"><span>READY TO ORDER?</span><h3>Let’s make something delicious.</h3><a :href="whatsappUrl" target="_blank">Chat on WhatsApp <ArrowUpRight :size="18"/></a></div>
    </div>
    <div class="footer-bottom"><small>© {{ new Date().getFullYear() }} Oydam’s Confectionery’s Limited. RC 7821155.</small><small>Freshly made in Lagos, Nigeria.</small></div>
  </footer>
</template>
