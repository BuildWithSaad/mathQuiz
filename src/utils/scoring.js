/**
 * Scoring and performance calculation utility functions
 */

export const POINTS_PER_CORRECT = 10;

/**
 * Calculate response accuracy for answered questions
 * @param {number} correct
 * @param {number} answered
 * @returns {number} percentage rounded to whole integer
 */
export const calculateAccuracy = (correct, answered) => {
  if (!answered || answered <= 0) return 0;
  return Math.round((correct / answered) * 100);
};

/**
 * Calculate race completion rate
 * @param {number} answered
 * @param {number} total
 * @returns {number} percentage rounded to whole integer
 */
export const calculateCompletionRate = (answered, total) => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((answered / total) * 100));
};

/**
 * Calculate maximum possible score for a race
 * @param {number} totalQuestions
 * @returns {number}
 */
export const calculateMaxScore = (totalQuestions) => {
  return totalQuestions * POINTS_PER_CORRECT;
};

/**
 * Format seconds into a friendly display: "0:45" or "1:15"
 * @param {number} seconds
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const safeSec = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSec / 60);
  const remSec = safeSec % 60;
  return `${mins}:${remSec < 10 ? '0' : ''}${remSec}`;
};

/**
 * Format seconds into words: "48 seconds" or "1 min 12 secs"
 * @param {number} seconds
 * @returns {string}
 */
export const formatDurationWords = (seconds) => {
  const safeSec = Math.max(0, Math.round(seconds));
  if (safeSec < 60) {
    return `${safeSec} second${safeSec === 1 ? '' : 's'}`;
  }
  const mins = Math.floor(safeSec / 60);
  const remSec = safeSec % 60;
  if (remSec === 0) {
    return `${mins} minute${mins === 1 ? '' : 's'}`;
  }
  return `${mins}m ${remSec}s`;
};
