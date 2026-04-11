import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// If env vars are missing, create a dummy client that won't crash the app.
// The app will work in offline/localStorage-only mode.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient()

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

function createDummyClient() {
  const noop = () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  const noopAuth = {
    getSession: () => Promise.resolve({ data: { session: null } }),
    signUp: noop,
    signInWithPassword: noop,
    signOut: () => Promise.resolve({}),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
  return { auth: noopAuth, from: () => ({ select: noop, upsert: noop, insert: noop, update: noop, delete: noop, order: () => ({ limit: noop }) }) }
}
