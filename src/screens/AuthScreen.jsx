import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name || 'Adventurer' } },
        })
        if (signUpError) throw signUpError
        if (data?.user) onAuth(data.user)
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (loginError) throw loginError
        if (data?.user) onAuth(data.user)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black" style={{ color: 'var(--green)' }}>
            Life Game
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            Earn coins. Treat yourself.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <button
            onClick={() => setMode('login')}
            className="flex-1 py-3 text-sm font-bold transition-colors"
            style={{
              background: mode === 'login' ? 'var(--green)' : 'transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-dim)',
            }}
          >
            LOG IN
          </button>
          <button
            onClick={() => setMode('signup')}
            className="flex-1 py-3 text-sm font-bold transition-colors"
            style={{
              background: mode === 'signup' ? 'var(--green)' : 'transparent',
              color: mode === 'signup' ? '#fff' : 'var(--text-dim)',
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />

          {error && (
            <p className="text-sm text-center py-2 px-3 rounded-xl" style={{ background: 'rgba(255,75,75,0.15)', color: 'var(--red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-green w-full py-3 text-base"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>OR</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="btn btn-ghost w-full py-3 text-sm"
        >
          <span>🌐</span> Continue with Google
        </button>

        {/* Skip */}
        <button
          onClick={() => onAuth(null)}
          className="w-full mt-4 py-2 text-sm font-bold"
          style={{ color: 'var(--text-muted)' }}
        >
          Skip for now →
        </button>
      </div>
    </div>
  )
}
