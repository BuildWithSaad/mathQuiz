import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sliders,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AnswerReview } from './AnswerReview';
import { formatDurationWords } from '../utils/scoring';

/**
 * ResultsScreen Component
 * Comprehensive post-race debrief with performance statistics,
 * celebration effects, personal best badges, and answer review.
 */
export const ResultsScreen = ({
  score = 0,
  maxScore = 100,
  correctCount = 0,
  incorrectCount = 0,
  unansweredCount = 0,
  answeredCount = 0,
  totalQuestions = 10,
  accuracy = 0,
  completionRate = 0,
  timeTaken = 0, // in seconds
  bestStreak = 0,
  isNewPersonalBest = false,
  raceOutcome = 'completed', // 'completed' | 'timeout' | 'practice_completed'
  reviewItems = [],
  onPlayAgain,
  onChangeSettings,
  onGoHome
}) => {
  // Fire celebratory confetti if completed or new personal best
  useEffect(() => {
    if (isNewPersonalBest || (raceOutcome === 'completed' && accuracy >= 70)) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [isNewPersonalBest, raceOutcome, accuracy]);

  const getHeadline = () => {
    if (raceOutcome === 'timeout') {
      return {
        title: "Time's Up!",
        subtitle: "The clock ran out, but every sprint makes you faster!",
        badge: "TIMED OUT",
        badgeClass: "badge-timeout"
      };
    }
    if (accuracy === 100) {
      return {
        title: "Flawless Victory! 🏆",
        subtitle: "Incredible speed and 100% accuracy! You conquered the track!",
        badge: "PERFECT RUN",
        badgeClass: "badge-perfect"
      };
    }
    return {
      title: "Race Complete! 🏁",
      subtitle: "You crossed the finish line! Here is how you performed.",
      badge: "COURSE FINISHED",
      badgeClass: "badge-completed"
    };
  };

  const headline = getHeadline();

  return (
    <div className="results-screen-container">
      {/* Top Banner Card */}
      <div className="results-hero-card">
        {isNewPersonalBest && (
          <div className="new-pb-alert animate-bounce-subtle">
            <Sparkles size={18} className="text-amber" />
            <span>NEW PERSONAL BEST RECORD!</span>
            <Sparkles size={18} className="text-amber" />
          </div>
        )}

        <div className="results-hero-content">
          <span className={`results-status-badge ${headline.badgeClass}`}>
            {headline.badge}
          </span>
          <h2 className="results-title">{headline.title}</h2>
          <p className="results-subtitle">{headline.subtitle}</p>
        </div>

        {/* Primary Score Ring / Badge */}
        <div className="results-score-display">
          <div className="score-main-box">
            <span className="score-label">FINAL SCORE</span>
            <div className="score-number-row">
              <span className="score-big font-mono">{score}</span>
              <span className="score-total font-mono">/ {maxScore}</span>
            </div>
            <span className="score-percentage-pill">
              {completionRate}% Course Completed
            </span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="results-actions-group">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onPlayAgain}
            id="play-again-btn"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onChangeSettings}
            id="change-settings-btn"
          >
            <Sliders size={20} />
            <span>Change Settings</span>
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={onGoHome}
            id="results-home-btn"
          >
            <Home size={20} />
            <span>Home</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="results-metrics-grid" aria-label="Race Statistics">
        {/* Accuracy */}
        <div className="metric-card">
          <div className="metric-icon-box bg-primary-soft">
            <Award size={22} className="text-primary" />
          </div>
          <div className="metric-text-group">
            <span className="metric-label">Accuracy</span>
            <span className="metric-value font-mono">{accuracy}%</span>
            <span className="metric-hint">Of answered questions</span>
          </div>
        </div>

        {/* Time Taken */}
        <div className="metric-card">
          <div className="metric-icon-box bg-secondary-soft">
            <Clock size={22} className="text-secondary" />
          </div>
          <div className="metric-text-group">
            <span className="metric-label">Time Taken</span>
            <span className="metric-value font-mono">{formatDurationWords(timeTaken)}</span>
            <span className="metric-hint">Sprint duration</span>
          </div>
        </div>

        {/* Best Streak */}
        <div className="metric-card">
          <div className="metric-icon-box bg-amber-soft">
            <Flame size={22} className="text-amber" />
          </div>
          <div className="metric-text-group">
            <span className="metric-label">Best Streak</span>
            <span className="metric-value font-mono">{bestStreak} 🔥</span>
            <span className="metric-hint">Consecutive correct</span>
          </div>
        </div>

        {/* Checkpoints Reached */}
        <div className="metric-card">
          <div className="metric-icon-box bg-success-soft">
            <CheckCircle2 size={22} className="text-success" />
          </div>
          <div className="metric-text-group">
            <span className="metric-label">Checkpoints</span>
            <span className="metric-value font-mono">{correctCount} / {totalQuestions}</span>
            <span className="metric-hint">Correct answers</span>
          </div>
        </div>
      </div>

      {/* Question Breakdown Stat Pills */}
      <div className="results-breakdown-row">
        <div className="breakdown-pill pill-correct">
          <CheckCircle2 size={16} />
          <span>{correctCount} Correct</span>
        </div>
        <div className="breakdown-pill pill-incorrect">
          <XCircle size={16} />
          <span>{incorrectCount} Incorrect</span>
        </div>
        {unansweredCount > 0 && (
          <div className="breakdown-pill pill-unanswered">
            <Clock size={16} />
            <span>{unansweredCount} Unanswered</span>
          </div>
        )}
      </div>

      {/* Itemized Question & Answer Review */}
      <AnswerReview reviewItems={reviewItems} />
    </div>
  );
};
