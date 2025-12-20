// Client Component - Question filtering controls

'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

interface QuestionFiltersProps {
  searchTerm: string;
  selectedType: 'all' | 'mcq' | 'yes-no' | 'drag-drop';
  selectedDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  onSearchChange: (value: string) => void;
  onTypeChange: (type: 'all' | 'mcq' | 'yes-no' | 'drag-drop') => void;
  onDifficultyChange: (difficulty: 'all' | 'easy' | 'medium' | 'hard') => void;
}

export function QuestionFilters({
  searchTerm,
  selectedType,
  selectedDifficulty,
  onSearchChange,
  onTypeChange,
  onDifficultyChange
}: QuestionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="search"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <Filter className="h-4 w-4 text-[var(--icon-muted)]" />
        <span className="text-sm text-[var(--text-secondary)]">Type:</span>
        <div className="flex space-x-2">
          {(['all', 'mcq', 'yes-no', 'drag-drop'] as const).map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? 'primary' : 'secondary'}
              className="cursor-pointer"
              onClick={() => onTypeChange(type)}
            >
              {type === 'all' ? 'All' : type.toUpperCase().replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-[var(--text-secondary)]">Difficulty:</span>
        <div className="flex space-x-2">
          {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
            <Badge
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
              className="cursor-pointer"
              onClick={() => onDifficultyChange(difficulty)}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
