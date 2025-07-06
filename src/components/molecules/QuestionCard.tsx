import React from 'react';
import { Question } from '../../types';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { PlayCircle, Tag, Folder } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  showAnswer?: boolean;
  userAnswer?: string | string[];
  onEdit?: () => void;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  showAnswer = false,
  userAnswer,
  onEdit,
  className = '',
}) => {
  const isCorrect = userAnswer && JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`${className}`} hover={!!onEdit} onClick={onEdit}>
      <div className="space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" size="sm">
              {question.type.toUpperCase()}
            </Badge>
            <Badge variant={getDifficultyColor(question.difficulty)} size="sm">
              {question.difficulty}
            </Badge>
          </div>
          {question.solutionVideoUrl && (
            <PlayCircle className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-600" />
          )}
        </div>

        {/* Question Text */}
        <div className="prose max-w-none">
          <p className="text-gray-900 font-medium">{question.text}</p>
        </div>

        {/* Options */}
        {question.options && question.type !== 'drag-drop' && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  showAnswer
                    ? option === question.correctAnswer
                      ? 'bg-green-50 border-green-200'
                      : userAnswer === option && !isCorrect
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm text-gray-900">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drag Drop Options */}
        {question.type === 'drag-drop' && question.options && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Options:</p>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Answer Section */}
        {showAnswer && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Correct Answer:</span>
              <Badge variant="success" size="sm">
                {Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.join(' → ')
                  : question.correctAnswer}
              </Badge>
            </div>
            {userAnswer && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Your Answer:</span>
                <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                  {Array.isArray(userAnswer) ? userAnswer.join(' → ') : userAnswer}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Categories and Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          {question.categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-1">
              <Folder className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{category.name}</span>
            </div>
          ))}
          {question.tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-1">
              <Tag className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{tag.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};