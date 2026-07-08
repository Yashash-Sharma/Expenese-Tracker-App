const STORAGE_KEY = "expense_tracker_data";

const storageService = {
  /**
   * Loads expenses from localStorage.
   * Handles parsing and returns an empty array on error or if no data exists.
   * @returns {Array}
   */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      console.warn("Storage data is not an array, resetting.");
      return [];
    } catch (e) {
      console.error("Failed to load expenses from storage:", e);
      return [];
    }
  },

  /**
   * Saves expenses to localStorage.
   * Returns true on success, false on failure (e.g. quota exceeded).
   * @param {Array} expenses 
   * @returns {boolean}
   */
  save(expenses) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      return true;
    } catch (e) {
      console.error("Failed to save expenses to storage:", e);
      return false;
    }
  }
};

export default storageService;
