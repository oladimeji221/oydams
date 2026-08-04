<script setup>
import { onMounted, reactive, ref } from 'vue'
import { LogOut, Pencil, Plus, Trash2, Upload, X } from 'lucide-vue-next'
import { hasSupabase, supabase } from '../lib/supabase'

const user = ref(null), busy = ref(false), message = ref(''), adminProducts = ref([]), editing = ref(null)
const credentials = reactive({ email: '', password: '' })
const form = reactive({ name: '', category: 'Cakes', price: '', description: '', image_url: '', active: true })

async function refresh() { const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }); adminProducts.value = data || [] }
async function login() { busy.value = true; const { data, error } = await supabase.auth.signInWithPassword(credentials); user.value = data.user; message.value = error?.message || ''; if (data.user) refresh(); busy.value = false }
async function logout() { await supabase.auth.signOut(); user.value = null }
function resetForm() { Object.assign(form, { name: '', category: 'Cakes', price: '', description: '', image_url: '', active: true }); editing.value = null }
function edit(product) { editing.value = product.id; Object.assign(form, product); window.scrollTo({ top: 0, behavior: 'smooth' }) }
async function upload(event) {
  const file = event.target.files[0]; if (!file) return
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxvpoebb0'
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
  if (!cloud || !preset) return message.value = 'Add your Cloudinary cloud name and unsigned upload preset to .env first.'
  busy.value = true; const body = new FormData(); body.append('file', file); body.append('upload_preset', preset)
  const result = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body }).then(r => r.json())
  form.image_url = result.secure_url || ''; message.value = result.error?.message || ''; busy.value = false
}
async function save() { busy.value = true; const payload = { ...form, price: Number(form.price) }; const query = editing.value ? supabase.from('products').update(payload).eq('id', editing.value) : supabase.from('products').insert(payload); const { error } = await query; message.value = error?.message || 'Product saved.'; if (!error) { resetForm(); refresh() }; busy.value = false }
async function remove(id) { if (!confirm('Delete this product?')) return; await supabase.from('products').delete().eq('id', id); refresh() }
onMounted(async () => { if (!hasSupabase) return; const { data } = await supabase.auth.getUser(); user.value = data.user; if (user.value) refresh() })
</script>

<template>
  <main class="admin-page">
    <div v-if="!hasSupabase" class="setup-card"><span class="eyebrow">Setup needed</span><h1>Connect Supabase</h1><p>Copy <code>.env.example</code> to <code>.env</code>, add your Supabase keys, then run the SQL included in <code>supabase/schema.sql</code>.</p></div>
    <form v-else-if="!user" class="login-card" @submit.prevent="login"><span class="eyebrow">Oydam's studio</span><h1>Welcome back</h1><p>Sign in to manage products and prices.</p><label>Email<input v-model="credentials.email" type="email" required/></label><label>Password<input v-model="credentials.password" type="password" required/></label><p v-if="message" class="form-error">{{ message }}</p><button class="button primary" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button></form>
    <div v-else class="admin-shell">
      <div class="admin-title"><div><span class="eyebrow">Oydam's studio</span><h1>Product dashboard</h1></div><button class="text-link" @click="logout"><LogOut :size="17"/> Sign out</button></div>
      <div class="admin-grid">
        <form class="product-form" @submit.prevent="save"><div class="form-title"><h2>{{ editing ? 'Edit product' : 'Add a product' }}</h2><button v-if="editing" type="button" class="icon-button" @click="resetForm"><X :size="18"/></button></div><label>Product name<input v-model="form.name" required/></label><div class="field-row"><label>Category<select v-model="form.category"><option>Cakes</option><option>Pastries</option><option>Parfaits</option><option>Yoghurt</option><option>Drinks</option></select></label><label>Price (₦)<input v-model="form.price" type="number" min="0" required/></label></div><label>Description<textarea v-model="form.description" required></textarea></label><label class="upload-box"><Upload/><span>{{ busy ? 'Uploading…' : 'Upload product image' }}</span><small>JPG, PNG or WEBP</small><input type="file" accept="image/*" @change="upload"/></label><img v-if="form.image_url" :src="form.image_url" class="upload-preview"/><label class="switch-label"><input v-model="form.active" type="checkbox"/> Show this product in the shop</label><p v-if="message" class="status-message">{{ message }}</p><button class="button primary" :disabled="busy || !form.image_url"><Plus :size="18"/> {{ editing ? 'Save changes' : 'Add product' }}</button></form>
        <section class="product-list"><div class="list-heading"><h2>Your products</h2><span>{{ adminProducts.length }} items</span></div><article v-for="product in adminProducts" :key="product.id"><img :src="product.image_url"/><div><h3>{{ product.name }}</h3><p>{{ product.category }} · ₦{{ Number(product.price).toLocaleString() }}</p></div><span :class="['status-pill', { hidden: !product.active }]">{{ product.active ? 'Live' : 'Hidden' }}</span><button class="icon-button" @click="edit(product)"><Pencil :size="17"/></button><button class="icon-button danger" @click="remove(product.id)"><Trash2 :size="17"/></button></article></section>
      </div>
    </div>
  </main>
</template>
