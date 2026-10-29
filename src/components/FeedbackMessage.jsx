import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * FeedbackMessage Component
 * Displays instant feedback after an answer is submitted.
 */
export const FeedbackMessage = ({
  isCorrect = null, // boolean | null
  correctAnswer = null
}) => {
  if (isCorrect === null) {
    return <div className="feedback-message-placeholder" aria-hidden="true" />;
  }

  return (
    <div
      className={`feedback-banner ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
      role="status"
      aria-live="polite"
    >
      <div className="feedback-icon-box">
        {isCorrect ? (
          <CheckCircle2 size={24} className="feedback-icon-svg" />
        ) : (
          <XCircle size={24} className="feedback-icon-svg" />
        )}
      </div>

      <div className="feedback-text-content">
        <h4 className="feedback-title">
          {isCorrect ? 'Correct! Keep running!' : 'Not quite!'}
        </h4>
        <p className="feedback-desc">
          {isCorrect
            ? '+10 Points awarded • Runner advanced 1 checkpoint!'
            : `The correct answer was ${correctAnswer}. Keep your pace!`}
        </p>
      </div>
    </div>
  );
};
