"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { useData } from "../../contexts/DataContext"
import type { Task } from "../../types"

const { width } = Dimensions.get("window")

export default function HomeScreen() {
  const navigation = useNavigation()
  const { getCurrentTasks, getUserProgress } = useData()
  const [currentTasks, setCurrentTasks] = useState<Task[]>([])
  const [progress, setProgress] = useState({ level: 1, points: 0, streak: 0 })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const tasks = await getCurrentTasks()
    const userProgress = await getUserProgress()
    setCurrentTasks(tasks)
    setProgress(userProgress)
  }

  const startTask = (task: Task) => {
    navigation.navigate("Camera", { task })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello! Ready to learn?</Text>
          <View style={styles.progressContainer}>
            <View style={styles.levelBadge}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.levelText}>Level {progress.level}</Text>
            </View>
            <Text style={styles.pointsText}>{progress.points} points</Text>
          </View>
        </View>

        {/* Current Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Adventures</Text>
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => startTask(task)}>
                <View style={styles.taskIcon}>
                  <Ionicons name="camera" size={30} color="#007AFF" />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noTasksContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.noTasksText}>All done for today!</Text>
              <Text style={styles.noTasksSubtext}>Great job! Check back tomorrow for new adventures.</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate("Camera")}>
              <Ionicons name="camera" size={40} color="#007AFF" />
              <Text style={styles.quickActionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate("Voice")}>
              <Ionicons name="mic" size={40} color="#FF6B6B" />
              <Text style={styles.quickActionText}>Record Voice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate("Writing")}>
              <Ionicons name="create" size={40} color="#4ECDC4" />
              <Text style={styles.quickActionText}>Write Story</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8DC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
    color: "#333",
  },
  pointsText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
  },
  noTasksContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 15,
  },
  noTasksText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 15,
  },
  noTasksSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  quickActionButton: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: (width - 80) / 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
})
