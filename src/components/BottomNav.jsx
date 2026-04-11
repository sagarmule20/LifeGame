import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Today', icon: '⚡' },
  { path: '/leaderboard', label: 'Board', icon: '🏆' },
  { path: '/rewards', label: 'Shop', icon: '🛍️' },
  { path: '/profile', label: 'Me', icon: '👤' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex"
      style={{ background: 'var(--bg-card)', borderTop: '2px solid var(--border)', zIndex: 100 }}>
      {tabs.map((tab) => {
        const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path)
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all active:scale-95 relative">
            <span className="text-xl" style={{ transform: isActive ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold" style={{ color: isActive ? 'var(--green)' : 'var(--text-muted)' }}>
              {tab.label}
            </span>
            {isActive && <div className="absolute top-0 w-10 h-[3px] rounded-b-full" style={{ background: 'var(--green)' }} />}
          </button>
        )
      })}
    </nav>
  )
}
