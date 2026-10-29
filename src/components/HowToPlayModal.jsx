import React, { useEffect } from 'react';
import { X, CheckCircle2, Clock, Flame, Keyboard, Award } from 'lucide-react';

/**
 * HowToPlayModal Component
 * Accessible dialog explaining rules, controls, and scoring.
 */
export const HowToPlayModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 id="modal-title" className="modal-title">How to Play Math Relay</h3>
            <p className="modal-subtitle">Think fast, solve smart, cross the finish line!</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="rules-grid">
            {/* Rule 1 */}
            <div className="rule-card">
              <div className="rule-icon-box bg-primary-soft">
                <CheckCircle2 size={24} className="text-primary" />
              </div>
              <div className="rule-content">
                <h4 className="rule-heading">1. Solve to Advance</h4>
                <p className="rule-text">
                  Each correct math answer earns <strong>10 points</strong> and sprints your runner forward by <strong>1 checkpoint</strong>.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="rule-card">
              <div className="rule-icon-box bg-secondary-soft">
                <Clock size={24} className="text-secondary" />
              </div>
              <div className="rule-content">
                <h4 className="rule-heading">2. Beat the Clock or Practice</h4>
                <p className="rule-text">
                  In <strong>Timed Race</strong>, solve all questions before the countdown hits zero. In <strong>Practice Mode</strong>, learn at your own pace without time pressure.
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="rule-card">
              <div className="rule-icon-box bg-amber-soft">
                <Flame size={24} className="text-amber" />
              </div>
              <div className="rule-content">
                <h4 className="rule-heading">3. Build Your Streak</h4>
                <p className="rule-text">
                  Answer consecutive questions correctly to ignite your streak flame. Missing a question resets the streak, but allows you to keep running.
                </p>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="rule-card">
              <div className="rule-icon-box bg-violet-soft">
                <Keyboard size={24} className="text-violet" />
              </div>
              <div className="rule-content">
                <h4 className="rule-heading">4. Rapid Keyboard Controls</h4>
                <p className="rule-text">
                  Play with a mouse or tap keys <strong>1, 2, 3, 4</strong> (or <strong>A, B, C, D</strong>) to select your answers instantly like an arcade pro!
                </p>
              </div>
            </div>
          </div>

          <div className="scoring-summary-box">
            <div className="summary-badge">
              <Award size={16} /> SCORING RULES
            </div>
            <ul className="scoring-list">
              <li><strong>+10 PTS</strong> for each correct answer</li>
              <li><strong>0 PTS</strong> for incorrect answers (runner pauses at current checkpoint)</li>
              <li>Accuracy is based on answered questions: <code>(Correct / Answered) × 100</code></li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
            Got It, Let's Race!
          </button>
        </div>
      </div>
    </div>
  );
};
