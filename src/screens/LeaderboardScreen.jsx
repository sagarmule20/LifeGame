import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import useGameStore from '../store/useGameStore'
import { getRank } from '../data/ranks'

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useGameStore((s) => s.user)
  const totalEurosEarned = useGameStore((s) => s.totalEurosEarned)
  const myRank = getRank(totalEurosEarned)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, total_coins_earned')
        .order('total_coins_earned', { ascending: false })
        .limit(50)

      if (!error && data) {
        setLeaders(data.map((p) => ({
          id: p.id,
          name: p.display_name || 'Anonymous',
          totalEarned: p.total_coins_earned || 0,
          rank: getRank(p.total_coins_earned || 0),
          isMe: p.id === user?.id,
        })))
      }
    } catch (err) {
      console.warn('Leaderboard load failed:', err)
    }
    setLoading(false)
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-2xl font-black">Leaderboard</h1>
        <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
          See how others are doing
        </p>
      </div>

      {/* My rank card */}
      <div className="card p-4 mb-5" style={{ borderColor: myRank.color }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{myRank.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-extrabold" style={{ color: myRank.color }}>{myRank.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{myRank.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black" style={{ color: '#FFC800' }}>€{totalEurosEarned}</p>
            <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>lifetime</p>
          </div>
        </div>
      </div>

      {/* Leaderboard list */}
      {!user ? (
        <div className="card p-8 text-center">
          <span className="text-4xl block mb-3">🔒</span>
          <p className="text-sm font-bold">Sign in to see the leaderboard</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
            Create an account to compete with others
          </p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-2" style={{ animation: 'bounce 1s ease-in-out infinite' }}>💶</div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-dim)' }}>Loading...</p>
        </div>
      ) : leaders.length === 0 ? (
        <div className="card p-8 text-center">
          <span className="text-4xl block mb-3">🏜️</span>
          <p className="text-sm font-bold">No one here yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Be the first to earn!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map((leader, i) => {
            const isTop3 = i < 3
            const medals = ['🥇', '🥈', '🥉']

            return (
              <div
                key={leader.id}
                className="card p-3 flex items-center gap-3 slide-up"
                style={{
                  animationDelay: `${i * 0.03}s`,
                  borderColor: leader.isMe ? 'var(--green)' : isTop3 ? 'var(--gold)' : undefined,
                  background: leader.isMe ? 'rgba(88,204,2,0.06)' : undefined,
                }}
              >
                {/* Position */}
                <div className="w-8 text-center flex-shrink-0">
                  {isTop3 ? (
                    <span className="text-xl">{medals[i]}</span>
                  ) : (
                    <span className="text-sm font-black" style={{ color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Rank icon */}
                <span className="text-xl flex-shrink-0">{leader.rank.icon}</span>

                {/* Name + rank */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold truncate">
                    {leader.name} {leader.isMe && <span style={{ color: 'var(--green)' }}>(you)</span>}
                  </p>
                  <p className="text-[10px] font-bold" style={{ color: leader.rank.color }}>
                    {leader.rank.name}
                  </p>
                </div>

                {/* Balance */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black" style={{ color: '#FFC800' }}>
                    €{leader.totalEarned}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
