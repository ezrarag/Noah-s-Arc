"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { AuthProvider } from "./src/contexts/AuthContext"
import { DataProvider } from "./src/contexts/DataContext"
import { OfflineProvider } from "./src/contexts/OfflineContext"
import AuthScreen from "./src/screens/AuthScreen"
import ChildNavigator from "./src/navigation/ChildNavigator"
import ParentNavigator from "./src/navigation/ParentNavigator"
import { initializeDatabase } from "./src/services/database"

const Stack = createStackNavigator()

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [userMode, setUserMode] = useState<"child" | "parent" | null>(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Initialize SQLite database
      await initializeDatabase()

      // Check for existing user mode
      const savedMode = await AsyncStorage.getItem("userMode")
      if (savedMode) {
        setUserMode(savedMode as "child" | "parent")
      }

      setIsReady(true)
    } catch (error) {
      console.error("App initialization failed:", error)
      setIsReady(true)
    }
  }

  if (!isReady) {
    return null // Add splash screen component here
  }

  return (
    <SafeAreaProvider>
      <OfflineProvider>
        <DataProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userMode ? (
                  <Stack.Screen name="Auth" component={AuthScreen} />
                ) : userMode === "child" ? (
                  <Stack.Screen name="Child" component={ChildNavigator} />
                ) : (
                  <Stack.Screen name="Parent" component={ParentNavigator} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </DataProvider>
      </OfflineProvider>
    </SafeAreaProvider>
  )
}
