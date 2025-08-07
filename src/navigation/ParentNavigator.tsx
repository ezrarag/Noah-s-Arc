import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import DashboardScreen from "../screens/parent/DashboardScreen"
import TaskManagementScreen from "../screens/parent/TaskManagementScreen"
import ProgressReportScreen from "../screens/parent/ProgressReportScreen"
import SettingsScreen from "../screens/parent/SettingsScreen"

const Tab = createBottomTabNavigator()

export default function ParentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Dashboard") {
            iconName = focused ? "analytics" : "analytics-outline"
          } else if (route.name === "Tasks") {
            iconName = focused ? "create" : "create-outline"
          } else if (route.name === "Reports") {
            iconName = focused ? "bar-chart" : "bar-chart-outline"
          } else {
            iconName = focused ? "settings" : "settings-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#f8f9fa",
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Tasks" component={TaskManagementScreen} />
      <Tab.Screen name="Reports" component={ProgressReportScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
