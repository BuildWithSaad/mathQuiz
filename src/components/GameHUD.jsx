import React from 'react';
import { Timer, Flame, Award, HelpCircle } from 'lucide-react';
import { formatTime } from '../utils/scoring';

/**
 * GameHUD Component
 * Displays score, question progress, timer countdown or elapsed time,
 * and current correct answer streak.
 */
export const GameHUD = ({
  score = 0,
  currentQuestionIndex = 0,
  totalQuestions = 10,
  mode = 'timed',
  timeLeft = 60,
  elapsedTime = 0,
  streak = 0,
  scoreDelta = 0
}) => {
  const currentQNum = Math.min(totalQuestions, currentQuestionIndex + 1);
  const progressPercent = Math.round(((currentQuestionIndex) / totalQuestions) * 100);
  const isTimerUrgent = mode === 'timed' && timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="game-hud-container" aria-label="Game Heads-Up Display">
      {/* Top HUD Row */}
      <div className="game-hud-grid">
        {/* Score Card */}
        <div className="hud-metric-card score-card">
          <div className="hud-metric-icon score-icon-bg">
            <Award size={20} className="text-primary" />
          </div>
          <div className="hud-metric-content">
            <span className="hud-metric-label">SCORE</span>
            <div className="hud-metric-value-row">
              <span className="hud-metric-value">{score}</span>
              {scoreDelta > 0 && (
                <span className="hud-score-pop" key={score}>
                  +{scoreDelta}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Question Counter Card */}
        <div className="hud-metric-card question-counter-card">
          <div className="hud-metric-icon question-icon-bg">
            <HelpCircle size={20} className="text-secondary" />
          </div>
          <div className="hud-metric-content">
            <span className="hud-metric-label">QUESTION</span>
            <div className="hud-metric-value-row">
              <span className="hud-metric-value">
                {currentQNum}
                <span className="hud-metric-sub">/{totalQuestions}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Timer Card */}
        <div className={`hud-metric-card timer-card ${isTimerUrgent ? 'timer-urgent' : ''}`}>
          <div className={`hud-metric-icon ${isTimerUrgent ? 'timer-icon-urgent' : 'timer-icon-bg'}`}>
            <Timer size={20} className={isTimerUrgent ? 'timer-icon-pulse' : ''} />
          </div>
          <div className="hud-metric-content">
            <span className="hud-metric-label">
              {mode === 'timed' ? 'TIME REMAINING' : 'ELAPSED TIME'}
            </span>
            <div className="hud-metric-value-row">
              <span className={`hud-metric-value hud-mono ${isTimerUrgent ? 'text-urgent' : ''}`}>
                {mode === 'timed' ? formatTime(timeLeft) : formatTime(elapsedTime)}
              </span>
              {mode === 'timed' && timeLeft <= 10 && (
                <span className="timer-hurry-badge">FAST!</span>
              )}
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className={`hud-metric-card streak-card ${streak >= 3 ? 'streak-fire' : ''}`}>
          <div className="hud-metric-icon streak-icon-bg">
            <Flame size={20} className={streak >= 3 ? 'flame-animated' : ''} />
          </div>
          <div className="hud-metric-content">
            <span className="hud-metric-label">STREAK</span>
            <div className="hud-metric-value-row">
              <span className="hud-metric-value">
                {streak}
                {streak >= 3 && <span className="streak-emoji">🔥</span>}
              </span>
              {streak >= 5 && <span className="streak-bonus-badge">HOT!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="hud-progress-wrapper" aria-hidden="true">
        <div className="hud-progress-track">
          <div
            className="hud-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
