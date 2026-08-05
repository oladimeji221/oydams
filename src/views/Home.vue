<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MessageCircle, Sparkles, Star, X } from 'lucide-vue-next'
import { addToCart, products, productsError, loadingProducts, loadProducts } from '../stores/shop'
import { brandImages } from '../data/products'

const activeCategory = ref('All')
const categories = ['All', 'Cakes', 'Pastries', 'Parfaits', 'Yoghurt', 'Drinks']
const filtered = () => (activeCategory.value === 'All' ? products.value : products.value.filter(p => p.category === activeCategory.value)).slice(0, 4)
const whatsappUrl = `https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || '2347067720332').replace(/\D/g, '')}`
const selectedImage = ref(-1)
const galleryImages = [
  { src: brandImages.bakerAtWork, alt: 'Oydams baker preparing a cake in her Lagos kitchen', caption: 'Crafted by hand', position: 'center' },
  { src: brandImages.parfaitBatch, alt: 'Fresh fruit and Greek yoghurt parfaits', caption: 'Freshly layered parfaits', position: 'center' },
  { src: brandImages.butterflyCake, alt: 'Pink and gold butterfly birthday cake', caption: 'Custom celebration cakes', position: 'center' },
  { src: brandImages.weddingCake, alt: 'Tall white wedding cake at a celebration', caption: 'Wedding centrepieces', position: 'center' },
  { src: brandImages.weddingCakeClassic, alt: 'Classic white tiered wedding cake', caption: 'Elegant details', position: 'center' },
  { src: brandImages.tigernut, alt: 'Fresh bottles of Oydams tigernut drink', caption: 'Freshly bottled drinks', position: 'center' },
  { src: brandImages.cocktailSingle, alt: 'Oydams chilled fruit cocktail', caption: 'Colourful refreshments', position: 'center' },
  { src: brandImages.yoghurtLineup, alt: 'Bottles of chia seed drinking yoghurt', caption: 'Creamy drinking yoghurt', position: 'center' },
]
function openGallery(index) { selectedImage.value = index; document.body.style.overflow = 'hidden' }
function closeGallery() { selectedImage.value = -1; document.body.style.overflow = '' }
function moveGallery(direction) { selectedImage.value = (selectedImage.value + direction + galleryImages.length) % galleryImages.length }
function galleryKey(event) { if (selectedImage.value < 0) return; if (event.key === 'Escape') closeGallery(); if (event.key === 'ArrowRight') moveGallery(1); if (event.key === 'ArrowLeft') moveGallery(-1) }
onMounted(() => { loadProducts(); window.addEventListener('keydown', galleryKey) })
onBeforeUnmount(() => { window.removeEventListener('keydown', galleryKey); document.body.style.overflow = '' })
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><Sparkles :size="14"/> Freshly made, just for you</span>
        <h1>Life is sweeter<br/>with a little <em>treat.</em></h1>
        <p>Beautiful cakes, flaky pastries and creamy yoghurt, thoughtfully made to bring a little joy to every moment.</p>
        <div class="hero-buttons"><a href="#shop" class="button primary">Shop our treats <ArrowRight :size="18"/></a><a href="#about" class="text-link">Meet Oydams <span>↓</span></a></div>
        <div class="social-proof"><div class="avatars"><span>O</span><span>Y</span><span>D</span></div><div><div class="stars"><Star v-for="n in 5" :key="n" :size="13" fill="currentColor"/></div><small>Loved by our sweet community</small></div></div>
      </div>
      <div class="hero-visual">
        <div class="arch-image"><img :src="brandImages.weddingCake" alt="Elegant wedding cake made by Oydams"/></div>
        <div class="floating-note"><Heart fill="currentColor" :size="18"/><span><strong>Baked with love</strong><small>in every bite</small></span></div>
        <div class="doodle">sweet<br/>moments <span>♡</span></div>
      </div>
    </section>

    <section class="promise-strip" aria-label="Our promises"><div class="promise-track"><div class="promise-group"><span>Handcrafted with care</span><i>✦</i><span>Fresh quality ingredients</span><i>✦</i><span>Perfect for every occasion</span><i>✦</i></div><div class="promise-group" aria-hidden="true"><span>Handcrafted with care</span><i>✦</i><span>Fresh quality ingredients</span><i>✦</i><span>Perfect for every occasion</span><i>✦</i></div></div></section>

    <section id="shop" class="shop-section section-wrap">
      <div class="section-heading"><div><span class="eyebrow">A taste of happiness</span><h2>Our sweet collection</h2></div><p>Pick a favourite, or a few. Each treat is made fresh and can be personalised for your moment.</p></div>
      <div class="category-tabs"><button v-for="category in categories" :key="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ category }}</button></div>
      <div class="product-grid">
        <article v-for="product in filtered()" :key="product.id" class="product-card">
          <router-link :to="`/products/${product.id}`" class="product-image"><img :src="product.image_url" :alt="product.name" loading="lazy"/><span>{{ product.available ? product.category : 'Unavailable' }}</span></router-link>
          <div class="product-info"><router-link :to="`/products/${product.id}`"><h3>{{ product.name }}</h3></router-link><p>{{ product.description }}</p><div><strong>₦{{ Number(product.price).toLocaleString() }}</strong><button @click="addToCart(product)" :disabled="!product.available">{{ product.available ? 'Add to bag' : 'Unavailable' }} <span v-if="product.available">+</span></button></div></div>
        </article>
      </div>
      <div v-if="loadingProducts" class="catalog-state"><span class="loader"></span><p>Preparing the collection…</p></div>
      <div v-else-if="productsError || !products.length" class="catalog-state"><h3>Fresh treats are being added</h3><p>{{ productsError || 'The online catalogue will be available shortly.' }}</p><a :href="whatsappUrl" target="_blank" class="button primary">Order directly on WhatsApp</a></div>
      <div v-if="products.length" class="view-all-row"><router-link to="/treats" class="button primary">Explore all treats <ArrowRight :size="17"/></router-link><span>{{ products.length }} delicious options available</span></div>
    </section>

    <section id="about" class="about-section">
      <div class="about-collage"><div class="about-main"><img :src="brandImages.oydamPortrait" alt="The baker behind Oydams Confectionery"/></div><div class="about-small"><img :src="brandImages.oydamAtWork" alt="The Oydams baker beside one of her wedding cakes"/></div><span class="roundel">MADE WITH LOVE • OYDAMS •</span></div>
      <div class="about-copy"><span class="eyebrow">Meet the baker</span><h2>A little sweetness,<br/><em>a lot of heart.</em></h2><p>Oydams Confectionery creates celebration cakes, wedding cakes, foil cakes, meat pies, creamy yoghurt, parfaits and refreshing cocktails from Ayobo, Lagos. Every order is prepared with care, creativity and the warmth of something genuinely homemade.</p><blockquote>“I don’t just bake treats. I help make your moments feel extra special.”<cite>Oydams</cite></blockquote><a href="#contact" class="text-link">Let’s create something sweet <ArrowRight :size="17"/></a></div>
    </section>

    <section id="gallery" class="gallery-section section-wrap">
      <div class="section-heading"><div><span class="eyebrow">Made at Oydams</span><h2>From our kitchen</h2></div><p>A glimpse into the care, colour and creativity behind every Oydams order.</p></div>
      <div class="gallery-grid expanded-gallery"><button v-for="(photo, index) in galleryImages" :key="photo.src" class="gallery-item" @click="openGallery(index)" :aria-label="`Open ${photo.caption}`"><img :src="photo.src" :alt="photo.alt" :style="{ objectPosition: photo.position }" loading="lazy"/><span class="gallery-expand">View</span><span class="gallery-caption">{{ photo.caption }}</span></button></div>
    </section>

    <teleport to="body"><transition name="fade"><div v-if="selectedImage >= 0" class="lightbox" role="dialog" aria-modal="true" :aria-label="galleryImages[selectedImage].caption" @click.self="closeGallery"><button class="lightbox-close" @click="closeGallery" aria-label="Close gallery"><X/></button><button class="lightbox-nav previous" @click="moveGallery(-1)" aria-label="Previous image"><ChevronLeft/></button><figure><img :src="galleryImages[selectedImage].src" :alt="galleryImages[selectedImage].alt"/><figcaption><span>{{ String(selectedImage + 1).padStart(2, '0') }} / {{ String(galleryImages.length).padStart(2, '0') }}</span>{{ galleryImages[selectedImage].caption }}</figcaption></figure><button class="lightbox-nav next" @click="moveGallery(1)" aria-label="Next image"><ChevronRight/></button></div></transition></teleport>

    <section class="how-section section-wrap"><span class="eyebrow">Simple & sweet</span><h2>How to order</h2><div class="steps"><article><b>01</b><h3>Choose your treats</h3><p>Browse the collection and add your favourites to your bag.</p></article><article><b>02</b><h3>Share your details</h3><p>Add your name, phone number, location and any special requests.</p></article><article><b>03</b><h3>Confirm on WhatsApp</h3><p>Send your order, confirm delivery and complete payment directly with Oydams.</p></article></div></section>

    <section class="cta-section"><div><span class="eyebrow">Something special in mind?</span><h2>Let’s make your sweet<br/>idea come to life.</h2><p>Custom cakes, event boxes and everything delicious in between.</p><a :href="whatsappUrl" target="_blank" class="button light"><MessageCircle :size="19"/> Chat with Oydams</a></div></section>
  </main>
</template>
