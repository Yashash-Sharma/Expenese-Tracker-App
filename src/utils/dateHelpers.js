/**
 * Formats a Date object or ISO date string to YYYY-MM-DD.
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateToISO(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the start and end date strings (YYYY-MM-DD) for the current month.
 * @returns {{start: string, end: string}}
 */
export function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  
  return {
    start: formatDateToISO(start),
    end: formatDateToISO(end)
  };
}

/**
 * Returns the start and end date strings (YYYY-MM-DD) for the current week (Mon-Sun).
 * @returns {{start: string, end: string}}
 */
export function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: formatDateToISO(monday),
    end: formatDateToISO(sunday)
  };
}

/**
 * Checks if a given date string is within a start and end range.
 * @param {string} dateStr - Date to check (YYYY-MM-DD)
 * @param {{start: string|null, end: string|null}} range 
 * @returns {boolean}
 */
export function isDateInRange(dateStr, range) {
  if (!range) return true;
  const { start, end } = range;
  
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const dateTime = d.getTime();
  
  if (start) {
    const s = new Date(start);
    s.setHours(0, 0, 0, 0);
    if (dateTime < s.getTime()) return false;
  }
  
  if (end) {
    const e = new Date(end);
    e.setHours(0, 0, 0, 0);
    if (dateTime > e.getTime()) return false;
  }
  
  return true;
}

/**
 * Formats a YYYY-MM-DD string to "DD MMM YYYY" (e.g. "07 Jul 2026").
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${month} ${year}`;
}
