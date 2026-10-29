import React from 'react';
import { AnswerOptions } from './AnswerOptions';
import { FeedbackMessage } from './FeedbackMessage';

/**
 * QuestionCard Component
 * Displays the current math equation in bold, clean typography,
 * along with the answer options grid and immediate feedback.
 */
export const QuestionCard = ({
  question,
  questionIndex = 0,
  totalQuestions = 10,
  selectedAnswer = null,
  hasAnswered = false,
  isCorrect = null,
  disabled = false,
  onSelectOption
}) => {
  if (!question) return null;

  return (
    <div className="question-card-container">
      {/* Card Header Tag */}
      <div className="question-card-meta">
        <span className="question-badge">
          STAGE {questionIndex + 1}
        </span>
        <span className="question-counter-pill">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Main Arithmetic Formula */}
      <div className="question-prompt-box">
        <h2 className="question-math-equation" aria-label={`Calculate: ${question.displayText}`}>
          <span className="math-operand">{question.operandA}</span>
          <span className="math-operator">{question.displayOperator}</span>
          <span className="math-operand">{question.operandB}</span>
          <span className="math-equals">=</span>
          <span className="math-target">?</span>
        </h2>
        <p className="question-subtext">Choose the correct answer below</p>
      </div>

      {/* Answer Options Grid */}
      <AnswerOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        correctAnswer={question.correctAnswer}
        disabled={disabled}
        hasAnswered={hasAnswered}
        onSelectOption={onSelectOption}
      />

      {/* Feedback Banner (Displayed right after an answer is submitted) */}
      <FeedbackMessage
        isCorrect={isCorrect}
        correctAnswer={question.correctAnswer}
      />
    </div>
  );
};
