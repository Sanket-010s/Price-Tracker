import { CURRENCY_SYMBOLS } from './constants';

export const formatPrice = (price, currency = 'USD') => {
  if (price === null || price === undefined) return 'N/A';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${price.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

export const calculatePercentageChange = (oldPrice, newPrice) => {
  if (!oldPrice || oldPrice === 0) return 0;
  return (((newPrice - oldPrice) / oldPrice) * 100).toFixed(1);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  
  // Append 'Z' to treat the FastAPI datetime as UTC to prevent timezone bugs
  const dateStrUTC = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
  const date = new Date(dateStrUTC);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};
