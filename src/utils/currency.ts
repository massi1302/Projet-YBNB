import { useTranslation } from 'react-i18next';

// Approximate EUR/USD exchange rate (you would want to use a real exchange rate API in production)
const EUR_RATE = 0.92;

export const useCurrency = () => {
  const { i18n } = useTranslation();
  
  const formatPrice = (priceUSD: number) => {
    if (i18n.language === 'fr') {
      const priceEUR = Math.round(priceUSD * EUR_RATE);
      return `${priceEUR} €`;
    }
    return `$${priceUSD}`;
  };

  return { formatPrice };
};