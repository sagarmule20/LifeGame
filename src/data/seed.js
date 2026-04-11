// The 3 mandatory missions — Health, Career, Personal Skills
// These are always present and cannot be removed.
export const MANDATORY_MISSION_IDS = ['mission-health', 'mission-career', 'mission-skills']

export const seedMissions = [
  { id: 'mission-health', name: 'Health & Fitness', icon: '💪', coinsEarned: 0, level: 0, color: '#58CC02' },
  { id: 'mission-career', name: 'Career & Skills', icon: '🚀', coinsEarned: 0, level: 0, color: '#1CB0F6' },
  { id: 'mission-skills', name: 'Personal Skills', icon: '🎯', coinsEarned: 0, level: 0, color: '#CE82FF' },
]

// One quest per mission — keeps it flat and simple
export const seedQuests = [
  { id: 'quest-health', missionId: 'mission-health', name: 'Health & Fitness', description: 'Daily health habits' },
  { id: 'quest-career', missionId: 'mission-career', name: 'Career & Skills', description: 'Professional growth' },
  { id: 'quest-skills', missionId: 'mission-skills', name: 'Personal Skills', description: 'Learn new skills and grow' },
]

export const seedTasks = [
  // Health
  { id: 'task-workout', questId: 'quest-health', name: 'Complete workout', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-water', questId: 'quest-health', name: 'Drink 8 cups of water', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-sleep', questId: 'quest-health', name: 'Sleep 8 hours', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-walk', questId: 'quest-health', name: 'Walk 30 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  // Career
  { id: 'task-deepwork', questId: 'quest-career', name: '2-hour deep work', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-learn', questId: 'quest-career', name: 'Learn for 1 hour', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-ship', questId: 'quest-career', name: 'Ship a feature/PR', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  // Personal Growth
  { id: 'task-german', questId: 'quest-skills', name: 'German language practice', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-invest', questId: 'quest-skills', name: 'Investment research', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-read', questId: 'quest-skills', name: 'Read for 30 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
]
