import React from 'react';
import { Zap, Volume2, VolumeX, Trophy, HelpCircle, ArrowLeft } from 'lucide-react';

/**
 * Header Component
 * Persistent top bar with brand identity, personal best badge,
 * audio toggle, and navigation triggers.
 */
export const Header = ({
  personalBest = null,
  soundEnabled = true,
  onToggleSound,
  onOpenHowToPlay,
  gameState = 'home',
  onNavigateHome
}) => {
  return (
    <header className="app-header">
      <div className="header-inner container">
        {/* Logo / Brand */}
        <div className="header-brand-group">
          {gameState !== 'home' && (
            <button
              type="button"
              className="header-back-btn"
              onClick={onNavigateHome}
              aria-label="Return to home screen"
              title="Return to home"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div
            className="header-brand"
            onClick={gameState !== 'home' ? onNavigateHome : undefined}
            style={{ cursor: gameState !== 'home' ? 'pointer' : 'default' }}
          >
            <div className="brand-logo-icon">
              <Zap size={20} className="brand-bolt" />
            </div>
            <div className="brand-text-block">
              <h1 className="brand-title">Math Relay</h1>
              <span className="brand-pill">ARCADE RACE</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Personal Best Pill */}
          {personalBest && (
            <div className="header-pb-badge" title="Your highest recorded score">
              <Trophy size={16} className="text-amber" />
              <span className="pb-label">BEST:</span>
              <span className="pb-value">{personalBest.score} PTS</span>
            </div>
          )}

          {/* How to Play Trigger */}
          <button
            type="button"
            className="header-action-icon-btn"
            onClick={onOpenHowToPlay}
            aria-label="How to play instructions"
            title="How to Play"
          >
            <HelpCircle size={20} />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className={`header-action-icon-btn ${!soundEnabled ? 'is-muted' : ''}`}
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Sound On' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
