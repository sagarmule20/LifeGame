export const seedMissions = [
  { id: 'mission-health', name: 'Health & Fitness', icon: '💪', coinsEarned: 0, level: 0, color: '#58CC02' },
  { id: 'mission-mind', name: 'Mind & Wellness', icon: '🧠', coinsEarned: 0, level: 0, color: '#CE82FF' },
  { id: 'mission-career', name: 'Career & Skills', icon: '🚀', coinsEarned: 0, level: 0, color: '#1CB0F6' },
]

export const seedQuests = [
  { id: 'quest-gym', missionId: 'mission-health', name: 'Gym Warrior', description: 'Build strength through consistent workouts' },
  { id: 'quest-water', missionId: 'mission-health', name: 'Hydration', description: 'Stay hydrated throughout the day' },
  { id: 'quest-sleep', missionId: 'mission-health', name: 'Sleep Mastery', description: 'Optimize rest and recovery' },
  { id: 'quest-walk', missionId: 'mission-health', name: 'Active Living', description: 'Keep moving with daily walks' },
  { id: 'quest-read', missionId: 'mission-mind', name: 'Bookworm', description: 'Expand your mind through reading' },
  { id: 'quest-meditate', missionId: 'mission-mind', name: 'Inner Peace', description: 'Find calm through meditation' },
  { id: 'quest-journal', missionId: 'mission-mind', name: 'Journal', description: 'Reflect and grow through journaling' },
  { id: 'quest-deepwork', missionId: 'mission-career', name: 'Deep Focus', description: 'Achieve flow with deep work sessions' },
  { id: 'quest-learn', missionId: 'mission-career', name: 'Skill Up', description: 'Level up professional skills' },
  { id: 'quest-ship', missionId: 'mission-career', name: 'Ship It', description: 'Deliver real results' },
]

export const seedTasks = [
  { id: 'task-gym-workout', questId: 'quest-gym', name: 'Complete workout', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-water-8cups', questId: 'quest-water', name: 'Drink 8 cups of water', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-sleep-8hrs', questId: 'quest-sleep', name: 'Sleep 8 hours', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-walk-30min', questId: 'quest-walk', name: 'Walk 30 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-read-30min', questId: 'quest-read', name: 'Read for 30 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-meditate-10', questId: 'quest-meditate', name: 'Meditate 10 minutes', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-journal-entry', questId: 'quest-journal', name: 'Write journal entry', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-deepwork-2hr', questId: 'quest-deepwork', name: '2-hour deep work', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-learn-1hr', questId: 'quest-learn', name: 'Learn for 1 hour', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
  { id: 'task-ship-feature', questId: 'quest-ship', name: 'Ship a feature/PR', coinReward: 5, streak: 0, lastCompletedDate: null, completedToday: false, scheduledTime: null },
]
