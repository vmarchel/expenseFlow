import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';

export default function FilterControls({ 
  dashboardFilter, 
  setDashboardFilter, 
  customDateRange, 
  setCustomDateRange 
}) {
  return (
    <Box sx={{ display:'flex', gap: 2}}>
      <FormControl sx={{ minWidth: 100}} size="small">
        <InputLabel>Time Period</InputLabel>
        <Select
          value={dashboardFilter}
          label="Time Period"
          onChange={(e) => setDashboardFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="thisMonth">This Month</MenuItem>
          <MenuItem value="lastMonth">Last Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </FormControl>
      
      {dashboardFilter === 'custom' && (
        <Box sx={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
          <TextField
            type="date"
            label="Start Date"
            value={customDateRange.start}
            onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Typography variant="body2">to</Typography>
          <TextField
            type="date"
            label="End Date"
            value={customDateRange.end}
            onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}