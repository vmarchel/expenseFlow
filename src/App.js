import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import AddTransaction from './components/AddTransaction';
import { Alert, Box, FormControlLabel, IconButton, Snackbar, Switch, TextField, Typography } from '@mui/material'
import { sampleTransactions } from './data/sampleTransactions';
import { ToggleButtonGroup, ToggleButton, Menu, MenuItem  } from '@mui/material';
import { MoreVert } from '@mui/icons-material';


export default function App() {

  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('expenseTrackerData')
    return savedData ? JSON.parse(savedData) : sampleTransactions
  })

  useEffect( () => {
    localStorage.setItem('expenseTrackerData', JSON.stringify(data))
  },[data])

  const [globalSearchTerm, setGlobalSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const [editForm, setEditForm] = useState({
    name:'',
    amount:'',
    currency:'CZK',
    category:'',
    date:''
  })

  const [addForm, setAddForm] = useState({
    name: '',
    amount: '',
    currency: 'CZK',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  })

  const [dashboardFilter, setDashboardFilter] = useState('all')
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  })

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [notification, setNotification] = useState({open: false, message: '', severity: 'success'})

  function archiveOlderThan(months) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months)

    let archivedCount = 0;
    const updatedData = data.map((transaction) => {
      const transactionDate = new Date(transaction.date)
      if (transactionDate < cutoffDate && !transaction.archived) {
        archivedCount++;
        return { ...transaction, archived: true}
      }
      return transaction

    })
    setData(updatedData)
    setMenuAnchorEl(null)

    if (archivedCount === 0) {
      setNotification({
      open: true,
      message: `No transactions found older than ${months} months`,
      severity: 'info'
      })
    } else {
      setNotification({
      open: true,
      message: `${archivedCount} transactions archived`,
      severity: 'success'
    })
  }
}

  function unarchiveAll() {
    const updatedData = data.map((transaction) => ({
      ...transaction,
      archived: false
    }))
    setData(updatedData)
    setMenuAnchorEl(null)

    setNotification({
      open: true,
      message: 'All transactions unarchived',
      severity: 'success'
    })
  }

  const [currentTab, setCurrentTab] = useState( () => {
    const savedTab = localStorage.getItem('expenseTrackerCurrentTab')
    return savedTab || 'dashboard'
  })

    useEffect(() => {
    localStorage.setItem('expenseTrackerCurrentTab', currentTab)
  }, [currentTab])

  const [showArchived, setShowArchived] = useState(() => {
    const savedShowArchived = localStorage.getItem('expenseTrackerShowArchived')
    return savedShowArchived ? JSON.parse(savedShowArchived) : false
  })

  useEffect(() => {
  localStorage.setItem('expenseTrackerShowArchived', JSON.stringify(showArchived))
}, [showArchived])



  
let content;

if (currentTab === 'dashboard') {
  content = <Dashboard 
    data={data}
    dashboardFilter={dashboardFilter}
    setDashboardFilter={setDashboardFilter}
    customDateRange={customDateRange}
    setCustomDateRange={setCustomDateRange}
  />
}

else if (currentTab === 'history') {
  content = <TransactionHistory  
    data={data}
    setData={setData}
    searchTerm={globalSearchTerm}
    dashboardFilter={dashboardFilter}
    setDashboardFilter={setDashboardFilter}
    customDateRange={customDateRange}
    setCustomDateRange={setCustomDateRange}
    showArchived={showArchived}
    isModalOpen={isModalOpen}
    setIsModalOpen={setIsModalOpen}
    selectedTransaction={selectedTransaction}
    setSelectedTransaction={setSelectedTransaction}
    editForm={editForm}
    setEditForm={setEditForm}
  />
}
  
else if (currentTab === 'add') {
  content = <AddTransaction 
    addForm={addForm}
    setAddForm={setAddForm}
    data={data}
    setData={setData}
    setCurrentTab={setCurrentTab}
  />
}

  return(
<Box sx={{ 
  minHeight: '100vh',
  backgroundColor: '#f0fdf4'
}}>

<Box sx={{
  position: 'sticky',
  top: 0,
  backgroundColor: '#f0fdf4',
  zIndex: 100,
  paddingBottom: '4px'
}}>

  {currentTab === 'history' && (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '10px 20px',
      borderBottom: '1px solid #e0e0e0',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
    }}>
      <TextField 
        onChange={(event) => setGlobalSearchTerm(event.target.value)}
        value={globalSearchTerm}
        size='small' 
        label="Search transaction" 
        variant="outlined" 
        placeholder='Search transactions...' 
        sx={{ width: '300px' }}
        InputProps={{
          style: {
            borderRadius: '25px',
            backgroundColor: '#f5f5f5',
          }
        }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              size="small"
            />
          }
          label="Show archived"
        />
        
        <IconButton onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
          <MoreVert />
        </IconButton>
      </Box>
    </Box>
  )}


  {currentTab !== 'history' && (
    <Box sx={{ height: '61px' }} />
  )}

  <Box sx={{ textAlign: 'center', margin: '20px 0 10px 0' }}>
    <Typography variant="h4" component="h1">
      ExpenseFlow
    </Typography>
  </Box>


  <Box sx={{
    display:'flex', 
    gap:'20px', 
    m:'20px', 
    justifyContent:'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  }}>
    <ToggleButtonGroup
      value={currentTab}
      exclusive
      onChange={(event, newTab) => {
        if (newTab !== null) {
          setCurrentTab(newTab);
        }
      }}
      size="large"
      aria-label="navigation tabs"
      orientation='horizontal'
      sx={{
        '& .MuiToggleButton-root:first-of-type': {
          borderTopLeftRadius: '50px',
          borderBottomLeftRadius: '50px',
        },
        '& .MuiToggleButton-root:last-of-type': {
          borderTopRightRadius: '50px',
          borderBottomRightRadius: '50px',
        },
        '& .MuiToggleButton-root.Mui-selected': {
          backgroundColor: '#1976d2',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1565c0',
          }
        }
      }}
    >
      <ToggleButton value="dashboard">Dashboard</ToggleButton>
      <ToggleButton value="add">Add Transaction</ToggleButton>
      <ToggleButton value="history">Transaction History</ToggleButton>
    </ToggleButtonGroup>
  </Box>
</Box>


{content}

  <Menu
    anchorEl={menuAnchorEl}
    open={menuOpen}
    onClose={() => setMenuAnchorEl(null)}
  >
    <MenuItem onClick={() => archiveOlderThan(3)}>
      Archive transactions older than 3 months
    </MenuItem>
    <MenuItem onClick={() => archiveOlderThan(6)}>
      Archive transactions older than 6 months
    </MenuItem>
    <MenuItem onClick={() => archiveOlderThan(12)}>
      Archive transactions older than 1 year
    </MenuItem>
    <MenuItem onClick={unarchiveAll} sx={{ borderTop: '1px solid #e0e0e0', marginTop: 1, paddingTop: 1, color: 'red' }}>
      Reset archived transactions
    </MenuItem>
  </Menu>

  <Snackbar
    open={notification.open}
    autoHideDuration={4000}
    onClose={() => setNotification({ ...notification, open: false })}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    sx={{
      '& .MuiSnackbar-root': {
        top: '100px !important'
      }
    }}
  >
    <Alert 
      severity={notification.severity}
      sx={{
        backgroundColor: notification.severity === 'success' ? '#4caf50' : '#2196f3',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        minWidth: '300px',
        justifyContent: 'center'
      }}
    >
      {notification.message}
    </Alert>
  </Snackbar>

</Box>
  )
}