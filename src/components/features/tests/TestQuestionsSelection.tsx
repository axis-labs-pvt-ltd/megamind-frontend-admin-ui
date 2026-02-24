// components/features/tests/TestQuestionsSelection.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { fetchQuestions } from '@/services/api/quections';
import { CreateTestValues } from '@/lib/validations/test';
import { Question } from '@/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

interface TestQuestionsSelectionProps {
  selectedQuestions: string[];
  setValue: UseFormSetValue<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestQuestionsSelection({ selectedQuestions, setValue, errors }: TestQuestionsSelectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleQuestion = (questionId: string) => {
    const updated = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter(id => id !== questionId)
      : [...selectedQuestions, questionId];
    setValue('questions', updated, { shouldValidate: true });
  };

  const selectAll = () => setValue('questions', filtered.map(q => q.id), { shouldValidate: true });
  const clearAll = () => setValue('questions', [], { shouldValidate: true });

  const filtered = questions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || q.type === filterType;
    const matchDiff = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchSearch && matchType && matchDiff;
  });

  const questionTypes = ['all', ...Array.from(new Set(questions.map(q => q.type)))];

  return (
    <Card className="p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Select Questions</h3>
        <Badge variant="primary" size="md">{selectedQuestions.length} selected</Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="search"
          placeholder="Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
        >
          {questionTypes.map(t => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : t.toUpperCase()}</option>
          ))}
        </select>
        <select
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          className="px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
        >
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <option key={d} value={d}>{d === 'all' ? 'All Difficulties' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <button
          type="button"
          onClick={selectAll}
          className="text-[var(--accent-blue)] hover:underline"
        >
          Select all ({filtered.length})
        </button>
        <span className="text-[var(--text-secondary)]">·</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-[var(--text-secondary)] hover:underline"
        >
          Clear all
        </button>
        <span className="ml-auto text-[var(--text-secondary)]">
          {filtered.length} question{filtered.length !== 1 ? 's' : ''} shown
        </span>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-blue)] mr-2" />
          <span className="text-[var(--text-secondary)] text-sm">Loading questions...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-[var(--text-secondary)] text-sm">No questions match your filters.</div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((question) => {
            const isSelected = selectedQuestions.includes(question.id);
            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                }`}
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Checkbox */}
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                      : 'border-[var(--border-primary)]'
                  }`}>
                    {isSelected && <span className="text-white text-xs">✓</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] text-sm leading-snug line-clamp-2">
                      {question.text}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" size="sm">{question.type.toUpperCase()}</Badge>
                      <Badge variant="warning" size="sm">{question.difficulty}</Badge>
                      {question.moduleId && (
                        <span className="text-xs text-[var(--text-secondary)]">Module: {question.moduleId}</span>
                      )}
                    </div>
                  </div>

                  {isSelected && <Badge variant="success" size="sm" className="flex-shrink-0">Selected</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errors.questions && (
        <p className="text-sm text-[var(--accent-red)] mt-4 text-center">Please select at least one question.</p>
      )}
    </Card>
  );
}