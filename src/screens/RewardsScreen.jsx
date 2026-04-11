import { useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function RewardsScreen() {
  const coins = useGameStore((s) => s.coins)
  const rewards = useGameStore((s) => s.rewards)
  const addReward = useGameStore((s) => s.addReward)
  const purchaseReward = useGameStore((s) => s.purchaseReward)
  const deleteReward = useGameStore((s) => s.deleteReward)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [icon, setIcon] = useState('🎮')
  const [justPurchased, setJustPurchased] = useState(null)

  const unpurchased = rewards.filter((r) => !r.purchased)
  const purchased = rewards.filter((r) => r.purchased)

  const iconOptions = ['🎮', '🎬', '🍕', '✈️', '👟', '📱', '🎵', '☕', '🎂', '🏖️', '🎁', '💆']

  const handleAdd = (e) => {
    e.preventDefault()
    if (!name.trim() || !cost) return
    addReward(name.trim(), parseInt(cost), icon)
    setName('')
    setCost('')
    setShowForm(false)
  }

  const handlePurchase = (rewardId) => {
    const success = purchaseReward(rewardId)
    if (success) {
      setJustPurchased(rewardId)
      setTimeout(() => setJustPurchased(null), 2000)
    }
  }

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black">Rewards</h1>
          <p className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>Earn it. Then enjoy it.</p>
        </div>
        <div className="coin-badge text-lg font-black px-4 py-2 rounded-2xl"
          style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          🪙 {coins}
        </div>
      </div>

      {/* Add reward button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-green w-full py-3 text-sm mb-5"
      >
        + ADD A REWARD GOAL
      </button>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card p-4 mb-5 space-y-3">
          <p className="text-sm font-bold" style={{ color: 'var(--text-dim)' }}>
            What do you want to earn?
          </p>

          {/* Icon picker */}
          <div className="flex flex-wrap gap-2">
            {iconOptions.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                style={{
                  background: icon === ic ? 'var(--green)' : 'var(--bg)',
                  border: `2px solid ${icon === ic ? 'var(--green)' : 'var(--border)'}`,
                }}
              >
                {ic}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="e.g. Movie night, New sneakers, Weekend trip..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            autoFocus
          />

          <div className="flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <input
              type="number"
              placeholder="Cost in coins"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="input"
              min="1"
            />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="btn btn-ghost flex-1 py-2.5 text-sm">
              CANCEL
            </button>
            <button type="submit" className="btn btn-green flex-1 py-2.5 text-sm">
              ADD REWARD
            </button>
          </div>
        </form>
      )}

      {/* Rewards to earn */}
      {unpurchased.length === 0 && !showForm && (
        <div className="card p-8 text-center mb-5">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-base font-bold">Set a goal!</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
            Add something you want — a game night, a trip, new gear.
            <br />Complete tasks to earn coins and buy it!
          </p>
        </div>
      )}

      {unpurchased.map((reward) => {
        const progress = Math.min(coins / reward.cost, 1)
        const canAfford = coins >= reward.cost
        const isJustPurchased = justPurchased === reward.id

        return (
          <div key={reward.id} className="card p-4 mb-3 slide-up" style={{
            borderColor: canAfford ? 'var(--green)' : undefined,
          }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{reward.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-extrabold">{reward.name}</p>
                <p className="coin-badge text-xs font-bold">🪙 {reward.cost}</p>
              </div>
              <button
                onClick={() => deleteReward(reward.id)}
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Progress */}
            <div className="progress-track mb-3" style={{ height: 10 }}>
              <div className="progress-fill" style={{
                width: `${progress * 100}%`,
                background: canAfford ? 'var(--green)' : 'var(--orange)',
                height: 10,
              }} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>
                {canAfford ? 'Ready!' : `${Math.max(0, reward.cost - coins)} more coins needed`}
              </span>
              <button
                onClick={() => handlePurchase(reward.id)}
                disabled={!canAfford}
                className="btn text-xs py-2 px-4"
                style={{
                  background: canAfford ? 'var(--green)' : 'var(--bg)',
                  color: canAfford ? '#fff' : 'var(--text-muted)',
                  boxShadow: canAfford ? '0 3px 0 var(--green-dark)' : 'none',
                  border: canAfford ? 'none' : '2px solid var(--border)',
                  opacity: canAfford ? 1 : 0.5,
                }}
              >
                {canAfford ? '🎉 CLAIM!' : 'LOCKED'}
              </button>
            </div>
          </div>
        )
      })}

      {/* Purchased */}
      {purchased.length > 0 && (
        <>
          <h2 className="text-sm font-extrabold mt-6 mb-3" style={{ color: 'var(--text-dim)' }}>
            🏆 Claimed Rewards
          </h2>
          {purchased.map((reward) => (
            <div key={reward.id} className="card p-3 mb-2 flex items-center gap-3 opacity-60">
              <span className="text-2xl">{reward.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold line-through">{reward.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Claimed! • 🪙 {reward.cost}
                </p>
              </div>
              <span className="text-lg">✅</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
