import { Box, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

export default function AddTransaction({ 
  addForm,
  setAddForm,
  data,
  setData,
  setCurrentTab
}) {

  function addTransaction(e) {
    e.preventDefault();

    const newId = data.length > 0 ? Math.max(...data.map(t => t.id)) + 1 : 1

    const newTransaction = {
      id: newId,
      name: addForm.name.trim(),
      amount: parseFloat(addForm.amount),
      currency: addForm.currency,
      category: addForm.category,
      date: addForm.date,
      archived: false
    }

    setData([...data, newTransaction])

    setAddForm({
      name: '',
      amount: '',
      currency: 'CZK',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    })

    setCurrentTab('history')
  }

  return (
<>
<Box component='form' onSubmit={addTransaction} sx={{ maxWidth: '500px', margin: '0 auto', padding: 3 }}>
  
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField 
        label='Transaction Name' 
        variant='outlined'
        value={addForm.name}
        onChange={(e) => setAddForm({...addForm, name: e.target.value})}
        placeholder="e.g. Groceries, Coffee, Gas"
        required
        sx={{ flex: 1 }}
      />
      
      <TextField 
        label='Amount' 
        variant='outlined'
        type="number"
        value={addForm.amount}
        onChange={(e) => setAddForm({...addForm, amount: e.target.value})}
        required
        inputProps={{min: 0.01, step: 0.01}}
        sx={{ width: '150px' }}
      />
    </Box>

    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControl sx={{ width: '150px' }}>
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          labelId="currency-label"
          value={addForm.currency}
          onChange={(e) => setAddForm({...addForm, currency: e.target.value})}
          label="Currency"
        >
          <MenuItem value="CZK">CZK</MenuItem>
          <MenuItem value="RON">RON</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
        </Select>
      </FormControl>

      <TextField 
        label='Date' 
        variant='outlined'  
        type="date"
        value={addForm.date}
        onChange={(e) => setAddForm({...addForm, date: e.target.value})}
        sx={{ flex: 1 }}
        InputLabelProps={{ shrink: true }}
      />
    </Box>

    <FormControl fullWidth>
      <InputLabel id="add-category-label">Category</InputLabel>
      <Select
        labelId="add-category-label"
        value={addForm.category}
        label="Category"
        onChange={(e) => setAddForm({...addForm, category: e.target.value})}
      >
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="transportation">Transportation</MenuItem>
            <MenuItem value="entertainment">Entertainment</MenuItem>
            <MenuItem value="shopping">Shopping</MenuItem>
            <MenuItem value="bills">Bills</MenuItem>
            <MenuItem value="household">Household</MenuItem>
            <MenuItem value="lifestyle">Lifestyle</MenuItem>
            <MenuItem value="health">Health</MenuItem>
            <MenuItem value="education">Education</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="pet">Pet</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
            <MenuItem value="gifts">Gifts</MenuItem>
            <MenuItem value="other">Other</MenuItem>
      </Select>
    </FormControl>

    <Button 
      type='submit'
      variant="contained" 
      color="primary" 
      size="large"
      sx={{ 
        marginTop: 2,
        '&:hover': {
          backgroundColor: '#1565c0', 
      }}}
    >
      Add Transaction
    </Button>
  </Box>
</Box>

</>
);
}