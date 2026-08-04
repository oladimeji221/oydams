<script setup>
import { X, Minus, Plus, ShoppingBag } from 'lucide-vue-next'
import { ref } from 'vue'
import { cart, cartOpen, cartTotal, changeQuantity, checkout, customer } from '../stores/shop'

const error = ref('')
function completeOrder() {
  error.value = checkout() ? '' : 'Please add an item and fill in your name, phone and delivery location.'
}
</script>

<template>
  <transition name="fade"><div v-if="cartOpen" class="drawer-backdrop" @click="cartOpen = false"></div></transition>
  <transition name="drawer">
    <aside v-if="cartOpen" class="cart-drawer">
      <header><div><span class="eyebrow">Your order</span><h2>Sweet selections</h2></div><button class="icon-button" @click="cartOpen = false"><X /></button></header>
      <div v-if="!cart.length" class="empty-cart"><ShoppingBag :size="42"/><h3>Your bag is waiting</h3><p>Add something delicious from our collection.</p><button class="button primary" @click="cartOpen = false">Explore treats</button></div>
      <div v-else class="cart-content">
        <div class="cart-items">
          <article v-for="item in cart" :key="item.id" class="cart-item">
            <img :src="item.image_url" :alt="item.name"/><div><h3>{{ item.name }}</h3><p>₦{{ item.price.toLocaleString() }}</p><div class="quantity"><button @click="changeQuantity(item.id, -1)"><Minus :size="14"/></button><span>{{ item.quantity }}</span><button @click="changeQuantity(item.id, 1)"><Plus :size="14"/></button></div></div>
          </article>
        </div>
        <div class="customer-form">
          <h3>Delivery details</h3>
          <div class="field-row"><label>Name<input v-model="customer.name" placeholder="Your full name"/></label><label>Phone<input v-model="customer.phone" type="tel" placeholder="080..."/></label></div>
          <label>Delivery location<input v-model="customer.location" placeholder="Area, city or full address"/></label>
          <label>Order note <span>(optional)</span><textarea v-model="customer.note" placeholder="Flavour, inscription, preferred date..."></textarea></label>
          <p v-if="error" class="form-error">{{ error }}</p>
        </div>
        <div class="cart-summary"><div><span>Total</span><strong>₦{{ cartTotal.toLocaleString() }}</strong></div><small>Delivery fee will be confirmed on WhatsApp.</small><button class="button whatsapp" @click="completeOrder">Complete order on WhatsApp</button></div>
      </div>
    </aside>
  </transition>
</template>
