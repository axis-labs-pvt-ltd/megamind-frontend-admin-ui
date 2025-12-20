'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockQuestions, mockSubjects } from '@/lib/mock-data';
import { CreateTestValues, createTestSchema } from '@/lib/validations/test';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export function CreateTestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTestValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      type: 'static',
      title: '',
      description: '',
      timeLimit: 60,
      passingScore: 70,
      estimatedDuration: 45,
      coverImage: '',
      tags: [],
      questions: [],
      dynamicRules: [{ moduleId: '', questionCount: 5, difficulty: 'medium' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dynamicRules",
  });

  const testType = watch('type');
  const selectedQuestions = watch('questions') || [];
  const tags = watch('tags') || [];
  const coverImage = watch('coverImage');
  const title = watch('title');
  const description = watch('description');

  const onSubmit = async (data: CreateTestValues) => {
    setIsLoading(true);
    try {
      // await testService.createTest(data); // Simulate API call
      console.log('Creating Test:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/tests');
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    const current = selectedQuestions;
    const updated = current.includes(questionId)
      ? current.filter(id => id !== questionId)
      : [...current, questionId];
    setValue('questions', updated, { shouldValidate: true });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(t => t !== tagToRemove));
  };

  const suggestedCoverImages = [
    'https://images.pexels.com/photos/6238/mathematics-computation-math-numbers.jpg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Test Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Type</h3>
        <div className="flex space-x-4">
          <div
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              testType === 'static' 
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
                : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
            }`}
            onClick={() => setValue('type', 'static')}
          >
            <h4 className="font-medium text-[var(--text-primary)]">Static Test</h4>
            <p className="text-sm text-[var(--text-secondary)]">Fixed set of questions</p>
          </div>
          <div
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              testType === 'dynamic' 
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
                : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
            }`}
            onClick={() => setValue('type', 'dynamic')}
          >
            <h4 className="font-medium text-[var(--text-primary)]">Dynamic Test</h4>
            <p className="text-sm text-[var(--text-secondary)]">Rule-based question selection</p>
          </div>
        </div>
        {errors.type && <p className="text-sm text-[var(--accent-red)] mt-2">{errors.type.message}</p>}
      </Card>

      {/* Test Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Details</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Test Title</label>
              <Input
                {...register('title')}
                placeholder="Enter test title"
                error={errors.title?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Time Limit (mins)</label>
              <Input
                type="number"
                {...register('timeLimit', { valueAsNumber: true })}
                placeholder="60"
                error={errors.timeLimit?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Passing Score (%)</label>
              <Input
                type="number"
                {...register('passingScore', { valueAsNumber: true })}
                placeholder="70"
                error={errors.passingScore?.message}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Est. Duration (mins)</label>
              <Input
                type="number"
                {...register('estimatedDuration', { valueAsNumber: true })}
                placeholder="45"
                error={errors.estimatedDuration?.message}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Description
            </label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent"
              rows={3}
              placeholder="Enter test description"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Cover Image
            </label>
            <div className="space-y-4">
              <Input
                {...register('coverImage')}
                placeholder="Enter image URL or upload"
                icon={Image}
                error={errors.coverImage?.message}
              />
              
              {/* Image Preview */}
              {coverImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[var(--border-primary)] animate-fade-in">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={() => setValue('coverImage', '')} // Reset on error
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-semibold">{title || 'Test Title'}</h4>
                    <p className="text-white/90 text-sm line-clamp-2">{description || 'Test description...'}</p>
                  </div>
                </div>
              )}

              {/* Suggested Images */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">Suggested cover images:</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {suggestedCoverImages.map((imageUrl, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        coverImage === imageUrl ? 'border-blue-500' : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                      }`}
                      onClick={() => setValue('coverImage', imageUrl)}
                    >
                      <img
                        src={imageUrl}
                        alt={`Suggested ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer text-[var(--accent-red)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Question Selection */}
      {testType === 'static' && (
        <Card className="p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Select Questions</h3>
            <Badge variant="primary" size="md">
              {selectedQuestions.length} selected
            </Badge>
          </div>
          <div className="space-y-3">
            {mockQuestions.map((question) => (
              <div
                key={question.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedQuestions.includes(question.id)
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                }`}
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{question.text}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" size="sm">
                        {question.type.toUpperCase()}
                      </Badge>
                      <Badge variant="warning" size="sm">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedQuestions.includes(question.id) && (
                      <Badge variant="success" size="sm">Selected</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.questions && <p className="text-sm text-[var(--accent-red)] mt-4 text-center">Please select at least one question.</p>}
        </Card>
      )}

      {/* Dynamic Rules */}
      {testType === 'dynamic' && (
        <Card className="p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Dynamic Rules</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ moduleId: '', questionCount: 5, difficulty: 'medium' })}
            >
               <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg bg-[var(--bg-secondary)] animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-[var(--text-primary)]">Rule {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1} 
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">
                      Module
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      {...register(`dynamicRules.${index}.moduleId`)}
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
                    {errors.dynamicRules?.[index]?.moduleId && (
                      <p className="text-xs text-[var(--accent-red)]">{errors.dynamicRules[index]?.moduleId?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">
                      Count
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      {...register(`dynamicRules.${index}.questionCount`, { valueAsNumber: true })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">
                      Difficulty
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      {...register(`dynamicRules.${index}.difficulty`)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--border-primary)]">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tests')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[var(--accent-blue)] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
               Creating...
            </>
          ) : (
            <>
               <Save className="h-4 w-4 mr-2" />
               Create Test
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
