import { Box, IconButton, Typography, Chip } from '@mui/material';
import { getFilteredData, formatDateForDisplay } from '../utils/dateFilters';
import FilterControls from './FilterControls';
import EditTransactionModal from './EditTransactionModal';
import { formatAmountWithOriginalCurrency } from '../utils/currencyConverter';
import { useState } from 'react';
import { Sort } from '@mui/icons-material';

export default function TransactionHistory({ 
  data,
  setData,
  searchTerm,
  dashboardFilter,
  setDashboardFilter,
  customDateRange,
  setCustomDateRange,
  showArchived,
  isModalOpen,
  setIsModalOpen,
  selectedTransaction,
  setSelectedTransaction,
  editForm,
  setEditForm
}) {
  
  const dateFilteredData = getFilteredData(data, dashboardFilter, customDateRange);
  
  const visibleData = dateFilteredData.filter(transaction => showArchived ? true : !transaction.archived)
  const filteredTransactions = visibleData.filter((transaction) => {
    return transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  });

  const [sortOrder, setSortOrder]  = useState('newest')

  const groupedByDate = {};
  filteredTransactions.forEach((transaction) => {
    const date = transaction.date;
    if(!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(transaction);
  });

  const sortedDateGroups = Object.keys(groupedByDate)
    .sort((a,b) => {
      if (sortOrder === 'newest') {
        return new Date(b) - new Date(a)
      } else {
        return new Date(a) - new Date(b)
      }
    })
    .map(date => ({
      date: date,
      transactions: groupedByDate[date]
    }));

  return (

<Box sx={{
  display:'flex', 
  justifyContent:'center', 
  flexDirection:'column', 
  alignItems:'stretch', 
  maxWidth: '600px', 
  margin: '0 auto'
}}>

    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 3,
      marginBottom: 3,
      paddingBottom: 3,
    }}>
      <FilterControls 
        dashboardFilter={dashboardFilter}
        setDashboardFilter={setDashboardFilter}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
      />

      <IconButton 
        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        size="small"
        sx={{ 
          border: '1px solid #BAC4CD',
          borderRadius: '5px',
          height: '40px',
        }}
      >
        <Sort />
      </IconButton>
    </Box>



  {sortedDateGroups.length === 0 ?
  <p>No results found</p>
  :
  sortedDateGroups.map((dateGroup) => (
    <Box key={dateGroup.date}>
      <Typography variant="h6" sx={{ marginBottom: 1}}>
        {formatDateForDisplay(dateGroup.date)}
      </Typography>
      
      {dateGroup.transactions.map((newData) => (
        <Box 
          onClick={() => {
            setSelectedTransaction(newData)
            setIsModalOpen(true)
            setEditForm({ 
              name: newData.name,
              amount: newData.amount,
              currency: newData.currency || 'CZK',
              category: newData.category,
              date: newData.date
            })
          }}
          key={newData.id}
          sx={{
            border:'1px solid #e5e7eb',
            borderRadius:'8px', 
            boxShadow:'0 2px 4px rgba(0,0,0,0.1)',
            display:'flex', 
            justifyContent:'space-between', 
            alignItems:'center', 
            gap:'20px',
            padding:'10px',
            margin:'8px 0',
            cursor:'pointer',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor:'#ffffff',
            }
          }}
          >

  <Box sx={{ padding: '0 10px' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='body1' sx={{fontWeight: 'bold'}}>
        {newData.name}
      </Typography>
      {newData.archived && (
        <Chip label="ARCHIVED" size="small" color="default" />
      )}
    </Box>
    <Typography fontSize='small' sx={{color:'grey'}}>
      Category: {newData.category}
    </Typography>
  </Box>

  <Typography sx={{padding: '0 10px', fontWeight:'bold'}}>
    {formatAmountWithOriginalCurrency(newData.amount, newData.currency)}
  </Typography>
        </Box>
      ))}
    </Box>
  ))
}
  
  <EditTransactionModal 
    isModalOpen={isModalOpen}
    setIsModalOpen={setIsModalOpen}
    selectedTransaction={selectedTransaction}
    editForm={editForm}
    setEditForm={setEditForm}
    data={data}
    setData={setData}
  />

</Box>

);
}