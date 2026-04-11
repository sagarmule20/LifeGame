// The 3 mandatory missions — Health, Career, Finance
// These are always present and cannot be removed.
export const MANDATORY_MISSION_IDS = ['mission-health', 'mission-career', 'mission-finance']

export const seedMissions = [
  { id: 'mission-health', name: 'Health & Fitness', icon: '💪', coinsEarned: 0, level: 0, color: '#58CC02' },
  { id: 'mission-career', name: 'Career & Skills', icon: '🚀', coinsEarned: 0, level: 0, color: '#1CB0F6' },
  { id: 'mission-finance', name: 'Finance', icon: '💰', coinsEarned: 0, level: 0, color: '#FFC800' },
]

export const seedQuests = [
  // Health
  { id: 'quest-gym', missionId: 'mission-health', name: 'Gym Warrior', description: 'Build strength through consistent workouts' },
  { id: 'quest-water', missionId: 'mission-health', name: 'Hydration', description: 'Stay hydrated throughout the day' },
  { id: 'quest-sleep', missionId: 'mission-health', name: 'Sleep Mastery', description: 'Optimize rest and recovery' },
  { id: 'quest-walk', missionId: 'mission-health', name: 'Active Living', description: 'Keep moving with daily walks' },
  // Career
  { id: 'quest-deepwork', missionId: 'mission-career', name: 'Deep Focus', description: 'Achieve flow with deep work sessions' },
  { id: 'quest-learn', missionId: 'mission-career', name: 'Skill Up', description: 'Level up professional skills' },
  { id: 'quest-ship', missionId: 'mission-career', name: 'Ship It', description: 'Deliver real results' },
  // Finance
  { id: 'quest-budget', missionId: 'mission-finance', name: 'Budget Check', description: 'Stay on top of your money' },
  { id: 'quest-invest', missionId: 'mission-finance', name: 'Save & Invest', description: 'Build wealth over time' },
]

export const seedTasks = [
  // Health
  { id: 'task-gym-workout', questId: 'quest-gym', name: 'Complete workout', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-water-8cups', questId: 'quest-water', name: 'Drink 8 cups of water', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-sleep-8hrs', questId: 'quest-sleep', name: 'Sleep 8 hours', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-walk-30min', questId: 'quest-walk', name: 'Walk 30 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  // Career
  { id: 'task-deepwork-2hr', questId: 'quest-deepwork', name: '2-hour deep work', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-learn-1hr', questId: 'quest-learn', name: 'Learn for 1 hour', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-ship-feature', questId: 'quest-ship', name: 'Ship a feature/PR', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  // Finance
  { id: 'task-review-expenses', questId: 'quest-budget', name: 'Review expenses', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-track-spending', questId: 'quest-budget', name: 'Track spending', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-transfer-savings', questId: 'quest-invest', name: 'Transfer to savings', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
]
