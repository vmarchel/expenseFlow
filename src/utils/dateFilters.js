export const getFilteredData = (data, dashboardFilter, customDateRange) => {
  const now = new Date();

  switch(dashboardFilter) {
    case 'thisMonth': 
      return data.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
      });

    case 'lastMonth':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return data.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === lastMonth.getMonth() &&
                transactionDate.getFullYear() === lastMonth.getFullYear();
      });

    case 'custom':
      if (customDateRange.start && customDateRange.end) {
        return data.filter(t => t.date >= customDateRange.start && t.date <= customDateRange.end);
      }
      return data;
      
    default:
      return data;
  }
};

export const formatDateForDisplay = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};