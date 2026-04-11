import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Map', icon: '\uD83D\uDDFA\uFE0F' },
  { path: '/daily', label: 'Daily', icon: '\u2694\uFE0F' },
  { path: '/profile', label: 'Profile', icon: '\uD83D\uDC64' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '2px solid var(--accent)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.path)

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="font-pixel text-[8px]">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
