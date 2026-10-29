import React, { useState } from 'react';
import { Play, ArrowLeft, Sliders, Timer, Zap, Check } from 'lucide-react';
import { OPERATIONS, DISPLAY_SYMBOLS } from '../utils/questionGenerator';

const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: 'Easy', desc: 'Single digits & simple tables' },
  { id: 'medium', label: 'Medium', desc: 'Moderate values & carry-overs' },
  { id: 'hard', label: 'Hard', desc: 'Fast mental calculations' }
];

const QUESTION_COUNT_OPTIONS = [5, 10, 15];

const NUMBER_RANGES = [
  { id: '1-10', label: '1 – 10', desc: 'Beginner foundations' },
  { id: '1-50', label: '1 – 50', desc: 'Intermediate speed' },
  { id: '1-100', label: '1 – 100', desc: 'Advanced masters' }
];

const TIMER_OPTIONS = [
  { seconds: 30, label: '30s Blitz' },
  { seconds: 60, label: '60s Standard' },
  { seconds: 90, label: '90s Endurance' }
];

const OPERATION_LIST = [
  { id: OPERATIONS.ADD, label: 'Addition', symbol: DISPLAY_SYMBOLS[OPERATIONS.ADD] },
  { id: OPERATIONS.SUBTRACT, label: 'Subtraction', symbol: DISPLAY_SYMBOLS[OPERATIONS.SUBTRACT] },
  { id: OPERATIONS.MULTIPLY, label: 'Multiplication', symbol: DISPLAY_SYMBOLS[OPERATIONS.MULTIPLY] },
  { id: OPERATIONS.DIVIDE, label: 'Division', symbol: DISPLAY_SYMBOLS[OPERATIONS.DIVIDE] }
];

/**
 * GameSetup Component
 * Allows configuration of difficulty, operations, number ranges, question counts, and modes.
 */
export const GameSetup = ({
  initialSettings = {},
  onStartRace,
  onBack
}) => {
  const [difficulty, setDifficulty] = useState(initialSettings.difficulty || 'easy');
  const [questionCount, setQuestionCount] = useState(initialSettings.questionCount || 10);
  const [operations, setOperations] = useState(
    initialSettings.operations || [
      OPERATIONS.ADD,
      OPERATIONS.SUBTRACT,
      OPERATIONS.MULTIPLY,
      OPERATIONS.DIVIDE
    ]
  );
  const [numberRange, setNumberRange] = useState(initialSettings.numberRange || '1-10');
  const [gameMode, setGameMode] = useState(initialSettings.gameMode || 'timed'); // 'timed' | 'practice'
  const [timerDuration, setTimerDuration] = useState(initialSettings.timerDuration || 60);

  // Toggle operation: ensure at least one operation is always checked
  const handleToggleOperation = (opId) => {
    if (operations.includes(opId)) {
      if (operations.length > 1) {
        setOperations(operations.filter((o) => o !== opId));
      }
    } else {
      setOperations([...operations, opId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartRace({
      difficulty,
      questionCount,
      operations,
      numberRange,
      gameMode,
      timerDuration
    });
  };

  return (
    <div className="game-setup-container">
      <div className="setup-card">
        {/* Setup Header */}
        <div className="setup-header">
          <div className="setup-title-group">
            <div className="setup-icon-badge">
              <Sliders size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="setup-title">Race Setup</h2>
              <p className="setup-subtitle">Customize your course rules and arithmetic challenges</p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            aria-label="Back to welcome screen"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Section 1: Game Mode */}
          <div className="setup-section">
            <label className="setup-section-label">1. Race Mode</label>
            <div className="setup-mode-toggle-group">
              <button
                type="button"
                className={`setup-mode-btn ${gameMode === 'timed' ? 'is-active' : ''}`}
                onClick={() => setGameMode('timed')}
              >
                <Timer size={18} />
                <div className="mode-btn-text">
                  <strong>Timed Race</strong>
                  <span>Sprint against the countdown clock</span>
                </div>
              </button>

              <button
                type="button"
                className={`setup-mode-btn ${gameMode === 'practice' ? 'is-active' : ''}`}
                onClick={() => setGameMode('practice')}
              >
                <Zap size={18} />
                <div className="mode-btn-text">
                  <strong>Practice Mode</strong>
                  <span>Untimed mental arithmetic training</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Countdown Timer (Only visible in Timed Mode) */}
          {gameMode === 'timed' && (
            <div className="setup-section animate-fade-in">
              <label className="setup-section-label">Timer Duration</label>
              <div className="setup-pill-group">
                {TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.seconds}
                    type="button"
                    className={`setup-pill-btn ${timerDuration === opt.seconds ? 'is-selected' : ''}`}
                    onClick={() => setTimerDuration(opt.seconds)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Difficulty */}
          <div className="setup-section">
            <label className="setup-section-label">2. Difficulty Level</label>
            <div className="setup-grid-3">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`setup-card-btn ${difficulty === d.id ? 'is-selected' : ''}`}
                  onClick={() => setDifficulty(d.id)}
                >
                  <div className="card-btn-header">
                    <strong>{d.label}</strong>
                    {difficulty === d.id && <Check size={16} className="text-primary" />}
                  </div>
                  <span className="card-btn-desc">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Arithmetic Operations (Multi-select) */}
          <div className="setup-section">
            <div className="section-label-with-hint">
              <label className="setup-section-label">3. Arithmetic Operations</label>
              <span className="setup-hint">Select one or more</span>
            </div>
            <div className="setup-operations-grid">
              {OPERATION_LIST.map((op) => {
                const isSelected = operations.includes(op.id);
                return (
                  <button
                    key={op.id}
                    type="button"
                    className={`setup-op-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => handleToggleOperation(op.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="setup-op-symbol">{op.symbol}</span>
                    <span className="setup-op-name">{op.label}</span>
                    <div className="setup-op-check">
                      {isSelected ? <Check size={14} /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Number Range & Question Count */}
          <div className="setup-row-split">
            {/* Number Range */}
            <div className="setup-section split-col">
              <label className="setup-section-label">4. Number Range</label>
              <div className="setup-pill-group vertical">
                {NUMBER_RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`setup-pill-btn text-left ${numberRange === r.id ? 'is-selected' : ''}`}
                    onClick={() => setNumberRange(r.id)}
                  >
                    <strong>{r.label}</strong>
                    <span className="pill-subtext">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="setup-section split-col">
              <label className="setup-section-label">5. Question Checkpoints</label>
              <div className="setup-pill-group vertical">
                {QUESTION_COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`setup-pill-btn ${questionCount === count ? 'is-selected' : ''}`}
                    onClick={() => setQuestionCount(count)}
                  >
                    <strong>{count} Checkpoints</strong>
                    <span className="pill-subtext">{count} questions total</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="setup-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              id="start-configured-race-btn"
            >
              <Play size={20} fill="currentColor" />
              <span>Launch Race Track</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
