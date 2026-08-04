import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Admin from './views/Admin.vue'
import Auth from './views/Auth.vue'
import ProductDetail from './views/ProductDetail.vue'
import Treats from './views/Treats.vue'
import { supabase } from './lib/supabase'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/products/:id', component: ProductDetail },
    { path: '/treats', component: Treats },
    { path: '/login', component: Auth, props: { mode: 'login' } },
    { path: '/register', component: Auth, props: { mode: 'register' } },
    { path: '/admin', component: Admin, meta: { requiresAuth: true } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async to => {
  if (!to.meta.requiresAuth) return true
  if (!supabase) return '/login'
  const { data } = await supabase.auth.getSession()
  if (!data.session) return { path: '/login', query: { redirect: to.fullPath } }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).single()
  return profile?.role === 'admin' ? true : '/login'
})

createApp(App).use(router).mount('#app')
