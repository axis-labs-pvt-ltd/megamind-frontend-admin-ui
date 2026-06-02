'use client';

import { cn } from '@/lib/utils';
import { GraduationCap, Presentation } from 'lucide-react';

export type UserRole = 'student' | 'instructor';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('student')}
        className={cn(
          "flex flex-col items-center justify-center p-6 space-y-3 h-40 text-center transition-all border rounded-lg bg-[var(--bg-card)]",
          selectedRole === 'student'
            ? 'ring-2 ring-[var(--accent-blue)] ring-offset-2 ring-offset-[var(--bg-primary)] border-[var(--accent-blue)]'
            : 'border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]'
        )}
      >
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          selectedRole === 'student' ? "bg-[var(--accent-blue)] text-white" : "bg-[var(--bg-secondary)] text-[var(--accent-blue)]"
        )}>
          <GraduationCap className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--text-primary)]">Student</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Access courses & take tests
          </p>
        </div>
      </button>

      <button
        onClick={() => onSelect('instructor')}
        className={cn(
          "flex flex-col items-center justify-center p-6 space-y-3 h-40 text-center transition-all border rounded-lg bg-[var(--bg-card)]",
          selectedRole === 'instructor'
            ? 'ring-2 ring-[var(--accent-purple)] ring-offset-2 ring-offset-[var(--bg-primary)] border-[var(--accent-purple)]'
            : 'border-[var(--border-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]'
        )}
      >
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          selectedRole === 'instructor' ? "bg-[var(--accent-purple)] text-white" : "bg-[var(--bg-secondary)] text-[var(--accent-purple)]"
        )}>
          <Presentation className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--text-primary)]">Instructor</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Manage tests & students
          </p>
        </div>
      </button>
    </div>
  );
}
