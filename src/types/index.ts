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
  imageUrl?: string;
  options?: QuestionOption[];
  matchingPairs?: MatchingPair[];
  correctAnswer: string | string[] | MatchingPair[];
  acceptableAnswers?: string[];
  solutionVideoUrl?: string;
  solutionText?: string;
  referenceVideoUrl?: string;
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

// ── Flashcard types ──────────────────────────────────────────────────────────

export type FlashCardType = 'text' | 'image' | 'video';

export interface FlashCard {
  id: string;
  collectionId: string;
  type: FlashCardType;
  front: string;
  back: string;
  imageUrl?: string;
  videoUrl?: string;
  order: number;
  tags: string[];
  createdAt: Date;
}

export type FlashCardVisibility = 'public_free' | 'paid' | 'private';

export interface FlashCardCollection {
  id: string;
  title: string;
  description: string;
  subjectId?: string;
  subjectName?: string;
  level: string;
  coverEmoji: string;
  coverColor: string;
  tutorId: string;
  tutorName: string;
  price: number;
  visibility: FlashCardVisibility;
  cardCount: number;
  tags: string[];
  rating?: number;
  soldCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface FlashCardPurchase {
  id: string;
  studentId: string;
  collectionId: string;
  price: number;
  purchasedAt: Date;
  collection?: FlashCardCollection;
}
