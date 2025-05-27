import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Timer = ({ onTimeUp }) => {
  const [timer, setTimer] = useState(300); // 5 minutes
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }

        // Pulse animation when time is running low
        if (prev <= 60) {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        }

        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Animated.View
      style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}
    >
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.timerGradient}
      >
        <Text style={styles.timer}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
        <MaterialIcons
          name="timer"
          size={24}
          color="#fff"
          style={styles.timerIcon}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const QuizApp = () => {
  const [quizData, setQuizData] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(width));

  // Fetch quiz data
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&category=17&difficulty=hard&type=multiple"
        );
        const data = await response.json();
        setQuizData(data.results);
        shuffleAnswers(data.results[0]);

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Slide in animation for questions
  useEffect(() => {
    if (quizData) {
      slideAnim.setValue(width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [quizIndex]);

  const shuffleAnswers = (question) => {
    const allAnswers = [question.correct_answer, ...question.incorrect_answers];
    setAnswers(allAnswers.sort(() => Math.random() - 0.5));
  };

  const checkAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === quizData[quizIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (quizIndex < quizData.length - 1) {
      const newIndex = quizIndex + 1;
      setQuizIndex(newIndex);
      shuffleAnswers(quizData[newIndex]);
      setSelectedAnswer("");
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer("");
    shuffleAnswers(quizData[0]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={50} color="#EF4444" />
        <Text style={styles.errorText}>Error loading quiz data</Text>
        <Text style={styles.errorSubText}>
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1E3A8A", "#1E40AF", "#1D4ED8"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!quizFinished && <Timer onTimeUp={() => setQuizFinished(true)} />}

        {quizFinished ? (
          <Animated.View style={[styles.result, { opacity: fadeAnim }]}>
            <View style={styles.trophyContainer}>
              <MaterialIcons name="emoji-events" size={80} color="#FBBF24" />
            </View>
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <Text style={styles.scoreText}>
              Your Score: {score} / {quizData.length}
            </Text>
            <Text style={styles.resultMessage}>
              {score === quizData.length
                ? "Perfect! You're a genius!"
                : score >= quizData.length * 0.7
                ? "Great job! You know your stuff!"
                : "Keep practicing!"}
            </Text>
            <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}>
              <LinearGradient
                colors={["#F59E0B", "#EF4444"]}
                style={styles.gradientButton}
              >
                <Text style={styles.restartText}>Restart Quiz</Text>
                <MaterialIcons name="replay" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          quizData && (
            <Animated.View
              style={[
                styles.quizCard,
                { transform: [{ translateX: slideAnim }], opacity: fadeAnim },
              ]}
            >
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${((quizIndex + 1) / quizData.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.questionCount}>
                  Question {quizIndex + 1} of {quizData.length}
                </Text>
              </View>

              <Text style={styles.question}>
                {quizData[quizIndex].question.replace(/&quot;|&#039;/g, "'")}
              </Text>

              {answers.map((itm, indx) => (
                <TouchableOpacity
                  key={indx}
                  style={[
                    styles.answerBtn,
                    selectedAnswer === itm && {
                      backgroundColor:
                        itm === quizData[quizIndex].correct_answer
                          ? "#10B981"
                          : "#EF4444",
                    },
                  ]}
                  onPress={() => checkAnswer(itm)}
                  disabled={selectedAnswer !== ""}
                >
                  <Text style={styles.answerText}>{itm}</Text>
                  {selectedAnswer === itm && (
                    <MaterialIcons
                      name={
                        itm === quizData[quizIndex].correct_answer
                          ? "check-circle"
                          : "cancel"
                      }
                      size={24}
                      color="white"
                      style={styles.answerIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  !selectedAnswer && {
                    backgroundColor: "#64748B",
                    opacity: 0.6,
                  },
                ]}
                onPress={next}
                disabled={!selectedAnswer}
              >
                <LinearGradient
                  colors={["#4F46E5", "#7C3AED"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.nextText}>
                    {quizIndex < quizData.length - 1
                      ? "Next Question"
                      : "See Results"}
                  </Text>
                  <MaterialIcons
                    name={
                      quizIndex < quizData.length - 1 ? "arrow-forward" : "star"
                    }
                    size={24}
                    color="white"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 24,
    marginTop: 20,
  },
  errorSubText: {
    color: "#E5E7EB",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  timerContainer: {
    alignSelf: "center",
    marginBottom: 30,
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  timerGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  timer: {
    fontSize: 24,
    color: "white",
  },
  timerIcon: {
    marginLeft: 10,
  },
  quizCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 25,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 4,
  },
  questionCount: {
    fontSize: 16,
    color: "#E5E7EB",
  },
  question: {
    fontSize: 22,
    color: "white",
    marginBottom: 30,
    lineHeight: 32,
  },
  answerBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answerText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  answerIcon: {
    marginLeft: 10,
  },
  nextBtn: {
    borderRadius: 12,
    marginTop: 30,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
  result: {
    alignItems: "center",
    paddingTop: 50,
  },
  trophyContainer: {
    backgroundColor: "#FBBF24",
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: "#FBBF24",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  resultTitle: {
    fontSize: 28,
    color: "white",
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 22,
    color: "#FBBF24",
    marginBottom: 15,
  },
  resultMessage: {
    fontSize: 18,
    color: "white",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  restartBtn: {
    borderRadius: 30,
    overflow: "hidden",
  },
  restartText: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
});

export default QuizApp;
