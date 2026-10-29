import React, { useState } from 'react';
import { Check, X, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * AnswerReview Component
 * Displays an itemized list of all race questions with selected answers,
 * correct answers, and clear status indicators (correct, incorrect, unanswered).
 */
export const AnswerReview = ({ reviewItems = [] }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'unanswered'

  const filteredItems = reviewItems.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const correctCount = reviewItems.filter((i) => i.status === 'correct').length;
  const incorrectCount = reviewItems.filter((i) => i.status === 'incorrect').length;
  const unansweredCount = reviewItems.filter((i) => i.status === 'unanswered').length;

  return (
    <div className="answer-review-section">
      <div className="review-header">
        <div className="review-title-group">
          <h3 className="review-title">Detailed Question Review</h3>
          <p className="review-subtitle">
            Analyze your choices, master every equation, and learn from mistakes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="review-filter-group" role="tablist" aria-label="Filter questions">
          <button
            type="button"
            className={`filter-pill ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({reviewItems.length})
          </button>
          <button
            type="button"
            className={`filter-pill filter-correct ${filter === 'correct' ? 'is-active' : ''}`}
            onClick={() => setFilter('correct')}
          >
            Correct ({correctCount})
          </button>
          <button
            type="button"
            className={`filter-pill filter-incorrect ${filter === 'incorrect' ? 'is-active' : ''}`}
            onClick={() => setFilter('incorrect')}
          >
            Mistakes ({incorrectCount})
          </button>
          {unansweredCount > 0 && (
            <button
              type="button"
              className={`filter-pill filter-unanswered ${filter === 'unanswered' ? 'is-active' : ''}`}
              onClick={() => setFilter('unanswered')}
            >
              Unanswered ({unansweredCount})
            </button>
          )}
        </div>
      </div>

      {/* Questions Review List */}
      <div className="review-list">
        {filteredItems.length === 0 ? (
          <div className="review-empty-state">
            <p>No questions match the selected filter.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isCorrect = item.status === 'correct';
            const isIncorrect = item.status === 'incorrect';
            const isUnanswered = item.status === 'unanswered';

            return (
              <div
                key={`rev-${item.id || idx}`}
                className={`review-item-card status-${item.status}`}
              >
                {/* Left status badge & question # */}
                <div className="review-item-left">
                  <div className={`review-status-indicator indicator-${item.status}`}>
                    {isCorrect && <Check size={18} strokeWidth={3} />}
                    {isIncorrect && <X size={18} strokeWidth={3} />}
                    {isUnanswered && <Clock size={18} />}
                  </div>
                  <span className="review-q-num">#{item.questionNumber}</span>
                </div>

                {/* Equation formula */}
                <div className="review-equation">
                  <span className="equation-math">{item.displayText} = </span>
                  <span className="equation-answer font-mono">
                    {item.correctAnswer}
                  </span>
                </div>

                {/* Player's Answer comparison */}
                <div className="review-comparison">
                  <div className="comparison-col">
                    <span className="comparison-label">Your Answer:</span>
                    <span
                      className={`comparison-value font-mono ${
                        isCorrect
                          ? 'text-success'
                          : isIncorrect
                          ? 'text-error'
                          : 'text-muted'
                      }`}
                    >
                      {item.userAnswer !== null && item.userAnswer !== undefined
                        ? item.userAnswer
                        : '— (None)'}
                    </span>
                  </div>

                  <div className="comparison-col">
                    <span className="comparison-label">Correct:</span>
                    <span className="comparison-value text-success font-mono">
                      {item.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="review-badge-wrapper">
                  <span className={`review-badge badge-${item.status}`}>
                    {isCorrect
                      ? 'CORRECT (+10)'
                      : isIncorrect
                      ? 'INCORRECT (+0)'
                      : 'UNANSWERED'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
