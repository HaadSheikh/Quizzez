import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import image from '../assets/images/3290981.webp'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />

     <Image
  animation="bounceIn"
  duration={1500}
  source={image}
  style={styles.image}
  resizeMode="contain"
/>

      <Animatable.Text animation="fadeInDown" delay={300} style={styles.title}>
        Welcome to the Quiz App
      </Animatable.Text>

      <Animatable.Text animation="fadeInDown" delay={600} style={styles.subtitle}>
        Test your knowledge and challenge yourself!
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={700} style={styles.instructions}>
        <Text style={styles.instructionTitle}>📋 Quiz Instructions:</Text>
        <Text style={styles.instructionText}>• You have 5 minutes to complete the quiz.</Text>
        <Text style={styles.instructionText}>• Total: 10 questions.</Text>
        <Text style={styles.instructionText}>• You can select only once per question.</Text>
        <Text style={styles.instructionText}>• No going back after answering.</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={900}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/quiz")}
        >
          <Icon
            name="play-circle"
            size={24}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 20,
  },
  instructions: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  instructionTitle: {
    color: "#facc15",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  instructionText: {
    color: "#e2e8f0",
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
