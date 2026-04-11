/**
 * Corporate rank ladder based on Euro balance slabs.
 * Each rank requires a cumulative lifetime earnings threshold.
 */
export const RANKS = [
  { threshold: 0,     name: 'Intern',              icon: '📋', color: '#56717A', tagline: 'Everyone starts somewhere' },
  { threshold: 50,    name: 'Junior Associate',     icon: '💼', color: '#58CC02', tagline: 'You\'re on the books now' },
  { threshold: 100,   name: 'Associate',            icon: '🏢', color: '#58CC02', tagline: 'Building your foundation' },
  { threshold: 250,   name: 'Senior Associate',     icon: '📊', color: '#1CB0F6', tagline: 'People are noticing you' },
  { threshold: 500,   name: 'Team Lead',            icon: '👥', color: '#1CB0F6', tagline: 'Leading by example' },
  { threshold: 1000,  name: 'Manager',              icon: '🎯', color: '#CE82FF', tagline: 'Running the show' },
  { threshold: 2000,  name: 'Senior Manager',       icon: '📈', color: '#CE82FF', tagline: 'Strategy meets execution' },
  { threshold: 5000,  name: 'Director',             icon: '🏆', color: '#FF9600', tagline: 'Shaping the vision' },
  { threshold: 10000, name: 'VP',                   icon: '🌟', color: '#FF9600', tagline: 'The boardroom knows your name' },
  { threshold: 25000, name: 'CTO of Your Life',     icon: '🚀', color: '#FFC800', tagline: 'Engineering your destiny' },
  { threshold: 50000, name: 'CEO of Your Life',     icon: '👑', color: '#FFC800', tagline: 'You own your world' },
]

export function getRank(totalEarned) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (totalEarned >= r.threshold) rank = r
    else break
  }
  return rank
}

export function getNextRank(totalEarned) {
  for (const r of RANKS) {
    if (totalEarned < r.threshold) return r
  }
  return null // Already at max
}

// Additional mission templates the user can buy (€50 each)
// Flat structure — just a name, icon, color, and task list. No sub-quests.
export const MISSION_TEMPLATES = [
  {
    name: 'Mind & Wellness',
    icon: '🧠',
    color: '#58CC02',
    description: 'Mental health and mindfulness',
    tasks: ['Meditate 10 minutes', 'Write journal entry', 'Gratitude list', 'Breathing exercise'],
  },
  {
    name: 'Social & Relationships',
    icon: '❤️',
    color: '#FF4B4B',
    description: 'Stay connected with people',
    tasks: ['Call a friend or family', 'Plan a meetup', 'Random act of kindness'],
  },
  {
    name: 'Creative',
    icon: '🎨',
    color: '#FF86D0',
    description: 'Express yourself daily',
    tasks: ['Draw or sketch something', 'Write creatively', 'Practice instrument 30 min'],
  },
  {
    name: 'Home & Organization',
    icon: '🏠',
    color: '#FF9600',
    description: 'Keep your space and life tidy',
    tasks: ['15-min cleanup', 'Organize one area', 'Cook a healthy meal', 'Meal prep'],
  },
  {
    name: 'Personal Skills',
    icon: '🎯',
    color: '#FFC800',
    description: 'Learn new skills and grow',
    tasks: ['German language practice', 'Investment research', 'Read for 30 minutes', 'Online course lesson'],
  },
]
