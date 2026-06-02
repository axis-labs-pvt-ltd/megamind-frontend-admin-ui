import { mockSubjects } from '@/lib/mock-data';
import { BookOpen } from 'lucide-react';

interface SubjectFilterProps {
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
}

export function SubjectFilter({ selectedSubject, setSelectedSubject }: SubjectFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Subject
      </label>
      <select
        className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="all">All Subjects</option>
        {mockSubjects.map(subject => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  );
}
