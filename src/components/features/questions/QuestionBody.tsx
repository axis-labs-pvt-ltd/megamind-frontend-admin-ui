'use client';

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

// Helper functions to reduce duplication
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

// Map question types to their specific props and render logic
const RENDERERS = {
  'mcq': (props: QuestionBodyProps) => renderAnswerOptions(props, false),
  'multi-select': (props: QuestionBodyProps) => renderAnswerOptions(props, true),
  'yes-no': renderBooleanOptions,
  'true-false': renderBooleanOptions,
  'drag-drop': (props: QuestionBodyProps) => (
    props.question.options ? (
      <OrderOptions
        options={props.question.options}
        correctAnswer={props.question.correctAnswer as string[]}
      />
    ) : null
  ),
  'text': () => <TextOptions />,
};

const QuestionTypeRenderer: React.FC<QuestionBodyProps> = (props) => {
  const { question } = props;
  const Renderer = RENDERERS[question.type as keyof typeof RENDERERS];
  
  return Renderer ? <Renderer {...props} /> : null;
};

export const QuestionBody: React.FC<QuestionBodyProps> = ({
  question,
  userAnswer,
  showAnswer = false,
}) => {
  return (
    <div className="flex-1">
      <p className="text-lg font-medium text-[var(--text-primary)] mb-4">
        {question.text}
      </p>
      
      <QuestionTypeRenderer
        question={question}
        userAnswer={userAnswer}
        showAnswer={showAnswer}
      />
    </div>
  );
};
