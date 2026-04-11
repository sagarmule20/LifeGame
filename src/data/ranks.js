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

export const MISSION_TEMPLATES = [
  {
    name: 'Health & Fitness',
    icon: '💪',
    color: '#58CC02',
    quests: [
      { name: 'Gym Warrior', description: 'Build strength through consistent workouts', tasks: ['Complete workout', 'Stretching session'] },
      { name: 'Hydration', description: 'Stay hydrated throughout the day', tasks: ['Drink 8 cups of water'] },
      { name: 'Sleep Mastery', description: 'Optimize rest and recovery', tasks: ['Sleep 8 hours', 'No screens 1hr before bed'] },
      { name: 'Active Living', description: 'Keep moving every day', tasks: ['Walk 30 minutes', '10,000 steps'] },
    ],
  },
  {
    name: 'Mind & Wellness',
    icon: '🧠',
    color: '#CE82FF',
    quests: [
      { name: 'Bookworm', description: 'Expand your mind through reading', tasks: ['Read for 30 minutes'] },
      { name: 'Inner Peace', description: 'Find calm through meditation', tasks: ['Meditate 10 minutes', 'Breathing exercise'] },
      { name: 'Journal', description: 'Reflect and grow', tasks: ['Write journal entry', 'Gratitude list'] },
    ],
  },
  {
    name: 'Career & Skills',
    icon: '🚀',
    color: '#1CB0F6',
    quests: [
      { name: 'Deep Focus', description: 'Achieve flow with deep work', tasks: ['2-hour deep work session'] },
      { name: 'Skill Up', description: 'Level up professional skills', tasks: ['Learn for 1 hour', 'Online course lesson'] },
      { name: 'Ship It', description: 'Deliver real results', tasks: ['Ship a feature/PR', 'Code review'] },
    ],
  },
  {
    name: 'Finance',
    icon: '💰',
    color: '#FFC800',
    quests: [
      { name: 'Budget Check', description: 'Stay on top of your money', tasks: ['Review expenses', 'Track spending'] },
      { name: 'Save & Invest', description: 'Build wealth over time', tasks: ['Transfer to savings', 'Check investments'] },
    ],
  },
  {
    name: 'Social & Relationships',
    icon: '❤️',
    color: '#FF4B4B',
    quests: [
      { name: 'Stay Connected', description: 'Nurture your relationships', tasks: ['Call a friend/family', 'Plan a meetup'] },
      { name: 'Give Back', description: 'Help others around you', tasks: ['Random act of kindness', 'Volunteer time'] },
    ],
  },
  {
    name: 'Creative',
    icon: '🎨',
    color: '#FF86D0',
    quests: [
      { name: 'Create Daily', description: 'Express yourself every day', tasks: ['Draw/sketch something', 'Write creatively'] },
      { name: 'Music', description: 'Practice your instrument', tasks: ['Practice 30 minutes', 'Learn a new song'] },
    ],
  },
  {
    name: 'Home & Organization',
    icon: '🏠',
    color: '#FF9600',
    quests: [
      { name: 'Clean Space', description: 'Keep your space tidy', tasks: ['15-min cleanup', 'Organize one area'] },
      { name: 'Cooking', description: 'Eat well, live well', tasks: ['Cook a healthy meal', 'Meal prep'] },
    ],
  },
]
