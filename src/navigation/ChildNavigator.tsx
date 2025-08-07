import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

import HomeScreen from "../screens/child/HomeScreen"
import TaskScreen from "../screens/child/TaskScreen"
import CameraScreen from "../screens/child/CameraScreen"
import VoiceScreen from "../screens/child/VoiceScreen"
import WritingScreen from "../screens/child/WritingScreen"
import ProgressScreen from "../screens/child/ProgressScreen"
import SettingsScreen from "../screens/child/SettingsScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Tasks") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "Progress") {
            iconName = focused ? "trophy" : "trophy-outline"
          } else {
            iconName = focused ? "settings" : "settings-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default function ChildNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Voice" component={VoiceScreen} />
      <Stack.Screen name="Writing" component={WritingScreen} />
    </Stack.Navigator>
  )
}
