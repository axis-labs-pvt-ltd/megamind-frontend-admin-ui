// Core Types
export interface Subject {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  coverImage?: string;
  color?: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type QuestionType = 'mcq' | 'yes-no' | 'drag-drop' | 'fill-in-blank' | 'multi-select' | 'matching' | 'true-false' | 'text';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
    altText?: string;
  };
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[]; // Refactored from string[] to object array
  matchingPairs?: MatchingPair[];
  correctAnswer: string | string[] | MatchingPair[]; // For MCQ/Multi-select, this will contain Option IDs
  acceptableAnswers?: string[]; // For fill-in-blank alternative answers
  solutionVideoUrl?: string; // Video shown AFTER submission (explanation)
  referenceVideoUrl?: string; // Video shown DURING exam (context)
  moduleId: string;
  categories: Category[];
  tags: Tag[];
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export interface StaticTest {
  id: string;
  title: string;
  description: string;
  type: 'static';
  questionIds: string[];
  timeLimit: number; // in minutes
  passingScore: number;
  isActive: boolean;
  createdAt: Date;
  coverImage?: string;
  estimatedDuration?: number;
  tags?: string[];
  subjectId?: string;
}

export interface DynamicTestRule {
  moduleId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

export interface DynamicTest {
  id: string;
  title: string;
  description: string;
  type: 'dynamic';
  rules: DynamicTestRule[];
  timeLimit: number;
  passingScore: number;
  isActive: boolean;
  createdAt: Date;
  coverImage?: string;
  estimatedDuration?: number;
  tags?: string[];
  subjectId?: string;
}

export type Test = StaticTest | DynamicTest;

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, string | string[]>;
  score: number;
  timeSpent: number;
  completedAt: Date;
  questions: Question[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
}

export interface TestSession {
  id: string;
  testId: string;
  studentId: string;
  questions: Question[];
  startTime: Date;
  timeLimit: number;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  isCompleted: boolean;
}

export interface Purchase {
  id: string;
  studentId: string;
  testId: string;
  price: number;
  purchasedAt: Date;
  test?: Test;
}

export interface TestHistory {
  id: string;
  testId: string;
  testTitle: string;
  passingScore: number;
  score: number;
  passed: boolean;
  timeSpent: number;
  completedAt: Date;
  correctAnswers: number;
  totalQuestions: number;
}
