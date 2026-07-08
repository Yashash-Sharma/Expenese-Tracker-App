export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee (₹)' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar ($)' },
  EUR: { code: 'EUR', symbol: '€', locale: 'en-IE', name: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound (£)' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen (¥)' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar (C$)' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar (A$)' }
};

export const DEFAULT_CURRENCY = 'INR';

export function formatCurrency(amount, currencyCode = 'INR') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (e) {
    // Fallback if Intl fails
    return `${currency.symbol}${Number(amount).toFixed(2)}`;
  }
}

export function formatCurrencyCompact(amount, currencyCode = 'INR') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    // Fallback if Intl fails
    return `${currency.symbol}${Math.round(amount)}`;
  }
}
