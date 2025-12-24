// Client Component - Test Tags
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateTestValues } from '@/lib/validations/test';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface TestTagsProps {
  tags: string[];
  setValue: UseFormSetValue<CreateTestValues>;
}

export function TestTags({ tags, setValue }: TestTagsProps) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(t => t !== tagToRemove));
  };

  return (
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
  );
}
