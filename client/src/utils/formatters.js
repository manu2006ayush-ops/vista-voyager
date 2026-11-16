export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const categoryColors = {
  solo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  family: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  romantic: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  adventure: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  budget: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
