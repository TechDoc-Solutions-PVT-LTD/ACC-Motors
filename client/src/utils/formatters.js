export const formatCurrency = (amount) => `Rs. ${amount?.toFixed(2) || '0.00'}`;
export const formatDate = (date) => new Date(date).toLocaleDateString('en-US');