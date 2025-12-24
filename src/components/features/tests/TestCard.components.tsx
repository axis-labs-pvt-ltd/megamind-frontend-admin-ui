import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Test } from '@/types';
import { Calendar, Clock, Edit, FileText, Play, Settings, Star, Users } from 'lucide-react';

// Helper functions
export const getDifficultyLevel = (test: Test) => {
  const questionCount = test.type === 'static' 
    ? test.questionIds.length 
    : test.rules.reduce((sum, rule) => sum + rule.questionCount, 0);

  if (questionCount <= 5) return 'Beginner';
  if (questionCount <= 15) return 'Intermediate';
  return 'Advanced';
};

export const getDifficultyColor = (test: Test) => {
  const level = getDifficultyLevel(test);
  if (level === 'Beginner') return 'success';
  if (level === 'Intermediate') return 'warning';
  return 'danger';
};

export const getQuestionCount = (test: Test) => {
  return test.type === 'static' 
    ? test.questionIds.length 
    : test.rules.reduce((sum, rule) => sum + rule.questionCount, 0);
};

interface ActionProps {
    onConfigure?: () => void;
    onEdit?: () => void;
}

export const TestCardCover = ({ test, onConfigure, onEdit }: { test: Test } & ActionProps) => {
  return (
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
        <Badge variant={getDifficultyColor(test)} size="sm" className="bg-[var(--bg-card)]/90">
          {getDifficultyLevel(test)}
        </Badge>
      </div>
      <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onConfigure && (
          <Button
            variant="ghost"
            size="sm"
            style={{ padding: 8 }}
            onClick={(e) => { e.stopPropagation(); onConfigure(); }}
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
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
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
  );
};

export const TestCardHeaderNoImage = ({ test, onConfigure, onEdit }: { test: Test } & ActionProps) => {
  return (
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
            <Badge variant={getDifficultyColor(test)} size="sm">
              {getDifficultyLevel(test)}
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
            onClick={(e) => { e.stopPropagation(); onConfigure(); }}
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
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export const TestCardStats = ({ test, attemptCount = 0 }: { test: Test, attemptCount?: number }) => {
  const questionCount = getQuestionCount(test);
  return (
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
  );
};

export const TestCardTags = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
        {tags.slice(0, 3).map((tag, index) => (
        <Badge key={index} variant="secondary" size="sm" className="text-xs">
            #{tag}
        </Badge>
        ))}
        {tags.length > 3 && (
        <Badge variant="secondary" size="sm" className="text-xs">
            +{tags.length - 3} more
        </Badge>
        )}
    </div>
  );
};

export const TestCardPassingScore = ({ passingScore }: { passingScore: number }) => {
  return (
    <div className="bg-[var(--accent-blue)]/5 rounded-xl p-4 border border-[var(--accent-blue)]/20">
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-[var(--accent-blue)]" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">Passing Score</span>
        </div>
        <Badge variant="primary" size="md" className="bg-[var(--accent-blue)] text-white">{passingScore}%</Badge>
    </div>
    </div>
  );
};

export const TestCardActions = ({ test, onStart }: { test: Test, onStart?: () => void }) => {
    
  return (
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
        onClick={(e) => { e.stopPropagation(); onStart?.(); }}
        disabled={!test.isActive}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
    >
        <span className="flex items-center">
            <Play className="h-4 w-4 mr-2" />
            Start Test
        </span>
    </Button>
    </div>
  );
};
