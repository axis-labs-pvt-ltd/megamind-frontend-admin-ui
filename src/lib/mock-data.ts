import { Category, Question, Student, Subject, Tag, Test, TestAttempt } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Fundamentals', color: '#3b82f6' },
  { id: '2', name: 'Advanced', color: '#8b5cf6' },
  { id: '3', name: 'Practical', color: '#10b981' },
  { id: '4', name: 'Theory', color: '#f59e0b' },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'Problem Solving', color: '#ef4444' },
  { id: '2', name: 'Critical Thinking', color: '#06b6d4' },
  { id: '3', name: 'Analysis', color: '#84cc16' },
  { id: '4', name: 'Application', color: '#f97316' },
];

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Advanced mathematical concepts and problem solving',
    coverImage: 'https://images.pexels.com/photos/6256/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=800',
    color: '#3b82f6',
    modules: [
      { 
        id: '1', 
        name: 'Algebra', 
        description: 'Linear and quadratic equations', 
        subjectId: '1',
        coverImage: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '2', 
        name: 'Calculus', 
        description: 'Derivatives and integrals', 
        subjectId: '1',
        coverImage: 'https://images.pexels.com/photos/6238/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '3', 
        name: 'Statistics', 
        description: 'Probability and data analysis', 
        subjectId: '1',
        coverImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
    ]
  },
  {
    id: '2',
    name: 'Physics',
    description: 'Fundamental principles of physics',
    coverImage: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#8b5cf6',
    modules: [
      { 
        id: '4', 
        name: 'Mechanics', 
        description: 'Motion and forces', 
        subjectId: '2',
        coverImage: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '5', 
        name: 'Thermodynamics', 
        description: 'Heat and energy', 
        subjectId: '2',
        coverImage: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '6', 
        name: 'Electromagnetism', 
        description: 'Electric and magnetic fields', 
        subjectId: '2',
        coverImage: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
    ]
  },
  {
    id: '3',
    name: 'Computer Science',
    description: 'Programming and algorithmic thinking',
    coverImage: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#10b981',
    modules: [
      { 
        id: '7', 
        name: 'Data Structures', 
        description: 'Arrays, trees, and graphs', 
        subjectId: '3',
        coverImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '8', 
        name: 'Algorithms', 
        description: 'Sorting and searching', 
        subjectId: '3',
        coverImage: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
      { 
        id: '9', 
        name: 'Web Development', 
        description: 'HTML, CSS, and JavaScript', 
        subjectId: '3',
        coverImage: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
      },
    ]
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    text: 'What is the derivative of x²?',
    options: ['2x', 'x²', '2x²', 'x'],
    correctAnswer: '2x',
    solutionVideoUrl: 'https://example.com/video1',
    moduleId: '2',
    categories: [mockCategories[0]],
    tags: [mockTags[0]],
    difficulty: 'medium',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'yes-no',
    text: 'Is the speed of light constant in a vacuum?',
    correctAnswer: 'Yes',
    solutionVideoUrl: 'https://example.com/video2',
    moduleId: '6',
    categories: [mockCategories[1]],
    tags: [mockTags[1]],
    difficulty: 'easy',
    createdAt: new Date('2024-01-16')
  },
  {
    id: '3',
    type: 'drag-drop',
    text: 'Arrange the following data structures in order of average search time complexity (fastest to slowest):',
    options: ['Hash Table', 'Binary Search Tree', 'Linked List', 'Array'],
    correctAnswer: ['Hash Table', 'Binary Search Tree', 'Array', 'Linked List'],
    solutionVideoUrl: 'https://example.com/video3',
    moduleId: '7',
    categories: [mockCategories[2]],
    tags: [mockTags[2]],
    difficulty: 'hard',
    createdAt: new Date('2024-01-17')
  },
  {
    id: '4',
    type: 'mcq',
    text: 'What is the time complexity of binary search?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 'O(log n)',
    solutionVideoUrl: 'https://example.com/video4',
    moduleId: '8',
    categories: [mockCategories[0]],
    tags: [mockTags[0]],
    difficulty: 'medium',
    createdAt: new Date('2024-01-18')
  },
  {
    id: '5',
    type: 'mcq',
    text: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: '<a>',
    solutionVideoUrl: 'https://example.com/video5',
    moduleId: '9',
    categories: [mockCategories[0]],
    tags: [mockTags[3]],
    difficulty: 'easy',
    createdAt: new Date('2024-01-19')
  }
];

export const mockTests: Test[] = [
  {
    id: '1',
    title: 'Calculus Midterm',
    description: 'Comprehensive test covering derivatives and integrals',
    type: 'static',
    questionIds: ['1', '3'],
    timeLimit: 60,
    passingScore: 70,
    isActive: true,
    createdAt: new Date('2024-01-20'),
    coverImage: 'https://images.pexels.com/photos/6238/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=800',
    estimatedDuration: 45,
    tags: ['calculus', 'mathematics', 'derivatives']
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    description: 'Basic physics concepts and principles',
    type: 'dynamic',
    rules: [
      { moduleId: '4', questionCount: 5, difficulty: 'easy' },
      { moduleId: '6', questionCount: 3, difficulty: 'medium' }
    ],
    timeLimit: 45,
    passingScore: 75,
    isActive: true,
    createdAt: new Date('2024-01-21'),
    coverImage: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    estimatedDuration: 35,
    tags: ['physics', 'mechanics', 'fundamentals']
  },
  {
    id: '3',
    title: 'Computer Science Basics',
    description: 'Fundamental concepts in programming and algorithms',
    type: 'static',
    questionIds: ['3', '4', '5'],
    timeLimit: 30,
    passingScore: 80,
    isActive: true,
    createdAt: new Date('2024-01-22'),
    coverImage: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    estimatedDuration: 25,
    tags: ['programming', 'algorithms', 'computer-science']
  }
];

export const mockStudent: Student = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
  joinedAt: new Date('2024-01-01')
};

export const mockTestAttempts: TestAttempt[] = [
  {
    id: '1',
    testId: '1',
    studentId: '1',
    answers: { '1': '2x' },
    score: 100,
    timeSpent: 45,
    completedAt: new Date('2024-01-23'),
    questions: [mockQuestions[0]]
  },
  {
    id: '2',
    testId: '3',
    studentId: '1',
    answers: { '3': ['Hash Table', 'Binary Search Tree', 'Array', 'Linked List'], '4': 'O(log n)', '5': '<a>' },
    score: 100,
    timeSpent: 25,
    completedAt: new Date('2024-01-24'),
    questions: [mockQuestions[2], mockQuestions[3], mockQuestions[4]]
  },
  {
    id: '3',
    testId: '2',
    studentId: '1',
    answers: { '2': 'Yes' },
    score: 100,
    timeSpent: 30,
    completedAt: new Date('2024-01-25'),
    questions: [mockQuestions[1]]
  }
];
