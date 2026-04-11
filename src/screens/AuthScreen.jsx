import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) { setError('Fill in both fields'); return }
    setLoading(true)

    // We use username as a fake email: username@lifegame.app
    const email = `${username.trim().toLowerCase().replace(/\s+/g, '')}@lifegame.app`

    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: username.trim() } },
        })
        if (err) throw err
        if (data?.user) onAuth(data.user)
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        if (data?.user) onAuth(data.user)
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong'
      setError(msg.includes('Invalid login') ? 'Wrong username or password' : msg.includes('already registered') ? 'Username already taken' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">💶</div>
          <h1 className="text-3xl font-black" style={{ color: 'var(--green)' }}>Life Game</h1>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--text-dim)' }}>
            Earn €5 for every task you crush.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <button onClick={() => setMode('login')} className="flex-1 py-3 text-sm font-extrabold transition-colors"
            style={{ background: mode === 'login' ? 'var(--green)' : 'transparent', color: mode === 'login' ? '#fff' : 'var(--text-dim)' }}>
            LOG IN
          </button>
          <button onClick={() => setMode('signup')} className="flex-1 py-3 text-sm font-extrabold transition-colors"
            style={{ background: mode === 'signup' ? 'var(--green)' : 'transparent', color: mode === 'signup' ? '#fff' : 'var(--text-dim)' }}>
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} className="input" autoComplete="username" />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="input" minLength={6} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />

          {error && (
            <p className="text-sm text-center py-2 px-3 rounded-xl" style={{ background: 'rgba(255,75,75,0.15)', color: 'var(--red)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-green w-full py-3.5 text-base"
            style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? '...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Skip */}
        <button onClick={() => onAuth(null)} className="w-full mt-6 py-2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
          Try without an account →
        </button>
        <p className="text-center text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
          You can sign up later to save your progress
        </p>
      </div>
    </div>
  )
}
