'use client';

import { QuestionCard } from '@/components/features/questions/QuestionCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockQuestions, mockSubjects } from '@/lib/mock-data';
import { Question } from '@/types';
import { Edit, Filter, Plus, Search, Trash2, Video } from 'lucide-react';
import { useState } from 'react';

export default function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'yes-no' | 'drag-drop'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state
  const [questionForm, setQuestionForm] = useState({
    type: 'mcq' as 'mcq' | 'yes-no' | 'drag-drop',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    solutionVideoUrl: '',
    moduleId: '',
    categoryIds: [] as string[],
    tagIds: [] as string[],
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || question.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleCreateQuestion = () => {
    // Create question logic here
    console.log('Creating question:', questionForm);
    setShowCreateForm(false);
    resetForm();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      type: question.type,
      text: question.text,
      options: question.options || ['', '', '', ''],
      correctAnswer: Array.isArray(question.correctAnswer) ? question.correctAnswer.join(' → ') : question.correctAnswer,
      solutionVideoUrl: question.solutionVideoUrl || '',
      moduleId: question.moduleId,
      categoryIds: question.categories.map(c => c.id),
      tagIds: question.tags.map(t => t.id),
      difficulty: question.difficulty
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setQuestionForm({
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      solutionVideoUrl: '',
      moduleId: '',
      categoryIds: [],
      tagIds: [],
      difficulty: 'medium'
    });
    setEditingQuestion(null);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, '']
    });
  };

  const removeOption = (index: number) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
          <p className="text-gray-600">Manage your collection of questions</p>
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
        <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <div className="flex space-x-4">
                {(['mcq', 'yes-no', 'drag-drop'] as const).map((type) => (
                  <div
                    key={type}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      questionForm.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setQuestionForm({ ...questionForm, type })}
                  >
                    <p className="font-medium text-gray-900 capitalize">{type.replace('-', ' ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={questionForm.text}
                onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                placeholder="Enter your question here..."
              />
            </div>

            {/* Options (for MCQ and Drag-Drop) */}
            {(questionForm.type === 'mcq' || questionForm.type === 'drag-drop') && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                     <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input
                        value={option}
                        onChange={(value) => updateOption(index, value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="flex-1"
                      />
                      {questionForm.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
              {questionForm.type === 'mcq' && (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                >
                  <option value="">Select correct answer</option>
                  {questionForm.options.filter(opt => opt.trim()).map((option, index) => (
                    <option key={index} value={option}>
                      {String.fromCharCode(65 + index)} - {option}
                    </option>
                  ))}
                </select>
              )}
              {questionForm.type === 'yes-no' && (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={questionForm.correctAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                >
                  <option value="">Select correct answer</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              )}
              {questionForm.type === 'drag-drop' && (
                <Input
                  value={questionForm.correctAnswer}
                  onChange={(value) => setQuestionForm({ ...questionForm, correctAnswer: value })}
                  placeholder="Enter correct order (e.g., Option A → Option B → Option C)"
                />
              )}
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={questionForm.moduleId}
                  onChange={(e) => setQuestionForm({ ...questionForm, moduleId: e.target.value })}
                >
                  <option value="">Select Module</option>
                  {mockSubjects.flatMap(subject =>
                    subject.modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {subject.name} - {module.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as any })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Solution Video URL */}
            <Input
              label="Solution Video URL (Optional)"
              value={questionForm.solutionVideoUrl}
              onChange={(value) => setQuestionForm({ ...questionForm, solutionVideoUrl: value })}
              placeholder="https://example.com/video"
              icon={Video}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateQuestion}
                disabled={!questionForm.text || !questionForm.correctAnswer}
              >
                {editingQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
          icon={Search}
          className="flex-1 max-w-md"
        />
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">Type:</span>
          <div className="flex space-x-2">
            {(['all', 'mcq', 'yes-no', 'drag-drop'] as const).map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? 'primary' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'All' : type.toUpperCase().replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Difficulty:</span>
          <div className="flex space-x-2">
            {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Badge
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <div 
            key={question.id} 
            className="relative group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <QuestionCard
              question={question}
              className="hover:shadow-md transition-shadow"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                  className="bg-white shadow-sm hover:bg-blue-50"
                >
                   <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('Delete question:', question.id)}
                  className="bg-white shadow-sm hover:bg-red-50 text-red-600"
                >
                   <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No questions found matching your criteria.</p>
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="mt-4"
          >
             <Plus className="h-4 w-4 mr-2" />
            Create Your First Question
          </Button>
        </div>
      )}
    </div>
  );
}
