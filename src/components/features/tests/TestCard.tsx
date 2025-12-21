'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Test } from '@/types';
import { Calendar, Clock, Edit, FileText, Play, Settings, Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TestCardProps {
  test: Test;
  attemptCount?: number;
  // We can pass functions, or assume default navigation. 
  // For Next.js passing specific routing logic via props is fine, or we handle it internally.
  // The original component had onStart, onEdit, etc. I'll keep them optional.
  onStart?: () => void;
  onEdit?: () => void;
  onConfigure?: () => void;
  className?: string;
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  attemptCount = 0,
  onStart,
  onEdit,
  onConfigure,
  className = '',
}) => {
  const router = useRouter();

  const questionCount = test.type === 'static' 
    ? test.questionIds.length 
    : test.rules.reduce((sum, rule) => sum + rule.questionCount, 0);

  const getDifficultyLevel = () => {
    if (questionCount <= 5) return 'Beginner';
    if (questionCount <= 15) return 'Intermediate';
    return 'Advanced';
  };

  const getDifficultyColor = () => {
    const level = getDifficultyLevel();
    if (level === 'Beginner') return 'success';
    if (level === 'Intermediate') return 'warning';
    return 'danger';
  };

  // Default handler if none provided, assuming routing structure
  const handleStart = () => {
     if (onStart) {
        onStart();
     } else {
        // Example: router.push(`/tests/${test.id}/start`);
        console.log("Start test", test.id);
     }
  };

  return (
    <Card className={cn(`group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-0 shadow-md overflow-hidden`, className)} hover>
      <div className="space-y-0">
        {/* Cover Image */}
        {test.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={test.coverImage}
              alt={test.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge variant={test.type === 'static' ? 'primary' : 'secondary'} size="sm" className="bg-[var(--bg-card)]/90 text-[var(--text-primary)]">
                {test.type}
              </Badge>
              <Badge variant={getDifficultyColor()} size="sm" className="bg-[var(--bg-card)]/90">
                {getDifficultyLevel()}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onConfigure && (
                <Button
                  variant="ghost"
                  size="sm"
                  style={{ padding: 8 }}
                  onClick={onConfigure}
                  className="bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card)] text-gray-700"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                   style={{ padding: 8 }}
                  onClick={onEdit}
                  className="bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card)] text-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors mb-1">
                {test.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">{test.description}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-3 md:p-6 space-y-3 md:space-y-4">
          {/* Header (if no cover image) */}
          {!test.coverImage && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-700 transition-colors">
                    {test.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={test.type === 'static' ? 'primary' : 'secondary'} size="sm">
                      {test.type}
                    </Badge>
                    <Badge variant={getDifficultyColor()} size="sm">
                      {getDifficultyLevel()}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{test.description}</p>
              </div>
              <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {onConfigure && (
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ padding: 8 }}
                    onClick={onConfigure}
                    className="hover:bg-blue-50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ padding: 8 }}
                    onClick={onEdit}
                    className="hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <Tooltip content="Questions" className="w-full">
                <div className="text-center p-1 md:p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <FileText className="h-3 w-3 md:h-4 md:w-4 text-[var(--icon-secondary)] mx-auto mb-1" />
                <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)]">{questionCount}</p>
                <span className="text-[9px] md:text-[10px] text-[var(--text-secondary)] block">Ques</span>
                </div>
            </Tooltip>
            
            <Tooltip content="Minutes" className="w-full">
                <div className="text-center p-1 md:p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-[var(--icon-secondary)] mx-auto mb-1" />
                <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)]">{test.timeLimit}</p>
                <span className="text-[9px] md:text-[10px] text-[var(--text-secondary)] block">Mins</span>
                </div>
            </Tooltip>

            <Tooltip content="Estimated Time" className="w-full">
                <div className="text-center p-1 md:p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-[var(--icon-secondary)] mx-auto mb-1" />
                <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)]">{test.estimatedDuration || test.timeLimit}</p>
                <span className="text-[9px] md:text-[10px] text-[var(--text-secondary)] block">Est</span>
                </div>
            </Tooltip>

            <Tooltip content="Attempts" className="w-full">
                <div className="text-center p-1 md:p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-[var(--icon-secondary)] mx-auto mb-1" />
                <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)]">{attemptCount}</p>
                <span className="text-[9px] md:text-[10px] text-[var(--text-secondary)] block">Users</span>
                </div>
            </Tooltip>
          </div>

          {/* Tags */}
          {test.tags && test.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {test.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {test.tags.length > 3 && (
                <Badge variant="secondary" size="sm" className="text-xs">
                  +{test.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Passing Score */}
          <div className="bg-[var(--accent-blue)]/5 rounded-xl p-4 border border-[var(--accent-blue)]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-[var(--accent-blue)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">Passing Score</span>
              </div>
              <Badge variant="primary" size="md" className="bg-[var(--accent-blue)] text-white">{test.passingScore}%</Badge>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex items-center justify-between pt-2">
            <Badge 
              variant={test.isActive ? 'success' : 'danger'} 
              size="md"
              className={test.isActive ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]' : 'bg-[var(--accent-red)]/10 text-[var(--accent-red)]'}
            >
              {test.isActive ? '✓ Active' : '✗ Inactive'}
            </Badge>
            
            <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                disabled={!test.isActive}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <span className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
