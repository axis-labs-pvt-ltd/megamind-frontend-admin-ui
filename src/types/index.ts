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

export interface Question {
  id: string;
  type: 'mcq' | 'yes-no' | 'drag-drop';
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  solutionVideoUrl?: string;
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
