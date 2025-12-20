'use client';

import { QuestionFilters } from '@/components/features/questions/QuestionFilters';
import { QuestionForm } from '@/components/features/questions/QuestionForm';
import { QuestionList } from '@/components/features/questions/QuestionList';
import { Button } from '@/components/ui/button';
import { mockQuestions } from '@/lib/mock-data';
import { Question } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'yes-no' | 'drag-drop'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || question.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleCreateQuestion = (formData: any) => {
    console.log('Creating question:', formData);
    setShowCreateForm(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowCreateForm(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    console.log('Delete question:', questionId);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingQuestion(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Question Bank</h2>
          <p className="text-[var(--text-secondary)]">Manage your collection of questions</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </div>

      {/* Create/Edit Question Form */}
      {showCreateForm && (
        <QuestionForm
          editingQuestion={editingQuestion}
          onSubmit={handleCreateQuestion}
          onCancel={handleCancelForm}
        />
      )}

      {/* Filters */}
      <QuestionFilters
        searchTerm={searchTerm}
        selectedType={selectedType}
        selectedDifficulty={selectedDifficulty}
        onSearchChange={setSearchTerm}
        onTypeChange={setSelectedType}
        onDifficultyChange={setSelectedDifficulty}
      />

      {/* Question List */}
      <QuestionList
        questions={filteredQuestions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
        onCreateNew={() => setShowCreateForm(true)}
      />
    </div>
  );
}
