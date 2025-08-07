"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from "react-native"
import { Camera, CameraType } from "expo-camera"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import * as MediaLibrary from "expo-media-library"
import { useNavigation, useRoute } from "@react-navigation/native"

import { useData } from "../../contexts/DataContext"
import type { Task } from "../../types"

const { width, height } = Dimensions.get("window")

export default function CameraScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { saveTaskProgress } = useData()

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [type, setType] = useState(CameraType.back)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const cameraRef = useRef<Camera>(null)
  const task = route.params?.task as Task

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    })()
  }, [])

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true)
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        })

        // Save to device
        const asset = await MediaLibrary.createAssetAsync(photo.uri)
        setCapturedImage(photo.uri)

        // Process with AI/ML for object detection (placeholder)
        await processImage(photo.uri)
      } catch (error) {
        console.error("Error taking picture:", error)
        Alert.alert("Error", "Failed to take picture. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const processImage = async (imageUri: string) => {
    // Placeholder for image processing/object detection
    // In a real app, you'd use TensorFlow Lite or similar
    console.log("Processing image:", imageUri)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock detection result
    const detectedObjects = ["water", "bottle", "liquid"]

    if (task && detectedObjects.some((obj) => task.targetObject.toLowerCase().includes(obj.toLowerCase()))) {
      // Success! Move to voice recording
      navigation.navigate("Voice", {
        task,
        imageUri,
        success: true,
      })
    } else {
      // Encourage to try again
      Alert.alert("Keep Looking!", `I see something interesting, but can you find ${task?.targetObject}?`, [
        { text: "Try Again", onPress: () => setCapturedImage(null) },
        { text: "Continue Anyway", onPress: () => navigation.navigate("Voice", { task, imageUri, success: false }) },
      ])
    }
  }

  const retakePicture = () => {
    setCapturedImage(null)
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Photo Taken!</Text>
          <View style={{ width: 24 }} />
        </View>

        <Image source={{ uri: capturedImage }} style={styles.previewImage} />

        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>Looking at your photo...</Text>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{task ? `Find: ${task.targetObject}` : "Take a Photo"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          {task && (
            <View style={styles.taskPrompt}>
              <Text style={styles.taskPromptText}>Look for: {task.targetObject}</Text>
            </View>
          )}

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back)
              }}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isProcessing}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={{ width: 60 }} />
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  taskPrompt: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    margin: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  taskPromptText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
  },
  previewImage: {
    flex: 1,
    width: width,
    resizeMode: "contain",
  },
  processingContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  processingText: {
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  permissionText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
})
