import { Box, Card, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { getFilteredData } from '../utils/dateFilters';
import FilterControls from './FilterControls';
import { convertToCZK } from '../utils/currencyConverter';

export default function Dashboard({ 
  data, 
  dashboardFilter, 
  setDashboardFilter, 
  customDateRange, 
  setCustomDateRange 
}) {

  const dateFilteredData = getFilteredData(data, dashboardFilter, customDateRange);
  const filteredData = dateFilteredData.filter(transaction => !transaction.archived);
  
  const totalExpenses = filteredData.reduce((sum, transaction) => sum + convertToCZK(transaction.amount, transaction.currency), 0);
  const transactionCount = filteredData.length;

  const categoryTotals = {};
  filteredData.forEach(transaction => {
  const convertedAmount = convertToCZK(transaction.amount, transaction.currency);
  categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + convertedAmount;
});

  const pieChartData = Object.keys(categoryTotals).map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: categoryTotals[category]
  }));

  const monthlySpending = {};
  filteredData.forEach(transaction => {
  const date = new Date(transaction.date);
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const convertedAmount = convertToCZK(transaction.amount, transaction.currency);
  monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + convertedAmount;
});

const chartData = Object.keys(monthlySpending)
  .sort()
  .map(month => ({
    month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    amount: monthlySpending[month]
  }));

  return (
<Box sx={{ maxWidth: '600px', margin: '0 auto', padding: 3 }}>

  <FilterControls 
    dashboardFilter={dashboardFilter}
    setDashboardFilter={setDashboardFilter}
    customDateRange={customDateRange}
    setCustomDateRange={setCustomDateRange}
  />
  
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 4, marginTop: 4 }}>
    <Card sx={{ textAlign: 'center', padding: 3 }}>
      <Typography variant="h5" color="primary">
        {totalExpenses.toFixed(2)} CZK
      </Typography>
      <Typography variant="body2">
        Total Expenses
      </Typography>
    </Card>
    
    <Card sx={{ textAlign: 'center', padding: 3 }}>
      <Typography variant="h5" color="primary">
        {transactionCount}
      </Typography>
      <Typography variant="body2">
        Transactions
      </Typography>
    </Card> 
  </Box>

  <Card sx={{ padding: 3 }}>
    <Typography variant="h6" sx={{ marginBottom: 2 }}>
      Spending by Category
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => {
            const percentage = percent * 100;
            return percentage >= 2 ? `${name} ${percentage.toFixed(0)}%` : undefined;
          }}
          labelLine={false}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} CZK`, name]} />
      </PieChart>
    </ResponsiveContainer>
  </Card>

  <Card sx={{ padding: 3, marginTop: 3 }}>
    <Typography variant="h6" sx={{ marginBottom: 2 }}>
      Monthly Spending Trend
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value.toFixed(0)} CZK`, 'Spending']} />
        <Bar dataKey="amount" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
</Box>
  );
}