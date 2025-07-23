import React from 'react';
import { Box, TextField, Button, Autocomplete } from '@mui/material';
import { CLASS_OPTIONS, CLA_OPTIONS } from '../../Types/Rank.constants';

interface MembersFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterCla: string;
  setFilterCla: (value: string) => void;
}

export const MembersFilters: React.FC<MembersFiltersProps> = ({
  filter,
  setFilter,
  filterClass,
  setFilterClass,
  filterCla,
  setFilterCla,
}) => (
  <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
    <TextField
      label="Buscar por nome"
      variant="outlined"
      value={filter}
      onChange={e => setFilter(e.target.value)}
      size="small"
      sx={{
        minWidth: 180,
        background: '#23272f',
        borderRadius: 2,
        input: { color: '#fff', fontWeight: 500 },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
        '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
      }}
      InputLabelProps={{ sx: { color: '#1976d2' } }}
    />
    <Autocomplete
      options={["", ...CLASS_OPTIONS]}
      value={filterClass}
      onChange={(_, newValue) => setFilterClass(newValue || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Classe"
          variant="outlined"
          size="small"
          sx={{
            minWidth: 140,
            background: '#23272f',
            borderRadius: 2,
            input: { color: '#fff', fontWeight: 500 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
            '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
          }}
          InputLabelProps={{ sx: { color: '#1976d2' } }}
        />
      )}
      sx={{ minWidth: 140 }}
      disableClearable={false}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={option => option === '' ? 'Todas' : option}
      ListboxProps={{
        sx: {
          background: '#23272f',
          color: '#fff',
        },
      }}
    />
    <Autocomplete
      options={["", ...CLA_OPTIONS]}
      value={filterCla}
      onChange={(_, newValue) => setFilterCla(newValue || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Clã"
          variant="outlined"
          size="small"
          sx={{
            minWidth: 140,
            background: '#23272f',
            borderRadius: 2,
            input: { color: '#fff', fontWeight: 500 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1565c0' },
            '& .MuiInputBase-input::placeholder': { color: '#bbb', opacity: 1 },
          }}
          InputLabelProps={{ sx: { color: '#1976d2' } }}
        />
      )}
      sx={{ minWidth: 140 }}
      disableClearable={false}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={option => option === '' ? 'Todos' : option}
      ListboxProps={{
        sx: {
          background: '#23272f',
          color: '#fff',
        },
      }}
    />
    <Button
      variant="outlined"
      color="info"
      sx={{ minWidth: 120, height: 40 }}
      onClick={() => {
        setFilter('');
        setFilterClass('');
        setFilterCla('');
      }}
    >
      Limpar Filtros
    </Button>
  </Box>
);