import React from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Modal, TextField, Typography } from '@mui/material';

export default function EditTransactionModal({ 
  isModalOpen,
  setIsModalOpen,
  selectedTransaction,
  editForm,
  setEditForm,
  data,
  setData
}) {

  function saveTransaction() {
    const updatedData = data.map((transaction) => {
      if (transaction.id === selectedTransaction.id) {
        return {
          ...transaction,
          name: editForm.name,
          amount: parseFloat(editForm.amount),
          currency: editForm.currency,
          category: editForm.category,
          date: editForm.date
        }
      }
      return transaction
    })
    setData(updatedData)
    setIsModalOpen(false)
  }

  function deleteTransaction() {
    const updatedData = data.filter((transaction) => 
      transaction.id !== selectedTransaction.id
    )
    setData(updatedData)
    setIsModalOpen(false)
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="edit-transaction-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>

        <Typography id="edit-transaction-title" variant="h6" component="h2">
          Edit Transaction
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              label='Title' 
              variant='outlined'
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              sx={{ flex: 1 }}
            />
            
            <TextField 
              label='Amount' 
              variant='outlined'
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
              sx={{ width: '150px' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ width: '150px' }}>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                value={editForm.currency}
                onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
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
              value={editForm.date}
              onChange={(e) => setEditForm({...editForm, date: e.target.value})}
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />

          </Box>

            <FormControl fullWidth>
              <InputLabel id="edit-category-label">Category</InputLabel>
              <Select
                labelId="edit-category-label"
                value={editForm.category}
                label="Category"
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={deleteTransaction}
            >
              Delete Transaction
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={saveTransaction} sx={{'&:hover': {
              backgroundColor: '#1565c0', 
          }}}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}