<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Eye, EyeOff, LogOut, Pencil, Plus, Trash2, Upload, X } from 'lucide-vue-next'
import { hasSupabase, supabase } from '../lib/supabase'

const user = ref(null), busy = ref(false), message = ref(''), adminProducts = ref([]), editing = ref(null)
const credentials = reactive({ email: '', password: '' })
const form = reactive({ name: '', category: 'Cakes', price: '', description: '', image_url: '', active: true })
const showPassword = ref(false), currentPage = ref(1)
const pageSize = 6
const totalPages = computed(() => Math.max(1, Math.ceil(adminProducts.value.length / pageSize)))
const paginatedProducts = computed(() => adminProducts.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))
watch(totalPages, value => { if (currentPage.value > value) currentPage.value = value })

async function refresh() {
  const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  if (error) message.value = error.message
  adminProducts.value = data || []
}
async function login() { busy.value = true; const { data, error } = await supabase.auth.signInWithPassword(credentials); user.value = data.user; message.value = error?.message || ''; if (data.user) refresh(); busy.value = false }
async function logout() { await supabase.auth.signOut(); user.value = null }
function resetForm() { Object.assign(form, { name: '', category: 'Cakes', price: '', description: '', image_url: '', active: true }); editing.value = null }
function edit(product) { editing.value = product.id; Object.assign(form, { name: product.name, category: product.category, price: product.price, description: product.description, image_url: product.image_url, active: product.active }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
async function upload(event) {
  const file = event.target.files[0]; if (!file) return
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxvpoebb0'
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
  busy.value = true; const body = new FormData(); body.append('file', file); body.append('upload_preset', preset)
  const result = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body }).then(r => r.json())
  form.image_url = result.secure_url || ''; message.value = result.error?.message || ''; busy.value = false
}
async function save() {
  busy.value = true
  const payload = { name: form.name, category: form.category, price: Number(form.price), description: form.description, image_url: form.image_url, active: form.active }
  if (!editing.value) payload.sort_order = (adminProducts.value.at(-1)?.sort_order ?? 0) + 1
  const query = editing.value ? supabase.from('products').update(payload).eq('id', editing.value) : supabase.from('products').insert(payload)
  const { error } = await query; message.value = error?.message || 'Product saved.'
  if (!error) { const wasEditing = Boolean(editing.value); resetForm(); await refresh(); if (!wasEditing) currentPage.value = totalPages.value }
  busy.value = false
}
async function remove(id) { if (!confirm('Delete this product?')) return; const { error } = await supabase.from('products').delete().eq('id', id); if (error) message.value = error.message; else refresh() }
async function moveProduct(product, direction) {
  const index = adminProducts.value.findIndex(item => item.id === product.id)
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= adminProducts.value.length) return
  const target = adminProducts.value[targetIndex]
  const firstOrder = product.sort_order, secondOrder = target.sort_order
  ;[adminProducts.value[index], adminProducts.value[targetIndex]] = [target, product]
  product.sort_order = secondOrder; target.sort_order = firstOrder
  const [first, second] = await Promise.all([
    supabase.from('products').update({ sort_order: product.sort_order }).eq('id', product.id),
    supabase.from('products').update({ sort_order: target.sort_order }).eq('id', target.id),
  ])
  if (first.error || second.error) { message.value = first.error?.message || second.error?.message; await refresh() }
  else message.value = 'Storefront order updated.'
}
onMounted(async () => { if (!hasSupabase) return; const { data } = await supabase.auth.getUser(); user.value = data.user; if (user.value) refresh() })
</script>

<template>
  <main class="admin-page">
    <div v-if="!hasSupabase" class="setup-card"><span class="eyebrow">Setup needed</span><h1>Connect Supabase</h1><p>Add your Supabase configuration before using the dashboard.</p></div>
    <form v-else-if="!user" class="login-card" @submit.prevent="login"><span class="eyebrow">Oydams studio</span><h1>Welcome back</h1><p>Sign in to manage products and prices.</p><label>Email<input v-model="credentials.email" type="email" required/></label><label>Password<div class="dashboard-password"><input v-model="credentials.password" :type="showPassword ? 'text' : 'password'" required/><button type="button" @click="showPassword = !showPassword"><EyeOff v-if="showPassword"/><Eye v-else/></button></div></label><p v-if="message" class="form-error">{{ message }}</p><button class="button primary" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button></form>
    <div v-else class="admin-shell">
      <div class="admin-title"><div><span class="eyebrow">Oydams studio</span><h1>Product dashboard</h1></div><button class="text-link" @click="logout"><LogOut :size="17"/> Sign out</button></div>
      <div class="admin-grid">
        <form class="product-form" @submit.prevent="save"><div class="form-title"><h2>{{ editing ? 'Edit product' : 'Add a product' }}</h2><button v-if="editing" type="button" class="icon-button" @click="resetForm"><X :size="18"/></button></div><label>Product name<input v-model="form.name" required/></label><div class="field-row"><label>Category<select v-model="form.category"><option>Cakes</option><option>Pastries</option><option>Parfaits</option><option>Yoghurt</option><option>Drinks</option></select></label><label>Price (₦)<input v-model="form.price" type="number" min="0" required/></label></div><label>Description<textarea v-model="form.description" required></textarea></label><label class="upload-box"><Upload/><span>{{ busy ? 'Uploading…' : 'Upload product image' }}</span><small>JPG, PNG or WEBP</small><input type="file" accept="image/*" @change="upload"/></label><img v-if="form.image_url" :src="form.image_url" class="upload-preview"/><label class="switch-label"><input v-model="form.active" type="checkbox"/> Show this product in the shop</label><p v-if="message" class="status-message">{{ message }}</p><button class="button primary" :disabled="busy || !form.image_url"><Plus :size="18"/> {{ editing ? 'Save changes' : 'Add product' }}</button></form>
        <section class="product-list"><div class="list-heading"><div><h2>Your products</h2><small>Use the arrows to control storefront order</small></div><span>{{ adminProducts.length }} items</span></div><article v-for="product in paginatedProducts" :key="product.id"><img :src="product.image_url" :alt="product.name"/><div><h3>{{ product.name }}</h3><p>{{ product.category }} · ₦{{ Number(product.price).toLocaleString() }}</p></div><div class="order-controls"><button class="icon-button" @click="moveProduct(product, -1)" :disabled="adminProducts[0]?.id === product.id" aria-label="Move product up"><ArrowUp :size="15"/></button><button class="icon-button" @click="moveProduct(product, 1)" :disabled="adminProducts.at(-1)?.id === product.id" aria-label="Move product down"><ArrowDown :size="15"/></button></div><span :class="['status-pill', { hidden: !product.active }]">{{ product.active ? 'Live' : 'Hidden' }}</span><button class="icon-button" @click="edit(product)" aria-label="Edit product"><Pencil :size="17"/></button><button class="icon-button danger" @click="remove(product.id)" aria-label="Delete product"><Trash2 :size="17"/></button></article><div v-if="totalPages > 1" class="pagination"><button @click="currentPage--" :disabled="currentPage === 1"><ArrowLeft :size="16"/> Previous</button><span>Page {{ currentPage }} of {{ totalPages }}</span><button @click="currentPage++" :disabled="currentPage === totalPages">Next <ArrowRight :size="16"/></button></div></section>
      </div>
    </div>
  </main>
</template>
