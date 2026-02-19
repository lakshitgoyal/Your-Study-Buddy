import type { GenerateQuizOutput } from "@/ai/flows/generate-quiz";
import type { GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards-flow";

export type StudyMode = "explain" | "summarize" | "quiz" | "flashcards";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string | GenerateQuizOutput | GenerateFlashcardsOutput;
  type?: "quiz" | "flashcards";
};

export type QuizQuestion = GenerateQuizOutput[0];
export type Flashcard = GenerateFlashcardsOutput[0];
