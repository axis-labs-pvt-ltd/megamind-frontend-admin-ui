import {
    BarChart3,
    BookOpen,
    FileText,
    HelpCircle,
    Home,
    PlusCircle,
    Settings,
} from 'lucide-react';

export type NavRole = 'admin' | 'teacher';

export interface NavItem {
  name: string;
  page: string;
  icon: typeof Home;
  description: string;
  roles: NavRole[];   // which roles can see this item
}

export const navigation: NavItem[] = [
  { name: 'Dashboard',         page: '/dashboard',     icon: Home,       description: 'Overview & stats',       roles: ['admin', 'teacher'] },
  { name: 'Tests',             page: '/tests',          icon: FileText,   description: 'Manage tests',           roles: ['admin', 'teacher'] },
  { name: 'Create Test',       page: '/tests/create',   icon: PlusCircle, description: 'Build new tests',        roles: ['admin', 'teacher'] },
  { name: 'Question Bank',     page: '/questions',      icon: HelpCircle, description: 'Manage questions',       roles: ['admin', 'teacher'] },
  { name: 'Subject Management',page: '/subjects',       icon: BookOpen,   description: 'Organise curriculum',    roles: ['admin'] },
  { name: 'Analytics',         page: '/analytics',      icon: BarChart3,  description: 'Performance insights',   roles: ['admin'] },
  { name: 'Settings',          page: '/settings',       icon: Settings,   description: 'Account settings',       roles: ['admin'] },
];
