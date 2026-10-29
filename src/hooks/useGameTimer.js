import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * High-precision game timer hook
 * Handles both Timed Race (countdown from duration to 0)
 * and Practice Mode (count-up elapsed time).
 * Uses timestamp delta to prevent interval drift or sleep-state desync.
 */
export const useGameTimer = ({
  mode = 'timed', // 'timed' | 'practice'
  duration = 60, // in seconds (for timed mode)
  onTimeUp,
  onTick
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const endTimeRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastTickSecondRef = useRef(null);
  const hasTriggeredTimeUpRef = useRef(false);

  // Stop / clear interval safely
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Start timer from initial or current values
  const startTimer = useCallback(() => {
    stopTimer();
    const now = Date.now();
    startTimeRef.current = now;
    hasTriggeredTimeUpRef.current = false;

    if (mode === 'timed') {
      endTimeRef.current = now + duration * 1000;
      setTimeLeft(duration);
      lastTickSecondRef.current = duration;
    } else {
      setElapsedTime(0);
      lastTickSecondRef.current = 0;
    }

    setIsRunning(true);
  }, [mode, duration, stopTimer]);

  // Reset timer state cleanly
  const resetTimer = useCallback((newDuration = duration) => {
    stopTimer();
    setTimeLeft(newDuration);
    setElapsedTime(0);
    hasTriggeredTimeUpRef.current = false;
    startTimeRef.current = null;
    endTimeRef.current = null;
    lastTickSecondRef.current = null;
  }, [duration, stopTimer]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      const now = Date.now();

      if (mode === 'timed') {
        const remainingMs = Math.max(0, endTimeRef.current - now);
        const remainingSec = Math.ceil(remainingMs / 1000);

        setTimeLeft(remainingSec);

        // Sound callback on ticks, especially <= 5 seconds
        if (lastTickSecondRef.current !== remainingSec) {
          lastTickSecondRef.current = remainingSec;
          if (onTick) onTick(remainingSec);
        }

        if (remainingMs <= 0 && !hasTriggeredTimeUpRef.current) {
          hasTriggeredTimeUpRef.current = true;
          stopTimer();
          setTimeLeft(0);
          if (onTimeUp) onTimeUp();
        }
      } else {
        // Practice mode: track elapsed
        const elapsedSec = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(elapsedSec);
      }
    }, 150); // fast polling for snappy UI updates

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, mode, stopTimer, onTimeUp, onTick]);

  // Compute final elapsed time when stopped
  const getRecordedElapsedTime = useCallback(() => {
    if (!startTimeRef.current) return 0;
    const now = Date.now();
    if (mode === 'timed') {
      const totalPassed = Math.min(duration, Math.round((now - startTimeRef.current) / 1000));
      return totalPassed;
    }
    return Math.round((now - startTimeRef.current) / 1000);
  }, [mode, duration]);

  return {
    timeLeft,
    elapsedTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    getRecordedElapsedTime
  };
};
