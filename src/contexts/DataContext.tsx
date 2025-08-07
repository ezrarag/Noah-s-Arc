"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getTasks, getUserProgress, saveTaskCompletion } from "../services/database"
import type { Task, UserProgress, TaskCompletion } from "../types"

interface DataContextType {
  tasks: Task[]
  userProgress: UserProgress
  getCurrentTasks: () => Promise<Task[]>
  getUserProgress: () => Promise<UserProgress>
  completeTask: (completion: TaskCompletion) => Promise<void>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    points: 0,
    streak: 0,
  })

  useEffect(() => {
    refreshData()
  }, [])

  const getCurrentTasks = async (): Promise<Task[]> => {
    try {
      const allTasks = await getTasks()
      // Filter tasks based on user level and completion status
      const availableTasks = allTasks.filter((task) => task.difficulty <= userProgress.level + 1).slice(0, 3) // Limit to 3 tasks per day

      setTasks(availableTasks)
      return availableTasks
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  }

  const getUserProgressData = async (): Promise<UserProgress> => {
    try {
      const progress = await getUserProgress()
      setUserProgress(progress)
      return progress
    } catch (error) {
      console.error("Error fetching user progress:", error)
      return { level: 1, points: 0, streak: 0 }
    }
  }

  const completeTask = async (completion: TaskCompletion): Promise<void> => {
    try {
      await saveTaskCompletion(completion)
      await refreshData() // Refresh data after completion
    } catch (error) {
      console.error("Error completing task:", error)
      throw error
    }
  }

  const refreshData = async (): Promise<void> => {
    await Promise.all([getCurrentTasks(), getUserProgressData()])
  }

  const value: DataContextType = {
    tasks,
    userProgress,
    getCurrentTasks,
    getUserProgress: getUserProgressData,
    completeTask,
    refreshData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
