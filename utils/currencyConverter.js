/**
 * Convert an amount from one currency to another using exchange rates
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code (e.g., 'EUR')
 * @param {string} toCurrency - Target currency code (e.g., 'USD')
 * @param {object} rates - Exchange rates object with USD as base
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
    if (!rates || !amount) return 0;

    // If same currency, no conversion needed
    if (fromCurrency === toCurrency) return amount;

    // If rates don't exist for currencies, return original amount
    if (!rates[fromCurrency] || !rates[toCurrency]) return amount;

    // Convert to USD first, then to target currency
    const amountInUSD = amount / rates[fromCurrency];
    const convertedAmount = amountInUSD * rates[toCurrency];

    return convertedAmount;
};

/**
 * Format currency amount with proper decimal places
 * @param {number} amount - Amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted amount
 */
export const formatCurrencyAmount = (amount, decimals = 2) => {
    return parseFloat(amount).toFixed(decimals);
};
