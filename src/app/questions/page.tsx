'use client';

import { QuestionFilters } from '@/components/features/questions/QuestionFilters';
import { QuestionForm } from '@/components/features/questions/QuestionForm';
import { QuestionList } from '@/components/features/questions/QuestionList';
import { Button } from '@/components/ui/button';
import { mockQuestions } from '@/lib/mock-data';
import { Plus } from 'lucide-react';
import { useQuestionFilters } from './hooks/useQuestionFilters';
import { useQuestionHandlers } from './hooks/useQuestionHandlers';

export default function QuestionsPage() {
  const {
    searchTerm,
    selectedType,
    selectedDifficulty,
    filteredQuestions,
    setSearchTerm,
    setSelectedType,
    setSelectedDifficulty,
  } = useQuestionFilters(mockQuestions);

  const {
    showCreateForm,
    editingQuestion,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleCancelForm,
    handleOpenCreateForm,
  } = useQuestionHandlers();

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
          onClick={handleOpenCreateForm}
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
        onCreateNew={handleOpenCreateForm}
      />
    </div>
  );
}
