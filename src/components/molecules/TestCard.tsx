import React from 'react';
import { Test } from '../../types';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Clock, Users, FileText, Play, Edit, Settings, Star, Calendar } from 'lucide-react';

interface TestCardProps {
  test: Test;
  attemptCount?: number;
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

  return (
    <Card className={`group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`} hover>
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
              <Badge variant={test.type === 'static' ? 'primary' : 'secondary'} size="sm" className="bg-white/90 text-gray-900">
                {test.type}
              </Badge>
              <Badge variant={getDifficultyColor()} size="sm" className="bg-white/90">
                {getDifficultyLevel()}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onConfigure && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Settings}
                  onClick={onConfigure}
                  className="bg-white/90 hover:bg-white text-gray-700"
                />
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={onEdit}
                  className="bg-white/90 hover:bg-white text-gray-700"
                />
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors mb-1">
                {test.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed line-clamp-2">{test.description}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header (if no cover image) */}
          {!test.coverImage && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
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
                    icon={Settings}
                    onClick={onConfigure}
                    className="hover:bg-blue-50"
                  />
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={onEdit}
                    className="hover:bg-blue-50"
                  />
                )}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <FileText className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-900">{questionCount}</p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-900">{test.timeLimit}</p>
              <p className="text-xs text-gray-500">Minutes</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Calendar className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-900">{test.estimatedDuration || test.timeLimit}</p>
              <p className="text-xs text-gray-500">Est. Time</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-gray-900">{attemptCount}</p>
              <p className="text-xs text-gray-500">Attempts</p>
            </div>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Passing Score</span>
              </div>
              <Badge variant="primary" size="md" className="bg-blue-600">{test.passingScore}%</Badge>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex items-center justify-between pt-2">
            <Badge 
              variant={test.isActive ? 'success' : 'danger'} 
              size="md"
              className={test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {test.isActive ? '✓ Active' : '✗ Inactive'}
            </Badge>
            
            {onStart && (
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={onStart}
                disabled={!test.isActive}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Test
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};