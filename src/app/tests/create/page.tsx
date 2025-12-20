'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockQuestions, mockSubjects } from '@/lib/mock-data';
import { Image, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTestPage() {
  const router = useRouter();
  const [testType, setTestType] = useState<'static' | 'dynamic'>('static');
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('60');
  const [passingScore, setPassingScore] = useState('70');
  const [estimatedDuration, setEstimatedDuration] = useState('45');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [dynamicRules, setDynamicRules] = useState([{
    moduleId: '',
    questionCount: 5,
    difficulty: 'medium' as const
  }]);

  const addQuestion = (questionId: string) => {
    if (!selectedQuestions.includes(questionId)) {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
  };

  const addDynamicRule = () => {
    setDynamicRules([...dynamicRules, {
      moduleId: '',
      questionCount: 5,
      difficulty: 'medium' as const
    }]);
  };

  const removeDynamicRule = (index: number) => {
    setDynamicRules(dynamicRules.filter((_, i) => i !== index));
  };

  const updateDynamicRule = (index: number, field: string, value: any) => {
    const newRules = [...dynamicRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setDynamicRules(newRules);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateTest = () => {
    // Create test logic here
    console.log('Creating test:', {
      type: testType,
      title: testTitle,
      description: testDescription,
      timeLimit: parseInt(timeLimit),
      passingScore: parseInt(passingScore),
      estimatedDuration: parseInt(estimatedDuration),
      coverImage,
      tags,
      questions: testType === 'static' ? selectedQuestions : dynamicRules
    });
    router.push('/tests');
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create New Test</h2>
        <p className="text-[var(--text-secondary)]">Build a comprehensive test for your students</p>
      </div>

      {/* Test Type Selection */}
      <Card className="p-6 animate-slide-up animation-delay-100">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Type</h3>
        <div className="flex space-x-4">
          <div
            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              testType === 'static' 
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
                : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
            }`}
            onClick={() => setTestType('static')}
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
            onClick={() => setTestType('dynamic')}
          >
            <h4 className="font-medium text-[var(--text-primary)]">Dynamic Test</h4>
            <p className="text-sm text-[var(--text-secondary)]">Rule-based question selection</p>
          </div>
        </div>
      </Card>

      {/* Test Details */}
      <Card className="p-6 animate-slide-up animation-delay-200">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Details</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Test Title"
              value={testTitle}
              onChange={setTestTitle}
              placeholder="Enter test title"
              required
            />
            <Input
              label="Time Limit (minutes)"
              type="number"
              value={timeLimit}
              onChange={setTimeLimit}
              placeholder="60"
              required
            />
            <Input
              label="Passing Score (%)"
              type="number"
              value={passingScore}
              onChange={setPassingScore}
              placeholder="70"
              required
            />
            <Input
              label="Estimated Duration (minutes)"
              type="number"
              value={estimatedDuration}
              onChange={setEstimatedDuration}
              placeholder="45"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent"
              rows={3}
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              placeholder="Enter test description"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Cover Image
            </label>
            <div className="space-y-4">
              <Input
                value={coverImage}
                onChange={setCoverImage}
                placeholder="Enter image URL or upload"
                icon={Image}
              />
              
              {/* Image Preview */}
              {coverImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[var(--border-primary)]">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-semibold">{testTitle || 'Test Title'}</h4>
                    <p className="text-white/90 text-sm">{testDescription || 'Test description...'}</p>
                  </div>
                </div>
              )}

              {/* Suggested Images */}
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-2">Suggested cover images:</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {suggestedCoverImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        coverImage === imageUrl ? 'border-blue-500' : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                      }`}
                      onClick={() => setCoverImage(imageUrl)}
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
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={setNewTag}
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
        <Card className="p-6 animate-slide-up animation-delay-300">
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
                onClick={() => 
                  selectedQuestions.includes(question.id) 
                    ? removeQuestion(question.id)
                    : addQuestion(question.id)
                }
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
        </Card>
      )}

      {/* Dynamic Rules */}
      {testType === 'dynamic' && (
        <Card className="p-6 animate-slide-up animation-delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Dynamic Rules</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addDynamicRule}
            >
               <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-4">
            {dynamicRules.map((rule, index) => (
              <div key={index} className="p-4 border rounded-lg bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-[var(--text-primary)]">Rule {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDynamicRule(index)}
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Module
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      value={rule.moduleId}
                      onChange={(e) => updateDynamicRule(index, 'moduleId', e.target.value)}
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
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Question Count
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      value={rule.questionCount}
                      onChange={(e) => updateDynamicRule(index, 'questionCount', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                      Difficulty
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      value={rule.difficulty}
                      onChange={(e) => updateDynamicRule(index, 'difficulty', e.target.value)}
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
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push('/tests')}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateTest}
          disabled={!testTitle || (testType === 'static' && selectedQuestions.length === 0)}
        >
          Create Test
        </Button>
      </div>
    </div>
  );
}
