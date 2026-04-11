import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Map', icon: '🗺️', activeIcon: '🌍' },
  { path: '/daily', label: 'Quests', icon: '⚔️', activeIcon: '🗡️' },
  { path: '/profile', label: 'Hero', icon: '🛡️', activeIcon: '👤' },
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
        zIndex: 100,
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
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-all active:scale-95"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            <span
              className="text-xl transition-transform"
              style={{
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
                filter: isActive ? 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' : 'none',
              }}
            >
              {isActive ? tab.activeIcon : tab.icon}
            </span>
            <span className="font-pixel text-[7px]">{tab.label}</span>
            {isActive && (
              <div
                className="absolute top-0 w-12 h-0.5"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
