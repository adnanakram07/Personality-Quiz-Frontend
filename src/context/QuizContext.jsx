"use client";
import { createContext, useContext, useState } from "react";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    age: "",
    email: "",
  });

  const [answers, setAnswers] = useState([]); // optionIds
  const [result, setResult] = useState(null);

  return (
    <QuizContext.Provider
      value={{
        user,
        setUser,
        answers,
        setAnswers,
        result,
        setResult,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
