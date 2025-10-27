export const exchangeRates = {
  'CZK': 1,
  'EUR': 24.5,
  'USD': 22.8,  
  'RON': 5.2    
};

export const convertToCZK = (amount, currency) => {
  return amount * (exchangeRates[currency] || 1);
};

export const formatAmountWithOriginalCurrency = (amount, currency) => {
  if (currency === 'CZK') {
    return `${amount} CZK`;
  } else {
    const convertedAmount = convertToCZK(amount, currency);
    return `${convertedAmount.toFixed(0)} CZK (was ${amount} ${currency})`;
  }
};