import React, { useRef, useEffect } from 'react';
import { Runner } from './Runner';
import { Checkpoint } from './Checkpoint';

/**
 * RaceTrack Component
 * Horizontal athletic running track with lane markings, numbered checkpoints,
 * finish line ribbon/gate, and smoothly transitioning animated virtual runner.
 */
export const RaceTrack = ({
  totalCheckpoints = 10,
  currentPosition = 0, // 0 = start line, 1..N = checkpoint reached
  runnerState = 'idle' // 'idle' | 'running' | 'stumble' | 'celebrate'
}) => {
  const trackRef = useRef(null);
  const runnerContainerRef = useRef(null);

  // Calculate runner progress percentage: 0% at start, 100% at finish
  const progressPercent = totalCheckpoints > 0
    ? Math.min(100, Math.max(0, (currentPosition / totalCheckpoints) * 100))
    : 0;

  // Auto-scroll track into view on mobile screens if runner advances
  useEffect(() => {
    if (trackRef.current && runnerContainerRef.current) {
      const track = trackRef.current;
      const runner = runnerContainerRef.current;
      const runnerRect = runner.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();

      // If runner is outside visible track container, scroll smoothly
      if (runnerRect.right > trackRect.right - 40 || runnerRect.left < trackRect.left + 40) {
        track.scrollTo({
          left: (track.scrollWidth * (progressPercent / 100)) - (track.clientWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [currentPosition, progressPercent]);

  return (
    <div className="race-track-section" aria-label="Race Track">
      <div className="track-header-bar">
        <div className="track-title-wrapper">
          <span className="track-badge">STADIUM TRACK</span>
          <span className="track-subtitle">
            Checkpoint {currentPosition} of {totalCheckpoints}
          </span>
        </div>
        <div className="track-distance-pill">
          {Math.round(progressPercent)}% to Finish
        </div>
      </div>

      <div className="race-track-viewport" ref={trackRef}>
        <div className="race-track-surface">
          {/* Turf borders top & bottom */}
          <div className="track-turf-border top" />
          
          {/* Lane Dashed Lines */}
          <div className="track-lane-line upper" />
          <div className="track-lane-line lower" />

          {/* Running progress fill strip */}
          <div
            className="track-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Runner Character Positioned Dynamically */}
          <div
            ref={runnerContainerRef}
            className="track-runner-anchor"
            style={{ left: `${progressPercent}%` }}
          >
            <Runner state={runnerState} />
            <div className="runner-distance-indicator">
              {currentPosition === totalCheckpoints
                ? '🏆 FINISHED!'
                : `CP ${currentPosition}`}
            </div>
          </div>

          {/* Checkpoints Sequence */}
          <div className="track-checkpoints-row">
            {/* Start Line */}
            <Checkpoint
              number={0}
              type="start"
              status={currentPosition > 0 ? 'reached' : 'current'}
            />

            {/* Intermediate Checkpoints 1 to totalCheckpoints - 1 */}
            {Array.from({ length: totalCheckpoints - 1 }, (_, i) => {
              const cpNum = i + 1;
              let status = 'upcoming';
              if (cpNum < currentPosition) status = 'reached';
              else if (cpNum === currentPosition) status = 'current';

              return (
                <Checkpoint
                  key={`cp-${cpNum}`}
                  number={cpNum}
                  type="number"
                  status={status}
                />
              );
            })}

            {/* Finish Line (Final Checkpoint) */}
            <Checkpoint
              number={totalCheckpoints}
              type="finish"
              status={currentPosition >= totalCheckpoints ? 'reached' : 'upcoming'}
              isFinish={true}
            />
          </div>

          <div className="track-turf-border bottom" />
        </div>
      </div>
    </div>
  );
};
