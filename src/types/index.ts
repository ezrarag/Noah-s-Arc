export interface Task {
  id: number
  title: string
  description: string
  targetObject: string
  difficulty: number
  pointsReward: number
  isActive: boolean
  createdBy?: number
  createdAt: string
}

export interface UserProgress {
  level: number
  points: number
  streak: number
}

export interface TaskCompletion {
  taskId: number
  userId: number
  imageUri?: string
  voiceUri?: string
  writingText?: string
  pointsEarned: number
}

export interface User {
  id: number
  name: string
  level: number
  points: number
  streak: number
  createdAt: string
}

export interface SyncAction {
  id: string
  type: "TASK_COMPLETION" | "PROGRESS_UPDATE" | "TASK_CREATE"
  data: any
  timestamp: string
}
