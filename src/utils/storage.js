// Storage utilities with safe fallback for private browsing / blocked localStorage
const KEYS = {
  PERSONAL_BEST: 'math_relay_personal_best',
  SOUND_ENABLED: 'math_relay_sound_enabled',
  SAVED_SETTINGS: 'math_relay_saved_settings',
  HISTORY: 'math_relay_race_history'
};

const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const getPersonalBest = () => {
  if (!isStorageAvailable()) return null;
  try {
    const item = window.localStorage.getItem(KEYS.PERSONAL_BEST);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (typeof parsed === 'number') return { score: parsed, accuracy: 100, date: null };
    return parsed;
  } catch (e) {
    console.warn('Failed to read personal best from storage', e);
    return null;
  }
};

export const savePersonalBest = (score, accuracy, details = {}) => {
  if (!isStorageAvailable()) return false;
  try {
    const current = getPersonalBest();
    // Update if score is higher, or if equal score with higher accuracy
    const isBetter = !current || 
      score > current.score || 
      (score === current.score && accuracy > (current.accuracy || 0));

    if (isBetter) {
      const record = {
        score,
        accuracy,
        date: new Date().toISOString(),
        difficulty: details.difficulty,
        totalQuestions: details.totalQuestions,
        mode: details.mode
      };
      window.localStorage.setItem(KEYS.PERSONAL_BEST, JSON.stringify(record));
      return true; // Indicates new record set
    }
    return false;
  } catch (e) {
    console.warn('Failed to save personal best to storage', e);
    return false;
  }
};

export const getSoundPreference = () => {
  if (!isStorageAvailable()) return true;
  try {
    const val = window.localStorage.getItem(KEYS.SOUND_ENABLED);
    return val !== null ? JSON.parse(val) : true;
  } catch (e) {
    return true;
  }
};

export const saveSoundPreference = (enabled) => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEYS.SOUND_ENABLED, JSON.stringify(Boolean(enabled)));
  } catch (e) {
    console.warn('Failed to save sound preference', e);
  }
};

export const getSavedSettings = () => {
  if (!isStorageAvailable()) return null;
  try {
    const item = window.localStorage.getItem(KEYS.SAVED_SETTINGS);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const saveSettings = (settings) => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEYS.SAVED_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
};
