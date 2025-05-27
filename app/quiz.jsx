import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

const Timer = ({ onTimeUp }) => {
  const [timer, setTimer] = useState(300); // 5 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <Text style={styles.timer}>
      Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&category=17&difficulty=hard&type=multiple"
        );
        const data = await response.json();
        setQuizData(data.results);
        shuffleAnswers(data.results[0]);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

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

  if (loading)
    return (
      <ActivityIndicator size="large" color="#facc15" style={styles.loading} />
    );
  if (error)
    return <Text style={styles.error}>Error occurred while loading quiz.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!quizFinished && <Timer onTimeUp={() => setQuizFinished(true)} />}

      {quizFinished ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.scoreText}>
            Your Score: {score} / {quizData.length}
          </Text>
          <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}>
            <Text style={styles.restartText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        quizData && (
          <View style={styles.quizCard}>
            <Text style={styles.questionCount}>
              Question {quizIndex + 1} of {quizData.length}
            </Text>
            <Text style={styles.question}>
              Q: {quizData[quizIndex].question.replace(/&quot;|&#039;/g, "'")}
            </Text>
            {answers.map((itm, indx) => (
              <TouchableOpacity
                key={indx}
                style={[
                  styles.answerBtn,
                  selectedAnswer === itm && styles.selected,
                ]}
                onPress={() => checkAnswer(itm)}
                disabled={selectedAnswer !== ""}
              >
                <Text style={styles.answerText}>{itm}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.nextBtn,
                !selectedAnswer && { backgroundColor: "#4b5563" },
              ]}
              onPress={next}
              disabled={!selectedAnswer}
            >
              <Text style={styles.nextText}>
                {quizIndex < quizData.length - 1 ? "Next" : "Finish"}
              </Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 60,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  error: {
    color: "#ef4444",
    fontSize: 18,
    textAlign: "center",
    marginTop: 200,
  },
  timer: {
    fontSize: 22,
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  quizCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
    elevation: 3,
  },
  questionCount: {
    fontSize: 16,
    color: "#f1f5f9",
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    color: "#f8fafc",
    marginBottom: 20,
  },
  answerBtn: {
    backgroundColor: "#334155",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
  },
  selected: {
    backgroundColor: "#2563eb",
  },
  answerText: {
    color: "#f8fafc",
    fontSize: 16,
    textAlign: "center",
  },
  nextBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: "center",
  },
  nextText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  result: {
    alignItems: "center",
    marginTop: 80,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#facc15",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    color: "#f8fafc",
    marginBottom: 20,
  },
  restartBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  restartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuizApp;