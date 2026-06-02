import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Subject } from '@/types';
import { useEffect, useState } from 'react';

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Subject>) => void;
  initialData: Subject | null;
}

export function SubjectForm({ isOpen, onClose, onSubmit, initialData }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        color: initialData.color || '#3b82f6'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const colors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ];

  return (
    <Card className="p-6 border-2 border-blue-200 bg-blue-50/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {initialData ? 'Edit Subject' : 'Create New Subject'}
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
            placeholder="e.g., Mathematics, Physics, Computer Science"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Color Theme</label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color ? 'border-[var(--border-hover)] scale-110' : 'border-[var(--border-primary)]'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this subject covers..."
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
            disabled={!formData.name}
          >
            {initialData ? 'Update Subject' : 'Create Subject'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
