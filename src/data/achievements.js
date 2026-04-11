export const ACHIEVEMENTS = [
  // Streak achievements
  { id: 'streak-3', name: 'Consistent', desc: 'Maintain a 3-day streak', icon: '🔥', check: (s) => s.tasks.some(t => t.streak >= 3) },
  { id: 'streak-7', name: 'On Fire', desc: '7-day streak on any task', icon: '🌋', check: (s) => s.tasks.some(t => t.streak >= 7) },
  { id: 'streak-30', name: 'Unstoppable', desc: '30-day streak! Legend!', icon: '💎', check: (s) => s.tasks.some(t => t.streak >= 30) },

  // Completion achievements
  { id: 'first-task', name: 'First Blood', desc: 'Complete your first task', icon: '⚔️', check: (s) => s.tasks.some(t => t.completedToday) },
  { id: 'all-daily', name: 'Perfect Day', desc: 'Complete ALL tasks in a day', icon: '👑', check: (s) => s.tasks.length > 0 && s.tasks.every(t => t.completedToday) },
  { id: 'half-daily', name: 'Halfway Hero', desc: 'Complete half your tasks', icon: '🛡️', check: (s) => { const done = s.tasks.filter(t => t.completedToday).length; return done >= s.tasks.length / 2 && s.tasks.length > 0 } },

  // Level achievements
  { id: 'level-1', name: 'Awakening', desc: 'Reach Level 1 in any mission', icon: '✨', check: (s) => s.missions.some(m => m.level >= 1) },
  { id: 'level-5', name: 'Veteran', desc: 'Reach Level 5 in any mission', icon: '🏆', check: (s) => s.missions.some(m => m.level >= 5) },
  { id: 'level-10', name: 'Master', desc: 'Reach Level 10 — true mastery', icon: '🐉', check: (s) => s.missions.some(m => m.level >= 10) },
  { id: 'all-level-1', name: 'Well Rounded', desc: 'All missions at Lv.1+', icon: '🌟', check: (s) => s.missions.length > 0 && s.missions.every(m => m.level >= 1) },

  // Coin milestones
  { id: 'coins-100', name: 'First Savings', desc: 'Earn 100 coins', icon: '💰', check: (s) => s.missions.reduce((sum, m) => sum + (m.coinsEarned || 0), 0) >= 100 },
  { id: 'coins-500', name: 'Treasure Hunter', desc: 'Earn 500 coins', icon: '💎', check: (s) => s.missions.reduce((sum, m) => sum + (m.coinsEarned || 0), 0) >= 500 },
  { id: 'coins-1000', name: 'Dragon Hoard', desc: '1000 coins — you\'re rich!', icon: '🐲', check: (s) => s.missions.reduce((sum, m) => sum + (m.coinsEarned || 0), 0) >= 1000 },

  // Quest achievements
  { id: 'quest-complete', name: 'Quest Master', desc: 'Complete all tasks in a quest', icon: '📜', check: (s) => {
    const questIds = [...new Set(s.tasks.map(t => t.questId))]
    return questIds.some(qid => {
      const qTasks = s.tasks.filter(t => t.questId === qid)
      return qTasks.length > 0 && qTasks.every(t => t.completedToday)
    })
  }},
]

export const LOOT_TABLE = [
  // Common (60%)
  { name: 'Health Potion', icon: '🧪', rarity: 'common', flavor: 'Restores your determination' },
  { name: 'Copper Coin', icon: '🪙', rarity: 'common', flavor: 'A small fortune for a small quest' },
  { name: 'Wooden Shield', icon: '🛡️', rarity: 'common', flavor: 'Better than nothing!' },
  { name: 'Bread Loaf', icon: '🍞', rarity: 'common', flavor: 'The adventurer\'s best friend' },
  { name: 'Torch', icon: '🔦', rarity: 'common', flavor: 'Light the way forward' },
  { name: 'Map Fragment', icon: '🗺️', rarity: 'common', flavor: 'Part of something bigger...' },

  // Uncommon (25%)
  { name: 'Silver Sword', icon: '🗡️', rarity: 'uncommon', flavor: 'Cuts through procrastination' },
  { name: 'Magic Scroll', icon: '📜', rarity: 'uncommon', flavor: 'Ancient wisdom within' },
  { name: 'Lucky Clover', icon: '🍀', rarity: 'uncommon', flavor: 'Fortune favors the bold' },
  { name: 'Crystal Ball', icon: '🔮', rarity: 'uncommon', flavor: 'See your future self thriving' },
  { name: 'Phoenix Feather', icon: '🪶', rarity: 'uncommon', flavor: 'Rise from the ashes' },

  // Rare (12%)
  { name: 'Dragon Scale', icon: '🐉', rarity: 'rare', flavor: 'From a beast you\'ll never meet' },
  { name: 'Enchanted Ring', icon: '💍', rarity: 'rare', flavor: 'Power flows through you' },
  { name: 'Golden Crown', icon: '👑', rarity: 'rare', flavor: 'You earned this, your majesty' },

  // Legendary (3%)
  { name: 'Infinity Stone', icon: '💎', rarity: 'legendary', flavor: 'The universe bends to your will' },
  { name: 'Excalibur', icon: '⚔️', rarity: 'legendary', flavor: 'Only the worthy may wield it' },
]

export function rollLoot() {
  const roll = Math.random()
  let pool
  if (roll < 0.03) pool = LOOT_TABLE.filter(l => l.rarity === 'legendary')
  else if (roll < 0.15) pool = LOOT_TABLE.filter(l => l.rarity === 'rare')
  else if (roll < 0.40) pool = LOOT_TABLE.filter(l => l.rarity === 'uncommon')
  else pool = LOOT_TABLE.filter(l => l.rarity === 'common')
  return pool[Math.floor(Math.random() * pool.length)]
}

export const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  legendary: '#f59e0b',
}
