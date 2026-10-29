import React from 'react';
import { Check, Flag } from 'lucide-react';

/**
 * Checkpoint Marker Component
 * Types: 'start' | 'number' | 'finish'
 * Status: 'reached' | 'current' | 'upcoming'
 */
export const Checkpoint = ({
  number,
  type = 'number',
  status = 'upcoming',
  isFinish = false
}) => {
  return (
    <div
      className={`track-checkpoint checkpoint-${type} checkpoint-${status} ${isFinish ? 'is-finish-line' : ''}`}
      aria-label={`${type === 'start' ? 'Start Line' : isFinish ? 'Finish Line' : `Checkpoint ${number}`}: ${status}`}
    >
      <div className="checkpoint-marker">
        {type === 'start' ? (
          <span className="checkpoint-label-badge">START</span>
        ) : isFinish ? (
          <div className="finish-flag-icon">
            <Flag size={14} className="finish-flag-svg" />
          </div>
        ) : status === 'reached' ? (
          <Check size={14} strokeWidth={3} className="checkpoint-check" />
        ) : (
          <span className="checkpoint-number">{number}</span>
        )}
      </div>

      <div className="checkpoint-sublabel">
        {type === 'start' ? 'START' : isFinish ? 'FINISH' : `CP ${number}`}
      </div>
    </div>
  );
};
