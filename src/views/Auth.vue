<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-vue-next'
import { brandImages } from '../data/products'
import { hasSupabase, supabase } from '../lib/supabase'

const props = defineProps({ mode: { type: String, default: 'login' } })
const router = useRouter()
const form = reactive({ name: '', email: '', password: '', confirm: '' })
const busy = ref(false), error = ref(''), success = ref('')
const showPassword = ref(false), showConfirm = ref(false)
const registering = computed(() => props.mode === 'register')

async function submit() {
  error.value = ''; success.value = ''
  if (!hasSupabase) return error.value = 'Supabase has not been configured.'
  if (registering.value && form.password !== form.confirm) return error.value = 'Passwords do not match.'
  busy.value = true
  if (registering.value) {
    const { data, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name } } })
    error.value = authError?.message || ''
    if (!authError) {
      if (data.session) router.push('/admin')
      else success.value = 'Account created. Check your email to confirm your account, then sign in.'
    }
  } else {
    const { error: authError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    error.value = authError?.message || ''
    if (!authError) {
      const { data: sessionData } = await supabase.auth.getSession()
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', sessionData.session.user.id).single()
      if (profile?.role === 'admin') router.push('/admin')
      else { await supabase.auth.signOut(); error.value = 'This account does not have administrator access.' }
    }
  }
  busy.value = false
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-visual">
      <img :src="brandImages.oydamAtWork" alt="Oydams baker creating a wedding cake"/>
      <div><span>OYDAMS STUDIO</span><h1>Beautiful products.<br/>One simple dashboard.</h1><p>Manage the collection, images and pricing from one secure place.</p></div>
    </section>
    <section class="auth-panel">
      <router-link to="/" class="auth-logo"><img :src="brandImages.logo" alt="Oydams logo"/></router-link>
      <form @submit.prevent="submit">
        <span class="kicker">{{ registering ? 'Owner setup' : 'Private access' }}</span>
        <h2>{{ registering ? 'Create admin account' : 'Welcome back' }}</h2>
        <p>{{ registering ? 'Create the owner account for the Oydams dashboard.' : 'Sign in to manage the Oydams product catalogue.' }}</p>
        <label v-if="registering">Full name<div class="input-icon"><UserRound/><input v-model="form.name" required placeholder="Your full name"/></div></label>
        <label>Email address<div class="input-icon"><Mail/><input v-model="form.email" type="email" required placeholder="you@example.com"/></div></label>
        <label>Password<div class="input-icon password-input"><LockKeyhole/><input v-model="form.password" :type="showPassword ? 'text' : 'password'" minlength="8" required placeholder="At least 8 characters"/><button type="button" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'"><EyeOff v-if="showPassword"/><Eye v-else/></button></div></label>
        <label v-if="registering">Confirm password<div class="input-icon password-input"><LockKeyhole/><input v-model="form.confirm" :type="showConfirm ? 'text' : 'password'" required placeholder="Repeat password"/><button type="button" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'"><EyeOff v-if="showConfirm"/><Eye v-else/></button></div></label>
        <p v-if="error" class="form-error">{{ error }}</p><p v-if="success" class="form-success">{{ success }}</p>
        <button class="button primary" :disabled="busy">{{ busy ? 'Please wait…' : (registering ? 'Create account' : 'Sign in') }} <ArrowRight :size="17"/></button>
        <p class="auth-switch">{{ registering ? 'Already registered?' : 'Setting up for the first time?' }} <router-link :to="registering ? '/login' : '/register'">{{ registering ? 'Sign in' : 'Create owner account' }}</router-link></p>
      </form>
    </section>
  </main>
</template>
