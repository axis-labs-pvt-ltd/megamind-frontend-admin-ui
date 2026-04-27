'use client';

import { RichText } from '@/components/ui/RichText';
import { Question } from '@/types';
import { AnswerOptions } from './AnswerOptions';
import { BooleanOptions } from './options/BooleanOptions';
import { OrderOptions } from './options/OrderOptions';
import { TextOptions } from './options/TextOptions';

interface QuestionBodyProps {
  question: Question;
  userAnswer?: string | string[];
  showAnswer?: boolean;
}

const renderAnswerOptions = (props: QuestionBodyProps, isMultiSelect: boolean) => (
  props.question.options ? (
    <AnswerOptions
      options={props.question.options}
      correctAnswer={props.question.correctAnswer as string | string[]}
      userAnswer={props.userAnswer}
      showAnswer={props.showAnswer}
      isMultiSelect={isMultiSelect}
    />
  ) : null
);

const renderBooleanOptions = (props: QuestionBodyProps) => (
  props.question.options ? (
    <BooleanOptions
      options={props.question.options}
      correctAnswer={props.question.correctAnswer as string | string[]}
      showAnswer={props.showAnswer}
    />
  ) : null
);

const RENDERERS = {
  'mcq':          (p: QuestionBodyProps) => renderAnswerOptions(p, false),
  'multi-select': (p: QuestionBodyProps) => renderAnswerOptions(p, true),
  'yes-no':       renderBooleanOptions,
  'true-false':   renderBooleanOptions,
  'drag-drop':    (p: QuestionBodyProps) => (
    p.question.options ? (
      <OrderOptions
        options={p.question.options}
        correctAnswer={p.question.correctAnswer as string[]}
      />
    ) : null
  ),
  'text': () => <TextOptions />,
};

export const QuestionBody: React.FC<QuestionBodyProps> = ({ question, userAnswer, showAnswer = false }) => {
  const Renderer = RENDERERS[question.type as keyof typeof RENDERERS];

  return (
    <div className="flex-1 space-y-4">
      {/* Question text with formula rendering */}
      <p className="text-lg font-medium text-[var(--text-primary)]">
        <RichText text={question.text} />
      </p>

      {/* Optional question image */}
      {question.imageUrl && (
        <div className="my-3">
          <img
            src={question.imageUrl}
            alt="Question diagram"
            className="max-h-64 rounded-xl border border-[var(--border-primary)] object-contain"
          />
        </div>
      )}

      {Renderer ? <Renderer question={question} userAnswer={userAnswer} showAnswer={showAnswer} /> : null}
    </div>
  );
};
