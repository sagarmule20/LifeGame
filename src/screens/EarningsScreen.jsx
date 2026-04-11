import { useNavigate } from 'react-router-dom'
import useGameStore from '../store/useGameStore'
import { getRank } from '../data/ranks'

export default function EarningsScreen() {
  const navigate = useNavigate()
  const dailyLog = useGameStore((s) => s.dailyLog)
  const totalEurosEarned = useGameStore((s) => s.totalEurosEarned)
  const euros = useGameStore((s) => s.euros)

  // Sort dates descending
  const entries = Object.entries(dailyLog || {})
    .filter(([, amount]) => amount > 0)
    .sort(([a], [b]) => b.localeCompare(a))

  const today = new Date().toLocaleDateString('en-CA')
  const todayEarned = dailyLog[today] || 0

  // Last 7 days for mini chart
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-CA')
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
    last7.push({ key, dayName, amount: dailyLog[key] || 0 })
  }
  const maxDay = Math.max(...last7.map((d) => d.amount), 1)

  return (
    <div className="px-4 pt-5 pb-4">
      <button onClick={() => navigate('/profile')}
        className="text-sm font-bold mb-4" style={{ color: 'var(--text-dim)' }}>
        ← Profile
      </button>

      <h1 className="text-2xl font-black mb-1">Earnings</h1>
      <p className="text-xs font-bold mb-5" style={{ color: 'var(--text-dim)' }}>Your daily money tracker</p>

      {/* Summary cards */}
      <div className="flex gap-2 mb-5">
        <div className="card flex-1 p-3 text-center">
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>TODAY</p>
          <p className="text-xl font-black" style={{ color: '#FFC800' }}>€{todayEarned}</p>
        </div>
        <div className="card flex-1 p-3 text-center">
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>BALANCE</p>
          <p className="text-xl font-black" style={{ color: 'var(--green)' }}>€{euros}</p>
        </div>
        <div className="card flex-1 p-3 text-center">
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>LIFETIME</p>
          <p className="text-xl font-black" style={{ color: 'var(--blue)' }}>€{totalEurosEarned}</p>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="card p-4 mb-5">
        <p className="text-xs font-extrabold mb-3" style={{ color: 'var(--text-dim)' }}>Last 7 days</p>
        <div className="flex items-end gap-2" style={{ height: 100 }}>
          {last7.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold" style={{ color: '#FFC800' }}>
                {d.amount > 0 ? `€${d.amount}` : ''}
              </span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${Math.max((d.amount / maxDay) * 70, d.amount > 0 ? 6 : 2)}px`,
                  background: d.key === today ? 'var(--green)' : d.amount > 0 ? 'var(--blue)' : 'var(--border)',
                }}
              />
              <span className="text-[9px] font-bold" style={{ color: d.key === today ? 'var(--green)' : 'var(--text-muted)' }}>
                {d.dayName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full history */}
      <p className="text-xs font-extrabold mb-3" style={{ color: 'var(--text-dim)' }}>All earnings</p>
      {entries.length === 0 ? (
        <div className="card p-8 text-center">
          <span className="text-3xl block mb-2">📊</span>
          <p className="text-sm font-bold">No earnings yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Complete tasks to start earning!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {entries.map(([date, amount]) => {
            const d = new Date(date + 'T00:00:00')
            const formatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            const isToday = date === today
            return (
              <div key={date} className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid var(--border)', background: isToday ? 'rgba(88,204,2,0.05)' : undefined }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{isToday ? '⚡' : '📅'}</span>
                  <span className="text-sm font-bold">{isToday ? 'Today' : formatted}</span>
                </div>
                <span className="text-sm font-black" style={{ color: '#FFC800' }}>+€{amount}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
