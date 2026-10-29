import React from 'react';
import { Play, HelpCircle, Trophy, Clock, Flame, BarChart3, Sparkles } from 'lucide-react';
import { Runner } from './Runner';

/**
 * WelcomeScreen Component
 * Energetic, modern arcade landing screen with runner artwork,
 * feature highlights, personal best record, and start CTAs.
 */
export const WelcomeScreen = ({
  personalBest = null,
  onStartRace,
  onOpenHowToPlay
}) => {
  return (
    <div className="welcome-screen-container">
      {/* Hero Section */}
      <section className="welcome-hero-card">
        {/* Decorative athletic lane lines in background */}
        <div className="hero-track-lines" aria-hidden="true">
          <div className="hero-lane-line lane-1" />
          <div className="hero-lane-line lane-2" />
          <div className="hero-lane-line lane-3" />
        </div>

        <div className="hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={14} className="text-secondary" />
            <span>ARITHMETIC SPEEDWAY</span>
          </div>

          <h2 className="hero-title">Math Relay</h2>
          
          <p className="hero-tagline">
            Think Fast. Solve Smart. Cross the Finish Line.
          </p>

          <p className="hero-description">
            Power your virtual sprinter by solving arithmetic questions. Each correct answer sprints you past checkpoints towards the checkered flag!
          </p>

          {/* CTA Button Group */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-lg btn-icon-pulse"
              onClick={onStartRace}
              id="start-race-btn"
            >
              <Play size={22} fill="currentColor" />
              <span>Start Race</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onOpenHowToPlay}
              id="how-to-play-btn"
            >
              <HelpCircle size={20} />
              <span>How to Play</span>
            </button>
          </div>

          {/* Personal Best Banner if present */}
          {personalBest && (
            <div className="hero-pb-card">
              <div className="hero-pb-icon-box">
                <Trophy size={22} className="text-amber" />
              </div>
              <div className="hero-pb-text">
                <span className="hero-pb-label">PERSONAL BEST RECORD</span>
                <span className="hero-pb-stat">
                  <strong>{personalBest.score} Points</strong>
                  {personalBest.accuracy ? ` (${personalBest.accuracy}% Accuracy)` : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hero Athletic Runner Illustration */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-stadium-platform">
            <div className="hero-runner-glow" />
            <div className="hero-runner-wrapper">
              <Runner state="running" className="hero-runner-character" />
            </div>
            <div className="hero-finish-banner">
              <div className="checkered-ribbon" />
              <span className="ribbon-text">FINISH 🏁</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="welcome-features-section" aria-label="Game Features">
        <div className="feature-card">
          <div className="feature-icon-box bg-primary-soft">
            <Clock size={24} className="text-primary" />
          </div>
          <h3 className="feature-title">Beat the Clock</h3>
          <p className="feature-description">
            Test your quick mental calculations under timed race pressure or switch to untimed practice mode.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box bg-amber-soft">
            <Flame size={24} className="text-amber" />
          </div>
          <h3 className="feature-title">Build Your Streak</h3>
          <p className="feature-description">
            Chain consecutive correct answers together to trigger streak multipliers and race into high gear.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box bg-secondary-soft">
            <BarChart3 size={24} className="text-secondary" />
          </div>
          <h3 className="feature-title">Track Your Progress</h3>
          <p className="feature-description">
            Inspect comprehensive post-race analytics with step-by-step answer reviews and accuracy metrics.
          </p>
        </div>
      </section>
    </div>
  );
};
