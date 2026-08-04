import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://nusgbrxpozcgtjluddfl.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Tb1itJge42QNjSaBtXFk5w_7hLBSIPk'

export const hasSupabase = Boolean(url && key)
export const supabase = hasSupabase ? createClient(url, key) : null
