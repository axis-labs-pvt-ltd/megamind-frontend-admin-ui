import {
    BarChart3,
    BookOpen,
    FileText,
    HelpCircle,
    Home,
    Image,
    Languages,
    Layers,
    PlusCircle,
    Settings,
    Users,
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
  { name: 'Dashboard',         page: '/admin/dashboard',     icon: Home,       description: 'Overview & stats',        roles: ['admin', 'teacher'] },
  { name: 'Tests',             page: '/admin/tests',          icon: FileText,   description: 'Manage tests',            roles: ['admin', 'teacher'] },
  { name: 'Create Test',       page: '/admin/tests/create',   icon: PlusCircle, description: 'Build new tests',         roles: ['admin', 'teacher'] },
  { name: 'Question Bank',     page: '/admin/questions',      icon: HelpCircle, description: 'Manage questions',        roles: ['admin', 'teacher'] },
  { name: 'Flashcards',          page: '/admin/flashcards',     icon: Layers,     description: 'Manage flashcard decks',  roles: ['admin', 'teacher'] },
  { name: 'Hero Slides',         page: '/admin/hero-slides',    icon: Image,      description: 'Landing page slider',     roles: ['admin'] },
  { name: 'Translations',        page: '/admin/translations',   icon: Languages,  description: 'EN / Sinhala copy',       roles: ['admin'] },
  { name: 'Subject Management',page: '/admin/subjects',       icon: BookOpen,   description: 'Organise curriculum',     roles: ['admin'] },
  { name: 'Users',             page: '/admin/users',          icon: Users,      description: 'Manage accounts & roles', roles: ['admin'] },
  { name: 'Analytics',         page: '/admin/analytics',      icon: BarChart3,  description: 'Performance insights',    roles: ['admin'] },
  { name: 'Settings',          page: '/admin/settings',       icon: Settings,   description: 'Account settings',        roles: ['admin'] },
];
