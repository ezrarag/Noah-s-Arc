"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface OfflineContextType {
  isOnline: boolean
  queueAction: (action: any) => Promise<void>
  syncPendingActions: () => Promise<void>
  pendingActionsCount: number
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider")
  }
  return context
}

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingActionsCount, setPendingActionsCount] = useState(0)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false)

      // Auto-sync when coming back online
      if (state.isConnected && pendingActionsCount > 0) {
        syncPendingActions()
      }
    })

    // Load pending actions count
    loadPendingActionsCount()

    return unsubscribe
  }, [])

  const loadPendingActionsCount = async () => {
    try {
      const pendingActions = await AsyncStorage.getItem("pendingActions")
      const actions = pendingActions ? JSON.parse(pendingActions) : []
      setPendingActionsCount(actions.length)
    } catch (error) {
      console.error("Error loading pending actions count:", error)
    }
  }

  const queueAction = async (action: any) => {
    try {
      const pendingActions = await AsyncStorage.getItem("pendingActions")
      const actions = pendingActions ? JSON.parse(pendingActions) : []

      const newAction = {
        ...action,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }

      actions.push(newAction)
      await AsyncStorage.setItem("pendingActions", JSON.stringify(actions))
      setPendingActionsCount(actions.length)

      // Try to sync immediately if online
      if (isOnline) {
        await syncPendingActions()
      }
    } catch (error) {
      console.error("Error queuing action:", error)
    }
  }

  const syncPendingActions = async () => {
    if (!isOnline) return

    try {
      const pendingActions = await AsyncStorage.getItem("pendingActions")
      const actions = pendingActions ? JSON.parse(pendingActions) : []

      if (actions.length === 0) return

      // Process each action
      const syncedActions: string[] = []

      for (const action of actions) {
        try {
          // Here you would sync with your backend
          // For now, we'll just simulate success
          await new Promise((resolve) => setTimeout(resolve, 100))
          syncedActions.push(action.id)
        } catch (error) {
          console.error("Error syncing action:", action, error)
          // Keep failed actions in queue
        }
      }

      // Remove successfully synced actions
      const remainingActions = actions.filter((action: any) => !syncedActions.includes(action.id))

      await AsyncStorage.setItem("pendingActions", JSON.stringify(remainingActions))
      setPendingActionsCount(remainingActions.length)
    } catch (error) {
      console.error("Error syncing pending actions:", error)
    }
  }

  const value: OfflineContextType = {
    isOnline,
    queueAction,
    syncPendingActions,
    pendingActionsCount,
  }

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}
