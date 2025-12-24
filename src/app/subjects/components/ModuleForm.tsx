import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Module, Subject } from '@/types';
import { useEffect, useState } from 'react';

interface ModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Module>) => void;
  initialData: Module | null;
  subjects: Subject[];
  initialSubjectId?: string;
}

export function ModuleForm({ isOpen, onClose, onSubmit, initialData, subjects, initialSubjectId }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjectId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        subjectId: initialData.subjectId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        subjectId: initialSubjectId || ''
      });
    }
  }, [initialData, isOpen, initialSubjectId]);

  if (!isOpen) return null;

  return (
    <Card className="p-6 border-2 border-green-200 bg-green-50/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {initialData ? 'Edit Module' : 'Create New Module'}
        </h3>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="e.g., Algebra, Calculus, Data Structures"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Subject</label>
            <select
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this module covers..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSubmit(formData)}
            disabled={!formData.name || !formData.subjectId}
          >
            {initialData ? 'Update Module' : 'Create Module'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
