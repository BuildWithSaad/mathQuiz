import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

const SHORTCUT_LABELS = ['1', '2', '3', '4'];

/**
 * AnswerOptions Component
 * 4 multiple-choice option buttons with keyboard listener support (1..4 & A..D).
 */
export const AnswerOptions = ({
  options = [],
  selectedAnswer = null,
  correctAnswer = null,
  disabled = false,
  hasAnswered = false,
  onSelectOption
}) => {
  // Global keyboard shortcuts (1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled || hasAnswered) return;

      let optionIndex = -1;
      if (e.key === '1' || e.key.toLowerCase() === 'a') optionIndex = 0;
      else if (e.key === '2' || e.key.toLowerCase() === 'b') optionIndex = 1;
      else if (e.key === '3' || e.key.toLowerCase() === 'c') optionIndex = 2;
      else if (e.key === '4' || e.key.toLowerCase() === 'd') optionIndex = 3;

      if (optionIndex >= 0 && optionIndex < options.length) {
        e.preventDefault();
        onSelectOption(options[optionIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, hasAnswered, options, onSelectOption]);

  return (
    <div className="answer-options-grid" role="group" aria-label="Math Answer Choices">
      {options.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        const isCorrectOption = option === correctAnswer;

        let statusClass = '';
        if (hasAnswered) {
          if (isSelected) {
            statusClass = isCorrectOption ? 'option-correct' : 'option-incorrect';
          } else if (isCorrectOption) {
            statusClass = 'option-revealed';
          }
        }

        return (
          <button
            key={`opt-${idx}-${option}`}
            type="button"
            className={`answer-option-btn ${statusClass} ${isSelected ? 'is-selected' : ''}`}
            disabled={disabled || hasAnswered}
            onClick={() => onSelectOption(option)}
            aria-pressed={isSelected}
            aria-label={`Option ${SHORTCUT_LABELS[idx]}: ${option}`}
          >
            <span className="option-key-badge" aria-hidden="true">
              {SHORTCUT_LABELS[idx]}
            </span>

            <span className="option-text">{option}</span>

            <span className="option-status-icon" aria-hidden="true">
              {hasAnswered && isSelected && isCorrectOption && (
                <Check size={20} strokeWidth={3} className="text-success" />
              )}
              {hasAnswered && isSelected && !isCorrectOption && (
                <X size={20} strokeWidth={3} className="text-error" />
              )}
              {hasAnswered && !isSelected && isCorrectOption && (
                <Check size={20} strokeWidth={3} className="text-success" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
