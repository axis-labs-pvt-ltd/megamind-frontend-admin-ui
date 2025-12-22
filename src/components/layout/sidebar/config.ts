import {
    BarChart3,
    BookOpen,
    FileText,
    HelpCircle,
    Home,
    PlusCircle,
    Settings,
} from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', page: '/dashboard', icon: Home, description: 'Overview & stats' },
  { name: 'Available Tests', page: '/tests', icon: FileText, description: 'Browse tests' },
  { name: 'Subject Management', page: '/subjects', icon: BookOpen, description: 'Organize curriculum' },
  { name: 'Question Bank', page: '/questions', icon: HelpCircle, description: 'Manage questions' },
  { name: 'Create Test', page: '/tests/create', icon: PlusCircle, description: 'Build new tests' },
  { name: 'Analytics', page: '/analytics', icon: BarChart3, description: 'Performance insights' },
  { name: 'Settings', page: '/settings', icon: Settings, description: 'Account settings' },
];
